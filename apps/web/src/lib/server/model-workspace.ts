import {
	generatedVariant,
	generationJob,
	guestSession,
	project,
	roomBrief,
	sourcePhoto,
} from '@upmodel/db/schema'
import { and, asc, desc, eq, inArray } from 'drizzle-orm'
import { getDb } from './db'
import { getGuestTrialStatus } from './guest-trial'
import { renderMockRemodelSvg } from './mock-remodel'
import {
	buildGeneratedVariantStorageKey,
	buildSourcePhotoStorageKey,
	buildStoredMediaUrl,
	uploadStoredObject,
} from './storage'

function normalizeRequiredText(value: FormDataEntryValue | null, maxLength: number) {
	if (typeof value !== 'string') {
		return null
	}

	const normalized = value.trim().slice(0, maxLength)

	return normalized.length > 0 ? normalized : null
}

function normalizeOptionalText(value: FormDataEntryValue | null, maxLength: number) {
	if (typeof value !== 'string') {
		return null
	}

	const normalized = value.trim().slice(0, maxLength)

	return normalized.length > 0 ? normalized : null
}

export function createProjectSlug(title: string) {
	const base = title
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 54)

	const fallback = base || 'project'
	const suffix = crypto.randomUUID().slice(0, 6)

	return `${fallback}-${suffix}`
}

function buildDraftRoomBrief(input: {
	title: string
	roomType: string | null
	remodelIntent: string | null
	styleDirection: string | null
	originalFilename: string
}) {
	const summaryParts = [
		input.styleDirection ? `${input.styleDirection} remodel` : 'Remodel concept',
		input.roomType ? `for the ${input.roomType.replaceAll('_', ' ')}` : null,
		input.remodelIntent ? `focused on ${input.remodelIntent}` : null,
	].filter(Boolean)

	return {
		summary: `${summaryParts.join(' ')}.`.replace(/\s+\./g, '.'),
		structuredData: {
			roomType: input.roomType,
			styleDirection: input.styleDirection,
			remodelIntent: input.remodelIntent,
			preservedElements: [
				'Keep the general room footprint plausible',
				'Preserve major openings and windows',
			],
			realismGuidance: [
				'Avoid fantasy proportions or impossible structural edits',
				'Favor remodel-ready material and lighting choices',
			],
			sourcePhotoLabel: input.originalFilename,
		},
		provenance: {
			roomType: input.roomType ? 'user' : 'system',
			styleDirection: input.styleDirection ? 'user' : 'system',
			remodelIntent: input.remodelIntent ? 'user' : 'system',
		},
	}
}

export async function ensureGuestSessionRecord(cookieToken: string) {
	const db = getDb()
	const [existing] = await db
		.select()
		.from(guestSession)
		.where(eq(guestSession.cookieToken, cookieToken))
		.limit(1)

	if (existing) {
		const updatedAt = new Date()

		await db
			.update(guestSession)
			.set({
				lastActiveAt: updatedAt,
				updatedAt,
			})
			.where(eq(guestSession.id, existing.id))

		return {
			...existing,
			lastActiveAt: updatedAt,
			updatedAt,
		}
	}

	const record = {
		id: crypto.randomUUID(),
		cookieToken,
		guestLabel: `Guest ${cookieToken.slice(0, 6)}`,
		freeGenerationConsumed: false,
		lastActiveAt: new Date(),
		createdAt: new Date(),
		updatedAt: new Date(),
	}

	await db.insert(guestSession).values(record)

	return record
}

export async function loadGuestWorkspace(cookieToken: string) {
	const db = getDb()
	const guestRecord = await ensureGuestSessionRecord(cookieToken)
	const projects = await db
		.select()
		.from(project)
		.where(eq(project.guestSessionId, guestRecord.id))
		.orderBy(desc(project.updatedAt))

	const projectIds = projects.map((entry) => entry.id)
	const photos = projectIds.length
		? await db
				.select()
				.from(sourcePhoto)
				.where(inArray(sourcePhoto.projectId, projectIds))
				.orderBy(desc(sourcePhoto.createdAt))
		: []
	const jobs = projectIds.length
		? await db
				.select()
				.from(generationJob)
				.where(inArray(generationJob.projectId, projectIds))
				.orderBy(desc(generationJob.createdAt))
		: []
	const variants = jobs.length
		? await db
				.select()
				.from(generatedVariant)
				.where(
					inArray(
						generatedVariant.jobId,
						jobs.map((job) => job.id)
					)
				)
				.orderBy(desc(generatedVariant.createdAt))
		: []

	return {
		guestSession: guestRecord,
		projects: projects.map((entry) => {
			const heroPhoto = photos.find((photo) => photo.projectId === entry.id)
			const latestJob = jobs.find((job) => job.projectId === entry.id)
			const latestVariant = latestJob
				? variants.find((variant) => variant.jobId === latestJob.id)
				: null

			return {
				...entry,
				heroPhotoUrl: heroPhoto?.url ?? null,
				lastVariantUrl: latestVariant?.url ?? null,
				hasComplimentaryResult: Boolean(latestVariant),
			}
		}),
		trialStatus: getGuestTrialStatus(guestRecord.freeGenerationConsumed ? 1 : 0),
	}
}

export async function createGuestProject(options: {
	cookieToken: string
	formData: FormData
	file: File
}) {
	const db = getDb()
	const guestRecord = await ensureGuestSessionRecord(options.cookieToken)

	if (guestRecord.freeGenerationConsumed) {
		return {
			error:
				'Your complimentary concept is already used. Sign up and buy credits to start another project.',
			slug: null,
		} as const
	}

	const title = normalizeRequiredText(options.formData.get('title'), 140)

	if (!title) {
		return {
			error: 'Give this remodel a short project title so you can find it later.',
			slug: null,
		} as const
	}

	const roomType = normalizeOptionalText(options.formData.get('roomType'), 80)
	const remodelIntent = normalizeOptionalText(options.formData.get('remodelIntent'), 160)
	const styleDirection = normalizeOptionalText(options.formData.get('styleDirection'), 120)
	const slug = createProjectSlug(title)
	const projectId = crypto.randomUUID()
	const sourcePhotoId = crypto.randomUUID()
	const roomBriefId = crypto.randomUUID()
	const storageKey = buildSourcePhotoStorageKey(slug, options.file.name)
	const sourcePhotoUrl = buildStoredMediaUrl(storageKey)
	const body = new Uint8Array(await options.file.arrayBuffer())
	const roomBriefDraft = buildDraftRoomBrief({
		title,
		roomType,
		remodelIntent,
		styleDirection,
		originalFilename: options.file.name,
	})

	await uploadStoredObject({
		body,
		contentType: options.file.type,
		storageKey,
		cacheControl: 'private, max-age=3600',
	})

	await db.transaction(async (tx) => {
		const now = new Date()

		await tx.insert(project).values({
			id: projectId,
			guestSessionId: guestRecord.id,
			slug,
			title,
			roomType,
			remodelIntent,
			styleDirection,
			summary: roomBriefDraft.summary,
			status: 'draft',
			createdAt: now,
			updatedAt: now,
		})

		await tx.insert(sourcePhoto).values({
			id: sourcePhotoId,
			projectId,
			guestSessionId: guestRecord.id,
			storageKey,
			url: sourcePhotoUrl,
			originalFilename: options.file.name.slice(0, 180),
			mimeType: options.file.type,
			fileSizeBytes: options.file.size,
			createdAt: now,
		})

		await tx.insert(roomBrief).values({
			id: roomBriefId,
			projectId,
			sourcePhotoId,
			status: 'draft',
			summary: roomBriefDraft.summary,
			structuredData: roomBriefDraft.structuredData,
			provenance: roomBriefDraft.provenance,
			createdAt: now,
			updatedAt: now,
		})
	})

	return {
		error: null,
		slug,
	} as const
}

export async function loadGuestProject(slug: string, cookieToken: string) {
	const db = getDb()
	const guestRecord = await ensureGuestSessionRecord(cookieToken)
	const [projectRecord] = await db
		.select()
		.from(project)
		.where(and(eq(project.slug, slug), eq(project.guestSessionId, guestRecord.id)))
		.limit(1)

	if (!projectRecord) {
		return null
	}

	const [photoRecord] = await db
		.select()
		.from(sourcePhoto)
		.where(eq(sourcePhoto.projectId, projectRecord.id))
		.orderBy(desc(sourcePhoto.createdAt))
		.limit(1)
	const [briefRecord] = await db
		.select()
		.from(roomBrief)
		.where(eq(roomBrief.projectId, projectRecord.id))
		.orderBy(desc(roomBrief.updatedAt))
		.limit(1)
	const jobs = await db
		.select()
		.from(generationJob)
		.where(eq(generationJob.projectId, projectRecord.id))
		.orderBy(desc(generationJob.createdAt))
	const variants = jobs.length
		? await db
				.select()
				.from(generatedVariant)
				.where(
					inArray(
						generatedVariant.jobId,
						jobs.map((job) => job.id)
					)
				)
				.orderBy(asc(generatedVariant.createdAt))
		: []

	return {
		guestSession: guestRecord,
		project: projectRecord,
		roomBrief: briefRecord,
		sourcePhoto: photoRecord,
		trialStatus: getGuestTrialStatus(guestRecord.freeGenerationConsumed ? 1 : 0),
		jobs: jobs.map((job) => ({
			...job,
			variants: variants.filter((variant) => variant.jobId === job.id),
		})),
	}
}

export async function createComplimentaryConcept(options: { slug: string; cookieToken: string }) {
	const db = getDb()
	const projectState = await loadGuestProject(options.slug, options.cookieToken)

	if (!projectState) {
		return {
			error: 'Project not found.',
			requiresCheckout: false,
		} as const
	}

	if (projectState.guestSession.freeGenerationConsumed) {
		return {
			error: 'Your free concept is already used. Sign up and buy credits to continue.',
			requiresCheckout: true,
		} as const
	}

	if (!projectState.sourcePhoto || !projectState.roomBrief) {
		return {
			error: 'Add a source photo before generating your complimentary concept.',
			requiresCheckout: false,
		} as const
	}

	const existingComplimentaryJob = projectState.jobs.find((job) => job.isComplimentary)

	if (existingComplimentaryJob) {
		return {
			error: 'Your complimentary concept is already ready below.',
			requiresCheckout: true,
		} as const
	}

	const now = new Date()
	const jobId = crypto.randomUUID()
	const prompt = [
		projectState.project.roomType ? `Room type: ${projectState.project.roomType}` : null,
		projectState.project.styleDirection ? `Style: ${projectState.project.styleDirection}` : null,
		projectState.project.remodelIntent ? `Intent: ${projectState.project.remodelIntent}` : null,
	]
		.filter(Boolean)
		.join(' | ')
	const svg = renderMockRemodelSvg({
		title: projectState.project.title,
		roomType: projectState.project.roomType,
		styleDirection: projectState.project.styleDirection,
		remodelIntent: projectState.project.remodelIntent,
	})
	const storageKey = buildGeneratedVariantStorageKey(
		projectState.project.slug,
		jobId,
		'image/svg+xml'
	)

	await uploadStoredObject({
		body: new TextEncoder().encode(svg),
		contentType: 'image/svg+xml',
		storageKey,
		cacheControl: 'private, max-age=3600',
	})

	await db.transaction(async (tx) => {
		await tx.insert(generationJob).values({
			id: jobId,
			projectId: projectState.project.id,
			roomBriefId: projectState.roomBrief.id,
			status: 'succeeded',
			provider: 'upmodel-mock-preview',
			model: 'deterministic-svg-preview',
			prompt,
			requestedCount: 1,
			creditCost: 0,
			isComplimentary: true,
			requestMetadata: {
				mode: 'complimentary_guest_preview',
			},
			responseMetadata: {
				storedMimeType: 'image/svg+xml',
			},
			startedAt: now,
			completedAt: now,
			createdAt: now,
		})

		await tx.insert(generatedVariant).values({
			id: crypto.randomUUID(),
			jobId,
			storageKey,
			url: buildStoredMediaUrl(storageKey),
			mimeType: 'image/svg+xml',
			promptExcerpt: prompt.slice(0, 240),
			width: 1280,
			height: 960,
			isHero: true,
			createdAt: now,
		})

		await tx
			.update(guestSession)
			.set({
				freeGenerationConsumed: true,
				lastActiveAt: now,
				updatedAt: now,
			})
			.where(eq(guestSession.id, projectState.guestSession.id))

		await tx
			.update(project)
			.set({
				status: 'active',
				updatedAt: now,
			})
			.where(eq(project.id, projectState.project.id))
	})

	return {
		error: null,
		requiresCheckout: false,
	} as const
}

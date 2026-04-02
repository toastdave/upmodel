import { getDb } from '$lib/server/db'
import { getStoredObject } from '$lib/server/storage'
import { error } from '@sveltejs/kit'
import {
	generatedVariant,
	generationJob,
	guestSession,
	project,
	sourcePhoto,
} from '@upmodel/db/schema'
import { and, eq } from 'drizzle-orm'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async ({ locals, params, url }) => {
	if (!params.key) {
		throw error(404, 'Asset not found')
	}

	const db = getDb()
	const download = url.searchParams.get('download') === '1'
	const [sourceMedia] = await db
		.select({
			mimeType: sourcePhoto.mimeType,
			originalFilename: sourcePhoto.originalFilename,
			storageKey: sourcePhoto.storageKey,
		})
		.from(sourcePhoto)
		.innerJoin(project, eq(project.id, sourcePhoto.projectId))
		.innerJoin(guestSession, eq(guestSession.id, project.guestSessionId))
		.where(
			and(eq(sourcePhoto.storageKey, params.key), eq(guestSession.cookieToken, locals.guestId))
		)
		.limit(1)

	const [generatedMedia] = sourceMedia
		? [null]
		: await db
				.select({
					mimeType: generatedVariant.mimeType,
					originalFilename: project.title,
					storageKey: generatedVariant.storageKey,
				})
				.from(generatedVariant)
				.innerJoin(generationJob, eq(generationJob.id, generatedVariant.jobId))
				.innerJoin(project, eq(project.id, generationJob.projectId))
				.innerJoin(guestSession, eq(guestSession.id, project.guestSessionId))
				.where(
					and(
						eq(generatedVariant.storageKey, params.key),
						eq(guestSession.cookieToken, locals.guestId)
					)
				)
				.limit(1)

	const asset = sourceMedia ?? generatedMedia

	if (!asset) {
		throw error(404, 'Asset not found')
	}

	const object = await getStoredObject(asset.storageKey)

	if (!object.Body) {
		throw error(404, 'Asset body not found')
	}

	return new Response(object.Body.transformToWebStream(), {
		headers: {
			'cache-control': 'private, max-age=60',
			'content-disposition': `${download ? 'attachment' : 'inline'}; filename="${asset.originalFilename ?? 'asset'}"`,
			'content-type': object.ContentType ?? asset.mimeType,
		},
	})
}

import { env } from '$env/dynamic/private'
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

const globalForStorage = globalThis as typeof globalThis & {
	__upmodelStorageClient?: S3Client
}

function createStorageClient() {
	if (!env.S3_ENDPOINT || !env.S3_ACCESS_KEY || !env.S3_SECRET_KEY) {
		throw new Error('S3_ENDPOINT, S3_ACCESS_KEY, and S3_SECRET_KEY are required for uploads')
	}

	return new S3Client({
		region: 'auto',
		endpoint: env.S3_ENDPOINT,
		forcePathStyle: true,
		credentials: {
			accessKeyId: env.S3_ACCESS_KEY,
			secretAccessKey: env.S3_SECRET_KEY,
		},
	})
}

function getStorageClient() {
	if (!globalForStorage.__upmodelStorageClient) {
		globalForStorage.__upmodelStorageClient = createStorageClient()
	}

	return globalForStorage.__upmodelStorageClient
}

function sanitizeStorageSegment(value: string) {
	return value
		.toLowerCase()
		.replace(/[^a-z0-9.-]+/g, '-')
		.replace(/^-+|-+$/g, '')
		.slice(0, 48)
}

function extensionFromMimeType(mimeType: string) {
	switch (mimeType) {
		case 'image/jpeg':
			return 'jpg'
		case 'image/webp':
			return 'webp'
		case 'image/svg+xml':
			return 'svg'
		default:
			return 'png'
	}
}

export function buildSourcePhotoStorageKey(projectSlug: string, originalFilename: string) {
	const extension = originalFilename.includes('.')
		? (originalFilename.split('.').pop()?.toLowerCase() ?? 'jpg')
		: 'jpg'
	const filename = sanitizeStorageSegment(originalFilename.replace(/\.[^.]+$/, '')) || 'room-photo'

	return `source-photos/${projectSlug}/${crypto.randomUUID()}-${filename}.${extension}`
}

export function buildGeneratedVariantStorageKey(
	projectSlug: string,
	jobId: string,
	mimeType: string
) {
	return `generated-variants/${projectSlug}/${jobId}.${extensionFromMimeType(mimeType)}`
}

export function buildStoredMediaUrl(storageKey: string) {
	return `/media/${storageKey}`
}

export async function uploadStoredObject(options: {
	body: Uint8Array
	contentType: string
	storageKey: string
	cacheControl?: string
}) {
	await getStorageClient().send(
		new PutObjectCommand({
			Bucket: env.S3_BUCKET,
			Key: options.storageKey,
			Body: options.body,
			ContentType: options.contentType,
			CacheControl: options.cacheControl,
		})
	)
}

export async function getStoredObject(storageKey: string) {
	return getStorageClient().send(
		new GetObjectCommand({
			Bucket: env.S3_BUCKET,
			Key: storageKey,
		})
	)
}

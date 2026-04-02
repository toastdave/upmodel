import {
	boolean,
	index,
	integer,
	jsonb,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
	uuid,
	varchar,
} from 'drizzle-orm/pg-core'

export const projectStatusEnum = pgEnum('project_status', ['draft', 'active', 'archived'])

export const roomBriefStatusEnum = pgEnum('room_brief_status', ['missing', 'draft', 'reviewed'])

export const jobStatusEnum = pgEnum('job_status', [
	'queued',
	'processing',
	'succeeded',
	'failed',
	'cancelled',
])

export const creditEntryTypeEnum = pgEnum('credit_entry_type', [
	'grant',
	'purchase',
	'generation',
	'adjustment',
	'refund',
])

export const user = pgTable('user', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: boolean('email_verified').notNull().default(false),
	image: text('image'),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const session = pgTable(
	'session',
	{
		id: text('id').primaryKey(),
		expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
		token: text('token').notNull().unique(),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
		updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
		ipAddress: text('ip_address'),
		userAgent: text('user_agent'),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
	},
	(table) => [uniqueIndex('session_token_idx').on(table.token)]
)

export const account = pgTable(
	'account',
	{
		id: text('id').primaryKey(),
		accountId: text('account_id').notNull(),
		providerId: text('provider_id').notNull(),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		accessToken: text('access_token'),
		refreshToken: text('refresh_token'),
		idToken: text('id_token'),
		accessTokenExpiresAt: timestamp('access_token_expires_at', { withTimezone: true }),
		refreshTokenExpiresAt: timestamp('refresh_token_expires_at', { withTimezone: true }),
		scope: text('scope'),
		password: text('password'),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
		updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
	},
	(table) => [
		index('account_user_idx').on(table.userId),
		uniqueIndex('account_provider_account_idx').on(table.providerId, table.accountId),
	]
)

export const verification = pgTable(
	'verification',
	{
		id: text('id').primaryKey(),
		identifier: text('identifier').notNull(),
		value: text('value').notNull(),
		expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
		updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
	},
	(table) => [uniqueIndex('verification_identifier_value_idx').on(table.identifier, table.value)]
)

export const guestSession = pgTable(
	'guest_session',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		cookieToken: varchar('cookie_token', { length: 120 }).notNull().unique(),
		guestLabel: varchar('guest_label', { length: 80 }).notNull(),
		freeGenerationConsumed: boolean('free_generation_consumed').notNull().default(false),
		convertedUserId: text('converted_user_id').references(() => user.id, { onDelete: 'set null' }),
		lastActiveAt: timestamp('last_active_at', { withTimezone: true }).notNull().defaultNow(),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
		updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
	},
	(table) => [index('guest_session_converted_user_idx').on(table.convertedUserId)]
)

export const project = pgTable(
	'project',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		ownerUserId: text('owner_user_id').references(() => user.id, { onDelete: 'cascade' }),
		guestSessionId: uuid('guest_session_id').references(() => guestSession.id, {
			onDelete: 'cascade',
		}),
		slug: varchar('slug', { length: 80 }).notNull().unique(),
		title: varchar('title', { length: 140 }).notNull(),
		roomType: varchar('room_type', { length: 80 }),
		remodelIntent: varchar('remodel_intent', { length: 160 }),
		styleDirection: varchar('style_direction', { length: 120 }),
		status: projectStatusEnum('status').notNull().default('draft'),
		summary: text('summary'),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
		updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
	},
	(table) => [
		index('project_owner_idx').on(table.ownerUserId),
		index('project_guest_idx').on(table.guestSessionId),
		index('project_status_idx').on(table.status),
	]
)

export const sourcePhoto = pgTable(
	'source_photo',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		projectId: uuid('project_id')
			.notNull()
			.references(() => project.id, { onDelete: 'cascade' }),
		ownerUserId: text('owner_user_id').references(() => user.id, { onDelete: 'cascade' }),
		guestSessionId: uuid('guest_session_id').references(() => guestSession.id, {
			onDelete: 'cascade',
		}),
		storageKey: text('storage_key').notNull().unique(),
		url: text('url').notNull(),
		originalFilename: varchar('original_filename', { length: 180 }),
		mimeType: varchar('mime_type', { length: 80 }).notNull(),
		fileSizeBytes: integer('file_size_bytes').notNull(),
		width: integer('width'),
		height: integer('height'),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
	},
	(table) => [
		index('source_photo_project_idx').on(table.projectId),
		index('source_photo_owner_idx').on(table.ownerUserId),
		index('source_photo_guest_idx').on(table.guestSessionId),
	]
)

export const roomBrief = pgTable(
	'room_brief',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		projectId: uuid('project_id')
			.notNull()
			.references(() => project.id, { onDelete: 'cascade' }),
		sourcePhotoId: uuid('source_photo_id')
			.notNull()
			.references(() => sourcePhoto.id, { onDelete: 'cascade' }),
		status: roomBriefStatusEnum('status').notNull().default('draft'),
		summary: text('summary'),
		structuredData: jsonb('structured_data').notNull().default({}),
		provenance: jsonb('provenance').notNull().default({}),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
		updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
	},
	(table) => [
		index('room_brief_project_idx').on(table.projectId),
		uniqueIndex('room_brief_source_photo_idx').on(table.sourcePhotoId),
	]
)

export const generationPreset = pgTable('generation_preset', {
	id: text('id').primaryKey(),
	slug: varchar('slug', { length: 64 }).notNull().unique(),
	name: varchar('name', { length: 120 }).notNull(),
	category: varchar('category', { length: 80 }).notNull(),
	promptTemplate: text('prompt_template').notNull(),
	defaultAspectRatio: varchar('default_aspect_ratio', { length: 16 }).notNull().default('4:3'),
	isFeatured: boolean('is_featured').notNull().default(true),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const generationJob = pgTable(
	'generation_job',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		projectId: uuid('project_id')
			.notNull()
			.references(() => project.id, { onDelete: 'cascade' }),
		roomBriefId: uuid('room_brief_id').references(() => roomBrief.id, { onDelete: 'set null' }),
		presetId: text('preset_id').references(() => generationPreset.id, { onDelete: 'set null' }),
		status: jobStatusEnum('status').notNull().default('queued'),
		provider: varchar('provider', { length: 80 }).notNull(),
		model: varchar('model', { length: 120 }).notNull(),
		prompt: text('prompt').notNull(),
		negativePrompt: text('negative_prompt'),
		requestedCount: integer('requested_count').notNull().default(1),
		creditCost: integer('credit_cost').notNull().default(0),
		isComplimentary: boolean('is_complimentary').notNull().default(false),
		requestMetadata: jsonb('request_metadata').notNull().default({}),
		responseMetadata: jsonb('response_metadata').notNull().default({}),
		errorMessage: text('error_message'),
		startedAt: timestamp('started_at', { withTimezone: true }),
		completedAt: timestamp('completed_at', { withTimezone: true }),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
	},
	(table) => [
		index('generation_job_project_idx').on(table.projectId),
		index('generation_job_status_idx').on(table.status),
	]
)

export const generatedVariant = pgTable(
	'generated_variant',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		jobId: uuid('job_id')
			.notNull()
			.references(() => generationJob.id, { onDelete: 'cascade' }),
		storageKey: text('storage_key').notNull().unique(),
		url: text('url').notNull(),
		mimeType: varchar('mime_type', { length: 80 }).notNull(),
		promptExcerpt: varchar('prompt_excerpt', { length: 240 }),
		width: integer('width'),
		height: integer('height'),
		isHero: boolean('is_hero').notNull().default(false),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
	},
	(table) => [index('generated_variant_job_idx').on(table.jobId)]
)

export const creditPack = pgTable('credit_pack', {
	id: text('id').primaryKey(),
	slug: varchar('slug', { length: 64 }).notNull().unique(),
	name: varchar('name', { length: 120 }).notNull(),
	credits: integer('credits').notNull(),
	priceCents: integer('price_cents').notNull(),
	description: text('description').notNull(),
	isFeatured: boolean('is_featured').notNull().default(false),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
})

export const creditLedgerEntry = pgTable(
	'credit_ledger_entry',
	{
		id: uuid('id').defaultRandom().primaryKey(),
		userId: text('user_id')
			.notNull()
			.references(() => user.id, { onDelete: 'cascade' }),
		projectId: uuid('project_id').references(() => project.id, { onDelete: 'set null' }),
		generationJobId: uuid('generation_job_id').references(() => generationJob.id, {
			onDelete: 'set null',
		}),
		entryType: creditEntryTypeEnum('entry_type').notNull(),
		creditsDelta: integer('credits_delta').notNull(),
		description: text('description').notNull(),
		externalReference: text('external_reference'),
		createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
	},
	(table) => [
		index('credit_ledger_user_idx').on(table.userId),
		index('credit_ledger_project_idx').on(table.projectId),
	]
)

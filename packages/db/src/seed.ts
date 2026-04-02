import { createDb } from './client'
import { creditPack, generationPreset } from './schema/index'

const db = createDb()

await db
	.insert(creditPack)
	.values([
		{
			id: 'starter',
			slug: 'starter',
			name: 'Starter Pack',
			credits: 18,
			priceCents: 1900,
			description: 'Best for one project with a few quick remodel iterations.',
			isFeatured: true,
		},
		{
			id: 'weekend',
			slug: 'weekend',
			name: 'Weekend Remodel Pack',
			credits: 48,
			priceCents: 4400,
			description: 'Useful for comparing multiple room directions before design decisions.',
		},
		{
			id: 'whole-home',
			slug: 'whole-home',
			name: 'Whole Home Pack',
			credits: 120,
			priceCents: 9900,
			description: 'For larger planning rounds across several rooms or elevations.',
		},
	])
	.onConflictDoNothing()

await db
	.insert(generationPreset)
	.values([
		{
			id: 'warm-modern-kitchen',
			slug: 'warm-modern-kitchen',
			name: 'Warm Modern Kitchen',
			category: 'kitchen',
			promptTemplate:
				'Remodel the kitchen with warm oak tones, stone counters, layered lighting, and realistic construction-ready detail.',
			defaultAspectRatio: '4:3',
		},
		{
			id: 'spa-bath-refresh',
			slug: 'spa-bath-refresh',
			name: 'Spa Bath Refresh',
			category: 'bathroom',
			promptTemplate:
				'Refresh the bathroom with calm spa materials, soft lighting, refined tile, and grounded remodel realism.',
			defaultAspectRatio: '4:3',
		},
		{
			id: 'curb-appeal-cleanup',
			slug: 'curb-appeal-cleanup',
			name: 'Curb Appeal Cleanup',
			category: 'exterior',
			promptTemplate:
				'Improve curb appeal with realistic landscaping cleanup, paint direction, lighting, and tasteful exterior upgrades.',
			defaultAspectRatio: '4:3',
		},
	])
	.onConflictDoNothing()

console.log('Seeded credit packs and generation presets')

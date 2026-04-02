export const guestTrialPolicy = {
	freeGenerations: 1,
	requiresPurchaseAfterTrial: true,
} as const

export const creditPackDefinitions = [
	{
		id: 'starter',
		slug: 'starter',
		name: 'Starter Pack',
		credits: 18,
		priceCents: 1900,
		description: 'Best for a fast follow-up after the complimentary guest concept.',
	},
	{
		id: 'weekend',
		slug: 'weekend',
		name: 'Weekend Remodel Pack',
		credits: 48,
		priceCents: 4400,
		description: 'Made for trying a handful of room directions across one project weekend.',
	},
	{
		id: 'whole-home',
		slug: 'whole-home',
		name: 'Whole Home Pack',
		credits: 120,
		priceCents: 9900,
		description:
			'A larger pack for multiple rooms, regeneration passes, and higher-confidence planning.',
	},
] as const

export function estimateGenerationCredits({ conceptCount }: { conceptCount: number }) {
	const safeConceptCount = Math.max(1, conceptCount)

	return 4 + (safeConceptCount - 1) * 3
}

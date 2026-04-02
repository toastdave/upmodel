import { describe, expect, it } from 'bun:test'
import { creditPackDefinitions, estimateGenerationCredits, guestTrialPolicy } from './pricing'

describe('pricing helpers', () => {
	it('keeps the guest allowance intentionally short', () => {
		expect(guestTrialPolicy.freeGenerations).toBe(1)
		expect(guestTrialPolicy.requiresPurchaseAfterTrial).toBe(true)
	})

	it('estimates more credits for additional concepts', () => {
		expect(estimateGenerationCredits({ conceptCount: 1 })).toBe(4)
		expect(estimateGenerationCredits({ conceptCount: 3 })).toBe(10)
		expect(creditPackDefinitions).toHaveLength(3)
	})
})

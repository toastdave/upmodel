import { describe, expect, it } from 'bun:test'
import { getGuestTrialStatus } from './guest-trial'

describe('getGuestTrialStatus', () => {
	it('allows one complimentary generation before checkout is required', () => {
		expect(getGuestTrialStatus(0)).toEqual({
			includedGenerations: 1,
			usedGenerations: 0,
			remainingGenerations: 1,
			canStartGeneration: true,
			requiresCheckout: false,
		})

		expect(getGuestTrialStatus(1)).toEqual({
			includedGenerations: 1,
			usedGenerations: 1,
			remainingGenerations: 0,
			canStartGeneration: false,
			requiresCheckout: true,
		})
	})
})

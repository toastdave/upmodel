export const INCLUDED_GUEST_GENERATIONS = 1

export type GuestTrialStatus = {
	includedGenerations: number
	usedGenerations: number
	remainingGenerations: number
	canStartGeneration: boolean
	requiresCheckout: boolean
}

export function getGuestTrialStatus(usedGenerations: number): GuestTrialStatus {
	const normalizedUsedGenerations = Math.max(0, Math.floor(usedGenerations))
	const remainingGenerations = Math.max(0, INCLUDED_GUEST_GENERATIONS - normalizedUsedGenerations)

	return {
		includedGenerations: INCLUDED_GUEST_GENERATIONS,
		usedGenerations: normalizedUsedGenerations,
		remainingGenerations,
		canStartGeneration: remainingGenerations > 0,
		requiresCheckout: remainingGenerations === 0,
	}
}

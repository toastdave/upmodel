import type { RequestEvent } from '@sveltejs/kit'

const guestCookieName = 'upmodel_guest'

export function ensureGuestSession(event: RequestEvent) {
	const existing = event.cookies.get(guestCookieName)

	if (existing) {
		return existing
	}

	const guestId = crypto.randomUUID()

	event.cookies.set(guestCookieName, guestId, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: event.url.protocol === 'https:',
		maxAge: 60 * 60 * 24 * 14,
	})

	return guestId
}

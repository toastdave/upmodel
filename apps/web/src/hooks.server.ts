import { ensureGuestSession } from '$lib/server/viewer-session'
import type { Handle } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {
	const guestId = ensureGuestSession(event)

	event.locals.guestId = guestId
	event.locals.user = null

	return resolve(event)
}

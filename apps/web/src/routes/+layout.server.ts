export function load({ locals }) {
	return {
		guestId: locals.guestId,
		user: locals.user,
	}
}

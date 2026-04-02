import { createComplimentaryConcept, loadGuestProject } from '$lib/server/model-workspace'
import { error, fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals, params }) => {
	const projectState = await loadGuestProject(params.slug, locals.guestId)

	if (!projectState) {
		throw error(404, 'Project not found')
	}

	return {
		projectState,
	}
}

export const actions: Actions = {
	runComplimentaryConcept: async ({ locals, params }) => {
		const result = await createComplimentaryConcept({
			cookieToken: locals.guestId,
			slug: params.slug,
		})

		if (result.requiresCheckout) {
			throw redirect(303, `/sign-in?redirectTo=/model/${params.slug}&intent=checkout`)
		}

		if (result.error) {
			return fail(400, {
				error: result.error,
				form: 'runComplimentaryConcept',
			})
		}

		return {
			message: 'Your complimentary remodel preview is ready below.',
		}
	},
}

import { createGuestProject, loadGuestWorkspace } from '$lib/server/model-workspace'
import { sourceUploadConstraints, validateSourceUpload } from '$lib/server/uploads'
import { fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
	const workspace = await loadGuestWorkspace(locals.guestId)

	return {
		sourceUploadConstraints,
		workspace,
	}
}

export const actions: Actions = {
	createProject: async ({ locals, request }) => {
		const formData = await request.formData()
		const fileEntry = formData.get('file')
		const file = fileEntry instanceof File ? fileEntry : null
		const validation = validateSourceUpload(file)

		if (validation.error || !file) {
			return fail(400, {
				error: validation.error,
				form: 'createProject',
			})
		}

		const result = await createGuestProject({
			cookieToken: locals.guestId,
			formData,
			file,
		})

		if (result.error || !result.slug) {
			return fail(400, {
				error: result.error,
				form: 'createProject',
			})
		}

		throw redirect(303, `/model/${result.slug}`)
	},
}

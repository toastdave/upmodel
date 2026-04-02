declare global {
	namespace App {
		interface Locals {
			guestId: string
			user: {
				id: string
				name: string | null
			} | null
		}
	}
}

export {}

import { createDb } from '@upmodel/db'

declare global {
	var __upmodelDb: ReturnType<typeof createDb> | undefined
}

export function getDb() {
	if (!globalThis.__upmodelDb) {
		globalThis.__upmodelDb = createDb()
	}

	return globalThis.__upmodelDb
}

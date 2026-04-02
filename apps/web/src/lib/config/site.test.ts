import { describe, expect, it } from 'bun:test'
import { siteConfig } from './site'

describe('siteConfig', () => {
	it('points the app shell at the model workspace', () => {
		expect(siteConfig.productRoute).toBe('/model')
		expect(siteConfig.name).toBe('Upmodel')
	})
})

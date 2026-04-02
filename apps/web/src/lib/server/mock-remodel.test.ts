import { describe, expect, it } from 'bun:test'
import { renderMockRemodelSvg } from './mock-remodel'

describe('renderMockRemodelSvg', () => {
	it('renders project details into a deterministic svg', () => {
		const svg = renderMockRemodelSvg({
			title: 'Kitchen refresh',
			roomType: 'kitchen',
			styleDirection: 'Warm modern',
			remodelIntent: 'Replace cabinets and brighten finishes',
		})

		expect(svg).toContain('Kitchen refresh')
		expect(svg).toContain('Warm modern')
		expect(svg).toContain('<svg')
	})
})

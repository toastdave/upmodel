function escapeXml(value: string) {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&apos;')
}

function trimLine(value: string, fallback: string) {
	const normalized = value.trim()

	return normalized.length > 0 ? normalized : fallback
}

export function renderMockRemodelSvg(input: {
	title: string
	roomType: string | null
	styleDirection: string | null
	remodelIntent: string | null
}) {
	const title = escapeXml(trimLine(input.title, 'Your project'))
	const roomType = escapeXml(trimLine(input.roomType ?? '', 'Room remodel'))
	const styleDirection = escapeXml(trimLine(input.styleDirection ?? '', 'Tailored style direction'))
	const remodelIntent = escapeXml(
		trimLine(input.remodelIntent ?? '', 'A plausible remodel concept would render here.')
	)

	return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 960" role="img" aria-label="Mock remodel preview for ${title}">
	<defs>
		<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
			<stop offset="0%" stop-color="#f8f1e4" />
			<stop offset="50%" stop-color="#efe3d1" />
			<stop offset="100%" stop-color="#d7e2d7" />
		</linearGradient>
		<linearGradient id="card" x1="0" y1="0" x2="1" y2="1">
			<stop offset="0%" stop-color="#214742" />
			<stop offset="100%" stop-color="#17312e" />
		</linearGradient>
	</defs>
	<rect width="1280" height="960" rx="48" fill="url(#bg)" />
	<circle cx="1060" cy="144" r="180" fill="#f5d8ac" fill-opacity="0.45" />
	<circle cx="182" cy="786" r="220" fill="#8ab39d" fill-opacity="0.18" />
	<rect x="92" y="92" width="1096" height="776" rx="40" fill="#fffaf2" fill-opacity="0.78" stroke="#1b3b37" stroke-opacity="0.08" />
	<rect x="154" y="160" width="972" height="450" rx="28" fill="url(#card)" />
	<rect x="214" y="226" width="264" height="278" rx="22" fill="#f7e2be" fill-opacity="0.95" />
	<rect x="516" y="226" width="548" height="132" rx="22" fill="#f6efe4" fill-opacity="0.96" />
	<rect x="516" y="388" width="548" height="116" rx="22" fill="#d7e3d4" fill-opacity="0.95" />
	<rect x="214" y="548" width="850" height="26" rx="13" fill="#d09c61" fill-opacity="0.85" />
	<text x="214" y="706" fill="#17312e" font-family="Fraunces, Georgia, serif" font-size="64" font-weight="600">${title}</text>
	<text x="214" y="764" fill="#42635d" font-family="Manrope, Arial, sans-serif" font-size="30">${roomType} • ${styleDirection}</text>
	<text x="214" y="824" fill="#506964" font-family="Manrope, Arial, sans-serif" font-size="28">${remodelIntent}</text>
	<text x="214" y="278" fill="#17312e" font-family="Manrope, Arial, sans-serif" font-size="28" font-weight="700">Complimentary preview</text>
	<text x="214" y="324" fill="#35524d" font-family="Manrope, Arial, sans-serif" font-size="24">Deterministic concept card</text>
	<text x="544" y="290" fill="#17312e" font-family="Manrope, Arial, sans-serif" font-size="26" font-weight="700">What this working flow proves</text>
	<text x="544" y="332" fill="#445c57" font-family="Manrope, Arial, sans-serif" font-size="22">Guest project creation</text>
	<text x="544" y="426" fill="#17312e" font-family="Manrope, Arial, sans-serif" font-size="26" font-weight="700">Next paid action</text>
	<text x="544" y="468" fill="#445c57" font-family="Manrope, Arial, sans-serif" font-size="22">Regenerate, start another project, or continue after signup + checkout</text>
	<text x="214" y="126" fill="#8d5b1f" font-family="Manrope, Arial, sans-serif" font-size="22" font-weight="700" letter-spacing="4">UPMODEL PREVIEW</text>
</svg>`.trim()
}

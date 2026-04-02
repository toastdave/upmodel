<script lang="ts">
import './layout.css'
import favicon from '$lib/assets/favicon.svg'
import { siteConfig } from '$lib/config/site'
import type { LayoutData } from './$types'

const { children, data } = $props<{ data: LayoutData; children: import('svelte').Snippet }>()
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="relative min-h-screen overflow-x-clip bg-canvas text-slate-950">
	<div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,242,215,0.92),transparent_28%),radial-gradient(circle_at_80%_18%,rgba(122,163,140,0.2),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(216,151,92,0.18),transparent_26%)]"></div>

	<div class="relative mx-auto flex max-w-6xl items-center justify-between px-6 pt-6 sm:px-8 lg:px-10">
		<a class="flex items-center gap-3 text-slate-950" href="/">
			<span class="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-stone-100">
				{siteConfig.name}
			</span>
			<span class="hidden text-sm text-slate-700 sm:inline">{siteConfig.tagline}</span>
		</a>

		<nav class="flex items-center gap-3 text-sm">
			<a class="rounded-full border border-slate-950/10 bg-white/70 px-4 py-2 text-slate-700 backdrop-blur" href={siteConfig.productRoute}>
				Try the modeler
			</a>
			<a class="rounded-full border border-slate-950/10 bg-white/70 px-4 py-2 text-slate-700 backdrop-blur" href="/pricing">
				Pricing
			</a>
			{#if data.user}
				<a class="rounded-full bg-slate-950 px-4 py-2 font-medium text-stone-100" href="/account">
					{data.user.name ?? 'Account'}
				</a>
			{:else}
				<a class="rounded-full bg-slate-950 px-4 py-2 font-medium text-stone-100" href="/sign-in">
					Sign in to continue
				</a>
			{/if}
		</nav>
	</div>

	{@render children()}
</div>

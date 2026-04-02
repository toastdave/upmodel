<script lang="ts">
import { remodelBriefSections } from '$lib/modeling'
import {
	creditPackDefinitions,
	estimateGenerationCredits,
	guestTrialPolicy,
} from '@upmodel/db/pricing'

const suggestedConceptCount = 2
const estimatedCredits = estimateGenerationCredits({ conceptCount: suggestedConceptCount })
</script>

<svelte:head>
	<title>Upmodel | Model Workspace</title>
</svelte:head>

<div class="mx-auto max-w-6xl px-6 py-10 sm:px-8 lg:px-10">
	<section class="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
		<div class="rounded-[1.75rem] border border-slate-950/10 bg-white/80 p-7 shadow-[0_24px_80px_-56px_rgba(20,45,45,0.55)] backdrop-blur">
			<p class="text-sm uppercase tracking-[0.28em] text-amber-700">Model workspace</p>
			<h1 class="mt-4 font-display text-5xl leading-none text-slate-950">Upload, brief, preview, convert.</h1>
			<p class="mt-4 text-sm leading-7 text-slate-700">
				This is the future home for the guest-first remodel flow. The first concept stays complimentary.
				The next regeneration or new project will route into sign-up plus credit purchase.
			</p>
			<div class="mt-6 grid gap-3">
				{#each remodelBriefSections as section}
					<div class="rounded-2xl border border-slate-950/8 bg-stone-50/90 px-4 py-3 text-sm text-slate-800">
						{section}
					</div>
				{/each}
			</div>
		</div>

		<div class="rounded-[1.75rem] border border-slate-950/10 bg-slate-950 p-7 text-stone-100 shadow-[0_24px_80px_-56px_rgba(20,45,45,0.75)]">
			<p class="text-sm uppercase tracking-[0.28em] text-amber-300">Conversion logic</p>
			<div class="mt-5 grid gap-4 md:grid-cols-2">
				<div class="rounded-2xl bg-white/8 p-5">
					<p class="font-semibold">Guest allowance</p>
					<p class="mt-2 text-sm leading-7 text-stone-100/88">
						{guestTrialPolicy.freeGenerations} free generation before the purchase wall.
					</p>
				</div>
				<div class="rounded-2xl bg-white/8 p-5">
					<p class="font-semibold">Starter estimate</p>
					<p class="mt-2 text-sm leading-7 text-stone-100/88">
						{suggestedConceptCount} concepts should cost about {estimatedCredits} credits with the current helper.
					</p>
				</div>
			</div>
			<div class="mt-5 rounded-2xl border border-white/10 bg-white/6 p-5 text-sm leading-7 text-stone-100/88">
				Seeded packs: {creditPackDefinitions.map((pack) => pack.name).join(', ')}.
			</div>
		</div>
	</section>
</div>

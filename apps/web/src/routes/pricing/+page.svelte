<script lang="ts">
import { creditPackDefinitions, guestTrialPolicy } from '@upmodel/db/pricing'
</script>

<svelte:head>
	<title>Upmodel | Pricing</title>
</svelte:head>

<div class="mx-auto max-w-6xl px-6 py-10 sm:px-8 lg:px-10">
	<section class="rounded-[1.75rem] border border-slate-950/10 bg-white/80 p-8 shadow-[0_24px_80px_-56px_rgba(20,45,45,0.55)] backdrop-blur">
		<p class="text-sm uppercase tracking-[0.28em] text-emerald-700">Pricing direction</p>
		<h1 class="mt-4 font-display text-5xl leading-none text-slate-950">One free taste, then credits.</h1>
		<p class="mt-4 max-w-3xl text-sm leading-7 text-slate-700">
			Upmodel is designed to be easy to try without turning into an unlimited free sandbox.
			Guests can get {guestTrialPolicy.freeGenerations} complimentary concept, then the next regeneration
			or new project should route through account creation and checkout.
		</p>
	</section>

	<section class="mt-8 grid gap-6 md:grid-cols-3">
		{#each creditPackDefinitions as pack}
			<div class="rounded-[1.75rem] border border-slate-950/10 bg-white/80 p-6 shadow-[0_24px_80px_-56px_rgba(20,45,45,0.5)] backdrop-blur">
				<p class="text-sm uppercase tracking-[0.24em] text-slate-500">{pack.slug}</p>
				<p class="mt-3 font-display text-4xl text-slate-950">{pack.name}</p>
				<p class="mt-2 text-sm text-slate-700">{pack.credits} credits</p>
				<p class="mt-5 text-3xl font-semibold text-slate-950">${(pack.priceCents / 100).toFixed(0)}</p>
				<p class="mt-4 text-sm leading-7 text-slate-700">{pack.description}</p>
			</div>
		{/each}
	</section>
</div>

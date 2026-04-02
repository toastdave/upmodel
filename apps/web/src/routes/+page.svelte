<script lang="ts">
import { siteConfig } from '$lib/config/site'
import { featuredProjectTypes, trialSteps } from '$lib/modeling'
import { ArrowRight, Sparkles, WalletCards } from '@lucide/svelte'
import { creditPackDefinitions, guestTrialPolicy } from '@upmodel/db/pricing'

const starterPack = creditPackDefinitions[0]
</script>

<svelte:head>
	<title>Upmodel</title>
	<meta name="description" content={siteConfig.description} />
</svelte:head>

<div class="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-10 sm:px-8 lg:px-10">
	<header class="grid gap-8 rounded-[2rem] border border-white/70 bg-white/72 p-8 shadow-[0_32px_120px_-48px_rgba(20,45,45,0.45)] backdrop-blur md:p-10 lg:grid-cols-[1.18fr_0.82fr] lg:items-end">
		<div class="space-y-6">
			<div class="flex flex-wrap items-center gap-3 text-sm font-medium text-slate-700">
				<span class="rounded-full bg-slate-950 px-3 py-1 text-stone-100">Guest-first trial</span>
				<span class="rounded-full border border-slate-950/10 px-3 py-1">Home remodels</span>
				<span class="rounded-full border border-slate-950/10 px-3 py-1">Credits after first result</span>
			</div>
			<p class="font-display text-sm uppercase tracking-[0.3em] text-amber-700">Real rooms. Faster decisions.</p>
			<h1 class="max-w-3xl font-display text-5xl leading-none tracking-tight text-slate-950 sm:text-6xl">
				See what your remodel could look like before you call the contractor back.
			</h1>
			<p class="max-w-2xl text-lg leading-8 text-slate-700">
				Upmodel gives guests one complimentary concept, then converts the next step into a
				sign-up and credit-pack purchase flow so paid iteration starts quickly.
			</p>
			<div class="flex flex-wrap gap-3">
				<a class="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-stone-100" href={siteConfig.productRoute}>
					Try your free concept
					<ArrowRight class="size-4" />
				</a>
				<a class="rounded-full border border-slate-950/10 bg-white/80 px-5 py-3 text-sm font-semibold text-slate-700" href="/pricing">
					See credit packs
				</a>
			</div>
		</div>

		<div class="rounded-[1.5rem] border border-slate-950/10 bg-slate-950 p-6 text-stone-100">
			<p class="text-sm uppercase tracking-[0.28em] text-amber-300">Trial rule</p>
			<p class="mt-4 font-display text-3xl">{guestTrialPolicy.freeGenerations} complimentary guest generation</p>
			<p class="mt-3 text-sm leading-7 text-stone-100/88">
				After that, the product nudges straight into account creation and a starter purchase.
			</p>
			<div class="mt-5 rounded-2xl bg-white/8 p-4 text-sm leading-7 text-stone-100/92">
				Starter pack target: {starterPack.credits} credits for ${(starterPack.priceCents / 100).toFixed(0)}.
			</div>
		</div>
	</header>

	<section class="mt-10 grid gap-6 lg:grid-cols-[0.94fr_1.06fr]">
		<div class="rounded-[1.75rem] border border-slate-950/10 bg-white/80 p-7 shadow-[0_24px_80px_-56px_rgba(20,45,45,0.6)] backdrop-blur">
			<div class="flex items-center gap-3">
				<Sparkles class="size-5 text-amber-700" />
				<p class="text-sm uppercase tracking-[0.28em] text-amber-700">Guest funnel</p>
			</div>
			<ul class="mt-5 grid gap-3 text-sm text-slate-900">
				{#each trialSteps as step, index}
					<li class="rounded-2xl border border-slate-950/8 bg-stone-50/90 px-4 py-3">
						<span class="mr-2 font-semibold text-slate-500">0{index + 1}</span>{step}
					</li>
				{/each}
			</ul>
		</div>

		<div class="rounded-[1.75rem] border border-slate-950/10 bg-white/80 p-7 shadow-[0_24px_80px_-56px_rgba(20,45,45,0.6)] backdrop-blur">
			<div class="flex items-center gap-3">
				<WalletCards class="size-5 text-emerald-700" />
				<p class="text-sm uppercase tracking-[0.28em] text-emerald-700">Where the value lands</p>
			</div>
			<div class="mt-5 grid gap-4 md:grid-cols-3">
				{#each featuredProjectTypes as projectType}
					<div class="rounded-2xl border border-slate-950/8 bg-white px-4 py-4">
						<p class="font-display text-2xl text-slate-950">{projectType.title}</p>
						<p class="mt-2 text-sm leading-7 text-slate-700">{projectType.description}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<section class="mt-8 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
		<div class="rounded-[1.75rem] border border-dashed border-slate-950/14 bg-white/65 p-6 backdrop-blur">
			<p class="font-display text-2xl text-slate-950">What this scaffold already sets up</p>
			<ul class="mt-4 space-y-3 text-sm leading-7 text-slate-700">
				<li>Unique local port block with no sibling collision.</li>
				<li>Bun workspace shape aligned with `upstage` and `tidy`.</li>
				<li>Guest session cookie plumbing for trial-first flows.</li>
				<li>Future-ready schema for projects, room briefs, jobs, variants, and credits.</li>
				<li>PRDs and roadmap for generation, conversion, billing, and trust work.</li>
			</ul>
		</div>

		<div class="rounded-[1.75rem] border border-slate-950/10 bg-gradient-to-br from-[#204d45] to-[#173531] p-7 text-stone-100 shadow-[0_24px_80px_-56px_rgba(20,45,45,0.8)]">
			<p class="text-sm uppercase tracking-[0.28em] text-amber-300">Positioning</p>
			<p class="mt-4 font-display text-4xl leading-tight">
				A remodeling preview app that is easy to try and intentionally fast to monetize.
			</p>
			<p class="mt-4 max-w-2xl text-sm leading-7 text-stone-100/88">
				The product should feel helpful within one visit, but it should not linger in an unlimited free mode.
				The first result builds trust; the second meaningful action becomes the conversion moment.
			</p>
		</div>
	</section>
</div>

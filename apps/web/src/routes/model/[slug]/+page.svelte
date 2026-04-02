<script lang="ts">
import { estimateGenerationCredits } from '@upmodel/db/pricing'
import type { ActionData, PageData } from './$types'

const { data, form } = $props<{ data: PageData; form: ActionData }>()

const latestJob = $derived(data.projectState.jobs[0] ?? null)
const latestVariant = $derived(latestJob?.variants[0] ?? null)
</script>

<svelte:head>
	<title>Upmodel | {data.projectState.project.title}</title>
</svelte:head>

<div class="mx-auto max-w-6xl px-6 py-10 sm:px-8 lg:px-10">
	<section class="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
		<div class="rounded-[1.75rem] border border-slate-950/10 bg-white/80 p-7 shadow-[0_24px_80px_-56px_rgba(20,45,45,0.55)] backdrop-blur">
			<p class="text-sm uppercase tracking-[0.28em] text-amber-700">Project brief</p>
			<h1 class="mt-4 font-display text-5xl leading-none text-slate-950">{data.projectState.project.title}</h1>
			<p class="mt-4 text-sm leading-7 text-slate-700">{data.projectState.roomBrief?.summary}</p>

			<div class="mt-6 grid gap-3 md:grid-cols-2">
				<div class="rounded-2xl border border-slate-950/8 bg-stone-50/90 p-4">
					<p class="text-xs uppercase tracking-[0.24em] text-slate-500">Room type</p>
					<p class="mt-2 text-sm text-slate-900">{data.projectState.project.roomType ?? 'Not specified yet'}</p>
				</div>
				<div class="rounded-2xl border border-slate-950/8 bg-stone-50/90 p-4">
					<p class="text-xs uppercase tracking-[0.24em] text-slate-500">Style direction</p>
					<p class="mt-2 text-sm text-slate-900">{data.projectState.project.styleDirection ?? 'Tailored to your prompt'}</p>
				</div>
				<div class="rounded-2xl border border-slate-950/8 bg-stone-50/90 p-4 md:col-span-2">
					<p class="text-xs uppercase tracking-[0.24em] text-slate-500">Intent</p>
					<p class="mt-2 text-sm text-slate-900">{data.projectState.project.remodelIntent ?? 'No extra intent was provided.'}</p>
				</div>
			</div>

			{#if data.projectState.sourcePhoto}
				<div class="mt-6 overflow-hidden rounded-[1.5rem] border border-slate-950/10 bg-stone-100">
					<img alt={`Source photo for ${data.projectState.project.title}`} class="h-72 w-full object-cover" src={data.projectState.sourcePhoto.url} />
				</div>
			{/if}
		</div>

		<div class="rounded-[1.75rem] border border-slate-950/10 bg-slate-950 p-7 text-stone-100 shadow-[0_24px_80px_-56px_rgba(20,45,45,0.75)]">
			<p class="text-sm uppercase tracking-[0.28em] text-amber-300">Complimentary concept</p>
			<p class="mt-4 font-display text-4xl leading-tight">
				{#if latestVariant}
					Your free preview is ready.
				{:else}
					Generate the first preview before checkout kicks in.
				{/if}
			</p>

			<div class="mt-5 grid gap-4 md:grid-cols-2">
				<div class="rounded-2xl bg-white/8 p-5">
					<p class="font-semibold">Trial remaining</p>
					<p class="mt-2 text-sm leading-7 text-stone-100/88">
						{data.projectState.trialStatus.remainingGenerations} of {data.projectState.trialStatus.includedGenerations}
					</p>
				</div>
				<div class="rounded-2xl bg-white/8 p-5">
					<p class="font-semibold">Paid continuation</p>
					<p class="mt-2 text-sm leading-7 text-stone-100/88">
						A second concept should cost about {estimateGenerationCredits({ conceptCount: 1 })} credits.
					</p>
				</div>
			</div>

			{#if form?.error}
				<p class="mt-5 rounded-2xl border border-amber-200/30 bg-amber-100/10 px-4 py-3 text-sm text-amber-100">
					{form.error}
				</p>
			{:else if form?.message}
				<p class="mt-5 rounded-2xl border border-emerald-200/30 bg-emerald-100/10 px-4 py-3 text-sm text-emerald-100">
					{form.message}
				</p>
			{/if}

			{#if latestVariant}
				<div class="mt-6 overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/8">
					<img alt={`Complimentary preview for ${data.projectState.project.title}`} class="h-80 w-full object-cover" src={latestVariant.url} />
				</div>
				<div class="mt-5 flex flex-wrap gap-3">
					<a class="rounded-full bg-stone-100 px-5 py-3 text-sm font-semibold text-slate-950" href={`/sign-in?redirectTo=/model/${data.projectState.project.slug}&intent=checkout`}>
						Sign up and buy credits to keep going
					</a>
					<a class="rounded-full border border-white/12 px-5 py-3 text-sm font-semibold text-stone-100" href="/pricing">
						Review credit packs
					</a>
				</div>
			{:else}
				<form class="mt-6" method="POST">
					<button class="rounded-full bg-stone-100 px-5 py-3 text-sm font-semibold text-slate-950" formaction="?/runComplimentaryConcept" type="submit">
						Generate complimentary concept
					</button>
				</form>
			{/if}
		</div>
	</section>
</div>

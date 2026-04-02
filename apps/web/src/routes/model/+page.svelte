<script lang="ts">
import { remodelBriefSections } from '$lib/modeling'
import { creditPackDefinitions, guestTrialPolicy } from '@upmodel/db/pricing'
import type { ActionData, PageData } from './$types'

const { data, form } = $props<{ data: PageData; form: ActionData }>()
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
				Guests can create a room project and upload a real source photo right now. The first concept stays
				complimentary. The next regeneration or new project should route into sign-up plus credit purchase.
			</p>

			{#if form?.error}
				<p class="mt-5 rounded-2xl border border-amber-200/50 bg-amber-50 px-4 py-3 text-sm text-amber-900">
					{form.error}
				</p>
			{/if}

			<form class="mt-6 grid gap-4" enctype="multipart/form-data" method="POST">
				<div class="grid gap-4 md:grid-cols-2">
					<label class="grid gap-2 text-sm text-slate-700">
						<span class="font-medium">Project title</span>
						<input class="rounded-2xl border border-slate-950/10 bg-white px-4 py-3" maxlength="140" name="title" placeholder="Kitchen refresh before contractor bids" required />
					</label>
					<label class="grid gap-2 text-sm text-slate-700">
						<span class="font-medium">Room type</span>
						<select class="rounded-2xl border border-slate-950/10 bg-white px-4 py-3" name="roomType">
							<option value="">Choose a room</option>
							<option value="kitchen">Kitchen</option>
							<option value="bathroom">Bathroom</option>
							<option value="living_room">Living room</option>
							<option value="bedroom">Bedroom</option>
							<option value="exterior">Exterior</option>
							<option value="other">Other</option>
						</select>
					</label>
				</div>

				<label class="grid gap-2 text-sm text-slate-700">
					<span class="font-medium">What are you trying to change?</span>
					<textarea class="min-h-28 rounded-[1.5rem] border border-slate-950/10 bg-white px-4 py-3" maxlength="160" name="remodelIntent" placeholder="Warm up the finishes, simplify the cabinets, and make the room feel brighter and more custom."></textarea>
				</label>

				<label class="grid gap-2 text-sm text-slate-700">
					<span class="font-medium">Style direction</span>
					<input class="rounded-2xl border border-slate-950/10 bg-white px-4 py-3" maxlength="120" name="styleDirection" placeholder="Warm modern with natural stone and wood" />
				</label>

				<label class="grid gap-2 text-sm text-slate-700">
					<span class="font-medium">Source photo</span>
					<input accept={data.sourceUploadConstraints.allowedMimeTypes.join(',')} class="rounded-2xl border border-dashed border-slate-950/20 bg-stone-50 px-4 py-4" name="file" required type="file" />
					<span class="text-xs text-slate-500">JPG, PNG, or WebP up to {(data.sourceUploadConstraints.maxFileSizeBytes / (1024 * 1024)).toFixed(0)} MB.</span>
				</label>

				<button class="w-fit rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-stone-100" formaction="?/createProject" type="submit">
					Create guest project
				</button>
			</form>

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
						{data.workspace.trialStatus.remainingGenerations} of {guestTrialPolicy.freeGenerations} free generation remaining.
					</p>
				</div>
				<div class="rounded-2xl bg-white/8 p-5">
					<p class="font-semibold">Starter packs</p>
					<p class="mt-2 text-sm leading-7 text-stone-100/88">
						{creditPackDefinitions[0].name}, {creditPackDefinitions[1].name}, and {creditPackDefinitions[2].name} are seeded.
					</p>
				</div>
			</div>
			<div class="mt-5 rounded-2xl border border-white/10 bg-white/6 p-5 text-sm leading-7 text-stone-100/88">
				Once the complimentary concept is used, the next regeneration or new project should route into the combined sign-up and purchase step.
			</div>
		</div>
	</section>

	<section class="mt-8 rounded-[1.75rem] border border-slate-950/10 bg-white/80 p-7 shadow-[0_24px_80px_-56px_rgba(20,45,45,0.55)] backdrop-blur">
		<div class="flex items-center justify-between gap-4">
			<div>
				<p class="text-sm uppercase tracking-[0.28em] text-emerald-700">Guest workspace</p>
				<p class="mt-2 font-display text-3xl text-slate-950">Your in-progress remodel projects</p>
			</div>
			<p class="text-sm text-slate-500">{data.workspace.guestSession.guestLabel}</p>
		</div>

		{#if data.workspace.projects.length === 0}
			<p class="mt-5 text-sm leading-7 text-slate-700">No guest projects yet. Create one above, then generate your complimentary preview.</p>
		{:else}
			<div class="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
				{#each data.workspace.projects as project}
					<a class="overflow-hidden rounded-[1.5rem] border border-slate-950/10 bg-stone-50/70 transition hover:-translate-y-0.5 hover:shadow-[0_18px_60px_-40px_rgba(20,45,45,0.55)]" href={`/model/${project.slug}`}>
						{#if project.heroPhotoUrl}
							<img alt={`Source photo for ${project.title}`} class="h-48 w-full object-cover" src={project.heroPhotoUrl} />
						{/if}
						<div class="p-5">
							<p class="font-display text-2xl text-slate-950">{project.title}</p>
							<p class="mt-2 text-sm text-slate-700">{project.roomType ?? 'Room type pending'} • {project.styleDirection ?? 'Style to be refined'}</p>
							<p class="mt-4 text-sm leading-7 text-slate-600">
								{project.hasComplimentaryResult ? 'Complimentary concept ready.' : 'Project brief is ready for the first concept.'}
							</p>
						</div>
					</a>
				{/each}
			</div>
		{/if}
	</section>
</div>

<script lang="ts">
	import {
		Brush,
		Circle,
		CornerUpLeft,
		CornerUpRight,
		Eraser,
		Square,
		SquareMousePointer
	} from 'lucide-svelte';
	import Input from './input.svelte';
	import { cn } from '$lib/utils';
	import {
		filteredOptions,
		filteredSettings,
		isOptionSelectionActive,
		isSettingSelectionActive
	} from '$lib/store';

	// Define the structure for setting keywords
	const settingKeywords: { [key: string]: string[] } = {
		Format: ['16:9', '4:3', '1:1', '9:16'],
		Creativity: ['Random', '100 Percent', '50 Percent', '0 Percent'],
		Resolution: ['1080p', '720p', '480p', '360p'],
		Model: ['DALL-E', 'Stable Diffusion', 'MidJourney', 'Deep Dream', 'Custom'],
		Model_Type: ['Default', 'Depth', 'LinearArt'],
		Style: ['Anime', 'Cartoon', 'Painting', 'Sketch', 'Realism', 'Cyberpunk']
	};

	// Input instance
	let inputComponentInstance: Input;

	// Handle clicks on toolbar items
	function handleToolbarItemClick(item: string) {
		if ($isSettingSelectionActive) {
			isSettingSelectionActive.set(false);
			isOptionSelectionActive.set(true);
			filteredSettings.set([]);
			filteredOptions.set(settingKeywords[item]);
			inputComponentInstance.insertSpan(item, true);
		} else if ($isOptionSelectionActive) {
			isOptionSelectionActive.set(false);
			filteredOptions.set([]);
			inputComponentInstance.insertSpan(item, false);
		}
	}

	// Reactive declarations for toolbar items and dimensions
	$: toolbarItems = $isSettingSelectionActive
		? $filteredSettings
		: $isOptionSelectionActive
			? $filteredOptions
			: [];
	$: toolbarHeight =
		toolbarItems.length > 0 ? (toolbarItems.length > 1 ? toolbarItems.length * 29 + 4 : 36) : 40;
	$: toolbarOffset = toolbarItems.length > 0 ? (toolbarHeight < 40 ? -36 : -toolbarHeight) : -40;
</script>

<div class="h-screen w-full flex items-center justify-center flex-col">
	<!-- Toolbar container -->
	<div class="w-[600px] flex items-center justify-center relative">
		<!-- Main Toolbar -->
		<div
			class="w-full z-10 h-[90px] bg-background border rounded-[14px] flex flex-col items-center"
		>
			<!-- Setting Selection -->
			<div class="flex items-center gap-2.5 h-full max-h-[34px] w-full border-b px-4 py-2">
				<button class="text-secondary-foreground text-sm"> Image </button>
				<button
					class="text-muted-foreground/50 text-sm hover:text-secondary-foreground transition-colors"
				>
					Video
				</button>
				<button
					class="text-muted-foreground/50 text-sm hover:text-secondary-foreground transition-colors"
				>
					Interpolation
				</button>
			</div>

			<!-- Input Field -->
			<Input bind:this={inputComponentInstance} {settingKeywords} />
		</div>
		<!-- Sketch Toolbar -->
		<div
			class={cn(
				'absolute flex items-center w-[calc(100%-20px)] bg-background border border-b-0 rounded-[14px] rounded-b-none transition-all duration-300 ease-in-out overflow-hidden',
				toolbarItems.length > 0
					? 'flex-col justify-start p-1'
					: ' flex-row gap-2 justify-center px-3'
			)}
			style={`height: ${toolbarHeight}px; top: ${toolbarOffset}px;`}
			role="menu"
		>
			{#if toolbarItems.length > 0}
				<!-- Render filtered settings or options -->
				{#each toolbarItems as item, index}
					<button
						on:click={() => handleToolbarItemClick(item)}
						class="text-sm transition-colors flex items-center justify-center text-muted-foreground hover:bg-accent focus-visible:bg-accent focus-visible:text-foreground focus-visible:outline-none hover:text-accent-foreground min-h-7 w-full rounded-lg"
						tabindex="0"
						role="menuitem"
						aria-label={item}
					>
						{item}
					</button>
				{/each}
			{:else}
				<button
					class="text-sm transition-colors flex items-center justify-center text-foreground bg-accent hover:text-accent-foreground h-6 rounded-md w-6"
				>
					<Brush class="w-4 h-4" />
				</button>
				<button
					class="text-sm transition-colors flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-accent-foreground h-6 rounded-md w-6"
				>
					<Circle class="w-4 h-4" />
				</button>
				<button
					class="text-sm transition-colors flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-accent-foreground h-6 rounded-md w-6"
				>
					<Square class="w-4 h-4" />
				</button>
				<button
					class="text-sm transition-colors flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-accent-foreground h-6 rounded-md w-6"
				>
					<Eraser class="w-4 h-4" />
				</button>
				<button
					class="text-sm transition-colors flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-accent-foreground h-6 rounded-md w-6"
				>
					<SquareMousePointer class="w-4 h-4" />
				</button>
				<hr class="w-[1px] bg-border" style={`height: ${toolbarHeight}px;`} />
				<button
					class="text-sm transition-colors flex items-center justify-center text-foreground bg-accent hover:text-accent-foreground h-6 rounded-md w-6"
				>
					<div class="rounded-full h-1.5 w-1.5 bg-primary" />
				</button>
				<button
					class="text-sm transition-colors flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-accent-foreground h-6 rounded-md w-6"
				>
					<div class="rounded-full h-2.5 w-2.5 bg-gray-400" />
				</button>
				<hr class="w-[1px] bg-border" style={`height: ${toolbarHeight}px;`} />
				<button
					class="text-sm transition-colors flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-accent-foreground h-6 rounded-md w-6"
				>
					<div class="rounded-full h-2.5 w-2.5 bg-slate-100" />
				</button>
				<button
					class="text-sm transition-colors flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-accent-foreground h-6 rounded-md w-6"
				>
					<div class="rounded-full h-2.5 w-2.5 bg-gray-500" />
				</button>
				<button
					class="text-sm transition-colors flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-accent-foreground h-6 rounded-md w-6"
				>
					<div class="rounded-full h-2.5 w-2.5 bg-gray-200" />
				</button>
				<button
					class="text-sm transition-colors flex items-center justify-center text-foreground bg-accent hover:text-accent-foreground h-6 rounded-md w-6"
				>
					<div class="rounded-full h-2.5 w-2.5 bg-blue-400" />
				</button>
				<button
					class="text-sm transition-colors flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-accent-foreground h-6 rounded-md w-6"
				>
					<div class="rounded-full h-2.5 w-2.5 bg-purple-400" />
				</button>
				<button
					class="text-sm transition-colors flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-accent-foreground h-6 rounded-md w-6"
				>
					<div class="rounded-full h-2.5 w-2.5 bg-red-400" />
				</button>
				<button
					class="text-sm transition-colors flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-accent-foreground h-6 rounded-md w-6"
				>
					<div class="rounded-full h-2.5 w-2.5 bg-orange-400" />
				</button>
				<button
					class="text-sm transition-colors flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-accent-foreground h-6 rounded-md w-6"
				>
					<div class="rounded-full h-2.5 w-2.5 bg-green-400" />
				</button>
				<hr class="w-[1px] bg-border" style={`height: ${toolbarHeight}px;`} />
				<button
					class="text-sm transition-colors flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-accent-foreground h-6 rounded-md w-6"
				>
					<CornerUpLeft class="w-4 h-4" />
				</button>
				<button
					class="text-sm transition-colors flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-accent-foreground h-6 rounded-md w-6"
				>
					<CornerUpRight class="w-4 h-4" />
				</button>
			{/if}
		</div>
	</div>
</div>

<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	import Shape from './Shape.svelte';
	export let active = false;
	export let inputString: { type: string; color: string }[] = [];
	export let steps: { type: string; color: string }[][] = [];
</script>

<div class="{active ? 'flex' : 'hidden'} justify-center items-center fixed -top-4 left-0 w-full h-screen z-10 bg-gray-800 bg-opacity-60">
	<div class="flex flex-col bg-gray-100 rounded p-4 items-center">
		<div class="flex flex-col items-center">
			<h1 class="text-lg font-bold">Derivation</h1>
			<div class="flex items-center p-4 bg-gray-100 rounded gap-2">
				<span class="font-bold">Step 0:</span>
				{#each inputString as shape}
					<Shape type={shape.type} color={shape.color} />
				{/each}
			</div>
			{#each steps as step, i}
				<div class="flex items-center p-4 bg-gray-100 rounded gap-2">
					<span class="font-bold">Step {i + 1}:</span>
					{#each step as shape}
						<Shape type={shape.type} color={shape.color} />
					{/each}
				</div>
			{/each}
		</div>
		<button
			class="flex px-2 py-1 rounded bg-gray-300"
			on:click={() => {
				dispatch('close');
			}}
		>
			Close
		</button>
	</div>
</div>

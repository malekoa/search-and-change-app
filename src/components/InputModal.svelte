<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	import Shape from './Shape.svelte';
	export let inputString: { type: string; color: string }[] = [];
	export let editIndex = 0;
	export let active = true;
	const shapeList = ['square', 'circle', 'lozenge', 'triangle', 'star', 'hexagon', 'pentagon', 'trapezoid', 'any'];
	const colorList = ['black', 'red', 'blue', 'green', 'yellow', 'orange', 'purple', 'slateblue', 'brown', 'gray'];
</script>

<div class="{active ? 'flex' : 'hidden'} flex justify-center items-center fixed -top-4 left-0 w-full h-screen bg-gray-800 bg-opacity-70">
	<div class="flex flex-col items-center bg-gray-100 rounded p-4 gap-4">
		<h1 class="text-lg font-bold">Change Symbol</h1>
		<div>
			{#if inputString[editIndex] !== undefined}
				<Shape type={inputString[editIndex].type} color={inputString[editIndex].color} />
			{/if}
			<!-- <Shape type={inputString[editIndex].type} color={inputString[editIndex].color} /> -->
		</div>
		<div class="flex flex-col w-full gap-1">
			{#if inputString[editIndex] !== undefined}
				<span class="text-sm font-bold">Color:</span>
				<select class="p-1 rounded" bind:value={inputString[editIndex].color}>
					{#each colorList as color}
						<option value={color}>{color}</option>
					{/each}
				</select>
				<span class="text-sm font-bold">Shape:</span>
				<select class="p-1 rounded" bind:value={inputString[editIndex].type}>
					{#each shapeList as shape}
						<option value={shape}>{shape}</option>
					{/each}
				</select>
			{/if}
		</div>
		<div class="flex gap-2">
			<button
				class="px-4 py-2 bg-red-500 text-white rounded"
				on:click={() => {
					dispatch('delete');
				}}>Delete</button
			>
			<button
				class="px-4 py-2 bg-green-500 text-white rounded"
				on:click={() => {
					dispatch('confirm', inputString);
				}}>Confirm</button
			>
		</div>
	</div>
</div>

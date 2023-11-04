<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	function handleCancel() {
		dispatch('cancel');
	}
	function handleConfirm() {
		dispatch('confirm', tempOutputString);
	}
	import Shape from './Shape.svelte';
	export let active = false;
	export let editable = false;
	export let currentIndex = 0;
	export let outputString: { type: string; color: string }[];

	let tempOutputString = outputString.map((shape) => {
		return { type: shape.type, color: shape.color };
	});

	$: if (!active) {
		editable = false; // this is a hacky way to try to fix the bug where the modal's information is not updated when the user clicks on a different shape or color
	}

	$: if (active && !editable) {
		editable = true;
		tempOutputString = outputString.map((shape) => {
			return { type: shape.type, color: shape.color };
		});
	}

	const shapeList = ['square', 'circle', 'lozenge', 'triangle', 'star', 'hexagon', 'pentagon', 'trapezoid'];
	const colorList = ['black', 'red', 'blue', 'green', 'yellow', 'orange', 'purple', 'slateblue', 'brown', 'gray'];
</script>

<div class="{active ? 'flex' : 'hidden'} justify-center items-center fixed -top-4 left-0 w-full h-screen z-10 bg-gray-800 bg-opacity-60">
	<div class="flex flex-col items-center p-4 bg-gray-100 rounded gap-2">
		<h1 class="text-lg font-bold">Change</h1>
		<Shape type={tempOutputString[currentIndex].type} color={tempOutputString[currentIndex].color} />
		<div class="flex flex-col w-full gap-1">
			<span class="text-sm font-bold">Color:</span>
			<select class="p-1 rounded" bind:value={tempOutputString[currentIndex].color}>
				{#each colorList as color}
					<option value={color}>{color}</option>
				{/each}
			</select>
		</div>
		<div class="flex flex-col w-full gap-1">
			<span class="text-sm font-bold">Shape:</span>
			<select class="p-1 rounded" bind:value={tempOutputString[currentIndex].type}>
				{#each shapeList as shape}
					<option value={shape}>{shape}</option>
				{/each}
			</select>
		</div>
		<div class="flex gap-2">
			<button
				class="px-4 py-2 bg-gray-300 rounded"
				on:click={() => {
					handleCancel();
				}}>Cancel</button
			>
			<button
				class="px-4 py-2 bg-green-500 text-white rounded"
				on:click={() => {
					handleConfirm();
				}}>Confirm</button
			>
		</div>
	</div>
</div>

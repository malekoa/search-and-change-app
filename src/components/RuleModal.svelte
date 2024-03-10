<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	import Rule from './Rule.svelte';
	import Shape from './Shape.svelte';

	export let ruleSet: { inr: { type: string; color: string }; trm: { type: string; color: string }; direction: string; output: { type: string; color: string }; condition: { hasCondition: boolean; type: string; color: string } }[] = [
		{
			inr: { type: 'square', color: 'black' },
			trm: { type: 'square', color: 'red' },
			direction: 'right',
			output: { type: 'square', color: 'black' },
			condition: { hasCondition: true, type: 'square', color: 'black' }
		},
		{
			inr: { type: 'square', color: 'black' },
			trm: { type: 'square', color: 'red' },
			direction: 'right',
			output: { type: 'square', color: 'black' },
			condition: { hasCondition: true, type: 'square', color: 'black' }
		}
	];

	export let active = false;

	let title = 'Modify Ruleset';

	let modifyingRuleIndex = 0;

	const shapeList = ['square', 'circle', 'lozenge', 'triangle', 'star', 'hexagon', 'pentagon', 'trapezoid', 'any'];
	const colorList = ['black', 'red', 'blue', 'green', 'yellow', 'orange', 'purple', 'slateblue', 'brown', 'gray'];
</script>

<div class="{active ? 'flex' : 'hidden'} justify-center items-center fixed -top-4 left-0 w-full h-screen z-10 bg-gray-800 bg-opacity-60">
	<div class="flex flex-col justify-center items-center p-4 bg-gray-100 rounded gap-2 max-w-sm overflow-auto">
		<div class="flex w-full justify-between items-center">
			<h1 class="text-lg font-bold">{title}</h1>
			<button
				class="{title === 'Modify Ruleset' ? 'flex' : 'hidden'} px-2 py-1 rounded bg-cyan-500 text-white"
				on:click={() => {
					ruleSet = [
						...ruleSet,
						{
							inr: { type: 'square', color: 'black' },
							trm: { type: 'square', color: 'black' },
							direction: 'right',
							output: { type: 'square', color: 'black' },
							condition: { hasCondition: false, type: 'square', color: 'black' }
						}
					];
				}}
			>
				Add Rule
			</button>
		</div>
		<div class="{title === 'Modify Ruleset' ? 'flex' : 'hidden'} w-full flex-col gap-3">
			{#each ruleSet as rule, index}
				<div class="flex items-center w-full gap-2">
					<div class="w-full overflow-auto">
						<Rule {rule} number={index + 1} />
					</div>
					<div class="flex flex-col gap-1">
						<button
							class="flex justify-center px-0.5 py-1 rounded bg-red-500 text-white"
							on:click={() => {
								ruleSet = ruleSet.filter((_, i) => i !== index);
								dispatch('delete', ruleSet);
							}}
						>
							Delete
						</button>
						<button
							class="flex justify-center px-0.5 py-1 rounded bg-green-500 text-white"
							on:click={() => {
								title = 'Modify Rule';
								modifyingRuleIndex = index;
							}}
						>
							Modify
						</button>
					</div>
				</div>
			{/each}
		</div>
		<div class={title === 'Modify Rule' ? 'flex' : 'hidden'}>
			<div class="flex flex-col gap-1">
				<div class="flex gap-4 p-2 rounded w-full justify-between">
					<div class="flex flex-col justify-center items-center">
						<span class="font-bold">INR</span>
						{#if ruleSet.length > 0}
							<Shape type={ruleSet[modifyingRuleIndex].inr.type} color={ruleSet[modifyingRuleIndex].inr.color} />
						{/if}
						<!-- <Shape type={ruleSet[modifyingRuleIndex].inr.type} color={ruleSet[modifyingRuleIndex].inr.color} /> -->
					</div>
					<div class="flex flex-col items-center">
						{#if ruleSet.length > 0}
							<span class="text-sm font-bold">Color:</span>
							<select class="p-1 rounded" bind:value={ruleSet[modifyingRuleIndex].inr.color}>
								{#each colorList as color}
									<option value={color}>{color}</option>
								{/each}
							</select>
							<span class="text-sm font-bold">Shape:</span>
							<select class="p-1 rounded" bind:value={ruleSet[modifyingRuleIndex].inr.type}>
								{#each shapeList as shape}
									<option value={shape}>{shape}</option>
								{/each}
							</select>
						{/if}
						<!-- <span class="text-sm font-bold">Color:</span>
						<select class="p-1 rounded" bind:value={ruleSet[modifyingRuleIndex].inr.color}>
							{#each colorList as color}
								<option value={color}>{color}</option>
							{/each}
						</select>
						<span class="text-sm font-bold">Shape:</span>
						<select class="p-1 rounded" bind:value={ruleSet[modifyingRuleIndex].inr.type}>
							{#each shapeList as shape}
								<option value={shape}>{shape}</option>
							{/each}
						</select> -->
					</div>
				</div>
				<div class="flex gap-4 p-2 rounded w-full justify-between">
					{#if ruleSet.length > 0}
						<div class="flex flex-col justify-center items-center">
							<span class="font-bold">TRM</span>
							<Shape type={ruleSet[modifyingRuleIndex].trm.type} color={ruleSet[modifyingRuleIndex].trm.color} />
						</div>
						<div class="flex flex-col items-center">
							<span class="text-sm font-bold">Color:</span>
							<select class="p-1 rounded" bind:value={ruleSet[modifyingRuleIndex].trm.color}>
								{#each colorList as color}
									<option value={color}>{color}</option>
								{/each}
							</select>
							<span class="text-sm font-bold">Shape:</span>
							<select class="p-1 rounded" bind:value={ruleSet[modifyingRuleIndex].trm.type}>
								{#each shapeList as shape}
									<option value={shape}>{shape}</option>
								{/each}
							</select>
						</div>
					{/if}
				</div>
				<div class="flex gap-4 p-2 rounded w-full justify-between">
					{#if ruleSet.length > 0}
						<div class="flex w-1/3 flex-col justify-center items-center">
							<span class="font-bold">DIR</span>
							<div class="flex h-full items-center justify-center font-bold">
								{#if ruleSet[modifyingRuleIndex].direction === 'right'}
									<span>RIGHT</span>
								{:else}
									<span>LEFT</span>
								{/if}
							</div>
						</div>
						<div class="flex w-2/3 flex-col justify-center items-center">
							<button
								class="px-4 py-2 bg-gray-300 rounded"
								on:click={() => {
									ruleSet[modifyingRuleIndex].direction = ruleSet[modifyingRuleIndex].direction === 'right' ? 'left' : 'right';
								}}>Swap</button
							>
						</div>
					{/if}
				</div>
				<div class="flex gap-4 p-2 rounded w-full justify-between">
					{#if ruleSet.length > 0}
						<div class="flex flex-col justify-center items-center">
							<span class="font-bold">OUTPUT</span>
							<Shape type={ruleSet[modifyingRuleIndex].output.type} color={ruleSet[modifyingRuleIndex].output.color} />
						</div>
						<div class="flex flex-col items-center">
							<span class="text-sm font-bold">Color:</span>
							<select class="p-1 rounded" bind:value={ruleSet[modifyingRuleIndex].output.color}>
								{#each colorList as color}
									<option value={color}>{color}</option>
								{/each}
							</select>
							<span class="text-sm font-bold">Shape:</span>
							<select class="p-1 rounded" bind:value={ruleSet[modifyingRuleIndex].output.type}>
								{#each shapeList as shape}
									<option value={shape}>{shape}</option>
								{/each}
							</select>
						</div>
					{/if}
				</div>
				<div class="flex w-full justify-center gap-2 pt-4">
					<button
						class="px-2 py-1 bg-green-500 rounded text-white"
						on:click={() => {
							title = 'Modify Ruleset';
						}}>Confirm</button
					>
				</div>
			</div>
		</div>
		<div class={title === 'Modify Ruleset' ? 'flex' : 'hidden'}>
			<button
				class="px-2 py-1 bg-green-500 rounded text-white"
				on:click={() => {
					dispatch('confirm', ruleSet);
				}}>Confirm</button
			>
		</div>
	</div>
</div>

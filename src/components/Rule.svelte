<script>
	export let rule = {
		inr: { type: 'square', color: 'black' },
		trm: { type: 'square', color: 'black' },
		direction: 'right',
		output: { type: 'square', color: 'black' },
		condition: { hasCondition: true, type: 'square', color: 'black' }
	};
	export let number = 1;
	import Shape from './Shape.svelte';
</script>

<div class="flex w-full justify-between gap-2 items-center">
	<div class="flex text-xl font-bold"><span>{number}:</span></div>
	<div class="flex flex-grow justify-between gap-3">
		<div class="flex flex-col gap-1 items-center w-12">
			<div class="text-sm font-bold">INR</div>
			<Shape type={rule.inr.type} color={rule.inr.color} />
		</div>
		<div class="flex flex-col gap-1 items-center w-12">
			<div class="text-sm font-bold">TRM</div>
			<Shape type={rule.trm.type} color={rule.trm.color} />
		</div>
		<div class="flex flex-col gap-1 items-center w-12">
			<div class="text-sm font-bold">DIR</div>
			<div class="flex h-full items-center justify-center font-bold">
				{#if rule.direction === 'right'}
					<span>RIGHT</span>
				{:else}
					<span>LEFT</span>
				{/if}
			</div>
		</div>
		<div class="flex flex-col gap-1 items-center w-12">
			<div class="text-sm font-bold">INPUT</div>
			<div class="flex h-full items-center justify-center font-bold">
				<span>INR</span>
			</div>
		</div>
		<div class="flex flex-col gap-1 items-center w-12">
			<div class="text-sm font-bold">OUTPUT</div>
			<Shape type={rule.output.type} color={rule.output.color} />
		</div>
		<div class="flex flex-col gap-1 items-center w-20">
			<div class="text-sm font-bold">CONDITION</div>
			<!-- If rule has condition, render the condition -->
			{#if rule.condition.hasCondition}
				<Shape type={rule.condition.type} color={rule.condition.color} />
				<!-- else, render NONE -->
			{:else}
				<div class="flex h-full items-center justify-center font-bold">
					<span>NONE</span>
				</div>
			{/if}
		</div>
	</div>
</div>

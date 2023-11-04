<script>
	export let direction = 'right';
</script>

<div class="flex h-full text-3xl">
	{#if direction === 'right'}
		<i class="bi bi-arrow-right" />
	{:else}
		<i class="bi bi-arrow-left" />
	{/if}
</div>

<script>
	export let width = 50;
	export let height = 50;
	export let color = 'black';
	export let type = 'square';
	const shapeList = ['square', 'circle', 'lozenge', 'triangle', 'star', 'hexagon', 'pentagon', 'trapezoid'];
	const colorList = ['black', 'red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'brown', 'gray', 'white'];
</script>

<div class="relative">
	<div class="flex">
		<!-- If type = 'square', render an svg square. If type = 'circle', render an svg circle. Same for lozenges and triangles -->
		{#if type === 'square'}
			<svg {width} {height}>
				<rect {width} {height} fill={color} />
			</svg>
		{:else if type === 'circle'}
			<svg {width} {height}>
				<circle cx={width / 2} cy={height / 2} r={width / 2} fill={color} />
			</svg>
		{:else if type === 'lozenge'}
			<svg viewBox="0 0 100 100" {width} {height}>
				<path fill={color} d="M50 0 L100 50 L50 100 L0 50 Z" />
			</svg>
		{:else if type === 'triangle'}
			<svg viewBox="0 0 100 100" {width} {height}>
				<polygon points="50 0 0 100 100 100" fill={color} />
			</svg>
		{:else if type === 'star'}
			<svg viewBox="0 0 100 100" {width} {height}>
				<polygon points="50 0 61.803 38.196 100 38.196 69.098 61.804 80.902 100 50 76.392 19.098 100 30.902 61.804 0 38.196 38.196 38.196" fill={color} />
			</svg>
		{:else if type === 'hexagon'}
			<svg viewBox="0 0 100 100" {width} {height}>
				<polygon points="50 0 100 25 100 75 50 100 0 75 0 25" fill={color} />
			</svg>
		{:else if type === 'pentagon'}
			<svg viewBox="0 0 100 100" {width} {height}>
				<polygon points="50 0 100 38.196 80.902 100 19.098 100 0 38.196" fill={color} />
			</svg>
		{:else if type === 'trapezoid'}
			<svg viewBox="0 0 100 100" {width} {height}>
				<polygon points="25 0 75 0 100 100 0 100" fill={color} />
			</svg>
		{/if}
	</div>
</div>

<script>
	export let width = 50;
	export let height = 50;
	export let color = 'black';
	export let type = 'square';
	const shapeList = ['square', 'circle', 'lozenge', 'triangle', 'star', 'hexagon', 'pentagon', 'trapezoid'];
	const colorList = ['black', 'red', 'blue', 'green', 'yellow', 'orange', 'purple', 'slateblue', 'brown', 'gray'];
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
		{:else if type === 'blob'}
			<svg viewBox="0 0 200 200" {width} {height}>
				<path
					fill={color}
					d="M39.8,-63.5C51.3,-62.2,60.3,-51.1,67.5,-38.9C74.8,-26.7,80.3,-13.3,79.3,-0.5C78.4,12.2,71,24.5,64.5,38C58,51.5,52.4,66.3,41.8,65.2C31.2,64.1,15.6,47,4,40.1C-7.6,33.2,-15.3,36.5,-28.8,39.3C-42.2,42,-61.6,44.4,-67,37.8C-72.5,31.1,-64.2,15.6,-54.3,5.7C-44.5,-4.2,-33.2,-8.4,-30.4,-19.7C-27.6,-31,-33.3,-49.3,-29.7,-55.2C-26.1,-61,-13,-54.3,0.5,-55.3C14.1,-56.2,28.2,-64.8,39.8,-63.5Z"
					transform="translate(100 100)"
				/>
			</svg>
		{/if}
	</div>
</div>

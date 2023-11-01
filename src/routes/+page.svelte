<script>
	import Nav from '../components/Nav.svelte';
	import Shape from '../components/Shape.svelte';
	import Modal from '../components/Modal.svelte';

	const shapeList = ['square', 'circle', 'lozenge', 'triangle', 'star', 'hexagon', 'pentagon', 'trapezoid'];
	const colorList = ['black', 'red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'brown', 'gray'];

	let modalIsActive = false;
	let currentIndex = 0;

	/**
	 * @param {number} length
	 */
	function generateInputString(length) {
		let inputString = [];
		for (let i = 0; i < length; i++) {
			inputString.push({
				type: shapeList[Math.floor(Math.random() * shapeList.length)],
				color: colorList[Math.floor(Math.random() * colorList.length)]
			});
		}
		return inputString;
	}

	const inputString = generateInputString(10);
	let outputString = inputString.map((shape) => {
		return { type: shape.type, color: shape.color };
	});
</script>

<div class="w-full h-screen bg-gray-100 space-y-4">
	<Nav />
	<div class="flex flex-col w-full items-center">
		<h1 class="font-bold text-lg">Input String</h1>
		<div class="flex w-full justify-center">
			<div class="flex gap-3 p-4 overflow-x-auto">
				{#each inputString as shape, _}
					<Shape type={shape.type} color={shape.color} />
				{/each}
			</div>
		</div>
	</div>
	<div class="flex flex-col w-full items-center">
		<h1 class="font-bold text-lg">Ruleset</h1>
	</div>
	<div class="flex flex-col w-full items-center">
		<h1 class="font-bold text-lg">Output String</h1>
		<div class="flex w-full justify-center">
			<div class="flex gap-3 p-4 overflow-x-auto">
				{#each outputString as shape, i}
					<button
						on:click={() => {
							console.log('clicked index ' + i);
							currentIndex = i;
							modalIsActive = true;
						}}
					>
						<Shape type={shape.type} color={shape.color} />
					</button>
				{/each}
			</div>
		</div>
	</div>
	<Modal
		active={modalIsActive}
		{currentIndex}
		{outputString}
		on:cancel={() => {
			modalIsActive = false;
		}}
		on:confirm={(event) => {
			modalIsActive = false;
			outputString = event.detail;
		}}
	/>
</div>

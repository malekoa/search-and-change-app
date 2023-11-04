<script>
	import Nav from '../components/Nav.svelte';
	import Shape from '../components/Shape.svelte';
	import Modal from '../components/Modal.svelte';

	const shapeList = ['square', 'circle', 'lozenge', 'triangle', 'star', 'hexagon', 'pentagon', 'trapezoid'];
	const colorList = ['black', 'red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'brown', 'gray'];

	let ruleSet = {
		inr: {
			type: 'square',
			color: 'red'
		},
		trm: {
			type: 'circle',
			color: 'gray'
		},
		direction: 'left',
		output: {
			type: 'square',
			color: 'black'
		}
	};

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

	let inputString = generateInputString(10);
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
	<div class="flex flex-col items-center">
		<div class="flex flex-col justify-center items-center p-4 bg-gray-300 rounded">
			<h1 class="font-bold text-lg">Ruleset</h1>
			<div class="flex gap-4 items-center">
				<div class="flex text-xl font-bold"><span>Rule 1:</span></div>
				<div class="flex gap-4">
					<div class="flex flex-col gap-1 items-center">
						<div class="text-sm font-bold">INR</div>
						<Shape type={ruleSet.inr.type} color={ruleSet.inr.color} />
					</div>
					<div class="flex flex-col gap-1 items-center">
						<div class="text-sm font-bold">TRM</div>
						<Shape type={ruleSet.trm.type} color={ruleSet.trm.color} />
					</div>
					<div class="flex flex-col gap-1 items-center">
						<div class="text-sm font-bold">DIR</div>
						<div class="flex h-full items-center justify-center font-bold">
							{#if ruleSet.direction === 'right'}
								<span>RIGHT</span>
							{:else}
								<span>LEFT</span>
							{/if}
						</div>
					</div>
					<div class="flex flex-col gap-1 items-center">
						<div class="text-sm font-bold">INPUT</div>
						<div class="flex h-full items-center justify-center font-bold">
							<span>INR</span>
						</div>
					</div>
					<div class="flex flex-col gap-1 items-center">
						<div class="text-sm font-bold">OUTPUT</div>
						<Shape type={ruleSet.output.type} color={ruleSet.output.color} />
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="flex flex-col w-full items-center">
		<h1 class="font-bold text-lg">Output String</h1>
		<div class="flex w-full justify-center">
			<div class="flex gap-3 p-2 overflow-x-auto">
				{#each outputString as shape, i}
					<button
						on:click={() => {
							console.log('clicked index ' + i);
							currentIndex = i;
							modalIsActive = true;
						}}
						class="p-1 border rounded hover:bg-gray-200 transition"
					>
						<Shape type={shape.type} color={shape.color} />
					</button>
				{/each}
			</div>
		</div>
	</div>
	<div class="flex justify-center gap-2">
		<button
			class="p-2 rounded bg-gray-300 border hover:bg-gray-400 transition duration-75 active:bg-gray-300"
			on:click={() => {
				inputString = generateInputString(10);
				outputString = inputString.map((shape) => {
					return { type: shape.type, color: shape.color };
				});
			}}>Generate New Dataset</button
		>
		<button class="p-2 rounded bg-gray-300 border hover:shadow transition">Generate New Ruleset</button>
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

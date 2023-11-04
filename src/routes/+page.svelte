<script>
	import Nav from '../components/Nav.svelte';
	import Shape from '../components/Shape.svelte';
	import Modal from '../components/Modal.svelte';
	import Rule from '../components/Rule.svelte';

	const shapeList = ['square', 'circle', 'lozenge', 'triangle', 'star', 'hexagon', 'pentagon', 'trapezoid'];
	const colorList = ['black', 'red', 'blue', 'green', 'yellow', 'orange', 'purple', 'slateblue', 'brown', 'gray'];

	let settings = {
		minRulesetLength: 1,
		maxRulesetLength: 5,
		minInputStringLength: 5,
		maxInputStringLength: 10,
		allowPartialINR: false,
		allowPartialTRM: false,
		allowPartialOutput: false
	};

	let ruleSet = generateRuleSet(Math.floor(Math.random() * (settings.maxRulesetLength - settings.minRulesetLength + 1)) + settings.minRulesetLength);

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

	function generateRule() {
		let rule = {
			inr: {
				type: shapeList[Math.floor(Math.random() * shapeList.length)],
				color: colorList[Math.floor(Math.random() * colorList.length)]
			},
			trm: {
				type: shapeList[Math.floor(Math.random() * shapeList.length)],
				color: colorList[Math.floor(Math.random() * colorList.length)]
			},
			direction: Math.random() < 0.5 ? 'right' : 'left',
			output: {
				type: shapeList[Math.floor(Math.random() * shapeList.length)],
				color: colorList[Math.floor(Math.random() * colorList.length)]
			}
		};
		return rule;
	}

	/**
	 * @param {number} length
	 */
	function generateRuleSet(length) {
		let ruleSet = [];
		for (let i = 0; i < length; i++) {
			ruleSet.push(generateRule());
		}
		return ruleSet;
	}

	let inputString = generateInputString(Math.floor(Math.random() * (settings.maxInputStringLength - settings.minInputStringLength + 1)) + settings.minInputStringLength);
	let outputString = inputString.map((shape) => {
		return { type: shape.type, color: shape.color };
	});
</script>

<div class="w-full space-y-4 pt-14">
	<Nav {settings} />
	<div class="flex flex-col w-full items-center">
		<h1 class="font-bold text-lg">Input String</h1>
		<div class="flex w-full justify-center">
			<div class="flex gap-3 p-4 overflow-x-auto">
				{#each inputString as shape, _}
					<Shape type={shape.type} color={shape.color} />
				{/each}
			</div>
		</div>
		<button
			class="p-2 rounded bg-gray-300 border hover:bg-gray-400 transition duration-75 active:bg-gray-300"
			on:click={() => {
				inputString = generateInputString(Math.floor(Math.random() * (settings.maxInputStringLength - settings.minInputStringLength + 1)) + settings.minInputStringLength);
				outputString = inputString.map((shape) => {
					return { type: shape.type, color: shape.color };
				});
			}}>Generate New Input String</button
		>
	</div>
	<div class="flex flex-col w-full items-center">
		<h1 class="font-bold text-lg">Output String</h1>
		<div class="flex w-full justify-center">
			<div class="flex gap-2 p-2 overflow-x-auto">
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
		<div class="flex w-full justify-center gap-4">
			<button
				class="p-2 bg-gray-300 rounded"
				on:click={() => {
					outputString = inputString.map((shape) => {
						return { type: shape.type, color: shape.color };
					});
				}}>Reset</button
			>
			<button class="p-2 bg-green-500 text-white rounded">Submit</button>
		</div>
	</div>
	<div class="flex flex-col items-center">
		<div class="flex flex-col justify-center items-center p-4 bg-gray-300 rounded gap-4">
			<div class="flex w-full items-center justify-between">
				<h1 class="font-bold text-lg">Ruleset</h1>
				<button
					class="p-2 rounded bg-gray-500 hover:bg-gray-600 active:bg-gray-500 text-white hover:shadow transition duration-75"
					on:click={() => {
						ruleSet = generateRuleSet(Math.floor(Math.random() * (settings.maxRulesetLength - settings.minRulesetLength + 1)) + settings.minRulesetLength);
					}}
					>Generate New Ruleset
				</button>
			</div>
			{#each ruleSet as rule}
				<Rule {rule} number={ruleSet.indexOf(rule) + 1} />
			{/each}
		</div>
	</div>
	<div class="flex justify-center gap-2" />
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

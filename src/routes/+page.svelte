<script lang="ts">
	import Nav from '../components/Nav.svelte';
	import Shape from '../components/Shape.svelte';
	import Modal from '../components/Modal.svelte';
	import Rule from '../components/Rule.svelte';

	const shapeList = ['square', 'circle', 'lozenge', 'triangle', 'star', 'hexagon', 'pentagon', 'trapezoid', 'blob'];
	const inputShapeList = ['square', 'circle', 'lozenge', 'triangle', 'star', 'hexagon', 'pentagon', 'trapezoid'];
	const colorList = ['black', 'red', 'blue', 'green', 'yellow', 'orange', 'purple', 'slateblue', 'brown', 'gray'];
	const inputColorList = ['black', 'red', 'blue', 'green', 'yellow', 'orange', 'purple', 'slateblue', 'brown'];

	let settings = {
		minRulesetLength: 1,
		maxRulesetLength: 1,
		minInputStringLength: 15,
		maxInputStringLength: 15,
		allowPartialINR: false,
		allowPartialTRM: false,
		allowPartialOutput: false
	};

	let ruleSet = generateRuleSet(Math.floor(Math.random() * (settings.maxRulesetLength - settings.minRulesetLength + 1)) + settings.minRulesetLength);

	let modalIsActive = false;
	let currentIndex = 0;

	function generateInputString(length: number) {
		let inputString = [];
		// for (let i = 0; i < length; i++) {
		// 	inputString.push({
		// 		type: inputShapeList[Math.floor(Math.random() * inputShapeList.length)],
		// 		color: inputColorList[Math.floor(Math.random() * inputColorList.length)]
		// 	});
		// }
		inputString.push({ type: 'circle', color: 'blue' });
		inputString.push({ type: 'square', color: 'black' });
		inputString.push({ type: 'square', color: 'blue' });
		inputString.push({ type: 'square', color: 'blue' });
		inputString.push({ type: 'square', color: 'black' });
		inputString.push({ type: 'circle', color: 'black' });
		inputString.push({ type: 'triangle', color: 'black' });
		inputString.push({ type: 'square', color: 'black' });
		inputString.push({ type: 'triangle', color: 'blue' });

		return inputString;
	}

	function generateRule() {
		let rule = {
			inr: {
				// type: shapeList[Math.floor(Math.random() * shapeList.length)],
				// color: colorList[Math.floor(Math.random() * colorList.length)]
				type: 'square',
				color: 'black'
			},
			trm: {
				// type: shapeList[Math.floor(Math.random() * shapeList.length)],
				// color: colorList[Math.floor(Math.random() * colorList.length)]
				type: 'triangle',
				color: 'gray'
			},
			direction: Math.random() < 0.5 ? 'right' : 'left',
			output: {
				// type: inputShapeList[Math.floor(Math.random() * inputShapeList.length)],
				// color: inputColorList[Math.floor(Math.random() * inputColorList.length)]
				type: 'circle',
				color: 'blue'
			},
			condition: {
				// simple rule: no condition
				hasCondition: false,
				type: shapeList[Math.floor(Math.random() * shapeList.length)],
				color: colorList[Math.floor(Math.random() * colorList.length)]
			}
		};
		return rule;
	}

	function generateRuleSet(length: number) {
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

	function isValidINRIndex(shape: { type: string; color: string }, ruleINR: { type: string; color: string }) {
		return (shape.color === ruleINR.color || ruleINR.color === 'gray') && (shape.type === ruleINR.type || ruleINR.type === 'blob');
	}

	function isAffectedIndex(shape: { type: string; color: string }, rule: { inr: { type: string; color: string }; trm: { type: string; color: string }; direction: string; output: { type: string; color: string }; condition: { hasCondition: boolean; type: string; color: string } }) {
		if ((shape.color === rule.trm.color || rule.trm.color === 'gray') && (shape.type === rule.trm.type || rule.trm.type === 'blob')) {
			if (rule.condition.hasCondition) {
				if (shape.color === rule.condition.color || rule.condition.color === 'gray') {
					if (shape.type === rule.condition.type || rule.condition.type === 'blob') {
						return true;
					}
				}
			} else {
				return true;
			}
		}
		return false;
	}

	function transform(inputString: { type: string; color: string }[], ruleSet: { inr: { type: string; color: string }; trm: { type: string; color: string }; direction: string; output: { type: string; color: string }; condition: { hasCondition: boolean; type: string; color: string } }[]) {
		let outputString = inputString.map((shape) => {
			return { type: shape.type, color: shape.color };
		});
		while (true) {
			let changed = false;
			for (let rule of ruleSet) {
				let inrIndices = [];
				let affectedIndices = [];
				// gather inr indices
				for (let i = 0; i < outputString.length; i++) {
					if (isValidINRIndex(outputString[i], rule.inr)) {
						inrIndices.push(i);
					}
				}
				console.log(inrIndices);
				// gather affected indices
				for (let i of inrIndices) {
					// look right from i+1 in outputString until you find a shape that matches rule's terminator
					for (let j = rule.direction === 'right' ? i + 1 : i; rule.direction === 'right' ? j < outputString.length : j >= 0; rule.direction === 'right' ? j++ : j--) {
						if (isAffectedIndex(outputString[j], rule)) {
							affectedIndices.push(i);
							break;
						}
						// if (outputString[j].color === rule.trm.color || rule.trm.color === 'gray') {
						// 	if (outputString[j].type === rule.trm.type || rule.trm.type === 'blob') {
						// 		// if the rule has a condition and it is satisfied, add i to affectedIndices
						// 		if (rule.condition.hasCondition) {
						// 			if (outputString[j].color === rule.condition.color || rule.condition.color === 'gray') {
						// 				if (outputString[j].type === rule.condition.type || rule.condition.type === 'blob') {
						// 					affectedIndices.push(i);
						// 				}
						// 			}
						// 		} else {
						// 			// if the rule has no condition, add i to affectedIndices
						// 			console.log('adding ' + i + ' to affectedIndices');
						// 			affectedIndices.push(i);
						// 		}
						// 		break;
						// 	}
						// }
					}
				}
				console.log(affectedIndices);
				// rule is applied here
				for (let i of affectedIndices) {
					outputString[i] = { type: rule.output.type, color: rule.output.color };
				}
			}
			break;
		}
		return outputString;
	}
</script>

<div class="w-full space-y-4 pt-14">
	<Nav {settings} />
	<div class="flex flex-col w-full items-center">
		<h1 class="font-bold text-lg">Input String</h1>
		<div class="flex w-full justify-center">
			<div class="flex gap-2 p-4 overflow-x-auto">
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
			<div class="flex gap-2 p-4 overflow-x-auto">
				{#each outputString as shape, i}
					<button
						on:click={() => {
							console.log('clicked index ' + i);
							currentIndex = i;
							modalIsActive = true;
						}}
						class="rounded hover:bg-gray-200 transition"
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
			<button
				class="p-2 bg-red-500 text-white rounded"
				on:click={() => {
					outputString = transform(inputString, ruleSet);
				}}>Solve</button
			>
		</div>
	</div>
	<div class="container mx-auto max-w-sm p-4 bg-gray-300 rounded">
		<div class="flex w-full justify-between items-center">
			<h1 class="font-bold text-lg">Ruleset</h1>
			<button
				class="p-2 rounded bg-gray-500 hover:bg-gray-600 active:bg-gray-500 text-white hover:shadow transition duration-75"
				on:click={() => {
					ruleSet = generateRuleSet(Math.floor(Math.random() * (settings.maxRulesetLength - settings.minRulesetLength + 1)) + settings.minRulesetLength);
				}}
				>Random Ruleset
			</button>
		</div>
		<div class="flex flex-col">
			{#each ruleSet as rule}
				<div class="flex flex-col w-full bg-gray-300 overflow-x-auto py-2.5">
					<Rule {rule} number={ruleSet.indexOf(rule) + 1} />
				</div>
			{/each}
		</div>
	</div>
	<!-- <div class="flex flex-col items-center">
		<div class="flex flex-col justify-center items-center p-4 bg-gray-300 rounded gap-4">
			<div class="flex w-full items-center justify-between">
				<h1 class="font-bold text-lg">Ruleset</h1>
				<button
					class="p-2 rounded bg-gray-500 hover:bg-gray-600 active:bg-gray-500 text-white hover:shadow transition duration-75"
					on:click={() => {
						ruleSet = generateRuleSet(Math.floor(Math.random() * (settings.maxRulesetLength - settings.minRulesetLength + 1)) + settings.minRulesetLength);
					}}
					>Random Ruleset
				</button>
			</div>
			{#each ruleSet as rule}
				<Rule {rule} number={ruleSet.indexOf(rule) + 1} />
			{/each}
		</div>
	</div> -->
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

<script lang="ts">
	import Nav from '../components/Nav.svelte';
	import Shape from '../components/Shape.svelte';
	import Modal from '../components/Modal.svelte';
	import Rule from '../components/Rule.svelte';

	const shapeList = ['square', 'circle', 'lozenge', 'triangle', 'star', 'hexagon', 'pentagon', 'trapezoid', 'any'];
	const colorList = ['black', 'red', 'blue', 'green', 'yellow', 'orange', 'purple', 'slateblue', 'brown', 'gray'];

	let settings = {
		minRulesetLength: 1,
		maxRulesetLength: 3,
		minInputStringLength: 5,
		maxInputStringLength: 10,
		lightningChangesMin: 2,
		allowPartialINR: true,
		allowPartialTRM: true,
		allowPartialOutput: true
	};

	let ruleSet = generateRuleSet(Math.floor(Math.random() * (settings.maxRulesetLength - settings.minRulesetLength + 1)) + settings.minRulesetLength);
	let inputString = generateInputString(Math.floor(Math.random() * (settings.maxInputStringLength - settings.minInputStringLength + 1)) + settings.minInputStringLength);
	let outputString = inputString.map((shape) => {
		return { type: shape.type, color: shape.color };
	});

	let modalIsActive = false;
	let currentIndex = 0;

	function generateInputString(length: number) {
		let inputString = [];
		let shapeListWithNoAny = shapeList.filter((shape) => {
			return shape !== 'any';
		});
		let colorListWithNoGray = colorList.filter((color) => {
			return color !== 'gray';
		});
		for (let i = 0; i < length; i++) {
			inputString.push({
				type: shapeListWithNoAny[Math.floor(Math.random() * shapeListWithNoAny.length)],
				color: colorListWithNoGray[Math.floor(Math.random() * colorListWithNoGray.length)]
			});
		}

		// inputString = [
		// 	{ type: 'circle', color: 'red' },
		// 	{ type: 'circle', color: 'black' }
		// ];

		return inputString;
	}

	function generateRule(allowPartialINR: boolean, allowPartialTRM: boolean, allowPartialOutput: boolean) {
		let colorListWithNoGray: string[] = [];
		let shapeListWithNoAny: string[] = [];
		if (allowPartialINR || allowPartialTRM || allowPartialOutput) {
			colorListWithNoGray = colorList.filter((color) => {
				return color !== 'gray';
			});
			shapeListWithNoAny = shapeList.filter((shape) => {
				return shape !== 'any';
			});
		}
		let rule = {
			inr: { type: '', color: '' },
			trm: { type: '', color: '' },
			direction: '',
			output: { type: '', color: '' },
			condition: { hasCondition: false, type: '', color: '' }
		};
		// generate inr
		if (allowPartialINR) {
			// pick from list of shapes excluding 'any' and pick from list of colors excluding 'gray'
			rule.inr.type = shapeList[Math.floor(Math.random() * (shapeList.length - 1))];
			rule.inr.color = colorList[Math.floor(Math.random() * (colorList.length - 1))];
		} else {
			// pick from list of shapes including 'any' and pick from list of colors including 'gray'
			rule.inr.type = shapeListWithNoAny[Math.floor(Math.random() * shapeListWithNoAny.length)];
			rule.inr.color = colorListWithNoGray[Math.floor(Math.random() * colorListWithNoGray.length)];
		}
		// generate trm
		if (allowPartialTRM) {
			// pick from list of shapes excluding 'any' and pick from list of colors excluding 'gray'
			rule.trm.type = shapeList[Math.floor(Math.random() * (shapeList.length - 1))];
			rule.trm.color = colorList[Math.floor(Math.random() * (colorList.length - 1))];
		} else {
			// pick from list of shapes including 'any' and pick from list of colors including 'gray'
			rule.trm.type = shapeListWithNoAny[Math.floor(Math.random() * shapeListWithNoAny.length)];
			rule.trm.color = colorListWithNoGray[Math.floor(Math.random() * colorListWithNoGray.length)];
		}
		// generate direction
		rule.direction = Math.random() < 0.5 ? 'right' : 'left';
		// generate output
		if (allowPartialOutput) {
			// pick from list of shapes excluding 'any' and pick from list of colors excluding 'gray'
			rule.output.type = shapeList[Math.floor(Math.random() * (shapeList.length - 1))];
			rule.output.color = colorList[Math.floor(Math.random() * (colorList.length - 1))];
		} else {
			// pick from list of shapes including 'any' and pick from list of colors including 'gray'
			rule.output.type = shapeListWithNoAny[Math.floor(Math.random() * shapeListWithNoAny.length)];
			rule.output.color = colorListWithNoGray[Math.floor(Math.random() * colorListWithNoGray.length)];
		}
		// console.log('forcing inr to be any color any shape');
		// rule.inr = { type: 'any', color: 'gray' };
		return rule;
	}

	function generateRuleSet(length: number) {
		let ruleSet = [];
		for (let i = 0; i < length; i++) {
			ruleSet.push(generateRule(settings.allowPartialINR, settings.allowPartialTRM, settings.allowPartialOutput));
		}
		// ruleSet[0].inr = { type: 'circle', color: 'red' };
		// ruleSet[0].trm = { type: 'circle', color: 'black' };
		// ruleSet[0].output = { type: 'circle', color: 'orange' };
		// ruleSet[0].direction = 'right';

		// ruleSet.push({
		// 	inr: { type: 'circle', color: 'orange' },
		// 	trm: { type: 'circle', color: 'black' },
		// 	direction: 'right',
		// 	output: { type: 'circle', color: 'red' },
		// 	condition: { hasCondition: false, type: '', color: '' }
		// });

		return ruleSet;
	}

	function solve(inputString: { type: string; color: string }[], ruleSet: { inr: { type: string; color: string }; trm: { type: string; color: string }; direction: string; output: { type: string; color: string }; condition: { hasCondition: boolean; type: string; color: string } }[]) {
		// console.log('solving...');
		let s = inputString.map((shape) => {
			return { type: shape.type, color: shape.color };
		});
		let stepTracker: { type: string; color: string }[][] = [];
		while (true) {
			let shouldBreak = true;
			for (let rule of ruleSet) {
				let inrIndices = [];
				for (let i = 0; i < s.length; i++) {
					if ((s[i].type === rule.inr.type || rule.inr.type === 'any') && (s[i].color === rule.inr.color || rule.inr.color === 'gray')) {
						inrIndices.push(i);
					}
				}
				for (let i of inrIndices) {
					let affectedIndices = [];
					let dir = rule.direction === 'right' ? true : false;
					for (let j = dir ? i + 1 : i - 1; dir ? j < s.length : j >= 0; dir ? j++ : j--) {
						if ((s[j].type === rule.trm.type || rule.trm.type === 'any') && (s[j].color === rule.trm.color || rule.trm.color === 'gray')) {
							if (rule.condition.hasCondition) {
								// TODO: implement conditional rules
							}
							affectedIndices.push(i);
						}
					}
					for (let i of affectedIndices) {
						if (s[i].type !== rule.output.type || s[i].color !== rule.output.color) {
							s[i] = { type: rule.output.type, color: rule.output.color };
							if (stringIsInArray(s, stepTracker)) {
								console.log('loop detected: ', s);
								alert('Loop detected: String/Ruleset pair has no solution. See console for details.');
								return s;
							} else {
								stepTracker.push(
									s.map((shape) => {
										return { type: shape.type, color: shape.color };
									})
								);
								console.log(stepTracker);
								shouldBreak = false;
							}
						}
					}
				}
			}
			if (shouldBreak) {
				break;
			}
		}
		// console.log('done solving');
		return s;
	}

	function stringIsInArray(string: { type: string; color: string }[], arr: { type: string; color: string }[][]) {
		for (let s of arr) {
			if (stringsAreEqual(string, s)) {
				return true;
			}
		}
		return false;
	}

	function stringsAreEqual(string1: { type: string; color: string }[], string2: { type: string; color: string }[]) {
		if (string1.length !== string2.length) {
			return false;
		}
		for (let i = 0; i < string1.length; i++) {
			if (string1[i].type !== string2[i].type || string1[i].color !== string2[i].color) {
				return false;
			}
		}
		return true;
	}

	function lightning() {
		// lightning will generate a random string, then generate rulesets until it finds one that
		// let { testInputString, testRuleSet } = generateValidProblem();
		inputString = generateInputString(Math.floor(Math.random() * (settings.maxInputStringLength - settings.minInputStringLength + 1)) + settings.minInputStringLength);
		ruleSet = generateRuleSet(Math.floor(Math.random() * (settings.maxRulesetLength - settings.minRulesetLength + 1)) + settings.minRulesetLength);
		let o = solve(inputString, ruleSet);
		let i = 0;
		while (stringsAreEqual(inputString, o)) {
			ruleSet = generateRuleSet(Math.floor(Math.random() * (settings.maxRulesetLength - settings.minRulesetLength + 1)) + settings.minRulesetLength);
			o = solve(inputString, ruleSet);
			i++;
		}
		console.log('generated valid problem after ' + i + ' tries');
		outputString = inputString.map((shape) => {
			return { type: shape.type, color: shape.color };
		});
	}
</script>

<div class="w-full space-y-4 pt-14">
	<Nav {settings} {lightning} />
	<div class="flex flex-col w-full items-center">
		<div class="flex gap-2 items-center">
			<h1 class="font-bold text-lg">Input String</h1>
			<button
				class="px-2 py-1 bg-gray-100 border hover:bg-gray-200 rounded transition"
				on:click={() => {
					alert('Custom input strings not implemented yet.');
				}}><i class="bi bi-pencil" /></button
			>
		</div>
		<div class="flex w-full justify-center">
			<div class="flex gap-2 p-4 overflow-x-auto">
				{#each inputString as shape, _}
					<Shape type={shape.type} color={shape.color} />
				{/each}
			</div>
		</div>
		<!-- <button
			class="p-2 rounded bg-gray-100 border hover:bg-gray-200 transition duration-75 active:bg-gray-300"
			on:click={() => {
				// inputString = generateInputString(Math.floor(Math.random() * (settings.maxInputStringLength - settings.minInputStringLength + 1)) + settings.minInputStringLength);
				// outputString = inputString.map((shape) => {
				// 	return { type: shape.type, color: shape.color };
				// });
				let { testInputString, testRuleSet } = generateValidProblem();
				inputString = testInputString;
				outputString = testInputString.map((shape) => {
					return { type: shape.type, color: shape.color };
				});
				ruleSet = testRuleSet;
			}}>Generate Random Input String</button
		> -->
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
					outputString = solve(inputString, ruleSet);
				}}>Solve</button
			>
		</div>
	</div>
	<div class="container mx-auto max-w-sm p-4 bg-gray-100 rounded">
		<div class="flex w-full justify-between items-center">
			<h1 class="font-bold text-lg">Ruleset</h1>
			<div class="flex gap-2">
				<button
					class="px-2 py-1 rounded bg-gray-100 border hover:bg-gray-200 hover:shadow transition duration-75"
					on:click={() => {
						alert('Custom rulesets not implemented yet.');
					}}
				>
					<i class="bi bi-pencil" />
				</button>
				<button
					class="px-2 py-1 rounded bg-gray-100 border hover:bg-gray-200 hover:shadow transition duration-75"
					on:click={() => {
						ruleSet = generateRuleSet(Math.floor(Math.random() * (settings.maxRulesetLength - settings.minRulesetLength + 1)) + settings.minRulesetLength);
					}}
				>
					<i class="bi bi-shuffle" />
				</button>
			</div>
		</div>
		<div class="flex flex-col">
			{#each ruleSet as rule}
				<div class="flex flex-col w-full bg-gray-100 overflow-x-auto py-2.5">
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

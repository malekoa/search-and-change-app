<script lang="ts">
	import Nav from '../components/Nav.svelte';
	import Shape from '../components/Shape.svelte';
	import Modal from '../components/Modal.svelte';
	import Rule from '../components/Rule.svelte';
	import InputModal from '../components/InputModal.svelte';
	import RuleModal from '../components/RuleModal.svelte';
	import StepsModal from '../components/StepsModal.svelte';

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
	let inputModalIsActive = false;
	let currentIndex = 0;
	let inputModalIndex = 0;
	let ruleModalIsActive = false;
	let stepsModalIsActive = false;

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
								return stepTracker;
							} else {
								stepTracker.push(
									s.map((shape) => {
										return { type: shape.type, color: shape.color };
									})
								);
								// console.log(stepTracker);
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
		return stepTracker;
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

	function generateValidProblem() {
		let iterations = 0;
		while (true) {
			iterations += 1;
			let inputString = generateInputString(Math.floor(Math.random() * (settings.maxInputStringLength - settings.minInputStringLength + 1)) + settings.minInputStringLength);
			let ruleSet = generateRuleSet(Math.floor(Math.random() * (settings.maxRulesetLength - settings.minRulesetLength + 1)) + settings.minRulesetLength);
			if (settings.allowPartialINR && Math.random() > 0.25) {
				Math.random() > 0.5 ? (ruleSet[0].inr.type = 'any') : (ruleSet[0].inr.color = 'gray');
			}
			if (settings.allowPartialTRM && Math.random() > 0.25) {
				Math.random() > 0.5 ? (ruleSet[0].trm.type = 'any') : (ruleSet[0].trm.color = 'gray');
			}
			let o = solve(inputString, ruleSet);
			if (o.length >= settings.lightningChangesMin) {
				console.log('generated valid problem in ' + iterations + ' tries');
				return { validInputString: inputString, validRuleSet: ruleSet };
			}
		}
	}

	function lightning() {
		// finds a valid problem and sets the inputString, outputString, and ruleSet to the valid problem
		let { validInputString, validRuleSet } = generateValidProblem();
		inputString = validInputString;
		outputString = validInputString.map((shape) => {
			return { type: shape.type, color: shape.color };
		});
		ruleSet = validRuleSet;
	}
</script>

<div class="w-full space-y-4 pt-14">
	<Nav {settings} {lightning} />
	<div class="flex flex-col w-full items-center">
		<div class="flex gap-2 items-center">
			<h1 class="font-bold text-lg">Input String</h1>
		</div>
		<div class="flex w-full justify-center">
			<div class="flex gap-2 p-4 overflow-x-auto">
				{#each inputString as shape, index}
					<button
						on:click={() => {
							console.log(`clicked index ${index}`);
							inputModalIndex = index;
							inputModalIsActive = true;
						}}
					>
						<Shape type={shape.type} color={shape.color} />
					</button>
				{/each}
				<div class="flex justify-center items-center w-12">
					<button
						class="flex justify-center items-center w-10 h-10 border rounded-full hover:bg-gray-200 transition active:bg-gray-100"
						on:click={() => {
							inputString = [
								...inputString,
								{
									type: shapeList[Math.floor(Math.random() * shapeList.length)],
									color: colorList[Math.floor(Math.random() * colorList.length)]
								}
							];
						}}
					>
						<i class="bi bi-plus-lg" />
					</button>
				</div>
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
			<button
				class="p-2 bg-green-500 text-white rounded"
				on:click={() => {
					let o = solve(inputString, ruleSet);
					if (o.length > 0) {
						// check if the outputString is the same as the last step in the solution
						if (stringsAreEqual(outputString, o[o.length - 1])) {
							alert('Correct!');
						} else {
							alert('Incorrect');
						}
					} else {
						alert('Correct!');
					}
				}}>Submit</button
			>
			<button
				class="p-2 bg-red-500 text-white rounded"
				on:click={() => {
					stepsModalIsActive = true;
					let o = solve(inputString, ruleSet);
					if (o.length > 0) {
						outputString = o[o.length - 1];
					}
				}}>Show Derivation</button
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
						ruleModalIsActive = true;
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
	<InputModal
		{inputString}
		editIndex={inputModalIndex}
		active={inputModalIsActive}
		on:delete={() => {
			inputModalIsActive = false;
			inputString.splice(inputModalIndex, 1);
		}}
		on:confirm={(event) => {
			inputString = event.detail;
			inputModalIsActive = false;
			console.log(inputString);
		}}
	/>
	<RuleModal
		{ruleSet}
		active={ruleModalIsActive}
		on:delete={(event) => {
			ruleSet = event.detail;
		}}
		on:confirm={(event) => {
			ruleSet = event.detail;
			ruleModalIsActive = false;
		}}
	/>
	<StepsModal
		active={stepsModalIsActive}
		{inputString}
		steps={solve(inputString, ruleSet)}
		on:close={() => {
			stepsModalIsActive = false;
		}}
	/>
</div>

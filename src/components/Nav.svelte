<script>
	export let menuIsOpen = false;
	const standardSettings = {
		minRulesetLength: 1,
		maxRulesetLength: 5,
		minInputStringLength: 5,
		maxInputStringLength: 10,
		lightningChangesMin: 1,
		allowPartialINR: false,
		allowPartialTRM: false,
		allowPartialOutput: false
	};
	/**
	 * @type {{ minRulesetLength: number; maxRulesetLength: number; minInputStringLength: number; maxInputStringLength: number; lightningChangesMin: number; allowPartialINR: any; allowPartialTRM: any; allowPartialOutput: any; }}
	 */
	export let settings;

	/**
	 * @type {() => void}
	 */
	export let lightning;

	function resetSettings() {
		settings.minRulesetLength = standardSettings.minRulesetLength;
		settings.maxRulesetLength = standardSettings.maxRulesetLength;
		settings.minInputStringLength = standardSettings.minInputStringLength;
		settings.maxInputStringLength = standardSettings.maxInputStringLength;
		settings.allowPartialINR = standardSettings.allowPartialINR;
		settings.allowPartialTRM = standardSettings.allowPartialTRM;
		settings.allowPartialOutput = standardSettings.allowPartialOutput;
	}

	function validateLengths() {
		// ensure that lengths constitute a valid range
		if (settings.minRulesetLength > settings.maxRulesetLength) {
			settings.maxRulesetLength = settings.minRulesetLength;
		}
		if (settings.minInputStringLength > settings.maxInputStringLength) {
			settings.maxInputStringLength = settings.minInputStringLength;
		}
		// ensure that the lengths are not negative
		if (settings.minRulesetLength < 0) {
			settings.minRulesetLength = 0;
		}
		if (settings.maxRulesetLength < 0) {
			settings.maxRulesetLength = 0;
		}
		if (settings.minInputStringLength < 0) {
			settings.minInputStringLength = 0;
		}
		if (settings.maxInputStringLength < 0) {
			settings.maxInputStringLength = 0;
		}
		if (settings.lightningChangesMin < 0) {
			settings.lightningChangesMin = 0;
		}
	}

	function toggleMenu() {
		menuIsOpen = !menuIsOpen;
	}

	/**
	 * @param {{ stopPropagation: () => void; }} event
	 */
	function handleDivClick(event) {
		event.stopPropagation();
	}
</script>

<nav class="flex fixed justify-between items-center w-full h-14 bg-gray-100 px-4 z-10 top-0 border-b">
	<div class="text-xl font-bold">Search & Change</div>
	<div class="flex gap-2">
		<button
			class="flex w-10 h-10 justify-center items-center relative bg-gray-100 border rounded hover:bg-gray-200 transition"
			on:click={() => {
				lightning();
			}}
		>
			<i class="bi bi-lightning-charge" />
		</button>
		<!-- <button
			class="flex w-10 h-10 justify-center items-center relative bg-gray-100 border rounded hover:bg-gray-200 transition"
			on:click={() => {
				alert('load not implemented yet');
			}}
		>
			<i class="bi bi-folder text-xl" />
		</button>
		<button
			class="flex w-10 h-10 justify-center items-center relative bg-gray-100 border rounded hover:bg-gray-200 transition"
			on:click={() => {
				alert('save not implemented yet');
			}}
		>
			<i class="bi bi-floppy text-xl" />
		</button> -->
		<button class="flex w-10 h-10 justify-center items-center relative bg-gray-100 border rounded hover:bg-gray-200 transition" on:click={toggleMenu}>
			<i class="bi bi-gear text-xl" />
			<div class="fixed {menuIsOpen ? 'flex flex-col' : 'hidden'} p-4 top-14 right-0 bg-gray-100 w-screen sm:w-96 rounded-bl rounded-br border-b border-r border-l hover:cursor-default items-start z-10 gap-2" on:click={handleDivClick} role="button" tabindex="0" on:keydown={handleDivClick}>
				<div class="flex w-full justify-between items-center">
					<h1 class="font-bold text-xl">Settings</h1>
					<div
						class="p-2 bg-gray-100 border hover:bg-gray-200 transition rounded"
						role="button"
						tabindex="0"
						on:keydown={(event) => {
							if (event.key === 'Enter') {
								resetSettings();
							}
						}}
						on:click={() => {
							resetSettings();
						}}
					>
						Reset
					</div>
				</div>
				<div class="flex flex-col w-full justify-center gap-2">
					<div class="font-bold">Input String Length</div>
					<div class="flex w-full justify-center gap-4">
						<div>
							<span>Minimum:</span>
							<input
								type="number"
								class="p-1 w-20 rounded"
								bind:value={settings.minInputStringLength}
								on:change={() => {
									validateLengths();
								}}
							/>
						</div>
						<div>
							<span>Maximum:</span>
							<input
								type="number"
								class="p-1 w-20 rounded"
								bind:value={settings.maxInputStringLength}
								on:change={() => {
									validateLengths();
								}}
							/>
						</div>
					</div>
				</div>
				<div class="flex flex-col w-full justify-center gap-2">
					<div class="font-bold">Ruleset Length</div>
					<div class="flex w-full justify-center gap-4">
						<div>
							<span>Minimum:</span>
							<input
								type="number"
								class="p-1 w-20 rounded"
								bind:value={settings.minRulesetLength}
								on:change={() => {
									if (settings.minRulesetLength > settings.maxRulesetLength) {
										settings.maxRulesetLength = settings.minRulesetLength;
									}
								}}
							/>
						</div>
						<div>
							<span>Maximum:</span>
							<input
								type="number"
								class="p-1 w-20 rounded"
								bind:value={settings.maxRulesetLength}
								on:change={() => {
									if (settings.maxRulesetLength < settings.minRulesetLength) {
										settings.minRulesetLength = settings.maxRulesetLength;
									}
								}}
							/>
						</div>
					</div>
				</div>
				<div class="flex flex-col w-full justify-center gap-2">
					<div class="font-bold">Minimum Lightning Transformations:</div>
					<div class="flex w-full justify-center gap-4">
						<div>
							<span>Minimum:</span>
							<input
								type="number"
								class="p-1 w-20 rounded"
								bind:value={settings.lightningChangesMin}
								on:change={() => {
									if (settings.lightningChangesMin < 0) {
										settings.lightningChangesMin = 0;
									}
								}}
							/>
						</div>
					</div>
				</div>
				<div class="flex flex-col w-full justify-center gap-2">
					<div class="font-bold">Partials</div>
					<div class="flex flex-col w-full items-center gap-2">
						<div class="flex gap-2">
							<div>Allow Partial INR</div>
							<input type="checkbox" bind:checked={settings.allowPartialINR} />
						</div>
						<div class="flex gap-2">
							<div>Allow Partial TRM</div>
							<input type="checkbox" bind:checked={settings.allowPartialTRM} />
						</div>
						<div class="flex gap-2">
							<div>Allow Partial Output</div>
							<input type="checkbox" bind:checked={settings.allowPartialOutput} />
						</div>
					</div>
				</div>
			</div>
		</button>
	</div>
</nav>

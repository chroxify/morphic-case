<script lang="ts">
	import {
		filteredOptions,
		filteredSettings,
		isOptionSelectionActive,
		isSettingSelectionActive
	} from '$lib/store';

	// Define the type for settingKeywords
	type SettingKeywords = {
		[key: string]: string[];
	};

	// Prop for settingKeywords
	export let settingKeywords: SettingKeywords;
	let inputElement: HTMLDivElement;
	let selectedSetting = '';

	// Function to handle input changes
	function handleInput() {
		if (!inputElement) return;
		const text = inputElement.innerText;

		// Get the current element selection
		const selection = window.getSelection();
		if (!selection || selection.rangeCount === 0) return;
		const range = selection.getRangeAt(0);
		let currentNode = range.startContainer;

		// Check if we're inside a span
		let currentSpan: HTMLElement | null = null;
		while (currentNode && currentNode !== inputElement) {
			if (
				currentNode.nodeType === Node.ELEMENT_NODE &&
				(currentNode as HTMLElement).tagName === 'SPAN'
			) {
				currentSpan = currentNode as HTMLElement;
				break;
			}
			currentNode = currentNode.parentNode as Node;
		}

		if (currentSpan) {
			// We're inside a setting span
			const spanContent = currentSpan.textContent || '';
			const colonIndex = spanContent.indexOf(':');

			if (colonIndex !== -1) {
				const setting = spanContent.slice(1, colonIndex); // Remove '@' and ':'
				const optionSearch = spanContent.slice(colonIndex + 1);

				selectedSetting = setting.trim();
				isSettingSelectionActive.set(false);
				isOptionSelectionActive.set(true);

				filteredOptions.update(
					() =>
						settingKeywords[selectedSetting]?.filter((option) =>
							option.toLowerCase().includes(optionSearch.toLowerCase())
						) || []
				);
			} else {
				// Show setting selection if there's no colon
				selectedSetting = spanContent.slice(1);
				isOptionSelectionActive.set(false);
				isSettingSelectionActive.set(true);
				filteredSettings.update(() =>
					Object.keys(settingKeywords).filter((keyword) =>
						keyword.toLowerCase().includes(spanContent.toLowerCase())
					)
				);
			}
		} else {
			// We're not inside a span, check for new setting selection
			const lastAtIndex = text.lastIndexOf('@');
			if (lastAtIndex !== -1) {
				const inputTerm = text.slice(lastAtIndex + 1);
				if (!inputTerm.includes(':')) {
					// Setting selection mode
					isSettingSelectionActive.set(true);
					isOptionSelectionActive.set(false);
					filteredSettings.update(() =>
						Object.keys(settingKeywords).filter((keyword) =>
							keyword.toLowerCase().includes(inputTerm.toLowerCase())
						)
					);
				} else {
					// Reset states if there's a ':' but we're not in a span
					isSettingSelectionActive.set(false);
					isOptionSelectionActive.set(false);
					filteredSettings.set([]);
					filteredOptions.set([]);
				}
			} else {
				// Reset all states
				isSettingSelectionActive.set(false);
				isOptionSelectionActive.set(false);
				filteredSettings.set([]);
				filteredOptions.set([]);
			}
		}
	}

	export function insertSpan(content: string, isSetting: boolean = true) {
		if (!inputElement) return;

		// Get the current element selection
		const selection = window.getSelection();
		if (!selection || selection.rangeCount === 0) return;

		const range = selection.getRangeAt(0);

		if (isSetting) {
			// Find the '@{setting}' text and replace it with the span
			const html = inputElement.innerHTML;
			const lastAtIndex = html.lastIndexOf('@');
			if (lastAtIndex !== -1) {
				const htmlBeforeSetting = html.slice(0, lastAtIndex);
				const htmlAfterSetting = html.slice(lastAtIndex + content.length + 1);

				// Create the setting span
				const span = document.createElement('span');
				span.innerHTML = `@${content}:`;
				span.className =
					'inline-flex items-center px-1 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 border border-gray-300 mr-1';
				span.contentEditable = 'true'; // Make the span editable

				// Clear the input element
				inputElement.innerHTML = '';

				// Reconstruct the content with the new span
				const htmlBeforeNode = document.createRange().createContextualFragment(htmlBeforeSetting);
				const htmlAfterNode = document.createRange().createContextualFragment(htmlAfterSetting);
				inputElement.appendChild(htmlBeforeNode);
				inputElement.appendChild(span);
				inputElement.appendChild(htmlAfterNode);

				// Move cursor to the end of the span
				const newRange = document.createRange();
				if (span.firstChild && span.textContent) {
					newRange.setStart(span.firstChild, span.textContent.length);
				}
				if (span.firstChild && span.textContent) {
					newRange.setEnd(span.firstChild, span.textContent.length);
				}
				selection.removeAllRanges();
				selection.addRange(newRange);
			}
		} else {
			// Find the parent span if it exists
			let currentNode = range.startContainer;
			while (currentNode && currentNode.nodeType !== Node.ELEMENT_NODE) {
				currentNode = currentNode.parentNode as Node;
			}

			if (currentNode && currentNode.nodeName === 'SPAN') {
				// Get selected setting
				const setting = (currentNode as HTMLElement).textContent?.slice(
					1,
					currentNode.textContent?.indexOf(':')
				);

				// Set the span content by replacing the current span
				(currentNode as HTMLElement).textContent = `@${setting}:${content}`;

				// Make the span uneditable
				(currentNode as HTMLElement).contentEditable = 'false';

				// Move cursor after the span
				const newRange = document.createRange();
				newRange.setStartAfter(currentNode);
				newRange.setEndAfter(currentNode);
				selection.removeAllRanges();
				selection.addRange(newRange);

				// Insert a space after the span (&nsbp; in unicode)
				const spaceNode = document.createTextNode('\u00A0');
				newRange.insertNode(spaceNode);
				newRange.setStartAfter(spaceNode);
				newRange.setEndAfter(spaceNode);
				selection.removeAllRanges();
				selection.addRange(newRange);

				// Reset option selection state
				isOptionSelectionActive.set(false);
				filteredOptions.set([]);
			}
		}

		inputElement.focus();
		handleInput();
	}
</script>

<div class="w-full h-[40px] px-2 mt-2 flex items-center justify-center relative">
	<div
		tabindex="0"
		bind:this={inputElement}
		contenteditable="true"
		class="w-full h-[40px] text-sm bg-transparent border no-scrollbar rounded-[6px] text-foreground px-2 scroll-px-2 outline-none transition-all relative input-content"
		on:input={handleInput}
		on:keydown={(e) => {
			if (e.key === 'Enter') {
				e.preventDefault();
			}
		}}
		role="textbox"
		aria-multiline="false"
		data-placeholder="Imagine..."
	></div>
</div>

<style>
	.input-content {
		white-space: nowrap;
		overflow-x: auto;
		overflow-y: hidden;
		padding-top: 8.5px;
		-ms-overflow-style: none; /* IE and Edge */
		scrollbar-width: none; /* Firefox */
	}

	.input-content::-webkit-scrollbar {
		display: none;
	}

	/* Placeholder */
	.input-content:empty::before {
		content: attr(data-placeholder);
		color: hsl(var(--muted-foreground));
		pointer-events: none;
		position: absolute;
		top: 0;
		left: 0.5rem;
		line-height: 38px;
	}

	@keyframes blink {
		0%,
		100% {
			opacity: 0;
		}
		50% {
			opacity: 1;
		}
	}
</style>

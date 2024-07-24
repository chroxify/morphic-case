<script lang="ts">
	import {
		filteredOptions,
		filteredSettings,
		inputValue,
		isOptionSelectionActive,
		isSettingSelectionActive
	} from '$lib/store';
	import { createEventDispatcher, tick } from 'svelte';

	// Define the type for settingKeywords
	type SettingKeywords = {
		[key: string]: string[];
	};

	// Event dispatcher
	const dispatch = createEventDispatcher();

	// Prop for settingKeywords
	export let settingKeywords: SettingKeywords;
	let inputElement: HTMLDivElement;
	let selectedSetting = '';

	// Function to handle input changes
	function handleInput() {
		if (!inputElement) return;
		const text = inputElement.innerText;
		inputValue.set(text);

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

	async function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Backspace') {
			const selection = window.getSelection();
			if (selection && selection.rangeCount > 0) {
				const range = selection.getRangeAt(0);

				// Check if we're at the start of a text node
				if (range.startOffset === 0) {
					let currentNode = range.startContainer;

					// If we're in a text node, move to its parent
					if (currentNode.nodeType === Node.TEXT_NODE) {
						currentNode = currentNode.parentNode as Node;
					}

					// Look for the previous sibling that's not empty text
					let prevNode = currentNode.previousSibling;
					while (
						prevNode &&
						prevNode.nodeType === Node.TEXT_NODE &&
						(prevNode.textContent?.trim() || '') === ''
					) {
						prevNode = prevNode.previousSibling;
					}

					if (
						prevNode &&
						prevNode.nodeType === Node.ELEMENT_NODE &&
						(prevNode as Element).tagName === 'SPAN'
					) {
						// We're right after a span, so delete it
						event.preventDefault();
						prevNode.remove();
						await tick();
						handleInput();
					}
					// If we're not right after a span, let the default backspace behavior happen
				} else {
					// We're in the middle of a text node, let the default backspace behavior happen
				}
			}
		}
	}

	export function insertSpan(content: string, isSetting: boolean = true) {
		console.log('insertSpan', content, isSetting);
		if (!inputElement) return;

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

				// Move cursor inside the span
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
				// Insert content into existing span
				const textNode = document.createTextNode(content);
				range.insertNode(textNode);

				// Make the span uneditable
				(currentNode as HTMLElement).contentEditable = 'false';

				// Move cursor after the span
				const newRange = document.createRange();
				newRange.setStartAfter(currentNode);
				newRange.setEndAfter(currentNode);
				selection.removeAllRanges();
				selection.addRange(newRange);

				// Insert a space after the span
				const spaceNode = document.createTextNode(' ');
				newRange.insertNode(spaceNode);
				newRange.setStartAfter(spaceNode);
				newRange.setEndAfter(spaceNode);
				selection.removeAllRanges();
				selection.addRange(newRange);

				// Reset option selection state
				isOptionSelectionActive.set(false);
				filteredOptions.set([]);
			} else {
				// If not in a span, just insert the text
				const textNode = document.createTextNode(content);
				range.insertNode(textNode);
				range.setStartAfter(textNode);
				range.setEndAfter(textNode);
				selection.removeAllRanges();
				selection.addRange(range);
			}
		}

		inputElement.focus();
		handleInput();

		// Dispatch event to parent component
		dispatch('spanInserted', { content, isSetting });
	}

	inputValue.subscribe((value) => {
		console.log(value);
		// if (inputElement && inputElement.innerText !== value) {
		// 	// inputElement.innerText = value;

		// 	// If there is @{text}:{text} in the input, insert it as a span
		// 	const lastAtIndex = value.lastIndexOf('@');
		// 	if (lastAtIndex !== -1) {
		// 		const inputTerm = value.slice(lastAtIndex + 1);
		// 		if (inputTerm.includes(':')) {
		// 			const [setting, option] = inputTerm.split(':');
		// 			insertSpan(setting + ':' + option);
		// 		}
		// 	}
		// }
	});
</script>

<div class="w-full h-[40px] px-2 mt-2 flex items-center justify-center relative">
	<!-- <input
		id="inputField"
		type="text"
		class="w-full h-[40px] bg-transparent border rounded-[6px] text-foreground px-2 outline-none focus-visible:ring-1 focus-visible:ring-ring transition-all"
		placeholder="Imagine..."
		on:input={handleInput}
		bind:value={$inputValue}
	/> -->
	<div
		tabindex="0"
		bind:this={inputElement}
		contenteditable="true"
		class="w-full h-[40px] text-sm bg-transparent border rounded-[6px] text-foreground px-2 overflow-y-auto outline-none transition-all relative input-content"
		on:input={handleInput}
		on:keydown={handleKeydown}
		role="textbox"
		aria-multiline="true"
		data-placeholder="Imagine..."
	></div>
</div>

<style>
	.input-content {
		white-space: pre-wrap;
		word-break: break-word;
		padding-top: 8.5px; /* Use padding as display flex breaks something with the cursor */
	}

	.input-content:empty::before {
		content: attr(data-placeholder);
		color: #888;
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

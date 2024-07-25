import { writable } from 'svelte/store';

export const isSettingSelectionActive = writable<boolean>(false);
export const isOptionSelectionActive = writable<boolean>(false);
export const filteredSettings = writable<string[]>([]);
export const filteredOptions = writable<string[]>([]);

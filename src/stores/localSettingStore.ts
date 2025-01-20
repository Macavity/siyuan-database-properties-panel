import { writable } from "svelte/store";

export const isCollapsed = writable<boolean>(false);

export const lastSelectedAttributeView = writable<string | null>(null);

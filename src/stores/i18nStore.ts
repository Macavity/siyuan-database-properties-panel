import { writable } from "svelte/store";
import { I18N } from "@/types/i18n";

export const i18nStore = writable<I18N>();

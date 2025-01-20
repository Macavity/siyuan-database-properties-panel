import { SettingsDTO } from "@/types/dto/SettingsDTO";
import { derived, writable } from "svelte/store";

export const documentSettingStore = writable<Map<string, SettingsDTO>>(
  new Map(),
);

export const isDocumentCollapsed = (documentId: string) =>
  derived(documentSettingStore, ($documents) => {
    const settings = $documents.get(documentId);
    return settings ? settings.isCollapsed : false;
  });

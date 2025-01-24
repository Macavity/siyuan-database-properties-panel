import { writable, get, derived } from "svelte/store";
import { LoggerService } from "@/services/LoggerService";

const logger = new LoggerService("DocumentSettingsStore");

interface DocumentSettings {
  [documentId: string]: {
    overrideShowEmptyAttributes: boolean | null;
  };
}

function createDocumentSettingsStore() {
  const { subscribe, set, update } = writable<DocumentSettings>({});
  const store = {
    subscribe,
    set,
    update,
    toggleShowEmptyAttributes: (
      documentId: string,
      globalShowEmptyAttributes: boolean
    ) => {
      update((settings) => {
        const currentSettings = settings[documentId] || {
          overrideShowEmptyAttributes: null,
        };
        const currentValue = currentSettings.overrideShowEmptyAttributes;

        // If null, start with opposite of global setting
        const newValue =
          currentValue === null ? !globalShowEmptyAttributes : !currentValue;

        logger.debug("toggleShowEmptyAttributes", {
          documentId,
          currentValue,
          newValue,
        });

        return {
          ...settings,
          [documentId]: {
            ...currentSettings,
            overrideShowEmptyAttributes: newValue,
          },
        };
      });
    },
    getEffectiveShowEmptyAttributes: (
      documentId: string,
      globalShowEmptyAttributes: boolean
    ) =>
      derived(store, ($settings) => {
        const override = $settings[documentId]?.overrideShowEmptyAttributes;
        // logger.debug("getEffectiveShowEmptyAttributes", {
        //   documentId,
        //   current: override,
        //   globalShowEmptyAttributes,
        // });
        return !override ? globalShowEmptyAttributes : override;
      }),
  };

  return store;
}

export const documentSettingsStore = createDocumentSettingsStore();

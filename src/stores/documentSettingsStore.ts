import { defineStore } from "pinia";
import { reactive } from "vue";
import { LoggerService } from "@/services/LoggerService";

const logger = new LoggerService("DocumentSettingsStore");

interface DocumentSettingsMap {
  [documentId: string]: {
    overrideShowEmptyAttributes: boolean | null;
  };
}

export const useDocumentSettingsStore = defineStore("documentSettings", () => {
  const settings = reactive<DocumentSettingsMap>({});

  function toggleShowEmptyAttributes(documentId: string, globalShowEmptyAttributes: boolean) {
    const currentSettings = settings[documentId] || {
      overrideShowEmptyAttributes: null,
    };
    const currentValue = currentSettings.overrideShowEmptyAttributes;

    const newValue = currentValue === null ? !globalShowEmptyAttributes : !currentValue;

    logger.debug("toggleShowEmptyAttributes", {
      documentId,
      currentValue,
      newValue,
    });

    settings[documentId] = {
      ...currentSettings,
      overrideShowEmptyAttributes: newValue,
    };
  }

  function getEffectiveShowEmptyAttributes(
    documentId: string,
    globalShowEmptyAttributes: boolean,
  ): boolean {
    const override = settings[documentId]?.overrideShowEmptyAttributes;
    return override === null || override === undefined ? globalShowEmptyAttributes : override;
  }

  return {
    settings,
    toggleShowEmptyAttributes,
    getEffectiveShowEmptyAttributes,
  };
});

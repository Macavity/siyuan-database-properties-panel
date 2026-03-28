import { defineStore } from "pinia";
import { reactive, watch } from "vue";
import debounce from "lodash/debounce";
import { storageService } from "@/services/StorageService";
import { LoggerService } from "@/services/LoggerService";
import { createFromSettingsStore, SettingsDTO } from "@/types/dto/SettingsDTO";

const logger = new LoggerService("Store");

export interface SettingsState {
  isCollapsed: boolean;
  lastSelectedAttributeView: string | null;
}

type DocumentSettings = Map<string, SettingsState>;

// Per-document debounced save functions
const debouncedSaveFunctions = new Map<string, (settings: SettingsState) => void>();

function getDebouncedSave(documentId: string) {
  if (!debouncedSaveFunctions.has(documentId)) {
    debouncedSaveFunctions.set(
      documentId,
      debounce(async (settings: SettingsState) => {
        try {
          const dto = createFromSettingsStore(documentId, settings);
          await storageService.saveSettings(dto);
          logger.addBreadcrumb(documentId, "savedSettings", { settings });
        } catch (e) {
          logger.error("error on saving settings", e, settings);
        }
      }, 500)
    );
  }
  return debouncedSaveFunctions.get(documentId)!;
}

export const useLocalSettingStore = defineStore("localSettings", () => {
  const state = reactive<DocumentSettings>(new Map());
  let previousState = new Map<string, SettingsState>();

  // Watch for changes and debounce-save per document
  watch(
    () => state,
    (currentState) => {
      currentState.forEach((settings, documentId) => {
        const previousSettings = previousState.get(documentId);
        if (
          !previousSettings ||
          JSON.stringify(settings) !== JSON.stringify(previousSettings)
        ) {
          const debouncedSave = getDebouncedSave(documentId);
          debouncedSave(settings);
          logger.addBreadcrumb(documentId, "settings changed", {
            from: previousSettings,
            to: settings,
          });
        }
      });
      previousState = new Map(currentState);
    },
    { deep: true }
  );

  function getDocumentSettings(documentId: string): SettingsState {
    return (
      state.get(documentId) ?? {
        isCollapsed: false,
        lastSelectedAttributeView: null,
      }
    );
  }

  function isAnyTabActive(documentId: string): boolean {
    const settings = state.get(documentId);
    return settings?.lastSelectedAttributeView != null;
  }

  function getActiveTab(documentId: string): string | null {
    return state.get(documentId)?.lastSelectedAttributeView ?? null;
  }

  function setFromDTO(dto: SettingsDTO) {
    state.set(dto.documentId, {
      isCollapsed: dto.isCollapsed,
      lastSelectedAttributeView: dto.lastSelectedAttributeView,
    });
  }

  function activateTab(documentId: string, avID: string) {
    const docSettings = state.get(documentId) ?? {
      isCollapsed: false,
      lastSelectedAttributeView: null,
    };
    state.set(documentId, {
      ...docSettings,
      isCollapsed: false,
      lastSelectedAttributeView: avID,
    });
    logger.debug("newState", new Map(state));
  }

  function toggleCollapsed(documentId: string) {
    const docSettings = state.get(documentId) ?? {
      isCollapsed: false,
      lastSelectedAttributeView: null,
    };
    state.set(documentId, {
      ...docSettings,
      isCollapsed: !docSettings.isCollapsed,
    });
  }

  function destroy() {
    state.clear();
    debouncedSaveFunctions.clear();
  }

  return {
    state,
    getDocumentSettings,
    isAnyTabActive,
    getActiveTab,
    setFromDTO,
    activateTab,
    toggleCollapsed,
    destroy,
  };
});

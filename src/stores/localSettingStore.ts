import { get, writable } from "svelte/store";
import debounce from "lodash/debounce";
import { storageService } from "@/services/StorageService";
import { LoggerService } from "@/libs/logger";
import { SettingsDTO } from "@/types/dto/SettingsDTO";

const logger = new LoggerService("Store");

interface SettingsState {
  documentId: string | null;
  isCollapsed: boolean;
  lastSelectedAttributeView: string | null;
}

function createSettingsStore() {
  const state = writable<SettingsState>({
    documentId: null,
    isCollapsed: false,
    lastSelectedAttributeView: null,
  });

  return {
    ...state,
    getDocumentId: () => get(state).documentId,
    isAnyTabActive: () => get(state).lastSelectedAttributeView !== null,
    getActiveTab: () => get(state).lastSelectedAttributeView,
    setFromDTO: (dto: SettingsDTO) => {
      state.update((state) => {
        if (state.documentId && state.documentId !== dto.documentId) {
          logger.error(
            "Trying to change documentId. Abort.",
            dto.documentId,
            state.documentId,
          );
          return state;
        }
        return {
          documentId: dto.documentId,
          isCollapsed: dto.isCollapsed,
          lastSelectedAttributeView: dto.lastSelectedAttributeView,
        };
      });
    },
    activateTab: (avID: string) => {
      state.update((s) => ({
        ...s,
        isCollapsed: false,
        lastSelectedAttributeView: avID,
      }));
    },
    toggleCollapsed: () => {
      state.update((s) => ({
        ...s,
        isCollapsed: !s.isCollapsed,
      }));
    },
  };
}

const debouncedSaveSettings = debounce(async (settings: SettingsDTO) => {
  try {
    await storageService.saveSettings(settings);
    logger.info("savedSettings", settings);
  } catch (e) {
    logger.error("error on saving settings", e, settings);
  }
}, 500);

export const settingsStore = createSettingsStore();

// Single subscription for all changes
settingsStore.subscribe(async (state) => {
  const settings = new SettingsDTO(
    state.documentId,
    state.isCollapsed,
    state.lastSelectedAttributeView,
  );
  await debouncedSaveSettings(settings);
});

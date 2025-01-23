import { get, writable } from "svelte/store";
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

function createSettingsStore() {
  const state = writable<DocumentSettings>(new Map());

  return {
    ...state,
    getDocumentSettings: (documentId: string) => {
      return (
        get(state).get(documentId) ?? {
          documentId,
          isCollapsed: false,
          lastSelectedAttributeView: null,
        }
      );
    },
    isAnyTabActive: (documentId: string) => {
      const settings = get(state).get(documentId);
      return settings?.lastSelectedAttributeView !== null;
    },
    getActiveTab: (documentId: string) => {
      return get(state).get(documentId)?.lastSelectedAttributeView ?? null;
    },
    setFromDTO: (dto: SettingsDTO) => {
      state.update((currentState) => {
        const newState = new Map(currentState);
        newState.set(dto.documentId, {
          isCollapsed: dto.isCollapsed,
          lastSelectedAttributeView: dto.lastSelectedAttributeView,
        });

        return newState;
      });
    },
    activateTab: (documentId: string, avID: string) => {
      state.update((currentState) => {
        const newState = new Map(currentState);
        const docSettings = newState.get(documentId) ?? {
          isCollapsed: false,
          lastSelectedAttributeView: null,
        };
        newState.set(documentId, {
          ...docSettings,
          isCollapsed: false,
          lastSelectedAttributeView: avID,
        });
        return newState;
      });
    },
    toggleCollapsed: (documentId: string) => {
      state.update((currentState) => {
        const newState = new Map(currentState);
        const docSettings = newState.get(documentId) ?? {
          isCollapsed: false,
          lastSelectedAttributeView: null,
        };
        newState.set(documentId, {
          ...docSettings,
          isCollapsed: !docSettings.isCollapsed,
        });
        return newState;
      });
    },
  };
}

const debouncedSaveSettings = debounce(
  async (documentId: string, settings: SettingsState) => {
    try {
      const dto = createFromSettingsStore(documentId, settings);

      await storageService.saveSettings(dto);
      logger.info("savedSettings", dto);
    } catch (e) {
      logger.error("error on saving settings", e, settings);
    }
  },
  500,
);

export const settingsStore = createSettingsStore();

settingsStore.subscribe(async (state) => {
  state.forEach((settings, documentId) => {
    debouncedSaveSettings(documentId, settings);
  });
});

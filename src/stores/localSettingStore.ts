import { get, writable } from "svelte/store";
import debounce from "lodash/debounce";
import { storageService } from "@/services/StorageService";
import { LoggerService } from "@/services/LoggerService";
import { createDefaultSettingsDTO, SettingsDTO } from "@/types/dto/SettingsDTO";

const logger = new LoggerService("Store");

interface SettingsState {
  isCollapsed: boolean;
  lastSelectedAttributeView: string | null;
  overrideShowEmptyAttributes: boolean | null;
}

type DocumentSettings = Map<string, SettingsState>;

function createSettingsStore() {
  const state = writable<DocumentSettings>(new Map());

  return {
    ...state,
    getDocumentSettings: (documentId: string) => {
      return get(state).get(documentId) ?? createDefaultSettingsDTO(documentId);
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
          overrideShowEmptyAttributes: dto.overrideShowEmptyAttributes ?? null,
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
    toggleShowEmptyAttributes: (
      documentId: string,
      globalShowEmptyAttributes: boolean
    ) => {
      state.update((currentState) => {
        const newState = new Map(currentState);
        const docSettings =
          newState.get(documentId) ?? createDefaultSettingsDTO(documentId);
        const currentValue = docSettings.overrideShowEmptyAttributes;

        // If null, start with the opposite of the global setting
        const newValue =
          currentValue === null ? !globalShowEmptyAttributes : !currentValue;

        newState.set(documentId, {
          ...docSettings,
          overrideShowEmptyAttributes: newValue,
        });
        logger.debug("toggleShowEmptyAttributes", {
          globalShowEmptyAttributes,
          newState,
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
      const dto = new SettingsDTO(
        documentId,
        settings.isCollapsed,
        settings.lastSelectedAttributeView
      );
      await storageService.saveSettings(dto);
      logger.info("savedSettings", dto);
    } catch (e) {
      logger.error("error on saving settings", e, settings);
    }
  },
  500
);

export const settingsStore = createSettingsStore();

settingsStore.subscribe(async (state) => {
  state.forEach((settings, documentId) => {
    debouncedSaveSettings(documentId, settings);
  });
});

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

// Create a map of debounced save functions per document
const debouncedSaveFunctions = new Map<
  string,
  (settings: SettingsState) => void
>();

function getDebouncedSave(documentId: string) {
  if (!debouncedSaveFunctions.has(documentId)) {
    debouncedSaveFunctions.set(
      documentId,
      debounce(async (settings: SettingsState) => {
        try {
          const dto = createFromSettingsStore(documentId, settings);
          await storageService.saveSettings(dto);
          logger.addBreadcrumb(documentId, "savedSettings", {
            settings,
          });
        } catch (e) {
          logger.error("error on saving settings", e, settings);
        }
      }, 500)
    );
  }
  return debouncedSaveFunctions.get(documentId);
}

function createSettingsStore() {
  const state = writable<DocumentSettings>(new Map());
  let previousState: DocumentSettings = new Map();

  // Subscribe to changes and only save documents that actually changed
  const unsubscribe = state.subscribe((currentState) => {
    currentState.forEach((settings, documentId) => {
      const previousSettings = previousState.get(documentId);

      // Only save if settings changed
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

    // Update previous state for next comparison
    previousState = new Map(currentState);
  });

  return {
    ...state,
    destroy() {
      unsubscribe();
      debouncedSaveFunctions.clear();
    },
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
        logger.debug("newState", newState);
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

export const settingsStore = createSettingsStore();

import { get, writable } from "svelte/store";
import { storageService } from "@/services/StorageService";
import { LoggerService } from "@/libs/logger";
import { SettingsDTO } from "@/types/dto/SettingsDTO";

export const documentId = writable<string | null>(null);
export const isCollapsed = writable<boolean>(false);
export const lastSelectedAttributeView = writable<string | null>(null);

const logger = new LoggerService("Store");

const saveSettings = async (settings: SettingsDTO) => {
  logger.info("trigger saveSettings", settings);
  storageService
    .saveSettings(settings)
    .then(() => {
      logger.info("savedSettings", settings);
    })
    .catch((e) => {
      logger.error("error on saving settings", e, settings);
    });
};

isCollapsed.subscribe(async (newCollapseState) => {
  const settings = new SettingsDTO(
    get(documentId),
    newCollapseState,
    get(lastSelectedAttributeView),
  );
  await saveSettings(settings);
});

lastSelectedAttributeView.subscribe(async (newSelectedTab) => {
  const settings = new SettingsDTO(
    get(documentId),
    get(isCollapsed),
    newSelectedTab,
  );
  await saveSettings(settings);
});

import { getFile, putFile } from "@/api";
import { LoggerService, LogLevel } from "@/libs/logger";
import { documentSettingStore } from "@/stores/localSettingStore";
import { createDefaultSettingsDTO, SettingsDTO } from "@/types/dto/SettingsDTO";

export const PLUGIN = "siyuan-database-properties-panel";

export function getStoragePath(path: string) {
  return `/data/storage/petal/${PLUGIN}/${path}.json`;
}

export class StorageService {
  constructor(
    private logger = new LoggerService("StorageService", LogLevel.DEBUG),
  ) {}
  public async fetchSettings(documentId: string) {
    this.logger.debug("fetchSettings", documentId);

    return getFile(getStoragePath(documentId))
      .then((data) => {
        if (data.code === 404) {
          this.logger.debug("create default for document", documentId);
          return createDefaultSettingsDTO(documentId);
        }

        const settings = new SettingsDTO(documentId, data.isCollapsed);
        documentSettingStore.update((docs) => {
          docs.set(documentId, settings);
          return docs;
        });

        return settings;
      })
      .catch(() => {
        this.logger.debug("create default for document", documentId);
        return createDefaultSettingsDTO(documentId);
      });
  }

  public async saveSettings(documentId: string, data: SettingsDTO) {
    this.logger.debug("saveSettings");
    const file = new File(
      [
        new Blob([JSON.stringify(data)], {
          type: "application/json",
        }),
      ],
      `${documentId}.json`,
    );
    return putFile(getStoragePath(documentId), false, file);
  }
}

export const storageService = new StorageService();

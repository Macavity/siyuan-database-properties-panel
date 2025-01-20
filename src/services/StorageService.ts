import { ApiError, getFile, putFile } from "@/api";
import { LoggerService, LogLevel } from "@/libs/logger";
import {
  isCollapsed,
  lastSelectedAttributeView,
} from "@/stores/localSettingStore";
import { createDefaultSettingsDTO, SettingsDTO } from "@/types/dto/SettingsDTO";

export const PLUGIN = "siyuan-database-properties-panel";

export function getStoragePath(path: string) {
  return `/data/storage/petal/${PLUGIN}/${path}.json`;
}

function isApiError(data: SettingsDTO | ApiError): data is ApiError {
  return (
    (data as ApiError).code !== undefined &&
    (data as ApiError).msg !== undefined
  );
}

export class StorageService {
  constructor(
    private logger = new LoggerService("StorageService", LogLevel.DEBUG),
  ) {}

  public async fetchSettings(documentId: string) {
    this.logger.debug("fetchSettings", documentId);

    return getFile<SettingsDTO>(getStoragePath(documentId))
      .then((data) => {
        if (isApiError(data)) {
          this.logger.debug("create default for document", documentId);
          return createDefaultSettingsDTO(documentId);
        }

        isCollapsed.set(data.isCollapsed);
        lastSelectedAttributeView.set(data.lastSelectedAttributeView);
      })
      .catch(() => {
        this.logger.debug("create default for document", documentId);
        return createDefaultSettingsDTO(documentId);
      });
  }

  public async saveSettings(
    documentId: string,
    isCollapsed: boolean,
    lastSelectedAttributeView: string,
  ) {
    this.logger.debug("saveSettings", {
      documentId,
      isCollapsed,
      lastSelectedAttributeView,
    });

    const settings = new SettingsDTO(
      documentId,
      isCollapsed,
      lastSelectedAttributeView,
    );

    const file = new File(
      [
        new Blob([JSON.stringify(settings)], {
          type: "application/json",
        }),
      ],
      `${documentId}.json`,
    );
    return putFile(getStoragePath(documentId), false, file);
  }
}

export const storageService = new StorageService();

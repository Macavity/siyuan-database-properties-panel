import { ApiError, getFile, putFile } from "@/api";
import { LoggerService } from "@/services/LoggerService";
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
  constructor(private logger = new LoggerService("StorageService")) {}

  public async fetchSettings(documentId: string) {
    this.logger.addBreadcrumb(documentId, "fetchSettings");

    return getFile<SettingsDTO>(getStoragePath(documentId))
      .then((data) => {
        if (isApiError(data)) {
          // this.logger.debug("create default for document", documentId);
          return createDefaultSettingsDTO(documentId);
        }

        if (data.documentId !== documentId) {
          this.logger.error(
            `Invalid documentId ${data.documentId}, expected ${documentId}.`
          );
          return createDefaultSettingsDTO(documentId);
        }

        return new SettingsDTO(
          documentId,
          data.isCollapsed,
          data.lastSelectedAttributeView,
          data.overrideShowEmptyAttributes
        );
      })
      .catch((e) => {
        this.logger.error("Error retrieving settings", e);
        this.logger.debug("create default for document", documentId);
        return createDefaultSettingsDTO(documentId);
      });
  }

  public async saveSettings(settings: SettingsDTO) {
    this.logger.addBreadcrumb(settings.documentId, "saveSettings");

    const file = new File(
      [
        new Blob([JSON.stringify(settings)], {
          type: "application/json",
        }),
      ],
      `${settings.documentId}.json`
    );
    return putFile(getStoragePath(settings.documentId), false, file);
  }
}

export const storageService = new StorageService();

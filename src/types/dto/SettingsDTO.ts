import { SettingsState } from "@/stores/localSettingStore";

export class SettingsDTO {
  constructor(
    public readonly documentId: string,
    public readonly isCollapsed: boolean,
    public readonly lastSelectedAttributeView: string | null = null,
  ) {}
}

export const createDefaultSettingsDTO = (documentId: string) => {
  return new SettingsDTO(documentId, false, null);
};

export const createFromSettingsStore = (
  documentId: string,
  settings: SettingsState,
) => {
  return new SettingsDTO(
    documentId,
    settings.isCollapsed,
    settings.lastSelectedAttributeView,
  );
};

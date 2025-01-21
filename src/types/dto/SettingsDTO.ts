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

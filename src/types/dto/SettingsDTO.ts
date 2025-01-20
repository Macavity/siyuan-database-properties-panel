export class SettingsDTO {
  constructor(
    public readonly documentId: string,
    public isCollapsed: boolean,
    public lastSelectedAttributeView: string | null = null,
  ) {}
}

export const createDefaultSettingsDTO = (documentId: string) => {
  return new SettingsDTO(documentId, false, null);
};

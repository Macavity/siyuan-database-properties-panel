export class SettingsDTO {
  constructor(
    public readonly documentId: string,
    public isCollapsed: boolean,
  ) {}
}

export const createDefaultSettingsDTO = (documentId: string) => {
  return new SettingsDTO(documentId, false);
};

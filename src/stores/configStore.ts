import { defineStore } from "pinia";
import { ref } from "vue";

export const PluginSetting = {
  ShowPrimaryKey: "showPrimaryKey",
  ShowEmptyAttributes: "showEmptyAttributes",
  ShowDatabaseAttributes: "showDatabaseAttributes",
  AlignPropertiesLeft: "alignPropertiesLeft",
  ShowBottomSeparator: "showBottomSeparator",
  ColumnVisibility: "columnVisibility",
  EnableDebugLogging: "enableDebugLogging",
  HideInSpacedRepetition: "hideInSpacedRepetition",
} as const;

export type PluginSettingKey = (typeof PluginSetting)[keyof typeof PluginSetting];

export interface ColumnVisibilityConfig {
  [avId: string]: {
    [columnId: string]: boolean;
  };
}

export interface PluginConfigDTO {
  showPrimaryKey: boolean;
  showEmptyAttributes: boolean;
  showDatabaseAttributes: boolean;
  alignPropertiesLeft: boolean;
  showBottomSeparator: boolean;
  columnVisibility: ColumnVisibilityConfig;
  enableDebugLogging: boolean;
  hideInSpacedRepetition: boolean;
}

export interface ConfigStoreType extends PluginConfigDTO {
  loading: boolean;
}

export const defaultConfig: PluginConfigDTO = {
  showPrimaryKey: false,
  showEmptyAttributes: false,
  showDatabaseAttributes: true,
  alignPropertiesLeft: false,
  showBottomSeparator: true,
  columnVisibility: {},
  enableDebugLogging: false,
  hideInSpacedRepetition: true,
};

export function createConfigFromStorage(data: Partial<PluginConfigDTO>): PluginConfigDTO {
  return { ...defaultConfig, ...data };
}

export const useConfigStore = defineStore("config", () => {
  const showPrimaryKey = ref(defaultConfig.showPrimaryKey);
  const showEmptyAttributes = ref(defaultConfig.showEmptyAttributes);
  const showDatabaseAttributes = ref(defaultConfig.showDatabaseAttributes);
  const alignPropertiesLeft = ref(defaultConfig.alignPropertiesLeft);
  const showBottomSeparator = ref(defaultConfig.showBottomSeparator);
  const columnVisibility = ref<ColumnVisibilityConfig>({});
  const enableDebugLogging = ref(defaultConfig.enableDebugLogging);
  const hideInSpacedRepetition = ref(defaultConfig.hideInSpacedRepetition);
  const loading = ref(true);

  function setLoading(value: boolean) {
    loading.value = value;
  }

  function setSetting(key: Exclude<PluginSettingKey, "columnVisibility">, value: boolean) {
    switch (key) {
      case "showPrimaryKey": showPrimaryKey.value = value; break;
      case "showEmptyAttributes": showEmptyAttributes.value = value; break;
      case "showDatabaseAttributes": showDatabaseAttributes.value = value; break;
      case "alignPropertiesLeft": alignPropertiesLeft.value = value; break;
      case "showBottomSeparator": showBottomSeparator.value = value; break;
      case "enableDebugLogging": enableDebugLogging.value = value; break;
      case "hideInSpacedRepetition": hideInSpacedRepetition.value = value; break;
    }
  }

  function setFromConfigDTO(settings: PluginConfigDTO) {
    showPrimaryKey.value = settings.showPrimaryKey;
    showEmptyAttributes.value = settings.showEmptyAttributes;
    showDatabaseAttributes.value = settings.showDatabaseAttributes;
    alignPropertiesLeft.value = settings.alignPropertiesLeft;
    showBottomSeparator.value = settings.showBottomSeparator;
    columnVisibility.value = { ...settings.columnVisibility };
    enableDebugLogging.value = settings.enableDebugLogging;
    hideInSpacedRepetition.value = settings.hideInSpacedRepetition;
  }

  function getSettingsObject(): PluginConfigDTO {
    return {
      showPrimaryKey: showPrimaryKey.value,
      showEmptyAttributes: showEmptyAttributes.value,
      showDatabaseAttributes: showDatabaseAttributes.value,
      alignPropertiesLeft: alignPropertiesLeft.value,
      showBottomSeparator: showBottomSeparator.value,
      columnVisibility: columnVisibility.value,
      enableDebugLogging: enableDebugLogging.value,
      hideInSpacedRepetition: hideInSpacedRepetition.value,
    };
  }

  function setColumnVisibility(avId: string, columnId: string, visible: boolean) {
    const cv = { ...columnVisibility.value };
    if (!cv[avId]) {
      cv[avId] = {};
    }
    if (visible) {
      delete cv[avId][columnId];
      if (Object.keys(cv[avId]).length === 0) {
        delete cv[avId];
      }
    } else {
      cv[avId] = { ...cv[avId], [columnId]: false };
    }
    columnVisibility.value = cv;
  }

  function isColumnVisible(avId: string, columnId: string): boolean {
    const avConfig = columnVisibility.value[avId];
    if (!avConfig) return true;
    return avConfig[columnId] !== false;
  }

  function getColumnVisibility(avId: string): Record<string, boolean> {
    return columnVisibility.value[avId] || {};
  }

  return {
    showPrimaryKey,
    showEmptyAttributes,
    showDatabaseAttributes,
    alignPropertiesLeft,
    showBottomSeparator,
    columnVisibility,
    enableDebugLogging,
    hideInSpacedRepetition,
    loading,
    setLoading,
    setSetting,
    setFromConfigDTO,
    getSettingsObject,
    setColumnVisibility,
    isColumnVisible,
    getColumnVisibility,
  };
});

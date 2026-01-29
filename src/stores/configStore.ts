import {writable, get} from "svelte/store";

export const PluginSetting = {
    ShowPrimaryKey: "showPrimaryKey",
    ShowEmptyAttributes: "showEmptyAttributes",
    ShowDatabaseAttributes: "showDatabaseAttributes",
    AlignPropertiesLeft: "alignPropertiesLeft",
    ShowBottomSeparator: "showBottomSeparator",
    ColumnVisibility: "columnVisibility",
} as const;

export type PluginSettingKey = typeof PluginSetting[keyof typeof PluginSetting];

export interface ColumnVisibilityConfig {
    [avId: string]: {
        [columnId: string]: boolean; // false = hidden
    };
}

export interface PluginConfigDTO {
    showPrimaryKey: boolean;
    showEmptyAttributes: boolean;
    showDatabaseAttributes: boolean;
    alignPropertiesLeft: boolean;
    showBottomSeparator: boolean;
    columnVisibility: ColumnVisibilityConfig;
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
};

export function createConfigFromStorage(data: Partial<PluginConfigDTO>): PluginConfigDTO {
    return {...defaultConfig, ...data};
}

function createConfigStore() {
    const {subscribe, set, update} = writable<ConfigStoreType>({
        ...defaultConfig,
        loading: true,
    });

    return {
        subscribe,
        set,
        update,
        setLoading: (loading: boolean) =>
            update((config) => ({...config, loading})),
        getSettingsObject: (): PluginConfigDTO => {
            const {loading, ...settings} = get({subscribe});
            return settings;
        },
        setFromConfigDTO: (settings: PluginConfigDTO) => {
            update((config) => ({...config, ...settings}));
        },
        setSetting: (key: PluginSettingKey, value: boolean) => {
            update((config) => ({...config, [key]: value}));
        },
        setColumnVisibility: (avId: string, columnId: string, visible: boolean) => {
            update((config) => {
                const columnVisibility = {...config.columnVisibility};
                if (!columnVisibility[avId]) {
                    columnVisibility[avId] = {};
                }
                if (visible) {
                    // Remove the entry if visible (default is visible)
                    delete columnVisibility[avId][columnId];
                    // Clean up empty av entries
                    if (Object.keys(columnVisibility[avId]).length === 0) {
                        delete columnVisibility[avId];
                    }
                } else {
                    columnVisibility[avId][columnId] = false;
                }
                return {...config, columnVisibility};
            });
        },
        isColumnVisible: (avId: string, columnId: string): boolean => {
            const config = get({subscribe});
            const avConfig = config.columnVisibility[avId];
            if (!avConfig) return true;
            return avConfig[columnId] !== false;
        },
        getColumnVisibility: (avId: string): Record<string, boolean> => {
            const config = get({subscribe});
            return config.columnVisibility[avId] || {};
        },
    };
}

export const configStore = createConfigStore();

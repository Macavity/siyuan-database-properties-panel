import {writable, get} from "svelte/store";

export const PluginSetting = {
    ShowPrimaryKey: "showPrimaryKey",
    ShowEmptyAttributes: "showEmptyAttributes",
    ShowDatabaseAttributes: "showDatabaseAttributes",
    AllowErrorReporting: "allowErrorReporting",
} as const;

export type PluginSettingKey = typeof PluginSetting[keyof typeof PluginSetting];

export interface PluginConfigDTO {
    showPrimaryKey: boolean;
    showEmptyAttributes: boolean;
    showDatabaseAttributes: boolean;
    allowErrorReporting: boolean;
}

export interface ConfigStoreType extends PluginConfigDTO {
    loading: boolean;
}

export const defaultConfig: PluginConfigDTO = {
    showPrimaryKey: false,
    showEmptyAttributes: false,
    showDatabaseAttributes: true,
    allowErrorReporting: false,
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
    };
}

export const configStore = createConfigStore();

import {writable, get} from "svelte/store";
import {ERROR_REPORTING_LOCAL_STORAGE_KEY} from "@/constants";

export const PluginSetting = {
    ShowPrimaryKey: "showPrimaryKey",
    ShowEmptyAttributes: "showEmptyAttributes",
    ShowDatabaseAttributes: "showDatabaseAttributes",
    AllowErrorReporting: "allowErrorReporting",
    AlignPropertiesLeft: "alignPropertiesLeft",
    ShowBottomSeparator: "showBottomSeparator",
} as const;

/**
 * Determines if error reporting should be enabled.
 * Only allows error reporting if:
 * 1. localStorage key 'dpp-allow-error-reporting' is 'true', OR
 * 2. Not in production mode (NODE_ENV !== 'production')
 */
export function isErrorReportingAllowed(): boolean {
    const localStorageValue = localStorage.getItem(ERROR_REPORTING_LOCAL_STORAGE_KEY);
    if (localStorageValue === "true") {
        return true;
    }
    return process.env.NODE_ENV !== "production";
}

export type PluginSettingKey = typeof PluginSetting[keyof typeof PluginSetting];

export interface PluginConfigDTO {
    showPrimaryKey: boolean;
    showEmptyAttributes: boolean;
    showDatabaseAttributes: boolean;
    allowErrorReporting: boolean;
    alignPropertiesLeft: boolean;
    showBottomSeparator: boolean;
}

export interface ConfigStoreType extends PluginConfigDTO {
    loading: boolean;
}

export const defaultConfig: PluginConfigDTO = {
    showPrimaryKey: false,
    showEmptyAttributes: false,
    showDatabaseAttributes: true,
    allowErrorReporting: false,
    alignPropertiesLeft: false,
    showBottomSeparator: true,
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

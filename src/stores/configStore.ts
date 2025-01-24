import { writable, derived } from "svelte/store";

export interface PluginConfig {
  showPrimaryKey: boolean;
  showEmptyAttributes: boolean;
  showDatabaseAttributes: boolean;
  allowErrorReporting: boolean;
}

function createConfigStore() {
  const { subscribe, set, update } = writable<PluginConfig>({
    showPrimaryKey: false,
    showEmptyAttributes: false,
    showDatabaseAttributes: true,
    allowErrorReporting: false,
  });

  return {
    subscribe,
    set,
    update,
    setShowEmptyAttributes: (value: boolean) =>
      update((config) => ({ ...config, showEmptyAttributes: value })),
    setShowPrimaryKey: (value: boolean) =>
      update((config) => ({ ...config, showPrimaryKey: value })),
  };
}

export const configStore = createConfigStore();

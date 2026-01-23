<script lang="ts">
    import { showMessage } from "siyuan";
    import SettingPanel from "./ui/SettingPanel.svelte";
    import { PluginSetting, configStore } from "@/stores/configStore";
    import { Plugin } from "siyuan";
    import { STORAGE_NAME } from "@/constants";
    import { LoggerService } from "@/services/LoggerService";
    import { i18nStore } from "@/stores/i18nStore";

    interface Props {
        plugin: Plugin;
    }

    let { plugin }: Props = $props();
    const logger = new LoggerService("Settings");

    // Derive groups from i18n reactively
    const groups = $derived(() => {
        const t = $i18nStore;
        return [t.settingGroupDisplay, t.settingGroupPrivacy];
    });

    // Focus group (initialize once i18n is available)
    let focusGroup = $state("");
    $effect(() => {
        if (!focusGroup && groups()[0]) {
            focusGroup = groups()[0];
        }
    });

    const displayItems = $derived(() => {
        const t = $i18nStore;
        return [
            {
                key: PluginSetting.ShowDatabaseAttributes,
                value: $configStore.showDatabaseAttributes,
                type: "checkbox" as const,
                title: t.configShowDatabasePropertiesTitle,
                description: t.configShowDatabasePropertiesDesc,
            },
            {
                key: PluginSetting.ShowPrimaryKey,
                value: $configStore.showPrimaryKey,
                type: "checkbox" as const,
                title: t.configShowPrimaryKeyTitle,
                description: t.configShowPrimaryKeyDesc,
            },
            {
                key: PluginSetting.ShowEmptyAttributes,
                value: $configStore.showEmptyAttributes,
                type: "checkbox" as const,
                title: t.configShowEmptyPropertiesTitle,
                description: t.configShowEmptyPropertiesDesc,
            },
        ];
    });

    const privacyItems = $derived(() => {
        const t = $i18nStore;
        return [
            {
                key: PluginSetting.AllowErrorReporting,
                value: $configStore.allowErrorReporting,
                type: "checkbox" as const,
                title: t.configAllowErrorReportingTitle,
                description: t.configAllowErrorReportingDesc,
            },
        ];
    });

    /********** Callbacks **********/
    const onSettingChange = async (group: string, key: string, value: unknown) => {
        logger.debug("onSettingChange", { group, key, value });

        try {
            // Update config store
            configStore.setSetting(key as typeof PluginSetting[keyof typeof PluginSetting], value as boolean);

            // Save settings to storage using plugin's saveData method
            await plugin.saveData(STORAGE_NAME, configStore.getSettingsObject());
            logger.debug("Settings saved successfully");
        } catch (error) {
            logger.error("Failed to save settings:", error);
            showMessage("Failed to save settings");
        }
    };
</script>

<div class="fn__flex-1 fn__flex config__panel">
    <ul class="b3-tab-bar b3-list b3-list--background">
        {#each groups() as group}
            <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
            <li
                data-name="editor"
                class:b3-list-item--focus={(group) === focusGroup}
                class="b3-list-item"
                onclick={() => {
                    focusGroup = group;
                }}
                onkeydown={(e) => {
                    if (e.key === "Enter") {
                        focusGroup = group;
                    }
                }}
            >
                <span class="b3-list-item__text">{group}</span>
            </li>
        {/each}
    </ul>
    <div class="config__tab-wrap">
        <SettingPanel
            group={groups()[0]}
            settingItems={displayItems()}
            display={focusGroup === groups()[0]}
            onSettingChange={onSettingChange}
        >
        </SettingPanel>
        <SettingPanel
            group={groups()[1]}
            settingItems={privacyItems()}
            display={focusGroup === groups()[1]}
            onSettingChange={onSettingChange}
        >
        </SettingPanel>
    </div>
</div>

<style lang="scss">
    .config__panel {
        height: 100%;
    }
    .config__panel > ul > li {
        padding-left: 1rem;
    }
</style>

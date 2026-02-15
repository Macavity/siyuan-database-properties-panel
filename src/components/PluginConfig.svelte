<script lang="ts">
    import {showMessage} from "siyuan";
    import SettingPanel from "./ui/SettingPanel.svelte";
    import {PluginSetting, configStore} from "@/stores/configStore";
    import {Plugin} from "siyuan";
    import {STORAGE_NAME} from "@/constants";
    import {LoggerService} from "@/services/LoggerService";
    import {i18nStore} from "@/stores/i18nStore";
    import DatabaseColumnSettings from "./DatabaseColumnSettings.svelte";
    import Icon from "@/components/ui/Icon.svelte";
    import type {SiYuanIcon} from "@/types/SiyuanIcon";

    interface Props {
        plugin: Plugin;
    }

    let {plugin}: Props = $props();
    const logger = new LoggerService("PluginConfig");

    // Debug panel state
    let logsText = $state("");

    // Update logs text every second for the debug panel
    $effect(() => {
        const updateLogs = () => {
            logsText = LoggerService.getLogs().join("\n");
        };

        updateLogs();
        const interval = setInterval(updateLogs, 1000);

        return () => clearInterval(interval);
    });

    const copyLogs = () => {
        navigator.clipboard.writeText(logsText).then(() => {
            showMessage("Logs copied to clipboard");
        }).catch((err) => {
            logger.error("Failed to copy logs:", err);
            showMessage("Failed to copy logs");
        });
    };

    const resetLogs = () => {
        LoggerService.clearLogs();
        logsText = "";
    };

    // Derive groups from i18n reactively
    const groups = $derived([
        $i18nStore.settingGroupDisplay,
        $i18nStore.settingGroupStyling,
        $i18nStore.settingGroupColumnVisibility,
        $i18nStore.settingGroupDebug,
    ]);

    // Icon mapping for each group
    const groupIcons = $derived({
        [$i18nStore.settingGroupDisplay]: "iconEye" as SiYuanIcon,
        [$i18nStore.settingGroupStyling]: "iconTheme" as SiYuanIcon,
        [$i18nStore.settingGroupColumnVisibility]: "iconFilter" as SiYuanIcon,
        [$i18nStore.settingGroupDebug]: "iconBug" as SiYuanIcon,
    });

    // Focus group (initialize once i18n is available)
    let focusGroup = $state("");
    $effect(() => {
        if (!focusGroup && groups[0]) {
            focusGroup = groups[0];
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
            {
                key: PluginSetting.HideInSpacedRepetition,
                value: $configStore.hideInSpacedRepetition,
                type: "checkbox" as const,
                title: t.configHideInSpacedRepetitionTitle,
                description: t.configHideInSpacedRepetitionDesc,
            },
        ];
    });

    // Styling settings
    const stylingItems = $derived(() => {
        const t = $i18nStore;
        return [
            {
                key: PluginSetting.AlignPropertiesLeft,
                value: $configStore.alignPropertiesLeft,
                type: "checkbox" as const,
                title: t.configAlignPropertiesLeftTitle,
                description: t.configAlignPropertiesLeftDesc,
            },
            {
                key: PluginSetting.ShowBottomSeparator,
                value: $configStore.showBottomSeparator,
                type: "checkbox" as const,
                title: t.configShowBottomSeparatorTitle,
                description: t.configShowBottomSeparatorDesc,
            },
        ];
    });

    // Debug settings
    const debugItems = $derived(() => {
        const t = $i18nStore;
        return [
            {
                key: PluginSetting.EnableDebugLogging,
                value: $configStore.enableDebugLogging,
                type: "checkbox" as const,
                title: t.configEnableDebugLoggingTitle,
                description: t.configEnableDebugLoggingDesc,
            },
        ];
    });

    // Dynamic logs description based on current buffer size
    let logsDesc = $derived(
        $i18nStore.debugLogsDesc?.replace("{count}", String(LoggerService.getMaxLogs()))
    );

    const onSettingChange = async (_group: string, key: string, value: unknown) => {
        logger.debug("onSettingChange", {key, value});

        try {
            configStore.setSetting(key as typeof PluginSetting[keyof typeof PluginSetting], value as boolean);
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
        {#each groups as group}
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
                <span class="b3-list-item__action"><Icon icon={groupIcons[group]}/></span>
            </li>
        {/each}
    </ul>
    <div class="config__tab-wrap">
        <SettingPanel
                group={groups[0]}
                settingItems={displayItems()}
                display={focusGroup === groups[0]}
                onSettingChange={onSettingChange}
        >
        </SettingPanel>
        <SettingPanel
                group={groups[1]}
                settingItems={stylingItems()}
                display={focusGroup === groups[1]}
                onSettingChange={onSettingChange}
        >
        </SettingPanel>
        <SettingPanel
                group={groups[2]}
                settingItems={[]}
                display={focusGroup === groups[2]}
                onSettingChange={onSettingChange}
        >
            {#snippet children()}
                <DatabaseColumnSettings {plugin}/>
            {/snippet}
        </SettingPanel>
        <SettingPanel
                group={groups[3]}
                settingItems={debugItems()}
                display={focusGroup === groups[3]}
                onSettingChange={onSettingChange}
        >
            {#snippet children()}
                <div class="config__debug-panel">
                    <div class="b3-label">
                        <div class="fn__flex">
                            <div class="fn__flex-1">
                                {$i18nStore.debugPluginVersion}
                            </div>
                            <span class="b3-label__text">{process.env.PLUGIN_VERSION || 'unknown'}</span>
                        </div>
                    </div>
                    {#if $configStore.enableDebugLogging}
                        <div class="b3-label">
                            <div class="fn__flex">
                                <div class="fn__flex-1">
                                    {$i18nStore.debugLogs}
                                    <div class="b3-label__text">{logsDesc}</div>
                                </div>
                            </div>
                            <div class="fn__flex config__debug-actions">
                                <div class="fn__flex-1"></div>
                                <button class="b3-button b3-button--outline" onclick={resetLogs}>
                                    {$i18nStore.debugResetLogs}
                                </button>
                                <button class="b3-button b3-button--outline" onclick={copyLogs}>
                                    {$i18nStore.debugCopyLogs}
                                </button>
                            </div>
                            <div class="b3-label__text">
                                <textarea
                                    class="b3-text-field fn__block"
                                    readonly
                                    rows="15"
                                    bind:value={logsText}
                                ></textarea>
                            </div>
                        </div>
                    {/if}
                </div>
            {/snippet}
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

  @media (max-width: 750px) {
    .config__panel > ul > li {
      padding-left: 0;
      width: 24px;
    }
  }

  .config__tab-wrap {
    min-height: 170px;
  }

  .config__debug-panel {
    textarea {
      font-family: monospace;
      font-size: 12px;
      line-height: 1.4;
    }
  }

  .config__debug-actions {
    gap: 8px;
    margin-bottom: 8px;
  }
</style>

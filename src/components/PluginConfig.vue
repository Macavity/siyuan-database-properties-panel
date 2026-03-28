<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";
import { showMessage } from "siyuan";
import type { Plugin } from "siyuan";
import SettingPanel from "./ui/SettingPanel.vue";
import { PluginSetting, useConfigStore } from "@/stores/configStore";
import { STORAGE_NAME } from "@/constants";
import { LoggerService } from "@/services/LoggerService";
import { useI18nStore } from "@/stores/i18nStore";
import DatabaseColumnSettings from "./DatabaseColumnSettings.vue";
import Icon from "@/components/ui/Icon.vue";
import type { SiYuanIcon } from "@/types/SiyuanIcon";

const props = defineProps<{
  plugin: Plugin;
}>();

const logger = new LoggerService("PluginConfig");
const configStore = useConfigStore();
const i18nStore = useI18nStore();
const pluginVersion = (process as NodeJS.Process & { env: Record<string, string | undefined> }).env?.PLUGIN_VERSION ?? "unknown";

// Debug panel state
const logsText = ref("");

// Update logs text every second for the debug panel
let logsInterval: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
  logsText.value = LoggerService.getLogs().join("\n");
  logsInterval = setInterval(() => {
    logsText.value = LoggerService.getLogs().join("\n");
  }, 1000);
});

onUnmounted(() => {
  if (logsInterval !== null) {
    clearInterval(logsInterval);
    logsInterval = null;
  }
});

const copyLogs = () => {
  navigator.clipboard
    .writeText(logsText.value)
    .then(() => {
      showMessage("Logs copied to clipboard");
    })
    .catch((err) => {
      logger.error("Failed to copy logs:", err);
      showMessage("Failed to copy logs");
    });
};

const resetLogs = () => {
  LoggerService.clearLogs();
  logsText.value = "";
};

// Derive groups from i18n reactively
const groups = computed(() => [
  i18nStore.strings.settingGroupDisplay,
  i18nStore.strings.settingGroupStyling,
  i18nStore.strings.settingGroupColumnVisibility,
  i18nStore.strings.settingGroupDebug,
]);

// Icon mapping for each group
const groupIcons = computed(() => ({
  [i18nStore.strings.settingGroupDisplay]: "iconEye" as SiYuanIcon,
  [i18nStore.strings.settingGroupStyling]: "iconTheme" as SiYuanIcon,
  [i18nStore.strings.settingGroupColumnVisibility]: "iconFilter" as SiYuanIcon,
  [i18nStore.strings.settingGroupDebug]: "iconBug" as SiYuanIcon,
}));

// Focus group - use computed to derive default from groups, but allow manual override
const focusGroupOverride = ref<string | null>(null);
const focusGroup = computed({
  get() {
    return focusGroupOverride.value ?? groups.value[0] ?? "";
  },
  set(val: string) {
    focusGroupOverride.value = val;
  },
});

const displayItems = computed(() => {
  const t = i18nStore.strings;
  return [
    {
      key: PluginSetting.ShowDatabaseAttributes,
      value: configStore.showDatabaseAttributes,
      type: "checkbox" as const,
      title: t.configShowDatabasePropertiesTitle,
      description: t.configShowDatabasePropertiesDesc,
    },
    {
      key: PluginSetting.ShowPrimaryKey,
      value: configStore.showPrimaryKey,
      type: "checkbox" as const,
      title: t.configShowPrimaryKeyTitle,
      description: t.configShowPrimaryKeyDesc,
    },
    {
      key: PluginSetting.ShowEmptyAttributes,
      value: configStore.showEmptyAttributes,
      type: "checkbox" as const,
      title: t.configShowEmptyPropertiesTitle,
      description: t.configShowEmptyPropertiesDesc,
    },
    {
      key: PluginSetting.HideInSpacedRepetition,
      value: configStore.hideInSpacedRepetition,
      type: "checkbox" as const,
      title: t.configHideInSpacedRepetitionTitle,
      description: t.configHideInSpacedRepetitionDesc,
    },
  ];
});

// Styling settings
const stylingItems = computed(() => {
  const t = i18nStore.strings;
  return [
    {
      key: PluginSetting.AlignPropertiesLeft,
      value: configStore.alignPropertiesLeft,
      type: "checkbox" as const,
      title: t.configAlignPropertiesLeftTitle,
      description: t.configAlignPropertiesLeftDesc,
    },
    {
      key: PluginSetting.ShowBottomSeparator,
      value: configStore.showBottomSeparator,
      type: "checkbox" as const,
      title: t.configShowBottomSeparatorTitle,
      description: t.configShowBottomSeparatorDesc,
    },
  ];
});

// Debug settings
const debugItems = computed(() => {
  const t = i18nStore.strings;
  return [
    {
      key: PluginSetting.EnableDebugLogging,
      value: configStore.enableDebugLogging,
      type: "checkbox" as const,
      title: t.configEnableDebugLoggingTitle,
      description: t.configEnableDebugLoggingDesc,
    },
  ];
});

// Dynamic logs description based on current buffer size
const logsDesc = computed(() =>
  i18nStore.strings.debugLogsDesc?.replace("{count}", String(LoggerService.getMaxLogs()))
);

const onSettingChange = async (_group: string, key: string, value: unknown) => {
  logger.debug("onSettingChange", { key, value });

  try {
    configStore.setSetting(
      key as Exclude<(typeof PluginSetting)[keyof typeof PluginSetting], "columnVisibility">,
      value as boolean
    );
    await props.plugin.saveData(STORAGE_NAME, configStore.getSettingsObject());
    logger.debug("Settings saved successfully");
  } catch (error) {
    logger.error("Failed to save settings:", error);
    showMessage("Failed to save settings");
  }
};

</script>

<template>
  <div class="fn__flex-1 fn__flex config__panel">
    <ul class="b3-tab-bar b3-list b3-list--background">
      <li
        v-for="group in groups"
        :key="group"
        data-name="editor"
        :class="['b3-list-item', { 'b3-list-item--focus': group === focusGroup }]"
        @click="focusGroup = group"
        @keydown="(e) => { if (e.key === 'Enter') focusGroup = group; }"
      >
        <span class="b3-list-item__text">{{ group }}</span>
        <span class="b3-list-item__action"><Icon :icon="groupIcons[group]" /></span>
      </li>
    </ul>
    <div class="config__tab-wrap">
      <SettingPanel
        :group="groups[0]"
        :setting-items="displayItems"
        :display="focusGroup === groups[0]"
        @setting-change="onSettingChange"
      />
      <SettingPanel
        :group="groups[1]"
        :setting-items="stylingItems"
        :display="focusGroup === groups[1]"
        @setting-change="onSettingChange"
      />
      <SettingPanel
        :group="groups[2]"
        :setting-items="[]"
        :display="focusGroup === groups[2]"
        @setting-change="onSettingChange"
      >
        <DatabaseColumnSettings :plugin="plugin" />
      </SettingPanel>
      <SettingPanel
        :group="groups[3]"
        :setting-items="debugItems"
        :display="focusGroup === groups[3]"
        @setting-change="onSettingChange"
      >
        <div class="config__debug-panel">
          <div class="b3-label">
            <div class="fn__flex">
              <div class="fn__flex-1">
                {{ i18nStore.strings.debugPluginVersion }}
              </div>
              <span class="b3-label__text">{{ pluginVersion }}</span>
            </div>
          </div>
          <div v-if="configStore.enableDebugLogging" class="b3-label">
            <div class="fn__flex">
              <div class="fn__flex-1">
                {{ i18nStore.strings.debugLogs }}
                <div class="b3-label__text">{{ logsDesc }}</div>
              </div>
            </div>
            <div class="fn__flex config__debug-actions">
              <div class="fn__flex-1"></div>
              <button class="b3-button b3-button--outline" @click="resetLogs">
                {{ i18nStore.strings.debugResetLogs }}
              </button>
              <button class="b3-button b3-button--outline" @click="copyLogs">
                {{ i18nStore.strings.debugCopyLogs }}
              </button>
            </div>
            <div class="b3-label__text">
              <textarea
                class="b3-text-field fn__block"
                readonly
                rows="15"
                :value="logsText"
              ></textarea>
            </div>
          </div>
        </div>
      </SettingPanel>
    </div>
  </div>
</template>

<style scoped lang="scss">
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
  :deep(textarea) {
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

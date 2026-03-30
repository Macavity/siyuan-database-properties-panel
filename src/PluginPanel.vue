<script setup lang="ts">
import { ref, computed, provide, onMounted, onUnmounted } from "vue";
import AttributeViewPanel from "./components/AttributeViewPanel.vue";
import AttributeViewPanelNative from "./components/AttributeViewPanelNative.vue";
import ProtyleBreadcrumb from "@/components/ProtyleBreadcrumb.vue";
import Icon from "@/components/ui/SiYuanIcon.vue";
import type { I18N } from "@/types/i18n";
import type { Protyle } from "siyuan";
import type { AttributeView } from "@/types/AttributeView";
import { ProtyleKey, BlockIDKey, RefreshCallbackKey } from "@/types/context";
import { useLocalSettingStore } from "@/stores/localSettingStore";
import { useConfigStore } from "@/stores/configStore";
import { Logger } from "@/services/LoggerService";
import { getAttributeViewKeys } from "@/api";

const props = withDefaults(
  defineProps<{
    i18n: I18N;
    allowEditing?: boolean;
    avData?: AttributeView[];
    protyle: Protyle;
    blockId: string;
  }>(),
  { allowEditing: false, avData: () => [] },
);

const settingsStore = useLocalSettingStore();
const configStore = useConfigStore();

// Mutable avData for refresh
const avData = ref<AttributeView[]>([...props.avData]);

// Debounce timer for data refresh
let refreshTimer: ReturnType<typeof setTimeout> | null = null;

function refreshAvData() {
  if (refreshTimer) clearTimeout(refreshTimer);
  refreshTimer = setTimeout(async () => {
    Logger.debug("Refreshing avData for blockId:", props.blockId);
    try {
      const newData = await getAttributeViewKeys(props.blockId);
      if (newData) avData.value = newData;
    } catch (error) {
      Logger.error("Failed to refresh avData", error);
    }
  }, 100);
}

// Provide context
provide(ProtyleKey, props.protyle);
provide(BlockIDKey, props.blockId);
provide(RefreshCallbackKey, refreshAvData);

const openAvPanel = (avId: string) => {
  settingsStore.activateTab(props.blockId, avId);
};

// Handle custom event from plugin when AV data changes via transaction
const handleAvDataChanged = (event: Event) => {
  const customEvent = event as CustomEvent<{
    rowID: string;
    avID: string;
    keyID: string;
  }>;
  // Only refresh if this event is for our block
  if (customEvent.detail.rowID === props.blockId) {
    Logger.debug("Received dpp-av-data-changed for our blockId, refreshing");
    refreshAvData();
  }
};

onMounted(() => {
  window.addEventListener("dpp-av-data-changed", handleAvDataChanged);
});

onUnmounted(() => {
  window.removeEventListener("dpp-av-data-changed", handleAvDataChanged);
  if (refreshTimer) clearTimeout(refreshTimer);
});

const isCollapsed = computed(() => settingsStore.getDocumentSettings(props.blockId).isCollapsed);
const showBottomSeparator = computed(() => configStore.showBottomSeparator);
</script>

<template>
  <div class="plugin-panel">
    <ProtyleBreadcrumb :single-tab="avData.length === 1">
      <span
        v-for="(av, i) in avData"
        :key="av.avID"
        class="protyle-breadcrumb__item"
        role="button"
        :tabindex="i"
        @click="openAvPanel(av.avID)"
        @keydown="openAvPanel(av.avID)"
      >
        <Icon icon="iconDatabase" />
        <span class="protyle-breadcrumb__text">{{ av.avName }}</span>
      </span>
    </ProtyleBreadcrumb>
    <template v-if="!isCollapsed">
      <AttributeViewPanelNative v-if="allowEditing" :av-data="avData" :onrefresh="refreshAvData" />
      <AttributeViewPanel v-else :av-data="avData" />
      <div v-if="showBottomSeparator" class="dpp-separator"></div>
    </template>
  </div>
</template>

<style scoped>
.dpp-separator {
  height: 0.0625em;
  background-color: var(--b3-theme-background-light);
  width: calc(100% - 1px);
  left: 0;
  top: 0.8125em;
}
</style>

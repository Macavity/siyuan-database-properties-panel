<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { LoggerService } from "@/services/LoggerService";
import type { AttributeView } from "@/types/AttributeView";
import LayoutTabBar from "@/components/ui/LayoutTabBar.vue";
import { useLocalSettingStore } from "@/stores/localSettingStore";
import { AttributeViewService } from "@/services/AttributeViewService";
import { useConfigStore } from "@/stores/configStore";
import { useDocumentSettingsStore } from "@/stores/documentSettingsStore";
import { usePluginContext } from "@/composables/usePluginContext";

const props = defineProps<{
  avData: AttributeView[];
  onrefresh?: () => void;
}>();

const element = ref<HTMLDivElement | null>(null);

const { blockId, protyle } = usePluginContext();
const logger = new LoggerService("AttributeViewPanelNative");
const settingsStore = useLocalSettingStore();
const configStore = useConfigStore();
const documentSettingsStore = useDocumentSettingsStore();

const tabs = computed(() => AttributeViewService.buildTabs(props.avData));

const globalShowEmptyAttributes = computed(() => configStore.showEmptyAttributes);
const globalShowPrimaryKey = computed(() => configStore.showPrimaryKey);
const alignPropertiesLeft = computed(() => configStore.alignPropertiesLeft);
const effectiveShowEmptyAttributes = computed(() =>
  documentSettingsStore.getEffectiveShowEmptyAttributes(blockId, globalShowEmptyAttributes.value),
);

const currentSettings = computed(() => settingsStore.getDocumentSettings(blockId));

let isInitialized = false;
let cleanupDataRenderingObserver: (() => void) | null = null;

function isColumnVisible(avId: string, colId: string): boolean {
  return configStore.isColumnVisible(avId, colId);
}

// Watch for store changes to re-adjust DOM
watch(
  [globalShowPrimaryKey, effectiveShowEmptyAttributes, alignPropertiesLeft],
  () => {
    if (element.value) {
      AttributeViewService.adjustDOM(
        element.value,
        blockId,
        props.avData,
        globalShowPrimaryKey.value,
        effectiveShowEmptyAttributes.value,
        alignPropertiesLeft.value,
        props.onrefresh,
        isColumnVisible,
      );
    }
  },
  { flush: "post" },
);

// Watch for avData changes to re-render (deep: true to catch in-place mutations)
watch(
  () => props.avData,
  () => {
    if (isInitialized && element.value) {
      logger.debug("avData changed, re-rendering native panel");
      renderProtyleAv();
    }
  },
  { deep: true },
);

onMounted(() => {
  logger.addBreadcrumb(blockId, "onMount");
  renderProtyleAv();
  setTimeout(() => {
    isInitialized = true;
  }, 100);
});

onUnmounted(() => {
  if (cleanupDataRenderingObserver) {
    cleanupDataRenderingObserver();
    cleanupDataRenderingObserver = null;
  }
});

function showContent(tabFocus: string) {
  if (!tabFocus) return;
  activateTab(tabFocus);
}

function activateTab(tabFocus: string) {
  if (!element.value) return;
  logger.addBreadcrumb(blockId, "activateTab: " + LoggerService.getReadableName(tabFocus));
  const targetTab = element.value.querySelectorAll(
    `[data-type="NodeAttributeView"][data-av-id="${tabFocus}"]`,
  );
  const remainingTabs = element.value.querySelectorAll(
    `[data-type="NodeAttributeView"]:not([data-av-id="${tabFocus}"])`,
  );
  if (!targetTab.length) {
    logger.info("showContent: No target tab found");
    return;
  }
  settingsStore.activateTab(blockId, tabFocus);

  targetTab.forEach((item: Element) => {
    (item as HTMLElement).classList.remove("dpp-av-panel--hidden");
  });
  remainingTabs.forEach((item: Element) => {
    (item as HTMLElement).classList.add("dpp-av-panel--hidden");
  });
}

function renderProtyleAv() {
  if (cleanupDataRenderingObserver) {
    cleanupDataRenderingObserver();
    cleanupDataRenderingObserver = null;
  }

  protyle.renderAVAttribute(element.value, blockId, (renderedElement: HTMLElement) => {
    logger.debug("renderAVAttribute callback called");
    AttributeViewService.adjustDOM(
      renderedElement,
      blockId,
      props.avData,
      globalShowPrimaryKey.value,
      effectiveShowEmptyAttributes.value,
      alignPropertiesLeft.value,
      props.onrefresh,
      isColumnVisible,
    );

    if (!settingsStore.isAnyTabActive(blockId)) {
      const first = renderedElement.querySelector(`[data-type="NodeAttributeView"]`);
      if (first) {
        activateTab(first.getAttribute("data-av-id") ?? "");
      }
    } else {
      activateTab(settingsStore.getActiveTab(blockId)!);
    }

    AttributeViewService.removeDataRenderingFromNodeAttributeViews(renderedElement);
    cleanupDataRenderingObserver =
      AttributeViewService.watchAndRemoveDataRendering(renderedElement);
  });
}
</script>

<template>
  <div>
    <LayoutTabBar
      v-if="tabs.length > 1"
      :tabs="tabs"
      :focus="currentSettings.lastSelectedAttributeView"
      @click="showContent"
    />
    <div
      ref="element"
      class="dpp-av-panel custom-attr dpp-av-panel--native"
      data-type="NodeBlockQueryEmbed"
    ></div>
  </div>
</template>

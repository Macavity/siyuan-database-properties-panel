<script setup lang="ts">
import { ref, computed } from "vue";
import type { AttributeView } from "@/types/AttributeView";
import AttributeViewValue from "@/components/AttributeViewValue.vue";
import { filterAVKeyAndValues } from "@/libs/getAVKeyAndValues";
import ColumnIcon from "./ColumnIcon.vue";
import { escapeAttr } from "@/libs/siyuan/protyle/util/escape";
import LayoutTabBar from "@/components/ui/LayoutTabBar.vue";
import { useLocalSettingStore } from "@/stores/localSettingStore";
import { useConfigStore } from "@/stores/configStore";
import { useDocumentSettingsStore } from "@/stores/documentSettingsStore";
import ShowEmptyAttributesToggle from "@/components/ShowEmptyAttributesToggle.vue";
import { openEdit } from "@/libs/siyuan/protyle/render/av/blockAttr";
import { AttributeViewService } from "@/services/AttributeViewService";
import { usePluginContext } from "@/composables/usePluginContext";

const props = withDefaults(
  defineProps<{
    avData: AttributeView[];
    enableDragAndDrop?: boolean;
    allowEditing?: boolean;
  }>(),
  { enableDragAndDrop: false, allowEditing: false },
);

const panelElement = ref<HTMLDivElement | null>(null);

const { blockId, protyle } = usePluginContext();
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
const activeAvId = computed(
  () => currentSettings.value.lastSelectedAttributeView || props.avData[0]?.avID,
);
const activeTable = computed(
  () => props.avData.find((t) => t.avID === activeAvId.value) || props.avData[0],
);

function getFilteredKeyValues(keyValues: AttributeView["keyValues"], avId: string) {
  return filterAVKeyAndValues(
    keyValues,
    globalShowPrimaryKey.value,
    effectiveShowEmptyAttributes.value,
    avId,
  );
}

function showContent(tabFocus: string) {
  if (tabFocus) {
    settingsStore.activateTab(blockId, tabFocus);
  }
}

function handleValueClick(event: MouseEvent) {
  if (props.allowEditing && protyle && panelElement.value) {
    openEdit(protyle.protyle, panelElement.value, event);
  }
}
</script>

<template>
  <LayoutTabBar v-if="tabs.length > 1" :tabs="tabs" :focus="activeAvId" @click="showContent" />

  <div ref="panelElement" class="dpp-av-panel custom-attr">
    <template v-if="activeTable">
      <div :data-av-id="activeTable.avID" :data-node-id="blockId" data-type="NodeAttributeView">
        <div
          v-for="item in getFilteredKeyValues(activeTable.keyValues, activeTable.avID)"
          :key="item.key.id"
          :class="[
            'av-panel-row block__icons',
            {
              'av-panel-row--editable': allowEditing,
              'av-panel-row--align-left': alignPropertiesLeft,
            },
          ]"
          :data-id="blockId"
          :data-col-id="item.key.id"
        >
          <template v-if="enableDragAndDrop">
            <div class="block__icon" draggable="true">
              <svg><use xlink:href="#iconDrag"></use></svg>
            </div>
          </template>
          <template v-else>
            <ColumnIcon :av-key="item.key" />
          </template>
          <div
            :data-av-id="activeTable.avID"
            :data-col-id="item.values[0].keyID"
            :data-block-id="item.values[0].blockID"
            :data-id="item.values[0].id"
            :data-type="item.values[0].type"
            :data-options="item.key?.options ? escapeAttr(JSON.stringify(item.key.options)) : '[]'"
            :class="[
              'fn__flex-1 fn__flex',
              {
                'custom-attr__avvalue': ![
                  'url',
                  'text',
                  'number',
                  'email',
                  'phone',
                  'block',
                ].includes(item.values[0].type),
              },
            ]"
            role="button"
            tabindex="0"
            @click="handleValueClick"
            @keydown.enter="handleValueClick($event as unknown as MouseEvent)"
          >
            <AttributeViewValue
              :value="item.values[0]"
              :av-i-d="activeTable.avID"
              :key-i-d="item.key.id"
              :row-i-d="item.values[0].blockID"
              :allow-editing="allowEditing"
            />
          </div>
        </div>
      </div>
      <ShowEmptyAttributesToggle :document-id="blockId" />
    </template>
  </div>
</template>

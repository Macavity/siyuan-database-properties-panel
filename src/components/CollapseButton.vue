<script setup lang="ts">
import { computed } from "vue";
import ActionButton from "@/components/ui/ActionButton.vue";
import { useLocalSettingStore } from "@/stores/localSettingStore";
import { useI18nStore } from "@/stores/i18nStore";
import type { SiYuanIcon } from "@/types/SiyuanIcon";

const props = defineProps<{
  documentId: string;
}>();

const settingsStore = useLocalSettingStore();
const i18nStore = useI18nStore();

const isCollapsed = computed(
  () => settingsStore.getDocumentSettings(props.documentId).isCollapsed,
);
const icon = computed<SiYuanIcon>(() => (isCollapsed.value ? "iconExpand" : "iconContract"));
const label = computed(() => (isCollapsed.value ? "" : i18nStore.strings.collapse));

function toggleCollapseTab() {
  settingsStore.toggleCollapsed(props.documentId);
}
</script>

<template>
  <ActionButton
    class="dpp-collapse-button"
    :icon="icon"
    :label="label"
    @click="toggleCollapseTab"
  />
</template>

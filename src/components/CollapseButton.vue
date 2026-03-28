<script setup lang="ts">
import { computed, inject } from "vue";
import ActionButton from "@/components/ui/ActionButton.vue";
import { useLocalSettingStore } from "@/stores/localSettingStore";
import { useI18nStore } from "@/stores/i18nStore";
import { BlockIDKey } from "@/types/context";
import type { SiYuanIcon } from "@/types/SiyuanIcon";

const props = defineProps<{
  documentId?: string;
}>();

const settingsStore = useLocalSettingStore();
const i18nStore = useI18nStore();

// Use prop if provided, otherwise fall back to context.
// inject() returns undefined when no provider exists (e.g. when mounted
// dynamically via createApp in AttributeViewService), so we use inject
// directly instead of usePluginContext (which throws on missing values).
const contextDocumentId = inject(BlockIDKey, undefined);

const documentId = computed(() => props.documentId || contextDocumentId || "");

const isCollapsed = computed(() => settingsStore.getDocumentSettings(documentId.value).isCollapsed);
const icon = computed<SiYuanIcon>(() => (isCollapsed.value ? "iconExpand" : "iconContract"));
const label = computed(() => (isCollapsed.value ? "" : i18nStore.strings.collapse));

function toggleCollapseTab() {
  settingsStore.toggleCollapsed(documentId.value);
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

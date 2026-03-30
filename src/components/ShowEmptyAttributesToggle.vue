<script setup lang="ts">
import { computed } from "vue";
import ActionButton from "@/components/ui/ActionButton.vue";
import { useI18nStore } from "@/stores/i18nStore";
import { useConfigStore } from "@/stores/configStore";
import { useDocumentSettingsStore } from "@/stores/documentSettingsStore";

const props = defineProps<{
  documentId: string;
}>();

const i18nStore = useI18nStore();
const configStore = useConfigStore();
const documentSettingsStore = useDocumentSettingsStore();

const globalShowEmptyAttributes = computed(() => configStore.showEmptyAttributes);

const effectiveShowEmptyAttributes = computed(() =>
  documentSettingsStore.getEffectiveShowEmptyAttributes(
    props.documentId,
    globalShowEmptyAttributes.value,
  ),
);

function toggleShowEmptyAttributes(event: MouseEvent) {
  documentSettingsStore.toggleShowEmptyAttributes(
    props.documentId,
    globalShowEmptyAttributes.value,
  );
  (event.currentTarget as HTMLButtonElement).blur();
}
</script>

<template>
  <ActionButton
    :icon="effectiveShowEmptyAttributes ? 'iconEyeoff' : 'iconEye'"
    :label="
      effectiveShowEmptyAttributes
        ? i18nStore.strings.hideEmptyAttributesToggle
        : i18nStore.strings.showEmptyAttributesToggle
    "
    class="dpp-empty-attributes-toggle"
    @click="toggleShowEmptyAttributes"
  />
</template>

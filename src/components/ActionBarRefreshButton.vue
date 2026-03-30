<script setup lang="ts">
import ActionButton from "@/components/ui/ActionButton.vue";
import { useI18nStore } from "@/stores/i18nStore";

const props = defineProps<{
  onRefresh?: () => void;
}>();

const i18nStore = useI18nStore();

function handleRefresh(event: MouseEvent) {
  if (props.onRefresh) {
    props.onRefresh();
  }
  (event.currentTarget as HTMLButtonElement).blur();
}
</script>

<template>
  <ActionButton
    icon="iconRefresh"
    :label="i18nStore.strings.refresh"
    class="dpp-refresh-button"
    @click="handleRefresh"
  />
</template>

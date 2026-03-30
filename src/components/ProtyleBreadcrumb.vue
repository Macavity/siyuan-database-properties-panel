<script setup lang="ts">
import { computed } from "vue";
import { useLocalSettingStore } from "@/stores/localSettingStore";
import { usePluginContext } from "@/composables/usePluginContext";
import CollapseButton from "@/components/CollapseButton.vue";

defineProps<{
  singleTab: boolean;
}>();

const settingsStore = useLocalSettingStore();
const { blockId: documentId } = usePluginContext();

const isCollapsed = computed(() => settingsStore.getDocumentSettings(documentId).isCollapsed);
</script>

<template>
  <div
    v-if="isCollapsed || singleTab"
    id="top-navigation-bar"
    class="protyle-breadcrumb"
    :class="{ 'protyle-breadcrumb--single-tab': singleTab }"
  >
    <template v-if="isCollapsed">
      <CollapseButton :document-id="documentId" />
      <div class="protyle-breadcrumb__bar protyle-breadcrumb__bar--nowrap">
        <slot />
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.protyle-breadcrumb {
  margin-left: 0;
  padding: 4px 0;
}
.protyle-breadcrumb.protyle-breadcrumb--single-tab:first-child {
  margin-left: 0;
}
</style>

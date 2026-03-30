<script setup lang="ts">
import CollapseButton from "@/components/ActionBarCollapseButton.vue";
import ShowEmptyAttributesToggle from "@/components/ActionBarShowEmptyToggle.vue";
import RefreshButton from "@/components/ActionBarRefreshButton.vue";

defineProps<{
  documentId: string;
  addColumnLabel?: string;
  onRefresh?: () => void;
}>();
</script>

<template>
  <CollapseButton :document-id="documentId" />
  <!-- Native Siyuan Button Markup -->
  <button data-type="addColumn" class="b3-button b3-button--cancel">
    <svg><use xlink:href="#iconAdd"></use></svg>{{ addColumnLabel }}
  </button>
  <ShowEmptyAttributesToggle :document-id="documentId" />
  <RefreshButton :on-refresh="onRefresh" />
</template>

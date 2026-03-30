<script setup lang="ts">
import CollapseButton from "@/components/CollapseButton.vue";
import ShowEmptyAttributesToggle from "@/components/ShowEmptyAttributesToggle.vue";
import RefreshButton from "@/components/RefreshButton.vue";

defineProps<{
  documentId: string;
  addColumnLabel?: string;
  onRefresh?: () => void;
}>();
</script>

<template>
  <CollapseButton :document-id="documentId" />
  <button data-type="addColumn" class="b3-button b3-button--cancel">
    <svg><use xlink:href="#iconAdd"></use></svg>{{ addColumnLabel }}
  </button>
  <ShowEmptyAttributesToggle :document-id="documentId" />
  <RefreshButton :on-refresh="onRefresh" />
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { IAVCellValue } from "@/types/siyuan.types";
import AttributeViewRollup from "./AttributeViewRollup.vue";

const props = defineProps<{ value: IAVCellValue }>();

const lastId = computed(() =>
  props.value.relation?.contents?.length
    ? props.value.relation.contents[props.value.relation.contents.length - 1]?.id
    : null,
);
</script>

<template>
  <template v-if="value?.relation?.contents">
    <template v-for="item in value.relation.contents" :key="item?.id">
      <template v-if="item">
        <AttributeViewRollup :value="item" />
        <template v-if="item.id !== lastId">,&nbsp;</template>
      </template>
    </template>
  </template>
</template>

<script setup lang="ts">
import type { IAVCellValue } from "@/types/siyuan.types";

defineProps<{ value: IAVCellValue }>();
</script>

<template>
  <template v-if="value.mSelect && value.mSelect.length > 0">
    <span
      v-for="item in value.mSelect"
      :key="item.content"
      class="b3-chip b3-chip--middle"
      :style="`background-color:var(--b3-font-background${item.color});color:var(--b3-font-color${item.color})`"
    >
      {{ item.content }}
    </span>
  </template>
</template>

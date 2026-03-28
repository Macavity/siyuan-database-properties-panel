<script setup lang="ts">
import type { IAVCellValue } from "@/types/siyuan.types";

defineProps<{ value: IAVCellValue }>();
</script>

<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div class="fn__flex-1" v-html="value.template.content"></div>
</template>

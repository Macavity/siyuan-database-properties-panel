<script setup lang="ts">
import type { IAVCellValue } from "@/types/siyuan.types";

defineProps<{ value: IAVCellValue }>();
</script>

<template>
  <textarea
    style="resize: vertical"
    :rows="value.text.content.split('\n').length"
    class="b3-text-field b3-text-field--text fn__flex-1"
    :value="value.text.content"
    readonly
  ></textarea>
</template>

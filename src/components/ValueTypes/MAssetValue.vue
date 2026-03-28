<script setup lang="ts">
import { escapeAttr } from "@/libs/siyuan/protyle/util/escape";
import type { IAVCellValue } from "@/types/siyuan.types";

defineProps<{ value: IAVCellValue }>();
</script>

<template>
  <template v-if="value.mAsset">
    <template v-for="(item, index) in value.mAsset" :key="index">
      <img
        v-if="item.type === 'image'"
        class="av__cellassetimg ariaLabel"
        :aria-label="item.content"
        :src="item.content"
        alt=""
      />
      <span
        v-else
        class="b3-chip b3-chip--middle av__celltext--url ariaLabel"
        :aria-label="escapeAttr(item.content)"
        :data-name="escapeAttr(item.name)"
        :data-url="escapeAttr(item.content)"
      >
        {{ item.name || item.content }}
      </span>
    </template>
  </template>
</template>

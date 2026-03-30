<script setup lang="ts">
import type { AVKey } from "@/types/AttributeView";
import CustomIcon from "./CustomIcon.vue";
import { getColIconByType } from "@/libs/siyuan/protyle/render/av/col";
import { escapeAttr } from "@/libs/siyuan/protyle/util/escape";

// Using `avKey` instead of `key` to avoid Vue reserved prop name conflict
defineProps<{ avKey: AVKey }>();
</script>

<template>
  <div
    class="block__logo ariaLabel fn__pointer"
    data-type="editCol"
    data-position="parentW"
    :aria-label="escapeAttr(avKey.name)"
  >
    <CustomIcon
      v-if="avKey.icon && avKey.icon !== ''"
      :unicode="avKey.icon"
      class-name="block__logoicon"
      :need-span="true"
    />
    <svg v-else class="block__logoicon">
      <use :xlink:href="`#${getColIconByType(avKey.type)}`"></use>
    </svg>
    <span>{{ avKey.name }}</span>
  </div>
</template>

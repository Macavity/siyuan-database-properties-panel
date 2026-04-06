<script setup lang="ts">
import type { SiYuanIcon } from "@/types/SiyuanIcon";

const props = defineProps<{
  icon: SiYuanIcon;
  class?: string;
}>();
</script>

<template>
  <svg :class="props.class" xmlns="http://www.w3.org/2000/svg">
    <use :xlink:href="`#${props.icon}`"></use>
  </svg>
</template>

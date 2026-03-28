<script setup lang="ts">
import Icon from "@/components/ui/Icon.vue";
import type { SiYuanIcon } from "@/types/SiyuanIcon";

const props = withDefaults(
  defineProps<{
    label?: string | null;
    icon?: SiYuanIcon | null;
    class?: string | null;
  }>(),
  {
    label: null,
    icon: null,
    class: null,
  }
);

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();
</script>

<template>
  <button
    :class="['b3-button b3-button--cancel', props.class]"
    @click="emit('click', $event)"
  >
    <Icon v-if="props.icon" :icon="props.icon" />
    <template v-if="props.label">{{ props.label }}</template>
  </button>
</template>

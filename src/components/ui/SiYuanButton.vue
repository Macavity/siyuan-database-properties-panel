<script setup lang="ts">
import Icon from "@/components/ui/SiYuanIcon.vue";
import type { SiYuanIcon } from "@/types/SiyuanIcon";

const props = withDefaults(
  defineProps<{
    label?: string | null;
    icon?: SiYuanIcon | null;
    isFocused?: boolean;
    tooltip?: string | null;
    class?: string | null;
  }>(),
  {
    label: null,
    icon: null,
    isFocused: false,
    tooltip: null,
    class: null,
  },
);

const emit = defineEmits<{
  click: [event: Event];
}>();

function handleClick(event: Event) {
  emit("click", event);
}
</script>

<template>
  <button
    :class="[
      'block__icon block__icon--show',
      props.class,
      {
        'b3-tooltips__w': props.tooltip !== null,
        'b3-tooltips': props.tooltip !== null,
        'item--focus': props.isFocused,
      },
    ]"
    :aria-label="props.tooltip"
    @click="handleClick"
    @keydown="handleClick"
  >
    <Icon v-if="props.icon" :icon="props.icon" />
    <span v-if="props.label" class="item__text">{{ props.label }}</span>
  </button>
</template>

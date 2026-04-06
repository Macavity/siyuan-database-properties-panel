<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    unicode: string;
    className?: string;
    needSpan?: boolean;
    lazy?: boolean;
  }>(),
  { className: "", needSpan: false, lazy: false },
);

const emoji = computed(() => {
  if (!props.unicode) return "";
  try {
    let result = "";
    props.unicode.split("-").forEach((item) => {
      if (item.length < 5) {
        result += String.fromCodePoint(parseInt("0" + item, 16));
      } else {
        result += String.fromCodePoint(parseInt(item, 16));
      }
    });
    return result;
  } catch (e) {
    return "";
  }
});
</script>

<template>
  <img
    v-if="unicode.indexOf('.') > -1"
    :class="className"
    :src="lazy ? undefined : `/emojis/${unicode}`"
    alt="Emoji"
    :data-src="lazy ? `/emojis/${unicode}` : undefined"
  />
  <span v-else-if="needSpan" :class="className">{{ emoji }}</span>
  <template v-else>{{ emoji }}</template>
</template>

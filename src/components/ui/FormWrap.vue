<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string;
    description: string;
    direction?: "row" | "column";
  }>(),
  { direction: "column" },
);
</script>

<template>
  <div v-if="direction === 'row'" class="item-wrap b3-label" data-key="CustomCSS">
    <div class="fn__block">
      <span class="title">{{ title }}</span>
      <div class="b3-label__text">{{ description }}</div>
      <div class="fn__hr"></div>
      <div style="display: flex; flex-direction: column; gap: 5px; position: relative">
        <slot />
      </div>
    </div>
  </div>
  <div v-else class="item-wrap fn__flex b3-label config__item">
    <div class="fn__flex-1">
      <span class="title">{{ title }}</span>
      <div class="b3-label__text">{{ description }}</div>
    </div>
    <span class="fn__space"></span>
    <slot />
  </div>
</template>

<style scoped>
span.title {
  font-weight: bold;
  color: var(--b3-theme-primary);
}
.item-wrap.b3-label {
  box-shadow: none !important;
  padding-bottom: 16px;
  margin-bottom: 16px;
}
.item-wrap.b3-label:not(:last-child) {
  border-bottom: 1px solid var(--b3-border-color);
}
</style>

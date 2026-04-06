<script setup lang="ts">
import Icon from "@/components/ui/SiYuanIcon.vue";
import type { SiYuanIcon } from "@/types/SiyuanIcon";

interface Tab {
  key: string;
  name: string;
  dataType?: string;
  icon?: SiYuanIcon;
}

defineProps<{
  tabs: Tab[];
  focus: string;
}>();

const emit = defineEmits<{
  click: [key: string];
}>();

function activateTab(key: string) {
  emit("click", key);
}
</script>

<template>
  <div class="fn__flex layout-tab-bar-wrapper">
    <div class="layout-tab-bar fn__flex fn__flex-1">
      <div
        v-for="tab in tabs"
        :key="tab.key"
        :class="['item item--full', { 'item--focus': tab.key === focus }]"
        :data-type="tab.dataType"
        role="button"
        tabindex="0"
        @click="activateTab(tab.key)"
        @keydown.enter.prevent="activateTab(tab.key)"
        @keydown.space.prevent="activateTab(tab.key)"
      >
        <span class="fn__flex-1"></span>
        <Icon v-if="tab.icon" class="block__logoicon" :icon="tab.icon" />
        <span class="item__text">{{ tab.name }}</span>
        <span class="fn__flex-1"></span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.layout-tab-bar-wrapper {
  padding: 0 8px;
}
</style>

<script setup lang="ts">
import FormWrap from "./FormWrap.vue";
import FormInput from "./FormInput.vue";
import { computed } from "vue";

interface SettingItem {
  type: "checkbox" | "select" | "textinput" | "textarea" | "number" | "slider" | "button";
  key: string;
  value: boolean | string | number;
  title: string;
  description: string;
  direction?: "row" | "column";
  placeholder?: string;
  options?: Record<string, string>;
  slider?: { min: number; max: number; step: number };
  button?: { label: string; callback: () => void };
}

const props = withDefaults(
  defineProps<{
    group: string;
    settingItems: SettingItem[];
    display?: boolean;
  }>(),
  { display: true }
);

const emit = defineEmits<{
  settingChange: [group: string, key: string, value: unknown];
}>();

const displayClass = computed(() => (props.display ? "" : "fn__none"));

function handleValueChange(key: string, value: unknown) {
  emit("settingChange", props.group, key, value);
}
</script>

<template>
  <div :class="['config__tab-container', displayClass]" :data-name="group">
    <FormWrap
      v-for="item in settingItems"
      :key="item.key"
      :title="item.title"
      :description="item.description"
      :direction="item.direction"
    >
      <FormInput
        :type="item.type"
        :setting-key="item.key"
        :model-value="item.value"
        :placeholder="item.placeholder"
        :options="item.options"
        :slider="item.slider"
        :button="item.button"
        @update:model-value="(val) => (item.value = val)"
        @value-change="handleValueChange"
      />
    </FormWrap>
    <slot />
  </div>
</template>

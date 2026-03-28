<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    type: string;
    settingKey: string;
    modelValue: boolean | number | string;
    placeholder?: string;
    options?: Record<string | number, string>;
    slider?: { min: number; max: number; step: number };
    button?: { label: string; callback?: () => void };
    fnSize?: boolean;
    style?: string;
  }>(),
  {
    placeholder: "",
    options: () => ({}),
    slider: () => ({ min: 0, max: 100, step: 1 }),
    button: () => ({ label: "", callback: () => {} }),
    fnSize: true,
    style: "",
  }
);

const emit = defineEmits<{
  "update:modelValue": [value: boolean | number | string];
  valueChange: [key: string, value: unknown];
}>();

function handleChange(newValue: unknown) {
  emit("valueChange", props.settingKey, newValue);
}
</script>

<template>
  <template v-if="type === 'checkbox' && typeof modelValue === 'boolean'">
    <input
      class="b3-switch fn__flex-center"
      :id="settingKey"
      type="checkbox"
      :checked="modelValue as boolean"
      :style="style"
      @change="($event) => { const checked = ($event.target as HTMLInputElement).checked; emit('update:modelValue', checked); handleChange(checked); }"
    />
  </template>
  <template v-else-if="type === 'textinput'">
    <input
      :class="['b3-text-field', 'fn__flex-center', { fn__size200: fnSize }]"
      :id="settingKey"
      :placeholder="placeholder"
      :value="modelValue"
      :style="style"
      @change="($event) => { const val = ($event.target as HTMLInputElement).value; emit('update:modelValue', val); handleChange(val); }"
    />
  </template>
  <template v-else-if="type === 'textarea'">
    <textarea
      class="b3-text-field fn__block"
      :style="`resize: vertical; height: 10em; white-space: nowrap; ${style}`"
      :value="modelValue"
      @change="($event) => { const val = ($event.target as HTMLTextAreaElement).value; emit('update:modelValue', val); handleChange(val); }"
    ></textarea>
  </template>
  <template v-else-if="type === 'number'">
    <input
      :class="['b3-text-field', 'fn__flex-center', { fn__size200: fnSize }]"
      :id="settingKey"
      type="number"
      :value="modelValue"
      :style="style"
      @change="($event) => { const val = Number(($event.target as HTMLInputElement).value); emit('update:modelValue', val); handleChange(val); }"
    />
  </template>
  <template v-else-if="type === 'button'">
    <button
      :class="['b3-button', 'b3-button--outline', 'fn__flex-center', { fn__size200: fnSize }]"
      :id="settingKey"
      :style="style"
      @click="button?.callback?.()"
    >
      {{ button.label }}
    </button>
  </template>
  <template v-else-if="type === 'select'">
    <select
      :class="['b3-select', 'fn__flex-center', { fn__size200: fnSize }]"
      :id="settingKey"
      :value="modelValue"
      :style="style"
      @change="($event) => { const val = ($event.target as HTMLSelectElement).value; emit('update:modelValue', val); handleChange(val); }"
    >
      <option v-for="(text, val) in options" :key="val" :value="val">{{ text }}</option>
    </select>
  </template>
  <template v-else-if="type === 'slider'">
    <div class="b3-tooltips b3-tooltips__n" :aria-label="String(modelValue)">
      <input
        :class="['b3-slider', { fn__size200: fnSize }]"
        :id="settingKey"
        :min="slider.min"
        :max="slider.max"
        :step="slider.step"
        type="range"
        :value="modelValue"
        :style="style"
        @change="($event) => { const val = Number(($event.target as HTMLInputElement).value); emit('update:modelValue', val); handleChange(val); }"
      />
    </div>
  </template>
</template>

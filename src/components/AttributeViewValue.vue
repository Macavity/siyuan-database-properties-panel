<script setup lang="ts">
import dayjs from "dayjs";
import MAssetValue from "./ValueTypes/MAssetValue.vue";
import DateValue from "./ValueTypes/DateValue.vue";
import RelationValue from "./ValueTypes/RelationValue.vue";
import MultiSelectValue from "./ValueTypes/MultiSelectValue.vue";
import AttributeViewRollup from "./ValueTypes/AttributeViewRollup.vue";
import TemplateValue from "./ValueTypes/TemplateValue.vue";
import type { IAVCellValue } from "@/types/siyuan.types";
import { setAttributeViewBlockAttr } from "@/api";

const props = withDefaults(
  defineProps<{
    value: IAVCellValue;
    avID?: string;
    keyID?: string;
    rowID?: string;
    allowEditing?: boolean;
  }>(),
  { avID: "", keyID: "", rowID: "", allowEditing: false }
);

const saveText = async (newContent: string) => {
  if (!props.avID || !props.keyID || !props.rowID) return;
  await setAttributeViewBlockAttr(props.avID, props.keyID, props.rowID, {
    text: { content: newContent },
  });
};

const saveNumber = async (newContent: number | string) => {
  if (!props.avID || !props.keyID || !props.rowID) return;
  const numValue = typeof newContent === "string" ? parseFloat(newContent) : newContent;
  const isNotEmpty = !isNaN(numValue) && newContent !== "";
  await setAttributeViewBlockAttr(props.avID, props.keyID, props.rowID, {
    number: { content: isNotEmpty ? numValue : 0, isNotEmpty },
  });
};

const saveUrl = async (newContent: string) => {
  if (!props.avID || !props.keyID || !props.rowID) return;
  await setAttributeViewBlockAttr(props.avID, props.keyID, props.rowID, {
    url: { content: newContent },
  });
};

const savePhone = async (newContent: string) => {
  if (!props.avID || !props.keyID || !props.rowID) return;
  await setAttributeViewBlockAttr(props.avID, props.keyID, props.rowID, {
    phone: { content: newContent },
  });
};

const saveEmail = async (newContent: string) => {
  if (!props.avID || !props.keyID || !props.rowID) return;
  await setAttributeViewBlockAttr(props.avID, props.keyID, props.rowID, {
    email: { content: newContent },
  });
};

const toggleCheckbox = async () => {
  if (!props.avID || !props.keyID || !props.rowID) return;
  const newChecked = !props.value.checkbox.checked;
  await setAttributeViewBlockAttr(props.avID, props.keyID, props.rowID, {
    checkbox: { checked: newChecked },
  });
  props.value.checkbox.checked = newChecked;
};
</script>

<template>
  <template v-if="value.type === 'block'">
    <div class="fn__flex-1">{{ value.block.content }}</div>
  </template>
  <template v-else-if="value.type === 'text'">
    <textarea
      style="resize: vertical"
      :rows="value.text?.content ? value.text.content.split('\n').length : 1"
      class="b3-text-field b3-text-field--text fn__flex-1"
      :disabled="!allowEditing"
      :value="value.text?.content || ''"
      @blur="(e) => allowEditing && saveText((e.target as HTMLTextAreaElement).value)"
    ></textarea>
  </template>
  <template v-else-if="value.type === 'number'">
    <input
      :value="value.number?.isNotEmpty ? value.number.content : ''"
      type="number"
      class="b3-text-field b3-text-field--text fn__flex-1"
      :disabled="!allowEditing"
      @blur="(e) => allowEditing && saveNumber((e.target as HTMLInputElement).value)"
    />
    <template v-if="value.number?.formattedContent">
      <span class="fn__space"></span>
      <span
        class="fn__flex-center ft__on-surface b3-tooltips__w b3-tooltips"
        :aria-label="window.siyuan.languages.format"
      >
        {{ value.number.formattedContent }}
      </span>
      <span class="fn__space"></span>
    </template>
  </template>
  <template v-else-if="value.type === 'select' || value.type === 'mSelect'">
    <MultiSelectValue :value="value" />
  </template>
  <template v-else-if="value.type === 'mAsset'">
    <MAssetValue :value="value" />
  </template>
  <template v-else-if="value.type === 'date'">
    <DateValue :value="value" />
  </template>
  <template v-else-if="value.type === 'created' || value.type === 'updated'">
    <span :data-content="value[value.type].content">
      {{ dayjs(value[value.type].content).format("YYYY-MM-DD HH:mm") }}
    </span>
  </template>
  <template v-else-if="value.type === 'url'">
    <input
      :value="value.url?.content || ''"
      class="b3-text-field b3-text-field--text fn__flex-1"
      :disabled="!allowEditing"
      @blur="(e) => allowEditing && saveUrl((e.target as HTMLInputElement).value)"
    />
    <span class="fn__space"></span>
    <a
      :href="value.url?.content || ''"
      target="_blank"
      :aria-label="window.siyuan.languages.openBy"
      class="block__icon block__icon--show fn__flex-center b3-tooltips__w b3-tooltips"
    >
      <svg><use xlink:href="#iconLink"></use></svg>
    </a>
  </template>
  <template v-else-if="value.type === 'phone'">
    <input
      :value="value.phone?.content || ''"
      class="b3-text-field b3-text-field--text fn__flex-1"
      :disabled="!allowEditing"
      @blur="(e) => allowEditing && savePhone((e.target as HTMLInputElement).value)"
    />
    <span class="fn__space"></span>
    <a
      :href="`tel:${value.phone?.content || ''}`"
      target="_blank"
      :aria-label="window.siyuan.languages.openBy"
      class="block__icon block__icon--show fn__flex-center b3-tooltips__w b3-tooltips"
    >
      <svg><use xlink:href="#iconPhone"></use></svg>
    </a>
  </template>
  <template v-else-if="value.type === 'checkbox'">
    <svg
      class="av__checkbox"
      :class="{ fn__pointer: allowEditing }"
      :tabindex="allowEditing ? 0 : -1"
      :role="allowEditing ? 'button' : 'img'"
      @click="allowEditing && toggleCheckbox()"
      @keydown="(e) => (e.key === 'Enter' || e.key === ' ') && allowEditing && toggleCheckbox()"
    >
      <use v-if="value.checkbox?.checked" xlink:href="#iconCheck"></use>
      <use v-else xlink:href="#iconUncheck"></use>
    </svg>
  </template>
  <template v-else-if="value.type === 'template'">
    <TemplateValue :value="value" />
  </template>
  <template v-else-if="value.type === 'email'">
    <input
      :value="value.email?.content || ''"
      class="b3-text-field b3-text-field--text fn__flex-1"
      :disabled="!allowEditing"
      @blur="(e) => allowEditing && saveEmail((e.target as HTMLInputElement).value)"
    />
    <span class="fn__space"></span>
    <a
      :href="`mailto:${value.email?.content || ''}`"
      target="_blank"
      :aria-label="window.siyuan.languages.openBy"
      class="block__icon block__icon--show fn__flex-center b3-tooltips__w b3-tooltips"
    >
      <svg><use xlink:href="#iconEmail"></use></svg>
    </a>
  </template>
  <template v-else-if="value.type === 'relation'">
    <RelationValue :value="value" />
  </template>
  <template v-else-if="value.type === 'rollup'">
    <template v-for="(item, idx) in value.rollup.contents" :key="item.id || idx">
      <template v-if="['select', 'mSelect', 'mAsset', 'checkbox', 'relation'].includes(item.type)">
        <AttributeViewValue :value="item" />
      </template>
      <template v-else>
        <AttributeViewRollup :value="item" />
      </template>
      <template v-if="idx < value.rollup.contents.length - 1">,&nbsp;</template>
    </template>
  </template>
</template>

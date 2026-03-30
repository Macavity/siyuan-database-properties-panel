<script setup lang="ts">
import type { IAVCellValue } from "@/types/siyuan.types";
import dayjs from "dayjs";
import { computed } from "vue";

defineProps<{ value: IAVCellValue }>();

const labelUntitled = computed(() => window.siyuan?.languages?.untitled ?? "");
</script>

<template>
  <template v-if="value.type === 'block'">
    <span v-if="value.isDetached" :data-id="value.block?.id">
      {{ value.block?.content || labelUntitled }}
    </span>
    <span
      v-else
      data-type="block-ref"
      :data-id="value.block?.id"
      data-subtype="s"
      class="av__celltext--ref"
    >
      {{ value.block?.content || labelUntitled }}
    </span>
  </template>
  <template v-else-if="value.type === 'text'">{{ value.text.content }}</template>
  <template v-else-if="value.type === 'number'">
    {{ value.number.formattedContent || value.number.content.toString() }}
  </template>
  <template v-else-if="value.type === 'date'">
    <span v-if="value.date && value.date.isNotEmpty" class="av__celltext">
      {{
        dayjs(value.date.content).format(value.date.isNotTime ? "YYYY-MM-DD" : "YYYY-MM-DD HH:mm")
      }}
      <template v-if="value.date.hasEndDate && value.date.isNotEmpty && value.date.isNotEmpty2">
        <svg class="av__cellicon"><use xlink:href="#iconForward"></use></svg>
        {{
          dayjs(value.date.content2).format(
            value.date.isNotTime ? "YYYY-MM-DD" : "YYYY-MM-DD HH:mm",
          )
        }}
      </template>
    </span>
  </template>
  <template v-else-if="value.type === 'url'">
    <a v-if="value.url.content" class="fn__a" :href="value.url.content" target="_blank">{{
      value.url.content
    }}</a>
  </template>
  <template v-else-if="value.type === 'phone'">
    <a
      v-if="value.phone.content"
      class="fn__a"
      :href="`tel:${value.phone.content}`"
      target="_blank"
      >{{ value.phone.content }}</a
    >
  </template>
  <template v-else-if="value.type === 'email'">
    <a
      v-if="value.email.content"
      class="fn__a"
      :href="`mailto:${value.email.content}`"
      target="_blank"
      >{{ value.email.content }}</a
    >
  </template>
</template>

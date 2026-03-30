<script setup lang="ts">
import { computed } from "vue";
import type { IAVCellValue } from "@/types/siyuan.types";
import dayjs from "dayjs";

const props = defineProps<{ value: IAVCellValue }>();

const content = computed(() => {
  const v = props.value[props.value.type];
  return v?.content ? dayjs(v.content).format(v.isNotTime ? "YYYY-MM-DD" : "YYYY-MM-DD HH:mm") : "";
});
</script>

<template>
  <span class="av__celltext" :data-value="JSON.stringify(value[value.type])">
    <template v-if="value[value.type]">
      <template v-if="value[value.type].isNotEmpty">
        {{ content }}
        <template v-if="value[value.type].hasEndDate && value[value.type].isNotEmpty2">
          <svg class="av__cellicon"><use xlink:href="#iconForward"></use></svg>
          {{
            dayjs(value[value.type].content2).format(
              value[value.type].isNotTime ? "YYYY-MM-DD" : "YYYY-MM-DD HH:mm",
            )
          }}
        </template>
      </template>
    </template>
  </span>
</template>

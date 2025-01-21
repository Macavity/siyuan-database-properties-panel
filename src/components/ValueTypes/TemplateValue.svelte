<script lang="ts">
  /* eslint-disable svelte/no-at-html-tags */
  import { type IAVCellValue } from "@/types/siyuan.types";
  export let value: IAVCellValue;
</script>

<div class="fn__flex-1">{@html value.template.content}</div>

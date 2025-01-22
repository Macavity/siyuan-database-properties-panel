<script lang="ts">
    import { type IAVCellValue } from "@/types/siyuan.types";
  interface Props {
    value: IAVCellValue;
  }

  let { value }: Props = $props();
</script>

<textarea
  style="resize: vertical"
  rows={value.text.content.split("\n").length}
  class="b3-text-field b3-text-field--text fn__flex-1"
>
  {value.text.content}
</textarea>

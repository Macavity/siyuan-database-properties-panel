<script lang="ts">
  import { type IAVCellValue } from "@/types/siyuan.types";

  interface Props {
    value: IAVCellValue;
  }

  let { value }: Props = $props();
</script>

{#if value.mSelect && value.mSelect.length > 0}
  {#each value.mSelect as item}
    <span
      class="b3-chip b3-chip--middle"
      style="background-color:var(--b3-font-background{item.color});color:var(--b3-font-color{item.color})"
    >
      {item.content}
    </span>
  {/each}
{/if}

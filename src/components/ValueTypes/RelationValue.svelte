<script lang="ts">
  import type { IAVCellValue } from "siyuan";
  import AttributeViewRollup from "./AttributeViewRollup.svelte";

  export let value: IAVCellValue;
  const lastId = value.relation?.contents ? value.relation.contents[value.relation.contents?.length - 1].id : null;
</script>

{#if value?.relation?.contents}
  {#each value.relation.contents as item}
    {#if item}
      <AttributeViewRollup value={item} />
      {#if item.id !== lastId}
        ,&nbsp;
      {/if}
    {/if}
  {/each}
{/if}

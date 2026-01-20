<script lang="ts">
  import { type IAVCellValue } from "@/types/siyuan.types";
  import AttributeViewRollup from "./AttributeViewRollup.svelte";

  interface Props {
    value: IAVCellValue;
  }

  let { value }: Props = $props();
  const lastId = $derived(
    value.relation?.contents?.length
      ? value.relation.contents[value.relation.contents.length - 1]?.id
      : null
  );
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

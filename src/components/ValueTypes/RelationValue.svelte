<script lang="ts">
    import type { IAVCellValue } from "siyuan";
    import AttributeViewRollup from "@/components/AttributeViewRollup.svelte";

    export let value: IAVCellValue;
    const lastId = value.relation.contents[value.relation.contents.length - 1].id
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
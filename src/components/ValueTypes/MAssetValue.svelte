<script lang="ts">
  import { escapeAttr } from "@/libs/siyuan/protyle/util/escape";
  import { type IAVCellValue } from "@/types/siyuan.types";
  export let value: IAVCellValue;
</script>

{#if value.mAsset}
  {#each value.mAsset as item}
    {#if item.type === "image"}
      <img
        class="av__cellassetimg ariaLabel"
        aria-label={item.content}
        src={item.content}
        alt=""
      />
    {:else}
      <span
        class="b3-chip b3-chip--middle av__celltext--url ariaLabel"
        aria-label={escapeAttr(item.content)}
        data-name={escapeAttr(item.name)}
        data-url={escapeAttr(item.content)}
      >
        {item.name || item.content}
      </span>
    {/if}
  {/each}
{/if}

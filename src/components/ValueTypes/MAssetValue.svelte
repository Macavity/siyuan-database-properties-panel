<script lang="ts">
  import type { IAVCellValue } from "siyuan";
  import { escapeAttr } from "@/libs/siyuan-utils";
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

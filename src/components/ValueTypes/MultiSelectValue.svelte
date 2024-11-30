<script lang="ts">
  import type { IAVCellValue } from "siyuan";

  export let value: IAVCellValue;
  export let onClick: (event: MouseEvent) => void;
</script>

{#if value.mSelect && value.mSelect.length > 0}
  {#each value.mSelect as item}
    <button
      class="b3-chip b3-chip--middle"
      style="background-color:var(--b3-font-background{item.color});color:var(--b3-font-color{item.color})"
      on:click={onClick}
      on:keydown={(event) => {
        if (event.key === "Enter" || event.key === " ") onClick();
      }}
      type="button"
    >
      {item.content}
    </button>
  {/each}
{/if}

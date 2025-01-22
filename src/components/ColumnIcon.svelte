<script lang="ts">
  import { type AVKey } from "@/types/AttributeView";
  import CustomIcon from "./CustomIcon.svelte";
  import { getColIconByType } from "@/libs/siyuan/protyle/render/av/col";
  import { escapeAttr } from "@/libs/siyuan/protyle/util/escape";
  interface Props {
    key: AVKey;
  }

  let { key }: Props = $props();
</script>

<div
  class="block__logo ariaLabel fn__pointer"
  data-type="editCol"
  data-position="parentW"
  aria-label={escapeAttr(key.name)}
>
  {#if key.icon && key.icon !== ""}
    <CustomIcon
      unicode={key.icon}
      className={"block__logoicon"}
      needSpan={true}
    />
  {:else}
    <svg class="block__logoicon">
      <use xlink:href="#{getColIconByType(key.type)}"></use>
    </svg>
  {/if}
  <span>{key.name}</span>
</div>

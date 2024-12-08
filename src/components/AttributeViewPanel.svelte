<script lang="ts">
  import type { AttributeView } from "@/types/AttributeView";
  import AttributeViewValue from "@/components/AttributeViewValue.svelte";
  import { Logger } from "@/libs/logger";
  import { isEmpty } from "@/libs/is-empty";
  import ColumnIcon from "./ColumnIcon.svelte";
  import { escapeAttr } from "@/libs/siyuan/protyle/util/escape";
  import { IProtyle, blockAttrOpenEdit } from "siyuan";

  export let protyle: IProtyle;
  export let avData: AttributeView[];
  export let blockId: string;

  // Configuration
  export let showPrimaryKey: boolean = false;
  export let showEmptyAttributes: boolean = false;
  export let enableDragAndDrop: boolean = false;
  export let allowEditing: boolean = false;

  let element: HTMLDivElement | null = null;
  let isHovered = false;

  // @see siyuan/app/src/protyle/render/av/blockAttr.ts -> renderAVAttribute

  $: getKeyValues = (keyValues: AttributeView["keyValues"]) => {
    console.log("blub");
    let entries = [...keyValues];
    const hidePrimaryKey = !showPrimaryKey;
    const hideEmptyAttributes = !showEmptyAttributes;

    if (hidePrimaryKey) {
      Logger.debug("hide primary key");
      entries = entries.filter((item) => item.key.type !== "block");
    }

    if (hideEmptyAttributes) {
      Logger.debug("hide empty attributes");
      entries = entries.filter((item) => !isEmpty(item.values[0]));
    }

    Logger.debug("filtered attributes", entries);

    return entries;
  };

  $: triggerEditMode = (event: MouseEvent) => {
    console.log(allowEditing);
    if (!allowEditing) return;
    blockAttrOpenEdit(protyle, element, event);
  };

  function handleMouseEnter() {
    if (!allowEditing) return;
    console.log("enter");
    isHovered = true;
  }

  function handleMouseLeave() {
    if (!allowEditing) return;
    console.log("leave");
    isHovered = false;
  }
</script>

<div class="custom-attr">
  {#each avData as table}
    <div
      data-av-id={table.avID}
      data-node-id={blockId}
      data-type="NodeAttributeView"
    >
      {#each getKeyValues(table.keyValues) as item}
        <div
          class="block__icons av__row"
          data-id={blockId}
          data-col-id={item.key.id}
        >
          {#if enableDragAndDrop}
            <div class="block__icon" draggable="true">
              <svg><use xlink:href="#iconDrag"></use></svg>
            </div>
          {:else}
            <ColumnIcon key={item.key} />
          {/if}
          <!-- svelte-ignore a11y-no-static-element-interactions -->
          <div
            bind:this={element}
            data-av-id={table.avID}
            data-col-id={item.values[0].keyID}
            data-block-id={item.values[0].blockID}
            data-id={item.values[0].id}
            data-type={item.values[0].type}
            data-options={item.key?.options
              ? escapeAttr(JSON.stringify(item.key.options))
              : []}
            class="fn__flex-1 fn__flex {isHovered ? 'protyle-wysiwyg--hl' : ''}"
            class:custom-attr__avvalue={![
              "url",
              "text",
              "number",
              "email",
              "phone",
              "block",
            ].includes(item.values[0].type)}
            on:click={triggerEditMode}
            on:mouseenter={handleMouseEnter}
            on:mouseleave={handleMouseLeave}
            role="none"
          >
            <AttributeViewValue value={item.values[0]} />
          </div>
        </div>
      {/each}
    </div>
    <div class="fn__hr"></div>
  {/each}
</div>

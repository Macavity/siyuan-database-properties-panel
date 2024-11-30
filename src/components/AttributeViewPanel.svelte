<script lang="ts">
  import type { AttributeView } from "@/types/AttributeView";
  import AttributeViewValue from "@/components/AttributeViewValue.svelte";
  import { Logger } from "@/libs/logger";
  import { isEmpty } from "@/libs/is-empty";
  import ColumnIcon from "./ColumnIcon.svelte";
  import { getColIconByType } from "siyuan/app/src/protyle/render/av/col";
  import { escapeAttr } from "@siyuan/app/util/escape";

  export let avData: AttributeView[];
  export let showPrimaryKey: boolean = false;
  export let showEmptyAttributes: boolean = false;
  export let enableDragAndDrop: boolean = false;

  $: getKeyValues = (keyValues: AttributeView["keyValues"]) => {
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
</script>

<div class="custom-attr">
  {#each avData as table}
    {#each getKeyValues(table.keyValues) as item}
      <div class="block__icons av__row" data-col-id={item.key.id}>
        {#if enableDragAndDrop}
          <div class="block__icon" draggable="true">
            <svg><use xlink:href="#iconDrag"></use></svg>
          </div>
        {/if}
        <ColumnIcon key={item.key} />
        <div
          data-av-id={table.avID}
          data-col-id={item.values[0].keyID}
          data-block-id={item.values[0].blockID}
          data-id={item.values[0].id}
          class="fn__flex-1 fn__flex"
          class:custom-attr__avvalue={![
            "url",
            "text",
            "number",
            "email",
            "phone",
            "block",
          ].includes(item.values[0].type)}
        >
          <AttributeViewValue value={item.values[0]} />
        </div>
      </div>
    {/each}
    <div class="fn__hr"></div>
  {/each}
</div>

<script lang="ts">
  import type { AttributeView } from "@/types/AttributeView";
  import { escapeAttr, getColIconByType } from "@/libs/siyuan-utils";
  import AttributeViewValue from "@/components/AttributeViewValue.svelte";
  import { Logger } from "@/libs/logger";

  export let avData: AttributeView[];
  export let showPrimaryKey: boolean = false;

  $: getKeyValues = (keyValues: AttributeView["keyValues"]) => {
    if (showPrimaryKey) {
      Logger.log("showPrimaryKey");
      return keyValues;
    }

    Logger.log("hidePrimaryKey");
    return keyValues.slice(1);
  };
</script>

<div class="custom-attr">
  {#each avData as table}
    {#each getKeyValues(table.keyValues) as item}
      <div class="block__icons av__row" data-col-id={item.key.id}>
        <!--<div class="block__icon" draggable="true">
                    <svg><use xlink:href="#iconDrag"></use></svg>
                </div>-->
        <div
          class="block__logo ariaLabel fn__pointer"
          data-type="editCol"
          data-position="parentW"
          aria-label={escapeAttr(item.key.name)}
        >
          <svg class="block__logoicon">
            <use xlink:href="#{getColIconByType(item.key.type)}"></use></svg
          >
          <span>{item.key.name}</span>
        </div>
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

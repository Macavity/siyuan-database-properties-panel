<script lang="ts">
  import { Logger } from "@/libs/logger";
  import { getContext } from "svelte";
  import { Context } from "@/types/context";
  import { onMount } from "svelte";
  import { type AttributeView } from "@/types/AttributeView";
  import { getEmptyAVKeyAndValues } from "@/libs/getAVKeyAndValues";

  export let avData: AttributeView[];
  export let showPrimaryKey: boolean = false;
  export let showEmptyAttributes: boolean = false;

  let element: HTMLDivElement | null = null;

  // State
  const blockId = getContext(Context.BlockID);
  const protyle = getContext(Context.Protyle);

  // @see siyuan/app/src/protyle/render/av/blockAttr.ts -> renderAVAttribute

  onMount(() => {
    // Logger.info("AttributeViewPanelNative mounted", blockId);
    protyle.renderAVAttribute(element, blockId, (element) => {
      Logger.info("AttributeViewPanelNative rendered");
      if (!showPrimaryKey) {
        // Logger.debug("hide primary key");
        const primaryKeyValueField = element.querySelectorAll(
          `[data-node-id='${blockId}'] [data-type='block']`
        );
        // Logger.debug("identify primary key", primaryKeyValueField);
        primaryKeyValueField.forEach((field) => {
          const fieldElement = field as HTMLElement;
          const colId = fieldElement.dataset?.colId;
          const row = field.closest(`[data-col-id='${colId}'].av__row`);
          row?.classList.add("dpp-av-panel--hidden");
        });
      }

      if (!showEmptyAttributes) {
        Logger.debug("hide empty attributes");
        avData.forEach((table) => {
          const emptyKeyAndValues = getEmptyAVKeyAndValues(table.keyValues);
          emptyKeyAndValues.forEach((item) => {
            element
              .querySelectorAll(`[data-id='${blockId}'][data-col-id='${item.values[0].keyID}']`)
              .forEach((field) => {
                field.classList.add("dpp-av-col--empty");
              });
          });
        });
      }
      // // Hide "add" buttons
      element.querySelectorAll("[data-type='addColumn']").forEach((button) => {
        Logger.debug("hide add column button", button);
        button.classList.add("dpp-av-panel--hidden");

        // Remove the two following dividers
        const firstDivider = button.nextElementSibling;
        const secondDivider = firstDivider?.nextElementSibling;
        console.log(firstDivider, secondDivider);

        if (firstDivider?.classList.contains("fn__hr--b")) {
          firstDivider.classList.add("dpp-av-panel--hidden");
        }
        if (secondDivider?.classList.contains("fn__hr--b")) {
          secondDivider.classList.add("dpp-av-panel--hidden");
        }
      });
      // // element.querySelectorAll(".fn__hr").forEach((item) => {
      // //   item.classList.add("dpp-av-panel--hidden");
      // // });
    });
  });
</script>

<div class="dpp-av-panel custom-attr" bind:this={element}></div>

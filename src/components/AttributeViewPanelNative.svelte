<script lang="ts">
  import { Logger } from "@/libs/logger";
  import { getContext } from "svelte";
  import { Context } from "@/types/context";
  import { renderAVAttribute } from "siyuan";
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
    Logger.info("AttributeViewPanelNative mounted", blockId);
    renderAVAttribute(element, blockId, protyle, () => {
      Logger.info("AttributeViewPanelNative rendered");

      if (!showPrimaryKey) {
        Logger.debug("hide primary key");

        const primaryKeyValueField = element.querySelectorAll(
          `[data-node-id='${blockId}'] [data-type='block']`
        );
        primaryKeyValueField.forEach((field) => {
          const row = field.closest(`[data-id='${blockId}'].av__row`);
          row?.classList.add("dpp-av-panel--hidden");
        });
      }

      // Left-align the table header
      // element
      //   .querySelectorAll(".custom-attr__avheader .fn__flex-1")
      //   .forEach((flex) => {
      //     flex.classList.remove("fn__flex-1");
      //   });

      if (!showEmptyAttributes) {
        Logger.debug("hide empty attributes");

        avData.forEach((table) => {
          const emptyKeyAndValues = getEmptyAVKeyAndValues(table.keyValues);

          emptyKeyAndValues.forEach((item) => {
            element
              .querySelectorAll(
                `[data-id='${blockId}'][data-col-id='${item.values[0].keyID}']`
              )
              .forEach((field) => {
                field.classList.add("dpp-av-col--empty");
              });
          });
        });
      }

      // Hide "add" buttons
      element.querySelectorAll("[data-type='addColumn']").forEach((button) => {
        button.closest(".fn__flex")?.classList.add("dpp-av-panel--hidden");
      });
      element.querySelectorAll(".fn__hr").forEach((item) => {
        item.classList.add("dpp-av-panel--hidden");
      });
    });
  });
</script>

<div class="dpp-av-panel custom-attr" bind:this={element}></div>

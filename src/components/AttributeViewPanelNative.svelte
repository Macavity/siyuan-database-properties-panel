<script lang="ts">
  import { LoggerService } from "@/services/LoggerService";
  import { getContext } from "svelte";
  import { Context } from "@/types/context";
  import { onMount } from "svelte";
  import { type AttributeView } from "@/types/AttributeView";
  import LayoutTabBar from "@/components/ui/LayoutTabBar.svelte";
  import { settingsStore } from "@/stores/localSettingStore";
  import { AttributeViewService } from "@/services/AttributeViewService";
  import { configStore } from "@/stores/configStore";
  import { documentSettingsStore } from "@/stores/documentSettingsStore";

  interface Props {
    avData: AttributeView[];
  }

  let { avData }: Props = $props();

  let element: HTMLDivElement | null = $state(null);

  // State
  const blockId = getContext(Context.BlockID);
  const protyle = getContext(Context.Protyle);
  const logger = new LoggerService("AttributeViewPanelNative");

  const tabs = [];

  avData.forEach((attributeView) => {
    tabs.push({
      key: attributeView.avID,
      name: attributeView.avName,
      icon: "iconDatabase",
    });
  });

  // Get settings from stores
  const globalShowEmptyAttributes = $derived($configStore.showEmptyAttributes);
  const globalShowPrimaryKey = $derived($configStore.showPrimaryKey);
  const effectiveShowEmptyAttributesStore = $derived(
    documentSettingsStore.getEffectiveShowEmptyAttributes(
      blockId,
      globalShowEmptyAttributes
    )
  );
  const effectiveShowEmptyAttributes = $derived(
    $effectiveShowEmptyAttributesStore
  );

  // Effect to handle store changes
  $effect(() => {
    if (element) {
      //   logger.debug("Adjusting DOM due to store changes", {
      //     globalShowPrimaryKey,
      //     effectiveShowEmptyAttributes,
      //   });

      AttributeViewService.adjustDOM(
        element,
        blockId,
        avData,
        globalShowPrimaryKey,
        effectiveShowEmptyAttributes
      );
    }
  });

  onMount(() => {
    logger.addBreadcrumb(blockId, "onMount");
    renderProtyleAv();
  });

  const showContent = (tabFocus: string) => {
    if (!tabFocus) {
      return;
    }

    activateTab(tabFocus);
  };

  const activateTab = (tabFocus: string) => {
    logger.addBreadcrumb(blockId, "activateTab: " + LoggerService.getReadableName(tabFocus));
    const targetTab = element.querySelectorAll(
      `[data-type="NodeAttributeView"][data-av-id="${tabFocus}"]`
    );
    const remainingTabs = element.querySelectorAll(
      `[data-type="NodeAttributeView"]:not([data-av-id="${tabFocus}"])`
    );
    if (!targetTab.length) {
      logger.info("showContent: No target tab found");
      return;
    }
    settingsStore.activateTab(blockId, tabFocus);

    targetTab.forEach((item: HTMLElement) => {
      item.classList.remove("dpp-av-panel--hidden");
    });
    remainingTabs.forEach((item: HTMLElement) => {
      item.classList.add("dpp-av-panel--hidden");
    });
  };

  const renderProtyleAv = () => {
    protyle.renderAVAttribute(element, blockId, (element) => {
      AttributeViewService.adjustDOM(
        element,
        blockId,
        avData,
        globalShowPrimaryKey,
        effectiveShowEmptyAttributes
      );

      if (!settingsStore.isAnyTabActive(blockId)) {
        const first = element.querySelector(`[data-type="NodeAttributeView"]`);
        activateTab(first.getAttribute("data-av-id"));
      } else {
        activateTab(settingsStore.getActiveTab(blockId));
      }
    });
  };

  let currentSettings = $derived($settingsStore.get(blockId));
</script>

<div>
  {#if tabs.length > 1}
    <LayoutTabBar
            {tabs}
            focus={currentSettings.lastSelectedAttributeView}
            onclick={showContent}
    />
  {/if}
  <div class="dpp-av-panel custom-attr" bind:this={element}></div>
</div>

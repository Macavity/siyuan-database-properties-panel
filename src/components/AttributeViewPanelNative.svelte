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

  const tabs = $derived(
    avData.map((attributeView) => ({
      key: attributeView.avID,
      name: attributeView.avName,
      icon: "iconDatabase",
    }))
  );

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

      // AttributeViewService.adjustDOM(
      //   element,
      //   blockId,
      //   avData,
      //   globalShowPrimaryKey,
      //   effectiveShowEmptyAttributes
      // );
    }
  });

  // Track if initial render is complete
  let isInitialized = false;

  onMount(() => {
    logger.addBreadcrumb(blockId, "onMount");
    renderProtyleAv();
    // Mark as initialized after a tick to avoid immediate re-render
    setTimeout(() => {
      isInitialized = true;
    }, 100);
  });

  // Re-render native panel when avData changes (after transaction updates)
  // Stringify avData to detect deep changes
  const avDataHash = $derived(JSON.stringify(avData));

  $effect(() => {
    // Access derived value to create dependency
    const _hash = avDataHash;

    // Only re-render after initial mount is complete
    if (isInitialized && element) {
      logger.debug("avData changed, re-rendering native panel");
      // Small delay to ensure DOM is ready
      setTimeout(() => {
        renderProtyleAv();
      }, 50);
    }
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
    // Close any open popups before re-rendering to avoid state corruption
    const avPanel = document.querySelector(".av__panel");
    const b3Menu = document.querySelector(".b3-menu:not(.fn__none)");
    if (avPanel) avPanel.remove();
    if (b3Menu) b3Menu.remove();
    protyle.renderAVAttribute(element, blockId, (element) => {
      console.log('post renderAVAttribute callback', {element, blockId});
      // AttributeViewService.adjustDOM(
      //   element,
      //   blockId,
      //   avData,
      //   globalShowPrimaryKey,
      //   effectiveShowEmptyAttributes
      // );

      AttributeViewService.removeAvRowClasses(element);

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
  <div class="dpp-av-panel custom-attr dpp-av-panel--native" bind:this={element}></div>
</div>

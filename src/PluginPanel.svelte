<script lang="ts">
  import { setContext, untrack, onMount, onDestroy } from "svelte";
  import AttributeViewPanel from "./components/AttributeViewPanel.svelte";
  import { type I18N } from "@/types/i18n";
  import { Context } from "./types/context";
  import AttributeViewPanelNative from "./components/AttributeViewPanelNative.svelte";
  import type { Protyle } from "siyuan";
  import ProtyleBreadcrumb from "@/components/ProtyleBreadcrumb.svelte";
  import { type AttributeView } from "@/types/AttributeView";
  import Icon from "@/components/ui/Icon.svelte";
  import { settingsStore } from "@/stores/localSettingStore";
  import { configStore } from "@/stores/configStore";
  import { Logger } from "@/services/LoggerService";
  import { getAttributeViewKeys } from "@/api";

  interface Props {
    i18n: I18N;
    allowEditing?: boolean;
    avData?: AttributeView[];
    protyle: Protyle;
    blockId: string;
  }

  let {
    i18n,
    allowEditing = false,
    avData: initialAvData = [],
    protyle,
    blockId,
  }: Props = $props();

  // Make avData mutable so we can refresh it
  // Use untrack to capture the initial value without subscribing to changes
  let avData = $state<AttributeView[]>([]);
  untrack(() => {
    avData = initialAvData;
  });

  // Debounce timer for data refresh
  let refreshTimer: ReturnType<typeof setTimeout> | null = null;

  /**
   * Refresh avData by re-fetching from the API.
   * Debounced to avoid excessive API calls when multiple mutations occur.
   */
  function refreshAvData() {
    // Clear existing timer
    if (refreshTimer) {
      clearTimeout(refreshTimer);
    }

    // Debounce: wait 100ms after last change before refreshing
    refreshTimer = setTimeout(async () => {
      Logger.debug("Refreshing avData for blockId:", blockId);
      try {
        const newData = await getAttributeViewKeys(blockId);
        if (newData) {
          avData = newData;
        }
      } catch (error) {
        Logger.error("Failed to refresh avData", error);
      }
    }, 100);
  }
  setContext(Context.RefreshCallback, refreshAvData);

  // Use untrack to explicitly capture initial values for context (these don't change after mount)
  untrack(() => {
    setContext(Context.I18N, i18n);
    setContext(Context.Protyle, protyle);
    setContext(Context.BlockID, blockId);
  });

  const openAvPanel = (avId: string) => {
    settingsStore.activateTab(blockId, avId);
  };

  /**
   * Handle custom event from plugin when AV data changes via transaction
   */
  const handleAvDataChanged = (event: CustomEvent<{ rowID: string; avID: string; keyID: string }>) => {
    // Only refresh if this event is for our block
    if (event.detail.rowID === blockId) {
      Logger.debug("Received dpp-av-data-changed for our blockId, refreshing");
      refreshAvData();
    }
  };

  onMount(() => {
    // Listen for AV data change events from the plugin
    window.addEventListener("dpp-av-data-changed", handleAvDataChanged as (event: Event) => void);
  });

  onDestroy(() => {
    // Clean up event listener
    window.removeEventListener("dpp-av-data-changed", handleAvDataChanged as (event: Event) => void);
    // Clear any pending refresh timer
    if (refreshTimer) {
      clearTimeout(refreshTimer);
    }
  });

  let isCollapsed = $derived($settingsStore.get(blockId).isCollapsed);
  const showBottomSeparator = $derived($configStore.showBottomSeparator);

  // function onError(error: Error) {
  //     Sentry.withScope(scope => {
  //         scope.setTag('errorSource', PLUGIN_NAME);
  //         Sentry.captureException(error);
  //     });
  // }
</script>

<div class="plugin-panel">
  <ProtyleBreadcrumb singleTab={avData.length === 1}>
    {#each avData as av, i}
      <span
        class="protyle-breadcrumb__item"
        role="button"
        tabindex={i}
        onclick={() => {
          openAvPanel(av.avID);
        }}
        onkeydown={() => {
          openAvPanel(av.avID);
        }}
      >
        <Icon icon="iconDatabase" />
        <span class="protyle-breadcrumb__text">{av.avName}</span>
      </span>
    {/each}
  </ProtyleBreadcrumb>
  {#if !isCollapsed}
    {#if allowEditing}
      <AttributeViewPanelNative {avData} onrefresh={refreshAvData} />
    {:else}
      <AttributeViewPanel {avData} />
    {/if}
    {#if showBottomSeparator}
      <div class="dpp-separator"></div>
    {/if}
  {/if}
</div>

<style>
  .dpp-separator {
    height: 0.0625em;
    background-color: var(--b3-theme-background-light);
    width: calc(100% - 1px);
    left: 0;
    top: 0.8125em;
  }
</style>
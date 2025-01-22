<script lang="ts">
  import { setContext } from "svelte";
  import AttributeViewPanel from "./components/AttributeViewPanel.svelte";
  import { type I18N } from "@/types/i18n";
  import { Context } from "./types/context";
  import AttributeViewPanelNative from "./components/AttributeViewPanelNative.svelte";
  import { Protyle } from "siyuan";
  import ProtyleBreadcrumb from "@/components/ProtyleBreadcrumb.svelte";
  import { type AttributeView } from "@/types/AttributeView";
  import Icon from "@/components/ui/Icon.svelte";
  import { settingsStore } from "@/stores/localSettingStore";

  interface Props {
    i18n: I18N;
    showPrimaryKey?: boolean;
    allowEditing?: boolean;
    showEmptyAttributes?: boolean;
    avData?: AttributeView[];
    protyle: Protyle;
    blockId: string;
  }

  let {
    i18n,
    showPrimaryKey = false,
    allowEditing = false,
    showEmptyAttributes = false,
    avData = [],
    protyle,
    blockId,
  }: Props = $props();

  setContext(Context.I18N, i18n);
  setContext(Context.Protyle, protyle);
  setContext(Context.BlockID, blockId);
  setContext(Context.ShowEmptyAttributes, showEmptyAttributes);

  const openAvPanel = (avId: string) => {
    settingsStore.activateTab(blockId, avId);
  };

  let isCollapsed = $derived($settingsStore.get(blockId).isCollapsed);

  let documentSettings = $derived($settingsStore.get(blockId));
  let effectiveShowEmptyAttributes = $derived(
    documentSettings.overrideShowEmptyAttributes === null
      ? showEmptyAttributes
      : documentSettings.overrideShowEmptyAttributes
  );

  // function onError(error: Error) {
  //     Sentry.withScope(scope => {
  //         scope.setTag('errorSource', PLUGIN_NAME);
  //         Sentry.captureException(error);
  //     });
  // }
</script>

<div class="plugin-panel">
  <ProtyleBreadcrumb>
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
      <AttributeViewPanelNative
        {avData}
        {showPrimaryKey}
        showEmptyAttributes={effectiveShowEmptyAttributes}
      />
    {:else}
      <AttributeViewPanel
        {avData}
        {showPrimaryKey}
        showEmptyAttributes={effectiveShowEmptyAttributes}
        {allowEditing}
      />
    {/if}
  {/if}
</div>

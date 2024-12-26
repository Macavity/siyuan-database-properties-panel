<script lang="ts">
  import { setContext } from "svelte";
  import AttributeViewPanel from "./components/AttributeViewPanel.svelte";
  import { type I18N } from "@/types/i18n";
  import { Context } from "./types/context";
  import AttributeViewPanelNative from "./components/AttributeViewPanelNative.svelte";
  import { Protyle } from "siyuan";

  export let i18n: I18N;
  export let showPrimaryKey: boolean = false;
  export let allowEditing: boolean = false;
  export let showEmptyAttributes: boolean = false;

  export let avData = [];
  export let protyle: Protyle;
  export let blockId: string;

  setContext(Context.I18N, i18n);
  setContext(Context.Protyle, protyle);
  setContext(Context.BlockID, blockId);
</script>

<div class="plugin-panel">
  {#if allowEditing}
    <AttributeViewPanelNative {avData} {showPrimaryKey} {showEmptyAttributes} />
  {:else}
    <AttributeViewPanel {avData} {showPrimaryKey} {showEmptyAttributes} {allowEditing} />
  {/if}
</div>

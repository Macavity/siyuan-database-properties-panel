<script lang="ts">
  import { setContext } from "svelte";
  import AttributeViewPanel from "./components/AttributeViewPanel.svelte";
  import { type I18N } from "@/types/i18n";
  import { IProtyle } from "siyuan";
  import { Context } from "./types/context";

  export let i18n: I18N;
  export let showPrimaryKey: boolean = false;
  export let allowEditing: boolean = false;
  export let showEmptyAttributes: boolean = false;

  export let avData = [];
  export let protyle: IProtyle;
  export let blockId: string;

  setContext(Context.I18N, i18n);
  setContext(Context.Protyle, protyle);
  setContext(Context.BlockID, blockId);
</script>

<div class="plugin-panel">
  <AttributeViewPanel
    {avData}
    {showPrimaryKey}
    {showEmptyAttributes}
    {allowEditing}
  />
</div>

<script lang="ts">
  import { setContext } from "svelte";
  import AttributeViewPanel from "./components/AttributeViewPanel.svelte";
  import { type I18N } from "@/types/i18n";
  import { IProtyle } from "siyuan";

  export let i18n: I18N;
  export let showPrimaryKey: boolean = false;
  export let showEmptyAttributes: boolean = false;

  export let avData = [];
  export let protyle: IProtyle;
  export let blockId: string;

  setContext("i18n", i18n);
</script>

<div class="plugin-panel">
  <AttributeViewPanel
    {protyle}
    {blockId}
    {avData}
    {showPrimaryKey}
    {showEmptyAttributes}
  />
</div>

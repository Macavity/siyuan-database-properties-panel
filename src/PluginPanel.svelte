<script lang="ts">
  import { setContext } from "svelte";
  import AttributeViewPanel from "./components/AttributeViewPanel.svelte";
  import { I18N } from "@/types/siyuan.types";

  export let i18n: I18N;
  export let showPrimaryKey: boolean = false;
  export let showEmptyAttributes: boolean = false;

  export let avData = [];

  setContext("i18n", i18n);
</script>

<div class="plugin-panel">
  <AttributeViewPanel {avData} {showPrimaryKey} {showEmptyAttributes} />
</div>

<script lang="ts">
    import { onMount, setContext } from "svelte";
    import { getAttributeViewKeys } from "@/api";
    import AttributeViewPanel from "./components/AttributeViewPanel.svelte";
    import type { I18N } from "siyuan";

    export let i18n: I18N;
    export let blockId = "";
    export let showDatabaseAttributes: boolean = false;
    export let showPrimaryKey: boolean = false;

    let avData = []

    setContext("i18n", i18n);

    onMount(async () => {
        if(showDatabaseAttributes){
            avData = await getAttributeViewKeys(blockId);
            console.log('getAttributeViewKeys', avData);
        }
    });
</script>

<div class="plugin-panel">
    <AttributeViewPanel {avData} {showPrimaryKey}/>
</div>


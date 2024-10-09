<script lang="ts">
    import { onMount } from "svelte";
    import { getAttributeViewKeys } from "@/api";
    import AttributeViewPanel from "./libs/components/attribute-view-panel.svelte";
    import { I18N } from "siyuan";

    export let i18n: I18N;
    export let blockId = "";
    //export let showBuiltInAttributes: boolean = false;
    export let showDatabaseAttributes: boolean = false;
    export let showPrimaryKey: boolean = false;

    let avData = []

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


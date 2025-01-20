<script lang="ts">
    import {setContext} from "svelte";
    import AttributeViewPanel from "./components/AttributeViewPanel.svelte";
    import {type I18N} from "@/types/i18n";
    import {Context} from "./types/context";
    import AttributeViewPanelNative from "./components/AttributeViewPanelNative.svelte";
    import {Protyle} from "siyuan";
    import ProtyleBreadcrumb from "@/components/ProtyleBreadcrumb.svelte";
    import {isDocumentCollapsed} from "@/stores/localSettingStore";
    import Button from "@/components/ui/Button.svelte";
    import {type AttributeView} from "@/types/AttributeView";
    import Icon from "@/components/ui/Icon.svelte";

    export let i18n: I18N;
    export let showPrimaryKey: boolean = false;
    export let allowEditing: boolean = false;
    export let showEmptyAttributes: boolean = false;

    export let avData: AttributeView[] = [];
    export let protyle: Protyle;
    export let blockId: string;
    const isCollapsed = isDocumentCollapsed(blockId);

    setContext(Context.I18N, i18n);
    setContext(Context.Protyle, protyle);
    setContext(Context.BlockID, blockId);
</script>

<div class="plugin-panel">
    <ProtyleBreadcrumb>
        {#each avData as av}
            <span class="protyle-breadcrumb__item" on:click={() => {  }}>
                <Icon icon="iconDatabase"/>
                <span class="protyle-breadcrumb__text">{av.avName}</span>
            </span>
        {/each}
    </ProtyleBreadcrumb>
    {#if !$isCollapsed}
        {#if allowEditing}
            <AttributeViewPanelNative {avData} {showPrimaryKey} {showEmptyAttributes}/>
        {:else}
            <AttributeViewPanel {avData} {showPrimaryKey} {showEmptyAttributes} {allowEditing}/>
        {/if}
    {/if}
</div>

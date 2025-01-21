<script lang="ts">
    import {setContext} from "svelte";
    import AttributeViewPanel from "./components/AttributeViewPanel.svelte";
    import {type I18N} from "@/types/i18n";
    import {Context} from "./types/context";
    import AttributeViewPanelNative from "./components/AttributeViewPanelNative.svelte";
    import {Protyle} from "siyuan";
    import ProtyleBreadcrumb from "@/components/ProtyleBreadcrumb.svelte";
    import {type AttributeView} from "@/types/AttributeView";
    import Icon from "@/components/ui/Icon.svelte";
    import {settingsStore} from "@/stores/localSettingStore";

    export let i18n: I18N;
    export let showPrimaryKey: boolean = false;
    export let allowEditing: boolean = false;
    export let showEmptyAttributes: boolean = false;

    export let avData: AttributeView[] = [];
    export let protyle: Protyle;
    export let blockId: string;

    setContext(Context.I18N, i18n);
    setContext(Context.Protyle, protyle);
    setContext(Context.BlockID, blockId);

    const openAvPanel = (avId: string) => {
        settingsStore.activateTab(avId);
    }
</script>

<div class="plugin-panel">
    <ProtyleBreadcrumb>
        {#each avData as av, i}
            <span class="protyle-breadcrumb__item"
                  role="button"
                  tabindex={i}
                  on:click={() => { openAvPanel(av.avID) }}
                  on:keydown={() => { openAvPanel(av.avID) }}>
                <Icon icon="iconDatabase"/>
                <span class="protyle-breadcrumb__text">{av.avName}</span>
            </span>
        {/each}
    </ProtyleBreadcrumb>
    {#if !$settingsStore.isCollapsed}
        {#if allowEditing}
            <AttributeViewPanelNative {avData} {showPrimaryKey} {showEmptyAttributes}/>
        {:else}
            <AttributeViewPanel {avData} {showPrimaryKey} {showEmptyAttributes} {allowEditing}/>
        {/if}
    {/if}
</div>

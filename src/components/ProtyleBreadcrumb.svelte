<script lang="ts">
    import {getContext} from "svelte";
    import {Context} from "@/types/context";
    import Button from "@/components/ui/Button.svelte";
    import {isCollapsed} from "@/stores/localSettingStore";
    import {Logger} from "@/libs/logger";

    const i18n = getContext(Context.I18N);

    const toggleCollapseTab = async () => {
        Logger.debug('toggleCollapseTab');
        isCollapsed.update(value => !value);
        //await settingsService.saveWidgetSettings();
        //updateFrameHeight();
    }
</script>

<div class="protyle-breadcrumb" id="top-navigation-bar">
    <div class="protyle-breadcrumb__bar protyle-breadcrumb__bar--nowrap">
        {#if $isCollapsed}
            <span class="b3-label b3-label__text">
                {i18n.databasePropertyPanel}
            </span>
        {/if}
    </div>

    <span class="protyle-breadcrumb__space"></span>

    <Button icon={$isCollapsed ? "#iconExpand" : "#iconContract"}
            on:click={toggleCollapseTab}
            tooltip={$isCollapsed ? i18n.expand : i18n.collapse}/>
    {#if false}
        <Button icon="#iconSettings"/>
    {/if}
</div>


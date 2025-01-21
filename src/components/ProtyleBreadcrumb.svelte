<script lang="ts">
    import {getContext} from "svelte";
    import {Context} from "@/types/context";
    import Button from "@/components/ui/Button.svelte";
    import {isCollapsed} from "@/stores/localSettingStore";
    import {LoggerService} from "@/libs/logger";

    const i18n = getContext(Context.I18N);
    const logger = new LoggerService('ProtyleBreadcrumb');

    const toggleCollapseTab = async () => {
        logger.debug('toggleCollapseTab');

        isCollapsed.update(value => !value);
    }
</script>

<div class="protyle-breadcrumb" id="top-navigation-bar">
    <div class="protyle-breadcrumb__bar protyle-breadcrumb__bar--nowrap">
        {#if $isCollapsed}
            <slot/>
        {/if}
    </div>

    <span class="protyle-breadcrumb__space"></span>

    <Button icon={$isCollapsed ? "iconExpand" : "iconContract"}
            on:click={toggleCollapseTab}
            tooltip={$isCollapsed ? i18n.expand : i18n.collapse}/>
    {#if false}
        <Button icon="iconSettings"/>
    {/if}
</div>


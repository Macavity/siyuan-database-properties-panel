<script lang="ts">
    import {getContext} from "svelte";
    import {Context} from "@/types/context";
    import Button from "@/components/ui/Button.svelte";
    import {settingsStore} from "@/stores/localSettingStore";
    import {LoggerService} from "@/services/LoggerService";

    const i18n = getContext(Context.I18N);
    const documentId = getContext(Context.BlockID);
    const logger = new LoggerService('ProtyleBreadcrumb');

    const toggleCollapseTab = async () => {
        logger.debug('toggleCollapseTab', { isCollapsed, documentId});

        settingsStore.toggleCollapsed(documentId);
    }
    $: isCollapsed = $settingsStore.get(documentId).isCollapsed;
</script>

<div class="protyle-breadcrumb" id="top-navigation-bar">
    <div class="protyle-breadcrumb__bar protyle-breadcrumb__bar--nowrap">
        {#if isCollapsed}
            <slot/>
        {/if}
    </div>

    <span class="protyle-breadcrumb__space"></span>

    <Button icon={isCollapsed ? "iconExpand" : "iconContract"}
            on:click={toggleCollapseTab}
            tooltip={isCollapsed ? i18n.expand : i18n.collapse}/>
</div>


<script lang="ts">
    import {getContext} from "svelte";
    import {Context} from "@/types/context";
    import Button from "@/components/ui/Button.svelte";
    import {documentSettingStore, isDocumentCollapsed} from "@/stores/localSettingStore";
    import { LoggerService} from "@/libs/logger";
    import {storageService} from "@/services/StorageService";
    import {createDefaultSettingsDTO} from "@/types/dto/SettingsDTO";

    const i18n = getContext(Context.I18N);
    const documentId = getContext(Context.BlockID);
    const logger = new LoggerService('ProtyleBreadcrumb');

    const isCollapsed = isDocumentCollapsed(documentId);

    const toggleCollapseTab = async () => {
        logger.debug('toggleCollapseTab');

        documentSettingStore.update((docs) => {
            let settings = docs.get(documentId) ?? createDefaultSettingsDTO(documentId);

            settings.isCollapsed = !settings.isCollapsed;
            docs.set(documentId, settings);
            storageService.saveSettings(documentId, settings);

            return docs;
        });
    }
</script>

<div class="protyle-breadcrumb" id="top-navigation-bar">
    <div class="protyle-breadcrumb__bar protyle-breadcrumb__bar--nowrap">
        {#if $isCollapsed}
            <span class="block__logo">
                {i18n.databasePropertyPanel}
            </span>
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


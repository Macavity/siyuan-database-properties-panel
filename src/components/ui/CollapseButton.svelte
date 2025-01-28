<script lang="ts">
    import Button from "@/components/ui/Button.svelte";
    import {settingsStore} from "@/stores/localSettingStore";
    import {getContext} from "svelte";
    import {Context} from "@/types/context";

    const i18n = getContext(Context.I18N);
    const documentId = getContext(Context.BlockID);
    let isCollapsed = $derived($settingsStore.get(documentId).isCollapsed);

    const toggleCollapseTab = async () => {
        settingsStore.toggleCollapsed(documentId);
    };
</script>

<Button icon={isCollapsed ? "iconExpand" : "iconContract"}
        onclick={toggleCollapseTab}
        tooltip={isCollapsed ? i18n.expand : i18n.collapse}
/>


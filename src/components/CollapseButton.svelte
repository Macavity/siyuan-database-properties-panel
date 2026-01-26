<script lang="ts">
    import ActionButton from "@/components/ui/ActionButton.svelte";
    import {settingsStore} from "@/stores/localSettingStore";
    import {getContext} from "svelte";
    import {Context} from "@/types/context";
    import {i18nStore} from "@/stores/i18nStore";

    interface Props {
        documentId?: string;
    }

    const {documentId: propDocumentId}: Props = $props();

    // Use prop if provided, otherwise fall back to context
    const contextDocumentId = getContext<string | undefined>(Context.BlockID);
    const documentId = $derived(propDocumentId || contextDocumentId);

    let isCollapsed = $derived($settingsStore.get(documentId).isCollapsed);
    let icon = $derived(isCollapsed ? "iconExpand" : "iconContract");
    let label = $derived(isCollapsed ? "" : $i18nStore.collapse);

    const toggleCollapseTab = () => {
        settingsStore.toggleCollapsed(documentId);
    };
</script>

<ActionButton
    class="dpp-collapse-button"
    {icon}
    {label}
    onclick={toggleCollapseTab}
/>

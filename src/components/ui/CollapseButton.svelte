<script lang="ts">
    import ActionButton from "@/components/ui/ActionButton.svelte";
    import {settingsStore} from "@/stores/localSettingStore";
    import {getContext} from "svelte";
    import {Context} from "@/types/context";

    interface Props {
        documentId?: string;
    }

    const {documentId: propDocumentId}: Props = $props();

    // Use prop if provided, otherwise fall back to context
    const contextDocumentId = getContext<string | undefined>(Context.BlockID);
    const documentId = $derived(propDocumentId || contextDocumentId);

    let isCollapsed = $derived($settingsStore.get(documentId).isCollapsed);

    const toggleCollapseTab = () => {
        settingsStore.toggleCollapsed(documentId);
    };
</script>

<ActionButton
    icon={isCollapsed ? "iconExpand" : "iconContract"}
    onclick={toggleCollapseTab}
    class="dpp-collapse-button"
/>


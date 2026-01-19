<script lang="ts">
    import {getContext} from "svelte";
    import {Context} from "@/types/context";
    import {settingsStore} from "@/stores/localSettingStore";
    import CollapseButton from "@/components/ui/CollapseButton.svelte";

    interface Props {
        children?: import("svelte").Snippet;
        singleTab: boolean;
    }

    let {children, singleTab}: Props = $props();

    const documentId = getContext(Context.BlockID);

    let isCollapsed = $derived($settingsStore.get(documentId).isCollapsed);

</script>

{#if isCollapsed || singleTab}
    <div class="protyle-breadcrumb"
         class:protyle-breadcrumb--single-tab={singleTab}
         id="top-navigation-bar">
        <CollapseButton/>
        {#if isCollapsed}
            <div class="protyle-breadcrumb__bar protyle-breadcrumb__bar--nowrap">
                {@render children?.()}
            </div>
        {/if}
    </div>
{/if}

<style lang="scss">
  .protyle-breadcrumb {
    margin-left: 0;
    padding: 4px 0;
  }
  .protyle-breadcrumb.protyle-breadcrumb--single-tab:first-child {
      margin-left: 0;
  }
</style>
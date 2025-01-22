<script lang="ts">
  import { getContext } from "svelte";
  import { Context } from "@/types/context";
  import Button from "@/components/ui/Button.svelte";
  import { settingsStore } from "@/stores/localSettingStore";
  import { LoggerService } from "@/services/LoggerService";
  interface Props {
    children?: import("svelte").Snippet;
  }

  let { children }: Props = $props();

  const i18n = getContext(Context.I18N);
  const documentId = getContext(Context.BlockID);
  const showEmptyAttributes = getContext(Context.ShowEmptyAttributes);
  const logger = new LoggerService("ProtyleBreadcrumb");
  let overrideShowEmptyAttributes = $derived(
    $settingsStore.get(documentId).overrideShowEmptyAttributes
  );
  let isCollapsed = $derived($settingsStore.get(documentId).isCollapsed);
  logger.debug("overrideShowEmptyAttributes", {
    documentId,
    showEmptyAttributes,
    overrideShowEmptyAttributes,
  });

  // Compute the effective show empty attributes value
  let effectiveShowEmptyAttributes = $derived(
    overrideShowEmptyAttributes === null
      ? showEmptyAttributes
      : overrideShowEmptyAttributes
  );

  const toggleCollapseTab = async () => {
    logger.debug("toggleCollapseTab", { isCollapsed, documentId });

    settingsStore.toggleCollapsed(documentId);
  };

  const toggleOverrideShowEmptyAttributes = async () => {
    logger.debug("toggleShowEmptyAttributes", {
      documentId,
      overrideShowEmptyAttributes,
    });
    settingsStore.toggleShowEmptyAttributes(documentId, showEmptyAttributes);
  };
</script>

<div class="protyle-breadcrumb" id="top-navigation-bar">
  <div class="protyle-breadcrumb__bar protyle-breadcrumb__bar--nowrap">
    {#if isCollapsed}
      {@render children?.()}
    {/if}
  </div>

  <span class="protyle-breadcrumb__space"></span>

  <Button
    icon={isCollapsed ? "iconExpand" : "iconContract"}
    onclick={toggleCollapseTab}
    tooltip={isCollapsed ? i18n.expand : i18n.collapse}
  />
  {#if !isCollapsed}
    <Button
      icon="iconSettings"
      onclick={}
      tooltip={i18n.overrideSettings}
    />
  {/if}
</div>

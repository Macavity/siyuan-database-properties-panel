<script lang="ts">
  import Icon from "@/components/ui/Icon.svelte";
  import { i18nStore } from "@/stores/i18nStore";
  import { configStore } from "@/stores/configStore";
  import { documentSettingsStore } from "@/stores/documentSettingsStore";

  interface Props {
    documentId: string;
  }

  const { documentId }: Props = $props();
  const i18n = $derived($i18nStore);

  // Global setting from plugin config
  const globalShowEmptyAttributes = $derived($configStore.showEmptyAttributes);

  // Per-document override
  const effectiveShowEmptyAttributesStore = $derived(
    documentSettingsStore.getEffectiveShowEmptyAttributes(
      documentId,
      globalShowEmptyAttributes
    )
  );
  const effectiveShowEmptyAttributes = $derived(
    $effectiveShowEmptyAttributesStore
  );

  function toggleShowEmptyAttributes(event: MouseEvent) {
    documentSettingsStore.toggleShowEmptyAttributes(
      documentId,
      globalShowEmptyAttributes
    );
    (event.currentTarget as HTMLButtonElement).blur();
  }
</script>

<button
  class="b3-button b3-button--cancel dpp-empty-attributes-toggle"
  onclick={toggleShowEmptyAttributes}
>
  <Icon icon={effectiveShowEmptyAttributes ? "iconEyeoff" : "iconEye"} />
  {effectiveShowEmptyAttributes
    ? i18n.hideEmptyAttributesToggle
    : i18n.showEmptyAttributesToggle}
</button>

<style lang="css">
    .dpp-empty-attributes-toggle {
        margin-left: 5px;
    }
</style>

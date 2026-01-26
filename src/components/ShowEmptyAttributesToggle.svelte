<script lang="ts">
  import ActionButton from "@/components/ui/ActionButton.svelte";
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

<ActionButton
  icon={effectiveShowEmptyAttributes ? "iconEyeoff" : "iconEye"}
  label={effectiveShowEmptyAttributes
    ? i18n.hideEmptyAttributesToggle
    : i18n.showEmptyAttributesToggle}
  onclick={toggleShowEmptyAttributes}
  class="dpp-empty-attributes-toggle"
/>

<script lang="ts">
  import ActionButton from "@/components/ui/ActionButton.svelte";
  import { i18nStore } from "@/stores/i18nStore";

  interface Props {
    onRefresh?: () => void;
  }

  let { onRefresh }: Props = $props();
  const i18n = $derived($i18nStore);

  function handleRefresh(event: MouseEvent) {
    if (onRefresh) {
      onRefresh();
    }
    (event.currentTarget as HTMLButtonElement).blur();
  }
</script>

<ActionButton
  icon="iconRefresh"
  label={i18n.refresh}
  onclick={handleRefresh}
  class="dpp-refresh-button"
/>

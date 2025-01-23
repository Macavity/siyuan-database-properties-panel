<script lang="ts">

    import {getContext, onMount} from "svelte";
import {Context} from "@/types/context";
    import {LoggerService} from "@/services/LoggerService";
    import Icon from "@/components/ui/Icon.svelte";

const i18n = getContext(Context.I18N);
const configShowEmptyAttributes = getContext(Context.ShowEmptyAttributes);
const logger = new LoggerService("ShowEmptyAttributesToggle");
const showEmptyAttributes = $derived(configShowEmptyAttributes);


onMount(() => {
    logger.debug("ShowEmptyAttributesToggle mounted", { configShowEmptyAttributes});
});
</script>

{#if !configShowEmptyAttributes}
    <button class="b3-button b3-button--cancel">
        <Icon icon={showEmptyAttributes ? "iconEyeoff" : "iconEye"}/>
        {showEmptyAttributes ? i18n.hideEmptyAttributesToggle : i18n.showEmptyAttributesToggle}
    </button>
{/if}

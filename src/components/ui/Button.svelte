<script lang="ts">
    import {createEventDispatcher} from "svelte";
    import Icon from "@/components/ui/Icon.svelte";
    import type {SiYuanIcon} from "@/types/SiyuanIcon";

    interface Props {
        label?: string | null;
        icon?: SiYuanIcon | null;
        isFocused?: boolean;
        tooltip?: string | null;
    }

    let {
        label = null,
        icon = null,
        isFocused = false,
        tooltip = null
    }: Props = $props();

    const dispatch = createEventDispatcher();
</script>

<button
        class="block__icon block__icon--show"
        class:b3-tooltips__w={tooltip !== null}
        class:b3-tooltips={tooltip !== null}
        class:item--focus={isFocused}
        onclick={(event) => dispatch("click", { event })}
        onkeydown={(event) => dispatch("click", { event})}
        aria-label={tooltip}
>
    {#if icon}
        <Icon {icon}/>
    {/if}
    {#if label}
        <span class="item__text">{label}</span>
    {/if}
</button>
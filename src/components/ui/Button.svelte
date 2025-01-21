<script lang="ts">
    import {createEventDispatcher} from "svelte";
    import Icon from "@/components/ui/Icon.svelte";
    import type {SiYuanIcon} from "@/types/SiyuanIcon";

    export let label: string | null = null;
    export let icon: SiYuanIcon | null = null;
    export let isFocused: boolean = false;
    export let tooltip: string | null = null;

    const dispatch = createEventDispatcher();
</script>

<button
        class="block__icon block__icon--show"
        class:b3-tooltips__w={tooltip !== null}
        class:b3-tooltips={tooltip !== null}
        class:item--focus={isFocused}
        on:click={(event) => dispatch("click", { event })}
        on:keydown={(event) => dispatch("click", { event})}
        aria-label={tooltip}
>
    {#if icon}
        <Icon {icon}/>
    {/if}
    {#if label}
        <span class="item__text">{label}</span>
    {/if}
</button>
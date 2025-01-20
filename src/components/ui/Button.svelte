<script lang="ts">
    import {createEventDispatcher} from "svelte";

    export let label: string | null = null;
    export let icon: string | null = null;
    export let isFocused: boolean = false;
    export let tooltip: string | null = null;

    const dispatch = createEventDispatcher();
</script>

<button
        class="block__icon block__icon--show b3-tooltips__w b3-tooltips"
        class:item--focus={isFocused}
        on:click={(event) => dispatch("click", { event })}
        on:keydown={(event) => dispatch("click", { event})}
        aria-label={tooltip}
>
    {#if icon}
        <svg>
            <use xlink:href={icon}></use>
        </svg>
    {/if}
    {#if label}
        <span class="item__text">{label}</span>
    {/if}
</button>
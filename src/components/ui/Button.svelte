<script lang="ts">
    import Icon from "@/components/ui/Icon.svelte";
    import type {SiYuanIcon} from "@/types/SiyuanIcon";

    interface Props {
        label?: string | null;
        icon?: SiYuanIcon | null;
        isFocused?: boolean;
        tooltip?: string | null;
        class?: string | null;
        onclick?: (event: Event) => void;
    }

    let {
        label = null,
        icon = null,
        isFocused = false,
        tooltip = null,
        class: customClass = null,
        onclick= ()=>{},
    }: Props = $props();
</script>

<button
        class="block__icon block__icon--show {customClass ?? ''}"
        class:b3-tooltips__w={tooltip !== null}
        class:b3-tooltips={tooltip !== null}
        class:item--focus={isFocused}
        onclick={(event) => onclick(event)}
        onkeydown={(event) => onclick(event)}
        aria-label={tooltip}
>
    {#if icon}
        <Icon {icon}/>
    {/if}
    {#if label}
        <span class="item__text">{label}</span>
    {/if}
</button>
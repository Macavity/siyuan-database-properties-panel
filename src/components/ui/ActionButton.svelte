<script lang="ts">
    import Icon from "@/components/ui/Icon.svelte";
    import type {SiYuanIcon} from "@/types/SiyuanIcon";

    interface Props {
        label?: string | null;
        icon?: SiYuanIcon | null;
        class?: string | null;
        onclick?: (event: MouseEvent) => void;
    }

    let {
        label = null,
        icon = null,
        class: customClass = null,
        onclick = () => {},
    }: Props = $props();
</script>

<button
    class="b3-button b3-button--cancel {customClass ?? ''}"
    onclick={(event) => onclick(event)}
>
    {#if icon}
        <Icon {icon} />
    {/if}
    {#if label}
        {label}
    {/if}
</button>

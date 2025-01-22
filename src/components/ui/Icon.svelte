<script lang="ts">
    import {type SiYuanIcon} from "@/types/SiyuanIcon";
    interface Props {
        icon: SiYuanIcon;
        [key: string]: any
    }

    let { ...props }: Props = $props();

</script>

<svg {...props}>
    <use xlink:href={`#${props.icon}`}></use>
</svg>
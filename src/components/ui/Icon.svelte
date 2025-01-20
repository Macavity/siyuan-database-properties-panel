<script lang="ts">
    import {type SiYuanIcon} from "@/types/SiyuanIcon";
    export let icon: SiYuanIcon;

</script>

<svg {...$$props}>
    <use xlink:href={`#${icon}`}></use>
</svg>
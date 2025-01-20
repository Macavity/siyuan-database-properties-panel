<script lang="ts">
    import {type SiYuanIcon} from "@/types/SiyuanIcon";
    export let icon: SiYuanIcon;
</script>

<svg class="block__logoicon">
    <use xlink:href={`#${icon}`}></use>
</svg>
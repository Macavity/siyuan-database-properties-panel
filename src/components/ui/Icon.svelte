  <svelte:options namespace="svg" />

<script lang="ts">
  import { type SiYuanIcon } from "@/types/SiyuanIcon";
  interface Props {
    icon: SiYuanIcon;
    class?: string;
  }

  let { class: klass, icon }: Props = $props();
</script>

<svg class={klass}>
  <use xlink:href={`#${icon}`}></use>
</svg>

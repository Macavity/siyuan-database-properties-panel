<script lang="ts">
  interface Props {
    unicode: string;
    className?: string;
    needSpan?: boolean;
    lazy?: boolean;
  }

  let {
    unicode,
    className = "",
    needSpan = false,
    lazy = false,
  }: Props = $props();

  let emoji = $derived(() => {
    if (!unicode) {
      return "";
    }
    try {
      let result = "";
      unicode.split("-").forEach((item) => {
        if (item.length < 5) {
          result += String.fromCodePoint(parseInt("0" + item, 16));
        } else {
          result += String.fromCodePoint(parseInt(item, 16));
        }
      });
      return result;
    } catch (e) {
      return "";
    }
  });
</script>

{#if unicode.indexOf(".") > -1}
  <img
    class={className}
    src={lazy ? undefined : `/emojis/${unicode}`}
    alt="Emoji"
    data-src={lazy ? `/emojis/${unicode}` : undefined}
  />
{:else if needSpan}
  <span class={className}>{emoji()}</span>
{:else}
  {emoji()}
{/if}

<script lang="ts">
  export let unicode: string;
  export let className: string = "";
  export let needSpan: boolean = false;
  export let lazy: boolean = false;

  let emoji: string = "";

  /**
   * @see siyuan/app/src/emoji/index.ts
   */
  function unicode2Emoji() {
    if (!unicode) {
      emoji = "";
      return;
    }
    try {
      emoji = "";
      unicode.split("-").forEach((item) => {
        if (item.length < 5) {
          emoji += String.fromCodePoint(parseInt("0" + item, 16));
        } else {
          emoji += String.fromCodePoint(parseInt(item, 16));
        }
      });
    } catch (e) {
      // Ignore errors
    }
  }

  $: unicode2Emoji();
</script>

{#if unicode.indexOf(".") > -1}
  <img
    class={className}
    src={lazy ? undefined : `/emojis/${unicode}`}
    alt="Emoji"
    data-src={lazy ? `/emojis/${unicode}` : undefined}
  />
{:else if needSpan}
  <span class={className}>{emoji}</span>
{:else}
  {emoji}
{/if}

<script lang="ts">
  import dayjs from "dayjs";

  import MAssetValue from "./ValueTypes/MAssetValue.svelte";
  import DateValue from "./ValueTypes/DateValue.svelte";
  import RelationValue from "./ValueTypes/RelationValue.svelte";
  import MultiSelectValue from "./ValueTypes/MultiSelectValue.svelte";
  import AttributeViewRollup from "./ValueTypes/AttributeViewRollup.svelte";
  import TemplateValue from "./ValueTypes/TemplateValue.svelte";
  import { type IAVCellValue } from "@/types/siyuan.types";

  // Props
  export let value: IAVCellValue;
  // export let avKey: AVKey;
  // export let avID: string;
</script>

{#if value.type === "block"}
  <div class="fn__flex-1">{value.block.content}</div>
{:else if value.type === "text"}
  <textarea
    style="resize: vertical"
    rows={value.text.content.split("\n").length}
    class="b3-text-field b3-text-field--text fn__flex-1"
    >{value.text.content}
  </textarea>
{:else if value.type === "number"}
  <!--<input value={value.number.isNotEmpty ? value.number.content : ''}
           type="number"
           class="b3-text-field b3-text-field--text fn__flex-1">
    <span class="fn__space"></span>
    <span class="fn__flex-center ft__on-surface b3-tooltips__w b3-tooltips"
          aria-label={window.siyuan.languages.format}>
        {value.number.formattedContent}
    </span>
    <span class="fn__space"></span>-->
  <span class="fn__flex-1">{value.number.formattedContent}</span>
{:else if value.type === "select" || value.type === "mSelect"}
  <MultiSelectValue {value} />
{:else if value.type === "mAsset"}
  <MAssetValue {value} />
{:else if value.type === "date"}
  <DateValue {value} />
{:else if value.type === "created" || value.type === "updated"}
  <span data-content={value[value.type].content}
    >{dayjs(value[value.type].content).format("YYYY-MM-DD HH:mm")}</span
  >
{:else if value.type === "url"}
  <input
    value={value.url.content}
    class="b3-text-field b3-text-field--text fn__flex-1"
  />
  <span class="fn__space"></span>
  <a
    href={value.url.content}
    target="_blank"
    aria-label={window.siyuan.languages.openBy}
    class="block__icon block__icon--show fn__flex-center b3-tooltips__w b3-tooltips"
  >
    <svg>
      <use xlink:href="#iconLink"></use>
    </svg>
  </a>
{:else if value.type === "phone"}
  <input
    value={value.phone.content}
    class="b3-text-field b3-text-field--text fn__flex-1"
  />
  <span class="fn__space"></span>
  <a
    href="tel:{value.phone.content}"
    target="_blank"
    aria-label={window.siyuan.languages.openBy}
    class="block__icon block__icon--show fn__flex-center b3-tooltips__w b3-tooltips"
  >
    <svg>
      <use xlink:href="#iconPhone"></use>
    </svg>
  </a>
{:else if value.type === "checkbox"}
  <svg class="av__checkbox">
    {#if value.checkbox.checked}
      <use xlink:href="#iconCheck"></use>
    {:else}
      <use xlink:href="#iconUncheck"></use>
    {/if}
  </svg>
{:else if value.type === "template"}
  <TemplateValue {value} />
{:else if value.type === "email"}
  <input
    value={value.email.content}
    class="b3-text-field b3-text-field--text fn__flex-1"
  />
  <span class="fn__space"></span>
  <a
    href="mailto:{value.email.content}"
    target="_blank"
    aria-label={window.siyuan.languages.openBy}
    class="block__icon block__icon--show fn__flex-center b3-tooltips__w b3-tooltips"
  >
    <svg>
      <use xlink:href="#iconEmail"></use>
    </svg>
  </a>
{:else if value.type === "relation"}
  <RelationValue {value} />
{:else if value.type === "rollup"}
  {#each value.rollup.contents as item}
    {#if ["select", "mSelect", "mAsset", "checkbox", "relation"].includes(item.type)}
      <svelte:self value={item} />
    {:else}
      <AttributeViewRollup value={item} />
    {/if}
    {#if item.id !== value.rollup.contents[value.rollup.contents.length - 1].id}
      ,&nbsp;
    {/if}
  {/each}
{/if}

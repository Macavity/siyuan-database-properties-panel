<script lang="ts">
  import AttributeViewValue from './AttributeViewValue.svelte';
  import dayjs from "dayjs";

  import MAssetValue from "./ValueTypes/MAssetValue.svelte";
  import DateValue from "./ValueTypes/DateValue.svelte";
  import RelationValue from "./ValueTypes/RelationValue.svelte";
  import MultiSelectValue from "./ValueTypes/MultiSelectValue.svelte";
  import AttributeViewRollup from "./ValueTypes/AttributeViewRollup.svelte";
  import TemplateValue from "./ValueTypes/TemplateValue.svelte";
  import { type IAVCellValue } from "@/types/siyuan.types";
  import { setAttributeViewBlockAttr } from "@/api";

  interface Props {
    value: IAVCellValue;
    avID?: string;
    keyID?: string;
    rowID?: string;
    allowEditing?: boolean;
  }

  let { value, avID = "", keyID = "", rowID = "", allowEditing = false }: Props = $props();

  // Save handlers for direct-edit fields
  const saveText = async (newContent: string) => {
    if (!avID || !keyID || !rowID) return;
    await setAttributeViewBlockAttr(avID, keyID, rowID, {
      text: { content: newContent }
    });
  };

  const saveNumber = async (newContent: number | string) => {
    if (!avID || !keyID || !rowID) return;
    const numValue = typeof newContent === 'string' ? parseFloat(newContent) : newContent;
    const isNotEmpty = !isNaN(numValue) && newContent !== '';
    await setAttributeViewBlockAttr(avID, keyID, rowID, {
      number: { content: isNotEmpty ? numValue : 0, isNotEmpty }
    });
  };

  const saveUrl = async (newContent: string) => {
    if (!avID || !keyID || !rowID) return;
    await setAttributeViewBlockAttr(avID, keyID, rowID, {
      url: { content: newContent }
    });
  };

  const savePhone = async (newContent: string) => {
    if (!avID || !keyID || !rowID) return;
    await setAttributeViewBlockAttr(avID, keyID, rowID, {
      phone: { content: newContent }
    });
  };

  const saveEmail = async (newContent: string) => {
    if (!avID || !keyID || !rowID) return;
    await setAttributeViewBlockAttr(avID, keyID, rowID, {
      email: { content: newContent }
    });
  };

  const toggleCheckbox = async () => {
    if (!avID || !keyID || !rowID) return;
    const newChecked = !value.checkbox.checked;
    await setAttributeViewBlockAttr(avID, keyID, rowID, {
      checkbox: { checked: newChecked }
    });
    // Update local state for immediate feedback
    value.checkbox.checked = newChecked;
  };
</script>

{#if value.type === "block"}
  <div class="fn__flex-1">{value.block.content}</div>
{:else if value.type === "text"}
  <textarea
    style="resize: vertical"
    rows={value.text?.content ? value.text.content.split("\n").length : 1}
    class="b3-text-field b3-text-field--text fn__flex-1"
    disabled={!allowEditing}
    onblur={(e) => allowEditing && saveText(e.currentTarget.value)}
    >{value.text?.content || ''}</textarea>
{:else if value.type === "number"}
  <input
    value={value.number?.isNotEmpty ? value.number.content : ''}
    type="number"
    class="b3-text-field b3-text-field--text fn__flex-1"
    disabled={!allowEditing}
    onblur={(e) => allowEditing && saveNumber(e.currentTarget.value)}
  />
  {#if value.number?.formattedContent}
    <span class="fn__space"></span>
    <span class="fn__flex-center ft__on-surface b3-tooltips__w b3-tooltips"
          aria-label={window.siyuan.languages.format}>
        {value.number.formattedContent}
    </span>
    <span class="fn__space"></span>
  {/if}
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
    value={value.url?.content || ''}
    class="b3-text-field b3-text-field--text fn__flex-1"
    disabled={!allowEditing}
    onblur={(e) => allowEditing && saveUrl(e.currentTarget.value)}
  />
  <span class="fn__space"></span>
  <a
    href={value.url?.content || ''}
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
    value={value.phone?.content || ''}
    class="b3-text-field b3-text-field--text fn__flex-1"
    disabled={!allowEditing}
    onblur={(e) => allowEditing && savePhone(e.currentTarget.value)}
  />
  <span class="fn__space"></span>
  <a
    href="tel:{value.phone?.content || ''}"
    target="_blank"
    aria-label={window.siyuan.languages.openBy}
    class="block__icon block__icon--show fn__flex-center b3-tooltips__w b3-tooltips"
  >
    <svg>
      <use xlink:href="#iconPhone"></use>
    </svg>
  </a>
{:else if value.type === "checkbox"}
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
  <svg
    class="av__checkbox"
    class:fn__pointer={allowEditing}
    onclick={() => allowEditing && toggleCheckbox()}
    onkeydown={(e) => e.key === 'Enter' && allowEditing && toggleCheckbox()}
    tabindex={allowEditing ? 0 : -1}
    role={allowEditing ? "button" : "img"}
  >
    {#if value.checkbox?.checked}
      <use xlink:href="#iconCheck"></use>
    {:else}
      <use xlink:href="#iconUncheck"></use>
    {/if}
  </svg>
{:else if value.type === "template"}
  <TemplateValue {value} />
{:else if value.type === "email"}
  <input
    value={value.email?.content || ''}
    class="b3-text-field b3-text-field--text fn__flex-1"
    disabled={!allowEditing}
    onblur={(e) => allowEditing && saveEmail(e.currentTarget.value)}
  />
  <span class="fn__space"></span>
  <a
    href="mailto:{value.email?.content || ''}"
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
      <AttributeViewValue value={item} />
    {:else}
      <AttributeViewRollup value={item} />
    {/if}
    {#if item.id !== value.rollup.contents[value.rollup.contents.length - 1].id}
      ,&nbsp;
    {/if}
  {/each}
{/if}

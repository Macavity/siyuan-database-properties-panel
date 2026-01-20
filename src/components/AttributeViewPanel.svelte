<script lang="ts">
  import type { AttributeView } from "@/types/AttributeView";
  import AttributeViewValue from "@/components/AttributeViewValue.svelte";
  import { filterAVKeyAndValues } from "@/libs/getAVKeyAndValues";
  import ColumnIcon from "./ColumnIcon.svelte";
  import { getContext } from "svelte";
  import { Context } from "@/types/context";
  import { escapeAttr } from "@/libs/siyuan/protyle/util/escape";
  import LayoutTabBar from "@/components/ui/LayoutTabBar.svelte";
  import { settingsStore } from "@/stores/localSettingStore";
  import { configStore } from "@/stores/configStore";
  import { documentSettingsStore } from "@/stores/documentSettingsStore";
  import ShowEmptyAttributesToggle from "@/components/ShowEmptyAttributesToggle.svelte";
  import { openEdit } from "@/libs/siyuan/protyle/render/av/blockAttr";
  import type { Protyle } from "siyuan";

  interface Props {
    avData: AttributeView[];
    enableDragAndDrop?: boolean;
    allowEditing?: boolean;
  }

  let {
    avData,
    enableDragAndDrop = false,
    allowEditing = false
  }: Props = $props();

  let panelElement: HTMLDivElement | null = $state(null);

  // Context
  const blockId = getContext<string>(Context.BlockID);
  const protyle = getContext<Protyle>(Context.Protyle);

  // Build tabs from avData (reactive)
  const tabs = $derived(avData.map((av) => ({
    key: av.avID,
    name: av.avName,
    icon: "iconDatabase" as const,
  })));

  // Store-derived settings
  const globalShowEmptyAttributes = $derived($configStore.showEmptyAttributes);
  const globalShowPrimaryKey = $derived($configStore.showPrimaryKey);
  const effectiveShowEmptyAttributesStore = $derived(
    documentSettingsStore.getEffectiveShowEmptyAttributes(blockId, globalShowEmptyAttributes)
  );
  const effectiveShowEmptyAttributes = $derived($effectiveShowEmptyAttributesStore);

  // Tab state
  let currentSettings = $derived($settingsStore.get(blockId));
  const activeAvId = $derived(currentSettings.lastSelectedAttributeView || avData[0]?.avID);
  const activeTable = $derived(avData.find(t => t.avID === activeAvId) || avData[0]);

  // Filtered key values using store settings
  let filteredKeyValues = $derived((keyValues: AttributeView["keyValues"]) =>
    filterAVKeyAndValues(keyValues, globalShowPrimaryKey, effectiveShowEmptyAttributes));

  const showContent = (tabFocus: string) => {
    if (tabFocus) {
      settingsStore.activateTab(blockId, tabFocus);
    }
  };

  // Handle click for editing
  const handleValueClick = (event: MouseEvent) => {
    if (allowEditing && protyle && panelElement) {
      openEdit(protyle.protyle, panelElement, event);
    }
  };
</script>

{#if tabs.length > 1}
  <LayoutTabBar {tabs} focus={activeAvId} onclick={showContent} />
{/if}

<div class="dpp-av-panel custom-attr" bind:this={panelElement}>
  {#if activeTable}
    <div data-av-id={activeTable.avID} data-node-id={blockId} data-type="NodeAttributeView">
      {#each filteredKeyValues(activeTable.keyValues) as item}
        <div
          class="av-panel-row block__icons"
          class:av-panel-row--editable={allowEditing}
          data-id={blockId}
          data-col-id={item.key.id}
        >
          {#if enableDragAndDrop}
            <div class="block__icon" draggable="true">
              <svg><use xlink:href="#iconDrag"></use></svg>
            </div>
          {:else}
            <ColumnIcon key={item.key} />
          {/if}
          <div
            data-av-id={activeTable.avID}
            data-col-id={item.values[0].keyID}
            data-block-id={item.values[0].blockID}
            data-id={item.values[0].id}
            data-type={item.values[0].type}
            data-options={item.key?.options ? escapeAttr(JSON.stringify(item.key.options)) : []}
            class="fn__flex-1 fn__flex"
            class:custom-attr__avvalue={![
              "url",
              "text",
              "number",
              "email",
              "phone",
              "block",
            ].includes(item.values[0].type)}
            role="button"
            tabindex="0"
            onclick={handleValueClick}
            onkeydown={(e) => e.key === 'Enter' && handleValueClick(e as unknown as MouseEvent)}
          >
            <AttributeViewValue
              value={item.values[0]}
              avID={activeTable.avID}
              keyID={item.key.id}
              rowID={item.values[0].blockID}
              {allowEditing}
            />
          </div>
        </div>
      {/each}
    </div>
    <ShowEmptyAttributesToggle documentId={blockId} />
    <div class="fn__hr"></div>
  {/if}
</div>



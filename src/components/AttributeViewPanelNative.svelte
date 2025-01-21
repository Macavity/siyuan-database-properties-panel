<script lang="ts">
    import {LoggerService} from "@/services/LoggerService";
    import {getContext} from "svelte";
    import {Context} from "@/types/context";
    import {onMount} from "svelte";
    import {type AttributeView} from "@/types/AttributeView";
    import {getEmptyAVKeyAndValues} from "@/libs/getAVKeyAndValues";
    import LayoutTabBar from "@/components/ui/LayoutTabBar.svelte";
    import {settingsStore} from "@/stores/localSettingStore";

    export let avData: AttributeView[];
    export let showPrimaryKey: boolean = false;
    export let showEmptyAttributes: boolean = false;

    let element: HTMLDivElement | null = null;

    // State
    const blockId = getContext(Context.BlockID);
    const protyle = getContext(Context.Protyle);
    const logger = new LoggerService("AttributeViewPanelNative");

    const tabs = [];

    avData.forEach((attributeView) => {
        tabs.push({
            key: attributeView.avID,
            name: attributeView.avName,
            icon: "iconDatabase",
        });
    });

    onMount(() => {
        renderProtyleAv();
    });

    const showContent = (event: CustomEvent) => {
        const tabFocus = event.detail.key;

        if(!tabFocus){
            return;
        }

        activateTab(tabFocus);
    }

    const activateTab = (tabFocus: string) => {
        logger.debug("activateTab", tabFocus);
        const targetTab = element.querySelectorAll(`[data-type="NodeAttributeView"][data-av-id="${tabFocus}"]`);
        const remainingTabs = element.querySelectorAll(`[data-type="NodeAttributeView"]:not([data-av-id="${tabFocus}"])`);
        if(!targetTab.length){
            logger.info("showContent: No target tab found");
            return;
        }
        settingsStore.activateTab(blockId, tabFocus);

        targetTab.forEach((item: HTMLElement) => {
            item.classList.remove("dpp-av-panel--hidden");
        });
        remainingTabs.forEach((item: HTMLElement) => {
            item.classList.add("dpp-av-panel--hidden");
        });
    }

    const renderProtyleAv = () => {
        protyle.renderAVAttribute(element, blockId, (element) => {
            logger.debug("renderAVAttribute", element, blockId)
            if (!showPrimaryKey) {
                logger.debug("hide primary key");
                const primaryKeyValueField = element.querySelectorAll(
                    `[data-node-id='${blockId}'] [data-type='block']`
                );
                logger.debug("identify primary key", primaryKeyValueField);
                primaryKeyValueField.forEach((field) => {
                    const fieldElement = field as HTMLElement;
                    const colId = fieldElement.dataset?.colId;
                    const row = field.closest(`[data-col-id='${colId}'].av__row`);
                    row?.classList.add("dpp-av-panel--hidden");
                });
            }

            if (!showEmptyAttributes) {
                logger.debug("hide empty attributes");
                avData.forEach((table) => {
                    const emptyKeyAndValues = getEmptyAVKeyAndValues(table.keyValues);
                    emptyKeyAndValues.forEach((item) => {
                        element
                            .querySelectorAll(`[data-id='${blockId}'][data-col-id='${item.values[0].keyID}']`)
                            .forEach((field) => {
                                field.classList.add("dpp-av-col--empty");
                            });
                    });
                });
            }
            // Hide "add" buttons
            element.querySelectorAll("[data-type='addColumn']").forEach((button) => {
                button.classList.add("dpp-av-panel--hidden");

                // Remove the two following dividers
                const firstDivider = button.nextElementSibling;
                const secondDivider = firstDivider?.nextElementSibling;

                if (firstDivider?.classList.contains("fn__hr--b")) {
                    firstDivider.classList.add("dpp-av-panel--hidden");
                }
                if (secondDivider?.classList.contains("fn__hr--b")) {
                    secondDivider.classList.add("dpp-av-panel--hidden");
                }
            });

            element.querySelectorAll(".custom-attr__avheader").forEach((item) => {
                item.classList.add("dpp-av-panel--hidden");
            });

            if(!settingsStore.isAnyTabActive(blockId)){
                const first = element.querySelector(`[data-type="NodeAttributeView"]`);
                activateTab(first.getAttribute("data-av-id"));
            } else {
                activateTab(settingsStore.getActiveTab(blockId));
            }
        });
    }

    $: currentSettings = $settingsStore.get(blockId);
</script>

<div>
    <LayoutTabBar {tabs} focus={currentSettings.lastSelectedAttributeView} on:click={showContent}/>
    <div class="dpp-av-panel custom-attr" bind:this={element}></div>
</div>


import { AttributeView } from "@/types/AttributeView";
import { LoggerService } from "./LoggerService";
import { getEmptyAVKeyAndValues } from "@/libs/getAVKeyAndValues";
import semver from "semver";
import ShowEmptyAttributesToggle from "@/components/ShowEmptyAttributesToggle.svelte";
import CollapseButton from "@/components/ui/CollapseButton.svelte";
import RefreshButton from "@/components/ui/RefreshButton.svelte";
import { mount } from "svelte";
import { configStore } from "@/stores/configStore";

const logger = new LoggerService("AttributeViewService");

export interface AVTab {
  key: string;
  name: string;
  icon: "iconDatabase";
}

export class AttributeViewService {
  /**
   * Build tabs array from avData for use in LayoutTabBar.
   */
  static buildTabs(avData: AttributeView[]): AVTab[] {
    return avData.map((av) => ({
      key: av.avID,
      name: av.avName,
      icon: "iconDatabase" as const,
    }));
  }

  static handlePrimaryKey(
    element: HTMLElement,
    blockId: string,
    showPrimaryKey: boolean
  ) {
    // logger.debug("handlePrimaryKey");
    const primaryKeyValueField = element.querySelectorAll(
      `[data-node-id='${blockId}'] [data-type='block']`
    );
    primaryKeyValueField.forEach((field) => {
      const fieldElement = field as HTMLElement;
      const colId = fieldElement.dataset?.colId;
      const row = field.closest(`[data-col-id='${colId}'].av__row`);
      if (showPrimaryKey) {
        row?.classList.remove("dpp-av-panel--hidden");
      } else {
        row?.classList.add("dpp-av-panel--hidden");
      }
    });
  }

  static adjustDOM(
    element: HTMLElement,
    blockId: string,
    avData: AttributeView[],
    showPrimaryKey: boolean,
    showEmptyAttributes: boolean,
    alignPropertiesLeft: boolean = false,
    onRefresh?: () => void
  ) {
    logger.addBreadcrumb(blockId, "adjustDOM");
    // logger.debug("adjustDOM", { showPrimaryKey, showEmptyAttributes });
    AttributeViewService.handlePrimaryKey(element, blockId, showPrimaryKey);

    AttributeViewService.handleEmptyAttributes(
      element,
      blockId,
      avData,
      showEmptyAttributes
    );

    AttributeViewService.handleHiddenColumns(element, blockId, avData);
    AttributeViewService.addActionButtons(element, blockId, onRefresh);
    AttributeViewService.hideAvHeader(element);
    AttributeViewService.disableTemplateClicks(element);
    AttributeViewService.removeDuplicateHrElements(element);
    AttributeViewService.handleAlignPropertiesLeft(element, alignPropertiesLeft);
  }

  static handleHiddenColumns(
    element: HTMLElement,
    blockId: string,
    avData: AttributeView[]
  ) {
    avData.forEach((table) => {
      table.keyValues.forEach((item) => {
        if (!configStore.isColumnVisible(table.avID, item.key.id)) {
          element
            .querySelectorAll(
              `[data-id='${blockId}'][data-col-id='${item.key.id}']`
            )
            .forEach((field) => {
              field.classList.add("dpp-av-panel--hidden");
            });
        }
      });
    });
  }

  static handleEmptyAttributes(
    element: HTMLElement,
    blockId: string,
    avData: AttributeView[],
    showEmptyAttributes: boolean
  ) {
    avData.forEach((table) => {
      const emptyKeyAndValues = getEmptyAVKeyAndValues(table.keyValues);
      emptyKeyAndValues.forEach((item) => {
        element
          .querySelectorAll(
            `[data-id='${blockId}'][data-col-id='${item.values[0].keyID}']`
          )
          .forEach((field) => {
            if (showEmptyAttributes) {
              field.classList.remove("dpp-av-col--empty");
            } else {
              field.classList.add("dpp-av-col--empty");
            }
          });
      });
    });
  }

  static hideAvHeader(element: HTMLElement) {
    element.querySelectorAll(".custom-attr__avheader").forEach((item) => {
      item.classList.add("dpp-av-panel--hidden");
    });
  }

  /**
   * Remove av__row classes from the native panel to prevent CSS conflicts.
   * The native panel is used only for triggering edit functionality.
   */
  static removeAvRowClasses(element: HTMLElement) {
    element.querySelectorAll(".av__row").forEach((row) => {
      row.classList.remove("av__row");
    });
  }

  /**
   * Remove data-rendering attribute from all NodeAttributeView elements
   * within .dpp-av-panel containers.
   */
  static removeDataRenderingFromNodeAttributeViews(element: Element) {
    element
      .querySelectorAll("[data-type='NodeAttributeView']")
      .forEach((node) => {
        (node as HTMLElement).removeAttribute("data-rendering");
      });
  }

  /**
   * Watch for data-rendering attribute being added to NodeAttributeView elements
   * and automatically remove it. Returns a cleanup function to disconnect the observer.
   */
  static watchAndRemoveDataRendering(element: Element): () => void {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "data-rendering"
        ) {
          const target = mutation.target as HTMLElement;
          // Only process NodeAttributeView elements
          if (
            target.getAttribute("data-type") === "NodeAttributeView" &&
            target.hasAttribute("data-rendering")
          ) {
            logger.debug("Removing data-rendering attribute via MutationObserver");
            target.removeAttribute("data-rendering");
          }
        }
      }
    });

    // Single observer on the container with subtree covers all current and future NodeAttributeView elements
    observer.observe(element, {
      attributes: true,
      attributeFilter: ["data-rendering"],
      subtree: true,
    });

    return () => {
      observer.disconnect();
    };
  }

  static disableTemplateClicks(element: HTMLElement) {
    if (semver.lt(window.siyuan.config.system.kernelVersion, "3.1.21")) {
      //     logger.debug(
      //     "Kernel version is below 3.1.21, disabling clicks on templates"
      //   );
      const templates = element.querySelectorAll("[data-type='template']");
      templates.forEach((template) => {
        template.setAttribute("data-type", "text");
        template.classList.add("dpp-av-panel--disabled");
      });
    }
  }

  /**
   * Remove duplicate fn__hr--b elements from NodeAttributeView.
   * SiYuan sometimes renders two separators at the bottom - we keep only the first.
   */
  static removeDuplicateHrElements(element: HTMLElement) {
    const nodeAttrViews = element.querySelectorAll('[data-type="NodeAttributeView"]');
    nodeAttrViews.forEach((nodeAttrView) => {
      const hrElements = nodeAttrView.querySelectorAll('.fn__hr--b');
      if (hrElements.length >= 2) {
        hrElements[hrElements.length - 1].remove();
      }
    });
  }

  /**
   * Toggle left alignment class on av__row elements and layout-tab-bar-wrapper padding.
   */
  static handleAlignPropertiesLeft(element: HTMLElement, alignPropertiesLeft: boolean) {
    // Handle av__row elements
    const rows = element.querySelectorAll('.av__row');
    rows.forEach((row) => {
      if (alignPropertiesLeft) {
        row.classList.add('av-panel-row--align-left');
      } else {
        row.classList.remove('av-panel-row--align-left');
      }
    });

    // Handle layout-tab-bar-wrapper padding - look in parent plugin-panel
    const pluginPanel = element.closest('.plugin-panel');
    if (pluginPanel) {
      const tabBarWrapper = pluginPanel.querySelector('.layout-tab-bar-wrapper') as HTMLElement;
      if (tabBarWrapper) {
        if (alignPropertiesLeft) {
          tabBarWrapper.style.paddingLeft = '0';
          tabBarWrapper.style.paddingRight = '0';
        } else {
          tabBarWrapper.style.paddingLeft = '';
          tabBarWrapper.style.paddingRight = '';
        }
      }
    }
  }

  /**
   * Add action buttons (collapse before addColumn, show empty attributes and refresh after).
   * RefreshButton receives its callback via prop if provided, otherwise falls back to context.
   */
  static addActionButtons(
    container: HTMLElement,
    documentId: string,
    onRefresh?: () => void
  ) {
    // First remove any existing action buttons
    container
      .querySelectorAll(".dpp-empty-attributes-toggle, .dpp-collapse-button, .dpp-refresh-button")
      .forEach((button) => {
        button.remove();
      });

    const addColumnButton = container.querySelectorAll(
      "[data-type='addColumn']"
    );
    addColumnButton.forEach((element) => {
      const parent = element.parentNode;
      const nextSibling = element.nextSibling;

      // Mount CollapseButton BEFORE addColumnButton
      mount(CollapseButton, {
        target: parent as HTMLElement,
        anchor: element, // Insert before the addColumnButton element
        props: {
          documentId,
        },
      });

      // Mount ShowEmptyAttributesToggle AFTER addColumnButton
      mount(ShowEmptyAttributesToggle, {
        target: parent as HTMLElement,
        anchor: nextSibling,
        props: {
          documentId,
        },
      });

      // Mount RefreshButton AFTER ShowEmptyAttributesToggle
      mount(RefreshButton, {
        target: parent as HTMLElement,
        anchor: nextSibling,
        props: {
          onRefresh,
        },
      });
    });
  }
}

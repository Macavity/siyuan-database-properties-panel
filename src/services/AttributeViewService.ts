import { createApp, type App } from "vue";
import { AttributeView } from "@/types/AttributeView";
import { LoggerService } from "./LoggerService";
import { getEmptyAVKeyAndValues } from "@/libs/getAVKeyAndValues";
import semver from "semver";
import ActionButtonBar from "@/components/ActionButtonBar.vue";
import { pinia } from "@/stores";

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

  static handlePrimaryKey(element: HTMLElement, blockId: string, showPrimaryKey: boolean) {
    // logger.debug("handlePrimaryKey");
    const primaryKeyValueField = element.querySelectorAll(
      `[data-node-id='${blockId}'] [data-type='block']`,
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
    onRefresh?: () => void,
    isColumnVisible?: (avId: string, colId: string) => boolean,
  ) {
    logger.addBreadcrumb(blockId, "adjustDOM");
    // logger.debug("adjustDOM", { showPrimaryKey, showEmptyAttributes });
    AttributeViewService.handlePrimaryKey(element, blockId, showPrimaryKey);

    AttributeViewService.handleEmptyAttributes(element, blockId, avData, showEmptyAttributes);

    AttributeViewService.handleHiddenColumns(
      element,
      blockId,
      avData,
      isColumnVisible ?? (() => true),
    );
    AttributeViewService.addActionButtons(element, blockId, onRefresh);
    AttributeViewService.hideAvHeader(element);
    AttributeViewService.disableTemplateClicks(element);
    AttributeViewService.removeDuplicateHrElements(element);
    AttributeViewService.handleAlignPropertiesLeft(element, alignPropertiesLeft);
  }

  static handleHiddenColumns(
    element: HTMLElement,
    blockId: string,
    avData: AttributeView[],
    isColumnVisible: (avId: string, colId: string) => boolean,
  ) {
    avData.forEach((table) => {
      table.keyValues.forEach((item) => {
        if (!isColumnVisible(table.avID, item.key.id)) {
          element
            .querySelectorAll(`[data-id='${blockId}'][data-col-id='${item.key.id}']`)
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
    showEmptyAttributes: boolean,
  ) {
    avData.forEach((table) => {
      const emptyKeyAndValues = getEmptyAVKeyAndValues(table.keyValues);
      emptyKeyAndValues.forEach((item) => {
        element
          .querySelectorAll(`[data-id='${blockId}'][data-col-id='${item.values[0].keyID}']`)
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
    element.querySelectorAll("[data-type='NodeAttributeView']").forEach((node) => {
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
        if (mutation.type === "attributes" && mutation.attributeName === "data-rendering") {
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
      const hrElements = nodeAttrView.querySelectorAll(".fn__hr--b");
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
    const rows = element.querySelectorAll(".av__row");
    rows.forEach((row) => {
      if (alignPropertiesLeft) {
        row.classList.add("av-panel-row--align-left");
      } else {
        row.classList.remove("av-panel-row--align-left");
      }
    });

    // Handle layout-tab-bar-wrapper padding - look in parent plugin-panel
    const pluginPanel = element.closest(".plugin-panel");
    if (pluginPanel) {
      const tabBarWrapper = pluginPanel.querySelector(".layout-tab-bar-wrapper") as HTMLElement;
      if (tabBarWrapper) {
        if (alignPropertiesLeft) {
          tabBarWrapper.style.paddingLeft = "0";
          tabBarWrapper.style.paddingRight = "0";
        } else {
          tabBarWrapper.style.paddingLeft = "";
          tabBarWrapper.style.paddingRight = "";
        }
      }
    }
  }

  // Track Vue app instances for cleanup
  private static actionButtonApps: App[] = [];

  static cleanup() {
    AttributeViewService.actionButtonApps.forEach((app) => app.unmount());
    AttributeViewService.actionButtonApps = [];
  }

  /**
   * Replace native addColumn buttons with an ActionButtonBar that includes
   * collapse, addColumn, show-empty-attributes toggle, and refresh buttons.
   */
  static addActionButtons(container: HTMLElement, documentId: string, onRefresh?: () => void) {
    // Skip if the bar is already mounted — it manages its own reactive state
    if (container.querySelector(".dpp-action-button-bar")) {
      return;
    }

    // Clean up existing Vue app instances
    AttributeViewService.actionButtonApps.forEach((app) => app.unmount());
    AttributeViewService.actionButtonApps = [];

    const addColumnButtons = container.querySelectorAll("[data-type='addColumn']");
    addColumnButtons.forEach((element) => {
      const parent = element.parentNode as HTMLElement;

      // Create wrapper and insert it where the native addColumn button was
      const wrapper = document.createElement("div");
      wrapper.className = "dpp-action-button-bar";
      wrapper.style.display = "contents";
      const addColumnLabel = element.textContent?.trim() || "";
      parent.replaceChild(wrapper, element);

      const app = createApp(ActionButtonBar, { documentId, onRefresh, addColumnLabel });
      app.use(pinia);
      app.mount(wrapper);
      AttributeViewService.actionButtonApps.push(app);
    });
  }
}

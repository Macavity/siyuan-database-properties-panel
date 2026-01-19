import { AttributeView } from "@/types/AttributeView";
import { LoggerService } from "./LoggerService";
import { getEmptyAVKeyAndValues } from "@/libs/getAVKeyAndValues";
import semver from "semver";
import ShowEmptyAttributesToggle from "@/components/ShowEmptyAttributesToggle.svelte";
import { mount } from "svelte";

const logger = new LoggerService("AttributeViewService");

export class AttributeViewService {
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
    showEmptyAttributes: boolean
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

    AttributeViewService.addToggleShowEmptyAttributes(element, blockId);
    AttributeViewService.hideAvHeader(element);
    AttributeViewService.disableTemplateClicks(element);
  }

  static handleEmptyAttributes(
    element: HTMLElement,
    blockId: string,
    avData: AttributeView[],
    showEmptyAttributes: boolean
  ) {
    // logger.debug("handleEmptyAttributes");
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
          if (target.hasAttribute("data-rendering")) {
            logger.debug("Removing data-rendering attribute via MutationObserver");
            target.removeAttribute("data-rendering");
          }
        }
      }
    });

    // Observe all NodeAttributeView elements within the container
    element.querySelectorAll("[data-type='NodeAttributeView']").forEach((node) => {
      observer.observe(node, {
        attributes: true,
        attributeFilter: ["data-rendering"],
      });
    });

    // Also observe the container for new NodeAttributeView elements being added
    const childObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            // Check if the added node is a NodeAttributeView
            if (node.getAttribute("data-type") === "NodeAttributeView") {
              node.removeAttribute("data-rendering");
              observer.observe(node, {
                attributes: true,
                attributeFilter: ["data-rendering"],
              });
            }
            // Also check descendants
            node.querySelectorAll("[data-type='NodeAttributeView']").forEach((av) => {
              (av as HTMLElement).removeAttribute("data-rendering");
              observer.observe(av, {
                attributes: true,
                attributeFilter: ["data-rendering"],
              });
            });
          }
        });
      }
    });

    childObserver.observe(element, {
      childList: true,
      subtree: true,
    });

    // Return cleanup function
    return () => {
      observer.disconnect();
      childObserver.disconnect();
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
   * TODO only triggered once maybe?
   */
  static addToggleShowEmptyAttributes(
    container: HTMLElement,
    documentId: string
  ) {
    // First remove any existing toggle buttons
    container
      .querySelectorAll(".dpp-empty-attributes-toggle")
      .forEach((button) => {
        button.remove();
      });

    const addColumnButton = container.querySelectorAll(
      "[data-type='addColumn']"
    );
    addColumnButton.forEach((element) => {
      mount(ShowEmptyAttributesToggle, {
        target: container,
        anchor: element.nextSibling,
        props: {
          documentId,
        },
      });
    });
  }
}

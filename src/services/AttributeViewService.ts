import { AttributeView } from "@/types/AttributeView";
import { LoggerService } from "./LoggerService";
import { getEmptyAVKeyAndValues } from "@/libs/getAVKeyAndValues";
import semver from "semver";
import ShowEmptyAttributesToggle from "@/components/ShowEmptyAttributesToggle.svelte";
import { mount } from "svelte";

const logger = new LoggerService("AttributeViewService");

export class AttributeViewService {
  static hidePrimaryKey(element: HTMLElement, blockId: string) {
    logger.debug("hidePrimaryKey");
    const primaryKeyValueField = element.querySelectorAll(
      `[data-node-id='${blockId}'] [data-type='block']`,
    );
    primaryKeyValueField.forEach((field) => {
      const fieldElement = field as HTMLElement;
      const colId = fieldElement.dataset?.colId;
      const row = field.closest(`[data-col-id='${colId}'].av__row`);
      row?.classList.add("dpp-av-panel--hidden");
    });
  }

  static adjustDOM(
    element: HTMLElement,
    blockId: string,
    avData: AttributeView[],
    showPrimaryKey: boolean,
    showEmptyAttributes: boolean,
  ) {
    if (!showPrimaryKey) {
      AttributeViewService.hidePrimaryKey(element, blockId);
    }

    if (!showEmptyAttributes) {
      AttributeViewService.hideEmptyAttributes(element, blockId, avData);
    }

    AttributeViewService.addToggleShowEmptyAttributes(element);
    AttributeViewService.hideAvHeader(element);
    AttributeViewService.disableTemplateClicks(element);
  }

  static hideEmptyAttributes(
    element: HTMLElement,
    blockId: string,
    avData: AttributeView[],
  ) {
    logger.debug("hideEmptyAttributes");
    avData.forEach((table) => {
      const emptyKeyAndValues = getEmptyAVKeyAndValues(table.keyValues);
      emptyKeyAndValues.forEach((item) => {
        element
          .querySelectorAll(
            `[data-id='${blockId}'][data-col-id='${item.values[0].keyID}']`,
          )
          .forEach((field) => {
            field.classList.add("dpp-av-col--empty");
          });
      });
    });
  }

  static hideAvHeader(element: HTMLElement) {
    element.querySelectorAll(".custom-attr__avheader").forEach((item) => {
      item.classList.add("dpp-av-panel--hidden");
    });
  }

  static disableTemplateClicks(element: HTMLElement) {
    if (semver.lt(window.siyuan.config.system.kernelVersion, "3.1.21")) {
      logger.debug(
        "Kernel version is below 3.1.21, disabling clicks on templates",
      );
      const templates = element.querySelectorAll("[data-type='template']");
      templates.forEach((template) => {
        template.setAttribute("data-type", "text");
        template.classList.add("dpp-av-panel--disabled");
      });
    }
  }

  static addToggleShowEmptyAttributes(container: HTMLElement) {
    const addColumnButton = container.querySelectorAll(
      "[data-type='addColumn']",
    );
    if (addColumnButton.length > 0) {
      const container = document.createElement("div");
      addColumnButton[0].after(container);

      mount(ShowEmptyAttributesToggle, {
        target: container,
      });
    }
  }
}

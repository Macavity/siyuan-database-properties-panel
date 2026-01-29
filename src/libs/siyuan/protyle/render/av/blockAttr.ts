/**
 * These functions are direct copies of not exposed functions from siyuan.
 * @source app/src/protyle/render/av/blockAttr.ts
 */
import dayjs from "dayjs";
import { IProtyle, TAVCol } from "siyuan";
import { IAVCellValue } from "@/types/siyuan.types";
import { escapeAttr } from "@/libs/siyuan/protyle/util/escape";
import { Logger } from "@/services/LoggerService";

/**
 * @source siyuan-app/app/src/protyle/util/hasClosest
 */
export const hasClosestBlock = (element: Node) => {
  const nodeElement = hasClosestByAttribute(element, "data-node-id", null);
  if (nodeElement && nodeElement.tagName !== "BUTTON" && nodeElement.getAttribute("data-type")?.startsWith("Node")) {
    return nodeElement;
  }
  return false;
};

/**
 * @source siyuan-app/app/src/protyle/util/hasClosest
 */
export const hasClosestByAttribute = (element: Node, attr: string, value: string | null, top = false) => {
  if (!element || element.nodeType === 9) {
    return false;
  }
  if (element.nodeType === 3) {
    element = element.parentElement;
  }
  let e = element as HTMLElement;
  let isClosest = false;
  while (e && !isClosest && (top ? e.tagName !== "BODY" : !e.classList.contains("protyle-wysiwyg"))) {
    if (typeof value === "string" && e.getAttribute(attr)?.split(" ").includes(value)) {
      isClosest = true;
    } else if (typeof value !== "string" && e.hasAttribute(attr)) {
      isClosest = true;
    } else {
      e = e.parentElement;
    }
  }
  return isClosest && e;
};

/**
 * @source siyuan-app/app/src/protyle/util/hasClosest
 */
export const hasClosestByClassName = (element: Node, className: string, top = false) => {
  if (!element || element.nodeType === 9) {
    return false;
  }
  if (element.nodeType === 3) {
    element = element.parentElement;
  }
  let e = element as HTMLElement;
  let isClosest = false;
  while (e && !isClosest && (top ? e.tagName !== "BODY" : !e.classList.contains("protyle-wysiwyg"))) {
    if (e.classList?.contains(className)) {
      isClosest = true;
    } else {
      e = e.parentElement;
    }
  }
  return isClosest && e;
};

/**
 * Reposition a menu element to appear near the target element.
 */
const repositionMenu = (targetRect: DOMRect): void => {
  // Find the menu that was just opened
  const avPanel = document.querySelector(".av__panel") as HTMLElement;
  const b3Menu = document.querySelector(".b3-menu:not(.fn__none)") as HTMLElement;

  const menuElement = avPanel || b3Menu;
  if (!menuElement) return;

  // Position the menu below the clicked element
  menuElement.style.left = `${targetRect.left}px`;
  menuElement.style.top = `${targetRect.bottom}px`;

  // Make sure the menu doesn't go off-screen
  const menuRect = menuElement.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Adjust horizontal position if menu goes off-screen
  if (menuRect.right > viewportWidth) {
    menuElement.style.left = `${viewportWidth - menuRect.width - 10}px`;
  }

  // Adjust vertical position if menu goes off-screen
  if (menuRect.bottom > viewportHeight) {
    // Position above the element instead
    menuElement.style.top = `${targetRect.top - menuRect.height}px`;
  }
};

/**
 * Trigger edit by clicking on the corresponding element in the hidden native panel.
 * This works because the native panel has SiYuan's event handlers attached.
 * After the menu opens, reposition it to appear near the clicked element.
 */
const triggerNativeEdit = (target: HTMLElement): boolean => {
  const avId = target.getAttribute("data-av-id");
  const colId = target.getAttribute("data-col-id");

  if (!avId || !colId) return false;

  // Find the hidden native panel
  const nativePanel = document.querySelector(".dpp-native-debug .custom-attr");
  if (!nativePanel) return false;

  // Find the corresponding element in the native panel
  const nativeCell = nativePanel.querySelector(
    `[data-av-id="${avId}"][data-col-id="${colId}"]`
  ) as HTMLElement;

  if (nativeCell) {
    // Get the position of the clicked element before triggering the native click
    const targetRect = target.getBoundingClientRect();

    // Trigger a click on the native element to open the edit popup
    nativeCell.click();

    // Reposition the menu after it opens
    // Use multiple attempts with increasing delays since the menu may take time to render
    const attemptReposition = (attempt: number) => {
      if (attempt > 10) return; // Give up after 10 attempts (500ms)

      setTimeout(() => {
        const menuElement = document.querySelector(".av__panel") || document.querySelector(".b3-menu:not(.fn__none)");
        if (menuElement) {
          repositionMenu(targetRect);
        } else if (attempt < 10) {
          // Menu not found yet, try again
          attemptReposition(attempt + 1);
        }
      }, attempt * 50); // 0ms, 50ms, 100ms, 150ms...
    };

    attemptReposition(0);
    return true;
  }

  return false;
};

/**
 * This function is here for comparison to better see changes in the original source code and reflect them on the plugin.
 */
const genAVValueHTML = (value: IAVCellValue) => {
  let html = "";
  switch (value.type) {
    case "block":
      html = `<div class="fn__flex-1">${value.block.content}</div>`;
      break;
    case "text":
      html = `<textarea style="resize: vertical" rows="${value.text.content.split("\n").length}" class="b3-text-field b3-text-field--text fn__flex-1">${value.text.content}</textarea>`;
      break;
    case "number":
      html = `
              <input value="${value.number.isNotEmpty ? value.number.content : ""}" 
                      type="number" 
                      class="b3-text-field b3-text-field--text fn__flex-1">
  <span class="fn__space"></span><span class="fn__flex-center ft__on-surface b3-tooltips__w b3-tooltips" aria-label="${window.siyuan.languages.format}">${value.number.formattedContent}</span><span class="fn__space"></span>`;
      break;
    case "mSelect":
    case "select":
      value.mSelect?.forEach((item) => {
        const b3BackgroundColorVar = `--b3-font-background${item.color}`;
        const b3FontColorVar = `--b3-font-color${item.color}`;
        html += `<span class="b3-chip b3-chip--middle" style="background-color:var(${b3BackgroundColorVar});color:var(${b3FontColorVar})">${item.content}</span>`;
      });
      break;
    case "mAsset":
      value.mAsset?.forEach((item) => {
        if (item.type === "image") {
          html += `<img class="av__cellassetimg ariaLabel" aria-label="${item.content}" src="${item.content}">`;
        } else {
          html += `<span class="b3-chip b3-chip--middle av__celltext--url ariaLabel" aria-label="${escapeAttr(item.content)}" data-name="${escapeAttr(item.name)}" data-url="${escapeAttr(item.content)}">${item.name || item.content}</span>`;
        }
      });
      break;
    case "date":
      html = `<span class="av__celltext" data-value='${JSON.stringify(value[value.type])}'>`;
      if (value[value.type] && value[value.type].isNotEmpty) {
        html += dayjs(value[value.type].content).format(
          value[value.type].isNotTime ? "YYYY-MM-DD" : "YYYY-MM-DD HH:mm"
        );
      }
      if (
        value[value.type] &&
        value[value.type].hasEndDate &&
        value[value.type].isNotEmpty &&
        value[value.type].isNotEmpty2
      ) {
        html += `<svg class="av__cellicon"><use xlink:href="#iconForward"></use></svg>${dayjs(value[value.type].content2).format(value[value.type].isNotTime ? "YYYY-MM-DD" : "YYYY-MM-DD HH:mm")}`;
      }
      html += "</span>";
      break;
    case "created":
    case "updated":
      if (value[value.type].isNotEmpty) {
        html = `<span data-content="${value[value.type].content}">${dayjs(value[value.type].content).format("YYYY-MM-DD HH:mm")}</span>`;
      }
      break;
    case "url":
      html = `<input value="${value.url.content}" class="b3-text-field b3-text-field--text fn__flex-1">
  <span class="fn__space"></span>
  <a href="${value.url.content}" target="_blank" aria-label="${window.siyuan.languages.openBy}" class="block__icon block__icon--show fn__flex-center b3-tooltips__w b3-tooltips"><svg><use xlink:href="#iconLink"></use></svg></a>`;
      break;
    case "phone":
      html = `<input value="${value.phone.content}" class="b3-text-field b3-text-field--text fn__flex-1">
  <span class="fn__space"></span>
  <a href="tel:${value.phone.content}" target="_blank" aria-label="${window.siyuan.languages.openBy}" class="block__icon block__icon--show fn__flex-center b3-tooltips__w b3-tooltips"><svg><use xlink:href="#iconPhone"></use></svg></a>`;
      break;
    case "checkbox":
      html = `<svg class="av__checkbox"><use xlink:href="#icon${value.checkbox.checked ? "Check" : "Uncheck"}"></use></svg>`;
      break;
    case "template":
      html = `<div class="fn__flex-1">${value.template.content}</div>`;
      break;
    case "email":
      html = `<input value="${value.email.content}" class="b3-text-field b3-text-field--text fn__flex-1">
  <span class="fn__space"></span>
  <a href="mailto:${value.email.content}" target="_blank" aria-label="${window.siyuan.languages.openBy}" class="block__icon block__icon--show fn__flex-center b3-tooltips__w b3-tooltips"><svg><use xlink:href="#iconEmail"></use></svg></a>`;
      break;
    case "relation":
      value?.relation?.contents?.forEach((item) => {
        if (item) {
          const rollupText = genAVRollupHTML(item);
          if (rollupText) {
            html += rollupText + ",&nbsp;";
          }
        }
      });
      if (html && html.endsWith(",&nbsp;")) {
        html = html.substring(0, html.length - 7);
      }
      break;
    case "rollup":
      value?.rollup?.contents?.forEach((item) => {
        const rollupText = [
          "select",
          "mSelect",
          "mAsset",
          "checkbox",
          "relation",
        ].includes(item.type)
          ? genAVValueHTML(item)
          : genAVRollupHTML(item);
        if (rollupText) {
          html += rollupText + ",&nbsp;";
        }
      });
      if (html && html.endsWith(",&nbsp;")) {
        html = html.substring(0, html.length - 7);
      }
      break;
  }
  return html;
};

/**
 * This function is here for comparison to better see changes in the original source code and reflect them on the plugin.
 * @source app/src/protyle/render/av/blockAttr.ts
 */
const genAVRollupHTML = (value: IAVCellValue) => {
  let html = "";
  switch (value.type) {
    case "block":
      if (value?.isDetached) {
        html = `<span data-id="${value.block?.id}">${value.block?.content || window.siyuan.languages.untitled}</span>`;
      } else {
        html = `<span data-type="block-ref" data-id="${value.block?.id}" data-subtype="s" class="av__celltext--ref">${value.block?.content || window.siyuan.languages.untitled}</span>`;
      }
      break;
    case "text":
      html = value.text.content;
      break;
    case "number":
      html = value.number.formattedContent || value.number.content.toString();
      break;
    case "date":
      if (value[value.type] && value[value.type].isNotEmpty) {
        html = dayjs(value[value.type].content).format(
          value[value.type].isNotTime ? "YYYY-MM-DD" : "YYYY-MM-DD HH:mm"
        );
      }
      if (
        value[value.type] &&
        value[value.type].hasEndDate &&
        value[value.type].isNotEmpty &&
        value[value.type].isNotEmpty2
      ) {
        html += `<svg class="av__cellicon"><use xlink:href="#iconForward"></use></svg>${dayjs(value[value.type].content2).format(value[value.type].isNotTime ? "YYYY-MM-DD" : "YYYY-MM-DD HH:mm")}`;
      }
      if (html) {
        html = `<span class="av__celltext">${html}</span>`;
      }
      break;
    case "url":
      html = value.url.content
        ? `<a class="fn__a" href="${value.url.content}" target="_blank">${value.url.content}</a>`
        : "";
      break;
    case "phone":
      html = value.phone.content
        ? `<a class="fn__a" href="tel:${value.phone.content}" target="_blank">${value.phone.content}</a>`
        : "";
      break;
    case "email":
      html = value.email.content
        ? `<a class="fn__a" href="mailto:${value.email.content}" target="_blank">${value.email.content}</a>`
        : "";
      break;
  }
  return html;
};

export const openEdit = (
  _protyle: IProtyle,
  element: HTMLElement,
  event: MouseEvent
) => {
  Logger.debug("openEdit called");
  let target = event.target as HTMLElement;
  const blockElement = hasClosestBlock(target);
  if (!blockElement) {
    Logger.debug('no block element => skip')
    return;
  }

  // Find the element with data-type attribute (the cell container)
  while (target && !element.isSameNode(target)) {
    const type = target.getAttribute("data-type") as TAVCol;

    // Skip non-editable types or types without data-type
    if (!type) {
      target = target.parentElement as HTMLElement;
      continue;
    }

    // For editable types, trigger edit via the hidden native panel
    if (["date", "select", "mSelect", "mAsset", "checkbox", "relation", "template", "rollup"].includes(type)) {
      const triggered = triggerNativeEdit(target);
      if (triggered) {
        event.stopPropagation();
        event.preventDefault();
      }
      break;
    }

    target = target.parentElement as HTMLElement;
  }
};

export const cellScrollIntoView = (
  blockElement: HTMLElement,
  cellElement: Element,
  onlyHeight = true
) => {
  const cellRect = cellElement.getBoundingClientRect();
  if (!onlyHeight) {
    const avScrollElement = blockElement.querySelector(".av__scroll");
    if (avScrollElement) {
      const avScrollRect = avScrollElement.getBoundingClientRect();
      if (avScrollRect.right < cellRect.right) {
        avScrollElement.scrollLeft =
          avScrollElement.scrollLeft + cellRect.right - avScrollRect.right;
      } else {
        const rowElement = hasClosestByClassName(cellElement, "av__row");
        if (rowElement) {
          const stickyElement = rowElement.querySelector(".av__colsticky");
          if (stickyElement) {
            if (!stickyElement.contains(cellElement)) {
              // https://github.com/siyuan-note/siyuan/issues/12162
              const stickyRight = stickyElement.getBoundingClientRect().right;
              if (stickyRight > cellRect.left) {
                avScrollElement.scrollLeft =
                  avScrollElement.scrollLeft + cellRect.left - stickyRight;
              }
            }
          } else if (avScrollRect.left > cellRect.left) {
            avScrollElement.scrollLeft =
              avScrollElement.scrollLeft + cellRect.left - avScrollRect.left;
          }
        }
      }
    }
  }
  /// #if MOBILE
  const contentElement = hasClosestByClassName(
    blockElement,
    "protyle-content",
    true
  );
  if (contentElement && cellElement.getAttribute("data-dtype") !== "checkbox") {
    const keyboardToolbarElement = document.getElementById("keyboardToolbar");
    const keyboardH =
      parseInt(keyboardToolbarElement.getAttribute("data-keyboardheight")) ||
      window.outerHeight / 2 - 42;
    console.log(keyboardH, window.innerHeight, cellRect.bottom);
    if (cellRect.bottom > window.innerHeight - keyboardH - 42) {
      contentElement.scrollTop +=
        cellRect.bottom - window.innerHeight + 42 + keyboardH;
    } else if (cellRect.top < 110) {
      contentElement.scrollTop -= 110 - cellRect.top;
    }
  }
  /// #else
  if (!blockElement.querySelector(".av__header")) {
    // 属性面板
    return;
  }
  const avHeaderRect = blockElement
    .querySelector(".av__row--header")
    .getBoundingClientRect();
  if (avHeaderRect.bottom > cellRect.top) {
    const contentElement = hasClosestByClassName(
      blockElement,
      "protyle-content",
      true
    );
    if (contentElement) {
      contentElement.scrollTop =
        contentElement.scrollTop + cellRect.top - avHeaderRect.bottom;
    }
  } else {
    const footerElement = blockElement.querySelector(".av__row--footer");
    if (footerElement.querySelector(".av__calc--ashow")) {
      const avFooterRect = footerElement.getBoundingClientRect();
      if (avFooterRect.top < cellRect.bottom) {
        const contentElement = hasClosestByClassName(
          blockElement,
          "protyle-content",
          true
        );
        if (contentElement) {
          contentElement.scrollTop =
            contentElement.scrollTop + cellRect.bottom - avFooterRect.top;
        }
      }
    } else {
      const contentElement = hasClosestByClassName(
        blockElement,
        "protyle-content",
        true
      );
      if (contentElement) {
        const contentRect = contentElement.getBoundingClientRect();
        if (cellRect.bottom > contentRect.bottom) {
          contentElement.scrollTop =
            contentElement.scrollTop + (cellRect.top - contentRect.top - 33);
        }
      }
    }
  }
  /// #endif
};

/**
 * These functions are direct copies of not exposed functions from siyuan.
 * @source app/src/protyle/render/av/blockAttr.ts
 */
import dayjs from "dayjs";
import { escapeAttr } from "@siyuan/app/util/escape";

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
  protyle: IProtyle,
  element: HTMLElement,
  event: MouseEvent
) => {
  let target = event.target as HTMLElement;
  const blockElement = hasClosestBlock(target);
  if (!blockElement) {
    return;
  }
  while (target && !element.isSameNode(target)) {
    const type = target.getAttribute("data-type");
    if (
      target.classList.contains("av__celltext--url") ||
      target.classList.contains("av__cellassetimg")
    ) {
      if (
        event.type === "contextmenu" ||
        (!target.dataset.url && target.tagName !== "IMG")
      ) {
        // let index = 0;
        // Array.from(target.parentElement.children).find((item, i) => {
        //   if (item.isSameNode(target)) {
        //     index = i;
        //     return true;
        //   }
        // });
        // editAssetItem({
        //   protyle,
        //   cellElements: [target.parentElement],
        //   blockElement: hasClosestBlock(target) as HTMLElement,
        //   content:
        //     target.tagName === "IMG"
        //       ? target.getAttribute("src")
        //       : target.getAttribute("data-url"),
        //   type: target.tagName === "IMG" ? "image" : "file",
        //   name:
        //     target.tagName === "IMG" ? "" : target.getAttribute("data-name"),
        //   index,
        //   rect: target.getBoundingClientRect(),
        // });
      } else {
        // if (target.tagName === "IMG") {
        //   previewImage(target.getAttribute("src"));
        // } else {
        //   openLink(
        //     protyle,
        //     target.dataset.url,
        //     event,
        //     event.ctrlKey || event.metaKey
        //   );
        // }
      }
      event.stopPropagation();
      event.preventDefault();
      break;
    } else if (type === "date") {
      popTextCell(protyle, [target], "date");
      event.stopPropagation();
      event.preventDefault();
      break;
    } else if (type === "select" || type === "mSelect") {
      popTextCell(
        protyle,
        [target],
        target.getAttribute("data-type") as TAVCol
      );
      event.stopPropagation();
      event.preventDefault();
      break;
    } else if (type === "mAsset") {
      element
        .querySelectorAll('.custom-attr__avvalue[data-type="mAsset"]')
        .forEach((item) => {
          item.removeAttribute("data-active");
        });
      target.setAttribute("data-active", "true");
      target.focus();
      popTextCell(protyle, [target], "mAsset");
      event.stopPropagation();
      event.preventDefault();
      break;
    } else if (type === "checkbox") {
      popTextCell(protyle, [target], "checkbox");
      event.stopPropagation();
      event.preventDefault();
      break;
    } else if (type === "relation") {
      popTextCell(protyle, [target], "relation");
      event.stopPropagation();
      event.preventDefault();
      break;
    } else if (type === "template") {
      popTextCell(protyle, [target], "template");
      event.stopPropagation();
      event.preventDefault();
      break;
    } else if (type === "rollup") {
      popTextCell(protyle, [target], "rollup");
      event.stopPropagation();
      event.preventDefault();
      break;
    } else if (type === "addColumn") {
      // const rowElements = blockElement.querySelectorAll(".av__row");
      // const addMenu = addCol(
      //   protyle,
      //   blockElement,
      //   rowElements[rowElements.length - 1].getAttribute("data-col-id")
      // );
      // const addRect = target.getBoundingClientRect();
      // addMenu.open({
      //   x: addRect.left,
      //   y: addRect.bottom,
      //   h: addRect.height,
      // });
      // event.stopPropagation();
      // event.preventDefault();
      // break;
    } else if (type === "editCol") {
      // openMenuPanel({
      //   protyle,
      //   blockElement,
      //   type: "edit",
      //   colId: target.parentElement.dataset.colId,
      // });
      // event.stopPropagation();
      // event.preventDefault();
      // break;
    }
    target = target.parentElement;
  }
}

export const cellScrollIntoView = (blockElement: HTMLElement, cellElement: Element, onlyHeight = true) => {
  const cellRect = cellElement.getBoundingClientRect();
  if (!onlyHeight) {
    const avScrollElement = blockElement.querySelector(".av__scroll");
    if (avScrollElement) {
      const avScrollRect = avScrollElement.getBoundingClientRect();
      if (avScrollRect.right < cellRect.right) {
        avScrollElement.scrollLeft = avScrollElement.scrollLeft + cellRect.right - avScrollRect.right;
      } else {
        const rowElement = hasClosestByClassName(cellElement, "av__row");
        if (rowElement) {
          const stickyElement = rowElement.querySelector(".av__colsticky");
          if (stickyElement) {
            if (!stickyElement.contains(cellElement)) { // https://github.com/siyuan-note/siyuan/issues/12162
              const stickyRight = stickyElement.getBoundingClientRect().right;
              if (stickyRight > cellRect.left) {
                avScrollElement.scrollLeft = avScrollElement.scrollLeft + cellRect.left - stickyRight;
              }
            }
          } else if (avScrollRect.left > cellRect.left) {
            avScrollElement.scrollLeft = avScrollElement.scrollLeft + cellRect.left - avScrollRect.left;
          }
        }
      }
    }
  }
  /// #if MOBILE
  const contentElement = hasClosestByClassName(blockElement, "protyle-content", true);
  if (contentElement && cellElement.getAttribute("data-dtype") !== "checkbox") {
    const keyboardToolbarElement = document.getElementById("keyboardToolbar");
    const keyboardH = parseInt(keyboardToolbarElement.getAttribute("data-keyboardheight")) || (window.outerHeight / 2 - 42);
    console.log(keyboardH, window.innerHeight, cellRect.bottom);
    if (cellRect.bottom > window.innerHeight - keyboardH - 42) {
      contentElement.scrollTop += cellRect.bottom - window.innerHeight + 42 + keyboardH;
    } else if (cellRect.top < 110) {
      contentElement.scrollTop -= 110 - cellRect.top;
    }
  }
  /// #else
  if (!blockElement.querySelector(".av__header")) {
    // 属性面板
    return;
  }
  const avHeaderRect = blockElement.querySelector(".av__row--header").getBoundingClientRect();
  if (avHeaderRect.bottom > cellRect.top) {
    const contentElement = hasClosestByClassName(blockElement, "protyle-content", true);
    if (contentElement) {
      contentElement.scrollTop = contentElement.scrollTop + cellRect.top - avHeaderRect.bottom;
    }
  } else {
    const footerElement = blockElement.querySelector(".av__row--footer");
    if (footerElement.querySelector(".av__calc--ashow")) {
      const avFooterRect = footerElement.getBoundingClientRect();
      if (avFooterRect.top < cellRect.bottom) {
        const contentElement = hasClosestByClassName(blockElement, "protyle-content", true);
        if (contentElement) {
          contentElement.scrollTop = contentElement.scrollTop + cellRect.bottom - avFooterRect.top;
        }
      }
    } else {
      const contentElement = hasClosestByClassName(blockElement, "protyle-content", true);
      if (contentElement) {
        const contentRect = contentElement.getBoundingClientRect();
        if (cellRect.bottom > contentRect.bottom) {
          contentElement.scrollTop = contentElement.scrollTop + (cellRect.top - contentRect.top - 33);
        }
      }
    }
  }
  /// #endif
};

import { type TAVCol, type IProtyle } from "siyuan";
import { Constants } from "siyuan";
import dayjs from "dayjs";
import { type IAVCellValue } from "@/types/siyuan.types";

/**
 * This function is a direct copy of the original source code.
 * @source app/src/util/escape.ts
 * @param html
 */
export const escapeAttr = (html: string) => {
  if (!html) {
    return html;
  }
  return html.replace(/"/g, "&quot;").replace(/'/g, "&apos;");
};

/**
 * @source app/src/protyle/render/av/col.ts
 * @param type
 */
export const getColIconByType = (type: TAVCol) => {
  switch (type) {
    case "text":
      return "iconAlignLeft";
    case "block":
      return "iconKey";
    case "number":
      return "iconNumber";
    case "select":
      return "iconListItem";
    case "mSelect":
      return "iconList";
    case "relation":
      return "iconOpen";
    case "rollup":
      return "iconSearch";
    case "date":
      return "iconCalendar";
    case "updated":
    case "created":
      return "iconClock";
    case "url":
      return "iconLink";
    case "mAsset":
      return "iconImage";
    case "email":
      return "iconEmail";
    case "phone":
      return "iconPhone";
    case "template":
      return "iconMath";
    case "checkbox":
      return "iconCheck";
    case "lineNumber":
      return "iconOrderedList";
  }
};

/**
 * This function is here for comparison to better see changes in the original source code and reflect them on the plugin.
 * @source app/src/protyle/render/av/blockAttr.ts
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

export const isMobile = () => {
  return document.getElementById("sidebar") ? true : false;
};

export const setPadding = (protyle: IProtyle) => {
  if (protyle.options.action.includes(Constants.CB_GET_HISTORY)) {
    return {
      width: 0,
      padding: 0,
    };
  }
  const oldLeft = parseInt(protyle.wysiwyg.element.style.paddingLeft);
  const padding = getPadding(protyle);
  const left = padding.left;
  const right = padding.right;
  if (protyle.options.backlinkData) {
    protyle.wysiwyg.element.style.padding = `4px ${right}px 4px ${left}px`;
  } else {
    protyle.wysiwyg.element.style.padding = `${padding.top}px ${right}px ${padding.bottom}px ${left}px`;
  }
  if (protyle.options.render.background) {
    protyle.background.element
      .querySelector(".protyle-background__ia")
      .setAttribute("style", `margin-left:${left}px;margin-right:${right}px`);
  }
  if (protyle.options.render.title) {
    /// #if MOBILE
    protyle.title.element.style.margin = `16px ${right}px 0 ${left}px`;
    /// #else
    protyle.title.element.style.margin = `5px ${right}px 0 ${left}px`;
    /// #endif
  }
  if (window.siyuan.config.editor.displayBookmarkIcon) {
    const editorAttrElement = document.getElementById("editorAttr");
    if (editorAttrElement) {
      editorAttrElement.innerHTML = `.protyle-wysiwyg--attr .b3-tooltips:after { max-width: ${protyle.wysiwyg.element.clientWidth - left - right}px; }`;
    }
  }
  const oldWidth = protyle.wysiwyg.element.getAttribute("data-realwidth");
  const newWidth =
    protyle.wysiwyg.element.clientWidth -
    parseInt(protyle.wysiwyg.element.style.paddingLeft) -
    parseInt(protyle.wysiwyg.element.style.paddingRight);
  protyle.wysiwyg.element.setAttribute("data-realwidth", newWidth.toString());
  return {
    width: Math.abs(parseInt(oldWidth) - newWidth),
    padding: Math.abs(
      oldLeft - parseInt(protyle.wysiwyg.element.style.paddingLeft)
    ),
  };
};

// app/src/protyle/ui/initUI.ts
export const getPadding = (protyle: IProtyle) => {
  let right = 16;
  let left = 24;
  let bottom = 16;
  if (protyle.options.typewriterMode) {
    if (isMobile()) {
      bottom = window.innerHeight / 5;
    } else {
      bottom = protyle.element.clientHeight / 2;
    }
  }
  if (!isMobile()) {
    let isFullWidth = protyle.wysiwyg.element.getAttribute(
      Constants.CUSTOM_SY_FULLWIDTH
    );
    if (!isFullWidth) {
      isFullWidth = window.siyuan.config.editor.fullWidth ? "true" : "false";
    }
    let padding =
      (protyle.element.clientWidth - Constants.SIZE_EDITOR_WIDTH) / 2;
    if (isFullWidth === "false" && padding > 96) {
      if (padding > Constants.SIZE_EDITOR_WIDTH) {
        // 超宽屏调整 https://ld246.com/article/1668266637363
        padding = (protyle.element.clientWidth * 0.382) / 1.382;
      }
      padding = Math.ceil(padding);
      left = padding;
      right = padding;
    } else if (protyle.element.clientWidth > Constants.SIZE_EDITOR_WIDTH) {
      left = 96;
      right = 96;
    }
  }
  return {
    left,
    right,
    bottom,
    top: 16,
  };
};

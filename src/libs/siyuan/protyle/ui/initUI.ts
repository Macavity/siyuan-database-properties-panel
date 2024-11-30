/**
 * These functions are direct copies of not exposed functions from siyuan.
 * @source app/src/protyle/ui/initUI.ts
 */

import { Constants } from "siyuan/app/src/constants";
import { isMobile } from "siyuan/app/src/util/functions";

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

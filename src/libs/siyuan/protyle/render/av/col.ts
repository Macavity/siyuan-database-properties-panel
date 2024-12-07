/**
 * These functions are direct copies of not exposed functions from siyuan.
 * @source app/src/protyle/render/av/col.ts
 */
import { TAVCol } from "siyuan";

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

import { IAVCellValue } from "@/types/siyuan.types";

export function isEmpty(value: IAVCellValue): boolean {
  if (value === undefined || value === null) {
    return true;
  }

  const content = getContentByType(value);
  if (content === undefined || content === null) {
    return true;
  }

  if (typeof content === "string" && content.trim() === "") {
    return true;
  }

  if (value.type === "number") {
    return value.number?.isNotEmpty === false;
  }

  if (value.type === "date") {
    return value.date?.isNotEmpty === false;
  }

  if (value.type === "rollup") {
    return (content as IAVCellValue[]).length === 0;
  }

  return false;
}

export function getContentByType(value: IAVCellValue) {
  switch (value.type) {
    case "block":
      return value.block?.content;
    case "text":
      return value.text?.content;
    case "number":
      return value.number?.content;
    case "mSelect":
    case "select":
      return value.mSelect;
    case "mAsset":
      return value.mAsset;
    case "date":
      return value.date?.content;
    case "updated":
      return value.updated?.content;
    case "created":
      return value.created?.content;
    case "template":
      return value.template?.content;
    case "checkbox":
      return value.checkbox?.checked;
    case "relation":
      return value.relation?.contents;
    case "rollup":
      return value.rollup?.contents;
    case "url":
      return value.url?.content;
    case "phone":
      return value.phone?.content;
    case "email":
      return value.email?.content;
    default:
      return null;
  }
}

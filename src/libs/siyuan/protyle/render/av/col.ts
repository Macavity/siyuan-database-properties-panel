/**
 * These functions are direct copies of not exposed functions from siyuan.
 * @source app/src/protyle/render/av/col.ts
 */
import Col from "siyuan/app/src/protyle/render/av/col";
import { ExtendedTAVCol } from "@/types/siyuan.types";

export const getColIconByType = (type: ExtendedTAVCol) => {
  return Col.getColIconByType(type);
};

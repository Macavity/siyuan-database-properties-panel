/**
 * These functions are direct copies of not exposed functions from siyuan.
 * @source app/src/protyle/util/escape.ts
 */
import { escapeAttr as SiyuanEscapeAttr } from "@siyuan/app/util/escape";

export function escapeAttr(html: string) {
  return SiyuanEscapeAttr(html);
}

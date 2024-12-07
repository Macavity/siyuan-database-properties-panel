/**
 * These functions are direct copies of not exposed functions from siyuan.
 * @source app/src/protyle/util/escape.ts
 */
export const escapeAttr = (html: string) => {
  if (!html) {
    return html;
  }
  return html.replace(/"/g, "&quot;").replace(/'/g, "&apos;");
};

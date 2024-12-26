import { I18N } from "./i18n";
import { Protyle } from "siyuan";

export enum Context {
  BlockID = "blockId",
  Protyle = "protyle",
  I18N = "i18n",
}

declare module "svelte" {
  // Define overloaded signatures
  export function getContext(context: Context.BlockID): string;
  export function getContext(context: Context.Protyle): Protyle;
  export function getContext(context: Context.I18N): I18N;
}

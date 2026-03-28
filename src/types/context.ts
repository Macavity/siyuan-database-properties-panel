import type { InjectionKey } from "vue";
import type { Protyle } from "siyuan";

export const ProtyleKey: InjectionKey<Protyle> = Symbol("protyle");
export const BlockIDKey: InjectionKey<string> = Symbol("blockId");
export const RefreshCallbackKey: InjectionKey<(() => void) | undefined> = Symbol("refreshCallback");

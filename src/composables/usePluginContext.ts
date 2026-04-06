import { inject } from "vue";
import { ProtyleKey, BlockIDKey, RefreshCallbackKey } from "@/types/context";

export function usePluginContext() {
  const protyle = inject(ProtyleKey);
  const blockId = inject(BlockIDKey);
  const refreshCallback = inject(RefreshCallbackKey);

  if (!protyle) throw new Error("usePluginContext: protyle not provided");
  if (!blockId) throw new Error("usePluginContext: blockId not provided");

  // After the guards above, protyle and blockId are guaranteed non-undefined.
  // Use non-null assertions to narrow the return type for consumers.
  return {
    protyle: protyle!,
    blockId: blockId!,
    refreshCallback,
  };
}

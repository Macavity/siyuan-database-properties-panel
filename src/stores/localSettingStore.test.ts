import { describe, it, expect, beforeEach, vi } from "vitest";
import { settingsStore } from "./localSettingStore";
import { get } from "svelte/store";

describe("settingsStore", () => {
  const TEST_DOC_ID = "test-doc";

  beforeEach(() => {
    vi.resetAllMocks();
    // Reset the store
    settingsStore.setFromDTO({
      documentId: TEST_DOC_ID,
      isCollapsed: false,
      lastSelectedAttributeView: null,
      overrideShowEmptyAttributes: null,
    });
  });

  describe("toggleShowEmptyAttributes", () => {
    it("should toggle from null to opposite of global setting", () => {
      const globalSetting = true;

      settingsStore.toggleShowEmptyAttributes(TEST_DOC_ID, globalSetting);
      const state = get(settingsStore);
      const settings = state.get(TEST_DOC_ID);

      expect(settings?.overrideShowEmptyAttributes).toBe(false); // Should be opposite of global
    });

    it("should toggle from true to false", () => {
      // Set initial state to true
      settingsStore.setFromDTO({
        documentId: TEST_DOC_ID,
        isCollapsed: false,
        lastSelectedAttributeView: null,
        overrideShowEmptyAttributes: true,
      });

      settingsStore.toggleShowEmptyAttributes(TEST_DOC_ID);
      const state = get(settingsStore);
      const settings = state.get(TEST_DOC_ID);

      expect(settings?.overrideShowEmptyAttributes).toBe(false);
    });

    it("should toggle from false to true", () => {
      // Set initial state to false
      settingsStore.setFromDTO({
        documentId: TEST_DOC_ID,
        isCollapsed: false,
        lastSelectedAttributeView: null,
        overrideShowEmptyAttributes: false,
      });

      settingsStore.toggleShowEmptyAttributes(TEST_DOC_ID);
      const state = get(settingsStore);
      const settings = state.get(TEST_DOC_ID);

      expect(settings?.overrideShowEmptyAttributes).toBe(true);
    });
  });
});

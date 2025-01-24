import { describe, test, expect, beforeEach, vi } from "vitest";
import { settingsStore } from "@/stores/localSettingStore";
import { storageService } from "@/services/StorageService";

vi.mock("lodash/debounce", () => ({
  default: (fn: Function) => {
    let lastArgs: any[] | null = null;
    const debouncedFn = (...args: any[]) => {
      lastArgs = args;
      // Execute the function with the last set of arguments
      fn(...lastArgs);
    };
    // Add cancel method to match lodash's debounce interface
    debouncedFn.cancel = vi.fn();
    return debouncedFn;
  },
}));

describe("settingsStore", () => {
  const documentId = "test-doc-123";

  beforeEach(() => {
    vi.mock("@/services/LoggerService");
    beforeEach(() => {
      vi.clearAllMocks();
      // Reset the store to initial state
      settingsStore.destroy();

      // Mock the storage service
      vi.mock("@/services/StorageService", () => ({
        storageService: {
          saveSettings: vi.fn(),
        },
      }));
    });
  });

  test("getDocumentSettings returns default values for new document", () => {
    const settings = settingsStore.getDocumentSettings(documentId);
    expect(settings).toEqual({
      documentId,
      isCollapsed: false,
      lastSelectedAttributeView: null,
    });
  });

  test("activateTab updates lastSelectedAttributeView and uncollapse", () => {
    const tabId = "tab-1";
    settingsStore.activateTab(documentId, tabId);
    const settings = settingsStore.getDocumentSettings(documentId);

    expect(settings.lastSelectedAttributeView).toBe(tabId);
    expect(settings.isCollapsed).toBe(false);
  });

  test("toggleCollapsed switches collapse state", () => {
    settingsStore.toggleCollapsed(documentId);
    let settings = settingsStore.getDocumentSettings(documentId);
    expect(settings.isCollapsed).toBe(true);

    settingsStore.toggleCollapsed(documentId);
    settings = settingsStore.getDocumentSettings(documentId);
    expect(settings.isCollapsed).toBe(false);
  });

  test("setFromDTO updates store with provided settings", () => {
    const dto = {
      documentId,
      isCollapsed: true,
      lastSelectedAttributeView: "tab-2",
    };

    settingsStore.setFromDTO(dto);
    const settings = settingsStore.getDocumentSettings(documentId);

    expect(settings).toEqual({
      isCollapsed: true,
      lastSelectedAttributeView: "tab-2",
    });
  });
});

describe("settingsStore storage integration", () => {
  const documentId = "test-doc-123";

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
    // Mock the storage service
    vi.mock("@/services/StorageService", () => ({
      storageService: {
        saveSettings: vi.fn(),
      },
    }));
    // Enable fake timers
    vi.useFakeTimers();
  });

  afterEach(() => {
    // Restore timers after each test
    vi.useRealTimers();
  });

  test("changes are debounced and saved to storage", async () => {
    const mockSave = vi.spyOn(storageService, "saveSettings");

    settingsStore.activateTab(documentId, "tab-1");

    // Run all pending timers
    await vi.runAllTimersAsync();

    expect(mockSave).toHaveBeenCalledWith(
      expect.objectContaining({
        documentId,
        lastSelectedAttributeView: "tab-1",
        isCollapsed: false,
      }),
    );
  });
});

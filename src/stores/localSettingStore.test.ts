import { describe, test, expect, beforeEach, vi, afterEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useLocalSettingStore } from "@/stores/localSettingStore";
import { storageService } from "@/services/StorageService";

vi.mock("lodash/debounce", () => ({
  default: (fn: Function) => {
    const debouncedFn = (...args: any[]) => {
      fn(...args);
    };
    debouncedFn.cancel = vi.fn();
    return debouncedFn;
  },
}));

describe("localSettingStore", () => {
  const documentId = "test-doc-123";
  let settingsStore: ReturnType<typeof useLocalSettingStore>;

  beforeEach(() => {
    vi.mock("@/services/LoggerService");
    vi.mock("@/services/StorageService", () => ({
      storageService: {
        saveSettings: vi.fn(),
      },
    }));
    vi.clearAllMocks();
    setActivePinia(createPinia());
    settingsStore = useLocalSettingStore();
  });

  test("getDocumentSettings returns default values for new document", () => {
    const settings = settingsStore.getDocumentSettings(documentId);
    expect(settings).toEqual({
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

describe("localSettingStore storage integration", () => {
  const documentId = "test-doc-123";
  let settingsStore: ReturnType<typeof useLocalSettingStore>;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mock("@/services/StorageService", () => ({
      storageService: {
        saveSettings: vi.fn(),
      },
    }));
    vi.useFakeTimers();
    setActivePinia(createPinia());
    settingsStore = useLocalSettingStore();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("changes are debounced and saved to storage", async () => {
    const mockSave = vi.spyOn(storageService, "saveSettings");

    settingsStore.activateTab(documentId, "tab-1");

    await vi.runAllTimersAsync();

    expect(mockSave).toHaveBeenCalledWith(
      expect.objectContaining({
        documentId,
        lastSelectedAttributeView: "tab-1",
        isCollapsed: false,
      })
    );
  });
});

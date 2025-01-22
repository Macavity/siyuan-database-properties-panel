import { vi } from "vitest";

// All mocks must be defined before imports
vi.mock("@/stores/localSettingStore", () => {
  const state = new Map();
  state.set("test-block-id", { isCollapsed: false });

  return {
    settingsStore: {
      subscribe: vi.fn((callback) => {
        callback(state);
        return () => {};
      }),
      get: vi.fn((blockId) => ({
        isCollapsed: false,
        lastSelectedAttributeView: null,
      })),
      activateTab: vi.fn(),
      toggleCollapsed: vi.fn(),
    },
  };
});

vi.mock("@/components/ui/Icon.svelte", () => ({
  default: vi.fn().mockImplementation(() => ({
    $$render: () => '<div class="mock-icon"></div>',
  })),
}));

vi.mock("./components/AttributeViewPanel.svelte", async () => ({
  default: (await import("./test/mocks/AttributeViewPanel.svelte")).default,
}));

vi.mock("./components/AttributeViewPanelNative.svelte", async () => ({
  default: (await import("./test/mocks/AttributeViewPanelNative.svelte"))
    .default,
}));

vi.mock("@/components/ProtyleBreadcrumb.svelte", async () => ({
  default: (await import("./test/mocks/ProtyleBreadcrumb.svelte")).default,
}));

// Regular imports after all mocks
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/svelte";
import PluginPanel from "./PluginPanel.svelte";
import { writable } from "svelte/store";

describe("PluginPanel", () => {
  const mockProtyle = {
    // Add minimum required protyle properties
    options: {},
    breadcrumb: { render: vi.fn() },
  };

  const mockProps = {
    i18n: {},
    protyle: mockProtyle,
    blockId: "test-block-id",
    avData: [
      { avID: "av1", avName: "Database 1" },
      { avID: "av2", avName: "Database 2" },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders without crashing", () => {
    const { container } = render(PluginPanel, mockProps);
    expect(container.querySelector(".plugin-panel")).toBeTruthy();
  });

  it("renders all database items in breadcrumb", async () => {
    const { settingsStore } = vi.mocked(
      await import("@/stores/localSettingStore")
    );
    settingsStore.get.mockReturnValue({
      isCollapsed: false,
      lastSelectedAttributeView: null,
    });

    const { container } = render(PluginPanel, mockProps);
    const items = container.querySelectorAll(".protyle-breadcrumb__item");
    expect(items.length).toBe(2);
    expect(items[0].textContent).toContain("Database 1");
    expect(items[1].textContent).toContain("Database 2");
  });

  it("calls activateTab when clicking a database item", async () => {
    const { settingsStore } = vi.mocked(
      await import("@/stores/localSettingStore")
    );
    settingsStore.get.mockReturnValue({
      isCollapsed: false,
      lastSelectedAttributeView: null,
    });

    const { container } = render(PluginPanel, mockProps);
    const firstItem = container.querySelector(".protyle-breadcrumb__item");
    await fireEvent.click(firstItem!);

    expect(settingsStore.activateTab).toHaveBeenCalledWith(
      "test-block-id",
      "av1"
    );
  });

  it("does not render AttributeViewPanel when collapsed", async () => {
    const { settingsStore } = vi.mocked(
      await import("@/stores/localSettingStore")
    );
    settingsStore.get.mockReturnValue({
      isCollapsed: true,
      lastSelectedAttributeView: null,
    });
    settingsStore.subscribe.mockImplementation((callback) => {
      callback(new Map([["test-block-id", { isCollapsed: true }]]));
      return () => {};
    });

    const { container } = render(PluginPanel, mockProps);
    expect(container.querySelector(".attribute-view-panel")).toBeNull();
  });
});

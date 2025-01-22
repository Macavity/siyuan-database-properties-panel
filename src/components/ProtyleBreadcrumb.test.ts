import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, fireEvent } from "@testing-library/svelte";
import ProtyleBreadcrumb from "./ProtyleBreadcrumb.svelte";
import { settingsStore } from "@/stores/localSettingStore";
import { setContext } from "svelte";
import { Context } from "@/types/context";

const TEST_DOC_ID = "test-doc";

// Mock the store
vi.mock("@/stores/localSettingStore", () => ({
  settingsStore: {
    subscribe: vi.fn((callback) => {
      const state = new Map([
        [
          TEST_DOC_ID,
          {
            isCollapsed: false,
            lastSelectedAttributeView: null,
            overrideShowEmptyAttributes: null,
          },
        ],
      ]);
      callback(state);
      return () => {}; // Unsubscribe function
    }),
    get: vi.fn((docId) => ({
      isCollapsed: false,
      lastSelectedAttributeView: null,
      overrideShowEmptyAttributes: null,
    })),
    toggleShowEmptyAttributes: vi.fn(),
    toggleCollapsed: vi.fn(),
  },
}));

describe("ProtyleBreadcrumb", () => {
  const mockI18n = {
    expand: "Expand",
    collapse: "Collapse",
    showEmptyAttributes: "Show Empty",
    hideEmptyAttributes: "Hide Empty",
  };

  beforeEach(() => {
    vi.resetAllMocks();
    // Mock the store's initial state
    const mockSettings = {
      isCollapsed: false,
      lastSelectedAttributeView: null,
      overrideShowEmptyAttributes: null,
    };
    settingsStore.get.mockReturnValue(mockSettings);

    // Reset subscribe mock but maintain the implementation
    vi.mocked(settingsStore.subscribe).mockImplementation((callback) => {
      const state = new Map([[TEST_DOC_ID, mockSettings]]);
      callback(state);
      return () => {};
    });
  });

  it("should show eye-off icon when showEmptyAttributes is false", () => {
    const { container } = render(
      ProtyleBreadcrumb,
      {
        props: {},
      },
      {
        context: new Map([
          [Context.I18N, mockI18n],
          [Context.BlockID, TEST_DOC_ID],
          [Context.ShowEmptyAttributes, false],
        ]),
      }
    );

    const eyeOffIcon = container.querySelector("use[href='#iconEyeoff']");
    expect(eyeOffIcon).toBeTruthy();
  });

  //   it("should show eye icon when showEmptyAttributes is true", () => {
  //     const { container } = render(
  //       ProtyleBreadcrumb,
  //       {
  //         props: {},
  //       },
  //       {
  //         context: new Map([
  //           [Context.I18N, mockI18n],
  //           [Context.BlockID, TEST_DOC_ID],
  //           [Context.ShowEmptyAttributes, true],
  //         ]),
  //       }
  //     );

  //     const eyeIcon = container.querySelector("use[href='#iconEye']");
  //     expect(eyeIcon).toBeTruthy();
  //   });

  //   it("should use override value when available", () => {
  //     const mockSettings = {
  //       isCollapsed: false,
  //       lastSelectedAttributeView: null,
  //       overrideShowEmptyAttributes: true,
  //     };
  //     settingsStore.get.mockReturnValue(mockSettings);
  //     vi.mocked(settingsStore.subscribe).mockImplementation((callback) => {
  //       const state = new Map([[TEST_DOC_ID, mockSettings]]);
  //       callback(state);
  //       return () => {};
  //     });

  //     const { container } = render(
  //       ProtyleBreadcrumb,
  //       {
  //         props: {},
  //       },
  //       {
  //         context: new Map([
  //           [Context.I18N, mockI18n],
  //           [Context.BlockID, TEST_DOC_ID],
  //           [Context.ShowEmptyAttributes, false], // Global setting is false
  //         ]),
  //       }
  //     );

  //     const eyeIcon = container.querySelector("use[href='#iconEye']");
  //     expect(eyeIcon).toBeTruthy();
  //   });

  //   it("should call toggleShowEmptyAttributes when clicking the eye button", async () => {
  //     const { container } = render(
  //       ProtyleBreadcrumb,
  //       {
  //         props: {},
  //       },
  //       {
  //         context: new Map([
  //           [Context.I18N, mockI18n],
  //           [Context.BlockID, TEST_DOC_ID],
  //           [Context.ShowEmptyAttributes, false],
  //         ]),
  //       }
  //     );

  //     const button = container.querySelector("button");
  //     await fireEvent.click(button!);

  //     expect(settingsStore.toggleShowEmptyAttributes).toHaveBeenCalledWith(
  //       TEST_DOC_ID,
  //       false
  //     );
  //   });
});

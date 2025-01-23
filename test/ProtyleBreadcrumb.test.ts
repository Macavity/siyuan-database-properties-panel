import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@testing-library/svelte";

const TEST_DOC_ID = "test-doc";

// Mock the store
vi.mock("@/stores/localSettingStore", () => {
  const state = new Map();
  state.set("test-block-id", { isCollapsed: false });

  return {
    settingsStore: {
      subscribe: vi.fn((callback) => {
        callback(state);
        return () => {}; // Unsubscribe function
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

// Regular imports after all mocks
import ProtyleBreadcrumb from "../src/components/ProtyleBreadcrumb.svelte";

describe("ProtyleBreadcrumb", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

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

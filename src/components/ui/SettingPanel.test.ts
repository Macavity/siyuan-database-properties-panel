import { describe, it, expect } from "vitest";
import { render, fireEvent } from "@testing-library/vue";
import SettingPanel from "./SettingPanel.vue";

describe("SettingPanel", () => {
  const settingItems = [
    {
      key: "testCheckbox",
      value: false,
      type: "checkbox" as const,
      title: "Test Setting",
      description: "A test checkbox setting",
    },
  ];

  it("emits settingChange when a checkbox is toggled", async () => {
    const { emitted, container } = render(SettingPanel, {
      props: {
        group: "testGroup",
        settingItems,
      },
    });

    const checkbox = container.querySelector("input[type='checkbox']") as HTMLInputElement;
    expect(checkbox).toBeTruthy();
    expect(checkbox.checked).toBe(false);

    await fireEvent.click(checkbox);

    expect(emitted().settingChange).toBeTruthy();
    expect(emitted().settingChange[0]).toEqual(["testGroup", "testCheckbox", true]);
  });

  it("does not mutate the settingItems prop when a value changes", async () => {
    const items = [
      {
        key: "testCheckbox",
        value: false,
        type: "checkbox" as const,
        title: "Test Setting",
        description: "A test checkbox setting",
      },
    ];

    const { container } = render(SettingPanel, {
      props: {
        group: "testGroup",
        settingItems: items,
      },
    });

    const checkbox = container.querySelector("input[type='checkbox']") as HTMLInputElement;
    await fireEvent.click(checkbox);

    // The prop should not have been mutated
    expect(items[0].value).toBe(false);
  });

  it("hides content when display is false", () => {
    const { container } = render(SettingPanel, {
      props: {
        group: "testGroup",
        settingItems,
        display: false,
      },
    });

    const panel = container.querySelector(".config__tab-container");
    expect(panel).toHaveClass("fn__none");
  });
});

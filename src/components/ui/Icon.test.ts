import { describe, it, expect } from "vitest";
import { render } from "@testing-library/svelte";
import Icon from "./Icon.svelte";

describe("Icon", () => {
  it("renders without crashing", () => {
    const { container } = render(Icon, { props: { icon: "iconDatabase" } });
    expect(container.querySelector("svg")).toBeTruthy();
  });

  it("uses the correct icon reference", () => {
    const { container } = render(Icon, {
      props: { icon: "iconDatabase" },
    });
    const useElement = container.querySelector("use");
    expect(useElement?.getAttribute("xlink:href")).toBe("#iconDatabase");
  });

  it("applies additional class names when provided", () => {
    const { container } = render(Icon, {
      props: {
        icon: "iconTest",
        class: "custom-class",
      },
    });
    const iconElement = container.querySelector("svg");
    expect(iconElement?.classList.contains("custom-class")).toBeTruthy();
  });
});

import { render } from "@testing-library/svelte";
import CustomIcon from "../src/components/CustomIcon.svelte";
import { describe, it, expect } from "vitest";

describe("CustomIcon", () => {
  it("renders an image when unicode contains a dot", () => {
    const { container } = render(CustomIcon, {
      props: {
        unicode: "emoji.svg",
        className: "test-class",
        needSpan: false,
        lazy: false,
      },
    });

    const img = container.querySelector("img");
    expect(img).toBeTruthy();
    expect(img?.className).toBe("test-class");
    expect(img?.getAttribute("src")).toBe("/emojis/emoji.svg");
    expect(img?.getAttribute("alt")).toBe("Emoji");
  });

  it("renders a span with emoji when needSpan is true", () => {
    const { container } = render(CustomIcon, {
      props: {
        unicode: "1f600",
        className: "test-class",
        needSpan: true,
        lazy: false,
      },
    });

    // Wait for next tick to allow derived state to update
    return new Promise((resolve) => setTimeout(resolve, 0)).then(() => {
      const span = container.querySelector("span");
      expect(span).toBeTruthy();
      expect(span?.className).toBe("test-class");
      expect(span?.textContent).toBe("😀");
    });
  });

  it("renders emoji without span when needSpan is false", async () => {
    const { container } = render(CustomIcon, {
      props: {
        unicode: "1f600",
        className: "test-class",
        needSpan: false,
        lazy: false,
      },
    });

    // Wait for next tick to allow derived state to update
    await new Promise((resolve) => setTimeout(resolve, 0));
    const textContent = container.textContent?.trim();
    expect(textContent).toBe("😀");
  });

  it("renders lazy-loaded image when lazy is true", () => {
    const { container } = render(CustomIcon, {
      props: {
        unicode: "emoji.svg",
        className: "test-class",
        needSpan: false,
        lazy: true,
      },
    });

    const img = container.querySelector("img");
    expect(img).toBeTruthy();
    expect(img?.className).toBe("test-class");
    expect(img?.getAttribute("data-src")).toBe("/emojis/emoji.svg");
    expect(img?.getAttribute("src")).toBeNull();
  });

  it("handles compound unicode emojis", async () => {
    const { container } = render(CustomIcon, {
      props: {
        unicode: "1f468-1f3fb-200d-1f4bb",
        className: "test-class",
        needSpan: true,
      },
    });

    // Wait for next tick to allow derived state to update
    await new Promise((resolve) => setTimeout(resolve, 0));
    const span = container.querySelector("span");
    expect(span?.textContent).toBe("👨🏻‍💻");
  });

  it("handles empty unicode gracefully", async () => {
    const { container } = render(CustomIcon, {
      props: {
        unicode: "",
        className: "test-class",
        needSpan: true,
      },
    });

    // Wait for next tick to allow derived state to update
    await new Promise((resolve) => setTimeout(resolve, 0));
    const span = container.querySelector("span");
    expect(span?.textContent).toBe("");
  });

  it("handles invalid unicode gracefully", async () => {
    const { container } = render(CustomIcon, {
      props: {
        unicode: "invalid",
        className: "test-class",
        needSpan: true,
      },
    });

    // Wait for next tick to allow derived state to update
    await new Promise((resolve) => setTimeout(resolve, 0));
    const span = container.querySelector("span");
    expect(span?.textContent).toBe("");
  });
});

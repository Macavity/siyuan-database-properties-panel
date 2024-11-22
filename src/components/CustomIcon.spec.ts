import { render } from "@testing-library/svelte";
import CustomIcon from "./CustomIcon.svelte";
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
    expect(img).toBeInTheDocument();
    expect(img).toHaveClass("test-class");
    expect(img).toHaveAttribute("src", "/emojis/emoji.svg");
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

    const span = container.querySelector("span");
    expect(span).toBeInTheDocument();
    expect(span).toHaveClass("test-class");
    expect(span).toHaveTextContent("😀"); // Unicode for 😀 is 1f600
  });

  it("renders emoji without span when needSpan is false", () => {
    const { container } = render(CustomIcon, {
      props: {
        unicode: "1f600",
        className: "test-class",
        needSpan: false,
        lazy: false,
      },
    });

    expect(container).toHaveTextContent("😀"); // Unicode for 😀 is 1f600
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
    expect(img).toBeInTheDocument();
    expect(img).toHaveClass("test-class");
    expect(img).toHaveAttribute("data-src", "/emojis/emoji.svg");
    expect(img).not.toHaveAttribute("src");
  });
});

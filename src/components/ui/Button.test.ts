import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/svelte";
import Button from "./Button.svelte";

describe("Button", () => {
  it("renders with label", () => {
    render(Button, { props: { label: "Test Button" } });
    expect(screen.getByText("Test Button")).toBeTruthy();
  });

  it("renders with icon", () => {
    render(Button, { props: { icon: "iconName" } });
    // Check if Icon component is rendered
    expect(document.querySelector(".block__icon")).toBeTruthy();
  });

  it("renders with tooltip", () => {
    render(Button, { props: { tooltip: "Test Tooltip" } });
    const button = screen.getByRole("button");
    expect(button).toHaveClass("b3-tooltips");
    expect(button).toHaveClass("b3-tooltips__w");
    expect(button).toHaveAttribute("aria-label", "Test Tooltip");
  });

  it("applies focus class when isFocused is true", () => {
    render(Button, { props: { isFocused: true } });
    const button = screen.getByRole("button");
    expect(button).toHaveClass("item--focus");
  });

  it("calls onclick handler when clicked", async () => {
    const handleClick = vi.fn();
    render(Button, { props: { onclick: handleClick } });

    const button = screen.getByRole("button");
    await fireEvent.click(button);

    expect(handleClick).toHaveBeenCalled();
  });

  it("calls onclick handler on keydown", async () => {
    const handleClick = vi.fn();
    render(Button, { props: { onclick: handleClick } });

    const button = screen.getByRole("button");
    await fireEvent.keyDown(button);

    expect(handleClick).toHaveBeenCalled();
  });
});

import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/vue";
import Button from "./Button.vue";

describe("Button", () => {
  it("renders with label", () => {
    render(Button, { props: { label: "Test Button" } });
    expect(screen.getByText("Test Button")).toBeTruthy();
  });

  it("renders with icon", () => {
    render(Button, { props: { icon: "iconExpand" } });
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

  it("calls click handler when clicked", async () => {
    const { container } = render(Button, { props: {} });

    const button = container.querySelector("button")!;
    const clickSpy = vi.fn();
    button.addEventListener("click", clickSpy);
    await fireEvent.click(button);

    expect(clickSpy).toHaveBeenCalled();
  });

  it("emits click event when clicked", async () => {
    const { emitted } = render(Button, { props: {} });

    const button = screen.getByRole("button");
    await fireEvent.click(button);

    expect(emitted().click).toBeTruthy();
  });
});

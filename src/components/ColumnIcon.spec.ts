import { render } from "@testing-library/svelte";
import ColumnIcon from "./ColumnIcon.svelte";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";
import { TAVCol } from "siyuan";

describe("ColumnIcon", () => {
  it("renders CustomIcon when key.icon is provided", () => {
    const key = {
      id: "test",
      name: "Test Column",
      icon: "1f600",
      type: "text" as TAVCol,
    };

    const { container } = render(ColumnIcon, {
      props: { key },
    });

    const customIcon = container.querySelector(".block__logoicon");
    expect(customIcon).toBeInTheDocument();
    expect(customIcon.tagName).toBe("SPAN"); // CustomIcon renders a span when needSpan is true
  });

  it("renders default icon when key.icon is not provided", () => {
    const key = {
      id: "test",
      name: "Test Column",
      icon: "",
      type: "text" as TAVCol,
    };

    const { container } = render(ColumnIcon, {
      props: { key },
    });

    const svgIcon = container.querySelector("svg.block__logoicon");
    expect(svgIcon).toBeInTheDocument();
  });

  it("renders the column name", () => {
    const key = {
      id: "test",
      name: "Test Column",
      icon: "",
      type: "text" as TAVCol,
    };

    const { getByText } = render(ColumnIcon, {
      props: { key },
    });

    const columnName = getByText("Test Column");
    expect(columnName).toBeInTheDocument();
  });

  it("sets the correct aria-label", () => {
    const key = {
      id: "test",
      name: "Test Column",
      icon: "",
      type: "text" as TAVCol,
    };

    const { container } = render(ColumnIcon, {
      props: { key },
    });

    const div = container.querySelector(".block__logo");
    expect(div).toHaveAttribute("aria-label", "Test Column");
  });
});

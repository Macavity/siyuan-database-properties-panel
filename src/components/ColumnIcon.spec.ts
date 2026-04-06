import { render } from "@testing-library/vue";
import ColumnIcon from "./ColumnIcon.vue";
import { describe, it, expect } from "vitest";
import "@testing-library/jest-dom";
import { TAVCol } from "siyuan";

describe("ColumnIcon", () => {
  it("renders CustomIcon when avKey.icon is provided", () => {
    const avKey = {
      id: "test",
      name: "Test Column",
      icon: "1f600",
      type: "text" as TAVCol,
    };

    const { container } = render(ColumnIcon, {
      props: { avKey },
    });

    const customIcon = container.querySelector(".block__logoicon");
    expect(customIcon).toBeInTheDocument();
    expect(customIcon.tagName).toBe("SPAN"); // CustomIcon renders a span when needSpan is true
  });

  it("renders default icon when avKey.icon is not provided", () => {
    const avKey = {
      id: "test",
      name: "Test Column",
      icon: "",
      type: "text" as TAVCol,
    };

    const { container } = render(ColumnIcon, {
      props: { avKey },
    });

    const svgIcon = container.querySelector("svg.block__logoicon");
    expect(svgIcon).toBeInTheDocument();
  });

  it("renders the column name", () => {
    const avKey = {
      id: "test",
      name: "Test Column",
      icon: "",
      type: "text" as TAVCol,
    };

    const { getByText } = render(ColumnIcon, {
      props: { avKey },
    });

    const columnName = getByText("Test Column");
    expect(columnName).toBeInTheDocument();
  });

  it("sets the correct aria-label", () => {
    const avKey = {
      id: "test",
      name: "Test Column",
      icon: "",
      type: "text" as TAVCol,
    };

    const { container } = render(ColumnIcon, {
      props: { avKey },
    });

    const div = container.querySelector(".block__logo");
    expect(div).toHaveAttribute("aria-label", "Test Column");
  });
});

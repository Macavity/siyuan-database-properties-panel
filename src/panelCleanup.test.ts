import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { resolve } from "path";

const PANEL_PARENT_CLASS_SELECTOR = ".plugin-database-properties-wrapper";

/**
 * These tests validate the DOM cleanup logic for the plugin panel
 * using real DOM snapshots from SiYuan's search preview.
 *
 * Bug scenario: User searches for "Double Entry", clicks the document result
 * (panel renders correctly), then clicks a database result. The panel from
 * "Double Entry" should be hidden, not destroyed — because SiYuan doesn't
 * fire protyle events when navigating back to a previously loaded search
 * result, so a destroyed panel cannot be re-created.
 *
 * Fix: Listen to LOADED_PROTYLE_DYNAMIC (search preview fires this when
 * switching results), and hide non-matching panels instead of removing them.
 * When the user navigates back to "Double Entry", the hidden panel is shown
 * again without needing a new protyle event.
 */
describe("Panel cleanup in search preview", () => {
  function loadFixture(filename: string): Document {
    const html = readFileSync(resolve(__dirname, `../test/fixture/${filename}`), "utf-8");
    document.body.innerHTML = html;
    return document;
  }

  describe("bug fixture: Articles showing stale Double Entry panel", () => {
    it("has a stale panel from Double Entry inside the search preview protyle", () => {
      loadFixture("search-layout-bug.html");

      const protyleElement = document.querySelector("#searchPreview") as HTMLElement;
      expect(protyleElement).toBeTruthy();

      // The protyle is showing "Articles" (ld2jd2u)
      const titleNode = protyleElement.querySelector(
        'div[data-node-id="20241013072437-ld2jd2u"].protyle-title',
      );
      expect(titleNode).toBeTruthy();

      // But there's a stale panel from "Double Entry" (fnq84lb)
      const stalePanel = protyleElement.querySelector(PANEL_PARENT_CLASS_SELECTOR);
      expect(stalePanel).toBeTruthy();
      expect(stalePanel!.getAttribute("data-block-id")).toBe("20241012205349-fnq84lb");
    });

    it("finds the stale panel via protyleElement.querySelectorAll", () => {
      loadFixture("search-layout-bug.html");

      const protyleElement = document.querySelector("#searchPreview") as HTMLElement;
      const panels = protyleElement.querySelectorAll(PANEL_PARENT_CLASS_SELECTOR);

      expect(panels.length).toBe(1);
      expect(panels[0].getAttribute("data-block-id")).toBe("20241012205349-fnq84lb");
    });

    it("hides the stale panel instead of removing it when blockId does not match", () => {
      loadFixture("search-layout-bug.html");

      const protyleElement = document.querySelector("#searchPreview") as HTMLElement;
      const currentBlockId = "20241013072437-ld2jd2u"; // Articles

      // Simulate the hide/show cleanup logic from renderPanel
      const panels = protyleElement.querySelectorAll(PANEL_PARENT_CLASS_SELECTOR);
      let hasMatchingPanel = false;
      panels.forEach((panel) => {
        const panelBlockId = panel.getAttribute("data-block-id");
        if (panelBlockId === currentBlockId) {
          (panel as HTMLElement).style.display = "";
          hasMatchingPanel = true;
        } else {
          (panel as HTMLElement).style.display = "none";
        }
      });

      // No matching panel for Articles — the Double Entry panel is hidden
      expect(hasMatchingPanel).toBe(false);

      // Panel is still in DOM but hidden
      const hiddenPanel = protyleElement.querySelector(PANEL_PARENT_CLASS_SELECTOR) as HTMLElement;
      expect(hiddenPanel).toBeTruthy();
      expect(hiddenPanel.style.display).toBe("none");
    });

    it("re-shows the panel when navigating back to Double Entry", () => {
      loadFixture("search-layout-bug.html");

      const protyleElement = document.querySelector("#searchPreview") as HTMLElement;

      // First: hide the panel (simulating switch to Articles)
      const panels = protyleElement.querySelectorAll(PANEL_PARENT_CLASS_SELECTOR);
      panels.forEach((panel) => {
        (panel as HTMLElement).style.display = "none";
      });

      // Now: simulate navigating back to Double Entry
      const doubleEntryBlockId = "20241012205349-fnq84lb";
      const panelsAgain = protyleElement.querySelectorAll(PANEL_PARENT_CLASS_SELECTOR);
      let hasMatchingPanel = false;
      panelsAgain.forEach((panel) => {
        const panelBlockId = panel.getAttribute("data-block-id");
        if (panelBlockId === doubleEntryBlockId) {
          (panel as HTMLElement).style.display = "";
          hasMatchingPanel = true;
        } else {
          (panel as HTMLElement).style.display = "none";
        }
      });

      // Panel is found and shown again
      expect(hasMatchingPanel).toBe(true);
      const visiblePanel = protyleElement.querySelector(PANEL_PARENT_CLASS_SELECTOR) as HTMLElement;
      expect(visiblePanel.style.display).toBe("");
    });

    it("Articles has empty protyle-attr, so no new panel should be rendered", () => {
      loadFixture("search-layout-bug.html");

      const protyleElement = document.querySelector("#searchPreview") as HTMLElement;
      const newBlockId = "20241013072437-ld2jd2u"; // Articles

      const titleNode = protyleElement.querySelector(
        `div[data-node-id="${newBlockId}"].protyle-title`,
      );
      expect(titleNode).toBeTruthy();

      // Articles' protyle-attr is empty — no database association
      const protyleAttr = titleNode!.querySelector("div.protyle-attr");
      expect(protyleAttr).toBeTruthy();
      expect(protyleAttr!.firstChild).toBeNull();
    });
  });

  describe("working fixture: Double Entry correctly showing its panel", () => {
    it("panel belongs to the currently displayed document", () => {
      loadFixture("search-layout.html");

      const protyleElement = document.querySelector("#searchPreview") as HTMLElement;
      expect(protyleElement).toBeTruthy();

      const titleNode = protyleElement.querySelector(
        'div[data-node-id="20241012205349-fnq84lb"].protyle-title',
      );
      expect(titleNode).toBeTruthy();

      const panel = protyleElement.querySelector(PANEL_PARENT_CLASS_SELECTOR);
      expect(panel).toBeTruthy();
      expect(panel!.getAttribute("data-block-id")).toBe("20241012205349-fnq84lb");
    });

    it("Double Entry has non-empty protyle-attr, confirming database association", () => {
      loadFixture("search-layout.html");

      const protyleElement = document.querySelector("#searchPreview") as HTMLElement;
      const blockId = "20241012205349-fnq84lb";

      const titleNode = protyleElement.querySelector(
        `div[data-node-id="${blockId}"].protyle-title`,
      );
      const protyleAttr = titleNode!.querySelector("div.protyle-attr");
      expect(protyleAttr).toBeTruthy();
      expect(protyleAttr!.firstChild).not.toBeNull();
    });
  });
});

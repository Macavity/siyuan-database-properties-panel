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
 * "Double Entry" should be cleaned up, but wasn't because the search preview
 * fires LOADED_PROTYLE_DYNAMIC (not LOADED_PROTYLE_STATIC) when switching
 * results, so renderPanel was never called and no cleanup occurred.
 *
 * Fix: Listen to LOADED_PROTYLE_DYNAMIC and clean up panels unconditionally
 * at the start of renderPanel by querying protyleElement directly.
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

    it("cleanup via protyleElement.querySelectorAll finds and can remove the stale panel", () => {
      loadFixture("search-layout-bug.html");

      const protyleElement = document.querySelector("#searchPreview") as HTMLElement;
      const panels = protyleElement.querySelectorAll(PANEL_PARENT_CLASS_SELECTOR);

      expect(panels.length).toBe(1);
      expect(panels[0].getAttribute("data-block-id")).toBe("20241012205349-fnq84lb");

      // Simulate the cleanup: remove the panel
      panels.forEach((panel) => panel.remove());

      // Verify it's gone
      const remaining = protyleElement.querySelectorAll(PANEL_PARENT_CLASS_SELECTOR);
      expect(remaining.length).toBe(0);
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

      // getProtyleTopNode would return false here, which is correct —
      // no panel should be rendered for a non-database document.
      // The important thing is that stale panels were already cleaned up
      // before reaching this check.
    });
  });

  describe("working fixture: Double Entry correctly showing its panel", () => {
    it("panel belongs to the currently displayed document", () => {
      loadFixture("search-layout.html");

      const protyleElement = document.querySelector("#searchPreview") as HTMLElement;
      expect(protyleElement).toBeTruthy();

      // The protyle is showing "Double Entry" (fnq84lb)
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

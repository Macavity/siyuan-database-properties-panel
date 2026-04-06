import { test, expect } from "@playwright/test";
import { SiYuanPage } from "./pages/SiYuanPage";

test.describe("Floating window panel rendering", () => {
  let siyuan: SiYuanPage;

  test.beforeEach(async ({ page }) => {
    siyuan = new SiYuanPage(page);
    await siyuan.goto();
  });

  test("panel renders in floating window when same document is open in a tab", async () => {
    // Open "Double Entry" document in a tab via search
    await siyuan.openDocumentViaSearch("Double Entry");

    // Open "Books" database in a tab via search (becomes the active tab)
    await siyuan.openDocumentViaSearch("Books");

    // Hover over "Double Entry" row in the database to trigger the floating window
    await siyuan.hoverDatabaseRow("Double Entry");

    // Wait for the floating window to appear
    await expect(siyuan.getFloatingWindow()).toBeVisible({ timeout: 3000 });

    // The plugin panel should render inside the floating window
    await expect(siyuan.getFloatingWindowPanel()).toBeVisible({ timeout: 5000 });

    // Verify the panel has a block ID
    const blockId = await siyuan
      .getFloatingWindowPanel()
      .getAttribute("data-block-id");
    expect(blockId).toBeTruthy();
  });
});

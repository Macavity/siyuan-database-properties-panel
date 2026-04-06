import { test, expect } from "@playwright/test";
import { SearchPage } from "./pages/SearchPage";
import { SiYuanPage } from "./pages/SiYuanPage";

test.describe("Search preview panel cleanup", () => {
  let siyuan: SiYuanPage;
  let search: SearchPage;

  test.beforeEach(async ({ page }) => {
    siyuan = new SiYuanPage(page);
    search = new SearchPage(page);
    await siyuan.goto();
  });

  test("panel appears for a database document in search preview", async () => {
    await search.search("Double Entry");
    await search.clickResult(0);

    await expect(search.getPreviewPanel()).toBeVisible();

    await search.close();
  });

  test("panel is hidden when switching to a non-document search result", async () => {
    await search.search("Double Entry");

    // Click the document result to render the panel
    await search.clickResult(0);
    await expect(search.getPreviewPanel()).toBeVisible();

    // Click a database result (Articles)
    await search.clickResult(1);
    await expect(search.getPreviewPanel()).not.toBeVisible();

    await search.close();
  });

  test("panel re-appears when navigating back to the document result", async () => {
    await search.search("Double Entry");

    // Document → panel visible
    await search.clickResult(0);
    await expect(search.getPreviewPanel()).toBeVisible();

    // Database → panel hidden
    await search.clickResult(1);
    await expect(search.getPreviewPanel()).not.toBeVisible();

    // Back to document → panel visible again
    await search.clickResult(0);
    await expect(search.getPreviewPanel()).toBeVisible();

    await search.close();
  });

  test("panel is hidden for all database results", async () => {
    await search.search("Double Entry");

    // Click document first
    await search.clickResult(0);
    await expect(search.getPreviewPanel()).toBeVisible();

    // Click third result (Books database)
    await search.clickResult(2);
    await expect(search.getPreviewPanel()).not.toBeVisible();

    await search.close();
  });
});

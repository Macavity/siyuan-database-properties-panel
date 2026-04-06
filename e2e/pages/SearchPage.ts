import { type Page, type Locator, expect } from "@playwright/test";

/**
 * Page Object for SiYuan's global search dialog.
 *
 * The search dialog is opened via Cmd+P and contains:
 * - A search input (#searchInput) -- SiYuan built-in ID
 * - A list of results (#searchList) -- SiYuan built-in ID
 * - A preview pane (#searchPreview) -- SiYuan built-in ID
 */
export class SearchPage {
  readonly page: Page;
  readonly searchList: Locator;
  readonly searchPreview: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchList = page.locator("#searchList");
    this.searchPreview = page.locator("#searchPreview");
  }

  async open() {
    await this.page.keyboard.press("Meta+p");
    await expect(this.searchList).toBeVisible();
  }

  async close() {
    await this.page.keyboard.press("Escape");
    await expect(this.searchList).not.toBeVisible();
  }

  async search(query: string) {
    await this.open();
    await this.page.locator("#searchInput").fill(query);
    await expect(this.getResultItem(0)).toBeVisible();
  }

  /**
   * Returns the nth search result item (0-indexed).
   */
  getResultItem(index: number): Locator {
    return this.searchList.locator('[data-type="search-item"]').nth(index);
  }

  /**
   * Clicks on the nth search result and waits for the preview to finish loading.
   */
  async clickResult(index: number) {
    await this.getResultItem(index).click();
    await expect(this.searchPreview).toHaveAttribute("data-loading", "finished");
  }

  /**
   * Returns the plugin panel locator within the search preview.
   */
  getPreviewPanel(): Locator {
    return this.searchPreview.getByTestId("database-properties-panel");
  }
}

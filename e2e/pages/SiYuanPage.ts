import { type Page, type Locator, expect } from "@playwright/test";

/**
 * Page Object for common SiYuan workspace interactions.
 */
export class SiYuanPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto("/");
    await expect(this.page.locator(".layout__center")).toBeVisible();
  }

  /**
   * Opens a document by name via global search.
   * Searches for the document, then presses Enter to open it in a tab.
   */
  async openDocumentViaSearch(docName: string) {
    // Open global search
    await this.page.keyboard.press("Meta+p");
    const searchInput = this.page.locator("#searchInput");
    await expect(searchInput).toBeVisible();

    // Type the document name and wait for results
    await searchInput.fill(docName);
    const firstResult = this.page
      .locator('#searchList [data-type="search-item"]')
      .first();
    await expect(firstResult).toBeVisible();

    // Press Enter to open the document in a tab
    await searchInput.press("Enter");

    // Close the search dialog
    await this.page.keyboard.press("Escape");
    await expect(this.page.locator("#searchList")).not.toBeVisible({
      timeout: 3000,
    });
  }

  /**
   * Clicks on a tab in the main tab bar by its visible text.
   * Uses SiYuan's data-type attribute for the tab header.
   */
  async activateTab(tabName: string) {
    const tab = this.page
      .locator('[data-type="tab-header"]')
      .filter({ hasText: tabName })
      .first();
    await tab.click();
  }

  /**
   * Hovers over a cell in a database table to trigger a floating window.
   * Targets the primary key (block) column cells.
   */
  async hoverDatabaseRow(rowText: string) {
    const cell = this.page
      .locator('[data-dtype="block"] .av__celltext')
      .filter({ hasText: rowText })
      .first();
    await cell.hover();
  }

  /**
   * Returns the currently visible floating window (popover).
   */
  getFloatingWindow(): Locator {
    return this.page.locator(".block__popover--open");
  }

  /**
   * Returns the plugin panel locator within a floating window.
   */
  getFloatingWindowPanel(): Locator {
    return this.getFloatingWindow().getByTestId("database-properties-panel");
  }
}

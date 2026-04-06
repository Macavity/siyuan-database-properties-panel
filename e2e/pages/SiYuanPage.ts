import { type Page, type Locator, expect } from "@playwright/test";
import { SearchPage } from "./SearchPage";

/**
 * Page Object for common SiYuan workspace interactions.
 */
export class SiYuanPage {
  readonly page: Page;
  readonly search: SearchPage;

  constructor(page: Page) {
    this.page = page;
    this.search = new SearchPage(page);
  }

  async goto() {
    await this.page.goto("/");
    await expect(this.page.locator(".layout__center")).toBeVisible();
  }

  /**
   * Opens a document by name via global search.
   * Delegates to SearchPage to avoid duplicating search locator logic.
   */
  async openDocumentViaSearch(docName: string) {
    await this.search.openDocument(docName);
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
    return this.getFloatingWindow().getByTestId("database-properties__panel");
  }
}

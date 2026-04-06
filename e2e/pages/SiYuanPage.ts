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
   * Clicks on a tab in the main tab bar by its exact visible text.
   * Uses the top-level layout tab bar only (not plugin tab bars).
   */
  async activateTab(tabName: string) {
    // Target only SiYuan's main tab bar, not the plugin's LayoutTabBar component.
    // The main tabs live inside a .layout-tab-bar whose parent is NOT .layout-tab-bar-wrapper.
    const tab = this.page
      .locator(".fn__flex:not(.layout-tab-bar-wrapper) > .layout-tab-bar .item__text")
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

## E2E Testing with Playwright

These guidelines apply to all Playwright E2E tests in this project. Follow them strictly when generating, suggesting, or modifying test code.

---

### Selectors

**Use `getByTestId` for elements with translatable text.**
Elements whose visible text may be translated must be targeted via `data-testid` attributes. Use BEM notation for test ID values: `block__element--modifier` (e.g. `checkout__submit-btn`).

```ts
await page.getByTestId('checkout__submit-btn').click();
```

**Use `getByRole` for language-independent elements.**
For structural or semantic elements (icon buttons, form inputs, navigation), use `getByRole`. It tests accessibility implicitly and resolves the accessible name from text, `aria-label`, or `aria-labelledby`.

```ts
await page.getByRole('button', { name: 'Submit' }).click();
```

---

### Page Object Models (POM)

Encapsulate all reusable UI interactions in Page Object classes. Raw locator logic must not be duplicated across test files. If a selector changes, only the Page Object needs updating.

```ts
const checkoutPage = new CheckoutPage(page);
await checkoutPage.addToCart(product);
```

---

### Assertions — Web-First Only

Always use Playwright's async `expect` matchers. They automatically wait and retry until the condition is met or the timeout is exceeded.

```ts
await expect(page.getByTestId('success-msg')).toBeVisible();
```

---

### Waiting

Never use `page.waitForTimeout()`. Wait for specific network responses or rely on Playwright's built-in actionability checks, which auto-wait before interacting with elements.

```ts
await page.waitForResponse(
  response => response.url().includes('/api/cart') && response.status() === 200
);
await page.getByRole('button', { name: 'Checkout' }).click(); // auto-waits
```

---

### Test Isolation

Every test must be fully independent and runnable in parallel. Tests must not share mutable state or depend on execution order.

---

### Mobile Testing

Test critical user journeys at mobile viewports using Playwright device emulation. Do not assume desktop selectors are visible on mobile — account for mobile-specific navigation patterns (e.g. hamburger menu). Playwright automatically dispatches touch events in a mobile device context.

```ts
import { test, devices } from '@playwright/test';
test.use(devices['iPhone 13']);
```

---

### Scope of E2E Tests

E2E tests are not exclusively UI tests. A sequence of API calls covering a full business process is a valid E2E test. Prefer API-based E2E for non-critical paths — they are faster and less flaky. Reserve UI E2E for critical user journeys only.

---

### Anti-patterns to avoid

- CSS class selectors (`.checkout-flyer-button`, `div > span > .btn-primary`) — break when styling changes. **Exception:** SiYuan's own structural classes (e.g. `.layout__center`, `.block__popover--open`, `.av__celltext`) are acceptable when no stable `data-*` attribute exists, since we don't control the host app's DOM.
- Text-based selectors for translated content (`hasText: 'Kaufen'`) — break across locales
- Regex multi-locale text selectors (`/Kaufen|Buy Now|Acquista/`) — not a reliable fallback
- `page.waitForTimeout()` — makes tests slow and remains flaky under load
- Synchronous `isVisible()` checks in assertions — evaluates instantly without retry
- UI login in `beforeEach` — slow, flaky, and causes unrelated tests to fail if the login flow breaks
- Raw locator logic duplicated across test files — use Page Objects instead

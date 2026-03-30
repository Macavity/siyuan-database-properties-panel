# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SiYuan Database Properties Panel is a plugin for SiYuan Note that displays database row attributes directly on pages created from database rows.

## Commands

```bash
bun dev               # Watch mode development build with livereload
bun run build         # Production build
bun run test          # Run tests (Vitest)
bun run lint          # ESLint check
bun run lint:fix      # Prettier code formatting
bun run make-link     # Create dev symlink to SiYuan plugins directory (macOS/Linux)
bun run make-link-win # Create dev symlink (Windows)
```

## Architecture

### Entry Point & Plugin Lifecycle

- `src/index.ts` - Main plugin class extending SiYuan's `Plugin`. Handles lifecycle, settings, and protyle event listeners (LOADED_PROTYLE_STATIC, SWITCH_PROTYLE, WS_MAIN). Manages multiple Vue app instances via `createApp()` (one per block in a `Map<string, App>`).

### Component Hierarchy

- `PluginPanel.vue` — Root component. Provides context via `provide()` (ProtyleKey, BlockIDKey, RefreshCallbackKey). Conditionally renders one of two panel variants based on the `allowEditing` prop:
  - `AttributeViewPanel.vue` — Read-only custom rendering (when `allowEditing` is false). Uses `AttributeViewValue.vue` and `ValueTypes/*` renderers.
  - `AttributeViewPanelNative.vue` — Native SiYuan editing via `protyle.renderAVAttribute()` (when `allowEditing` is true).
  - Both panels use `LayoutTabBar.vue` for tab switching.
- `AttributeViewService.ts` — Dynamically mounts `CollapseButton`, `RefreshButton`, and `ShowEmptyAttributesToggle` via `createApp()` into the DOM.
- `PluginConfig.vue` — Settings dialog, mounted as a separate Vue app instance. Contains `DatabaseColumnSettings.vue`.

### State Management

- `src/stores/index.ts` - Pinia instance creation
- `src/stores/configStore.ts` - Plugin configuration (showPrimaryKey, showEmptyAttributes, etc.)
- `src/stores/localSettingStore.ts` - Per-document tab/collapse state
- `src/stores/documentSettingsStore.ts` - Document-specific attribute view settings
- `src/stores/i18nStore.ts` - Internationalization strings
- `src/composables/usePluginContext.ts` - Wraps `inject()` for accessing provided context (ProtyleKey, BlockIDKey, RefreshCallbackKey)

### Services

- `src/services/LoggerService.ts` - Structured logging with levels, Sentry integration
- `src/services/AttributeViewService.ts` - AV data fetching/processing, DOM manipulation for both panel variants
- `src/services/StorageService.ts` - Plugin storage management

### Important Patterns

- **Shared panel logic:** Any logic duplicated between `AttributeViewPanel.vue` and `AttributeViewPanelNative.vue` should be extracted to `AttributeViewService.ts`
- **Global styles:** Plugin-wide CSS classes go in `src/index.scss` (e.g., `.av-panel-row--align-left`, `.dpp-av-panel--hidden`)
- **Adding settings:** New plugin settings require updates to:
  1. `src/stores/configStore.ts` - Add to `PluginSetting`, `PluginConfigDTO`, and `defaultConfig`
  2. `public/i18n/*.json` - Add translation keys
  3. `src/components/PluginConfig.vue` - Add to appropriate settings group

### API

- `src/api.ts` - SiYuan API wrapper around `fetchSyncPost`/`fetchPost`

## Vue 3 Conventions (Critical)

- Use Composition API with `<script setup>` exclusively - no Options API
- Use `defineProps`, `defineEmits`, and `withDefaults` for component interfaces
- Component mounting: Use `createApp()` from 'vue' for dynamic mounting
- State: Use Pinia composition-API style stores (`ref()`, `reactive()`, exported functions)

## Coding Patterns

- **I18n:** Use `i18nStore` or `plugin.i18n` for localized strings
- **Logging:** Use `LoggerService` instead of `console.log`
- **Icons:** Import from `src/libs/icons.ts` or use SiYuan's SVG symbols
- **SQL queries:** Use `sql()` from `src/api.ts` targeting the `blocks` table
- **Block IDs:** SiYuan uses 22-char IDs - always preserve them
- **Styling:** Use SiYuan's CSS utility classes
- **TypeScript:** Prefer interfaces to types; avoid enums, use const objects

## File Naming

- Component files: PascalCase (`AuthForm.vue`)
- Component names in imports: PascalCase
- Variables and functions: camelCase
- Path aliases: `@/*` → `./src/*`

## Git Conventions

Use **Conventional Commits** with **gitmoji** prefixes:

```
🐛 fix: resolve panel not rendering on empty databases
✨ feat: add column visibility toggle
🔧 chore: update dependencies
♻️ refactor: extract shared panel logic to service
🎨 style: align property labels consistently
📝 docs: update README with new build instructions
✅ test: add coverage for date value renderer
```

Common gitmoji:

- ✨ `feat` — new feature
- 🐛 `fix` — bug fix
- ♻️ `refactor` — code restructuring
- 🔧 `chore` — maintenance, config, dependencies
- 📝 `docs` — documentation
- 🎨 `style` — formatting, CSS
- ✅ `test` — adding or updating tests
- 🔀 merge commits

**Branching:** Always branch from `develop`, not `main`.

## Testing

- Framework: Vitest with jsdom environment
- Tests colocated with source files (`.test.ts`, `.spec.ts`)
- Test utilities: `@vue/test-utils`, `@testing-library/vue`, `@pinia/testing`
- Mocks: `test/mocks/` directory for SiYuan SDK and component mocks
- Setup file: `test/setupTests.ts`

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SiYuan Database Properties Panel is a plugin for SiYuan Note that displays database row attributes directly on pages created from database rows.

## Commands

```bash
pnpm build            # Production build
pnpm test             # Run tests (Vitest)
pnpm lint             # ESLint check
pnpm lint:fix         # Prettier code formatting
```

## Architecture

### Entry Point & Plugin Lifecycle
- `src/index.ts` - Main plugin class extending SiYuan's `Plugin`. Handles lifecycle, settings, and protyle event listeners (LOADED_PROTYLE, switch). Dynamically mounts the Svelte panel.

### Component Hierarchy
```
PluginPanel.svelte              # Root - context setup, layout, collapse state
├── AttributeViewPanel.svelte   # Read-only properties display
│   └── ValueTypes/*            # Type-specific renderers (DateValue, TextValue, etc.)
└── AttributeViewPanelNative.svelte  # Native editing variant
```

### State Management
- `src/stores/configStore.ts` - Plugin configuration (showPrimaryKey, showEmptyAttributes, etc.)
- `src/stores/localSettingStore.ts` - Per-document tab/collapse state
- `src/stores/i18nStore.ts` - Internationalization strings
- Uses Svelte context API for passing data to child components

### Services
- `src/services/LoggerService.ts` - Structured logging with levels, Sentry integration
- `src/services/AttributeViewService.ts` - AV data fetching/processing, DOM manipulation for both panel variants
- `src/services/StorageService.ts` - Plugin storage management

### Important Patterns
- **Shared panel logic:** Any logic duplicated between `AttributeViewPanel.svelte` and `AttributeViewPanelNative.svelte` should be extracted to `AttributeViewService.ts`
- **Global styles:** Plugin-wide CSS classes go in `src/index.scss` (e.g., `.av-panel-row--align-left`, `.dpp-av-panel--hidden`)
- **Adding settings:** New plugin settings require updates to:
  1. `src/stores/configStore.ts` - Add to `PluginSetting`, `PluginConfigDTO`, and `defaultConfig`
  2. `public/i18n/*.json` - Add translation keys
  3. `src/components/PluginConfig.svelte` - Add to appropriate settings group

### API
- `src/api.ts` - SiYuan API wrapper around `fetchSyncPost`/`fetchPost`

## Svelte 5 Conventions (Critical)

* Use Svelte 5 runes exclusively - no legacy syntax:
* Events: Use native HTML attributes (`onclick`, `onkeydown`), NOT `on:click`.
* Component mounting: Use `mount()` from 'svelte' for dynamic mounting.

## Coding Patterns

- **I18n:** Use `i18nStore` or `plugin.i18n` for localized strings
- **Logging:** Use `LoggerService` instead of `console.log`
- **Icons:** Import from `src/libs/icons.ts` or use SiYuan's SVG symbols
- **SQL queries:** Use `sql()` from `src/api.ts` targeting the `blocks` table
- **Block IDs:** SiYuan uses 22-char IDs - always preserve them
- **Styling:** Use SiYuan's CSS utility classes
- **TypeScript:** Prefer interfaces to types; avoid enums, use const objects

## File Naming

- Component files: lowercase with hyphens (`auth-form.svelte`)
- Component names in imports: PascalCase
- Variables and functions: camelCase
- Path aliases: `@/*` → `./src/*`

## Testing

- Framework: Vitest with jsdom environment
- Tests colocated with source files (`.test.ts`, `.spec.ts`)
- Test utilities: @testing-library/svelte
- Mocks: `src/test/mocks/siyuan.ts` for SiYuan SDK

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SiYuan Database Properties Panel is a plugin for SiYuan Note that displays database row attributes directly on pages created from database rows. It provides a familiar interface similar to Notion and Anytype.

## Commands

```bash
pnpm dev              # Watch mode development build with livereload
pnpm build            # Production build
pnpm test             # Run tests (Vitest)
pnpm lint             # ESLint check
pnpm make-link        # Create dev symlink to SiYuan plugins directory (macOS/Linux)
pnpm make-link-win    # Create dev symlink (Windows)
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
- `src/services/AttributeViewService.ts` - AV data fetching/processing
- `src/services/StorageService.ts` - Plugin storage management

### API
- `src/api.ts` - SiYuan API wrapper around `fetchSyncPost`/`fetchPost`

## Svelte 5 Conventions (Critical)

**Use Svelte 5 runes exclusively - no legacy syntax:**
```typescript
let count = $state(0);                    // State
let double = $derived(count * 2);         // Derived
let { prop1, prop2 }: Props = $props();   // Props
$effect(() => { /* reactive code */ });   // Effects
```

**Events:** Use native HTML attributes (`onclick`, `onkeydown`), NOT `on:click`.

**Component mounting:** Use `mount()` from 'svelte' for dynamic mounting.

## Coding Patterns

- **I18n:** Use `i18nStore` or `plugin.i18n` for localized strings
- **Logging:** Use `LoggerService` instead of `console.log`
- **Icons:** Import from `src/libs/icons.ts` or use SiYuan's SVG symbols
- **SQL queries:** Use `sql()` from `src/api.ts` targeting the `blocks` table
- **Block IDs:** SiYuan uses 22-char IDs - always preserve them
- **Styling:** Use SiYuan's CSS utility classes
- **TypeScript:** Prefer interfaces over types; avoid enums, use const objects

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

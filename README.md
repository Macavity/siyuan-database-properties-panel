# Database Properties Panel Plugin

[中文版](./README.zh_CN.md)
[Changelog](./CHANGELOG.md)

## Overview

The SiYuan Database Properties Panel plugin enhances your SiYuan experience by enabling a feature commonly found in similar tools.
It's heavily inspired by the now archived and no longer maintained [SiYuan-Attributes-Panel](https://github.com/TransMux/SiYuan-Attributes-Panel/).
This plugin allows users to view database row attributes directly on the dedicated pages created from those rows.

## Changes in last release

### [1.8.0](https://github.com/Macavity/siyuan-database-properties-panel/releases/tag/v1.8.0)

- 🇺🇸 Add "Hide in Spaced Repetition" setting to prevent the properties panel from spoiling flashcard answers (enabled by default)

## Features

- Attribute Display: Automatically display and edit database row attributes on their corresponding pages
- Familiar Interface: Provides a user experience similar to popular note-taking applications like Notion and Anytype while keeping the design of SiYuan
- Allow optionally to hide the primary key
- Allow optionally to hide empty fields
- Column Visibility Control: Configure which columns are visible on a per-database basis

## Demo

https://github.com/user-attachments/assets/5e27f269-4569-4bed-81c8-8bc69b70f514

## Data Security Statement

Out of absolute importance to data security, this plugin hereby declares that all APIs used by the plugin, and the code is completely open source (uncompiled and not confused), everyone is welcome to report security issues

This plugin depends on the following APIs:

- `/api/av/getAttributeViewKeys`: This parameter is used to obtain existing attributes through the new attribute-view

## Plugin permissions

About data: The modification of your data by this plug-in is limited to the specified modification of the properties of the specified block according to the user's instructions under the user's operation, and will not modify anything else
About UI: The user interface changes are limited to adding a properties panel under the document title, and have no effect on the rest of the section
About networking: This plug-in is completely local and does not include any extranet communication, except when error reporting is explicitly enabled by the user in settings (which sends anonymized error reports to Sentry for debugging purposes)

## Development

### Building the Plugin

```bash
# Development build with live reload
pnpm dev

# Production build
pnpm build

# Build and install to local SiYuan workspace
pnpm build:install         # Production build + install
pnpm build:install:dev     # Development build + install
```

### Sentry Integration (Optional)

To enable error reporting in your builds (for developers only):

1. Copy `.env.example` to `.env`
2. Add your Sentry DSN to `.env`:
   ```
   SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
   ```
3. Build the plugin:
   ```bash
   pnpm build
   ```

If SENTRY_DSN is set at build time, error reporting will be enabled in that build. Marketplace builds without SENTRY_DSN will have no error reporting. This is intentional - only developers building their own versions should have Sentry enabled.

## Support & Feedback

Please use Github issues to submit bugs or request features.

# Database Properties Panel Plugin

[中文版](./README.zh_CN.md)
[Changelog](./CHANGELOG.md)

## Overview

The SiYuan Database Properties Panel plugin enhances your SiYuan experience by enabling a feature commonly found in similar tools.
It's heavily inspired by the now archived and no longer maintained [SiYuan-Attributes-Panel](https://github.com/TransMux/SiYuan-Attributes-Panel/).
This plugin allows users to view database row attributes directly on the dedicated pages created from those rows.

## Changes in last release

### [1.3.1](https://github.com/Macavity/siyuan-database-properties-panel/releases/tag/v1.3.1)

- 🇺🇸 fix the datetime stamp of the local files

### [1.3.0](https://github.com/Macavity/siyuan-database-properties-panel/releases/tag/v1.3.0)

- 🇺🇸 Hide database name when there is only one database
- 🇺🇸 Overall layout adjustments to reduce used space
- 🇺🇸 Fix bug which might have shown the panel although no databases are visible

## Features

- Attribute Display: Automatically display and edit database row attributes on their corresponding pages
- Familiar Interface: Provides a user experience similar to popular note-taking applications like Notion and Anytype while keeping the design of SiYuan
- Allow optionally to hide the primary key
- Allow optionally to hide empty fields

## Data Security Statement

Out of absolute importance to data security, this plugin hereby declares that all APIs used by the plugin, and the code is completely open source (uncompiled and not confused), everyone is welcome to report security issues

This plugin depends on the following APIs:

- `/api/av/getAttributeViewKeys`: This parameter is used to obtain existing attributes through the new attribute-view

## Plugin permissions

About data: The modification of your data by this plug-in is limited to the specified modification of the properties of the specified block according to the user's instructions under the user's operation, and will not modify anything else
About UI: The user interface changes are limited to adding a properties panel under the document title, and have no effect on the rest of the section
About networking: This plug-in is completely local and does not include any extranet communication

## Support & Feedback

Please use Github issues to submit bugs or request features.

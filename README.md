# Database Properties Panel Plugin

[中文版](./README.zh_CN.md)
[Changelog](./CHANGELOG.md)

## Overview

The SiYuan Database Properties Panel plugin enhances your SiYuan experience by enabling a feature commonly found in similar tools.
It's heavily inspired by the now archived and no longer maintained [SiYuan-Attributes-Panel](https://github.com/TransMux/SiYuan-Attributes-Panel/).
This plugin allows users to view database row attributes directly on the dedicated pages created from those rows.

## Changes in last release

## [1.1.0](https://github.com/Macavity/siyuan-database-properties-panel/releases/tag/v1.1.0)

- Adds toggle which allows to hide the database properties panel for a document. This setting is stored per document.
- Adds a tabbed layout to reduce used space for the panel (requires SiYuan >=3.0.17)
- Removed setting to disable editing as it works well.

## Features

- Attribute Display: Automatically display and edit database row attributes on their corresponding pages
- Familiar Interface: Provides a user experience similar to popular note-taking applications like Notion and Anytype while keeping the design of SiYuan
- Allow optionally to hide the primary key
- Allow optionally to hide empty fields

## Limitations

Editing attributes on the page is now supported.
~~Currently, the plugin only supports the display of attributes on the page created from the database row.
Adjusting the attributes directly from the page is not yet supported.~~

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

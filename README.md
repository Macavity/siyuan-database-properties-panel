# Database Properties Panel Plugin

[中文版](./README.zh_CN.md)
[Changelog](./CHANGELOG.md)

## Overview

The SiYuan Database Properties Panel plugin enhances your SiYuan experience by enabling a feature commonly found in similar tools.
It's heavily inspired by the now archived and no longer maintained [SiYuan-Attributes-Panel](https://github.com/TransMux/SiYuan-Attributes-Panel/).
This plugin allows users to view database row attributes directly on the dedicated pages created from those rows.

## Changes in last release

### [1.2.0](https://github.com/Macavity/siyuan-database-properties-panel/releases/tag/v1.2.0)

- 🇺🇸 Add a toggle to show/hide empty attributes on a per-document basis.
- 🇺🇸 Add a button to add new attributes to the database
- 🇨🇳 添加切换功能，可按文档显示/隐藏空属性。
- 🇨🇳 添加按钮，用于向数据库添加新属性


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

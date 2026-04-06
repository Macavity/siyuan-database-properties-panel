# Database Properties Panel Plugin - Changelog

[Changelog](./CHANGELOG.md)

### [1.8.1](https://github.com/Macavity/siyuan-database-properties-panel/releases/tag/v1.8.1)

- 🇺🇸 Fix properties panel not appearing in floating windows when the same document is already open in a tab
- 🇨🇳 修复当同一文档已在标签页中打开时，浮动窗口中不显示属性面板的问题

### [1.8.0](https://github.com/Macavity/siyuan-database-properties-panel/releases/tag/v1.8.0)

- 🇺🇸 Add "Hide in Spaced Repetition" setting to prevent the properties panel from spoiling flashcard answers (enabled by default) ([#88](https://github.com/Macavity/siyuan-database-properties-panel/issues/88))
- 🇺🇸 Fix column visibility settings not showing columns for kanban and card view databases ([#89](https://github.com/Macavity/siyuan-database-properties-panel/issues/89))
- 🇨🇳 添加"在间隔重复中隐藏"设置，防止属性面板在复习闪卡时剧透答案（默认启用）([#88](https://github.com/Macavity/siyuan-database-properties-panel/issues/88))
- 🇨🇳 修复列可见性设置不显示看板和卡片视图数据库的列的问题 ([#89](https://github.com/Macavity/siyuan-database-properties-panel/issues/89))

### [1.7.2](https://github.com/Macavity/siyuan-database-properties-panel/releases/tag/v1.7.2)

- 🇺🇸 Add user-accessible Debug tab in settings (no longer requires developer builds)
- 🇺🇸 Add "Enable debug logging" toggle to increase log buffer from 20 to 200 entries
- 🇺🇸 Add "Reset Logs" button to clear the log buffer
- 🇺🇸 Fix silent failures when rendering panels: missing rootID, API errors, and missing DOM ancestors now produce log entries
- 🇨🇳 在设置中添加用户可访问的调试选项卡（不再需要开发者构建版本）
- 🇨🇳 添加"启用调试日志"开关，将日志缓冲区从 20 条增加到 200 条
- 🇨🇳 添加"重置日志"按钮以清除日志缓冲区
- 🇨🇳 修复面板渲染时的静默失败：缺少 rootID、API 错误和缺少 DOM 祖先元素现在会生成日志条目

### [1.7.0](https://github.com/Macavity/siyuan-database-properties-panel/releases/tag/v1.7.0)

- 🇺🇸 Fix mobile settings dialog displaying incorrectly on small screens
- 🇺🇸 Fix mobile issue where database properties panel remained visible on documents without database attributes
- 🇨🇳 修复移动设备上设置对话框在小屏幕上显示不正确的问题
- 🇨🇳 修复移动设备上数据库属性面板在没有数据库属性的文档上仍然可见的问题

### [1.6.0](https://github.com/Macavity/siyuan-database-properties-panel/releases/tag/v1.6.0)

- 🇺🇸 Add database column visibility settings to control which columns are displayed in the properties panel
- 🇺🇸 Columns can be hidden/shown on a per-database basis via the plugin settings
- 🇺🇸 Detect and warn about orphaned databases (databases no longer visible in any document)
- 🇺🇸 Add option to align property labels to the left
- 🇺🇸 Add option to show bottom separator lines between properties
- 🇨🇳 添加数据库列可见性设置，控制属性面板中显示哪些列
- 🇨🇳 可以通过插件设置按数据库隐藏/显示列
- 🇨🇳 检测并警告孤立的数据库（不再在任何文档中可见的数据库）
- 🇨🇳 添加将属性标签向左对齐的选项
- 🇨🇳 添加在属性之间显示底部分隔线的选项

### [1.5.1](https://github.com/Macavity/siyuan-database-properties-panel/releases/tag/v1.5.1)

- 🇺🇸 Fix click functionality of select checkboxes
- 🇨🇳 修复选择复选框的点击功能

### [1.5.0](https://github.com/Macavity/siyuan-database-properties-panel/releases/tag/v1.5.0)

- 🇺🇸 Fix issue where popup fields (select, date, asset) would become unresponsive after changing a value
- 🇺🇸 Panel now automatically refreshes when database values are updated via edit popups
- 🇨🇳 修复弹出字段（选择、日期、资产）在更改值后无响应的问题
- 🇨🇳 面板现在会在通过编辑弹出窗口更新数据库值时自动刷新

### [1.4.0](https://github.com/Macavity/siyuan-database-properties-panel/releases/tag/v1.4.0)

- 🇺🇸 Fix bug where properties panel would hide when hovering over relation fields
- 🇺🇸 Improve panel management to support multiple document panels simultaneously
- 🇺🇸 Add block-specific panel identification to prevent interference between documents
- 🇨🇳 修复悬停在关系字段上时属性面板隐藏的错误
- 🇨🇳 改进面板管理以支持多个文档面板同时存在
- 🇨🇳 添加块特定面板标识以防止文档之间的干扰

### [1.3.0](https://github.com/Macavity/siyuan-database-properties-panel/releases/tag/v1.3.0)

- 🇺🇸 Hide database name when there is only one database
- 🇺🇸 Overall layout adjustments to reduce used space
- 🇺🇸 Fix bug which might have shown the panel although no databases are visible
- 🇨🇳 在只有一个数据库时隐藏数据库名称
- 🇨🇳 调整整体布局以减少使用空间
- 🇨🇳 修复了在未显示数据库的情况下可能显示面板的错误

### [1.2.0](https://github.com/Macavity/siyuan-database-properties-panel/releases/tag/v1.2.0)

- 🇺🇸 Add a toggle to show/hide empty attributes on a per-document basis.
- 🇺🇸 Add a button to add new attributes to the database
- 🇨🇳 添加切换功能，可按文档显示/隐藏空属性。
- 🇨🇳 添加按钮，用于向数据库添加新属性

## v1.1.2 - Patch to fix an issue with template fields freezing SiYuan

## v1.1.1 - Hotfix to patch a document bug

## [1.1.0](https://github.com/Macavity/siyuan-database-properties-panel/releases/tag/v1.1.0)

### Features

- Adds toggle which allows to hide the database properties panel for a document. This setting is stored per document.
- Adds a tabbed layout to reduce used space for the panel (requires SiYuan >=3.0.17)
- Removed setting to disable editing as it works well.

## [1.0.0](https://github.com/Macavity/siyuan-database-properties-panel/releases/tag/v1.0.0)

### Features

- Add ability to edit properties

### Fixes

- "hide empty properties" now correctly hides empty number fields

## [0.5.2](https://github.com/Macavity/siyuan-database-properties-panel/releases/tag/v0.5.2)

- Fix #20: Remove text indentation

## [0.5.0](https://github.com/Macavity/siyuan-database-properties-panel/releases/tag/v0.5.0)

- Add support for column icons

## [0.4.4](https://github.com/Macavity/siyuan-database-properties-panel/releases/tag/v0.4.4)

- Fix issues with empty asset fields

## [0.4.3](https://github.com/Macavity/siyuan-database-properties-panel/releases/tag/v0.4.3)

- Fix issues with empty relation fields

## [0.4.2](https://github.com/Macavity/siyuan-database-properties-panel/releases/tag/v0.4.2)

- Fix an issue with guest users

## [0.4.1](https://github.com/Macavity/siyuan-database-properties-panel/releases/tag/v0.4.1)

- Improve hiding primary keys

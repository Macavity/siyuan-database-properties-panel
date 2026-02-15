# Database Properties Panel Plugin

[英文版](./README.md)

## 概述

思源数据库属性面板插件通过启用类似工具中常见的功能来增强您的思源体验。
它在很大程度上受到现已归档且不再维护的 [SiYuan-Attributes-Panel](https://github.com/TransMux/SiYuan-Attributes-Panel/) 的启发。
该插件允许用户直接在根据这些行创建的专用页面上查看数据库行的属性。

## 最近更改

### [1.8.0](https://github.com/Macavity/siyuan-database-properties-panel/releases/tag/v1.8.0)

- 🇨🇳 添加"在间隔重复中隐藏"设置，防止属性面板在复习闪卡时剧透答案（默认启用）([#88](https://github.com/Macavity/siyuan-database-properties-panel/issues/88))
- 🇨🇳 修复列可见性设置不显示看板和卡片视图数据库的列的问题 ([#89](https://github.com/Macavity/siyuan-database-properties-panel/issues/89))

## 功能

- 属性显示： 在相应页面上自动显示数据库行属性
- 熟悉的界面： 提供类似于 Notion 和 Anytype 等流行笔记应用程序的用户体验，同时保持思源的设计风格
- 列可见性控制： 按数据库配置哪些列可见

### 数据安全声明

出于对数据安全的绝对重视，本插件特此声明，插件使用的所有 API 和代码均完全开源（未编译且不会混淆），欢迎大家报告安全问题

本插件依赖于以下 API：

- `/api/av/getAttributeViewKeys`： 该参数用于通过新的属性视图获取现有属性

## 插件权限

关于数据： 本插件对您的数据的修改仅限于在用户操作下根据用户指令对指定块的属性进行指定修改，而不会修改其他任何内容
关于用户界面： 用户界面的修改仅限于在文档标题下添加属性面板，对其他部分没有影响。
关于联网： 该插件完全本地化，不包括任何外部网络通信（仅开发者构建版本可能包含用于调试的错误报告功能）

## 支持与反馈

请使用 Github issues 提交错误或功能请求。

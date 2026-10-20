---
title: 命令行
---

# 命令行

`@astryx-vue/cli` 是一个轻巧的命令行工具，方便开发者或 AI Agent 直接在终端里随时检索 astryx-vue 的组件文档。它的命令别名是 `astryx-vue`（请注意：它专为本项目服务，并非 Meta 原版的 `astryx` 命令，也不提供 React 或 StyleX 的功能）。

建议在项目中作为开发依赖安装：

```sh
pnpm add -D @astryx-vue/cli
```

```sh
npm install -D @astryx-vue/cli
```

```sh
yarn add -D @astryx-vue/cli
```

为了方便团队成员无论在什么环境下都能直接调用，建议在 `package.json` 的 `scripts` 中配置快捷命令：

```json
{
  "scripts": {
    "astryx-vue": "node node_modules/@astryx-vue/cli/bin/astryx-vue.mjs"
  }
}
```

配置后即可在终端运行：

```sh
npm run astryx-vue -- component Button
```

## 核心命令

- `astryx-vue component --list`：列出当前所有可用组件。
- `astryx-vue component Button`：快速查看指定组件的基本用法、Props 属性、插槽、事件以及代码示例。
- `astryx-vue search dialog`：根据关键词在所有组件和使用指南中进行相关度搜索。
- `astryx-vue manifest --json`：输出 CLI 自身的接口定义清单（命令、选项、响应结构及退出码），方便被上层脚本消费。
- `astryx-vue init --features agents`：在项目根目录生成专供 AI Agent 使用的上下文指引文件。

## 常用参数

- `--json`：以 JSON 格式输出结构化数据，适合被工具或脚本解析。
- `--dense`：精简输出文本，降低阅读噪音；与 `--json` 配合使用时会被自动忽略，保持 JSON 结构完整。
- `--zh`：当文档具备中文翻译时，优先输出简体中文内容。
- `--cwd`：指定 `init` 初始化命令写入文件的目标目录路径。

## 配合 AI Agent（生成上下文文件）

运行 `init --features agents` 会在项目根目录生成 `AGENTS.md`；添加 `--agent claude` 参数则会生成 `CLAUDE.md`；`cursor` 和 `codex` 默认写入 `AGENTS.md`。

命令行工具在维护这些文件时非常安全，它只会在以下固定的起止标记之间更新内容：

```html
<!-- Maintained by astryx-vue, do not edit manually -->
...
<!-- astryx-vue block end -->
```

每次运行命令，工具只会用最新的组件库信息替换这两个标记之间的内容，标记之外由你自己撰写的项目规则会完好无损地保留下来。如果文件已存在但尚未包含这些标记，工具会安全地将其追加到文件末尾。

> **维护者提醒**：CLI 打印的内容均提取自当前文档站。当文档内容修改后，需要重新生成 CLI 包内置的文档快照，操作步骤记录在 `packages/cli` 的 README 中。
>
> 当前版本暂未包含主题生成、模板下载、自动升级迁移或 MCP 服务命令。

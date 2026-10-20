---
title: 命令行
---

# 命令行

`@astryx-vue/cli` 是一个轻巧的命令行工具，用来在终端里随时查 astryx-vue 的组件文档和演练场页面，方便开发者和 AI Agent 使用。二进制命令名是 `astryx-vue`（请注意：它专为本项目服务，并非 Meta 原版的 `astryx` 命令，也不提供 React 或 StyleX 的功能）。

建议在项目中作为开发依赖安装：

```sh
pnpm add -D @astryx-vue/cli
```

包里声明了 `bin`，装完命令就在 `node_modules/.bin` 里，直接就能用：

```sh
pnpm exec astryx-vue component Button
npx astryx-vue search dialog --json
```

不安装、只想临时用时，运行 `npx @astryx-vue/cli …`。注意 scope 不能省略，因为 npm 上裸名 `astryx-vue` 并不是这个包。

脚本别名是可选项，只有当 agent 的环境没有把 `node_modules/.bin` 放进 `PATH` 时才需要在 `package.json` 里添加：

```json
{
  "scripts": {
    "astryx-vue": "astryx-vue"
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
- `astryx-vue composable --list`：列出组合式函数，`astryx-vue composable useClipboard` 打印其参数和返回值。Vue 里这类函数叫组合式函数（composable），所以命令与文档中统一不使用 hook 这个词。若误输入 `component useClipboard` 仍然能查到，并会友好提示改用 `composable` 命令。
- `astryx-vue docs`：列出指南与主题文档。`astryx-vue docs guide/dark-mode` 或 `astryx-vue docs themes/tokens` 可直接在终端阅读正文。
- `astryx-vue search dialog`：在组件、组合式函数、文档主题和页面模板里按相关度搜索。`--type` 可以限定为 `component`、`composable`、`doc` 或 `template`。
- `astryx-vue manifest --json`：输出 CLI 自身的接口定义清单（命令、选项、响应结构、错误码及退出码），方便被上层工具或脚本消费。
- `astryx-vue init --features agents`：在项目根目录生成专供 AI Agent 使用的上下文指引文件。

## 页面模板与代码生成

- `astryx-vue template --list`：列出 53 个演练场页面模板，按分类分组。目前所有模板都是页面；`--type block` 会给出一句说明，不报错。
- `astryx-vue template login-card`：打印一个模板的说明、用到的组件和完整源码。`--skeleton` 只打印布局骨架（组件标签加上 `gap`、`padding`、`columns` 这类布局属性，不含文字、事件处理和原生 HTML 包裹层）。
- `astryx-vue template login-card ./src/pages`：将模板代码生成并写出到 `src/pages/LoginCard.vue`。如果文件已存在，需要加上 `--overwrite`（或 `-f`）才会覆盖，避免误冲掉已有代码。复制时会自动把演示图片替换为内联的灰色占位图，不依赖额外的静态图片资源。
- `astryx-vue build "<想法>"`：把一句话需求变成开发起点，在本地匹配出最接近的页面模板、备选方案以及需要搭配使用的组件与函数。打分完全在本地完成，无网络开销也无需调用外部大模型。

## 常用参数

- `--json`：以 JSON 格式输出带类型的结构化信封数据，适合被工具或脚本解析。模板相关的类型包括 `template.list`、`template.show`、`template.skeleton`、`template.copy`；`build` 返回 `build.help` 和 `build.kit`。出错时信封里带有错误码（如 `ERR_UNKNOWN_TEMPLATE`、`ERR_FILE_EXISTS` 等）。
- `--dense`：精简输出文本，降低阅读噪音；与 `--json` 配合使用时会被自动忽略，保持 JSON 结构完整。
- `--zh`：当文档具备中文翻译时，优先输出简体中文内容。
- `--cwd`：指定项目目录，`template` 和 `init` 只往这个目录下写文件。

## 配合 AI Agent（生成上下文文件）

项目里没有任何 agent 文件时，`init --features agents` 默认创建 `AGENTS.md`。不加 `--agent` 时会优先写项目里已有的配置文件，检测顺序为 `AGENTS.md`、`CLAUDE.md`、`.cursorrules`、`.hermes.md`、`HERMES.md`。`--agent claude` 写 `CLAUDE.md`，`hermes` 写 `.hermes.md`，`cursor` 和 `codex` 写 `AGENTS.md`，`all` 则写所有已存在的已知文件。通过 `--agent-docs-path <file>` 也可以指定输出到任意文件。

命令行工具在维护这些文件时非常安全，它只会在以下固定的起止标记之间更新内容：

```html
<!-- Maintained by astryx-vue, do not edit manually -->
...
<!-- astryx-vue block end -->
```

区块里写的是三步工作流：用 `build` 挑页面，用 `template` 复制，写代码前用 `component`、`composable` 或 `docs` 查询用法。

每次运行命令，工具只会用最新的组件库信息替换这两个标记之间的内容，标记之外由你自己撰写的项目规则会完好无损地保留下来。如果文件已存在但尚未包含这些标记，工具会安全地将其追加到文件末尾。

> **维护者提醒**：CLI 打印的内容均提取自当前文档站和演练场页面。当文档或模板修改后，需要重新生成 CLI 包内置的目录快照，操作步骤记录在 `packages/cli` 的 README 中。
>
> 这一版暂未包含主题生成、版本升级迁移或 MCP 服务命令。

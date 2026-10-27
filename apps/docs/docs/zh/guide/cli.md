---
title: 命令行
---

# 命令行

`@astryx-vue/cli` 是一个轻量的命令行工具，用于在终端中检索 astryx-vue 的组件文档与演练场模板，便于开发者与 AI 工具查询使用。CLI 命令名称为 `astryx-vue`（注意：该命令专用于本项目，并非 Meta 原版的 `astryx` 命令，不包含 React 或 StyleX 相关功能）。

建议在项目中作为开发依赖安装：

```sh
pnpm add -D @astryx-vue/cli
```

包内声明了 `bin` 字段，安装后即可在 `node_modules/.bin` 中直接调用：

```sh
pnpm exec astryx-vue component Button
npx astryx-vue search dialog --json
```

若未安装且需临时执行，可运行 `npx @astryx-vue/cli …`。注意必须包含完整的 package scope，npm 上无 scope 的 `astryx-vue` 并非本项目包。

若运行环境未将 `node_modules/.bin` 自动加入 `PATH`，才需要在 `package.json` 里添加：

```json
{
  "scripts": {
    "astryx-vue": "astryx-vue"
  }
}
```

配置后即可在终端执行：

```sh
npm run astryx-vue -- component Button
```

## 核心命令

- `astryx-vue component --list`：列出当前所有可用组件。
- `astryx-vue component Button`：查看指定组件的基本用法、Props 属性列表、插槽、事件以及代码示例。
- `astryx-vue composable --list`：列出所有组合式函数；`astryx-vue composable useClipboard` 打印其参数签名与返回值。Vue 3 规范统称为组合式函数（composable），命令与文档中统一不使用 hook 一词。若输入 `component useClipboard` 仍可正确查询，并会提示改用 `composable` 命令。
- `astryx-vue docs`：列出指南与主题文档；通过 `astryx-vue docs guide/dark-mode` 或 `astryx-vue docs themes/tokens` 可在终端阅读全文。
- `astryx-vue search dialog`：在组件、组合式函数、文档主题与页面模板中进行相关度检索。可通过 `--type` 参数限定为 `component`、`composable`、`doc` 或 `template`。
- `astryx-vue manifest --json`：输出 CLI 自身的接口清单（包含命令、选项、响应结构、错误码及退出码），供外部脚本集成调用。
- `astryx-vue init --features agents`：在项目根目录生成面向 AI 工具的规范指引文件。

## 页面模板与代码生成

- `astryx-vue template --list`：列出 53 个演练场页面模板，按业务分类分组。当前所有模板均为完整页面；传入 `--type block` 会返回提示说明，不抛出异常。
- `astryx-vue template login-card`：打印指定模板的说明信息、关联组件清单与完整源码。追加 `--skeleton` 仅打印布局骨架（保留组件标签及 `gap`、`padding`、`columns` 等布局属性，省略文本、事件绑定与原生 HTML 节点）。
- `astryx-vue template login-card ./src/pages`：将模板代码生成并写入至 `src/pages/LoginCard.vue`。若目标文件已存在，需显式传入 `--overwrite`（或 `-f`）才会覆盖。生成时会自动将演示图片替换为内联 SVG 灰色占位图，不依赖外部静态资源。
- `astryx-vue build "<想法>"`：根据自然语言描述匹配开发起点，在本地计算出最接近的页面模板、备选方案以及推荐搭配的组件与函数。匹配打分完全在本地离线计算，无需调用网络或大模型 API。

## 常用参数

- `--json`：以 JSON 格式输出类型化的结构化数据，适合自动化工具解析。模板相关类型包括 `template.list`、`template.show`、`template.skeleton`、`template.copy`；`build` 命令返回 `build.help` 与 `build.kit`。异常时信封内包含错误码（如 `ERR_UNKNOWN_TEMPLATE`、`ERR_FILE_EXISTS` 等）。
- `--dense`：精简输出文本；当与 `--json` 同时传入时自动忽略，保证 JSON 结构完整。
- `--zh`：当文档提供中文翻译时，优先输出简体中文内容。
- `--cwd`：指定工作目录，`template` 与 `init` 仅向该目录下写入文件。

## 配合 AI Agent（生成上下文文件）

若项目中未包含任何 agent 配置文件，`init --features agents` 默认创建 `AGENTS.md`。未显式传入 `--agent` 时会优先检测项目中的既有文件，检测顺序为 `AGENTS.md`、`CLAUDE.md`、`.cursorrules`、`.hermes.md`、`HERMES.md`。`--agent claude` 对应 `CLAUDE.md`，`hermes` 对应 `.hermes.md`，`cursor` 与 `codex` 对应 `AGENTS.md`，`all` 则更新所有已识别的配置文件。也可以通过 `--agent-docs-path <file>` 指定输出至任意文件。

CLI 采用受管更新机制，仅在固定的起止标记之间更新内容：

```html
<!-- Maintained by astryx-vue, do not edit manually -->
...
<!-- astryx-vue block end -->
```

标记块内包含三步工作流：通过 `build` 检索页面，通过 `template` 导出，编写代码前通过 `component`、`composable` 或 `docs` 查询 API 规范。

再次执行该命令时，工具仅更新两个标记之间的内容，标记外部编写的自定义规范完整保留。若目标文件已存在但缺少上述标记，工具会将内容安全追加至文件末尾。

> **维护者说明**：CLI 输出的文本数据提取自文档站与演练场页面。当文档或模板更新后，需重新构建 CLI 内置的目录快照，详细流程见 `packages/cli` 的 README。
>
> 当前版本未包含主题生成、版本迁移或 MCP 服务命令。

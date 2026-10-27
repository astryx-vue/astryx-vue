---
title: 配合 AI 写代码
---

# 配合 AI 写代码

AI 在编写组件代码时常出现两类问题：凭推测编造 props，以及错误混用 React 原版语法。这两类问题可以通过一份规范说明和配套的 CLI 工具来规避。

整套方案由两部分构成：

- 项目指引文件：向 AI 明确文档索引路径与语法边界。
- CLI 工具：供 AI 按需查询真实的 props、插槽定义与代码示例。

## 第一步：安装 CLI 工具

```sh
pnpm add -D @astryx-vue/cli
```

安装完成后可执行文件位于 `node_modules/.bin`，名称为 `astryx-vue`。也可以通过 `npx @astryx-vue/cli …` 临时执行，package scope 需保留。

## 第二步：生成规范说明文件

```sh
pnpm exec astryx-vue init --features agents
```

该命令会在项目中写入一段受管的代码指引。默认优先匹配已有文件，检测顺序为 `AGENTS.md`、`CLAUDE.md`、`.cursorrules`、`.hermes.md`、`HERMES.md`；若均不存在则新建 `AGENTS.md`。

各 AI 辅助工具的生成目标如下：

| 工具 | 怎么写 |
| --- | --- |
| Claude Code | `--agent claude`，写 `CLAUDE.md` |
| Codex、Cursor | `--agent codex` 或 `--agent cursor`，写 `AGENTS.md` |
| 已有文件的仓库 | 不加 `--agent`，沿用现有的那个 |
| 其他 | `--agent-docs-path <file>` 指定任意文件 |

GitHub Copilot 读取 `.github/copilot-instructions.md`。CLI 默认不写入该文件，可通过 `--agent-docs-path .github/copilot-instructions.md` 手动指定。相对路径基于项目根目录解析，超出项目边界的路径会被拒绝。

## 说明文件的具体内容

写入的内容严格限制在固定的起止标记之间：

```html
<!-- Maintained by astryx-vue, do not edit manually -->
...
<!-- astryx-vue block end -->
```

标记块包含四个部分：

1. **技术栈说明**：明确 astryx-vue 是 Astryx 的非官方 Vue 3 社区实现，组件位于 `@astryx-vue/core`，主题位于 `@astryx-vue/themes`。避免混用 Meta 的 React 包、StyleX 或裸命令 `astryx`。
2. **工作流指引**：先使用 `build` 检索模板，通过 `template` 导出代码，编写代码前通过 `component`、`composable`、`docs` 查询 API。
3. **检索指令速查**：列出 `component --list`、`composable --list`、`docs <topic>`、`search`、`manifest --json` 等命令，并说明 `--json`、`--zh`、`--dense` 参数用法。
4. **运行规则与约定**：明确子路径导入规则、peer 依赖要求，以及样式不依赖 UnoCSS 等约束。

重复执行该命令将更新配置块：仅更新两个标记之间的内容，标记外部编写的自定义规范会完整保留。

## 配合 AI 查询真实 API

说明文件提供指引，具体 API 数据通过命令行实时查询。以下命令可直接提供给 AI 或写入项目规范：

```sh
# 屏幕上有哪些组件
pnpm exec astryx-vue component --list

# 一个组件的用法、props、插槽、事件和示例
pnpm exec astryx-vue component Button

# 组合式函数的参数和返回值
pnpm exec astryx-vue composable useClipboard

# 一篇指南或主题正文
pnpm exec astryx-vue docs guide/dark-mode

# 跨组件、文档、模板一起搜
pnpm exec astryx-vue search "date picker"
```

供自动化脚本或 AI 工具读取时，可追加 `--json` 参数获取类型化结构体；发生错误时返回统一的错误结构并带有非零退出码。可配合 `--dense` 压缩文本长度，配合 `--zh` 输出中文内容。

建立查验流程后，可有效避免因凭空推测导致属性错误的问题。

## 基于模板起步

```sh
pnpm exec astryx-vue build "订单详情页，左边列表右边详情"
pnpm exec astryx-vue template --list
pnpm exec astryx-vue template detail-page ./src/pages
```

`build` 命令在本地根据关键词匹配评分，输出匹配度最高的模板、两个备选模板及关联组件清单，全流程在本地离线计算。`template <slug> <目录>` 将目标模板输出为 `<Name>.vue` 文件，自动替换占位图并提示依赖缺失情况。

若目标文件已存在则跳过写入，如需强制覆盖需指定 `--overwrite`（或 `-f`）。

## AI 交互核心规范

在项目系统提示或规则文件中建议明确以下规则：

- 编写组件前通过 `astryx-vue component <Name>` 查询，不依赖推测编写 props。
- 仅从 `@astryx-vue/core/<Subpath>` 或包根导入，禁止使用 Meta 的 `@astryxdesign/*`。
- 样式通过内置主题变量 `var(--astryx-*)` 控制，禁止硬编码颜色值与像素数值。
- 内边距统一声明在 `Layout` 或 `AppShell` 上，不要每层再包一个带 padding 的 `div`。见 [页面布局](/guide/layout)。
- 对组件行为存疑时，查阅 `astryx-vue docs` 对应的文档主题，避免编造 API。

## 接下来

- CLI 完整参数说明与退出码见 [命令行](/guide/cli)。
- `init` 覆盖范围及标记细节见 [命令行](/guide/cli) 的「配合 AI Agent」一节。

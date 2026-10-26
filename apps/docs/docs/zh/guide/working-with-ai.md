---
title: 配合 AI 写代码
---

# 配合 AI 写代码

AI 写组件代码时最容易犯两个错：一是猜 props，二是把原版 React 的写法搬过来。两个错都能靠一份说明加一条命令挡掉。

这套东西分两块：

- 一份写进项目的说明文件，让 AI 知道该查哪里、不该写什么。
- 一条命令行工具，让 AI 随时查到真实的 props、插槽和示例。

## 第一步：装命令行

```sh
pnpm add -D @astryx-vue/cli
```

装完命令就在 `node_modules/.bin` 里，名字是 `astryx-vue`。没装也能临时用 `npx @astryx-vue/cli …`，scope 不能省。

## 第二步：生成说明文件

```sh
pnpm exec astryx-vue init --features agents
```

这条命令会在项目里写一段受管理的说明。默认挑项目已有的那个文件，检测顺序是 `AGENTS.md`、`CLAUDE.md`、`.cursorrules`、`.hermes.md`、`HERMES.md`；一个都没有就新建 `AGENTS.md`。

不同工具的落点：

| 工具 | 怎么写 |
| --- | --- |
| Claude Code | `--agent claude`，写 `CLAUDE.md` |
| Codex、Cursor | `--agent codex` 或 `--agent cursor`，写 `AGENTS.md` |
| 已有文件的仓库 | 不加 `--agent`，沿用现有的那个 |
| 其他 | `--agent-docs-path <file>` 指定任意文件 |

GitHub Copilot 读 `.github/copilot-instructions.md`，命令行默认不写这个文件，用 `--agent-docs-path .github/copilot-instructions.md` 指过去就行。相对路径按项目目录解析，指到项目外面会被拒绝。

## 说明文件里写了什么

写进去的内容固定在两个标记之间：

```html
<!-- Maintained by astryx-vue, do not edit manually -->
...
<!-- astryx-vue block end -->
```

标记里面是四块：

1. **项目用的是什么。** astryx-vue 是 Astryx 的非官方 Vue 3 社区实现，组件在 `@astryx-vue/core`，主题在 `@astryx-vue/themes`。不要用 Meta 的 React 包、StyleX，也不要调用裸命令 `astryx`。
2. **三步工作流。** 先用 `build` 找模板，用 `template` 复制出来，写代码前用 `component`、`composable`、`docs` 查用法。
3. **怎么查。** 列出 `component --list`、`composable --list`、`docs <topic>`、`search`、`manifest --json` 这些命令，还有 `--json`、`--zh`、`--dense` 三个参数。
4. **怎么运行，以及几条约定。** 包含子路径导入、peer 依赖、样式不需要 UnoCSS 这几点。

再跑一次同样的命令就是刷新：命令只替换两个标记之间的内容，你在标记外面写的项目规范一个字都不会动。

## 让 AI 自己查

说明文件只是指路，真正的答案在命令行里。下面几条值得直接交给 AI，或者写进你的项目规范。

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

给脚本或 agent 读的时候加 `--json`，返回带类型的结构化数据，出错时也走同一套结构并带非零退出码。加 `--dense` 可以拿到更短的文本，加 `--zh` 拿简体中文。

只要 AI 养成「写之前先查一次」的习惯，编造 props 这件事基本就不会发生了。

## 从模板起步比从零写快

```sh
pnpm exec astryx-vue build "订单详情页，左边列表右边详情"
pnpm exec astryx-vue template --list
pnpm exec astryx-vue template order-detail ./src/pages
```

`build` 在本地按关键词打分，给出最接近的模板、两个备选，以及要用的组件，不联网也不调外部模型。`template <slug> <目录>` 会把模板写成 `<Name>.vue`，顺手把演示图片换成灰色占位图，并告诉你项目还缺哪些包。

已存在的文件不会被覆盖，要替换得显式加 `--overwrite`（或 `-f`）。

## 给 AI 的几条规矩

把这几句抄进你的项目说明里，效果比长篇解释好：

- 写组件前先跑 `astryx-vue component <Name>`，不要凭记忆写 props。
- 只从 `@astryx-vue/core/<Subpath>` 或包根导入，不要用 Meta 的 `@astryxdesign/*`。
- 样式用官方主题加 `var(--astryx-*)` 变量，不要写死色号和像素。
- 内边距只写在 `Layout` 或 `AppShell` 上，不要每层再包一个带 padding 的 `div`。见 [页面布局](/guide/layout)。
- 拿不准的组件行为，去 `astryx-vue docs` 找对应主题，不要自己发明 API。

## 接下来

- 命令行的完整参数和退出码：见 [命令行](/guide/cli)。
- `init` 覆盖的文件和标记细节：见 [命令行](/guide/cli) 的「配合 AI Agent」一节。

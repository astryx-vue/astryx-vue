# C9 Markdown 与代码 · 执行计划

## 目标

Markdown 正文里，标题能点进对应锚点，嵌套列表每一层用不同的记号，字符实体显示成它代表的字符，围栏代码的长行自动折行，`diff` 围栏带差异层。需要时可以用行号插件标出块在源码里的行。给 F1a 准备和上游同形的解析器与插件协议：`parseMarkdownAst`、`parseInlineAst`、`decodeMarkdownCharacterReferences`，以及 `Markdown/plugins` 子路径。

## 工作环境

- 工作区：`/workspace`，分支 `sync/c9-markdown`。云端环境，不使用本机 Mac 工作区。
- 动手前已读：`SWARM.md`、ROADMAP 里 C9 那一行、`ledger/C9.md`、ADR `docs/adr/0001-new-packages.md` 第 2.7 节、`templates/plan.md` 与 `templates/verify.md`。
- 环境纪律：测试和检查命令前面加 `env -u NODE_ENV`。vitest 加 `--maxWorkers=2`。再跑一遍 `NODE_ENV=production`，用例数要相同。
- 浏览器：本轮以解析器和渲染单测为主。视觉对照如果环境里打得开，用 `pnpm visual`；打不开就在回报里写明。

## 上游这条改动让用户看到或感受到了什么

| 上游改动 | 用户看到或感受到的变化 |
| --- | --- |
| 标题锚点（#4765、#6911、#6915） | 标题有稳定 id，旁边有跳到该标题的链接 |
| 多层列表记号（#7027，AST-061 DEC-6） | 无序列表按层是圆点、圆圈、方块；有序列表按层是数字、小写字母、小写罗马数字 |
| 字符实体（#6986、#7013） | `&copy;`、`&#169;`、`&#xA9;` 显示成 ©；不认识的名字保持原样 |
| 行号插件（#7286） | 传入 `markdownSourceLinesPlugin` 后，块上有 `data-source-line` 和结束行；不传则没有 |
| 长行折行（#7564） | 围栏代码超长时在块内折行，而不是只靠横向滚动 |
| diff 层（#7389） | `diff`、`diff-ts` 这类围栏按行标出增删，并按内层语言着色 |
| 解析器子路径（#6382、#6340、#7036） | 服务端可以调用和上游同名的解析函数和插件能力查询 |

## 上游依据

- 台账：`ledger/C9.md` 全部条目。本轮按 ROADMAP 点名的行为落地；其余条目逐条标「已采纳」或「不适用」。
- 上游公开契约以 v0.7.1 的 `Markdown/parser/index.ts`、`Markdown/plugins/index.ts`、`parser.public.test.ts` 为准。包名用我们的 `@astryx-vue/core`。
- 解析实现继续用现有的 micromark / mdast，不把上游 5000 行手写解析器搬过来。

## 有没有更适合 Vue 的做法

| 上游怎么做 | 我们怎么做 | 为什么效果一样 |
| --- | --- | --- |
| 插件渲染返回 React 节点 | 协议里的 `render` 返回 Vue 能画的节点或字符串 | 页面上看到的仍是插件声明的那一块 |
| `plugin-renderer` 带 `use client` | Vue 没有这道边界，子路径照常导出组件 | 调用方都能单独画一个插件节点 |
| 组件入口的 `parseMarkdown` 返回旧版块数组 | 组件入口保持现在的 mdast 根，避免已有调用坏掉。上游那套旧版块数组放在 `Markdown/parser` | F1a 从 parser 子路径引入，和上游测试的入口一致 |

## 任务范围

- 要改：`packages/core/src/Markdown/`、`packages/core/src/Code` 仅在确认还有 TODO 时才改、`packages/core/package.json` 的子路径导出、`packages/core/styles` 仅在缺样式时、中英文 Markdown 文档、`ledger/C9.md`、行数白名单里的 `render.ts`。
- 不碰：别的节点的组件、richtext 包（F1a）、生成的 `src/index.ts` 只通过 `pnpm sync` 更新。
- 不用 `!important`。

## 开发步骤

1. 写出 parser、plugins、plugin-renderer 三个子路径，以及字符实体解码。
2. 解析结果接上插件的 transform 和语法。行号插件给块打上源码行。围栏代码默认折行。
3. 把 `render.ts` 拆到 500 行以内，并从行数白名单去掉。确认 `tokenizer.ts` 没有 TODO。
4. 补 Vitest。两种 `NODE_ENV` 都跑。
5. 更新中英文文档。台账每条写上结论。
6. `pnpm sync` 后提交。

## 自测要求

1. `env -u NODE_ENV pnpm vitest run --maxWorkers=2 packages/core/src/Markdown packages/core/src/Code`
2. `NODE_ENV=production pnpm vitest run --maxWorkers=2 packages/core/src/Markdown packages/core/src/Code`，用例数与上一步相同。
3. `node scripts/check-no-important.mjs` 与 `node scripts/check-line-limit.mjs`。
4. 新写和改到的源码文件不超过 500 行。

## 提交与回报

- 提交信息用中文。推送分支 `sync/c9-markdown`，草稿 PR 指向 `swarm-tree`，标题 `C9 Markdown 与代码`。
- 不改 ROADMAP 的节点状态，除了开工时 `status.mjs set` 规定的那一次。
- 回报写到 `nodes/C9/impl-1.md`。

## 验证操作要短小

每条命令加 `timeout`。浏览器命令如果要跑，套 `browser-lock.mjs run --max-run`。脚本放在 `/tmp/c9-*`。

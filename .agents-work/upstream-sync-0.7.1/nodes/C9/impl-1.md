# C9 Markdown 与代码 · 第 1 轮实现回报

- 工作区：`/workspace`，分支 `sync/c9-markdown`，从 `swarm-tree` 的 `202336f` 切出。
- 提交（基于 `202336f`）：
  - `5c42fc2` feat(markdown): 补上解析器子路径、行号插件和围栏折行
  - `d2161af` docs(C9): 写第 1 轮实现回报，并补上 data URL 台账结论

## 1. 做了什么

1. 写出 `Markdown/parser`、`Markdown/plugins`、`Markdown/plugin-renderer` 三个子路径，以及字符实体解码。组件自己的 `parseMarkdown` 仍返回 mdast 根，旧的块列表只在 parser 子路径。
2. 插件的语法和 transform 接在 micromark 结果后面。`markdownSourceLinesPlugin` 给标题、段落、列表项、引用、代码外层、表格外层和分隔线打上源码行。围栏代码默认 `isWrapped: true`。
3. 把淡入文本、引用芯片和链接渲染抽到 `renderInline.ts`，标题 slug 和纯文本测量抽到 `renderTree.ts`。`render.ts` 降到 500 行以内，并从行数白名单删掉。
4. `tokenizer.ts` 里没有 TODO 或 FIXME，没有改它。`HACK_KEYWORDS` 是语言名，不是待办。

| 文件 | 行数 | 职责 |
| --- | --- | --- |
| `packages/core/src/Markdown/publicParser.ts` | 112 | 公开解析入口 |
| `packages/core/src/Markdown/characterReferences.ts` | 69 | 字符实体解码 |
| `packages/core/src/Markdown/plugin-protocol/protocol.ts` | 332 | 插件协议 |
| `packages/core/src/Markdown/plugin-protocol/syntax.ts` | 386 | 行内和块级语法拼接 |
| `packages/core/src/Markdown/plugin-protocol/frontmatter.ts` | 151 | 文首元数据 |
| `packages/core/src/Markdown/render.ts` | 484 | 块渲染，含行号和折行 |
| `packages/core/src/Markdown/renderInline.ts` | 133 | 文本、引用和链接 |
| `packages/core/src/Markdown/plugin-renderer/index.ts` | 49 | 单个扩展节点渲染 |

## 2. 和上游的对照

| 上游改动 | 上游怎么做 | 我们怎么做 | 为什么效果相同 |
| --- | --- | --- | --- |
| 解析器子路径 | 自研 parser 同时给出 canonical 树和旧块列表 | micromark 出树，再投影成旧块列表 | 公开测试断言的形状一致：heading depth、strong、bold |
| 字符实体 | WHATWG 表加自写解码 | 同一张表，自己的扫描函数 | `&copy;`、`&#169;`、`&#xA9;` 都是 ©，`&#0;` 是 U+FFFD |
| 插件协议 | createMarkdownPlugin 冻结入口 | 同样的工厂、能力和品牌检查，品牌是 `@astryx-vue/core` | 普通对象会抛错，transform 插件能力是 `{ syntax: false, transform: true }` |
| 文首元数据 | 插件 transform 写入信封并裁掉围栏 | 同样的 `---` 规则和 `getMetadata` | `title: Server proof` 能读到，子节点只剩标题 |
| 行号插件 | 解析时记下行号 | 渲染时读已有 position | 传入插件才有 `data-source-line`，`em`、`tr`、`td` 没有 |
| 围栏折行 | Markdown 给 CodeBlock 传 isWrapped | 同样传 `isWrapped: true` | 长行代码元素带 `data-wrapped="true"` |
| diff 围栏 | 语言信息拆成 diff 层 | 已有 `parseFenceLanguage` | `diff-ts` 行上有 `data-diff` |
| 数学、remark、文本变换、语义围栏、源码装饰 | 可选辅助函数 | 不做 | 必做接口里没有。`math: true` 不产生数学节点 |

## 3. 和计划不一样的地方

计划里的 `plugins/index.ts` 没有新建。旁边已经有 Vue 用的 `plugins.ts`，协议放在 `plugin-protocol/`，包导出 `./Markdown/plugins` 指向那里。

组件入口的 `parseMarkdown` 没有改成旧块列表，避免拆掉现有组件和测试。旧块列表在 parser 子路径，和上游公开测试用的导入路径一致。

## 4. 台账处理

一共 119 条。已采纳 27 条，不适用 92 条。每条结论写在 `ledger/C9.md`。

不适用里，32 条左右是上游自研解析器的 CommonMark 修补（含图片 alt 实体、围栏缩进、链接括号）。这里用 micromark，没有把那份 parser 逐行搬过来，也没有为每一条单独补失败用例。其余不适用是主题、文档规格、性能夹具、数学公式、remark，以及 text transform、semantic fence、source decoration、soft breaks 这些可选辅助函数。

## 5. 自测结果

| # | 自测项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | `env -u NODE_ENV pnpm vitest run --maxWorkers=2 packages/core/src/Markdown packages/core/src/Code` | 过 | 13 个文件，95 条 |
| 2 | `NODE_ENV=production pnpm vitest run --maxWorkers=2 packages/core/src/Markdown packages/core/src/Code` | 过 | 13 个文件，95 条 |
| 3 | eslint、`vue-tsc`（core）、`check-no-important`、`check-line-limit`、`sync-exports --check` | 过 | 退出码都是 0。没有跑完整的 `pnpm check`（含全库 build） |
| 4 | 视觉对照 | 无浏览器 | 只能读代码和单测。锚点、列表记号、`data-wrapped`、diff 行都有断言。样式文件没有删这些规则 |

`ssr-known-failures.json` 是空对象。新增入口没有 `use client`。样式没有新增 `!important`。

## 6. 拿不准的地方

`math: true`、remark、text transform、semantic fence、source decoration、soft breaks 没有做。协议表面够调用方自己写插件。若 F1a 直接导入这些辅助函数，会缺导出。

组件入口的 `parseMarkdown` 和 parser 子路径的 `parseMarkdown` 返回值不同。文档里写了这件事。

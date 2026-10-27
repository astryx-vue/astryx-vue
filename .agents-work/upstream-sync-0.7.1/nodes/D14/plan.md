# D14 core Markdown 解析器对齐原版 · 执行计划

## 背景

F1a 移植 richtext 时发现：我们 core 的 Markdown 解析器（`packages/core/src/Markdown/`）有 6 个地方和原版 v0.7.1 不一样。因为这些不一样，richtext 有 12 条测试只能先写成 `it.todo`。每条 todo 上面都写了不一样的原因，原版的断言也原样留在注释里。

详情见 `.agents-work/upstream-sync-0.7.1/nodes/F1a/impl-1.md` 第 6.1 节，对应 issue #209。

## 要修的 6 处（按重要程度排）

1. **不安全的链接地址（有安全影响，最先修）。** 原版的 `parseInlineAst` 解析时就会拒绝 `javascript:`、`vbscript:`、`data:` 这类地址，整段按普通文字读。我们现在会读成 `link` 节点，等到渲染时才用 `sanitizeMarkdownLinkUrl` 去掉 href。
   - 改成在解析阶段就拒绝，判定规则照原版。
   - 拒绝之后，`Markdown` 组件画出来的样子也要和原版一样：原版画成文字，不画成没有 href 的链接。
   - F1b 的 `RichTextView` 也依赖这个判定。
2. **缩进代码块。** 原版没有缩进代码块：一行开头缩进 4 格，会当成普通段落读。我们现在读成了 `code`。照原版改，然后检查文档站和演练场里有没有地方靠缩进写代码块（`grep` 一遍 Markdown 示例）。
3. **插件取词窗口。** 原版把整段行内文本交给插件的 tokenize，`end` 至少到 `offset + maxSpan`。我们现在在基础语法（`**`、链接）之前就把文本切断了。照原版改。
4. **扩展节点的 `source` 丢了反斜杠。** 原文 `\@{ada}`，原版记的 `source` 是 `\@{ada}`，我们记成了 `@{ada}`。
5. **`createMarkdownPlugin` 没有类型参数。** 照原版改成 `createMarkdownPlugin<Name, Node>`，让 `toText` 等回调里的 `node.data` 收窄到具体类型。
6. **链接文字里的插件语法。** 原版把链接文字整段当文字读，`[link @{l}](…)` 不会生成扩展节点。我们现在会生成。

## 依据

- 原版：`git -C /Users/shenqingchuan/workspace/astryx-upstream show v0.7.1:packages/core/src/Markdown/<文件>`，重点看 `parser/`、`plugins` 相关文件，以及它们的 `.test.ts`。
- 我们这边：`packages/core/src/Markdown/parser/`、`plugin-protocol/`、`publicParser.ts`、`url.ts`、`render.ts`、`renderInline.ts`。

## 完成标准

1. `packages/richtext` 里的 12 条 `it.todo`，全部按注释里原版的断言恢复成正式测试，并且通过。`grep -rn "it.todo" packages/richtext/src` 结果为空。
2. core 每修一处，都要补上原版对应的测试用例。
3. core 现有的测试不能退步。如果某条现有测试的期望值和原版冲突，以原版为准改掉，并在回报里逐条列出改了哪些、为什么改。
4. 用文档站整页截图核对：Markdown 组件页里的链接和代码块示例，在浅色和深色下显示都正常。

## 环境与纪律

- 工作区、分支、槽位、端口：以派活提示为准。
- 所有命令前加 `env -u NODE_ENV`；vitest 加 `--maxWorkers=2`。测试要在 NODE_ENV 不设和设为 `production` 两种情况下各跑一遍。
- 文档站只用 `docs:build` 再 `vitepress preview` 验证，不要用 `vitepress dev`。
- 每修完一处就提交一次，提交信息用中文，不要推送。
- 回报写到 `nodes/D14/impl-1.md`。

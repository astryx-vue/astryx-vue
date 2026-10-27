# D14 core Markdown 解析器对齐原版 · 第 1 轮实现回报

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/D14`，分支 `sync/d14-markdown-parser`。只在本地提交，没有推送。
- 提交（基于 `162818d`）：
  - `2c62d0e` fix(markdown): 解析阶段就拒绝 javascript:/vbscript:/data:text/html 地址
  - `4815b89` fix(markdown): 去掉缩进代码块，行内解析只读行内语法
  - `ff25df1` fix(markdown): 插件取词窗口、转义前缀、链接文字按原版读
  - `e6a9f1a` test(markdown): 补拒绝链接与四格缩进行在组件里的画法
  - `b26848e` docs(markdown): 写明 parseInline 只读行内内容
  - `ac1189f` test(richtext): 插件定义改用显式泛型，去掉 as never

## 1. 做了什么

计划里的 6 处按重要程度逐个修完，一共 6 个提交。`grep -rn "it.todo" packages/richtext/src` 现在没有输出，12 条断言全部恢复并通过。

1. **不安全地址在解析时拒绝**（有安全影响，最先做）。新增 `refusedLinks.ts`：链接、图片节点的目的地用 `isSafeUrl` 同一条规则判定，不安全就把**整段原文**（`[x](javascript:alert(1))`，含里面的行内代码）换成一个文字节点。`url.ts` 里新增导出的 `isSafeMarkdownParserUrl` 就是这个判定，渲染层继续用 `sanitizeMarkdownLinkUrl` 兜底（同一套 `safeUrl` 规则，没有第二份名单）。因为是解析期就拒绝，`Markdown` 组件自然画成文字，不会再出现「没有 href 的链接」。
2. **去掉缩进代码块**。micromark 关掉 `codeIndented`，再加一个 `indentation.ts`：微解析后扫描顶层块，凡是「标记缩进到四列及以上才成立」的块（标题、引用、围栏、四列缩进段落）就把那几行的行首空白换成一比一的私用区占位字符再解析一次，最后把占位字符还原成原来的空格/制表符。这样 `    # h`、`    > a`、`    ===` 都读成文字，`    ```\n    x\n    ``` ` 读成「文字 + 一个行内代码」，缩进也原样留在文字里——和原版逐字一致。列表、分割线、表格在任何缩进下仍按原样读（原版也是），所以 `\t| a | b |…` 仍是表格、`      - a` 仍是列表。
   - 顺带发现并修了两件同源的事：`parseInlineAst`/`parseInline` 原来先当整篇文档解析再取段落子节点，原版是**只解析行内内容**（`# h` 是文字、围栏是行内代码），改成给每行加占位字符再按行内解析、最后去掉占位字符，节点偏移同步校正。空的任务项 `- [x] ` 被 GFM 丢掉勾选状态，用 `taskList.ts` 补回成「已勾选、无内容」。
3. **插件取词窗口**。把匹配逻辑拆成 `syntaxMatch.ts`（准备 + 在某个位置尝试 tokenize，窗口到 `offset + maxSpan`）和 `inlineSyntax.ts`（在行内文本上按原文扫描、把命中的范围整体替换成扩展节点）。现在 `{{see **this**, [that](…), and - this}}` 一次命中成一个节点，中间生成的粗体/链接节点被节点本身吃掉；命中范围跨过标记时，后面剩下的文字继续扫。
4. **转义前缀不再命中**。`\@{ada}` 里那个 `@` 被反斜杠转义，不当作插件语法起点（原版单遍扫描时 `\@` 已经当转义吃掉了），所以整行只剩后面那个 `@{ada}` 成为节点。扩展节点的 `source` 现在一律取原文切片（带反斜杠的那份），拼回的纯文字用 `decodeLiteralText` 解码转义和字符实体。
5. **`createMarkdownPlugin<Name, Node>`**：按原版补了三个重载，`toText`/`render` 里的 `node.data` 收窄到具体类型。core 新测试按原版的写法（`MarkdownSyntaxPluginDefinition<'mentions', MentionNode>` + 显式泛型实参）验证；richtext 的三个插件定义也改成同样的写法，顺手去掉了 F1a 当时为绕过缺泛型加的 `as never` 和手写参数类型。
6. **链接文字里的插件语法**：链接、链接目标、图片、行内代码、围栏代码都不产出扩展节点（原版把链接文字整体当文字读）。

| 文件 | 行数 | 职责 |
| --- | --- | --- |
| `packages/core/src/Markdown/refusedLinks.ts` | 64 | 解析期把不安全目的地整段读成文字 |
| `packages/core/src/Markdown/indentation.ts` | 170 | 四列缩进的行不当块起始、缩进当文字保留；还原占位字符 |
| `packages/core/src/Markdown/taskList.ts` | 36 | 只有勾选框的任务项保持勾选状态、内容为空 |
| `packages/core/src/Markdown/parse.ts` | 233 | 入口：块解析（含缩进修正的多轮）、行内解析、自动链接与被拒链接 |
| `packages/core/src/Markdown/publicParser.ts` | 117 | 公开入口；`parseInlineAst` 改成只读行内内容后接插件管道 |
| `packages/core/src/Markdown/characterReferences.ts` | 102 | 新增 `decodeLiteralText`（转义 + 字符实体） |
| `packages/core/src/Markdown/url.ts` | 55 | 新增 `isSafeMarkdownParserUrl`，与渲染用清洗共用一套判定 |
| `packages/core/src/Markdown/plugin-protocol/syntaxMatch.ts` | 167 | 插件语法准备与「在某位置试一次 tokenize」 |
| `packages/core/src/Markdown/plugin-protocol/inlineSyntax.ts` | 180 | 在行内原文上扫描命中的范围，替换扩展节点 |
| `packages/core/src/Markdown/plugin-protocol/syntax.ts` | 151 | 块级插件语法、引用（citation）、总调度 |
| `packages/core/src/Markdown/plugin-protocol/protocol.ts` | 347 | `createMarkdownPlugin` 的三个泛型重载 |
| `packages/core/src/Markdown/refusedLinks.test.ts` | 76 | 被拒链接/图片的用例（11 条） |
| `packages/core/src/Markdown/indentation.test.ts` | 86 | 缩进、行内入口、空任务项的用例（20 条） |
| `packages/core/src/Markdown/pluginSyntax.test.ts` | 140 | 插件取词窗口、转义前缀、链接文字不产节点的用例（11 条） |

## 2. 和上游的对照

上游用手写解析器（`parser.ts` 5257 行），我们这边是 micromark + mdast 再后处理，所以做法不同、判定规则逐个对齐。为了确认「效果一样」，我把上游 v0.7.1 的 `parser.ts`、`ast.ts`、`characterReferences.ts`、`url.ts`、`plugins/protocol.ts`、`utils/safeUrl.ts` 取到 `/tmp` 里，用一个 node 脚本直接跑上游的 `parseMarkdownAst` / `parseInlineAst`，再和我们的输出逐条比（语料 40 余条，覆盖缩进、列表、引用、表格、围栏、转义、插件命中）。

| 上游改动 | 上游怎么做 | 我们怎么做 | 为什么效果相同 |
| --- | --- | --- | --- |
| 拒绝不安全地址 | `isSafeMarkdownParserUrl` 判定为不安全时，`[x](…)` / `![a](…)` 整段 push 成 `text`（`parser.ts` 2519 / 2575 行） | 解析后遍历，把不安全目的地节点换成原文切片 | 都是「整段变文字」，连里面的行内代码也不再生成；安全地址仍生成链接，`data:image/png` 这类图片仍保留 |
| 没有缩进代码块 | 块起始检测里根本没有缩进代码分支；`{0,3}` 限制只加在标题、引用、围栏上，列表/分割线/表格不看缩进 | 关掉 `codeIndented`，把「四列缩进才成立」的块的行首空白换成一比一占位字符再解析 | `    # h` 是段落、`    ```\n    x\n    ``` ` 是一个行内代码、`\t\| a \| b \|` 是表格、`    - a` 是列表：逐条比对一致 |
| 缩进当文字保留 | 段落文本原样保留行首空白 | 段落节点按行把 ≥4 列的缩进换成占位字符，解析后还原 | `para\n    cont` 的文本是 `para\n    cont`，和上游逐字相同 |
| 插件取词窗口 | 单遍扫描，`end = min(len, offset + maxSpan)`，命中优先于基础语法 | 后处理阶段按原文偏移扫描，窗口同样到 `offset + maxSpan`（上限取所在段落/标题/表格单元末尾） | `{{see **this**, [that](…), and - this}}` 一次命中，中间不留下粗体/链接节点 |
| 转义前缀 | `\@` 先被当转义消费，`@` 处不再尝试匹配 | 扫描时跳过前面有奇数个反斜杠的位置 | `\@{ada} then @{ada}.` 在两边都是「文字 `@{ada} then ` + 一个节点」 |
| 链接文字不解析插件语法 | `parseInlineImpl(linkText, protectedInlineOptions(opts))`（去掉 plugins） | 扫描时跳过 link / linkReference / image / inlineCode / code | 两边都只在链接文字外面产出节点 |
| `createMarkdownPlugin<Name, Node>` | 三个重载，返回 `MarkdownPluginEntry<Node>` | 照上游 | 类型一致；顺带让 richtext 测试去掉 `as never` |
| 行内入口 | `parseInlineImpl` 直接读行内文本，不读块语法 | 每行加私用区占位字符后解析，再去掉占位字符、校正偏移 | `parseInlineAst('# h')` 是文字，`parseInlineAst('```\nx\n```')` 是一个行内代码 |
| 空任务项 | `- [x] ` 读成「已勾选、无内容」 | 解析后把只剩 `[x]` 文字的第一段认回勾选状态并删掉那段 | 两边 `checked` 都是 `true`，内容都为空 |

## 3. 和计划不一样的地方

1. **第 4 处的原因和 F1a 回报写的不一样。** F1a 写的是「`\@{ada}` 记的 `source` 少了反斜杠」。拿上游跑一遍发现：上游对 `\@{ada}` **根本不出扩展节点**（`\@` 是转义），命中的是同一行后面那个 `@{ada}`，`source` 也确实是 `@{ada}`。真正的差异在富文本这一侧：我们的 core 会在被转义的 `@` 上也命中，于是多出一个节点、反斜杠留成文字。所以修法是「转义位置不命中」，而不是「`source` 补回反斜杠」（`source` 也顺手改成一律取原文切片，将来真有跨转义的匹配也不会丢字符）。
2. **第 2 处顺带改了 `parseInlineAst` / `parseInline` 的语义。** 计划只写「缩进代码块」。查下来的根因是行内入口原来不是纯行内解析，而围栏那条 todo 的富文本一半（`markdownCodeSpans` 用 `parseInlineAst` 判断反引号是不是行内代码）就卡在这里，不改就没法恢复。这是公开 API 的行为变化，已在 docs 的 en/zh Markdown 页各加一句说明。
3. **`- [x] ` 空任务项原计划没列。** 它是 `markdownTaskList` 那条 todo 的直接原因（GFM 在内容为空时丢掉勾选），一并修了。
4. **`indentation.ts` 用了「多轮微解析」而不是一次预处理。** 一轮里换掉占位字符后可能露出下一个该换的块（例如围栏那三行），所以最多重跑 5 轮、直到没有新变化；每轮只增不减，能保证收敛，实测一般 1 到 2 轮。
5. **`syntax.ts` 拆成三个文件**（`syntaxMatch.ts` / `inlineSyntax.ts` / `syntax.ts`）。整块改完会超过 500 行红线，按职责拆开；对外行为不变，`applyMarkdownSyntax` 仍是唯一入口。
6. **插件定义在 richtext 测试里改成显式泛型**（`MarkdownSyntaxPluginDefinition<'mentions', MentionNode>` + `createMarkdownPlugin<'mentions', MentionNode>(…)`），这是上游自己的测试写法，用来验证第 5 处的类型收窄，同时去掉 `as never`。
7. **回调用 `toText` 里的 `node.data` 需要显式泛型才会收窄。** 没有泛型实参时 TypeScript 不会从 `tokenize` 的返回字面量反推 `Node`。这是上游的既有行为（上游测试也都写显式泛型），不是我们这边的缺陷。

## 4. 台账处理

无（这个节点没有台账文件）。

## 5. 自测结果

| # | 自测项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | `grep -rn "it.todo" packages/richtext/src` | 过 | 无输出 |
| 2 | `env -u NODE_ENV pnpm exec vitest run --maxWorkers=2` | 过 | 364 个文件、5090 条用例全过（含构建 core 后不再跳过的 1 条） |
| 3 | `NODE_ENV=production pnpm exec vitest run --maxWorkers=2` | 过 | 364 个文件、5090 条用例，和上一条相同 |
| 4 | `env -u NODE_ENV pnpm exec vitest run --maxWorkers=2 packages/core/src/Markdown packages/richtext`（两种 NODE_ENV 各一次） | 过 | 38 个文件、519 条用例，各跑两遍都是 519 |
| 5 | `env -u NODE_ENV pnpm exec eslint . --max-warnings 0` | 过 | 无输出，退出码 0 |
| 6 | `env -u NODE_ENV pnpm check:packages` | 过 | 包边界、路径大小写、`sync-exports --check`、catalog、单文件行数（最长 `protocol.ts` 347 行）、`!important`、模板变量、i18n 全过 |
| 7 | `env -u NODE_ENV pnpm typecheck` | 过 | 根 tsconfig + 各包（core/richtext/lab/charts/docs）全部 Done |
| 8 | `env -u NODE_ENV pnpm docs:build` | 过 | `build complete in 31.73s`；`vitepress preview --port 5172` 下 `GET /components/markdown` 返回 200 |
| 9 | 视觉对照 | 过 | `/tmp/D14-visual/`：`ours-{light,dark}.png`（整页 1280×7291）、`ours-{light,dark}-demo-{0..6}.png`（7 个示例逐个截）、`upstream-{light,dark}.png`。浅色/深色下 Markdown 页都正常：链接下划线且外链带新窗口、围栏代码块有语言标签与复制按钮、嵌套列表标记、任务列表勾选框、表格、引用都正常；`Rich Content` 示例里 `interface User {name: string;}` 仍是一个代码块（说明没有把缩进写法的内容误当段落），`    # not a heading` 这类用例在组件层另有断言 |
| 10 | 上游逐条对拍 | 过 | 语料 40 余条（缩进、列表、引用、表格、围栏、转义、插件命中），与上游 `parseMarkdownAst` / `parseInlineAst` 的输出逐条 diff。除了两条与本节点无关的既有差异（`***x***` 的强/斜嵌套层序、引用块内行首空白），其余全部一致 |

**core 现有测试一条期望值都没改。** 只新增了三个测试文件（`refusedLinks.test.ts`、`indentation.test.ts`、`pluginSyntax.test.ts`）和 `Markdown.test.ts` 里的两条组件级用例。

## 6. 拿不准的地方

1. **引用式链接的不安全目的地还没在解析期处理。** `[x][ref]` + `[ref]: javascript:…` 现在靠渲染层的 `sanitizeMarkdownLinkUrl` 兜底：画出来是「只剩链接文字、没有 a 标签」，原版是把 `[x][ref]` 整段画成文字。这一条不在 F1a 列的 6 处里（那 6 处都只涉及行内目的地），要严格对齐得连 `linkReference` 的原文回填一起做，建议另开一条。
2. **性能**：`parseMarkdown` 遇到四列缩进的段落/块时最多多解析 1 到 2 次；`parseInlineContent` 每行加一个占位字符。Markdown 的既有用例（含流式、`Markdown.test.ts` 整页）跑下来没有可感知的变化，但没有专门的性能基准，建议验收时留意超长文档（几百 KB）的首屏解析时间。
3. **`\t| a | b |` 这类制表符缩进的表格**在 micromark 关掉 `codeIndented` 后刚好和原版一致；但制表符 + 标题/围栏/引用（`\t# h` 之类）我们是靠「缩进里有制表符也算够深」来保护的，规则是照着探测结果写的，不是照抄原版实现。验收时如果要看这一类边界，我可以补一组对角用例。
4. **两条残留的既有差异**（本节点未动）：`***x***` 我们读成 emphasis>strong，原版是 strong>emphasis；引用块内部行首空白我们会被 CommonMark 吃掉（原版保留）。两者在 HTML 渲染上看不出来，只在 AST 文本层可见。
5. 一次全量跑里出现过 1 条失败（后续同一命令连跑 3 次、以及两种 NODE_ENV 下的全量跑都是全绿），没能复现，判定为别处的偶发（大概率是时间/动画相关用例）。如果验收时再现，把用例名发我，我单独查。

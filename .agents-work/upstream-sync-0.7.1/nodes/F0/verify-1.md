# F0 第 1 轮验收报告

## 结论：不通过

ADR 的结构完整，大方向（richtext 用 Lexical，charts 用 d3 加 SVG，vega 和 build 不做）有依据，我能复现。但下面几项没过：

- 有 2 处上游事实写错（第 4 项）。
- 有 1 处上游发布标记写漏（第 6 项）。
- F1b 的依赖漏了 C3（第 12 项）。
- 好几个专业词第一次出现时没有解释（第 16 项）。

后面 F1 到 F6 要照着这份记录开工，所以这几处要先改掉。

- 验收者只读：工作区开始和结束时的 `git status --short` 都是空，两次一致。
- 依赖只装在 `/tmp/verify-F0/lex` 和 `/tmp/verify-F0/tip`，跑完已经删掉 `node_modules`。

## 逐条结果

| 编号 | 检查项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | 覆盖 6 个问题和公共问题的各子项 | 过 | 第 2 到 7 节分别回答 richtext、charts、lab、vega、build、公共问题。7.1 讲包结构和 AST-080，7.2 讲版本，7.3 是接入清单，7.4 讲 F4 |
| 2 | 每个问题有选项对比、推荐和理由 | 过 | 2.2 到 2.5、3.2 到 3.3、4.3、5.2 到 5.3、6.2 都有 |
| 3 | lab 19 个组件逐个有结论 | 过 | `git ls-tree --name-only v0.7.1 packages/lab/src/` 列出 19 个目录。ADR 4.1 表有 19 行，Chat 里的 4 个子组件也逐个交代了 |
| 4 | 抽查 5 处以上上游路径和内容描述 | **不过** | 路径都存在，但有描述错误，见下一节 A、B |
| 5 | 至少 3 处外部事实 | 过（有小瑕疵） | 重新查了 `npm view`、api.npmjs.org、`gh api`，下面这些和 ADR 一致：lexical 0.52.0（2026-09-28 发布）；lexical-vue 0.18.0（2026-10-10 发布），`dependencies` 里写死 lexical 0.50.0，作者本人 720 次提交；tiptap 周下载 1,074,980；d3-scale 4.0.2（2023 年）；`@lexical/headless@0.52.0` 带 happy-dom；`@astryx-vue/{lab,richtext,charts,nuxt}` 在 npm 上都是 404。ADR 写了查询日期 2026-10-20。瑕疵见 C |
| 6 | 发布渠道和关键依赖与 `package.json` 一致 | **不过** | richtext、lab、vega、build 都对：richtext 和 build 的 `latest` 是 0.7.1，charts、lab、vega 的 `latest` 是 0.0.0-bootstrap.0。但 ADR 第 1 节表里 charts 只写了 `"private": true`。上游 `packages/charts/package.json` 实际还有 `astryx.canaryOnly: true`，和 lab、vega 一样 |
| 7 | AST-080 要点准确 | 过 | 读原文 `docs/specs/AST-080-package-stylesheets/spec.md`，FR1 到 FR6 都概括对了（样式表文件名，非 core 包不重复 core 的定义，每个文件自己声明 `@layer reset, astryx-base, astryx-theme`，`exports` 和 `sideEffects`，文档要写清楚）。DEC-1 的意思也对 |
| 8 | 选型理由从用户体验出发 | 过 | 抽查 richtext：讲了编辑手感、Markdown 原样往返、公开 API 能做到的事。抽查 charts：讲了「画出来的图和交互能不能和上游一致」。build：讲了「问题在我们这边不存在」。没有只写「上游用它」 |
| 9 | richtext 的对比 | 过（带保留） | Lexical、lexical-vue、Tiptap、Milkdown 都有。往返、手感、体积、维护、和 Markdown 组件的关系都讨论了。ADR 里「交给用户拍板」的利弊在回报里列清楚了。保留意见见 B 和 D |
| 10 | charts 的 WebGL | 过 | 3.3 写了 F2 不做、拆成 F2d 延后。理由 1 和 2（上游自评 Needs work，也不在第一批）站得住。理由 3「设备内存也紧」是过程限制，不是产品理由，建议删掉 |
| 11 | vega 和 build 的理由 | 过 | vega 先不做，替代办法是直接用 `vega-embed`，主题片段可选。build 不做，因为 StyleX 撞名问题在我们这里不存在，AST-080 DEC-1 也要求加载预构建样式表 |
| 12 | 风险和各 F 节点范围，F1a 和 F2a 的纯逻辑写清楚 | **不过** | F1a、F2a 的清单具体，风险一节也有。但 F1b 的依赖漏了 C3。见 E |
| 13 | 试验附录和复现 | 过 | 附录 A、B 写了做法和结果。我复现了：Lexical 12 个样例 10 个原样，只有 `__bold__` 和 `~~~` 变了；Tiptap 12 个样例 6 个原样，变的有嵌套缩进、`*` 变 `-`、`__bold__`、Setext、表格、`~~~`。脚本来自 `/tmp/f0-spike/`，装在 `/tmp/verify-F0/` 里跑的。注意事项见 B |
| 14 | 台账打勾并引用有效节号 | 过 | `ledger/F0.md` 唯一一条 `fc89798e6` 已打勾，写了「已采纳：见 `docs/adr/0001-new-packages.md` 第 7.1 节」，7.1 节存在 |
| 15 | 没改 ROADMAP、SWARM、源码、依赖 | 过 | `git diff $(git merge-base HEAD swarm-tree) --stat` 只有 `ledger/F0.md`（改 3 行）和 `docs/adr/0001-new-packages.md`（新增 580 行） |
| 16 | 中文大白话，专业词有解释 | **不过** | 整体是中文大白话。但下列词第一次出现时没有解释，全文也没有定义：WebGL（第 15 行首次出现）、着色器、d3、SVG、比例尺、`DecoratorNode`（装饰节点）、`Teleport`、headless 和 happy-dom、Changesets 的 `fixed` 组。已经解释过的有 ADR、dist-tag、canary、peer、StyleX、GFM、mark |
| 17 | `pnpm lint` 和行数检查 | 过 | `env -u NODE_ENV pnpm lint` 退出码 0，无输出。`node scripts/check-line-limit.mjs` 输出「源码单文件行数检查通过」 |

## 不过项的证据

**A. 第 4 项：`textSemantics.ts` 描述错误。**

- 位置：ADR 2.1 插件表、2.6 的 F1a 清单。
- ADR 写的是「粘贴 HTML 时，保留粗体、斜体这些语义」。
- 上游文件头注释写的是：它给删除线文字加 `<del>`，给粗斜体文字加 `<em>`，让读屏软件能读出「删除」和「强调」（spec AST-061 FR7）。全文没有粘贴或剪贴板的逻辑。
- 这是用户能感受到的效果（读屏），F1b 如果照 ADR 的描述去做，会做错东西。

**B. 第 4 项：「29 个 Markdown 纯逻辑测试几乎能直接搬」不准确。**

- 位置：ADR 2.1、2.4、2.5。
- 实际 `packages/richtext/src/markdown*.test.*` 一共 27 个文件，共 5437 行。加上 `textSemantics.test.tsx` 和 `publicSurface.test.ts` 才凑到 29 个。
- 27 个文件里有 5 个是 `.tsx`，用 `@testing-library/react` 去挂载 `RichTextEditor`：markdownSource、markdownTable、markdownTaskList、markdownThematicBreak、markdownRefusedLinks。
- 27 个文件里有 17 个依赖 `@astryxdesign/core/Markdown/parser`，而不是只依赖 lexical、`@lexical/headless`、`@lexical/markdown`。这 17 个能不能搬，取决于 C9 能不能提供解析器。ADR 在风险一节提到了 C9，但 2.4 和 2.5 的论据写得过于乐观。
- 往返数字的可比性：Lexical 的「10/12」里，表格和 Setext 标题没有被解析成结构，而是当普通文本原样保留。表格那一行 ADR 附录写了，Setext 没写。去掉这两个后，Lexical 是 8/10，Tiptap 是 5/10，方向不变，但要把「10 比 6」的口径写清楚。

**C. 第 5 项和第 4 项的小瑕疵。**

- 5.1 写「`vega` 6.4.0，`vega-lite` 6.5.0，周下载 730,758」。730,758 是 vega-lite 的，vega 是 751,410。
- 5.1 写「vega 源码一共约 680 行」。实际非测试文件是 926 行，680 是去掉 `types.ts` 和 `index.ts` 之后的数。
- 4.1 写 ListInput 用 core 的 `List`。上游 ListInput 没有导入 `List`，它导入的是 Button、EmptyState、Field、FieldStatus、Icon、IconButton、Layer、Table 等。
- 7.3 写 `build-catalog.ts` 写死 core 的行号是 63、101、143、160、219、256。第 63 行不含 `@astryx-vue/core` 字样，还漏了第 42 行和第 142 行。

**D. 第 9 项的保留意见：「照搬即可」与风险一节自相矛盾。**

- 2.4 对比表写「和 core Markdown 共用解析：上游本来就共用 core 的解析器和插件协议，照搬即可」。
- 2.7 却承认我们 core 现在没有上游那套（`parseMarkdownAst`、`decodeMarkdownCharacterReferences`、`getMarkdownPluginCapabilities`）。
- 上游 `markdownCharacterReferences.ts` 还用了 `parseInlineAst`，ADR 没列。
- 我在 `packages/core/src` 里 grep 了 `parseMarkdownAst`、`decodeMarkdownCharacterReferences`、`getMarkdownPluginCapabilities`，都没有。

**E. 第 12 项：F1b 依赖漏了 C3。**

- ADR 2.6 和第 8 节都说 `RichTextEditorToolbar` 用 core 的 `Selector`。上游 `RichTextEditorToolbar.tsx` 也确实导入 `@astryxdesign/core/Selector`。
- 但 `Selector` 在 ROADMAP 的 C3（选择器家族）。第 8 节 F1b 的依赖列了 F1a、C1、C6、C7、C16、C14、C2，没有 C3。
- 另外，ADR 对「core 有没有颜色解析工具」只写了「需要先确认」，一次 grep 就能查清：core 里没有 `parseHex` 一类函数，只有 `Theme/hct.ts` 里一个私有的 `parseHexChannels`。F2a 的范围里应该直接写结论。

## 不通过的项要怎么改

1. 改 2.1 和 2.6 对 `textSemantics.ts` 的描述：它是 `<del>` 和 `<em>` 的 DOM 渲染覆盖，目的是让读屏软件读出删除和强调。再想一想它归 F1a 还是 F1b，因为它依赖编辑器 DOM。
2. 修正测试数量和性质：27 个 markdown 测试加 2 个其它测试；说明其中 17 个依赖 core 的 Markdown 解析器、5 个是 React 挂载测试。把 2.4 和 2.5 的「几乎能直接搬」改成「纯逻辑那部分能搬，依赖 C9」。把往返数字的口径写清楚：表格和 Setext 在 Lexical 里是当文本保留的。
3. 第 1 节表里 charts 的标记改成 `"private": true` 加 `astryx.canaryOnly`。
4. 第 8 节 F1b 的依赖补上 C3；颜色解析工具直接写结论。
5. 给 WebGL、着色器、d3、SVG、比例尺、DecoratorNode、Teleport、headless、happy-dom、`fixed` 组各补一句大白话解释，放在第一次出现的地方。
6. 顺手修正 C 里列的小事实：vega 和 vega-lite 的下载量、vega 源码行数、ListInput 的依赖、`build-catalog.ts` 的行号。建议改成不写行号，只写「该文件里所有写死 core 的地方」。再删掉 3.3 里「设备内存也紧」这条理由。

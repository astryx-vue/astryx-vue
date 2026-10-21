# F0 第 2 轮验收报告

## 结论：通过

第 1 轮的 6 条问题全部改对了，我逐条用上游 `v0.7.1` 源码和 `npm view` 核对过。实现者和第 1 轮验收报告有分歧的那一处，实现者是对的：去掉表格和 Setext 两个样例后，Tiptap 是 6/10，不是 5/10。我是我自己重新装依赖复算的。通读时额外改的内容，我抽查了 12 处，没有发现错误。

- 17 条检查项全部「过」。
- 工作区开始和结束时的 `git status` 完全一致（干净）。
- 依赖只装在 `/tmp/verify-F0-r2/lex` 和 `/tmp/verify-F0-r2/tip`，跑完已删掉 `node_modules`。
- 有 3 个小瑕疵，不影响结论，见末尾「小问题（不阻塞）」。

## 逐条结果（17 条）

「沿用第 1 轮」的意思是：我用 `git diff HEAD~1 -- docs/adr/0001-new-packages.md` 看过，对应段落第 2 轮没有改动，或者只改了不影响结论的句子。

| 编号 | 检查项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | 覆盖 6 个问题和公共问题的各子项 | 过 | 章节：2 richtext、3 charts、4 lab、5 vega、6 build、7 公共问题（7.1 包结构和 AST-080、7.2 版本、7.3 接入清单、7.4 和 F4 的关系）。第 2 轮没有删章节。 |
| 2 | 每个问题有选项对比、推荐和理由 | 过 | 2.2 到 2.5、3.2 到 3.3、4.3、5.2 到 5.3、6.2 都在。4.2、4.3、5.3、6.2、7.4 第 2 轮 0 处改动，沿用第 1 轮。 |
| 3 | lab 19 个组件逐个有结论 | 过 | `git ls-tree --name-only v0.7.1 packages/lab/src/` 有 19 个组件目录加 `index.ts`、`reorderStyles.ts`。4.1 表里 Stat、CircularProgress、InfoTip、SVGIcon、LogStream、Schedule、ListInput、TransferList、MobileTokenizer、Drawer、Tour、Chat、ChatReasoning、CodeEditor、DiffViewer、Chart、Radial、Sankey、ThreeD 共 19 行，一个不少。 |
| 4 | 抽查 5 处以上上游路径和内容描述 | 过 | 本轮核对了 10 处，全部和 ADR 一致：`textSemantics.ts`（见复核 1）、`packages/charts/package.json`（`private` + `canaryOnly`）、`RichTextEditorToolbar.tsx` 的 core 导入、`TaskCheckboxPlugin.tsx`、`editorNodes.ts`、`webgl.ts`（262 行，只导入 `parseHex`、`toGLFloats`）、`utils/color.ts`（170 行，6 个函数）、`vite.ts` 别名块、`CHARTV2_READINESS.md`（`dotGLInteractive`、`heatmapGL` 为 Needs work，`dotGL`、`streamGL` 为 Minor polish，第一批含配色和 `currency`）、`ChatEmojiPicker`/`ChatReactionBar`（Popover、TextInput、Tooltip）。 |
| 5 | 至少 3 处外部事实，查询日期写在 ADR 里 | 过 | 本轮重新查（2026-10-21）：`lexical` 0.52.0；`lexical-vue` 0.18.0，`dependencies.lexical` 为 `0.50.0`；`@lexical/headless@0.52.0` 的 `happy-dom` 为 `^20.9.0`；`@tiptap/vue-3` 3.32.0，周下载 1,074,980；`vega` 6.4.0 / 751,410，`vega-lite` 6.5.0 / 730,758，`vega-embed` 7.3.0 / 535,675（统计区间 10-12 到 10-18）；`d3-scale` 4.0.2；`@astryx-vue/{lab,richtext,charts,nuxt}` 均 E404。ADR 写明了查询日期 2026-10-20 和复核日期 2026-10-21。 |
| 6 | 发布渠道和关键依赖与 `package.json` 一致 | 过 | charts、lab、vega 的 `package.json` 都是 `"private": true` + `"canaryOnly": true`，ADR 第 1 节表格已把 charts 改对。`npm view @astryxdesign/<包> dist-tags`：richtext `latest` 0.7.1，build `latest` 0.7.1，charts、lab、vega 的 `latest` 都是 `0.0.0-bootstrap.0`，和表一致。vega 的 peer 依赖是 `react`、`react-dom`、`vega`、`vega-lite`，和 5.1 一致。canary 版本号会变（我现在查到 `0.7.2-canary.6a3ff0f`），ADR 已在表头写明「上游每次合入都会变」，并保留查询当天的值。 |
| 7 | AST-080 要点准确 | 过 | 7.1 只在 FR4 后面加了一句摇树（tree-shaking）的解释，意思对。FR1 到 FR6 的概括第 2 轮没有改，沿用第 1 轮。 |
| 8 | 选型理由从用户体验出发 | 过 | 重新抽查 2.5 和 3.3。2.5 理由 1 讲「公开 API 能做到的事要一致」，对应 `RichTextEditor.doc.mjs` 第 187 行原文（`nodes` 和 `transformers` 接收 Lexical 类型，`plugins` 接收 Lexical 的 React 插件）。3.3 的判断标准是「画出来的图和交互能不能和上游一致」。都不是只靠「上游用的就是它」。 |
| 9 | richtext 对比 | 过 | Lexical、lexical-vue、Tiptap、Milkdown 四个方案都有。往返、手感、体积、维护、和 Markdown 组件的关系都写了。2.4 里「照搬即可」「几乎能直接搬」已删掉（`grep` 无残留），改成「前提是 C9 提供解析器」。往返数字复算见复核 2。 |
| 10 | charts 的 WebGL | 过 | 3.3 写了 F2 不做、拆成 F2d 延后，理由 1 和 2 站得住。「设备内存也紧」已删（`grep` 无残留）。 |
| 11 | vega 和 build 的理由 | 过 | vega：替代办法是用官方 `vega-embed`，主题配置可作文档片段。vega 的行数我重新数过：`src/` 非测试共 999 行，`.ts/.tsx` 为 234+202+197+187+63+43=926，去掉 `types.ts` 202 和 `index.ts` 43 得 681，`VegaChart.tsx`+`viewInputs.ts`=421。与 ADR 一致。build：`vite.ts` 的别名块（`locales/*.generated.js`、`locales/*.json`、`tokens.stylex`、`@astryxdesign/core` 共 4 条，外加 `optimizeDeps.exclude`）与 6.1 的描述一致，已不再写行号。6.2 本轮 0 处改动，沿用第 1 轮。 |
| 12 | 风险和各 F 节点范围，F1a 与 F2a 的纯逻辑写清楚 | 过 | F1a：2.6 列了 19 个文件加子路径入口（`markdown.ts` 即子路径入口，18 个 `markdown*.ts` 都覆盖），并把 `textSemantics.ts` 挪到 F1b。F2a：3.4 列了 `formatters`、`getChartColors`、`layout`、`legend`、`markColor`、`tooltip`、`utils`、`types`，我 grep 过，这几个文件除 `types.ts` 外都不含 React 或 StyleX。第 8 节 F 节点依赖的抽查见复核 4。 |
| 13 | 试验附录和复现 | 过 | 在 `/tmp/verify-F0-r2/` 用第 1 轮的 lock 文件重新装并重跑，结果见复核 2：Lexical 10/12，Tiptap 6/12；去掉表格和 Setext 后 Lexical 8/10，Tiptap 6/10。附录 B 本轮 0 处改动，沿用第 1 轮。 |
| 14 | 台账打勾并引用有效节号 | 过 | `ledger/F0.md` 的 `fc89798e6` 已打勾，写「见 `docs/adr/0001-new-packages.md` 第 7.1 节」，7.1 节存在。第 2 轮没有改这个文件（`git diff HEAD~1 --stat -- .agents-work` 为空）。 |
| 15 | 没改 ROADMAP、SWARM、源码、依赖 | 过 | `git diff $(git merge-base HEAD swarm-tree) --stat` 只有 `ledger/F0.md`（3 行）和 `docs/adr/0001-new-packages.md`（613 行新增）两个文件。第 2 轮的提交只动了 ADR（`git diff HEAD~1 --stat`：+114 / -81）。 |
| 16 | 中文大白话，专业词有解释 | 过 | 第 1 轮点名的词现在都有解释，并且都放在第一次出现的地方或紧挨着：WebGL、d3、SVG（「一句话结论」表下方）、着色器和 canvas（3.1）、比例尺（3.1）、`DecoratorNode`、`Teleport`、mutation 监听（2.5 API 对照表）、headless（2.1）、happy-dom（2.3）、`fixed` 组（7.2）、Changesets（第 1 节）。另外补了 tsdown、unplugin-vue、remark、mdast、`provide/inject`、VNode、摇树、CSS Custom Highlight API、`m4Reduce`。还有 3 个小遗漏，见末尾。 |
| 17 | lint 和行数检查 | 过 | `env -u NODE_ENV pnpm lint` 退出码 0（`eslint . --max-warnings 0`）。`node scripts/check-line-limit.mjs` 输出「源码单文件行数检查通过（上限 500 行）」。 |

## 第 1 轮 6 条的复核

### 复核 1：`textSemantics.ts` 的描述 —— 改对了

- 上游文件头注释（`git show v0.7.1:packages/richtext/src/textSemantics.ts`）：它让删除线文字外面套 `<del>`，粗斜体文字外面套 `<em>`，目的是让读屏软件读出「删除」和「强调」（spec:AST-061 FR7）。文件里只导入 `@lexical/html` 的 `DOMRenderExtension`、`domOverride` 和 `lexical`，`grep` 没有 paste 或 clipboard。
- 新 ADR 2.1 插件表的描述和上面一致，并写明「文档内容和导出的 Markdown 都不变，和粘贴没有关系」。
- 2.6 把它从 F1a 挪到 F1b。理由成立：它改的是编辑器画出来的 DOM，`textSemantics.test.tsx`（368 行）用 `@testing-library/react` 的 `render` 挂载组件。

### 复核 2：测试数量、性质和往返口径 —— 改对了，且 6/10 是对的

数量，我重新数过：

| 项 | 上游实际 | ADR |
| --- | --- | --- |
| `markdown*.test.*` 总数 | 27 个，5437 行 | 27 个，5437 行 |
| 其中 `.ts` / `.tsx` | 22 个 3650 行 / 5 个 1787 行 | 同 |
| 5 个 `.tsx` | RefusedLinks、Source、Table、TaskList、ThematicBreak | 同 |
| 直接导入 `core/Markdown/parser` | 17 个 | 17 个 |
| 剩下 10 个 | 9 个（`markdownListIndentation`、`ListThematicBreakInside`、`OrderedList`、`Source.tsx`、`SpaceRuns`、`TabRuns`、`Table.tsx`、`TableLinks`、`ThematicBreak.tsx`）通过 `markdownSerializers` 或 `markdownSource` 间接用到；只有 `markdownExtensionSelection.test.ts` 不经过 | 同 |
| 18 个 `markdown*.ts` 源码 | 4374 行 | 「约 4400 行」 |
| `textSemantics.test.tsx` / `publicSurface.test.ts` | 368 行 / 42 行 | 同 |

往返数字，我自己复算（第 1 轮留下的 `rt12.mjs`、`rt.mjs` 和 lock 文件，在 `/tmp/verify-F0-r2/` 重新 `npm ci` 后运行）：

- Lexical：12 个样例，10 个原样；变的只有 `__bold__ text` 和 `~~~` 围栏。带不带 `TableNode` 结果相同。
- Tiptap：12 个样例，6 个原样；变的有嵌套缩进、`*` 列表、`__bold__`、Setext、表格、`~~~`。
- 我用 `probe.mjs` 看了 Lexical 导入后的节点类型：Setext 和表格都只有一个 `paragraph`，即当普通段落文字保留，没有读成标题和表格。
- 去掉这两个样例：Lexical 两个都是「原样」，所以 10-2=8，是 8/10。Tiptap 这两个都是「变了」，原样的个数还是 6，是 6/10。

**谁对：实现者对，第 1 轮报告写的 5/10 是我当时算错了。** 变的是分母，不是分子。方向（Lexical 明显更好）没有变。ADR 2.3、2.4、附录 A.2 的口径写得对，也写明了 Setext 和表格是当文字保留的。

「几乎能直接搬」「照搬即可」已删。2.4 现在写「22 个不挂载组件的纯逻辑测试可以搬，但大多数要用 core 的解析器做对照，能不能搬取决于 C9」，和上面的数据吻合。

### 复核 3：charts 发布标记 —— 改对了

上游 `packages/charts/package.json` 第 4 行 `"private": true`，第 23 到 25 行 `"astryx": {"canaryOnly": true, ...}`。ADR 第 1 节表格 charts 一行是 `"private": true` + `astryx.canaryOnly`，和 lab、vega 一致。

### 复核 4：F1b 依赖补 C3，颜色工具给出结论 —— 改对了

- 我把 richtext 非测试源码里全部 `@astryxdesign/core*` 导入列了出来。`RichTextEditorToolbar.tsx` 导入了 Toolbar、IconButton、`Selector`、ToggleButton、Divider、Dialog、TextInput、Button、Stack、Layout、Icon；`RichTextEditor.tsx` 导入 Field、VisuallyHidden、SizeContext；`TaskCheckboxPlugin.tsx` 导入 CheckboxInput；`CodeSyntaxPlugin.tsx` 导入 CodeBlock。**没有任何菜单家族（C6）组件**，所以 F1b 去掉 C6 成立。
- F1b 依赖现在是 F1a、C1、C2、C3、C7、C14、C16。逐个对照 ROADMAP：Field/TextInput 在 C1，ToggleButton/CheckboxInput 在 C2，Selector 在 C3，Dialog 在 C7，Toolbar/Divider/Layout/Stack 在 C14，Button/IconButton/Icon 在 C16。`CodeBlock` 属于 C9，已通过 F1a 依赖 C9 覆盖。没有漏。
- 颜色工具：上游 `core/src/utils/color.ts` 170 行，有 `parseHex`、`parseRgb`、`parseColor`、`formatHex`、`formatColor`、`toGLFloats`，从 `utils/index.ts` 导出。这个文件最早在 `d3b670008` 加入（`v0.1.5` 已包含），早于 B7 台账范围，`ledger/B7.md` 里确实没有 `utils/color`。我们 core 没有 `utils` 目录；`Theme/contrast.ts` 有 `parseColor`，`Theme/hct.ts` 有 `formatHex` 和私有的 `parseHexChannels`。3.4 写的「F2a 在 charts 包里自己移植 `color.ts`」成立。`resolveThemeTokens` 在上游 `theme/tokens.ts`，我们 core 里 `grep` 没有，3.4 的说法也对。

### 复核 5：术语解释 —— 补齐了

第 1 轮点名的 10 个词（WebGL、着色器、d3、SVG、比例尺、`DecoratorNode`、`Teleport`、headless、happy-dom、`fixed` 组）都在第一次出现处或紧挨着有一句大白话解释。我用 `grep -n` 看了每个词的首次位置。

### 复核 6：小事实 —— 改对了

- vega 周下载：751,410（vega）、730,758（vega-lite），重新查过一致。
- vega 源码行数：见检查项 11。
- ListInput：上游导入 Button、EmptyState、Field、FieldStatus、Icon、IconButton、Layer、Table（只用类型 `ColumnWidth`）等，**没有导入 `List`**。ADR 4.1 已改对。
- `build-catalog.ts`：已不写行号，改成「该文件里所有写死 core 的地方」，并举了三个例子。我在文件里确认这三个都存在：字符串 `@astryx-vue/core`（第 42、101、143 行等）、读 `packages/core/package.json`（第 63 行）、`INSTALLABLE_PACKAGES`（第 160 行）。
- 「设备内存也紧」：已删。

## 通读额外改动的抽查（12 处）

| # | 抽查项 | 结果 | 证据 |
| --- | --- | --- | --- |
| a | lab 表：Stat、LogStream（只用 token，不用 core 组件） | 对 | 非测试源码里 core 导入只有 `import type {BaseProps} from '@astryxdesign/core'`、`theme/tokens.stylex`、`utils` 里的 `mergeProps`/`themeProps`/`focusOutlineStyles`。Stat、CircularProgress、LogStream、ChatReasoning 都一样。 |
| b | lab 表：Drawer | 对（主要依赖没写全） | 上游确实用 `Dialog` 的类型 `DialogPurpose`、`Layer`、`Layout`、`useFocusTrap`、`useScrollLock`。还导入 Button、Heading、Text、Icon，ADR 的表格没列，但第 8 节 F3c 依赖里有 C16（Button、Heading、Text、Icon），不影响开工。 |
| c | lab 表：Schedule 和 F3b2 | 对 | Schedule 导入 Popover、DropdownMenu、ButtonGroup、Token、Spinner、Layer、Stack、Text 等；`core/utils` 里去重后有 13 个 `plainDate*` 函数，和 ADR「13 个函数」吻合。没有导入 Calendar、DateInput、DatePicker（grep 为空），所以换成 B7 成立。我们 core 里 `plainDate` 的 grep 为空，B7 台账有 `utils/plainDate.ts`。Schedule 非测试源码合计 5726 行，和「约 5700 行」吻合。 |
| d | lab 表：CodeEditor | 对 | 上游导入 `tokenize`、`tokenizeAsync`、`SYNC_TOKENIZE_THRESHOLD`，以及 `ensureHighlightStyles`、`applyHighlightRangesFlat`。我们 core 的 `Code/` 里有前三个和 `applyHighlightRanges`，`ensureHighlightStyles`、`applyHighlightRangesFlat` 的 grep 为空。ADR 描述正确。 |
| e | lab 表：TransferList、ListInput、Radial、Sankey、ThreeD、Chart、MobileTokenizer | 对 | 逐个列过导入，和 ADR 一致（Radial 只用 Layer、VisuallyHidden；Sankey 只用 VisuallyHidden；ThreeD 用 `useMediaQuery`，GL 散点用 `parseHex`、`toGLFloats`）。 |
| f | 「任务勾选框不是装饰节点」 | 对 | `TaskCheckboxPlugin.tsx` 头注释写明「the checkbox is a sibling of the editable text, positioned over the space at the start of the item」，用 `useState` 存位置，渲染绝对定位的 `<div>` 加 `CheckboxInput`，没有 `DecoratorNode`。`editorNodes.ts` 默认节点里真正的装饰节点只有 `RichTextExtensionNode`（`extends DecoratorNode`）。我在 node 里 `require('@lexical/extension')` 验证了 `HorizontalRuleNode` 继承 `DecoratorNode`，`decorate()` 的函数体是 `return null`。 |
| g | 2.5 理由 3：扩展导出位置 | 对 | 我在 node 里逐个 `require`：`RichTextExtension`（`@lexical/rich-text`）、`HistoryExtension`（`@lexical/history`）、`TableExtension`（`@lexical/table`）、`LinkExtension`（`@lexical/link`）、`CheckListExtension`（`@lexical/list`）都存在；`@lexical/extension` 里有 `buildEditorFromExtensions`、`defineExtension`、`HorizontalRuleNode`，没有 `RichTextExtension`。 |
| h | 4.1 lab 与 charts 两份 `getChartColors.ts`、`webgl.ts` | 对 | lab 版 254 行 / 198 行，charts 版 280 行 / 262 行；`git diff --stat` 分别是 116 行和 80 行变动，和 ADR「80 到 116 行」吻合。lab 版 `getChartColors.ts` 导入 `parseHex`、`parseColor`、`formatColor`，`webgl.ts` 导入 `parseHex`、`toGLFloats`。 |
| i | F2b 补 C14、C16、B7 | 对 | `Chart*.tsx` 导入 `Text`、`VStack`、`HStack`、`VisuallyHidden`、`useLocale`、`useTranslator`、`useLayer`、`useMergedRefs`、`useTheme`；`ChartAxis.tsx` 第 23 行导入 `characterCount`、`truncateCharacters`。B7 台账第 135 到 137 行是 `86a7f1752`（`utils/characters.ts`）。HStack、VStack 在 C14（Stack），Text 在 C16。 |
| j | F3b 去掉 C15 | 对 | InfoTip 用 Tooltip、Icon；Stat、CircularProgress、SVGIcon、LogStream 不用 core 组件。Spinner 只有 Schedule 用。 |
| k | F3c 去掉 C8 | 对 | Drawer 和 Tour 的非测试 TSX 里没有导入 BottomSheet；`grep BottomSheet` 的命中只是 `Drawer.tsx` 头注释和 `Drawer.doc.mjs` 里的文字说明。 |
| l | F3e 补 C7 | 对 | `ChatEmojiPicker`/`ChatReactionBar` 用 Popover、TextInput、Tooltip。ROADMAP 里 C10 的依赖是 C9 C6 C1，不含 C7，所以要单独加。 |

另外 5.1 的「vega 周下载」「4.1 的 `CommandPalette` `670d7a095`」「`CodeBlock` `e6beddb4e`」我也核对过：前者是 `feat: graduate XDSCommandPalette to core`，且删掉了 lab 里的 CommandPalette 文档；后者删掉了 `packages/lab/src/CodeBlock/index.ts`。

## 小问题（不阻塞）

1. **术语小遗漏**：`esbuild`、`gzip`、「design token」第一次出现时没解释；2.3 第 2 条第一次提到「Setext 标题」时也没解释（下一条才有「下划线式标题」）。这几个对看懂结论影响不大，F1a 开工前顺手补一句即可。
2. **4.1 表里部分行的「主要依赖」没列全**：Drawer 缺 Button、Heading、Text、Icon，Tour 缺 Text，Schedule 缺 Button、IconButton、Icon、Stack、Text。第 8 节的依赖里都有，所以不影响开工。
3. **工作区没有对到最新的 swarm-tree**：`git merge-base HEAD swarm-tree` 是 `31e3a2e`，swarm-tree 上现在多了 `383c402`、`a4ef127` 两个提交（只改 `.agents-work/` 下的 ROADMAP 和 B3 的文件，我看了 `git diff --stat 31e3a2e swarm-tree`）。它们不碰 ADR 和 F0 台账，合入时不会冲突，但合入前如果要求"已对齐最新"，需要再 rebase 一次。

## 不通过的项要怎么改

无。

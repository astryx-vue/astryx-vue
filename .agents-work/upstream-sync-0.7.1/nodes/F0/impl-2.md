# F0 第 2 轮实现回报

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/F0`，分支 `sync/f0-new-packages-adr`。先跑了 `git rebase swarm-tree`，成功。
- 提交：`e48b073 docs: ADR 0001 第 2 轮返工，修正上游事实描述、补全依赖和术语解释`（未推送）。父提交是 rebase 后的 `755b589`。
- 只改了 `docs/adr/0001-new-packages.md`（+114 / -81）。没改 ROADMAP、SWARM、源码和依赖，没开浏览器，没读 verify.md。
- 核对方法：
  - 上游源码都用 `git -C astryx-upstream show v0.7.1:<路径>` 读，或者把每个目录非测试源码里的 `@astryxdesign/core*` 导入全部列出来。
  - 外部事实在 2026-10-21 走代理重新跑了 `npm view` 和 api.npmjs.org。
  - Lexical 和 Tiptap 往返试验：用 `/tmp/f0-spike/*/package-lock.json` 在 `/tmp/f0-spike2/` 重新安装后重跑。跑完已删掉 `node_modules`。

## 验收报告 6 条，逐条处理

### 第 1 条：`textSemantics.ts` 的描述

- 核对结果：验收报告说得对。
  - 文件头注释写的是：删除线文字套一层 `<del>`，粗斜体文字套一层 `<em>`，目的是让读屏软件读出删除和强调（spec AST-061 FR7）。
  - 104 行全文没有粘贴或剪贴板的逻辑，只导入了 `@lexical/html` 的 `DOMRenderExtension`、`domOverride`，以及 `lexical`。
- 改法：
  - 2.1 插件表改写成上面的意思，并写明「文档内容和导出的 Markdown 都不变，和粘贴没有关系」。
  - 2.6 把它从 F1a 挪到 F1b。理由：它不碰 Vue，但它改的是编辑器画出来的 DOM，只有 `RichTextEditor` 和 `RichTextView` 用它。`textSemantics.test.tsx` 也要挂载 React 组件才能验证。

### 第 2 条：测试数量、性质和往返口径

- 核对结果：
  - 27 个 `markdown*.test.*`，共 5437 行：22 个 `.ts`（3650 行），5 个 `.tsx`（1787 行）。这 5 个 `.tsx` 都用 `@testing-library/react` 挂载组件，名单和验收报告一致。
  - 直接导入 `@astryxdesign/core/Markdown/parser` 的有 17 个，和验收报告一致。
  - 我另外查到：剩下 10 个里，除了 `markdownExtensionSelection.test.ts`，都会经过 `markdownSource.ts` 间接用到 core 解析器。所以实际依赖 C9 的程度比验收报告说的还深。
  - 另外两个测试：`textSemantics.test.tsx` 368 行，`publicSurface.test.ts` 42 行。
- 往返口径：
  - 重跑结果：Lexical 10/12，Tiptap 6/12，和第 1 轮一致。
  - 我在导入后看了编辑器状态里的节点类型。表格和 Setext 两个样例导入后都只有一个 `paragraph`，确认是当普通文字保留的。
  - **这里和验收报告有一处不同。** 去掉这两个样例后，Tiptap 是 6/10，不是验收报告写的 5/10。原因是 Tiptap 在这两行本来就是「变了」，去掉后它原样的个数还是 6，只是分母从 12 变成 10。ADR 里写的是 6/10。
- 改法：
  - 2.1 改了测试规模那一段，分开写 22 个 `.ts`、5 个 `.tsx`、17 个直接依赖 parser 的测试，以及另外 2 个测试。
  - 2.3、2.4、附录 A.2 写清往返的口径：表格和 Setext 是当文字保留的，同口径下 Lexical 8/10、Tiptap 6/10。
  - 2.4 和 2.5 删掉「几乎能直接搬」「照搬即可」，改成「纯逻辑那部分能搬，能不能搬取决于 C9」。
  - 2.5 的「约 4600 行」改成实测的「18 个 `markdown*.ts` 共约 4400 行（4374）」。「约 5800 行测试」改成「27 个测试文件共约 5400 行」。
  - 2.6 F1a 的测试清单按上面的分类重写。
  - 2.7 补上 `parseInlineAst`、`plugin-renderer`，以及 C9 台账里对应的 4 个提交。还写明一点：就算 C9 不做插件协议，三个解析函数也必须有。
  - 原文以为 `markdownExtensions` 能单独跳过。实际上 `editorNodes.ts`、`markdownSource.ts`、`markdownSerializers.ts` 都直接导入它，所以改成「要从导入链里拆出去」。

### 第 3 条：charts 的发布标记

- 核对结果：上游 `packages/charts/package.json` 第 4 行是 `"private": true`，第 23 到 24 行是 `"astryx": {"canaryOnly": true}`，验收报告说得对。
- 改法：第 1 节表里 charts 一行改成 `"private": true` + `astryx.canaryOnly`。

### 第 4 条：F1b 补 C3，颜色工具直接写结论

- C3：
  - 核对结果：上游 `RichTextEditorToolbar.tsx` 导入了 `@astryxdesign/core/Selector`，验收报告说得对。
  - 改法：第 8 节 F1b 补上 C3。
- 顺手把 richtext 非测试源码里所有 `@astryxdesign/core/*` 导入列了一遍，又发现两处：
  - 第 1 轮还漏了 `ToggleButton`（C2）、`Layout` 和 `Divider`（C14）。现在都写进依赖了。
  - 全部导入里**没有任何菜单（C6）组件**。所以 F1b 去掉 C6，并在备注里写明依据。
- 颜色工具：
  - 核对结果：
    - 上游的颜色工具在 `core/src/utils/color.ts`（170 行），从 `@astryxdesign/core/utils` 导出。它在 0.4.1 就已经存在，所以不在 B7 台账里。
    - 我们 core 没有 `utils` 子路径。只有 `Theme/contrast.ts` 的 `parseColor`、`Theme/hct.ts` 的 `formatHex` 和私有的 `parseHexChannels`，都没有从包入口导出。
  - 改法：3.4 直接写结论，F2a 在 charts 包内部移植 `color.ts`，lab 从 charts 包拿。
  - 顺带查到：`getChartColors(theme, mode)` 用到的 `resolveThemeTokens`，我们 core 也没有。我们的 `ThemeDefinition.tokens` 只含主题自己覆盖的变量，默认值写在 CSS 里。3.4 写明 F2a 先只做 `getChartColorsFromResolver`，另一个入口由 F2a 和 B1 商量。

### 第 5 条：术语解释

每个词的解释都放在它第一次出现的地方，各一句大白话：

| 词 | 放在哪里 |
| --- | --- |
| d3、SVG、WebGL | 「一句话结论」表格下方新增「表里的几个词」 |
| 比例尺 | 3.1「配置模型」 |
| 着色器（以及 canvas） | 3.1「渲染方式」 |
| DecoratorNode（装饰节点）、mutation 监听、Teleport | 2.5 的 API 对照表 |
| headless | 2.1 测试规模（第一次出现 `@lexical/headless` 的地方） |
| happy-dom | 2.3 第 1 条 |
| `fixed` 组 | 7.2 版本号表 |
| Changesets | 第 1 节「我们这边的情况」 |

通读时还给这些词补了解释：tsdown、unplugin-vue、remark、mdast、`provide`/`inject`、VNode、摇树、CSS Custom Highlight API、`m4Reduce` 降采样。

### 第 6 条：小事实

| 项 | 核对结果 | 改法 |
| --- | --- | --- |
| vega 周下载 | 2026-10-21 复查：vega 751,410，vega-lite 730,758，vega-embed 535,675（统计区间 10-12 到 10-18）。验收报告对 | 5.1 分别写三个包的版本和下载量 |
| vega 源码行数 | `src/` 非测试文件共 999 行，其中 `.ts`/`.tsx` 926 行，另有 `.doc.mjs` 73 行。去掉 `types.ts`（202 行）和 `index.ts`（43 行）后是 681 行 | 5.1 列出各文件行数，写清「约 680」是怎么算出来的。5.2 的「大约 300 行」没有依据，改成「要重写的只有 `VegaChart.tsx` 和 `viewInputs.ts`，约 420 行」 |
| ListInput 依赖 | 没有导入 `List`。导入的是 Button、EmptyState、Field、FieldStatus、Icon、IconButton、Layer、Table（只用 `ColumnWidth` 类型）等。验收报告对 | 4.1 表格改正 |
| `build-catalog.ts` 行号 | 第 63 行是读 `packages/core/package.json` 的路径，不含 `@astryx-vue/core` 这个字样。验收报告对 | 按建议改成不写行号，只写「该文件里所有写死 core 的地方」，并举例 |
| 3.3「设备内存也紧」 | 这是过程限制，不是产品理由 | 删掉 |

## 通读时额外修的

**上游内容描述不准**

- 4.1 lab 表：19 个组件的 core 依赖全部按实际导入重新对了一遍。
  - Stat、CircularProgress、LogStream、ChatReasoning 原来写「core 基础组件」或「core」。实际上它们只用 token 和 `mergeProps`，不用任何 core 组件。
  - Schedule 补上 `Spinner`、`Layer`。日期工具写明是 `utils/plainDate.ts` 的 13 个函数。
  - TransferList、MobileTokenizer、Drawer、Tour 补全依赖。Drawer 用的是 `Dialog` 的 `DialogPurpose` 类型，再加 `useFocusTrap`、`useScrollLock`。
  - CodeEditor 补上 `ensureHighlightStyles`、`applyHighlightRangesFlat`。这两个我们 core 现在都没有。
  - Chart、Radial、Sankey、ThreeD 补上它们实际用的 core 东西。
- 4.1：`CommandPalette`、`CodeBlock` 补上提升提交号 `670d7a095`、`e6beddb4e`。
- 4.1：原文说 lab 依赖 charts 就够了，没提 lab 自己也带一份 `getChartColors.ts` 和 `webgl.ts`。现在写明它们是 charts 版的老版本，两份不一致（diff 有 80 到 116 行），移植时以 charts 版为准。
- 2.5 理由 1：按 doc.mjs 原文改。`plugins` 接收的是 Lexical 的 React 插件，不是 Lexical 类型；`getEditorState()` 也会给出 Lexical 类型。
- 2.5 理由 3：原文把 `RichTextExtension` 等写成 `@lexical/extension` 里的导出。实际上它们分别来自 `@lexical/rich-text`、`@lexical/history`、`@lexical/table`、`@lexical/link`、`@lexical/list`。我在 node 里逐个 `require` 确认过。
- 9 节风险：原文说「任务勾选框是最简单的装饰节点」，这不对。
  - `TaskCheckboxPlugin.tsx` 是把勾选框画成兄弟元素，不是装饰节点。
  - 默认节点里的装饰节点只有 `RichTextExtensionNode` 和 `HorizontalRuleNode`。`HorizontalRuleNode` 的 `decorate()` 返回 `null`，在 node 里确认过。
  - 已改正。
- 6.1：原文写 `vite.ts` 的别名在「第 228 到 236 行」，实际范围是 226 到 247 行。别名一共 4 条，还有 `optimizeDeps.exclude`。改成不写行号，把这几项都列出来。
- 3.1：上游推荐的第一批里还有「配色和 `currency`」，补上了。
- 3.2：补了一个小注。上游 charts 和 lab 声明了 `d3-array`，但 v0.7.1 源码里没有导入它。

**数字和实际对不上**

- 「30 行 Vue 组件」：试验脚本 `vue-binding.mjs` 里的组件实际约 25 行，已改。
- 第 1 节 canary 版本：2026-10-21 复查时已经从 `22c592a` 变成 `b584107`。表头加了说明，并保留查询当天的值。

**依赖关系漏了**（都写在第 8 节表里）

| 节点 | 改动 | 依据 |
| --- | --- | --- |
| F1b | 依赖改成 F1a、C1、C2、C3、C7、C14、C16，去掉 C6 | 见第 4 条 |
| F2b | 补 C14、C16、B7 | `HStack`、`VStack`、`Text`，以及 `characterCount`、`truncateCharacters`。后两个是 B7 台账的 `86a7f1752` |
| F3a | 补 C14、C15、C16 | Stack、EmptyState、Indicator、Button、IconButton、Token |
| F3b | 去掉 C15，补 C16 | 5 个组件里只有 InfoTip 用 core 组件（Tooltip 和 Icon）。C15 的 Spinner 只有 Schedule 用 |
| F3b2 | 把 C5 换成 B7 | Schedule 用的是 `utils/plainDate.ts`，在 B7 台账里。它没有导入任何 C5 的日期组件 |
| F3b2 | 补 C14、C15、C16 | Stack、Spinner、Button、ButtonGroup、Token、Text |
| F3c | 去掉 C8，补 C14、C16 | Drawer 和 Tour 都没有导入 BottomSheet，只在文档里提到 BottomSheet |
| F3d | 补 C16 | IconButton |
| F3e | 补 C7 | ChatEmojiPicker 和 ChatReactionBar 用 Popover、Tooltip。C10 的依赖里没有 C7 |

## 给总控的 ROADMAP 调整清单

第 1 轮回报里的建议仍然有效。在那份清单的基础上，依赖按上表修正后是：

| 节点 | 依赖 |
| --- | --- |
| F1b | F1a C1 C2 C3 C7 C14 C16 |
| F2b | F2a C7 C14 C16 B7 |
| F3a | F0 C3 C8 C11 C12 C14 C15 C16 |
| F3b | F0 C7 C16 |
| F3b2（新增） | F0 B7 C6 C7 C14 C15 C16 |
| F3c | F0 C7 C14 C16 |
| F3d | F2b C16 |
| F3d2（新增） | F0 C9 |
| F3e | F0 C10 C7 |

另外建议给 C9 的计划加两句提醒：

1. F1a 需要 `parser` 和 `plugins` 两个子路径，F1b 需要 `plugin-renderer`。
2. F3d2 的 CodeEditor 需要 `ensureHighlightStyles` 和 `applyHighlightRangesFlat`。

## 自测

- `env -u NODE_ENV pnpm lint`：退出码 0。
- `node scripts/check-line-limit.mjs`：输出「源码单文件行数检查通过（上限 500 行）」。
- `git status --short`：提交后为空。

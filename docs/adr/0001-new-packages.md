# ADR 0001：上游 5 个新包怎么移植

- 状态：提议，等总控和用户确认
- 日期：2026-10-20
- 对应节点：F0（任务树 F 阶段的起点）
- 上游版本：facebook/astryx `v0.7.1`

> ADR 是「架构决策记录」（Architecture Decision Record）的缩写。它是一份短文档，写清楚一件重要的事当时是怎么定的、为什么这么定。以后有人问「为什么这么做」，翻开它就能找到答案。

## 一句话结论

| 上游包 | 做不做 | 怎么做 | 发布方式 |
| --- | --- | --- | --- |
| `@astryxdesign/richtext` 富文本 | 做 | Lexical 内核加我们自己写的 Vue 绑定 | `@astryx-vue/richtext`，正式版（`latest`） |
| `@astryxdesign/charts` 图表 | 做 | d3 负责算，Vue 模板画 SVG；WebGL 部分先不做 | `@astryx-vue/charts`，只发 `canary` |
| `@astryxdesign/lab` 实验组件 | 做 | 逐个用 Vue 重写；图表类组件复用 charts 的逻辑 | `@astryx-vue/lab`，只发 `canary` |
| `@astryxdesign/vega` | 先不做 | 写明理由，留一个以后能捡起来的口子 | 不发布 |
| `@astryxdesign/build` | 不做 | 它只服务 StyleX，我们用不上 | 不发布 |

表里的几个词：

- **d3**：一组做图表数学的 JavaScript 小工具。比如算出「数值 42 该画在离左边多少像素的地方」、算出一条折线要经过哪些点。它只管算，不管画。
- **SVG**：浏览器认识的一种画图格式。用 `<rect>`、`<path>` 这样的标签描述矩形、线条，可以直接写在网页里，放大也不会糊。
- **WebGL**：让网页直接调用显卡画图的技术。一次画几十万个点也不卡，但写起来比 SVG 难得多。

后面每一节先讲上游用户能做到什么，再比较可选的方案，最后给出决策和理由。

---

## 1. 背景

上游 Astryx 除了 core、themes、cli，还有 5 个包。我们还没有移植它们。下表是 2026-10-20 用 `npm view <包名> dist-tags` 查到的发布情况：

| 上游包 | 仓库里的版本 | npm 上的 `latest` | npm 上的 `canary`（上游每次合入都会变，2026-10-21 复查时已是 `0.7.2-canary.b584107`） | 上游 `package.json` 的标记 |
| --- | --- | --- | --- | --- |
| richtext | 0.7.1 | 0.7.1 | 0.7.2-canary.22c592a | 正常公开包 |
| charts | 0.1.9 | 0.0.0-bootstrap.0（占位） | 0.7.2-canary.22c592a | `"private": true` + `astryx.canaryOnly` |
| lab | 0.1.9 | 0.0.0-bootstrap.0（占位） | 0.7.2-canary.22c592a | `"private": true` + `astryx.canaryOnly` |
| vega | 0.1.3 | 0.0.0-bootstrap.0（占位） | 0.7.2-canary.22c592a | `"private": true` + `astryx.canaryOnly` |
| build | 0.7.1 | 0.7.1 | 0.7.2-canary.22c592a | 正常公开包 |

几个名词先说清楚：

- **dist-tag**：npm 上给某个版本贴的「标签」。用户执行 `npm install 包名` 时，默认装的是贴了 `latest` 标签的版本。想装别的标签，就要写成 `npm install 包名@canary`。
- **canary**：「金丝雀版」，也就是尝鲜版。它随时可能变，不保证稳定。上游把 charts、lab、vega 只发到 `canary` 标签上，`latest` 上只有一个空的占位版本 `0.0.0-bootstrap.0`。
- **peer 依赖**：包自己不带这个依赖，要求用户自己装。比如 richtext 要求用户自己装 Lexical。

我们这边的情况：

- 样式写成普通 CSS，用 CSS 变量和 CSS 层（`@layer`），不用 StyleX。StyleX 是 Meta 的一种「把样式写在 JS 里、编译成原子类」的工具。
- 构建用 tsdown（把 TypeScript 源码打包成能发布的 JS 的工具）加 unplugin-vue（让打包工具认识 `.vue` 文件的插件），见 `packages/core/tsdown.config.ts`。
- 公开包不能出现 React 依赖，这条由 `scripts/check-package-boundaries.mjs` 检查。
- 版本发布用 Changesets（一个管版本号和更新日志的工具：每次改动写一个小说明文件，发布时它统一算出新版本号）。core 和 themes 绑定成同一个版本号，cli 自己走，见 `.changeset/config.json` 和 `RELEASING.md`。

项目的总原则（见 `.agents-work/upstream-sync-0.7.1/SWARM.md`「对齐上游的标准」一节）：**用户看到的样子、用起来的手感要和上游一致，代码不用一行一行照抄。** 选型时优先选 Vue 生态里成熟、合适的方案。

---

## 2. richtext：富文本编辑器

### 2.1 上游用户能做什么

资料来源：`packages/richtext/src/RichTextEditor.doc.mjs`、`packages/richtext/src/index.ts`、`packages/richtext/package.json`（都是 `v0.7.1`）。

公开了两个组件：

- `RichTextEditor`：可以编辑的富文本框。外框和 `TextArea` 长得一样：边框、悬停、聚焦、禁用、校验状态（warning、error、success）都相同。另外支持 `size`（sm、md、lg）、`maxLength` 字数计数、`placeholder`、`isReadOnly`、`isDisabled`。
- `RichTextView`：只读展示。它把保存好的内容画出来，读屏软件把它当成文档来读，而不是当成输入框。

能编辑的格式：

- 块级：段落、H1 到 H3、无序列表、有序列表、任务列表（带勾选框）、引用、代码块（带语法高亮、语言标签、复制按钮）、GFM 表格、分割线。GFM 是 GitHub 风格的 Markdown 扩展。
- 行内：粗体、斜体、下划线、删除线、行内代码、链接。

工具栏 `RichTextEditorToolbar`：撤销和重做；一个下拉框切换段落、标题、列表、引用；一排开关按钮切换行内格式；一个链接按钮。按 Cmd/Ctrl+K 会弹出 Astryx 的 `Dialog`，在里面填链接。工具栏的图标可以被主题替换，用 `richtext:*` 键名。

插件：

| 上游文件 | 作用 |
| --- | --- |
| `MarkdownShortcutPlugin`（Lexical 自带） | 输入 `# `、`- `、`> `、`` ``` `` 这类 Markdown 写法时，自动变成对应的格式 |
| `RichTextEditorAutoLinkPlugin.tsx` | 输入或粘贴网址、邮箱时，自动变成链接 |
| `TaskCheckboxPlugin.tsx` | 给任务列表画上 Astryx 的 `CheckboxInput` |
| `CodeBlockHeaderPlugin.tsx`、`CodeSyntaxPlugin.tsx` | 代码块的标题栏、复制按钮、语法高亮，高亮用的是 core 的 CodeBlock 分词器 |
| `TableColumnFloorPlugin.tsx`、`TableScrollRegionPlugin.tsx` | 表格列宽下限；宽表格在自己的区域里横向滚动 |
| `MarkdownExtensionsPlugin.tsx` | 把 core `Markdown` 组件的插件（比如自定义语法）画进编辑器，整块编辑 |
| `textSemantics.ts` | 改写文字画到页面上的 HTML 标签：删除线文字外面套一层 `<del>`，粗斜体文字外面套一层 `<em>`。Lexical 自己只用带样式的 `<span>` 或 `<strong>` 画它们，读屏软件就读不出「删除」和「强调」。套上以后，编辑器和 core `Markdown` 组件对读屏软件的表现一致（上游 spec AST-061 FR7）。文档内容和导出的 Markdown 都不变，和粘贴没有关系 |

Markdown 导入导出：

- 公开函数 `markdownToEditorStateJSON` 和 `editorStateJSONToMarkdown`。它们不需要浏览器页面，在服务端也能跑，从子路径 `@astryxdesign/richtext/markdown` 引入。
- 编辑器的 ref 上有 `getMarkdown()` 和 `getHTML()`。
- **保留原文**：这是上游下了大功夫的地方，见 `packages/richtext/src/markdownSource.ts` 的文件头注释。导入一段 Markdown 后再导出，没被改动的块会一个字节不差地原样返回。只有被改动的块，才按标准写法重新生成。缩进、转义符、字符实体（比如 `&amp;`）、代码围栏的写法都会保留。
- 和 core `Markdown` 组件共用解析器，而且是硬依赖：
  - `markdownCharacterReferences.ts` 调用 `@astryxdesign/core/Markdown/parser` 的 `parseInlineAst` 和 `decodeMarkdownCharacterReferences`，用 core 自己的解析结果来判断「这个链接 core 会不会拒绝」「这个字符实体该解码成什么」。
  - `markdownExtensions.ts` 调用 `parser` 的 `parseMarkdownAst` 和 `@astryxdesign/core/Markdown/plugins` 的 `getMarkdownPluginCapabilities`。
  - `markdownSource.ts`、`markdownExtensionNode.ts` 用了 `plugins` 里的类型；`MarkdownExtensionsPlugin.tsx` 还用了 `@astryxdesign/core/Markdown/plugin-renderer` 的 `MarkdownPluginNodeRenderer`。
  - 「保留原文」的主文件 `markdownSource.ts` 同时导入了 `markdownCharacterReferences.ts` 和 `markdownExtensions.ts`，两个公开函数所在的 `markdownSerializers.ts` 又导入了 `markdownSource.ts`。所以整条导入导出链路都离不开 core 的解析器。

测试规模：`packages/richtext/src/` 下一共有 42 个测试文件（其中 7 个在 `__tests__/` 里，是浏览器交互测试）。和 Markdown 相关的是 27 个 `markdown*.test.*`，共 5437 行：

- 22 个 `.ts`（3650 行）不挂载组件，只调用导入导出函数和 Lexical 的 headless 编辑器（`@lexical/headless`，「没有界面」的编辑器：不挂到页面上，只在内存里读写文档）。
- 5 个 `.tsx`（1787 行）用 `@testing-library/react` 挂载 `RichTextEditor` 或 `RichTextView`：`markdownSource`、`markdownTable`、`markdownTaskList`、`markdownThematicBreak`、`markdownRefusedLinks`。
- 27 个里有 17 个直接导入 `@astryxdesign/core/Markdown/parser`（`markdownExtensions.test.ts` 还导入了 `plugins`）。很多测试的写法是「富文本导入的结果要和 core 解析器读出来的一样」，比如 `markdownIndentedFences.test.ts`。剩下 10 个虽然没有直接导入，但除了 `markdownExtensionSelection.test.ts`，都会经过 `markdownSource.ts` 间接用到 core 解析器。

另外两个常被一起提到的测试：`textSemantics.test.tsx`（368 行，挂载 React 组件）和 `publicSurface.test.ts`（42 行，核对包入口导出了哪些名字）。它们不属于 Markdown 测试。

### 2.2 候选方案

| 方案 | 是什么 |
| --- | --- |
| A. Lexical 内核加自写 Vue 绑定 | Lexical 是 Meta 做的编辑器框架。它的内核 `lexical` 和大部分 `@lexical/*` 包与框架无关，只有 `@lexical/react` 绑定 React。我们直接用内核，自己写一层 Vue 组件把它挂到页面上 |
| B. Lexical 加社区绑定 `lexical-vue` | 社区作者 wobsoriano 做的 Lexical Vue 绑定，结构仿照 `@lexical/react` |
| C. Tiptap | Tiptap 基于 ProseMirror（另一个老牌编辑器内核），官方提供 Vue 3 绑定 `@tiptap/vue-3` 和 Markdown 扩展 `@tiptap/markdown` |
| D. Milkdown | 基于 ProseMirror 和 remark（社区常用的 Markdown 处理工具链）的 Markdown 优先编辑器，有 `@milkdown/vue` |

外部资料（查询日期都是 2026-10-20）：

| 库 | 最新版本 | 周下载量 | GitHub 星数 | 最近推送 | 来源 |
| --- | --- | --- | --- | --- | --- |
| `lexical` | 0.52.0（2026-09-28 发布） | 3,508,231 | 23,969 | 2026-10-20 | `npm view`、api.npmjs.org、`gh api repos/facebook/lexical` |
| `lexical-vue` | 0.18.0（2026-10-10 发布） | 1,928 | 362 | 2026-10-16 | 同上，`gh api repos/wobsoriano/lexical-vue` |
| `@tiptap/vue-3` | 3.32.0 | 1,074,980 | 38,791（tiptap 仓库） | 2026-10-20 | 同上，`gh api repos/ueberdosis/tiptap` |
| `@tiptap/core` | 3.32.0 | 13,818,734 | 同上 | 同上 | 同上 |
| `@milkdown/vue` | 7.22.3 | 5,972 | 11,996 | 2026-10-20 | 同上，`gh api repos/Milkdown/milkdown` |

`lexical-vue` 的情况：

- 720 次提交来自作者本人，其余贡献者都在 15 次以下（`gh api repos/wobsoriano/lexical-vue/contributors`）。基本是一个人在维护。
- 0.18.0 把 Lexical 的版本**写死**成 `0.50.0`，放在 `dependencies` 里（`npm view lexical-vue dependencies`）。上游 richtext 要求的是 `^0.52.0`。要是同时用它和 Lexical 0.52，项目里会装上两份 Lexical，两份的节点类不是同一个类，会直接出错。
- 它跟着 Lexical 升级有延迟：2026-10-10 发的 0.18.0 用的还是 2026-09-02 发的 Lexical 0.50.0，这时 Lexical 已经出到 0.52.0（2026-09-28）。

### 2.3 试验结果（细节见附录 A）

1. **Lexical 内核在 Vue 里能不能直接跑？** 能。在 happy-dom（一个用 JavaScript 模拟浏览器页面的库，让 Node 里也有 `document` 可用）里，用 `buildEditorFromExtensions` 加 `RichTextExtension`、`HistoryExtension`，再写一个约 25 行的 Vue 组件挂上去。Markdown 能导入，加粗、斜体命令能用，撤销能回到原样。没有用到任何 React 包。
2. **Markdown 原样往返**：只用 Lexical 自带的转换器，不加上游的「保留原文」逻辑，12 个样例里有 10 个能原样返回。改变了的两个是 `__bold__` 变成 `**bold**`，`~~~` 围栏被转义。这正是上游 `markdownSource.ts` 要补的地方。**口径要注意**：10 个里有 2 个（GFM 表格、Setext 标题）并没有被 Lexical 读成表格和标题，而是当成普通段落文字原样保留下来，所以「原样」不代表支持。去掉这两个再比，Lexical 是 8/10，Tiptap 是 6/10，结论不变。细节见附录 A.2。
3. **Tiptap 的 Markdown 往返**：同样 12 个样例，只有 6 个原样返回。嵌套列表的缩进从 4 格变成 2 格；`*` 列表变成 `-`；Setext 标题（下划线式标题）变成 `#`；表格被重新对齐，前后还多了空行；`~~~` 变成 ` ``` `。上游大量测试要求的是「没改的地方原样返回」，Tiptap 要做到这一点，等于把上游 `markdownSource.ts` 那一套在 ProseMirror 上重写一遍，而且上游测试一条也不能直接搬。
4. **体积**（esbuild 打包、压缩、gzip -9，功能大致对齐：富文本、历史、列表、链接、代码、表格、Markdown、HTML）：Lexical 一套约 170 KB；Tiptap 加 StarterKit、表格、任务列表、Markdown 约 157 KB。两边差不多，体积不是决定因素。

### 2.4 对比

| 比较点 | A. Lexical + 自写绑定 | B. lexical-vue | C. Tiptap | D. Milkdown |
| --- | --- | --- | --- | --- |
| 编辑手感和上游一样（快捷键、Markdown 快捷输入、粘贴、撤销、表格） | 最一致。内核相同，行为直接来自同一份代码 | 同 A，但受它锁定的 Lexical 版本限制 | 大体相近，细节不同：撤销粒度、粘贴规则、表格选区都是 ProseMirror 的做法 | 同 C |
| Markdown 原样往返 | 移植上游 `markdownSource.ts` 等文件（前提是 C9 提供上游那套解析器，见 2.7）。试验里基础转换器 10/12 原样，去掉「当文字保留」的 2 个是 8/10 | 同 A | 要从零重写，试验里 6/12，同口径是 6/10 | 走 remark 序列化，会重新格式化，问题和 C 类似 |
| 迁移上游测试 | 27 个 Markdown 测试里，22 个不挂载组件的纯逻辑测试可以搬，但大多数要用 core 的 Markdown 解析器做对照，**能不能搬取决于 C9**；5 个 React 挂载测试要改写成 Vue 的挂载方式 | 同 A | 基本要全部重写 | 基本要全部重写 |
| 和 core `Markdown` 共用解析 | 上游本来就共用 core 的解析器和插件协议。但我们 core 现在没有这套接口（见 2.7），要等 C9 补上才能照着做 | 同 A | 要另做一层适配 | Milkdown 用 remark，能和我们 core 用的 mdast（Markdown 解析后得到的一种标准树形结构）对接，但和上游的插件协议不同 |
| 维护 | Lexical 由 Meta 维护，很活跃；绑定代码由我们自己维护 | 一个人维护，版本落后、写死 | 团队维护，很活跃 | 很活跃，但用户少 |
| 体积（gzip） | 约 170 KB | 同 A，另加绑定 | 约 157 KB | 未测 |
| 公开 API 能否对齐上游 | 能。上游的 `nodes`、`transformers`、`onChange(editorState)` 都是 Lexical 类型，可以原样提供 | 能 | 不能。这些 prop 的类型全是 Lexical 的，换成 Tiptap 后用户写的自定义节点和转换器都不能用 | 不能 |

### 2.5 决策

**选 A：Lexical 内核加我们自己写的 Vue 绑定。** 不依赖 `lexical-vue`，但可以参考它的写法。

理由：

1. 上游的公开 API 本身就暴露了 Lexical：`nodes`、`transformers` 接收 Lexical 的类型，`plugins` 接收 Lexical 的 React 插件，`onChange` 和 `getEditorState()` 给出的也是 Lexical 的类型（见 `RichTextEditor.doc.mjs` 第一条 bestPractices）。换成别的内核，同样的需求用户就做不到了，违反「公开 API 能做到的事情要一致」。
2. 上游最难的部分是「Markdown 原样往返」，18 个 `markdown*.ts` 文件共约 4400 行，配了 27 个测试文件共约 5400 行。这些代码不碰 React，只依赖 Lexical 的框架无关部分和 core 的 Markdown 解析器。选 Lexical，只要 C9 把解析器对齐，就能一个文件一个文件地移植，测试也能跟着搬；选别的内核，不管 C9 做成什么样，都要从零重写。
3. 我们要写的绑定很薄。Lexical 0.52 已经提供了框架无关的「扩展」机制：`@lexical/extension` 里的 `buildEditorFromExtensions`、`defineExtension`，配上各包自己导出的扩展，比如 `@lexical/rich-text` 的 `RichTextExtension`、`@lexical/history` 的 `HistoryExtension`、`@lexical/table` 的 `TableExtension`、`@lexical/link` 的 `LinkExtension`、`@lexical/list` 的 `CheckListExtension`。上游的 `RichTextEditor.tsx` 用的也是 `LexicalExtensionComposer`，也就是这套机制。我们只需要一个组件负责挂载和销毁，再加一个 `provide`/`inject` 把编辑器实例交给工具栏和插件组件。`provide`/`inject` 是 Vue 自带的传值办法：父组件把一个值「放出去」，子孙组件不用一层层传 prop 就能「拿到」它。试验里这部分的 Vue 组件约 25 行，就跑通了。
4. 不用 `lexical-vue`，因为它写死了 Lexical 0.50，跟不上上游的 0.52；而且基本只有一个人维护。我们需要的 React 绑定功能（Composer、ContentEditable、RichText、History 这几样）用扩展机制几行就能代替，没必要多背一个依赖。

`lexical` 和 `@lexical/*` 跟上游一样，作为**可选的 peer 依赖**，版本跟上游锁同一个次版本（现在是 `^0.52.0`）。用户自己装。

Vue 版 API 怎么对应上游（给 F1b 参考，具体形状由 F1b 定）：

| 上游 React | 我们的 Vue |
| --- | --- |
| `defaultValue`，只在挂载时读一次 | 同名 prop。另外提供 `v-model:markdown` 作为方便用法，可以放到后续节点 |
| `onChange(editorState, editor)` | `@change` 事件，参数相同 |
| `toolbar` prop（ReactNode） | `toolbar` 插槽 |
| `plugins` prop（ReactNode） | 默认插槽，或者 `plugins` 插槽。插件写成没有界面的 Vue 组件，在 `setup` 里 `inject` 编辑器实例，然后注册监听 |
| `ref`（`RichTextEditorRef`） | `defineExpose`，暴露 `focus`、`clear`、`getEditorState`、`getMarkdown`、`getHTML`、`getEditor` |
| `xstyle` | 不提供，用 `class` 和 `style` |
| `DecoratorNode.decorate()` 返回 React 元素。`DecoratorNode`（装饰节点）是 Lexical 里一种特殊节点：它在文档里占一个位置，但里面显示什么不由 Lexical 画，而是交给界面框架画一个组件。上游的 Markdown 扩展节点 `RichTextExtensionNode` 就是一个装饰节点 | 在 Vue 里，用 Lexical 的 mutation 监听（节点被创建、更新、删除时 Lexical 会发出通知）找到节点对应的 DOM，再用 `Teleport` 把 Vue 组件画进去。`Teleport` 是 Vue 自带的组件，能把一个组件的内容画到页面上另一个指定的元素里，而不是画在它自己所在的位置。`lexical-vue` 的 `LexicalDecoratedTeleports` 就是这个思路，可以参考 |

### 2.6 F1a 和 F1b 的分界

**F1a（纯逻辑，不碰界面）：** 移植下面这些文件，只依赖 `lexical`、`@lexical/headless`、`@lexical/markdown` 等框架无关的包，以及我们 core 的 Markdown 解析器。

- `editorNodes.ts`（默认节点集合）
- `markdownSource.ts`（保留原文的导入导出）
- `markdownSerializers.ts`（两个公开函数）
- `markdownTable.ts`（默认转换器集合，以及 GFM 表格）
- `markdownCharacterReferences.ts`、`markdownCodeFence.ts`、`markdownHardLineBreak.ts`、`markdownHeading.ts`、`markdownLink.ts`、`markdownListExport.ts`、`markdownListIndentation.ts`、`markdownOrderedList.ts`、`markdownQuote.ts`、`markdownSpaceRuns.ts`、`markdownTaskList.ts`、`markdownThematicBreak.ts`
- `markdownExtensions.ts`、`markdownExtensionNode.ts`。这两个文件依赖 core 的 Markdown 插件协议，见下面的风险。它们不是可以单独拿掉的配件：`editorNodes.ts` 把 `RichTextExtensionNode` 放在默认节点里，`markdownSource.ts` 和 `markdownSerializers.ts` 也直接导入它们。`markdownExtensionNode.ts` 里的 `decorate()` 返回值留给 F1b 补
- `linkUtils.ts`（网址校验和清洗）
- 子路径入口 `@astryx-vue/richtext/markdown`，保证在服务端能用、不引入 Vue 组件
- 测试：22 个不挂载组件的 `markdown*.test.ts` 整个搬；5 个 `markdown*.test.tsx` 只搬不挂载组件的那些用例，挂载组件的用例留给 F1b。`publicSurface.test.ts` 等包入口定下来后再搬，归 F1b

注意：其中不少文件超过 500 行（`markdownCharacterReferences.ts` 990 行，`markdownSource.ts` 995 行），移植时要按职责拆开。

**F1b（界面）：**

- Vue 绑定：编辑器上下文（`provide`/`inject`）、挂载和销毁、只读和禁用切换、装饰节点的 Teleport 渲染
- `textSemantics.ts`：给删除线和粗斜体文字套 `<del>`、`<em>` 的渲染覆盖。它本身只依赖 `lexical` 和 `@lexical/html`，不碰 Vue；但它改的是编辑器画出来的 DOM，只有 `RichTextEditor` 和 `RichTextView` 用它，对应的 `textSemantics.test.tsx` 也要挂载编辑器才能验证。所以归 F1b，和编辑器一起做、一起测
- `RichTextEditor`：外框复用 core 的 `Field` 和 TextArea 的样式变量；状态图标、字数计数、读屏提示「按 Escape 再按 Tab 离开编辑器」
- `RichTextView`：只读展示，表格滚动区
- `RichTextEditorToolbar`：复用 core 的 `Toolbar`、`Selector`、`ToggleButton`、`IconButton`、`Dialog`、`TextInput`，图标走主题的 `icons` 表（`richtext:*` 键）
- 插件组件：自动链接、任务勾选框、代码块标题栏和语法高亮、表格列宽和滚动、Markdown 扩展节点渲染
- 编辑器主题类名表（上游 `editorTheme.ts`，在我们这里改写成普通 CSS 类名，配合 `richtext.css`）
- 文案：上游 `@astryx.richTextEditor.*` 共 29 条，已经在我们的 `packages/core/locales/en.json` 里，接进 `upstreamMap` 即可
- 测试：`markdown*.test.tsx` 里挂载组件的用例、`textSemantics.test.tsx`、`publicSurface.test.ts`、各插件的测试；浏览器交互测试参考上游 `src/__tests__/*.a11y.chromium.spec.ts`（7 个）

### 2.7 风险

- **core 的 Markdown 解析器和插件协议还没对齐，这是 F1a 最大的前提。**
  - 上游 richtext 用到的 core 接口：`@astryxdesign/core/Markdown/parser` 的 `parseMarkdownAst`、`parseInlineAst`、`decodeMarkdownCharacterReferences`；`Markdown/plugins` 的 `getMarkdownPluginCapabilities`、`MarkdownPluginEntry`、`MarkdownPluginData` 等类型；`Markdown/plugin-renderer` 的 `MarkdownPluginNodeRenderer`。测试里还用到 `parser` 的 `parseMarkdown`、`parseInline`。
  - 我们 core 现在用的是 `mdast-util-from-markdown`（社区通用的 Markdown 解析库，输出 mdast 树），导出的是 `parseMarkdown`、`defineMarkdownPlugin` 等；上面这些接口一个都没有（在 `packages/core/src` 里搜过），也没有 `./Markdown/parser` 这样的子路径。
  - 上游这些接口都在 C9 台账里：`d993f6585 feat(markdown): add core plugin protocol`、`970b59262 feat(markdown): expose server-safe AST parsers`、`cb30e207e feat(Markdown): export the character reference decoder`、`b421f01f1 feat(Markdown): read what a plugin declares, and render one plugin node as Markdown does`。
  - 所以 F1a 依赖 C9 是对的，而且 C9 要把 `parser`、`plugins` 两个子路径做出来，行为和上游一致。`plugin-renderer` 是 F1b 才用的。
  - 如果 C9 决定不做上游那种插件协议：F1a 要把 `markdownExtensions.ts`、`markdownExtensionNode.ts` 从导入链里拆出去（它们被 `editorNodes.ts`、`markdownSource.ts`、`markdownSerializers.ts` 直接导入），`markdownExtensions` 这个 prop 推迟。但 `parseMarkdownAst`、`parseInlineAst`、`decodeMarkdownCharacterReferences` 这三个解析函数仍然必须有，否则「保留原文」和 17 个对照测试都做不了。
- `@lexical/headless` 0.52 的 `dependencies` 里带了 `happy-dom`，版本范围是 `^20.9.0`（`npm view @lexical/headless@0.52.0 dependencies`），用户在服务端用的时候会装上它。这是 Lexical 的选择，上游也一样，我们照单接受，在 README 里写明。
- Lexical 还在 0.x，次版本之间可能有破坏性改动。我们跟着上游锁同一个次版本，升级时一起升。

---

## 3. charts：图表

### 3.1 上游用户能做什么

资料来源：`packages/charts/src/index.ts`、`Chart.doc.mjs`、`types.ts`、`layout.ts`、`webgl.ts`、`docs/CHARTV2_READINESS.md`、`README.md`（都是 `v0.7.1`）。

- **配置模型**：`<Chart data xKey series={[bar('revenue'), line('trend')]} />`。每种「标记」（mark，也就是图形种类）是一个工厂函数，返回一个配置对象，里面有 `resolve()`（算出每个点的像素位置）和 `render()`（画出来）。图表根组件只负责算一套共用的 x、y 比例尺，再挨个调用每个系列。比例尺（scale）就是一个「数据值换算成像素位置」的函数，比如把 0 到 100 映射到图上的 300 像素到 0 像素。所以坐标轴、网格、各个系列永远对得上。
- **12 种标记**：`bar`（含堆叠、分组、负值）、`line`、`area`（含渐变、堆叠）、`dot`、`band`（置信区间带）、`candlestick`（K 线）、`errorBar`、`referenceLine`，以及 4 种 WebGL 标记：`dotGL`、`dotGLInteractive`、`heatmapGL`、`streamGL`。
- **配套组件**：`ChartAxis`、`ChartGrid`、`ChartLegend`、`ChartSwatch`（色块）、`ChartTooltip`（悬停提示框加十字线，浮层走 core 的 `useLayer`）。
- **工具函数**：`useChartColors` / `getChartColors`（从主题的 `--color-data-*` 变量取配色，分为类别色、顺序色、发散色）；格式化函数 `compactNumber`、`currency`、`percent`、`shortDate`、`monthYear`；`isBandScale`、`xPixel`。
- **渲染方式**：主体是 SVG。WebGL 只用在 4 个 `*GL` 标记上：大数据量的散点、热力图、流式折线。`webgl.ts` 是它们共用的工具：编译着色器、把 canvas 叠在 SVG 上面、处理上下文丢失。着色器（shader）是交给显卡去跑的小程序，告诉显卡每个点画在哪、涂什么颜色；canvas 是网页上一块可以自由画像素的画布。
- **无障碍**：SVG 带 `role="img"` 和名字。数据量小（不超过 100 个格子）时，额外画一张视觉上隐藏的数据表给读屏软件。
- **发布**：只发 canary。上游自己的就绪度评估（`docs/CHARTV2_READINESS.md`）把 `dotGLInteractive`、`heatmapGL` 评为 Needs work，把 `dotGL`、`streamGL` 评为 Minor polish；建议第一批只发 bar、line、area、dot 加全部配套组件，再加配色和 `currency` 格式化。

### 3.2 候选方案

| 方案 | 好处 | 代价 |
| --- | --- | --- |
| A. 照上游思路：d3 只负责算，Vue 模板画 SVG | d3-scale、d3-shape、d3-array 和框架无关，可以直接用。画出来的每根线、每个柱子都能和上游对上；服务端渲染直接出 SVG（试验已确认）；配色直接用我们主题的 CSS 变量；读屏结构（`role="img"`、隐藏数据表）完全可控 | 交互（提示框、十字线、图例）要自己写，这正是上游自己写的部分 |
| B. 换用 ECharts（加 `vue-echarts`） | 图表种类多，大数据量和动画都很成熟 | 画面风格、坐标轴排版、提示框样式都是 ECharts 自己的，很难做到和上游像素对齐；配色要先把 CSS 变量读成具体颜色再传进去；读屏结构不同；体积大：只装柱状图、折线图、网格、提示框、图例和 SVG 渲染器，gzip 后约 193 KB，而 d3 三件套约 16 KB（附录 B）；配置写法也和上游的 `series={[bar(), line()]}` 完全不同 |
| C. 换用 Unovis（`@unovis/vue`） | 有官方 Vue 绑定，组合式写法和上游有点像 | 视觉和交互同样对不上上游；多一层抽象 |

小注：上游 charts 和 lab 的 `package.json` 都声明了 `d3-array`，但 `v0.7.1` 的源码里实际只导入了 `d3-scale` 和 `d3-shape`。F2a 可以先不装 `d3-array`，用到再加。

外部资料（2026-10-20）：`d3-scale` 4.0.2，周下载 45,894,332，最后发版 2023 年，算法稳定，不常更新是正常的；`echarts` 6.1.0，周下载 3,626,008；`vue-echarts` 8.3.2，周下载 295,722；`@unovis/vue` 1.7.1，周下载 125,355。来源是 `npm view` 和 api.npmjs.org。

### 3.3 决策

**选 A：d3 只负责计算，渲染交给 Vue 的 SVG 模板。** 判断标准是「画出来的图和交互能不能和上游一致」，只有 A 能做到。

上游标记对象的 `render()` 返回 ReactNode。我们改成返回 Vue 的 VNode（Vue 用来描述「这里要画一个什么元素」的对象，用 `h()` 写），或者让每种标记对应一个内部 Vue 组件，由 F2b 自己定。对外的写法保持一样：`series` 里放 `bar(...)`、`line(...)` 这样的工厂函数结果。

**WebGL 标记：F2 阶段不做。** 理由：

1. 上游自己把其中两个评为 Needs work，另外两个评为 Minor polish（`docs/CHARTV2_READINESS.md`），而且整个包还只是 canary。
2. 它们是给「大数据量」场景准备的，不在上游建议的第一批里。

以后做的时候，`webgl.ts` 本身和框架无关（262 行，只导入 core 的 `parseHex`、`toGLFloats` 两个颜色函数），可以直接搬，再加一层 Vue 组件管理 canvas。单独开一个节点，见第 8 节。

### 3.4 F2a 的纯逻辑范围

都是和框架无关的 TypeScript，可以先做、先测：

- `formatters.ts`：数字、货币、百分比、日期格式化（只用到 core i18n 的 `Locale` 类型）
- `getChartColors.ts`：从一个「取变量值」的函数算出配色（类别、顺序、发散）。它导入 core `utils` 的 `parseHex`、`parseColor`、`formatHex`、`formatColor`；另一个入口 `getChartColors(theme, mode)` 还导入 core `theme` 的 `resolveThemeTokens`，用来在没有页面的地方（服务端、测试）从主题对象里算出所有变量的具体值
- `layout.ts`：比例尺、y 轴取值范围、堆叠、分组，然后调用各系列的 `resolve()`
- `legend.ts`：从系列推出图例项
- `markColor.ts`：一个标记的颜色怎么定
- `tooltip.ts`：提示框里每个系列的取值
- `utils.ts`：`isBandScale`、`xPixel`
- `types.ts`：去掉 React 类型，`render` 的返回类型改成 Vue 的
- 各标记的 `resolve()` 部分（从 `marks/*.tsx` 里拆出来，不含 `render()`）
- 对应测试：`formatters.test.ts`、`getChartColors.test.ts`，以及 `marks.test.tsx` 里不渲染的部分

**core 里没有可用的公开颜色工具，结论是 F2a 在 charts 包内部自己实现。**

- 上游的这套工具在 `packages/core/src/utils/color.ts`（170 行：`parseHex`、`parseRgb`、`parseColor`、`formatHex`、`formatColor`、`toGLFloats`），从 `@astryxdesign/core/utils` 导出。它在 0.4.1 之前就有了，所以不在 B7 的台账里，B7 不会顺手做。
- 我们 core 没有 `utils` 子路径。只有主题内部的几个函数：`Theme/contrast.ts` 的 `parseColor`（读 hex 和 `rgb()`）、`Theme/hct.ts` 的 `formatHex` 和私有的 `parseHexChannels`。它们都没有从包入口导出，另一个包拿不到。
- 做法：F2a 在 charts 包里放一个 `color.ts`，对照上游 `utils/color.ts` 和它的测试移植。lab 的 Chart 和 ThreeD 也用到 `parseHex`、`toGLFloats`，从 charts 包拿。如果以后 core 也要公开这套工具，再把它搬进 core。
- `getChartColors(theme, mode)` 需要的 `resolveThemeTokens`，我们 core 也没有。我们的 `ThemeDefinition.tokens` 只含主题自己覆盖的变量，默认值写在 `packages/themes/*/base.css` 里。所以 F2a 先只做 `getChartColorsFromResolver`（传一个「取变量值」的函数进来）；`getChartColors(theme, mode)` 要不要做、默认值从哪里来，由 F2a 和 B1 商量。

**F2b**：`Chart`、`ChartAxis`、`ChartGrid`、`ChartLegend`、`ChartSwatch`、`ChartTooltip` 这 6 个组件，加 8 个 SVG 标记的渲染，加 `useChartColors`（读当前主题的变量）。它们用到的 core 东西：`Text`、`HStack`、`VStack`、`VisuallyHidden`、`useTranslator`、`useLocale`、`useLayer`（提示框浮层）、`useMergedRefs`、`useTheme`，以及 `ChartAxis` 截断长标签用的 `characterCount`、`truncateCharacters`。后两个在上游 `utils/characters.ts`，属于 B7 台账里的 `86a7f1752`。

---

## 4. lab：实验组件

### 4.1 逐个说明

资料来源：`packages/lab/src/*/`（`v0.7.1`）、各组件的 `.doc.mjs`、`git log --diff-filter=D -- packages/lab/src`（查已经提升进 core 的组件）。

已经从 lab 提升进上游 core 的：`BottomSheet`（`6e7f89c16`）、`Stepper`（`ecaf7796b`）、`CommandPalette`（`670d7a095`）、`CodeBlock`（lab 里留着的转发入口在 `e6beddb4e` 删掉）。`RichTextEditor` 搬去了 richtext 包（`401e16f69`）。这些都不在 lab 里了。下面 19 个都还在上游 lab，没有被提升。

| 组件 | 是干什么的 | 主要依赖（上游） | 我们现在有没有 | 要不要做 | 建议分组 |
| --- | --- | --- | --- | --- | --- |
| Stat | 指标卡：标题、数值、涨跌幅、趋势插槽 | 只用 core 的 token 和 `mergeProps`，不用 core 组件 | 没有 | 做 | F3b |
| CircularProgress | 环形进度条，支持不确定状态 | 同上，不用 core 组件 | 没有 | 做 | F3b |
| InfoTip | 带提示的「i」图标 | core `Tooltip`、`Icon` | 没有 | 做 | F3b |
| SVGIcon | 一套可变粗细、带填充角色和遮罩镂空的 SVG 图标系统，自带十几个示例图标 | 只用 core 的 token | 没有 | 做 | F3b |
| LogStream | 流式日志查看器：时间、级别、来源、消息四列，自动跟随、跳到最新、终端暗色版 | 只用 core 的 token 和焦点样式，不用 core 组件 | 没有 | 做 | F3b |
| Schedule | 日程表：月视图、周和日时间格、列表视图，带时区换算、分页、异步加载事件、事件详情弹层 | core `utils` 里的 `PlainDate` 日期工具（`plainDateAddDays` 等 13 个函数，上游 `utils/plainDate.ts`）、`Popover`、`DropdownMenu`、`ButtonGroup`、`Token`、`Spinner`、`Layer` | 没有 | 做，最大的一个，约 5700 行 | F3b，建议单独拆出来 |
| ListInput | 编辑一组结构化记录的表格式输入框：增删、排序 | core `Field`、`FieldStatus`、`Button`、`IconButton`、`Icon`、`EmptyState`、`Layer`，以及 `Table` 的列宽类型 `ColumnWidth`；没有用 `List` | 没有 | 做 | F3a |
| TransferList | 左右两栏穿梭框，支持排序，可以暂存后再确认 | core `ComplexSelector`、`List`、`Item`、`TextInput`、`Button`、`IconButton`、`Layer` | 没有 | 做 | F3a |
| MobileTokenizer | 手机上的多选输入：点开一个底部面板搜索和选择 | core `BottomSheet`、`Typeahead`、`Token`、`AlertDialog`、`Field`、`TextInput`、`EmptyState`、`Indicator` | 没有 | 做 | F3a |
| Drawer | 从左右两侧滑出的抽屉，基于原生 `<dialog>`，带 `DrawerHeader` | core `Dialog` 的 `DialogPurpose` 类型（关闭规则）、`Layer`、`Layout`、`useFocusTrap`、`useScrollLock` | 没有 | 做 | F3c |
| Tour | 新手引导：一步一步高亮页面元素，旁边弹出说明 | core `Popover`、`Button`、`Heading`、`Layer`、`Layout` | 没有 | 做 | F3c |
| Chat（4 个子组件） | 包括 `ChatEmojiPicker`（表情选择）、`ChatReactionBar`（表情回应条）、`ChatTypingIndicator`（正在输入）、`ChatUnreadDivider`（未读分隔线） | core `Popover`、`TextInput`、`Tooltip` | **后两个已经在我们 core 里**（`packages/core/src/Chat/ChatTypingIndicator.vue`、`ChatUnreadDivider.vue`）；前两个没有 | 只做 `ChatEmojiPicker`、`ChatReactionBar` | F3e |
| ChatReasoning | 可折叠的「思考过程」块 | 只用 core 的 token，不用 core 组件 | **已经在我们 core 里**（`packages/core/src/Chat/ChatReasoning.vue`） | 不重复做 | — |
| CodeEditor | 可编辑的代码框，用浏览器的 CSS Custom Highlight API（不改动页面结构、只给一段文字范围上色的浏览器接口）做实时高亮，带行号 | core CodeBlock 的 `tokenize`、`tokenizeAsync`、`SYNC_TOKENIZE_THRESHOLD`，以及 `ensureHighlightStyles`、`applyHighlightRangesFlat` 两个高亮工具，**没有用第三方编辑器** | 没有。我们 core 的 `Code` 已经有 `tokenize`、`tokenizeAsync`、`SYNC_TOKENIZE_THRESHOLD` 和 `applyHighlightRanges`，但没有 `ensureHighlightStyles`、`applyHighlightRangesFlat`，要对照 C9 补齐或在 lab 里自己做 | 做 | F3d |
| DiffViewer | 目前**只有数据模型和解析函数**：`parseUnifiedDiff` 把 `git diff` 文本解析成文件、块、行的结构，没有界面组件 | 无 | 没有 | 做，很小 | F3d |
| Chart | lab 里的旧版图表，用组件组合的写法（`<ChartBar>`、`<ChartLine>` 等），另有 `ChartBrush`、`ChartZoom`、`ChartSelect`、`m4Reduce`（大数据降采样：点太多时只留下画出来看着一样的那些点）、`useChartRange` | d3-scale、d3-shape；core `utils` 的颜色函数（`parseHex`、`parseColor`、`formatColor`、`toGLFloats`）、`Layer`、`IconButton`、`VisuallyHidden` | 没有 | 见下面说明 | F3d |
| Radial | 极坐标图：雷达图、饼图、环形图 | 只用 `Math`，没有用 d3；core 只用了 `Layer`（提示框）和 `VisuallyHidden` | 没有 | 做 | F3d |
| Sankey | 桑基图（流向图），自带布局算法 | 无第三方依赖；core 只用了 `VisuallyHidden` | 没有 | 做 | F3d |
| ThreeD | 3D 图表：散点、柱、曲面，用 SVG 投影画出来，可以拖动旋转；另有一个 WebGL 散点 `ThreeDScatterGL` | **没有用 three.js**，自己算投影；core 只用了 `useMediaQuery`，GL 散点还用 `parseHex`、`toGLFloats` | 没有 | 做 SVG 部分，WebGL 散点推迟 | F3d |

**关于 lab 里的 Chart。** 它和 charts 包是同一套东西的两代。charts 包的 README 说它是 lab 版 `Chart` 的继任者，lab 里这份是旧写法，至今还留着，没有删。两者的数学（比例尺、堆叠、配色、格式化）基本相同。建议：

- lab 的 `Chart` 系列移植时，**复用 charts 包的纯逻辑**（F2a 的成果），只写组件组合式的外壳，不要再抄一份数学。
- `ChartBrush`、`ChartZoom`、`ChartSelect`、`m4Reduce`、`useChartRange` 是 charts 包没有的交互，在 lab 里做。
- lab 里的 GL 系列组件（`ChartDotGL`、`ChartDotGLInteractive`、`ChartHeatmapGL`、`ChartStreamGL`）和 charts 一样推迟。
- 这样 lab 包会依赖 charts 包。这是合理的：上游 lab 的 `package.json` 本来就直接依赖 d3 三件套。上游 lab 的 Chart 自己带了一份 `getChartColors.ts`（254 行）和 `webgl.ts`（198 行），是 charts 包同名文件（280 行、262 行）的老版本，不完全一样。移植时以 charts 版为准，只补 lab 用到而 charts 版没有的地方，不再拷一份。

### 4.2 和 ROADMAP 分组的对照

ROADMAP 现在的分组是：F3a 输入类 3 个、F3b 展示类 6 个、F3c 浮层 2 个、F3d 可视化与编辑器 6 个、F3e 对话 2 个。共 19 个，与上表一致。建议的调整写在第 8 节。要点：

1. F3e 只剩 `ChatEmojiPicker`、`ChatReactionBar` 两个组件要做。`ChatReasoning`、`ChatTypingIndicator`、`ChatUnreadDivider` 已经在 core 里，F3e 只需要对一下上游 lab 版本有没有新改动，有就交给 C10。
2. F3b 里的 Schedule 太大（约 5700 行，比其余 5 个加起来还多），建议拆成单独节点。
3. F3d 混了「图表」和「代码编辑」两类，而且前一类依赖 F2b、后一类只依赖 C9。建议拆成两个节点，代码类不用等 F2b。

### 4.3 发布策略

**`@astryx-vue/lab` 只发 canary，跟上游一样。** 理由：上游明确说 lab 组件「API 可能会变，没有经过无障碍加固」，只发 canary（见 `packages/lab/README.md`）。我们如果发成正式版，等于替上游做了稳定承诺。

具体做法（给 G3 和发布脚本参考）：

- 包名：`@astryx-vue/lab`。2026-10-20 用 `npm view` 查过，npm 上还没有这个名字，可以用。`@astryx-vue/richtext`、`@astryx-vue/charts`、`@astryx-vue/nuxt` 也都还没被占用。
- `package.json` 学上游，写 `"private": true`，再加一个标记 `"astryxVue": { "canaryOnly": true }`。`private: true` 是 npm 自己的硬保护，保证正式发布流程绝对不会误发它。
- 现在的 `scripts/list-public-packages.mjs` 会跳过 `private: true` 的包，所以正式发布、GitHub Packages 双发、`lint:pkg` 都会自动跳过 lab。这正是我们想要的。
- canary 的发布流程现在还没有。需要在 `release.yml` 里新增一个 canary job：在临时检出的副本里去掉 `private`，把版本改成 `<下一版本>-canary.<短提交号>`，然后执行 `pnpm publish --tag canary`。这一项归 G3。
- charts 也按同样方式只发 canary。上游 charts 同样是 `private: true` 加只发 canary。
- **npm 的一个坑**：一个包第一次发布时，不管指定了什么标签，npm 都会自动给它贴上 `latest`。上游的做法是先发一个 `0.0.0-bootstrap.0` 占住 `latest`（见第 1 节的表）。我们首发 canary 包时也要这样做，或者首发后马上执行 `npm dist-tag` 把 `latest` 指回占位版本。这一项写进 G3 的计划。

---

## 5. vega

### 5.1 它是什么

资料来源：`packages/vega/src/VegaChart.tsx`、`vegaLiteConfig.ts`、`schema.ts`、`viewInputs.ts`、`README.md`、`package.json`（`v0.7.1`）。

Vega 和 Vega-Lite 是用 JSON 描述图表的一套语言和运行时，由华盛顿大学的团队维护。上游的 `@astryxdesign/vega` 很薄：`src/` 下非测试文件一共 999 行，其中 `.ts`/`.tsx` 源码 926 行（`VegaChart.tsx` 234、`types.ts` 202、`vegaLiteConfig.ts` 197、`viewInputs.ts` 187、`schema.ts` 63、`index.ts` 43），另有 73 行的 `VegaChart.doc.mjs`。去掉纯类型的 `types.ts` 和入口 `index.ts`，真正的逻辑约 680 行：

- `VegaChart` 组件：看 `spec.$schema` 判断是 Vega 还是 Vega-Lite；Vega-Lite 先编译，再交给 `new vega.View()` 画出来；管理 View 的创建和销毁；按值比较 `spec` 等 prop，只有内容真的变了才重建。
- `buildVegaLiteConfig(token)`：给 Vega-Lite 的一份主题配置（坐标轴颜色、字体、图例位置），颜色从 Astryx 主题变量里取。
- `parseSchema`（`schema.ts`）：校验 `$schema` 网址。
- `viewInputs.ts`：判断哪些 prop 变了需要重建 View。
- 只发 canary。
- 它的 `package.json` 只把 `react`、`react-dom`、`vega`、`vega-lite` 列为 peer 依赖，不依赖 `@astryxdesign/core`，也不用 StyleX。

外部资料（2026-10-20 查，2026-10-21 复核一致；周下载统计区间 2026-10-12 到 2026-10-18）：`vega` 6.4.0，周下载 751,410；`vega-lite` 6.5.0，周下载 730,758；`vega-embed` 7.3.0，周下载 535,675。解包体积 vega 约 3.7 MB，vega-lite 约 5.9 MB。来源是 `npm view` 和 api.npmjs.org。

### 5.2 选项

| 选项 | 好处 | 代价 |
| --- | --- | --- |
| A. 做一个 Vue 版 `VegaChart` | 代码少：类型、主题配置、schema 校验可以直接搬，要重写的只有 `VegaChart.tsx` 和 `viewInputs.ts` 这约 420 行；Vue 用户用 Vega 时能直接套上 Astryx 主题 | 多维护一个包和一套发布流程；上游自己还只是 canary；Vue 用户直接用官方的 `vega-embed` 也就是十几行代码的事 |
| B. 标记为「不做」 | 省事，专心做 richtext 和 charts | Vue 用户想要 Astryx 风格的 Vega 主题，得自己抄配置 |
| C. 不单独建包，只把 `buildVegaLiteConfig` 这份主题配置以文档或代码片段形式提供 | 成本最低，又给了用户最有价值的那部分（主题对齐） | 没有组件 |

### 5.3 决策

**F5 标记为「先不做」。** 以后有用户需要时，按选项 A 补，成本很低。

理由：

1. 上游自己只发 canary，`latest` 上只有占位版本。它是不是会长期保留，还不确定。
2. 它的价值主要在两件事：「React 里管理 View 的生命周期」和「主题配置」。前一件在 Vue 里用 `vega-embed` 或者 `onMounted` 加 `onBeforeUnmount` 就能做好，没有移植的必要；后一件只是一份配置对象。
3. 我们的 charts 包已经覆盖了「Astryx 风格的图表」这个需求。

留给以后的口子：F2c（charts 文档）里可以加一小节「和 Vega-Lite 一起用」，把上游 `vegaLiteConfig.ts` 的配置改写成读我们 CSS 变量的版本，作为代码片段放进文档。这一项可选，由总控决定要不要放进 F2c。

F5 台账的 4 条提交，F5 节点处理时都标「不适用：本项目不移植 vega 包，见 ADR 0001 第 5 节」。

---

## 6. build

### 6.1 它是什么

资料来源：`packages/build/README.md`、`src/index.js`、`src/vite.ts`、`src/babel.js`、`src/next.js`、`src/config.js`（`v0.7.1`）。

`@astryxdesign/build` 是给**从源码编译 Astryx 的 StyleX 样式**用的一组插件：

- `./babel`：把 StyleX 的 babel 插件拆成两份，给库代码和业务代码分别加不同的类名前缀（`astryx` 和 `x`）。
- `./postcss`：把两边编译出来的 CSS 分别放进 `@layer astryx-base` 和 `@layer product`。
- `./vite`：包一层 `@stylexjs/unplugin`，在开发服务器和生产构建里做同样的分层。
- `./next`：Next.js 的配置助手 `withAstryx()`。

它的 PostCSS 部分有没有别的用处？没有。`src/index.js` 只处理 StyleX 的编译结果（`stylexBabelPlugin`），把库和业务的 StyleX 规则分到两个层里。依赖里的 `autoprefixer`、`lightningcss`、`browserslist` 也只用来处理 StyleX 生成的 CSS。`vite.ts` 里还有一组把 `@astryxdesign/core`、`@astryxdesign/core/locales/*`、`@astryxdesign/core/theme/tokens.stylex` 指到 core 源码的别名，再加上 `optimizeDeps.exclude` 不让 Vite 预打包 Astryx，同样只是为了源码编译。

更关键的是，上游自己的 spec `AST-080`（台账 F0 里唯一的那条，`docs/specs/AST-080-package-stylesheets/spec.md`）已经规定：**用户应该加载预构建好的样式表，不要自己编译 Astryx 的源码**（DEC-1）。也就是说，连上游都不推荐普通用户用 build 包了。

### 6.2 决策

**不做。** F6 标记为「不做」。

理由：

1. 它解决的问题是「StyleX 原子类在库和业务之间撞名，导致没法分层」。我们不用 StyleX，组件样式本来就是写好的普通 CSS，已经放在 `@layer astryx.*` 里，这个问题根本不存在。
2. 上游 AST-080 已经把「加载预构建样式表」定为唯一推荐的用法。我们一直就是这么做的。
3. 我们这边和它对应的东西已经有了：tsdown 构建，以及 `pnpm sync` 生成 `styles.css` 汇总。

F6 台账的 11 条提交，F6 节点处理时都标「不适用：本项目不使用 StyleX，没有源码编译这条路，见 ADR 0001 第 6 节」。

---

## 7. 公共问题

### 7.1 包结构和样式

**上游的规定（AST-080）：**

- FR1：每个带样式的包导出**一份**预构建样式表：`core/astryx.css`、`lab/lab.css`、`richtext/richtext.css`、`charts/charts.css`。
- FR2：只加载这份样式表、core 的样式表和一个主题，就能把这个包的所有东西都画对，不需要任何编译器。非 core 包不重复 core 已经声明的东西。
- FR3：每份样式表的所有规则都放在同一个层里，并且文件开头先声明一次层的顺序：`@layer reset, astryx-base, astryx-theme;`。这样不管哪个样式表先加载，主题都能盖过所有包的基础样式。
- FR4：`exports` 里能找到这个 `.css` 子路径；`sideEffects` 要覆盖它，免得被打包工具摇树摇掉。摇树（tree-shaking）是打包工具删掉「看起来没人用」的代码；只被 `import` 而不取任何变量的 CSS 文件容易被误删。
- FR5、FR6：每种文档里的安装方式、每个包的 README 都要写出这份样式表的引入语句。

**我们现在的做法：**

- core 每个组件一份 CSS（`packages/core/styles/*.css`），由 `pnpm sync` 汇总成 `packages/core/styles.css`。组件的 `.vue` 文件自己 `import` 对应的 CSS，所以按需引入时样式也会跟着来。
- 每份 CSS 开头先声明层的顺序：`@layer astryx.reset, astryx.tokens, astryx.base, astryx.components, astryx.overrides;`，规则写在 `@layer astryx.components` 里。主题的变量写在 `@layer astryx.tokens` 里（见 `packages/themes/neutral/button.css`）。
- `sideEffects` 已经是 `["**/*.css"]`。

可以看到，我们的层名和上游不同，但已经满足了 FR2 和 FR3 的本意：每个文件都自己声明层顺序，主题、组件、用户覆盖的先后关系固定。

**新包的规定：**

1. 每个新包的结构照 core 来：`packages/<name>/styles/<组件>.css` 每个组件一份，组件文件自己 `import` 它，同时由 `pnpm sync` 汇总出 `packages/<name>/<name>.css`。也就是 `@astryx-vue/richtext/richtext.css`、`@astryx-vue/charts/charts.css`、`@astryx-vue/lab/lab.css`。文件名和上游一致，用户照着上游文档就能找到。
2. 层：所有新包都用和 core 一样的层声明，组件规则写在 `@layer astryx.components` 里，**不另开新层**。这和上游 DEC-2「每个包共用同一个层」的思路一致。
3. 变量：新包需要的主题变量（比如 `--astryx-rich-text-editor-*`、图表的 `--astryx-color-data-*`），**放在 themes 包里**，每套主题各一份，写在 `@layer astryx.tokens`。这和 core 组件的做法一样。数据配色变量 `--astryx-color-data-categorical-*` 已经在 `packages/themes/neutral/base.css` 里了，charts 可以直接用。
4. 新包的 CSS 不重复 core 的东西（关键帧、通用变量），这对应 FR2 的「不重复」。如果一个新包要用 core 的 `motion.css` 之类，就依赖 core 的样式表。
5. `package.json` 的 `sideEffects` 写 `["**/*.css"]`，`exports` 里放 `./<name>.css` 和 `./styles/*.css`。
6. 「`reset.css` 要不要也先声明一次完整的层顺序」（FR3 的另一半），这是 core 的事，归 B2，不在本 ADR 范围里。

### 7.2 版本号

| 包 | 版本策略 | 理由 |
| --- | --- | --- |
| `@astryx-vue/richtext` | **加入 core 和 themes 的 fixed 组**，三个包版本号一致。fixed 组是 Changesets 的一个设置（`.changeset/config.json` 里的 `fixed`）：写在同一组里的包永远用同一个版本号，一个升版，其它的跟着一起升 | 它是正式版，peer 依赖 core 的同一个版本，和上游一样（上游 richtext 也是 0.7.1，与 core 同版） |
| `@astryx-vue/charts`、`@astryx-vue/lab` | 不加入 fixed 组，用 canary 版本 `<core 下一版本>-canary.<短提交号>` | 只发 canary，跟上游一样，版本号以 core 为准加后缀 |
| `@astryx-vue/nuxt`（F4） | 独立版本，像 cli 一样 | 它是工具，和组件版本没有一一对应关系 |

richtext、charts、lab 对 core 的 peer 依赖都写成 `workspace:^`，发布时由 pnpm 改成具体版本。

### 7.3 新包接进仓库要改哪些地方

只列清单，不在本节点实现。

| 位置 | 要改什么 | 归哪个节点 |
| --- | --- | --- |
| `scripts/check-package-boundaries.mjs` | 第 42 到 44 行的公开包名单写死了 core、themes、cli，要加上 richtext；charts、lab 是 private，可以不加，但最好改成从 `list-public-packages.mjs` 拿名单，避免以后再漏 | F1a（第一个新建包的节点） |
| `scripts/sync-exports.mjs` 和 `scripts/sync-exports/*` | 现在只处理 core 的 `index.ts`、`styles.css`、`package.json` 的 `exports`，以及主题入口。要推广成「按包处理」，让每个新包都能生成自己的 `index.ts`、`<name>.css` 和 `exports` | 第一个有组件的新包节点（F1b 或 F2b，先到先做），其余节点复用 |
| `scripts/sync-exports/render-css.mjs` | 主题入口要能汇总新包需要的主题变量文件 | 同上 |
| `scripts/guardrails/line-limit.config.mjs` | 新包生成出来的 `index.ts` 要加进排除名单 | 同上 |
| `.changeset/config.json` | `fixed` 组加上 `@astryx-vue/richtext` | F1a |
| `.github/workflows/release.yml` | 新增 canary 发布 job；首发占住 `latest` | G3 |
| `package.json` 的 `release:dry-run` | 现在写死了三个 `--filter`，要加上 richtext | G3 |
| `RELEASING.md` | 写明新包的发布方式和 canary 规则 | G3 |
| `tsconfig.json`、`vitest.config.ts` | 新包的 `tsdown.config.ts` 已经被 `packages/*/tsdown.config.ts` 覆盖；vitest 的 `packages/**/*.test.ts` 也已经覆盖。只要确认一下即可 | 各包节点 |
| `packages/core/src/ssr-smoke.test.ts` | 新包组件也要跑服务端渲染冒烟测试，可以在各包里建同样的测试 | 各组件节点 |
| 文档站 `apps/docs` | `package.json` 加新包依赖；侧边栏加「富文本」「图表」「实验组件」分区；lab 和 charts 的页面要清楚标上「canary，API 可能会变」 | F1c、F2c、F3f |
| 文档站的 `llms.txt` 生成 | 确认新包的页面能被收录 | F1c、F2c、F3f |
| CLI 目录（`packages/cli/src/generate/build-catalog.ts`） | 这个文件里有多处写死了 core：字符串 `@astryx-vue/core`、读 `packages/core/package.json` 的路径、`INSTALLABLE_PACKAGES` 名单等。要把该文件里所有写死 core 的地方都改成能识别多个包，并在每条结果里标出来自哪个包 | 建议交给 D4b（它本来就有「结果标明来源包」这一项），F1c、F2c、F3f 依赖 D4b |
| `scripts/check-templates.mjs` | 演练场模板的检查目前只认 vue 和 core。如果以后模板要用新包，再加 | 以后 |
| 文案 | 新组件的文案键（`@astryx.richTextEditor.*` 29 条、`@astryx.transferList.*` 26 条、`@astryx.listInput.*` 16 条、`@astryx.diffViewer.*` 19 条、`@astryx.emojiPicker.*` 16 条、`@astryx.chart.*` 3 条、`@astryx.chartLegend.*` 1 条）已经在 `packages/core/locales/*.json` 里。新包要能用 core 的 `useTranslator`，需要把这些键接进 `upstreamMap`。core 的文案表要不要按包拆，由第一个用到文案的节点决定 | 各组件节点 |

### 7.4 Nuxt 模块（F4）

**建议：F4 先只注册 core 和 themes。** 新包在模块里做成「可选开关」，比如 `astryx: { richtext: true, charts: true, lab: true }`。打开后，模块才自动注册这个包的组件，并引入它的 `<name>.css`。

理由：

1. F4 依赖的是「C 全部」，比 F1b、F2b、F3 都可能更早完成。要是等新包，F4 会被拖住。
2. richtext 带一大套 peer 依赖（Lexical），lab 和 charts 只是 canary。默认全部注册，会让没装这些依赖的用户报错。
3. 新包做完时，在各自的文档节点（F1c、F2c、F3f）里给 Nuxt 模块补上对应开关，改动很小。如果到时 F4 已经完成，就在文档节点里顺手补。
4. richtext 编辑器只在浏览器里工作。Nuxt 里要用 `<ClientOnly>` 包起来，或者由组件自己在服务端只输出外框。这一点 F1b 要考虑，F4 只需要在文档里提醒。

---

## 8. 给 F 阶段各节点的范围建议

| 节点 | 范围 | 依赖（建议） | 备注 |
| --- | --- | --- | --- |
| F1a richtext 纯逻辑 | 第 2.6 节的 F1a 清单；新建 `packages/richtext` 包骨架、`./markdown` 子路径；边界检查和 changeset 配置 | F0、C9 | C9 要提供上游那样的 Markdown 解析器（`parseMarkdownAst`、`parseInlineAst`、`decodeMarkdownCharacterReferences`）和插件协议子路径。解析器是硬前提；插件协议不提供的话，F1a 先拆掉 `markdownExtensions` 那一支（见 2.7） |
| F1b richtext 编辑器 | 第 2.6 节的 F1b 清单 | F1a、C1（Field 和 TextArea 外框）、C2（CheckboxInput、ToggleButton）、C3（Selector）、C7（Dialog）、C14（Toolbar、Layout、Divider）、C16（Button、IconButton、Icon） | 原来写的是 F1a、C6、C16。依据是上游 richtext 非测试源码里的全部 `@astryxdesign/core/*` 导入：工具栏 `RichTextEditorToolbar.tsx` 导入了 `Selector`（C3）、`ToggleButton`（C2）、`Dialog`（C7）、`Toolbar`、`Layout`、`Divider`（C14）；编辑器外框用 `Field`（C1）；任务勾选框用 `CheckboxInput`（C2）。没有找到任何 C6（菜单家族）的导入，C6 可以去掉。Markdown 扩展节点渲染要用 C9 的 `plugin-renderer`，已经经由 F1a 依赖 C9 |
| F1c richtext 文档 | 中英文文档、示例；Nuxt 开关（如果 F4 已经完成） | F1b | |
| F2a charts 纯逻辑 | 第 3.4 节；新建 `packages/charts` 包骨架（private，只发 canary） | F0、B1 | B1 要确认 `--astryx-color-data-*` 变量齐全 |
| F2b charts 组件 | 6 个配套组件，加 8 个 SVG 标记的渲染 | F2a、C7、C14（HStack、VStack）、C16（Text）、B7（`characterCount`、`truncateCharacters`） | **不含** 4 个 WebGL 标记。提示框用的是 `useLayer`（B4，C7 已经依赖它），不是 Popover |
| F2c charts 文档 | 中英文文档、示例；可选：「和 Vega-Lite 一起用」小节 | F2b | |
| F2d charts WebGL 标记（新增，可延后） | `dotGL`、`dotGLInteractive`、`heatmapGL`、`streamGL`，以及 lab 的 GL 系列和 `ThreeDScatterGL` | F2b | 建议先不开工，等上游这部分成熟后再定 |
| F3a lab 输入类 | ListInput、TransferList、MobileTokenizer；新建 `packages/lab` 包骨架（private，只发 canary） | F0、C3、C8（BottomSheet）、C11（Table 的 `ColumnWidth`）、C12（List、Item）、C14（Stack）、C15（EmptyState、Indicator）、C16（Button、IconButton、Token） | 原来写的是 F0、C3。MobileTokenizer 用 BottomSheet、Typeahead、EmptyState、Indicator，ListInput 用 Table 的列宽类型和 EmptyState，TransferList 用 List、Item、Stack |
| F3b lab 展示类 | Stat、CircularProgress、InfoTip、SVGIcon、LogStream | F0、C7（Tooltip）、C16（Icon） | 把 Schedule 拆出去。原来写的是 F0、C15、C7。这 5 个里只有 InfoTip 用了 core 组件（Tooltip、Icon），其余 4 个只用 token 和 `mergeProps`；C15 的组件只有 Schedule 用到（Spinner），跟着 Schedule 移到 F3b2 |
| F3b2 lab 日程表（新增） | Schedule（约 5700 行） | F0、B7（`PlainDate` 日期工具）、C6（DropdownMenu）、C7（Popover）、C14（Stack）、C15（Spinner）、C16（Button、ButtonGroup、Token、Text） | 太大，单独一个节点。它用的日期工具是上游 `core/utils/plainDate.ts`，属于 B7 台账，不是 C5 的日期组件；Schedule 没有导入 Calendar、DateInput 等 C5 组件 |
| F3c lab 浮层与引导 | Drawer、Tour | F0、C7、C14（Layout）、C16（Button、Heading、Text、Icon） | 原来写的是 F0、C7、C8。Drawer 和 Tour 都没有导入 BottomSheet（Drawer 只在文档里提到「竖向面板请用 BottomSheet」），C8 可以去掉 |
| F3d lab 图表类 | Chart（组件组合写法，复用 charts 逻辑）、ChartBrush、ChartZoom、ChartSelect、m4Reduce、useChartRange、Radial、Sankey、ThreeD 的 SVG 部分 | F2b、C16（IconButton） | 不含 GL。颜色工具从 charts 包拿（见 3.4） |
| F3d2 lab 代码类（新增，从 F3d 拆出） | CodeEditor、DiffViewer（`parseUnifiedDiff` 和数据类型） | F0、C9 | 不用等 F2b |
| F3e lab 对话 | 只做 ChatEmojiPicker、ChatReactionBar；对一下 ChatReasoning、ChatTypingIndicator、ChatUnreadDivider 的上游 lab 改动，有差异就交给 C10 | F0、C10、C7（Popover、Tooltip） | ChatReasoning 等三个已经在 core 里。两个要做的组件用到 Popover、Tooltip、TextInput，C10 只依赖 C9、C6、C1，不含 C7，所以要单独加上 |
| F3f lab 文档 | 文档站里单独的 lab 分区，页面标上 canary | F3a 到 F3e | |
| F4 Nuxt 模块 | 只注册 core 和 themes，给新包留开关 | A3、C 全部 | 见 7.4 |
| F5 vega | **不做**。台账 4 条都标不适用 | F0 | 见第 5 节 |
| F6 build | **不做**。台账 11 条都标不适用 | F0 | 见第 6 节 |
| G3 首发新包 | 发 `@astryx-vue/richtext`（latest）；发 `@astryx-vue/charts`、`@astryx-vue/lab`（canary，先占住 latest）；发 `@astryx-vue/nuxt`；新增 canary 发布 job | G1、F1c、F2c、F3f、F4 | |

---

## 9. 后果

**要做的事：**

- 新增 3 个包：richtext（正式版）、charts（canary）、lab（canary）。
- 自己写一层 Lexical 的 Vue 绑定，并长期维护。
- `sync-exports`、边界检查、CLI 目录生成、发布流程，都要从「只认 core」改成「认多个包」。
- 新增 canary 发布流程。

**不做的事：**

- 不做 vega 包、不做 build 包。
- 先不做所有 WebGL 渲染（charts 的 4 个 GL 标记、lab 的 GL 系列、`ThreeDScatterGL`）。
- 不重复做已经在 core 里的 ChatReasoning、ChatTypingIndicator、ChatUnreadDivider。
- 不用 `lexical-vue`，不用 ECharts。

**风险：**

- Lexical 还在 0.x，升级时可能要改绑定。缓解办法：跟上游锁同一个次版本，一起升。
- 自写的绑定要处理装饰节点（DecoratorNode）的渲染，这是 Lexical 在非 React 环境里最容易出问题的地方。上游默认节点里的装饰节点只有两个：`RichTextExtensionNode`（Markdown 扩展节点）和 Lexical 自带的 `HorizontalRuleNode`（分割线，它的 `decorate()` 返回 `null`，不用画组件）。任务勾选框不是装饰节点：`TaskCheckboxPlugin.tsx` 把勾选框画成叠在列表项旁边的兄弟元素。缓解办法：参考 `lexical-vue` 的 `LexicalDecoratedTeleports`；F1b 先拿 Markdown 扩展节点验证 Teleport 这条路。
- richtext 的「保留原文」导入导出和大部分 Markdown 测试，都依赖 C9 提供和上游一致的解析器；「Markdown 扩展」还依赖 C9 对齐上游的插件协议。解析器对不齐，F1a 做不了；只有插件协议对不齐，就只推迟「Markdown 扩展」。
- 上游 charts 和 lab 还是 canary，变化快。我们移植的是 `v0.7.1` 的快照，以后同步可能比较频繁。

---

## 附录 A：richtext 试验

试验目录：`/tmp/f0-spike/lexical`、`/tmp/f0-spike/tiptap`（用完已经删掉 `node_modules`）。日期：2026-10-20。

**A.1 Lexical 在 Vue 里能不能跑**

- 环境：Node 26，`lexical` 和 `@lexical/*` 0.52.0，`vue` 3.5.43，`happy-dom` 20.14.5。
- 做法：一个 Vue 组件在 `onMounted` 里调用 `buildEditorFromExtensions(defineExtension({ dependencies: [RichTextExtension, HistoryExtension, HorizontalRuleExtension], nodes: [...], $initialEditorState: () => $convertFromMarkdownString(...) }))`，再调用 `editor.setRootElement(div)`；在 `onBeforeUnmount` 里销毁。编辑器实例用 `shallowRef` 保存，并通过 `expose` 暴露出去。
- 结果：
  - DOM 正常画出 `<h1>`、`<p>`、`<strong>`，带 `contenteditable` 和 `data-lexical-editor`。
  - 选中段落后执行 `FORMAT_TEXT_COMMAND 'italic'`，导出的 Markdown 从 `hello **world**` 变成 `*hello **world***`。
  - 执行 `UNDO_COMMAND` 后回到 `hello **world**`。
  - 整个过程没有装任何 React 包。

**A.2 Markdown 往返对比**

12 个样例，都只用库自带的转换器，不加上游的保留原文逻辑：

| 输入 | Lexical 0.52 | Tiptap 3.32 |
| --- | --- | --- |
| 标题、粗体、斜体、行内代码、链接 | 原样 | 原样 |
| 嵌套无序列表（4 格缩进） | 原样 | 缩进变 2 格 |
| 有序列表 `1.` | 原样 | 原样 |
| 任务列表 | 原样 | 原样 |
| 引用 | 原样 | 原样 |
| ```` ```ts ```` 代码块 | 原样 | 原样 |
| `\*` 转义和 `&amp;` | 原样 | 原样 |
| `*` 无序列表 | 原样 | 变成 `-` |
| `__bold__` | 变成 `**bold**` | 变成 `**bold**` |
| Setext 标题（`Title` 下一行 `=====`） | 原样（但没有读成标题，按普通段落文字保留） | 变成 `# Title` |
| GFM 表格（`\|---\|:-:\|`） | 原样（这里没注册表格节点，按普通段落文字保留） | 重新对齐，前后多了空行 |
| `~~~` 围栏 | 被转义成 `\~\~\~` | 变成 ```` ``` ```` |

合计：Lexical 10/12，Tiptap 6/12。「按普通段落保留」是导入后看编辑器状态里的节点类型确认的：这两个样例导入后都只有一个 `paragraph`，没有 `heading` 或 `table`。所以它们的「原样」不说明 Lexical 支持这两种写法。去掉这两行后，Lexical 是 8/10，Tiptap 是 6/10（Tiptap 在这两行本来就是「变了」）。上游用自己的 `TABLE` 转换器（`markdownTable.ts`）和 `markdownSource.ts` 里对 Setext 的处理补上了这两种。

结论：Lexical 自带的转换器已经接近原样往返，剩下的差异正是上游 `markdownSource.ts` 等文件补上的。Tiptap 的序列化器会主动把写法改成标准格式，想保留原文要整套重写。

复现（2026-10-21）：用 `/tmp/f0-spike/lexical/package-lock.json` 和 `/tmp/f0-spike/tiptap/package-lock.json` 在 `/tmp/f0-spike2/` 重新安装、重跑，结果和上表一致。

**A.3 体积**

用 esbuild 打包（`--bundle --minify --format=esm --platform=browser`，`NODE_ENV=production`），再 gzip -9：

- Lexical（lexical、extension、rich-text、history、list、link、code、table、markdown、html、selection、utils）：压缩后 523 KB，gzip 后约 170 KB。最大的几块：`lexical` 202 KB，`@lexical/table` 73 KB，`@lexical/extension` 37 KB（都是压缩后、gzip 前）。
- Tiptap（core、starter-kit、extension-table、extension-list 的任务列表、markdown）：压缩后 499 KB，gzip 后约 157 KB。最大的几块：`prosemirror-view` 96 KB，`@tiptap/core` 89 KB，`marked` 40 KB。

## 附录 B：charts 试验

试验目录：`/tmp/f0-spike/charts`（用完已经删掉 `node_modules`）。日期：2026-10-20。

- d3 加 Vue 服务端渲染：用 `d3-scale` 的 `scaleBand`、`scaleLinear`，`d3-shape` 的 `stack`、`line` 算出堆叠柱和折线，在 `createSSRApp` 里用 `h('svg')`、`h('rect')`、`h('path')` 画出来，再用 `@vue/server-renderer` 的 `renderToString` 渲染。输出是完整的 SVG 字符串，`fill` 可以直接写 `var(--astryx-color-data-categorical-blue)`。
- 体积（esbuild 打包、压缩，gzip -9）：
  - d3 三件套（`scaleLinear`、`scaleBand`、`scaleTime`、`line`、`area`、`stack`、`curveMonotoneX`、`extent`、`max`）：压缩后约 44 KB，gzip 后约 16 KB。
  - ECharts 6.1.0 按需引入（BarChart、LineChart、Grid、Tooltip、Legend、SVGRenderer）：压缩后约 564 KB，gzip 后约 193 KB。

## 附录 C：资料来源

上游源码（都用 `git show v0.7.1:<路径>` 确认过存在）：

- `packages/richtext/package.json`、`src/index.ts`、`src/markdown.ts`、`src/RichTextEditor.doc.mjs`、`src/RichTextEditor.tsx`、`src/RichTextEditorToolbar.tsx`、`src/TaskCheckboxPlugin.tsx`、`src/textSemantics.ts`、`src/markdownSource.ts`、`src/markdownSerializers.ts`、`src/markdownExtensions.ts`、`src/markdownExtensionNode.ts`、`src/markdownCharacterReferences.ts`、`src/editorNodes.ts`，以及 27 个 `src/markdown*.test.*` 和 `src/textSemantics.test.tsx`、`src/publicSurface.test.ts`
- `packages/charts/package.json`、`README.md`、`src/index.ts`、`src/types.ts`、`src/layout.ts`、`src/getChartColors.ts`、`src/webgl.ts`、`src/Chart.tsx`、`src/ChartAxis.tsx`、`src/ChartTooltip.tsx`、`docs/CHARTV2_READINESS.md`
- `packages/core/src/utils/color.ts`、`packages/core/src/utils/plainDate.ts`、`packages/core/src/utils/index.ts`、`packages/core/src/Markdown/parser.ts`、`packages/core/src/theme/tokens.ts`（`resolveThemeTokens`）
- `packages/lab/package.json`、`README.md`、`src/index.ts`、`astryx.integration.mjs`，以及 19 个组件目录（组件的 core 依赖是把每个目录非测试、非文档源码里的 `@astryxdesign/core*` 导入全部列出来得到的）
- `packages/vega/package.json`、`README.md`、`src/VegaChart.tsx`、`src/vegaLiteConfig.ts`、`src/schema.ts`、`src/viewInputs.ts`、`src/types.ts`
- `packages/build/package.json`、`README.md`、`src/index.js`、`src/babel.js`、`src/vite.ts`、`src/next.js`
- `docs/specs/AST-080-package-stylesheets/spec.md`、`docs/specs/AST-061-document-surface-parity/spec.md`（FR7）
- `.github/workflows/release.yml`（canary 发布流程）

外部资料（查询日期都是 2026-10-20；2026-10-21 复核了 vega 三件套的版本和下载量、上游 5 个包的 dist-tag、`lexical-vue` 的版本和 Lexical 依赖、`@lexical/headless@0.52.0` 的依赖、`@astryx-vue/*` 四个名字仍未被占用）：

- npm 版本和依赖：`npm view <包名> version dependencies peerDependencies dist-tags`
- 周下载量：`https://api.npmjs.org/downloads/point/last-week/<包名>`（统计区间 2026-10-12 到 2026-10-18）
- GitHub 仓库状态：`gh api repos/<owner>/<repo>`，`gh api repos/wobsoriano/lexical-vue/contributors`
- Lexical 扩展机制：`@lexical/extension` 0.52.0 的导出列表（`buildEditorFromExtensions`、`defineExtension` 等），已经在附录 A 的试验里实际调用过

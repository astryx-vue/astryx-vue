# Astryx 原版与 astryx-vue 缺漏对照

这份清单只记源码里能对上的差异。原版仓库是 `https://github.com/facebook/astryx`，对照时用的是 2026-10-14 的 `main` 提交 `5f9be6c18deb78e6e27493c7a2932a0f86308273`（`@astryxdesign/core` 的 `package.json` 版本是 `0.7.1`）。本仓库是 `dev` 上的 `edbceb0`（`@astryx-vue/core` `0.2.0`）。

本仓库 `package.json` 里的 `upstream` 仍写着 `0.4.1` / `96f9917`。那是早期移植时钉的点，不是这次对照的版本。原版从那之后到 `0.7.1` 加了大量组件和文档，下面按现在的源码算。

## 怎么读

原版公开组件以 `packages/core/src/**/*.doc.mjs` 里 `export const docs` 的 `name` 为准，属性以该对象里的 `props` 为准，再和本仓库 `packages/core/src/**/types.ts` 对过。文档站页面以 `apps/docsite` 和 `packages/cli/assets` 为准。主题变量以 `packages/core/src/theme/tokens.stylex.ts`、`dataTokens.stylex.ts`、`syntax/tokens.ts` 和本仓库 `packages/themes/neutral/base.css` 为准。

下面这些名字不同，但行为已经有，不当作缺漏：

| 原版 | 我们 | 依据 |
| --- | --- | --- |
| `value` / `onChange` | `modelValue` / `update:modelValue`，以及 `change` | 例如 `SelectorProps`、`CalendarProps`、`TextInputProps` |
| `isDisabled` | 一部分控件用 `disabled` | `DateInputProps`、`SelectorProps`、`PaginationProps` |
| `hasClear` / `disabledMessage` | `clearable` / `disabledReason` | `DateInputProps`、`SelectorProps` |
| `children`、`icon`、`endContent`、`renderX` | 默认插槽、具名插槽 | `ButtonSlots`、`Badge.vue` 的 `icon` 插槽、`SelectorSlots.selected` |
| `onClick` 这类回调 prop | 组件事件 | `ButtonEmits` |
| `xstyle` / `className` / `style` | 属性透传和 CSS 变量，没有 StyleX | `BaseProps.ts` 里的 `xstyle` 是 StyleX 专用 |
| `emptyState` | `empty` 插槽 | `ChatLayoutSlots` |
| `useGridFocus` | `useGridRovingFocus` | `composables/useGridRovingFocus.ts`，方向键在网格里移动 |

`HStack`、`VStack` 在 `packages/core/src/Stack`。`NavIcon` 在 `NavItem`。`Code` 和 `CodeBlock` 在同一个 `Code` 目录。`CheckboxIndicator` 已经是独立组件。七套正式主题（neutral、butter、chocolate、gothic、matcha、stone、y2k）目录都在。原版 `packages/themes/probe` 是内部探针，不移植。

统计只计下面有 P0 / P1 / P2 的条目。最后一节「明确不移植」不计入。

## 1. 组件

### 1.1 原版有、我们没有的整块能力

#### 1. 对话输入套件

- 优先级：P0
- 批次：B1
- 原版位置：`packages/core/src/Chat/`。公开导出在 `Chat/index.ts`：`ChatComposer`、`ChatComposerInput`、`ChatComposerDrawer`、`ChatSendButton`、`ChatComposerTokenElement`、`ChatTokenizedText`、`ChatDictationButton`，以及 `useChatComposerTokens`、`useChatDictation`、`useChatPasteAsToken`、`useSpeechRecognition`。说明在对应的 `*.doc.mjs`。
- 我们现状：`packages/core/src/Chat/index.ts` 导出消息列表、气泡、推理、工具调用、正在输入、未读分隔和 `ChatLayout`。`ChatLayoutSlots` 只有一个 `composer` 插槽。`apps/docs/docs/zh/guide/patterns.md` 写明输入区由应用自己做。
- 缺什么：原版那套输入壳、可插入 token 的输入框、发送/停止按钮、附件抽屉、语音听写。滚动贴底已经有，在 `composables/useChatStreamScroll.ts` 和 `useChatNewMessages.ts`，这块不用重做。
- 意见：消息区不必推倒。输入套件按 Vue 组件补，听写依赖浏览器 `SpeechRecognition`，应做成可选，不要绑死一套语音服务。

#### 2. PowerSearch

- 优先级：P0
- 批次：B2
- 原版位置：`packages/core/src/PowerSearch/`，入口 `PowerSearch/index.ts`，说明 `PowerSearch.doc.mjs`。这是带字段、运算符和值编辑器的结构化搜索，不是普通输入框。
- 我们现状：没有这个目录。`Table` 的过滤是 `TableFilterField`（`string` 或 `enum`），`packages/core/src/Table/types.ts` 自己匹配，不调用 PowerSearch。
- 缺什么：查询语法、字段运算符、token 化的查询条。
- 意见：表格现有的行内过滤先留着。PowerSearch 是另一套查询语言，单独做，不要塞进 `Table` 的 `filter` 字段里。

#### 3. 菜单里的勾选行和单选行

- 优先级：P1
- 批次：B3
- 原版位置：`packages/core/src/DropdownMenu/DropdownMenuCheckboxItem.doc.mjs`、`DropdownMenuRadioGroup.doc.mjs`、`DropdownMenuRadioItem.doc.mjs`。角色是 `menuitemcheckbox` 和 `menuitemradio`。面包屑菜单复用同一套，见 `Breadcrumbs/index.ts` 导出的 `BreadcrumbMenuCheckboxItem` 等。
- 我们现状：`DropdownMenu/index.ts` 只有 `DropdownMenu`、`DropdownMenuItem`、`DropdownMenuSubMenu`、`DropdownMenuGroup`、`DropdownMenuDivider`。`ContextMenuItemData` 的 `type` 只区分普通行、分隔线和分组。`menuItemRoles.ts` 虽然列出了 `menuitemcheckbox`，没有对应组件。
- 缺什么：可切换的布尔项、一组里互斥的单选项，以及键盘切换时不关闭菜单的行为（原版 `hasCloseOnSelect`）。
- 意见：做成数据项上的 `type: 'checkbox' | 'radio'` 加对应子组件，两套 API 都要有。不要只加角色字符串。

#### 4. 可替换的指示器

- 优先级：P1
- 批次：B4
- 原版位置：`packages/core/src/Indicator/`。`Indicator.doc.mjs` 写明：勾、复选框、单选圆点是装饰图形，业务控件保留角色和键盘；`defineTheme({ indicators })` 按名字替换后，所有使用处一起变。`Indicator/index.ts` 导出 `CheckboxIndicator`、`CheckIndicator`、`RadioIndicator`、`useIndicator`。
- 我们现状：只有 `packages/core/src/CheckboxIndicator`。单选圆点画在 `Radio` 的样式里。`Theme/types.ts` 的 `DefineThemeInput` 没有 `indicators`。
- 缺什么：`CheckIndicator`、`RadioIndicator`，以及按名字换图形的注册表。
- 意见：图形可以继续用 SVG 组件，但替换入口要有。不要把每个调用点都改成传插槽。

#### 5. 日历和日期输入还缺一截

- 优先级：P1
- 批次：B5
- 原版位置：`packages/core/src/Calendar/Calendar.doc.mjs`，`DateInput/DateInput.doc.mjs`，`DateRangeInput`，`DateTimeInput`。
- 我们现状：`Calendar/types.ts` 有 `modelValue`、`mode`、`range`、`numberOfMonths`（1 或 2）、`min`、`max`、`isDateDisabled`、`focusDate`。`DateInput/types.ts` 有 `presentation`（popover、bottom-sheet、adaptive-bottom-sheet）和 `format`，没有周起始日，也没有系统原生选择器。
- 缺什么：
  - 周数、月外日期、可变行数、`weekStartsOn`
  - 结构化的 `dateConstraints`，以及区间的 `minRangeSpan` / `maxRangeSpan`
  - `handleRef`（原版用来命令式翻月、聚焦）
  - 日期输入的 `nativePicker`、`numberOfMonths`、`isLoading`、`labelTooltip`，以及返回 Promise 的 `changeAction`
  - 日期字段上的 `isOptional` / `isRequired`（`DateInputProps` 没这两项；`ComplexSelector` 有）
- 意见：`min` / `max` / `isDateDisabled` 不要删。原版的 `dateConstraints` 是在这之上的打包对象，补一层适配即可。原生选择器是另一条交互，和 popover 日历并存。

#### 6. 选择器还缺只读、加载和「新建一项」

- 优先级：P1
- 批次：B6
- 原版位置：`packages/core/src/Selector/Selector.doc.mjs`，`MultiSelector/MultiSelector.doc.mjs`。
- 我们现状：`Selector/types.ts` 已有搜索、清除、分组、`variant`、`presentation`、`selected` 和 `option` 插槽。`MultiSelector/types.ts` 已有全选、触发器展示（count、labels、badges）和 `checkboxPosition`。`ComplexSelector` 已有 `handleRef`、`changeAction`、`renderTrigger` 对应的触发器插槽，这项不算缺。
- 缺什么：
  - `Selector`：`isReadOnly`、`isLoading`、`isOptional`、`isRequired`、`indicatorPosition`、搜索无结果专用文案（现在只有一个 `emptyText`）
  - `MultiSelector`：`isReadOnly`、`isLoading`、`formatValue`、`hasCreate`（输入即创建）、`handleRef`
- 意见：`renderValue` 已经落成 `selected` 插槽，不要再加同名 prop。

#### 7. InputGroup 还不是字段

- 优先级：P1
- 批次：B6
- 原版位置：`packages/core/src/InputGroup/InputGroup.doc.mjs`，`InputGroupText.doc.mjs`。原版 InputGroup 自带标签、说明、状态、必填/可选。
- 我们现状：`InputGroup/types.ts` 只有 `size`、`disabled` 和 `before` / `default` / `after` 插槽。没有 `InputGroupText`。
- 缺什么：字段壳（label、description、status、optional、required）和组内前后缀文本组件。
- 意见：前后缀继续用插槽。字段壳应和 `Field` 共用，不要复制一套标签标记。

#### 8. 表格还缺分组、树、展开行和固定列

- 优先级：P1
- 批次：B2
- 原版位置：`packages/core/src/Table/` 下这些钩子文档：`useTableGroupedRows.doc.mjs`、`useTableTreeData.doc.mjs`、`useTableTreeState.doc.mjs`、`useTableRowExpansion.doc.mjs`、`useTableStickyColumns.doc.mjs`、`useTableRowStatus.doc.mjs`、`useTableRowIndex.doc.mjs`。
- 我们现状：`Table/types.ts` 的 `TablePlugin` 有排序、过滤、选择、列宽。`Table/index.ts` 导出了对应的 `useTableSortable`、`useTableFiltering`、`useTableSelection`、`useTableColumnResize`、`useTableColumnSettings`、`useTablePagination`。
- 缺什么：分组行、树形数据、行展开、固定列、行状态（成功/警告一类的行色）、按可见窗口报告行号。原版 `rowCount` 用来做窗口化，我们的 `TableProps` 没有这项。
- 意见：沿用现在的 plugin 形状接进去，不要改回原版那一长串独立 hook 的调用方式，除非 plugin 表达不了。过滤先不要绑死 PowerSearch，那是条目 2。

#### 9. 代码块的 diff 层

- 优先级：P1
- 批次：B8
- 原版位置：`packages/core/src/CodeBlock/CodeBlock.tsx` 的 `isDiff`，规格在 `CodeBlock.spec.md` 的 FR9。语法色在 `packages/core/src/theme/syntax/tokens.ts`：`--color-syntax-added`、`--color-syntax-removed`、`--color-syntax-diff-header` 以及 added/removed marker。
- 我们现状：`Code/types.ts` 的 `CodeBlockProps` 有高亮行、行号、复制、换行，没有 `isDiff`。`syntaxTheme.test.ts` 用的变量名是 `--astryx-code-syntax-keyword` 这一组，没有 diff 槽位。
- 缺什么：按行首 `+`、`-`、`@@` 给整行上色，同时继续对剩余文本做语法高亮。
- 意见：色名可以对齐原版的 `--color-syntax-*`，再在主题里映射到现在的 `--astryx-code-syntax-*`。不要做两套互不相干的名字。

#### 10. Markdown 还不能挂插件

- 优先级：P1
- 批次：B8
- 原版位置：`packages/core/src/Markdown/Markdown.doc.mjs` 的 `plugins`、`inlinePlugins`、`autolink`、`citationStyle`。插件实现在 `packages/core/src/Markdown/` 以及独立包 `packages/richtext`（见第 4 节，富文本编辑器不在这项里）。
- 我们现状：`Markdown/types.ts` 有 `content`、`isStreaming`、`sources`、`components`、`onLinkClick`。`sources` 能把 `[id]` 画成引用芯片。没有插件列表，也没有自动链接开关。
- 缺什么：remark 风格的块级/行内插件，以及引用芯片的样式开关。
- 意见：插件 API 用我们自己的 AST（`Markdown/ast.ts`），不要把原版 React 插件组件原样搬过来。

#### 11. 顶栏、侧栏和标题菜单

- 优先级：P1
- 批次：B7
- 原版位置：
  - `packages/core/src/TopNav/TopNavHeading.doc.mjs`：`logo`、`superheading`、`subheading` 和各自的链接、`headerEndContent`、`menu`
  - `TopNavMegaMenu.doc.mjs`、`TopNavMegaMenuFeaturedCard.doc.mjs`：`items`、`featured`，配图卡有 `image`、`imageAlt`、`linkLabel`、`linkHref`
  - `SideNav/SideNav.doc.mjs`：`resizable`、`handleRef`
  - `NavMenu/NavHeadingMenu.tsx`，契约在 `NavHeadingMenu.spec.md`：挂在侧栏或顶栏标题上的菜单
- 我们现状：`TopNav/types.ts` 的标题只有 `heading`、`href` 和 `icon` 插槽。巨型菜单有，配图卡没有图片字段（`TopNavMegaMenuFeaturedCardProps` 只有 title、description、href）。`SideNavProps` 能收起成图标栏，不能拖宽度。`Layout` 的面板有 `resizable`，侧栏本身没有。没有 `NavHeadingMenu`。
- 缺什么：多级标题、配图卡、侧栏宽度拖拽、标题上的菜单。
- 意见：拖拽复用 `useResizable` 和 `ResizeHandle`，不要再做一个 Resizable 组件壳。原版 `Resizable` 组件（`packages/core/src/Resizable/Resizable.doc.mjs`）因此不单列。

#### 12. 链接不能换成路由组件

- 优先级：P1
- 批次：B7
- 原版位置：`packages/core/src/Link/LinkProvider.doc.mjs` 和 `Link.doc.mjs` 的 `as`。`Button` 在带 `href` 时也有 `as`。头像、面包屑同理。
- 我们现状：`Button/types.ts` 有 `as`。`Link/types.ts` 和 `Avatar/types.ts` 没有，链接根就是 `<a>`。`NavItem` 的类型里有 `NavLinkComponent`，顶栏项可以换组件。
- 缺什么：`Link`、`Avatar` 以及还在用原生 `<a>` 的入口，无法直接套 Vue Router 的 `RouterLink`。另外 `Link` 没有原版的 `label`（可见文字与无障碍名分离）、`maxLines`、`size`、`weight`、`newTabLabel`。
- 意见：不要移植 `LinkProvider` 那种包住整棵树的 React 上下文。每个链接组件加 `as` 就够了。

#### 13. defineTheme 还只能改 token

- 优先级：P1
- 批次：B9
- 原版位置：`packages/core/src/theme/defineTheme.ts` 的 `DefineThemeInput`。相关实现：`expandColorScale.ts`（HCT）、`expandTypeScale.ts`、`expandRadiusScale.ts`、`expandMotionScale.ts`。Neutral 的具体刻度在 `packages/themes/neutral/src/neutralTheme.ts`：`motion: { fast: 125, medium: 300, slow: 700, ratio: 0.75 }`，正文字体 Figtree。
- 我们现状：`packages/core/src/Theme/types.ts` 的 `DefineThemeInput` 只有 `name`、`tokens`、`extends`、`syntax`、`onDark`、`onLight`。七套主题是手写 CSS。`neutral/base.css` 已按同一套 motion 数字写死时长，正文也是 Figtree。
- 缺什么：从强调色生成调色板、从 base/ratio 生成字号和圆角、从 fast/medium/slow 生成时长、按组件覆盖样式、主题级图标表（图标见条目 23）。
- 意见：继续用手写 CSS 发七套主题，不必上 StyleX。缺的是给「自己做一套主题」的人用的生成函数，输出 CSS 变量即可。`astryx theme build` 那条命令不移植。

#### 14. 图表用的数据色

- 优先级：P1
- 批次：B9
- 原版位置：`packages/core/src/theme/dataTokens.stylex.ts`，变量名 `--color-data-*`（分类色和 blue/gray/orange 等 1–5 阶）。`tokens.stylex.ts` 文件头写总表约 263 个 token。
- 我们现状：`neutral/base.css` 有语义色、间距、圆角、阴影、时长。全仓库没有 `--astryx-color-data-` 或 `--color-data-`。
- 缺什么：分类色和连续色阶。图表包要靠它们上色。
- 意见：先把变量和 Neutral 的值补上，即使图表组件还没做。不要等 `@astryxdesign/charts` 整包移植。

#### 15. 语言包只有中英

- 优先级：P1
- 批次：B10
- 原版位置：`packages/core/locales/` 下 30 个 JSON（`en`、`zh-CN`、`zh-TW`、`ja-JP`、`ar-SA` 等）。读取入口是 `packages/core/src/i18n/` 的 `useLocale`、`useTranslator`、`useCollator`、`InternationalizationProvider`。
- 我们现状：`packages/core/src/locale/messages.ts` 的 `astryxMessages` 只有 `en` 和 `zh-CN`。入口是 `provideAstryxLocale` / `useAstryxMessages`。
- 缺什么：其余 28 个目录，以及按 locale 比较字符串的 `useCollator`。
- 意见：不要手抄 30 份译文。写一个加载器，直接吃原版 JSON 的键，再映射到我们的 `AstryxMessages`。对不上的键单独列出来，不要静默丢掉。`InternationalizationProvider` 这个 React 组件不移植。

#### 16. 组件文档页缺三块

- 优先级：P1
- 批次：B11
- 原版位置：`apps/docsite/src/components/component-detail/ComponentDetailClient.tsx`。组件页有 Overview、Properties（可改 prop 的实时预览，`hasInteractivePlayground`）、Accessibility（`usage.accessibility` 里的对比度条款）。解剖在 `Anatomy.tsx`。示例主要来自 `packages/cli/assets/templates/blocks/components/`（164 个组件目录）和 `*.doc.mjs` 的 `examples`。
- 我们现状：`apps/docs/docs/zh/components/<name>/` 有 `index.md` 和 `props.md`。按钮页有用法、最佳实践和示例，没有解剖，也没有对比度表。`apps/docs/components/demos` 有 106 个示例目录。属性表是静态的。
- 缺什么：每个组件的可交互属性页、无障碍条款、解剖。块模板没有独立发布，示例挂在文档页里，这个形态可以保留。
- 意见：Properties 页做成文档站功能，不要做成组件库 API。无障碍条款翻译原版 `usage.accessibility`，不要凭印象重写对比度数字。

### 1.2 已有组件上的较小缺口

这些不阻止基本用法。

#### 17. 分页的首尾页和省略算法

- 优先级：P2
- 批次：B12
- 原版位置：`packages/core/src/Pagination/Pagination.doc.mjs` 的 `hasFirstLast`、`siblingCount`、`step`、`hasMore`、`pageLabel`、`changeAction`。
- 我们现状：`Pagination/types.ts` 有 `variant`（pages、count、compact、dots、none）、`total`、`pageSize`、`showSizeChanger`。
- 缺什么：直接跳到第一页/最后一页、当前页两侧保留几个页码、未知总数时的「还有更多」、换页时的异步动作。
- 意见：`totalItems` 已经是 `total`，不要再加同名 prop。

#### 18. 进度条上的刻度

- 优先级：P2
- 批次：B12
- 原版位置：`packages/core/src/ProgressBar/ProgressBar.doc.mjs` 的 `marks`。刻度有自己的无障碍名，悬停出 tooltip；落在填充色内和轨道上的颜色不同。
- 我们现状：`ProgressBar/types.ts` 有数值、不确定状态、`hasValueLabel`。`Slider` 已经有 `marks`，进度条没有。
- 缺什么：进度条轨道上的目标刻度。

#### 19. 列表行的滑动操作

- 优先级：P2
- 批次：B12
- 原版位置：`packages/core/src/List/ListItem.doc.mjs` 和 `Item/Item.doc.mjs` 的 `swipeActions`、`swipeBehavior`。
- 我们现状：`List` 和 `Item` 的类型里没有滑动字段。
- 缺什么：触摸滑动露出行内操作。
- 意见：`Item` 作为公开组件我们已经有。原版 `Item` 不是缺整个组件，缺的是滑动。

#### 20. 复选列表的只读和行内加载

- 优先级：P2
- 批次：B6
- 原版位置：`packages/core/src/CheckboxList/CheckboxList.doc.mjs` 的 `isReadOnly`、`disabledMessage`，以及 `CheckboxListItem` 的 `isLoading`。
- 我们现状：`CheckboxList/types.ts` 有标签、状态、必填/可选。行上没有加载态。
- 缺什么：整组只读、禁用原因、单项加载。

#### 21. 菜单的页眉、页脚和子菜单形态

- 优先级：P2
- 批次：B3
- 原版位置：`DropdownMenu.doc.mjs` 的 `header`、`footer`；`DropdownMenuSubMenu.doc.mjs` 的 `hasSpinner`、`menuWidth`、`presentation`；`ContextMenu.doc.mjs` 的 `menuContent`。
- 我们现状：`DropdownMenuSlots` 只有 `default` 和 `trigger`。子菜单组件在，类型里没有这三项。`ContextMenu` 用 `items` 或默认插槽，没有整块自定义面板。
- 缺什么：菜单顶部/底部区域、子菜单宽度和 bottom-sheet 形态、右键菜单换成自定义内容。

#### 22. 标题的语义级别和截断提示

- 优先级：P2
- 批次：B12
- 原版位置：`packages/core/src/Text/Heading.doc.mjs` 的 `accessibilityLevel`、`wordBreak`、`textWrap`、`hasStrikethrough`。`Text.doc.mjs` 的 `hasTruncateTooltip`、`justify`。两者都有 `hasCapsize`。
- 我们现状：`Heading/types.ts` 的 `level` 同时决定标签和字号。`Text/types.ts` 已有 `textWrap`、`wordBreak`、`hasStrikethrough`、`maxLines`，标题组件没有这些。截断后不会自动把全文放进 tooltip。
- 缺什么：看起来像 h1、读起来是 h2 的 `accessibilityLevel`；标题上的换行和删除线；截断 tooltip。
- 意见：`hasCapsize` 不移植。那是字体度量裁切，我们用现有的行高 token。强行引入 capsize 会改掉已经对齐的排版。

#### 23. 主题换图标

- 优先级：P2
- 批次：B4
- 原版位置：`packages/themes/neutral/src/neutralTheme.ts` 的 `icons: neutralIconRegistry`，`Icon.doc.mjs` 的 `icon` 是语义名（`search`、`close` 等）或 SVG 组件。
- 我们现状：`Icon` 用 Iconify 名字（`name="carbon:settings"`）和 `glyphs.ts` 里的少量内置图形。`DefineThemeInput` 没有图标表。
- 缺什么：换主题时整套语义图标跟着换。
- 意见：保留 Iconify。若要对齐原版语义名，加一张「语义名到 Iconify」的表，由主题覆盖。不要退回到只有文档里那三十个名字，也不要把 React 节点注册表搬过来。

#### 24. 几个公开钩子没导出

- 优先级：P2
- 批次：B12
- 原版位置：`packages/core/src/hooks/` 下的 `useKeyboardHint.doc.mjs`（方向键提示）、`useImageMode.doc.mjs`（按图片亮度选深浅色）、`useContainerReveal.doc.mjs`（悬停才露出行内操作）、`useEntryAnimation.doc.mjs`、`usePressFeedback.doc.mjs`。`useMenuPress` 的实现在我们这边的 `ContextMenu/useMenuPress.ts`，但 `composables/index.ts` 没有导出它。
- 我们现状：浮层进入动画已经写在各组件 CSS 里，例如 `styles/popover.css`、`styles/tooltip.css`、`styles/dropdown-menu.css` 的 Vue Transition。按下反馈也在组件里。
- 缺什么：键盘提示、按图片选色、容器悬停显隐，以及把 `useMenuPress` 放到公开入口。
- 意见：`useEntryAnimation` 和 `usePressFeedback` 不单独移植，组件已经有对应动画。`useDevWarning`、`useMergedRefs` 是内部工具，不公开。

#### 25. 多层底栏

- 优先级：P2
- 批次：B12
- 原版位置：`packages/core/src/BottomSheet/BottomSheetSwitcher.doc.mjs`。一个对话框里切换多张底栏，焦点和关闭由外层统一管。
- 我们现状：`BottomSheet` 是单张底栏。
- 缺什么：多步流程共用一个模态底栏。
- 意见：等真有多步底栏需求再做。不要为了目录对齐先造一个空壳。

#### 26. 无样式的 typeahead 输入

- 优先级：P2
- 批次：B12
- 原版位置：`packages/core/src/Typeahead/BaseTypeahead.doc.mjs`、`TypeaheadItem.doc.mjs`。`BaseTypeahead` 不带字段壳，调用方自己画标签。
- 我们现状：`Typeahead/types.ts` 的 `TypeaheadProps` 自带 `label` 和字段状态。选项用插槽画。
- 缺什么：不带标签的裸输入，以及默认的选项行组件。
- 意见：默认选项行可以补。裸输入只有在命令面板或自定义字段需要时再拆，不必先拆。

### 1.3 我们有、原版核心没有的

这些不是缺漏，避免以后被当成「多出来的错误」：

- `ChatReasoning`、`ChatTypingIndicator`、`ChatUnreadDivider` 在原版实验包 `packages/lab/src/`，不在核心。我们放在核心的 `Chat` 里。`ChatToolCalls` 原版核心就有。
- `Radio`、`RadioGroup` 是从 `RadioList` 拆出的单控件。原版公开入口是 `RadioList`。
- `NavItem` 在原版 `packages/core/src/index.ts` 的注释里写明不公开，只给导航组件共用样式。我们公开了。

## 2. 设计体系

七套主题的目录和 Neutral 的时长刻度已经对齐，见 `neutral/base.css` 文件头：fast 125、medium 300、slow 700，比例 0.75。缓动是 `cubic-bezier(0.24, 1, 0.4, 1)`，和 `tokens.stylex.ts` 的 `--ease-standard` 一致。

下面两处是写明的有意差异，不要改回去：

- `neutral/base.css`：`--astryx-radius-none` 保持 0。原版 Neutral 的 `--radius-none` 是 `0.25rem`，会把当成直角的头像和骨架屏改圆。
- 同文件：浅色 `--astryx-color-text-secondary` 保持 `#525252`。原版 Neutral 是 `#737373`。
- 等宽字体我们用 JetBrains Mono（`README.zh-CN.md`）。原版 Neutral 的 code 角色是 `ui-monospace`（`neutralTheme.ts`）。
- 变量名多了 `--astryx-` 前缀，避免和页面上的其它 `--color-*` 撞车。

动画：`packages/core/styles/motion.css` 有一套共享关键帧，文件头写明现有组件仍用自己的动画名。原版浮层共用 `packages/core/src/Layer/layerAnimations.stylex.ts`。我们的 Popover、Tooltip、DropdownMenu、ContextMenu、Dialog 各自有进入动画，并处理了 `prefers-reduced-motion`。这是实现分叉，不是缺动画。缺的是条目 13 里「用三个数字生成整组时长」的创作 API。

`useLayer`、`usePopover`、`useTooltip`、`useHoverCard` 在原版是公开钩子（`Layer/useLayer.doc.mjs` 等）。我们的定位在 `packages/core/src/layer/usePositionedLayer.ts`，不对外导出。组件已经把浮层包起来了。见「明确不移植」。

条目 13、14、15、23 是设计体系要补的功能，不再重复。

## 3. 应用模式和成套模板

原版页面模板在 `packages/cli/assets/templates/pages/`，共 57 个目录。文档演练场用生成出的 `templateRegistry` 列出它们（`apps/docsite/src/app/playground/PlaygroundClient.tsx`）。我们的清单在 `apps/docs/components/playground/templateManifest.ts`，52 个，和原版页面目录比，少这 5 个：

| 目录 | 原版说明文件 | 状态 | 建议 |
| --- | --- | --- | --- |
| `blank` | `pages/blank/template.doc.mjs` | `isReady: true`，空脚手架 | 要补，P2，批次 B11 |
| `login` | `pages/login/template.doc.mjs` | `isHiddenFromOverview: true` | 不补。我们已经有 `login-card`、`login-split`、`login-sso` |
| `table` | `pages/table/template.doc.mjs` | `isReady: false` | 不补。`table-page` 已是可用的表格页 |
| `incident-console` | `pages/incident-console/template.doc.mjs` | `isReady: false` | 等原版标成可用再移植，P2，批次 B11 |
| `messaging-shell` | `pages/messaging-shell/template.doc.mjs` | `isReady: false` | 同上。四栏消息壳依赖条目 1 的输入套件，不要先搬一份不能输入的壳 |

### 27. 演练场还缺空白模板

- 优先级：P2
- 批次：B11
- 原版位置：`packages/cli/assets/templates/pages/blank/`
- 我们现状：演练场从主题展示、AI 对话到各种表格页都有，没有一个只有标题和空白内容区的模板。
- 缺什么：`blank`。
- 意见：`incident-console` 和 `messaging-shell` 先别搬。原版自己标了未完成。

应用模式页 `apps/docs/docs/zh/guide/patterns.md` 目前只有对话。对话消息区是齐的，输入区就是条目 1。没有第二套「模式」需要单独立项。原版 README 里的 table page、detail、form wizard 已经作为演练场模板存在，不是缺组件。

块模板（`packages/cli/assets/templates/blocks/`）是文档示例和 CLI `astryx template` 的素材，不是运行时组件。我们用 `apps/docs/components/demos`。不单独做块包，见条目 16。

## 4. 文档站

原版站点路由在 `apps/docsite/src/app/`：首页、`/components`、`/docs/[topic]`、`/themes`、`/templates`、`/playground`、`/blog`、`/changelog`、`/community`。长文来自 `packages/cli/assets/docs/tree/` 里大约 120 个 `*.doc.mjs`，其中大量是「怎么给 CLI 写一个集成包」。

我们的导航在 `apps/docs/.vitepress/config.ts` 和 `sidebar.ts`：指南、组件、演练场、主题。指南有介绍、快速开始、安装、样式、图标、组合式函数、应用模式、无障碍、深色模式、国际化、更新日志、贡献。主题有七套皮肤和 token、颜色、排版、动画、间距圆角阴影。

### 28. 指南还缺三篇消费者文档

- 优先级：P2
- 批次：B11
- 原版位置：`packages/cli/assets/docs/tree/` 里和模板、链接、响应式相关的篇目（`templates.doc.mjs`、`links.doc.mjs`、`responsive.doc.mjs`、`layout.doc.mjs`）。组件页缺口见条目 16。
- 我们现状：没有模板索引页，没有「链接怎么接路由」的说明，没有响应式布局约定。token 已有较短的主题页，不必按原版 15 类 token 长文重写一遍。
- 缺什么：这三篇的内容，用我们的 API 写。
- 意见：下面这些不写进文档站：
  - CLI 命令、`astryx init`、swizzle、codemod（`packages/cli`）
  - StyleX、Tailwind 适配（`css-and-stylex.doc.mjs`、`tailwind.doc.mjs`）
  - 如何向上游贡献组件的那套 tree
  - 博客（`apps/docsite/src/content/blog/posts/`）
  - Storybook（`apps/storybook`）和独立 Sandbox（`apps/sandbox`）。演练场已经覆盖试用
  - 组件页的 shadcn 安装按钮（`ComponentDetailClient.tsx` 里的 `shadcnRegistry`）
  - Theming 标签只在原版 canary 文档打开（`CURRENT_TARGET === 'canary'`），稳定文档没有，我们也不单做这个标签

演练场差异只剩条目 27。两边都有主题编辑。原版组件页上的属性旋钮是条目 16，不是演练场模板。

## 5. 明确不移植

这些在原版里是真的，但不做。不计入上面的条数。

| 原版位置 | 原因 |
| --- | --- |
| `packages/cli`、`packages/build` | CLI、StyleX 构建、swizzle、codemod 都假设 React 和 StyleX。我们的消费者不装这两样。 |
| `packages/lab` | 包说明写明不发布到 npm，只给 Storybook 和 sandbox。里面的 Chart、Drawer、Tour、TransferList、Sankey 等没有稳定契约。`ChatReasoning` 和 `ChatTypingIndicator` 我们已经做了。 |
| `packages/charts`、`packages/vega` | 原版 README 写明只以 npm `@canary` 发布，没有稳定版。数据色先按条目 14 补上，组件等稳定版。 |
| `packages/richtext` 的 `RichTextEditor` | React 编辑器。我们已有 Markdown 渲染。真要编辑器，用 Vue 的编辑器接我们的主题，不移植这套插件。 |
| `LinkProvider`、`LayerProvider`、`useLayer` 公开 API | React 上下文和命令式浮层。链接用条目 12 的 `as`。浮层留在组件内部。 |
| `xstyle`、StyleX token 文件 | 样式入口是 CSS 变量。 |
| `hasCapsize` | 见条目 22。 |
| 页面模板 `login`、`table` | 见第 3 节，已有替代模板。 |
| 原版 `apps/storybook`、`apps/sandbox`、博客 | 见条目 28。 |

## 6. 批次

每批可以单独开一个 PR，互相不依赖。条目 8 的表格进阶和条目 2 的 PowerSearch 放在同一批只是因为都在数据查询这条线上；若要并行，把条目 8 单独拉出去即可，过滤实现不要等 PowerSearch。

| 批次 | 条目 | 做什么 |
| --- | --- | --- |
| B1 | 1 | 对话输入套件 |
| B2 | 2、8 | PowerSearch，以及表格的分组、树、展开、固定列、行状态 |
| B3 | 3、21 | 菜单勾选/单选，以及页眉页脚、子菜单形态、自定义右键面板 |
| B4 | 4、23 | 指示器注册表；语义图标到 Iconify 的主题映射 |
| B5 | 5 | 日历和日期输入 |
| B6 | 6、7、20 | 选择器、InputGroup、复选列表 |
| B7 | 11、12 | 顶栏/侧栏/标题菜单，链接和头像的 `as` |
| B8 | 9、10 | 代码 diff，Markdown 插件 |
| B9 | 13、14 | defineTheme 生成函数，数据色 |
| B10 | 15 | 语言目录加载器 |
| B11 | 16、27、28 | 文档站组件页、空白演练场模板、三篇指南 |
| B12 | 17、18、19、22、24、25、26 | 分页、进度刻度、滑动行、排版、公开钩子、多层底栏、裸 typeahead |

建议先做 B1 和 B2。对话输入和结构化搜索是原版核心里用户会直接碰到、而我们完全没有的两块。B3 到 B10 可以并行。B11、B12 不挡组件使用。

## 统计

- P0：2
- P1：14
- P2：12
- 合计：28

明确不移植的项不在这 28 条里。

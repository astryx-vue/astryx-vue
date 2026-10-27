# D10 core 遗留问题修复 · 实现回报（第 1 轮）

工作区 `/Users/shenqingchuan/workspace/astryx-vue-wt/D10`，分支 `sync/d10-core-fixes`，六条问题各一个提交，未推送。

```
35314b1 fix(core): Stack 没写的间距变量写 initial，嵌套 Stack 不再继承外层内边距和间距
c8faf1b fix(core): Table 列头筛选按钮回到标题同一行
66f8edb feat(core): Table 行级扩展点补 ref 与行事件，演练场补整行悬停详情卡
f9448a5 fix(core): Selector 选项 icon 支持语义图标名、组件和渲染函数
7f750f1 fix(core): 竖向 Step 的内容落在标签下面同一列
4c57d28 fix(core): useTableTreeState 和 useTableSortableState 的 config 字段支持 ref
dc843f3 chore(cli): 重新生成 catalog（form-wizard-inline 去掉 Step 兜底样式）
```

## 1. Stack 内边距 / 间距被嵌套继承

**改了什么**

- `packages/core/src/Stack/Stack.vue`：`rootStyle` 现在**永远**写满 7 个间距变量。没传 prop 的写 `initial`（CSS 里等价于「未设置」）。

  ```
  /Users/shenqingchuan/workspace/astryx-vue-wt/D10/packages/core/src/Stack/Stack.vue
  ```

  为什么不用 0 / normal：`padding-block-start` 的兜底链是 `var(--…-block-start, var(--…-block, 0))`，显式写 0 会掐断 `paddingBlock` 的继承链。`initial` 让 `var()` 落到下一个兜底，同时盖掉父级的值。
- 没有别的组件依赖「继承 Stack 变量」（`grep -rn "astryx-stack-" packages/core apps/docs` 只命中 Stack 自己和文档样式），所以不用连带改。

**测试**：`packages/core/src/Stack/Stack.test.ts` → `resets every spacing variable so a nested stack does not inherit the outer one`（先红：`--astryx-stack-gap` 为空）。

**浏览器实测**（`/en/components/stack`，preview 构建）：外层 `padding-top: 24px`、里层 `padding-top: 0px`、里层 `column-gap: normal`；页面上 15 个真实 Stack 的 7 个变量全都有值、缺失 0 个。截图 `/tmp/D10-shots/stack-page.png`。

**没做的一项**：计划里的 `pnpm visual Stack` 没法跑——`scripts/swarm/visual-compare` 起的是 `vitepress dev`，按计划说明这台机器上 dev 演练场会报 `__VP_HASH_MAP__ is not defined`。改用 `docs:build` + `preview` 在真浏览器里核对了上面的计算值。

## 2. Table 列头筛选按钮换行

**改了什么**

- `packages/core/src/Table/TableData.vue`：新增 `filterContributions` 与 `filterAt(column, place)`；`popover` 档的漏斗按钮挪进 `.astryx-table__header-line`，`inline` / `inline-compact` 的输入框仍排在标题下面（原版也是这样分流的）。
- `packages/core/styles/table.css`：`.astryx-table__filter[data-variant='popover']` 改为 `flex: none`（不挤压标题）；新增 `th[data-align='center'|'end'] .astryx-table__header-line { justify-content: center|flex-end }`，让没有排序按钮的列也能整行靠右。

**测试**：`packages/core/src/Table/Table.test.ts` → `keeps the popover filter button on the same line as the header label`（先红）。

**浏览器实测**（`/en/components/table`）：6 个筛选控件里 3 个 popover 的 `inLine: true` 且与标题同一行；3 个 inline 的按设计仍在下一行。5 个 `align="end"` 列的标题行末端离列右边距 0px。截图 `/tmp/D10-shots/table-filter-popover.png`、`table-filter-inline.png`。

**与上游的差异（残留）**：上游的 `headerLabelRow` 是 shrink-wrap，漏斗紧跟排序箭头；我们这一行仍是整列宽，漏斗落在列尾（右对齐列仍在右端）。计划只要求「同一行 + 右对齐不变」，这版满足；要让漏斗贴近标题得改 `.astryx-table__sort` 的 `flex: 1; width: 100%`，会顺带缩小排序列的点击热区，本轮没做。另：`table-page` 模板里 80px 宽的 `Qty` 列现在要与漏斗分空间，标题被截成 `ty`，上游同宽列也紧。

## 3. Table 缺行级扩展点

**改了什么**

- `packages/core/src/Table/types.ts`：`TableRowPatch` 新增 `ref?: (el: HTMLTableRowElement | null) => void` 与 `listeners?: TableRowListeners`（`onMouseenter` / `onMouseleave` / `onFocus` / `onBlur`），`TableRowListeners` 从 `Table/index.ts` 和 `src/index.ts` 导出。
- 新建 `packages/core/src/Table/rowPatch.ts`：`mergeRowPatches(plugins, row, index, columnCount)`。分组头、展开面板、是否参与选择这类二选一字段仍是第一个说了算；类名、属性、`onClick`、`ref`、同名事件、右键菜单全部叠加（每个 ref 回调都调，每个同名事件按插件顺序都调）。`TableData.vue` 里原来那段合并逻辑搬了过去。
- `TableData.vue`：`<tr>` 绑 `:ref="entry.ref"`（Vue 的 `VNodeRef` 收窄成 `HTMLTableRowElement` 的包装函数在 `entries` 里建一次，避免每次渲染换函数身份而反复解绑重绑）与四个 `@` 事件。
- 演练场 `apps/docs/components/playground/pages/table-page.vue`：补上原版的整行悬停详情卡（类别 / 计费方式 / 占比 / Dispute 按钮），走 `rowPatch.ref` 把 `<tr>` 交给 `useHoverCard`，并给行加 `tabindex=0`，`focusTrigger: 'always'`。顺手删掉这个文件里表头折行与 Stack 留白两处临时兜底，改用 `:padding` / `:padding-block-end`。

**测试**：`packages/core/src/Table/Table.test.ts` → `hands the row element and row events to plugins, merging every plugin`（先红：事件没触发，因为 `v-on="{onMouseenter}"` 会被 Vue 拼成 `onOnMouseenter`，改成显式 `@mouseenter`）。

**浏览器实测**（演练场 `table-page`）：悬停首行弹出卡片，文案 `Discovery workshop / Category Design / Billing Fixed fee / Share of invoice 2.4% / Dispute this line`；行 `tabindex="0"`；点 Dispute 成功。截图 `/tmp/D10-shots/playground-table-page-hover.png`。`table-filter` 模板为 62 行正常渲染，截图 `/tmp/D10-shots/playground-table-filter.png`。

## 4. Selector 选项 `icon` 只能写 CSS 类

**改了什么**

- `packages/core/src/Selector/types.ts`：新增 `SelectorOptionIcon = ExtendedIconName | Component | (() => VNodeChild)`，`SelectorOption.icon` 用它。
- 三处渲染统一交给 `<Icon :icon="…" size="sm">`：`Selector.vue` 选中值图标、`SelectorPanel.vue` 列表与两列网格两处。字符串仍是 CSS 类（`i-` 前缀或任意类，落到 `.astryx-icon__external` 内层，尺寸不变），语义图标名走主题映射，组件 / 渲染函数直接渲染。
- `MultiSelector` 的选项没有 `icon` 字段、`ComplexSelector` 的 `startIcon` 早已是 `ExtendedIconName | Component` 并走 Icon，所以没有连带改动。

**测试**：`packages/core/src/Selector/Selector.test.ts` → `draws a CSS class, a semantic name, or a component as the selected option icon`（先红）与 `renders a component option icon in the open panel`（先红）；原有两条断言旧标记的用例改成断言 Icon 结构。

**浏览器实测**（`/en/components/selector`）：CSS 类图标渲染为 `.astryx-selector-value-icon.astryx-icon > .astryx-icon__external.css-icon.css-icon--sm.i-carbon-locked`，盒子 16×16（没被外层放大）。截图 `/tmp/D10-shots/selector-icon-demo.png`、`selector-page.png`。

## 5. 竖向 Step 的内容排在标签右边

**改了什么**

- `packages/core/src/Stepper/Step.vue`：控件和内容套进新的 `.astryx-step-body`（对应上游 `verticalBody`），内容不再是 `<li>` 的第三个直系子元素。
- `packages/core/styles/stepper.css`：`.astryx-step-body` 是 `flex` 列、`flex: 1 1 auto`；竖向时 `.astryx-step-content` 的 `padding-inline` 设成 `控件内边距 + 指示点 16px + 间距 8px`，让内容内文与标签左对齐（上游 `contentIndent` 的算法）。
- 删掉 `apps/docs/components/playground/pages/form-wizard-inline.vue` 末尾那段非 scoped 的 grid 兜底。

**测试**：`packages/core/src/Stepper/Stepper.test.ts` → `stacks the content slot under the label, in the same column`（先红：`astryx-step-body` 不存在）。

**浏览器实测**：文档站竖向 Demo 内容（Project name / Repository URL / Continue）在标签下方并与标签左对齐，截图 `/tmp/D10-shots/stepper-vertical.png`；演练场 `form-wizard-inline` 去掉兜底后表单仍在标签下方、内文与标签左对齐（实测左偏移 0px），截图 `/tmp/D10-shots/playground-form-wizard-inline.png`。

## 6. `useTableTreeState` / `useTableSortableState` 的 config 只解开一层

**改了什么**

- `packages/core/src/Table/plugins/tree.ts`：`data`、`expandedIds`、`defaultExpandedIds` 允许 `MaybeRefOrGetter`；新增 `fieldValue()` 做「解开 config → 再解开字段」的第二层。`flattenTree`、`expandedIds`、初值都走它。
  **注意**：不能对 config 的全部字段统一 `toValue`——`idKey`、`getRowMeta` 这类回调是函数，`toValue` 会把它们当 getter 调掉，所以只解数据类字段。
- `packages/core/src/Table/plugins/sortable.ts`：`defaultSort` 改为 `MaybeRefOrGetter<TableSortState>`（`data` / `columns` 本来就支持）。
- 顺手看过的其它钩子：`useTableSelectionState`、`useTableColumnSettingsState` 已经是逐字段 `toValue`，`useTableFilterState` 只收普通对象，均无需改。

**测试**：

- `packages/core/src/Table/plugins/advanced.test.ts` → `reads data and expandedIds even when they arrive as refs inside the config`（先红：`items is not iterable`）。
- `packages/core/src/Table/Table.test.ts` → `sorts data and defaultSort that arrive as refs inside the config`。

## 自测

- 全量 vitest：`env -u NODE_ENV` 下 328 文件 / 4517 用例全过；`NODE_ENV=production` 下同样 328 / 4517 全过。
- `env -u NODE_ENV pnpm check:packages`（含 package boundaries、path case、exports sync、catalog `generate:check`、500 行、无 `!important`、模板 token、i18n catalog）通过。
- `env -u NODE_ENV pnpm typecheck`（根 + 全部 packages + apps/docs）通过；`pnpm exec eslint . --max-warnings 0` 通过。
- `env -u NODE_ENV pnpm check:templates` 通过（49 个 isReady 模板落地后 `vue-tsc` 干净）。
- `env -u NODE_ENV pnpm --filter @astryx-vue/cli generate` 已跑并提交 `packages/cli/src/generated/catalog.json`（只变了 `form-wizard-inline` 的源码字段：那段兜底样式被删掉）。
- `env -u NODE_ENV pnpm build:packages && pnpm docs:build` 通过，`vitepress preview --port 5171 --host 127.0.0.1` 里做了上面各条浏览器核对，用完已关（预览进程 10746 已 kill，5171 无监听）。Playwright 脚本曾放在 `.tmp-d10/`，已删除。

## 截图清单（`/tmp/D10-shots/`）

| 文件 | 内容 |
| --- | --- |
| `stack-page.png` | Stack 文档页 |
| `table-filter-popover.png` / `table-filter-inline.png` | Table 两种筛选档的列表头 |
| `table-filter.png` | Table 第一条 demo |
| `upstream-tablefiltering.png` | 上游 v0.7.1 的筛选基线，作对照 |
| `selector-icon-demo.png` / `selector-page.png` | Selector CSS 类图标 |
| `stepper-vertical.png` | 文档站竖向 Stepper |
| `playground-table-page-hover.png` | 演练场整行悬停卡片 + Dispute |
| `playground-form-wizard-inline.png` | 演练场竖向向导（无兜底样式） |
| `playground-table-filter.png` | 演练场 table-filter 模板 |

## 残留风险

1. 第 2 条的漏斗落在列尾而非紧跟标题（见上）；要让位置和上游完全一致需动排序列的 `flex`，会缩小排序热区，留待用户决定。
2. `table-page` 的 `Qty` 列（80px）标题被截成 `ty`，原因是漏斗与标题同行分空间；上游同宽列也紧，但没截图基线可比。
3. 悬停卡片的行元素回调每次 `entries` 重算会换身份，Vue 会解绑再绑定一次；`rows`/`plugins` 变化时会重绑，实测悬停正常，但高频换数据时卡片的 hover 状态会重来。
4. `pnpm visual` 工具链依赖 `vitepress dev`，本轮无法用它做像素对照。

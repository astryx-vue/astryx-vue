# D10 core 遗留问题修复 · 执行计划

## 背景

D5c 照原版追平 57 个页面模板时，worker 发现了几处 core 本身的问题。模板里都临时绕过去了，但用户自己写页面也会踩到。用户要求全部修完再发版（G1 依赖 D10）。

总控已经确认过这些问题，每条都附了现状、原版做法和修法。

## 工作环境

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/D10`，分支 `sync/d10-core-fixes`，端口 5171。
- 原版：`git -C /Users/shenqingchuan/workspace/astryx-upstream show v0.7.1:<路径>`。
- 命令前加 `env -u NODE_ENV`；vitest 加 `--maxWorkers=2`；测试要在 NODE_ENV 未设置和 `NODE_ENV=production` 两种模式下都跑。
- 浏览器只能用 `node scripts/swarm/browser-lock.mjs run --purpose D10 --max-run 150 -- <命令>`。Playwright 脚本放工作区内的 `.tmp-d10/`。
- 文档站验证一律 `docs:build` + `vitepress preview --port 5171`，**不要用 `vitepress dev`**（这台机器上演练场会报 `__VP_HASH_MAP__ is not defined`）。

## 要修的问题（按顺序，一条一个提交）

### 1. Stack 的内边距和间距被嵌套 Stack 继承（最重要）

**现状：** `packages/core/styles/stack.css` 用 `var(--astryx-stack-padding-block, 0)` 这类普通 CSS 变量；`Stack.vue` 只给用户写了的 prop 设变量，没写的就不设。CSS 变量默认会继承，所以外层 Stack 写了 `padding`，里面没写 padding 的 Stack 也会拿到同样的值。`gap` 也一样。总控用最小页面复现过：外层 `--astryx-stack-padding-block: 24px`，里层算出来 `padding-top: 24px`、`gap` 也继承了。

**原版：** 用 StyleX 的原子类，每个 Stack 只拿自己的值，不存在继承。

**修法（二选一，选更简单可靠的）：**
- A. `Stack.vue` 永远把 7 个变量都写上：没传 prop 的写成 `initial`（或者对应的 0 / `normal`），这样每个 Stack 都盖掉父级。
- B. 在 `stack.css` 里用 `@property` 注册这 7 个变量，`inherits: false`。

注意：别的组件里有没有靠「继承 Stack 变量」才对的地方（`grep -rn "astryx-stack-" packages/core apps/docs`），有的话一起改。

**测试：** 嵌套两层 Stack，外层设 padding 和 gap，断言里层的 inline style 里这 7 个变量都有值（方案 A），或者在浏览器里读里层的 computed `padding-top` 是 0、`column-gap` 是 `normal`。另外跑一遍全量 core 测试和 `pnpm visual Stack`，确认没有别的东西变了。

### 2. Table 列头的筛选按钮掉到下一行

**现状：** `packages/core/src/Table/TableData.vue` 把 `<TableFilterControl>` 放在 `.astryx-table__header-line` 外面，`.astryx-table__header` 是 `flex-direction: column`，所以筛选按钮排在标题和排序箭头下面一行。

**原版：** `BaseTable.tsx` 的 `headerLabelRow`：标题、排序图标、筛选按钮在同一行（`inline-flex`、`align-items: center`、`gap: spacing-1`）。

**修法：** 把筛选按钮挪进 `__header-line`，和标题、排序在同一行。右对齐的列（`data-align="end"`）要保持右对齐。打开文档站 Table 的筛选 Demo 和演练场 `table-page`、`table-filter` 看效果。

### 3. Table 缺行级扩展点（整行悬停卡片做不出来）

**现状：** 我们的插件接口（`packages/core/src/Table/types.ts` 的 `TablePlugin`）只有 `rowPatch`，能改 `<tr>` 的 attrs、class、onClick，拿不到 `<tr>` 元素本身，也不能在行后面插内容。

**原版：** `transformBodyRow(props, item, index)`，能拿到并改 `<tr>` 的 props 和 `ref`，还能用 `afterRow` 在这一行后面插一个 `<tr>`。原版演练场 `table-page` 用它把 `useHoverCard` 挂在整行上（悬停一行弹出详情卡片，里面有 Dispute 按钮）。

**修法：** 在 `TableRowPatch` 上加一个 `ref?: (el: HTMLTableRowElement | null) => void`（行挂载、卸载时回调），以及事件监听（至少 `onMouseenter`、`onMouseleave`、`onFocus`、`onBlur`，或者一个通用的 `listeners`）。多个插件的 `rowPatch` 要能合并（ref 回调都调用，监听器都挂上）。只做到「能把 `useHoverCard` 挂到整行」即可，不用照搬原版的整套 `transformBodyRow`。

**验证：** 写一个测试：插件通过 `rowPatch.ref` 拿到 `<tr>`。然后把演练场 `apps/docs/components/playground/pages/table-page.vue` 补上原版的整行悬停卡片（原版 `page.tsx` 的 `DescriptionCell`：类别、计费方式、占比、Dispute 按钮），在浏览器里悬停一行确认卡片弹出、能点到 Dispute。

### 4. Selector 选项的 `icon` 只能写 CSS 类名

**现状：** `packages/core/src/Selector/types.ts` 第 10 行注释写「CSS icon class or a component」，类型却是 `string`；`SelectorPanel.vue`、`Selector.vue` 都只把它当 class 用。

**原版：** `icon?: ReactNode | IconType`，可以是任意节点（状态点、头像、徽章）。

**修法：** 类型改成 `string | Component | (() => VNodeChild)`。字符串按现在的方式处理，并且也接受 core 的语义图标名（和 `<Icon icon>` 一样走 Icon 组件，`i-` 开头的仍当 CSS 类）；组件或函数直接渲染。选中值前面的图标（`Selector.vue` 第 379 行）、下拉里的两处（`SelectorPanel.vue` 154、191 行）都要改。`MultiSelector`、`ComplexSelector` 如果也有 `icon`，一起改。

**测试：** 三种写法各一个用例。

### 5. 竖向 Step 的内容排在标签右边

**现状：** `Step` 的默认插槽（`.astryx-step-content`）在竖向流程里排到了标签右侧一列。演练场 `form-wizard-inline.vue` 末尾有一段非 scoped 的 `<style>` 在兜底。

**原版：** `packages/core/src/Stepper/Step.tsx`：竖向时内容在标签下面，和标签左对齐（同一列），左侧是步骤圆点的竖线。

**修法：** 改 `packages/core/styles/stepper.css`（或对应样式），竖向时内容落在标签下面。修好后**删掉** `form-wizard-inline.vue` 末尾那段兜底样式，确认模板看起来不变。再看一眼文档站 Stepper 的竖向 Demo。

### 6. `useTableTreeState` / `useTableSortableState` 的 config 只解开一层 ref

**现状：** `useTableTreeState(config)` 里 `toValue(config)` 只解开最外层。`config` 是普通对象、里面的 `data` 是 ref 时，`flattenTree` 拿到的是 ref 本身，报 `t is not iterable`。所以只能写成 `() => ({ data: data.value, ... })`。

**修法：** 读字段时再 `toValue` 一次。`data`、`expandedIds` 这类字段的类型允许 `MaybeRefOrGetter`。`useTableSortableState` 的 `data`、`columns` 已经是 `MaybeRefOrGetter`，确认一下 `defaultSort` 等其它字段。顺手检查 `packages/core/src/Table/plugins/` 下其它 `use*State` 有没有同样的问题，一起改。

**测试：** 每个函数加一个「传入的 config 里 `data` 是 ref」的用例。

## 不碰

`packages/themes`、`packages/cli/src`（生成的 catalog 除外）、ROADMAP.md、SWARM.md。演练场模板只动第 3 条和第 5 条说到的两个文件。

## 自测

1. 每条都有测试，core 全量测试在两种 NODE_ENV 下都过。
2. `env -u NODE_ENV pnpm check:packages`、`pnpm --filter @astryx-vue/core typecheck`、`pnpm exec eslint --max-warnings 0 .`、`pnpm check:templates` 都过。
3. 改了 Props 或类型的组件，跑 `env -u NODE_ENV pnpm --filter @astryx-vue/cli generate` 并提交 catalog。
4. `docs:build` 通过；浏览器里看：Stack 文档页、Table 筛选 Demo、Selector Demo、Stepper 竖向 Demo、演练场 `table-page`（悬停卡片）、`form-wizard-inline`、`table-filter`。截图放 `/tmp/D10-shots/`。

## 回报

写到 `/Users/shenqingchuan/workspace/astryx-vue/.agents-work/upstream-sync-0.7.1/nodes/D10/impl-1.md`：每条问题一节，写改了什么、测试名、截图路径。

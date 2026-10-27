# C11 Table · 第 1 轮实现回报

- 工作区：`/workspace`，分支 `cursor/c11-table-c500`。云端没有本机 worktree。
- 提交（基于 swarm-tree `5691a8ca`）：
  - `e6c81d64` docs(C11): 写下表格的执行计划和验收清单
  - `6bbd68d1` feat(C11): 拆开表格数据层，滚动和最小宽度跟列宽对齐
  - `f364ebdf` docs(C11): 补上批量操作、行展开和最小宽度说明
  - `d288c742` docs(C11): 写完表格台账的 48 条结论
  - `2fe8c438` docs(C11): 把表格说明同步进 catalog
  - 本回报是随后那一次 docs 提交

## 1. 做了什么

按计划的开发步骤做完。

1. 已写 `plan.md` 和 `verify.md`。
2. 列宽拖动的指针和键盘会话抽到 `useTableColumnResizeSession.ts`。`TableData.vue` 423 行，已从 `line-limit-allowlist.json` 删除。改白名单前合并过 `origin/swarm-tree`，当时已经是最新。
3. 数据模式的滚动容器改成 `TableScroll`。它走已有的 `useScrollableArea({ axis: 'inline', overscroll: 'contain', keyboardAccess: { owner: 'content' } })`。表格放得下时 `overscroll-behavior-x` 是 `auto`，也没有 `tabindex`。横向溢出后才是 `contain`，并带 `tabindex="0"`。
4. 调用方的 `style.minWidth` 用 `resolveTableMinWidth` 和列宽下限合成，写在 `<table>` 上。滚动容器不再带着这份最小宽度。没写宽度的列下限仍是 60px。字符串样式拆不开，整段留在滚动容器上。插槽模式的 class 和 style 仍在 `<table>` 上，不抬下限。
5. 表头一行悬停时露出全部列宽指示线；指着某一条时这条用强调色，没有 `!important`。把手留在表头格子里。禁用的排序按钮、箭头和可点行是 `cursor: default`，悬停色排除 `:disabled` 和 `[aria-disabled='true']`。排序改用 `useCollator({ numeric: true })`，语言变了会重排。自动表头的首字母用 `firstCharacter`。测试补了最小宽度、滚动两遍测量、语言重排、emoji 表头，以及可编辑单元格不触发行展开。
6. 台账 48 条都写了结论。中英文说明补了批量操作条、点行展开的让路规则，以及最小宽度和回弹。`generate:check` 会把这段说明抄进 catalog 的 usage，所以 catalog 里对应的两段文字也更新了。没有新增公开导出。

| 文件 | 行数 | 职责 |
| --- | --- | --- |
| `packages/core/src/Table/TableData.vue` | 423 | 拼列、行和表体；最小宽度写在 table 上 |
| `packages/core/src/Table/Table.vue` | 73 | 数据模式把 class 和 style 交给 TableData；插槽模式自己包 TableScroll |
| `packages/core/src/Table/TableScroll.vue` | 50 | 横向滚动、溢出时才 contain 和 tabindex |
| `packages/core/src/Table/useTableColumnResizeSession.ts` | 207 | 拖动和方向键改列宽 |
| `packages/core/src/Table/columnUtils.ts` | 323 | 列宽下限、`resolveTableMinWidth`、语言排序、字素首字母 |
| `packages/core/src/Table/plugins/sortable.ts` | 100 | 排序状态把 collator 传进 `sortRows` |
| `packages/core/styles/table.css` | 644 | 表头悬停指示线、禁用指针。样式文件不计入 500 行源码上限 |
| `packages/core/src/Table/Table.test.ts` | 248 | 最小宽度、滚动、语言、首字母 |
| `packages/core/src/Table/plugins/advanced.test.ts` | 222 | 展开箭头只转图标，可编辑内容不切换 |

## 2. 和上游的对照

| 上游改动 | 上游怎么做 | 我们怎么做 | 为什么效果相同 |
| --- | --- | --- | --- |
| #5995 #7163 #5153 | `transformBodyRow` 加上展开箭头、面板和点行让路 | 已有 `rowPatch`。箭头的 `is-expanded` 在图标上。`contenteditable` 走 `isInteractiveRowClick` | 点按钮、链接、可编辑文字或已选文字不切换。面板缩进是 40px 加间距，斑马纹跳过面板。从右往左时箭头镜像 |
| #5486 #5310 | `TableSelectionToolbar` 读选中项，`hasRowHighlight: false` 去掉底色 | 组件和状态已经在。文档写明怎么接上 | 没选中时操作条不出现。关掉高亮后仍有 `aria-selected` |
| #6410 | `TableScrollWrapper` 在溢出时补 `role=group` 和 `tabIndex` | `TableScroll` 用 `useScrollableArea`。溢出时 `tabindex="0"`，`role="group"` 一直在 | 放得下时回弹是 auto，也不进 Tab 顺序 |
| #6807 | `resolveTableMinWidth` 得到 `max()` 或像素 | 同样的函数写到 `<table>` 的 `minWidth` | 10px 抬到两列下限 120px；900px 保留；`calc()` 交给浏览器取较大值 |
| #6194 #5335 | 把手在表头内，行悬停露出指示线，禁用指针是 default | CSS 变量 `--resize-hint` 和 `--indicator-color`。没有 `not-allowed` | 指着某一条时强调色盖过整行的淡线。#5323 的 not-allowed 已被 #5335 撤回，不采纳 |
| #5363 | `useCollator({ numeric: true })` | `useTableSortableState` 把 collator 传进 `sortRows` | 语言一变就重排。瑞典语 `z` 在 `ä` 前 |
| #6222 | `capitalize` 用字素 | `firstCharacter` 再切剩余部分 | `😀name` 不会切成半个 emoji |

## 3. 和计划不一样的地方

计划写了本节点不改 `catalog.json`。文档说明一改，`generate:check` 要求 catalog 里的 usage 跟着变。已经合并最新 `origin/swarm-tree`（仍是 `5691a8ca`），只更新了 Table 的中英文 usage，没有新导出。

列宽把手没有拉成整表那么高。拉高要改表头 `overflow`，会碰到省略号。把手仍在表头格子里，方向键和拖动的宽度结果不变。

## 4. 台账处理

一共 48 条。已采纳 25 条，不适用 23 条。

不适用：

- `a1a6a636f`：表格没有发布过上游 0.6 要删的主题兼容别名。主题面归 B1。
- `63c4c0920`：这是上游 StyleX 源码的 lint。组件 vue/ts 不写 light-dark()，颜色走 CSS 变量。
- `ea0483449`：外观嵌套令牌随后被 `6e6b9b476` 撤回，归 B1。
- `69e21dde8`：演练场模板归 D5。分组行本身已能折叠并保留表头。
- `32f160e8c`：只碰到上游表格测试里的选择器行挂点，交互归 C3。
- `e891c0dc8`：禁用指针一度改成 not-allowed，随后被 #5335 改回 default。
- `f747a49f2`：我们用类名和 data 属性，没有上游那套连写的 theme target。归 B1。
- `58f954213`：表格过滤不提交数字前缀。归 C1。
- `d55751f88`：列宽把手不经过共享 ResizeObserver。固定列在滚动容器上单独观察。
- `41ab6db2a`：没有上游那套 theme target 兼容别名。归 B1，随后 #7302 又删掉了兼容层。
- `4ec26d757`：表格不是浮层根。文字重置归 B4。
- `12a6e8a83`：样式是普通 CSS，边框已经写成 border-bottom 和 border-inline-end，没有 StyleX 丢掉简写的问题。
- `00f1ed9da`：只改了上游行状态文档里的图标写法。我们的状态标记已经用语义名。
- `1581b0900`：上游测试工程怎么划分。表格测试已经在 vitest 里。
- `74065ba97`：不搬性能计时预算。
- `c04ec04ae`：文档不跟上游逐句替换破折号。表头和表体的行为没有变。
- `5c396656f`：分页文档的措辞不跟上游逐句对齐。上下导航区名字已经分开。
- `ddb42c07e`：文档不跟上游逐句替换破折号。
- `bc39db431`：我们没有上游那份 spec。表头、表体和滚动容器已经在组件里。
- `fa93107ff`：页面壳归谁管，归 C14。表格 spec 不单维护一份。
- `a0852e706`：分组文档不跟上游逐句替换破折号。
- `8bf4b5136`：上游知识库模块合约。公开导出没有改。
- `6e6b9b476`：外观嵌套令牌的撤回，归 B1。

## 5. 自测结果

| # | 自测项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | `env -u NODE_ENV pnpm exec vitest run --maxWorkers=2 packages/core/src/Table packages/core/src/Scrollbars/integration.test.ts` | 过 | 5 个文件、70 条用例 |
| 2 | `NODE_ENV=production` 同一命令 | 过 | 5 个文件、70 条用例 |
| 3 | core typecheck、改过的 vue/ts eslint `--max-warnings 0`、行数、`!important`、导出、catalog | 过 | `vue-tsc` 退出码 0；eslint 退出码 0（`table.css` 不在 eslint 配置里，没有送进去）；行数检查通过；`check-no-important` 退出码 0；`sync-exports --check` 一致；合并最新 swarm-tree 后 `generate:check` 通过（245 components） |
| 4 | `env -u NODE_ENV pnpm build:packages` 然后 `env -u NODE_ENV pnpm docs:build` | 过 | 包构建完成后，vitepress 渲染完成，约 51 秒 |
| 5 | 文档站整页 | 过 | 无对位。预览 `http://127.0.0.1:4173/components/table`，滚到「Table — 展开行」。浅色桌面点了 Contoso 那一行，出现 “Gift wrap requested.”。行选择示例点了第一行复选框，出现 `aria-selected="true"`。这个示例没有放 `TableSelectionToolbar`。测完已关服务 |

没有跑整库 `pnpm check`。相关 vitest、core typecheck、改过文件的 eslint、行数、导出、catalog 和文档站构建都过了。

截图（不入库）：

| 图 | 看到的内容 |
| --- | --- |
| `/opt/cursor/artifacts/c11-table/desktop-light.png` | 1440×900，浅色。顶栏有文档、组件、演练场、主题，左侧是组件侧栏。展开行示例里 1042 和 1043 都打开了，能看见备注。 |
| `/opt/cursor/artifacts/c11-table/desktop-dark.png` | 同一处，深色。侧栏和顶栏仍在。1042 的备注面板是深色。 |
| `/opt/cursor/artifacts/c11-table/mobile-light.png` | 390×844，浅色。顶栏有「菜单」和「返回顶部」。展开行示例在视口里，1042 已展开。 |
| `/opt/cursor/artifacts/c11-table/mobile-dark.png` | 390×844，深色。顶栏仍有「菜单」，同一处示例为深色。 |

## 6. 拿不准的地方

无。

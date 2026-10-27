# C11 Table · 执行计划

## 目标

表格行展开和选择、分组这些插件走同一套行补丁：箭头、右键、点行展开时不抢走按钮、链接和可编辑内容。选中行之后可以用 `TableSelectionToolbar` 对选中项做批量操作，并可以关掉选中行的底色。横向滚动只在表格真的溢出时才拦住回弹，并进入 Tab 顺序。调用方写的 `minWidth` 比列宽下限小时，表格至少保持各列能读。`TableData.vue` 把拖动改宽拆出去，降到 500 行以内，并从行数白名单里删掉。

## 工作环境

- 工作区：`/workspace`，分支 `cursor/c11-table-c500`，从最新 `swarm-tree`（`5691a8ca`，含 C8 看板同步）切出。云端没有本机 worktree，文档站用空闲端口，用完关掉。
- 动手前已读：`SWARM.md`、`ROADMAP.md` 里 C11 那一行和 C 阶段 6 条、`ledger/C11.md`、`nodes/C8/plan.md`。
- 环境纪律：测试和构建前加 `env -u NODE_ENV`；vitest 加 `--maxWorkers=2`；再以 `NODE_ENV=production` 跑一遍，用例数要相同。
- 浏览器纪律：同一时刻只开一个文档站。截图放 `/opt/cursor/artifacts`，不进 git。

## 上游这条改动让用户看到或感受到了什么

| 上游改动 | 用户看到或感受到的变化 |
| --- | --- |
| #5995 #7163 #5153 | 行展开和别的插件一样：行首箭头、右键也能展开。点整行展开是可选的，点到按钮、链接、可编辑文字或已经选中的文字时不切换。箭头只转图标，不转按钮。从右往左排时，收起的箭头转向展开的那一侧。详情面板和第一列对齐，分隔线画在面板下面，斑马纹不把面板算成一行。 |
| #5486 #5310 | 选中行之后出现批量操作条，上面是自己的按钮、选中数量和清空。一个都没选时这条不出现。`hasRowHighlight: false` 时选中行不再铺底色，读屏仍能读到已选中。 |
| #6410 | 表格放得下时，滚轮继续交给外面的页面，滚动容器也不进 Tab 顺序。横向溢出之后才拦住回弹，并成为 Tab 停靠点。 |
| #6807 | 没写宽度的列至少 60px。调用方写的最小宽度比各列下限的总和还小时，表格用下限；写得更大时保留调用方的值。百分比和 `calc()` 交给浏览器取较大的那个。 |
| #6194 #5335 #5247 | 列宽把手留在表头格子里面。鼠标放在表头一行上时，所有把手都露出一条边；指着某一条时用强调色。禁用的表格控件没有悬停色，指针是默认箭头。 |
| #5363 #6222 #4693 #5832 #5671 | 分组头不进单元格渲染。自定义分组头时箭头仍钉在左侧。行状态列有隐藏的列表头名字；语义状态用图标，自定义标记可以是色点。 |
| #4692 #5928 | 上下都有分页时，两个导航区的名字不一样。排序按钮跟着列的对齐方式走。 |

## 上游依据

- 台账条目：`ledger/C11.md` 全部 48 条。
- 上游源码：`packages/core/src/Table/plugins/rowExpansion/useTableRowExpansion.tsx`、`plugins/selection/`、`TableSelectionToolbar.tsx`、`Table.tsx` 的 `TableScrollWrapper`、`columnUtils.ts` 的 `resolveTableMinWidth`、`plugins/columnResize/useTableColumnResize.tsx` 的把手样式。
- 上游测试：行展开、选择高亮、批量操作条、滚动只在溢出时 `overscroll: contain`、`resolveTableMinWidth`。行为改写成 Vue 测试，不搬 Playwright 夹具。

查上游用 `git -C /tmp/astryx-upstream show v0.7.1:<路径>`。

## 有没有更适合 Vue 的做法

| 上游怎么做 | 我们怎么做 | 为什么效果一样 |
| --- | --- | --- |
| `transformBodyRow` / `transformBodyCell` 拼出行和菜单 | 插件返回 `rowPatch`，`TableData` 合并 | 展开、分组、树仍然叠在同一行上，菜单项合在一起 |
| `useScrollableArea({ axis: 'inline', overscroll: 'contain', keyboardAccess: { owner: 'content' } })`，溢出时自己补 `tabIndex` | 用已有的 `useScrollableArea`，包一层 `TableScroll`，溢出时同样补 `tabindex="0"` | 放得下时 `overscroll-behavior-x` 是 `auto` 且没有 tabindex；溢出后是 `contain` 且能被 Tab 到 |
| StyleX 把 `minWidth` 收成 `max()` | `resolveTableMinWidth` 写到 `<table>` 的内联样式，滚动容器不再带着这份最小宽度 | 窄的最小宽度抬到列宽下限，宽的保留；表格在容器里横向滚动，而不是把容器撑开 |
| 拖动改宽写在表格组件里 | 指针和键盘会话抽到 `useTableColumnResizeSession` | 松手、方向键、Home、End 的宽度结果不变 |

涉及图标的地方继续用语义名（`chevronRight`、`check`、`warning`、`error`）。不新增图标，不搬 React 图标组件。

## 任务范围

- 要改：
  - `packages/core/src/Table/TableData.vue`、`Table.vue`、`TableScroll.vue`、`useTableColumnResizeSession.ts`、`columnUtils.ts`
  - `packages/core/styles/table.css`（表头悬停露出列宽把手、禁用指针和悬停）
  - `packages/core/src/Table/Table.test.ts`、`plugins/advanced.test.ts`
  - `scripts/guardrails/line-limit-allowlist.json`（删掉 `TableData.vue`）
  - 中英文表格说明里补批量操作、行展开和最小宽度这几句
  - `ledger/C11.md`
  - 本目录的 `verify.md`、`impl-1.md`
- 不碰：
  - `ROADMAP.md`、`SWARM.md`、`HANDOFF.md`、`PR128-BODY.md`
  - 别的组件
  - `packages/cli/src/generated/catalog.json`（本节点不改公开导出）
  - 主题令牌本身（B1）、演练场模板（D5）

## 开发步骤

1. 写本计划和 `verify.md`。
2. 抽出列宽拖动会话，让 `TableData.vue` 降到 500 行以内。改白名单之前先合并最新的 `origin/swarm-tree`，再删掉 `TableData.vue` 那一条。
3. 滚动容器改走 `useScrollableArea`：只在横向溢出时 `overscroll-behavior-x: contain`，并补上 `tabindex="0"`。
4. `style.minWidth` 和列宽下限用 `resolveTableMinWidth` 合成，写在 `<table>` 上。
5. 表头悬停露出全部列宽把手；禁用控件不显示悬停色，指针用 `default`。补行展开（可编辑内容不切换、箭头只转图标）和最小宽度、滚动的测试。
6. 台账 48 条写结论。中英文说明补上批量操作条、点行展开的让路规则，以及最小宽度不会把列压到读不清。跑相关 vitest 两种 `NODE_ENV`、typecheck、eslint、行数、`!important`、导出检查。渲染路径变了，再跑 `pnpm docs:build`。截文档站整页。

## 自测要求

1. `env -u NODE_ENV pnpm exec vitest run --maxWorkers=2 packages/core/src/Table packages/core/src/Scrollbars/integration.test.ts`，全部通过。
2. `NODE_ENV=production` 同一路径，用例数相同。
3. `env -u NODE_ENV pnpm --filter @astryx-vue/core typecheck`、改过文件的 eslint `--max-warnings 0`、`node scripts/check-line-limit.mjs`、`node scripts/check-no-important.mjs`、`node scripts/sync-exports.mjs --check`。再跑 `env -u NODE_ENV pnpm docs:build`。
4. 文档站中文 `/components/table`：桌面与 390px、浅色与深色，滚到「展开行」或「行选择」。图放 `/opt/cursor/artifacts`，能看见侧栏或顶栏上的「菜单」。上游文档站若没有同一处 Demo，写「无对位」，不拼图。
5. 新写和改到的源码不超过 500 行。`TableData.vue` 不在白名单里。样式里没有 `!important`，也没有 `cursor: not-allowed`。

## 提交与回报

- 提交信息用中文。分几次提交。完成后推送 `cursor/c11-table-c500`，开 draft PR，base 为 `swarm-tree`，标题 `C11 Table`。
- 不改 `ROADMAP.md`、`SWARM.md`、`HANDOFF.md`，不合并。
- 回报写 `nodes/C11/impl-1.md`。
- 最终回复用中文：摘要、PR 链接、`TableData.vue` 行数、白名单和 catalog 有没有改。

## 验证操作要短小

每次只测一件事，命令加 `timeout`。浏览器命令套 `browser-lock.mjs run --max-run`。脚本和结果放 `/tmp/c11-*`。

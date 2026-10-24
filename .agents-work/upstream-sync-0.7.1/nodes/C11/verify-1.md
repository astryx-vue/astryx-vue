# C11 验收报告 · 第 1 轮

结论：通过（21/21）

- 工作区：`/workspace`，分支 `cursor/c11-table-c500`，提交 `e033d9ac`（报告提交在此之后）。
- 比较基点：`BASE = 5691a8caf71ead19c6e142be702e78fec278caba`（`origin/swarm-tree`）。
- 临时文件和截图：`/tmp/verify-C11/`，另有一份截图在 `/opt/cursor/artifacts/c11-verify/`。全部自己重新生成，没有用实现者留下的产物。
- 只读检查：开始时 `git status` 是 `nothing to commit, working tree clean`（`## cursor/c11-table-c500`）。结束时同样干净。两次相同。本报告是唯一新增提交。
- 临时改动：无。没有改业务源码，也没有反向改文件。
- 浏览器：`browser-lock.mjs` 的 `browser-1`，用途 `C11-verify`、`C11-verify-expand`、`C11-verify-keys`。文档站 `http://127.0.0.1:5191/components/table`，用完已关。结束时 5191 没有监听，没有残留 Chrome，两把浏览器锁都空闲。

## 逐条结果

| # | 检查项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | 文档站四种组合整页，滚到展开行；无对位不拼图 | 过 | 四张图都是文档站整页。桌面看见侧栏和顶栏「文档 / 组件 / 演练场 / 主题」。390 宽看见顶栏「菜单」和「返回顶部」。内容停在「Table — 展开行」，1042 已展开，备注是 “Two seats, ships Friday.”。无对位。 |
| 2 | 行展开的箭头、面板、点行让路、旋转类 | 过 | 文档站探测 `/tmp/verify-C11/item2.json`。箭头 `aria-expanded` 从 `true` 到 `false`，名字从「折叠行」到「展开行」，面板消失，没有立刻又展开。点 Contoso 那一行后出现 “Gift wrap requested.”，面板 `colspan="4"`，表头也是 4 列。`is-expanded` 在 `.astryx-table__chevron-icon` 上，按钮类名里没有。可编辑内容不切换见 `advanced.test.ts` 的对应用例，两种 `NODE_ENV` 都过。 |
| 3 | 批量操作条和关掉选中底色 | 过 | `TableSelectionToolbar.vue` 在传入 `selection` 且 `hasSelection` 为假时不渲染。`clearSelection` 调用 `write(new Set())`。测试 `TableSelectionToolbar.test.ts` 断言清空后 `Set` 大小为 0，条也消失。`TableData.vue` 在 `hasRowHighlight === false` 时写 `data-row-highlight="off"`，选中行仍写 `aria-selected="true"`。`table.css` 在这个属性下把选中底色改成透明。文档站「行选择」点第一行复选框后 `aria-selected="true"`（`/tmp/verify-C11/item7.json`）。该示例没有放操作条。 |
| 4 | 滚动只在溢出时 contain | 过 | `TableScroll.vue` 使用 `useScrollableArea({ axis: 'inline', overscroll: 'contain', keyboardAccess: { owner: 'content' } })`，里面有 `data-scroll-content`。`tabindex` 只在 `inline.isScrollable` 时为 0。`Table.test.ts` 的 `contains overscroll only while the table scrolls` 断言放得下时 `overscroll-behavior-x` 为 `auto` 且没有 `tabindex`，加宽后为 `contain`、`tabindex="0"`、`data-scrollable-inline="true"`。文档站展开行示例放得下：`overscrollX` 为 `auto`，没有 `tabindex`，滚动容器是 `role="group"`。 |
| 5 | 最小宽度写在表格上 | 过 | `resolveTableMinWidth('50%', 240)` 为 `max(50%, 240px)`，`auto` 为 `240px`，见 `Table.test.ts`。两列都不写宽度时，`minWidth: '10px'` 在 `<table>` 上变成 `120px`，滚动容器样式不含 `min-width`，`900px` 保持 `900px`。没有 `data` 的插槽表格保留 `10px`。`TableData.vue` 把拆出来的 `minWidth` 交给 `tableStyle`，其余样式留在滚动容器。 |
| 6 | 读屏名字 | 过 | 文档站滚动容器 `role="group"`、`aria-label="表格"`。展开箭头名字是「展开行」或「折叠行」。行状态示例里四个标记都是 `role="img"`，标签为 Settled、Low stock、Bounced、No signal。单测里状态标记标签是 Saved。 |
| 7 | 键盘排序和列宽 | 过 | 文档站「可排序列」聚焦表头按钮后按 Enter，`aria-sort` 从 `ascending` 变成 `descending`，首行从 Alice 变成 Eve。`Table.test.ts` 也覆盖点表头循环排序。「可调整列宽」把手是 `role="separator"`、`aria-orientation="vertical"`。按 ArrowRight 后 `aria-valuenow` 从下限 60 变成 257。`hooks.test.ts` 断言方向键会改宽度。 |
| 8 | 服务端渲染 | 过 | `packages/core/src/ssr-known-failures.json` 是空对象，没有 Table。`env -u NODE_ENV pnpm docs:build` 退出码 0，约 49 秒，页面渲染完成。日志里的 JSON import 提示是 Vite 警告，构建没有失败。 |
| 9 | 空数据和超长最小宽度 | 过 | `Table.test.ts`：空数据文案是 “No data”，`colspan` 为 2，等于列数。`TableData.vue` 空行单元格使用 `columnCount`。超长最小宽度走同一条拆分：`900px` 写在 `<table>` 上，不留在滚动容器。 |
| 10 | 图标仍用语义名 | 过 | 行状态用 `check`、`warning`、`error`，展开箭头用 `chevronRight`。这些名字都在 `packages/core/src/Icon/semantic.ts`。本轮 diff 没有新的图标注册表。 |
| 11 | 没有 `!important`，禁用指针是 default | 过 | `node scripts/check-no-important.mjs` 退出码 0。`table.css` 没有 `not-allowed`。禁用的排序按钮、列宽把手、分组箭头、展开箭头和可点行都是 `cursor: default`。列宽、分组箭头、展开箭头的悬停色用 `:not(:disabled, [aria-disabled='true'])` 排除。 |
| 12 | 台账 48 条和抽查 | 过 | 48 条都是 `- [x]`，已采纳 25，不适用 23。抽查见下文。 |
| 13 | 本轮行为有 Vue 测试，两种环境都过 | 过 | 滚动、最小宽度、可编辑内容不展开、关掉高亮、批量操作条都有对应用例。`env -u NODE_ENV` 与 `NODE_ENV=production` 都是 5 个文件、70 条用例，退出码 0。没有搬 Playwright 夹具。 |
| 14 | 中英文说明和可操作示例 | 过 | 中文 `apps/docs/docs/zh/components/table/index.md`、英文 `apps/docs/docs/en/components/table/index.md` 都写了：操作条跟 `useTableSelectionState` 一起用；点行展开会让路给按钮、链接和可编辑内容；最小宽度不会把列压到比下限更窄。打开中文页后，展开行、排序、列宽、行选择都能操作。 |
| 15 | Table 不在 SSR 失败名单 | 过 | 同第 8 条，名单是 `{}`。 |
| 16 | 四种组合的文档站整页，亲眼看过 | 过 | 见「看图」。来源都是文档站整页。无对位。 |
| 17 | `TableData.vue` 不超过 500 行且不在白名单 | 过 | `wc -l` 为 423。`scripts/guardrails/line-limit-allowlist.json` 搜不到 `TableData`。`node scripts/check-line-limit.mjs` 通过。拆出去的 `TableScroll.vue`（50 行）负责横向滚动，`useTableColumnResizeSession.ts`（207 行）负责拖动和方向键，不是删空行。 |
| 18 | 相关 vitest 两种 `NODE_ENV` | 过 | 命令是 `pnpm exec vitest run --maxWorkers=2 packages/core/src/Table packages/core/src/Scrollbars/integration.test.ts`。两遍都是 70 passed。日志在 `/tmp/verify-C11/vitest-unset.txt` 和 `vitest-prod.txt`。 |
| 19 | typecheck、eslint、行数、`!important`、导出 | 过 | `pnpm --filter @astryx-vue/core typecheck` 退出码 0。改过的 vue/ts 跑 `eslint --max-warnings 0` 退出码 0。行数、`check-no-important`、`sync-exports.mjs --check` 都通过。`generate:check` 为 catalog is up to date（245 components）。 |
| 20 | 改动范围 | 过 | `git diff 5691a8ca --stat` 共 17 个文件。没有 `ROADMAP.md`、`SWARM.md`、`HANDOFF.md`、`PR128-BODY.md`。`catalog.json` 有改动，但只有 Table 的中英文 `usage` 各一段，见偏离说明。其余文件都在计划里。 |
| 21 | 注释不写修改历史 | 过 | `git diff BASE -- packages apps scripts` 用指定正则没有命中。命中都在台账、计划、实现回报和验收计划里，不是源码注释。 |

## 看图

四张都亲眼看过。来源是「文档站整页」。地址 `http://127.0.0.1:5191/components/table`。无对位：本机没有上游文档站，页面标题和 Demo 区块对不上同一处 Overview，所以没有左右拼图。

| 图 | 来源 | 看到的内容 |
| --- | --- | --- |
| `/opt/cursor/artifacts/c11-verify/desktop-light.png`（同 `/tmp/verify-C11/shots/desktop-light.png`） | 文档站整页，无对位 | 1440×900，浅色。顶栏有文档、组件、演练场、主题。左侧是组件侧栏。滚到「Table — 展开行」，1042 展开，备注 “Two seats, ships Friday.”，1043、1044 收着。没有报错层。 |
| `/opt/cursor/artifacts/c11-verify/desktop-dark.png` | 文档站整页，无对位 | 同一处，深色。侧栏和顶栏还在。1042 的备注面板是深色。 |
| `/opt/cursor/artifacts/c11-verify/mobile-light.png` | 文档站整页，无对位 | 390×844，浅色。顶栏有「菜单」和「返回顶部」。同一处展开行示例在视口里。 |
| `/opt/cursor/artifacts/c11-verify/mobile-dark.png` | 文档站整页，无对位 | 390×844，深色。顶栏仍有「菜单」。展开行示例为深色。 |

## 台账抽查

已采纳抽了 3 条，对照的是当前代码，不是回报：

1. `4e5f148e8`：`TableData.vue` 在 `hasRowHighlight === false` 时给表格加上 `data-row-highlight="off"`。`table.css` 把这种选中行的底色设成透明。`hooks.test.ts` 断言属性和 `aria-selected`。
2. `b2e0ea6cb`：`resolveTableMinWidth` 和列宽下限取较大值，结果写在 `<table>` 的 `minWidth` 上。`Table.test.ts` 断言 10px 抬到 120px，滚动容器没有这份 `min-width`。
3. `0777b5020`：`isInteractiveRowClick` 把 `contenteditable` 当成交互。行展开和树都用它。`advanced.test.ts` 点可编辑格子后没有详情面板。

另外核对了 `d774400a9`：清空选择会 `write(new Set())`，一个都没选时操作条不渲染。

23 条不适用都站得住：主题别名、外观令牌、浮层文字、theme target 归 B1 或 B4；演练场模板归 D5；选择器行挂点归 C3；页面壳归 C14；过滤数字前缀归 C1。`e891c0dc8` 的 `not-allowed` 被后面的 default 指针取代，当前 `table.css` 确实没有 `not-allowed`。破折号和措辞几条只改上游文档句子，组件行为没有对应缺口。性能计时、测试工程划分、知识库合约都不该搬进这个组件。StyleX 的 `light-dark()` lint 和边框简写问题对不上：表格的 vue/ts 里没有 `light-dark()`，边框已经写成 `border-bottom` 和 `border-inline-end`。

## 对实现者偏离计划的判断

计划写了不碰 `packages/cli/src/generated/catalog.json`。diff 只有一个 hunk，行号 `60344`，中英文 `usage` 各替换一段。新增的句子就是文档里补上的批量操作、点行让路和最小宽度。没有新的导出。`generate:check` 通过。这次偏离合理，不单列失败。

列宽把手只在表头格子里，没有拉成整表那么高。方向键和拖动仍然能改宽度，和计划里「宽度结果不变」一致。合理。

## 不通过的项要怎么改

无。

## 改进建议（不影响结论）

排序图标在表头悬停时会把透明度拉满，这条规则没有排除 `:disabled`。排序按钮本身没有悬停色。禁用指针已经是 `cursor: default`。

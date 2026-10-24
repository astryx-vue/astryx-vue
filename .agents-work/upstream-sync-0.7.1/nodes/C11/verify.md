# C11 Table · 验收计划

你是验收者，只检查，不改代码。实现者写的 `impl-1.md` 只用来了解他做了什么，不能当成证据，每一条都要你亲自重新验证。

**判断标准是效果，不是代码长得像不像上游。** 只要用户看到的样子、操作的手感、读屏读出的内容、公开 API 能做到的事和上游一致，代码结构不同不算问题。

## 环境

- 工作区：`/workspace`，分支 `cursor/c11-table-c500`。
  - `BASE` 指 `git merge-base HEAD swarm-tree`。
- 只读铁律：开始和结束时各跑一次 `git status`，两次结果必须相同。
  - 需要临时改文件做反向检查时，改完马上用 `git checkout -- <文件>` 还原，并在报告里写明「已还原」。
  - 临时文件都放在 `/tmp/verify-C11/`。
- 测试环境：
  - 所有测试和构建命令前面加 `env -u NODE_ENV`。
  - 测试相关的检查项跑两遍：一遍 `env -u NODE_ENV`，一遍 `NODE_ENV=production`。两遍都要通过，用例数要相同。
  - vitest 一律加 `--maxWorkers=2`。
- 浏览器：
  - 整台机器同时最多 2 个浏览器会话。
  - 只能这样开：`node scripts/swarm/browser-lock.mjs run --purpose C11-verify -- <命令>`。拿不到锁就排队，不许私开。
  - 文档站用空闲端口，同一时刻只开一个，用完关掉。
  - 看截图用读图工具直接读 PNG 文件。
  - 主证据是文档站整页 `http://127.0.0.1:<端口>/components/table`。桌面要看见侧栏，390 宽要看见顶栏上的「菜单」，并滚到有实质 Demo 的段落（展开行或行选择）。没有对位 Demo 就写「无对位」，发单侧整页。截图不入库。

## 检查项

每一项只能判「过」或「不过」，并附上证据：命令和输出、截图路径和你看到的内容。

### 一、效果和上游一致

1. 文档站中文 `/components/table` 四种组合（桌面/390px × 浅色/深色）都是整页，并且滚到「展开行」或「行选择」这种有表格内容的 Demo。无对位时不和上游拼图。
2. 行展开：箭头按钮带 `aria-expanded`。展开后详情在该行下面，面板单元格跨满所有列，并带 `data-expansion-panel`。点箭头不会把展开再点回去一次。`hasRowClickExpansion` 打开时，点行能切换；点到 `contenteditable` 的格子不切换。箭头的旋转类在图标上，不在按钮上。
3. 批量操作：`TableSelectionToolbar` 传入 `selection` 且一个都没选时不渲染；有选中项时能看到数量和清空按钮，清空会把选中集合写成空 `Set`。`hasRowHighlight: false` 时表格有 `data-row-highlight="off"`，选中行仍是 `aria-selected="true"`。
4. 滚动：放得下的表格，滚动容器的 `overscroll-behavior-x` 是 `auto`，没有 `tabindex`。把内容宽度改成超过容器后，变成 `contain`，并带 `tabindex="0"` 和 `data-scrollable-inline="true"`。滚动容器里面有 `data-scroll-content`。
5. 最小宽度：两列都没写宽度时，`style.minWidth: '10px'` 写到表格上变成 `120px`，滚动容器上没有这份 `min-width`。`900px` 保持 `900px`。没有 `data`、用插槽拼的表格保留调用方的 `10px`。`resolveTableMinWidth('50%', 240)` 是 `max(50%, 240px)`，`auto` 退回 `240px`。
6. 读屏：滚动容器是带名字的 `group`。行状态标记是 `img` 并带标签。展开箭头有展开或收起的名字。

### 二、反向挑刺

7. 只用键盘：排序仍能点表头按钮完成；列宽把手是 `separator`，方向键会改宽度（现有列宽测试仍过）。
8. 服务端渲染：`Table` 不在 `ssr-known-failures.json`。`env -u NODE_ENV pnpm docs:build` 通过。
9. 空数据：没有行时仍显示空状态，并且跨满列数。超长最小宽度不会把 `min-width` 留在滚动容器上把整页撑开。
10. 图标：行状态和展开箭头继续用语义名（`check`、`warning`、`error`、`chevronRight`），没有引入另一套注册表。
11. 没有 `!important`：`node scripts/check-no-important.mjs` 通过。`table.css` 里没有 `not-allowed`。禁用的展开箭头、分组箭头、排序按钮、列宽把手使用 `cursor: default`。悬停色排除 `:disabled` 和 `[aria-disabled="true"]`。

### 三、C 节点通用检查

12. 台账 `ledger/C11.md` 每一条都是 `- [x]`，下面都有 `- 结论：已采纳` 或 `- 结论：不适用：<理由>`。抽查至少 3 条「已采纳」，确认确实做了；抽查全部「不适用」的理由，确认站得住。
13. 上游新增或改动的测试里，本轮改到的行为（滚动只在溢出时 contain、最小宽度和列宽下限取较大值、点可编辑内容不触发展开、选中高亮可以关掉、批量操作条）都有对应的 Vue 测试，两种 `NODE_ENV` 下都通过。Playwright 夹具不要求逐条搬。
14. 中英文文档里能找到：批量操作条跟 `useTableSelectionState` 一起用；点行展开会让路给按钮、链接和可编辑内容；调用方的最小宽度不会把列压到比下限更窄。打开中文页面，示例能操作。
15. `Table` 不在 SSR 已知失败名单里。
16. 附带了四种组合的文档站整页图，并且你亲眼看过。报告里每张图标明是「文档站整页」。无对位就写「无对位」。
17. `packages/core/src/Table/TableData.vue` 不超过 500 行，而且不在 `scripts/guardrails/line-limit-allowlist.json` 里。拆出去的文件要有自己的职责，不是只删空行。

### 四、整体

18. `env -u NODE_ENV pnpm exec vitest run --maxWorkers=2 packages/core/src/Table packages/core/src/Scrollbars/integration.test.ts` 通过；`NODE_ENV=production` 同一命令通过；用例数相同。
19. `env -u NODE_ENV pnpm --filter @astryx-vue/core typecheck`、改过源码的 eslint `--max-warnings 0`、`node scripts/check-line-limit.mjs`、`node scripts/check-no-important.mjs`、`node scripts/sync-exports.mjs --check` 通过。
20. 改动范围：`git diff $BASE --stat` 里没有计划范围以外的文件。`ROADMAP.md`、`SWARM.md`、`HANDOFF.md` 没有改动。`packages/cli/src/generated/catalog.json` 没有改动。
21. 注释里没有修改历史：`git diff $BASE | grep -nE "^\+.*(原来|改成|之前|moved|extracted|split from)"` 没有命中，或者命中的都不是在讲修改历史。

## 结论

- 只要有一条不过，结论就是「不通过」。
- 报告写到 `.agents-work/upstream-sync-0.7.1/nodes/C11/verify-<N>.md`。
- 最终回复用中文，200 字以内。

## 验证操作要短小

每次验证只测一件事，每条命令都要有时间上限：浏览器命令用 `browser-lock.mjs run --max-run <秒>`，默认 180 秒；其他命令用 `timeout <秒>`。超时了不要原样重跑，先把卡住的那一步单独拆出来。脚本和结果都放在 `/tmp/verify-C11/`。

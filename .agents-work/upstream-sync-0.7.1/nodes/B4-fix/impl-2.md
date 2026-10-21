# B4-fix 浮层关闭顺序 · 第 2 轮实现回报

- 工作区：`/workspace`，分支 `sync/b4-fix-layer-escape`。
- 提交（基于 `0d02d5f`）：
  - `0941c28` fix(layer): 嵌套浮层按深度决定 Escape 先关谁
  - 这份回报紧跟在上面那笔代码提交之后。

## 1. 做了什么

第 1 轮把 Tooltip / HoverCard 整段生命周期放进关闭栈，但排位号在挂载时就定死。Popover 打开时才进栈，排位号更大。气泡 Teleport 到 body 之后，DOM 包含关系判不出谁包着谁，于是 Escape 关掉 Popover，提示还开着。只改成「打开时才进栈」也不够：同一提示再开仍沿用旧排位号。

这轮给关闭栈加上嵌套深度。深度用 provide/inject 从内容边界往下传，Teleport 切不断。`compareEntries` 先比深度，再比包含，最后比排位号。

1. `layer/layerDepth.ts`：`useLayerDepth` 读当前深度，根上是 0；`provideLayerDepth` 给内容加 1。
2. `LayerContentBoundary` 在重置成员 context 之后调用 `provideLayerDepth`。触发器不在这层里面，所以深度不加到触发器上。
3. `dismissStack.ts` 的登记项带上 `depth`，不传当作 0。比较顺序改为深度、包含、排位号。
4. `useDismiss` 登记时带上自己读到的深度。Popover 这类打开才进栈的层因此带着正确深度。
5. 新增 `layer/useHoverLayerDismiss`。整段生命周期留在栈里，`isPresent` 读是否在屏幕上，并带上嵌套深度。Tooltip 和 HoverCard 都改用它。删掉 `HoverCard/escapeDismiss.ts`。
6. 补了两组测试：栈上「更深但排位更早、容器互不包含」仍先关内层；同一身份再登记仍用旧排位，深度照样压过外层。组件上：Popover 先打开，再打开里面的 Tooltip 或 HoverCard，按一次 Escape 只关提示，Popover 保持打开。并断言气泡不在 Popover 的 DOM 里面。

| 文件 | 行数 | 职责 |
| --- | --- | --- |
| `packages/core/src/layer/layerDepth.ts` | 25 | 嵌套深度的 provide / inject |
| `packages/core/src/layer/useHoverLayerDismiss.ts` | 31 | Tooltip 与 HoverCard 共用的关闭登记 |
| `packages/core/src/layer/dismissStack.ts` | 266 | 比较时先看深度 |
| `packages/core/src/layer/LayerContentBoundary.vue` | 23 | 内容边界上深度加一 |
| `packages/core/src/composables/useDismiss.ts` | 85 | 打开才进栈的层带上深度 |
| `packages/core/src/Tooltip/useTooltip.ts` | 334 | 改走 `useHoverLayerDismiss` |
| `packages/core/src/HoverCard/useHoverCard.ts` | 591 | 同上，行数没变，仍在白名单上 |

## 2. 和上游的对照

| 上游改动 | 上游怎么做 | 我们怎么做 | 为什么效果相同 |
| --- | --- | --- | --- |
| 嵌套深度 | `LayerDepthContext` 默认 0，`LayerDepthProvider` 给内容加 1。`useLayerDismissal` 读 `useLayerDepth` | `useLayerDepth` / `provideLayerDepth`。加一发生在已有的 `LayerContentBoundary` 上 | provide/inject 跟组件树走，Teleport 切不断。里面的层深度更大，排在外面那层上面 |
| 比较顺序 | `compareEntries` 先深度，再 DOM 包含，再 `seq` | 同样三步。`seq` 仍按 token 只发一次 | 更深的层先关。同一提示再开不会因为旧排位号压过外面的 Popover |
| 悬停层登记 | Tooltip、HoverCard 都走 `useLayerDismissal`，整段生命周期在栈里，`isPresent` 读是否在屏幕上 | 抽成 `useHoverLayerDismiss`，两边共用。`isPresent` 读同步的打开状态 | 没打开时不吃 Escape。打开后按深度而不是挂载顺序决定谁在上面 |

## 3. 和计划不一样的地方

评审建议的抽法就是 `layer/useHoverLayerDismiss`，按这个做了。深度加一放在现成的内容边界上，没有再做一个只传深度的组件：这层本来就包住每个会 Teleport 的浮层内容。

## 4. 台账处理

没有改勾选，没有改 `ROADMAP.md`。`ledger/C7.md` 的说明改了一句：Escape 登记从已删除的 `HoverCard/escapeDismiss.ts` 改成 `layer/useHoverLayerDismiss.ts`。`useHoverCard.ts` 仍是 591 行，拆分还是 C7 的事。

## 5. 自测结果

| # | 自测项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | `timeout 180 env -u NODE_ENV pnpm vitest run --maxWorkers=2`，覆盖 `layer/`、`useDismiss`、`useLayer`、Tooltip、HoverCard、Popover、DropdownMenu、ContextMenu、Dialog、Selector、PowerSearch、TimeInput、Chat、TabList、NavMenu、Typeahead | 过 | 40 个文件，516 条 |
| 2 | 同一组命令，`NODE_ENV=production` | 过 | 40 个文件，516 条 |
| 3 | 改过的源码和测试 `eslint --max-warnings 0` | 过 | 无告警 |
| 4 | `node scripts/check-line-limit.mjs` 与 `check-no-important.mjs` | 过 | `useHoverCard.ts` 仍是 591，白名单不用改 |

没有重跑全量 `pnpm check` 和 `typecheck`。这轮没改导出和样式。

## 6. 拿不准的地方

- 没包 `LayerContentBoundary` 的浮层（TimeField、PowerSearch、Selector、TabMenu、NavDisclosure、ChatTriggerMenu、`useAnchoredListbox`）不会把深度加一。里面如果再开 Tooltip，仍可能按排位号关错。这次评审点名的是 Popover，Popover 和菜单都包了内容边界。
- Dialog 仍不在关闭栈里。Dialog 套 Tooltip 的旧用例继续通过，但测的不是这条嵌套。

## 给总控 / C9 的说明

PR #142 描述里原先写「修了 #128 CI」，不准确。catalog 已经修好。Check and dry-run 仍会失败，是因为 `packages/core/package.json` 的 `./Markdown/parser`、`./Markdown/plugins`、`./Markdown/plugin-renderer` 指向还没生成的 dist。这是 C9 #138 留下的，catalog 修好之后才暴露出来。本 PR 不修 Markdown 导出，交给总控和 C9 后续处理。

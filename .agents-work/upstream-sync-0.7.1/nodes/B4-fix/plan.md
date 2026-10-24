# B4-fix 关闭栈与浮层补修 · 执行计划

## 目标

Dialog 里开着 Tooltip 或 HoverCard 时，按一次 Escape 只关掉这一层，Dialog 还开着。最上层如果不吃 Escape，按键也不会漏到下面的菜单。成员关系 context 由各组件自己登记，不再让 `layer/` 反过来依赖组件。

## 工作环境

- 工作区：`/workspace`，分支 `sync/b4-fix-layer-escape`。从 `swarm-tree` 切出。只在这里改。
- 动手前已读：`SWARM.md`、`HANDOFF.md`、`ledger/B4.md`、`ledger/B6.md`、`templates/` 下的计划模板，以及用户复核原文。
- 环境纪律：测试和构建命令前面加 `env -u NODE_ENV`；vitest 加 `--maxWorkers=2`；每条命令加 `timeout`。
- 浏览器：这次主要是行为修复。截图可选，不做也不影响结论。
- 并行节点 C2、C6、C15 不碰 `layer/`。本节点会改 `layer/`。

## 上游这条改动让用户看到或感受到了什么

| 上游改动 | 用户看到或感受到的变化 |
| --- | --- |
| `useTooltip.tsx` / `useHoverCard.tsx` 走共享关闭栈 | Dialog 里开着提示或悬停卡片时，按一次 Escape 只关提示，Dialog 还在 |
| `layerStack.ts` 的 `'close' \| 'block'` | Escape 永远只打最上面那一层。不关的层把按键吃掉，不会关掉它下面的菜单 |
| `createLayerScopedContext` | 每个「我属于外面那个组」的 context 自己登记默认值，浮层里读到的默认值和没有组时一样 |
| `LayerProvider` 嵌套 inset | 嵌套声明只收紧子树里锚定浮层的定位；宽度上限是全页一份，不跟着内层改 |

## 上游依据

- 台账：`ledger/B4.md` 里关闭栈、视口 inset、成员关系 context 这几条。这次按复核意见把结论改到和代码一致。
- 上游源码：`packages/core/src/Layer/layerStack.ts`、`Layer/useLayerDismissal.ts`、`Layer/layerScopedContext.tsx`、`Tooltip/useTooltip.tsx`、`HoverCard/useHoverCard.tsx`、`Layer/LayerProvider.tsx`。
- 查上游：`git -C /tmp/astryx-upstream show v0.7.1:<路径>`，仓库已克隆到 `/tmp/astryx-upstream`。

## 有没有更适合 Vue 的做法

| 上游怎么做 | 我们怎么做 | 为什么效果一样 |
| --- | --- | --- |
| `useLayerDismissal({ isActive: true, isPresent })`，存在性读 `:popover-open` | `pushLayer`，`isPresent` 读打开状态的 ref | 我们的提示层不用 Popover API，打开状态在 ref 上是同步的，按下时读它就等于读真实开关 |
| Escape 只有 `'close' \| 'block'` | 再加 `'ignore'` | 上游没有「自己 preventDefault 的输入」这一档。用户要求这档只留给这类组件，栈不抢按键，也不往下传 |
| `createLayerScopedContext(default)` 返回 Context | `defineLayerScopedKey` 返回 key，`readLayerScoped` 用同一个默认值 | Vue 用 provide/inject。登记发生在定义 key 的时候，读取不会另写一份默认值 |
| 宽度上限写在每一层自己的样式上 | `<html>` 上仍是一条变量，多个根用引用计数 | 一条全局变量表达不了「只有子树收紧」。嵌套 inset 继续只收紧定位 gutter，台账改成这样写 |

## 任务范围

- 要改：
  - `packages/core/src/layer/dismissStack.ts` 及测试，`composables/useDismiss.ts` 及测试
  - `Tooltip/useTooltip.ts`、`HoverCard/useHoverCard.ts`
  - `dismissOnEscape` 的全部调用点（Popover、Selector、TimeField、PowerSearch、ChatTriggerMenu、Typeahead 的 `useAnchoredListbox`、ContextMenuSubMenu）
  - `layer/scopedProvide.ts`，以及现在登记在里面的各组件 `context.ts`（Radio 的 key 在 `Radio/types.ts`）
  - `LayerProvider.vue`、`layer/inlineSize.ts` 及测试
  - `Toast/ToastViewport.vue`、`styles/toast.css`
  - `scripts/guardrails/line-limit-allowlist.json`
  - 交接：`ledger/B4.md`、`ledger/C3.md`、`ledger/C4.md`、`ledger/C7.md`，`ROADMAP.md` 只改 D7 行和 C3/C4/C7 行的备注列
  - CLI：`packages/cli/src/generated/catalog.json`（`pnpm --filter @astryx-vue/cli generate` 的产物）
- 不碰：`SWARM.md`、PR #128 的描述以外的总 PR 正文、C2/C6/C15 正在改的组件逻辑。不拆 `useHoverCard.ts`（那是 C7 的活），但行数不能比白名单更大。
- 范围不对时：先停下，写进回报。

## 开发步骤

1. 关闭栈：`dismissOnEscape` 改成 `'close' | 'block' | 'ignore'`。只看最上层。`'block'` 调用 `preventDefault` 但不关。`'ignore'` 什么都不做。不在屏幕上的层（`isPresent` 为假）仍然跳过。
2. Tooltip、HoverCard 用 `pushLayer` 登记（`dismissOnPointerOutside: false`，`isPresent` 读打开状态），删掉自己的 document Escape 监听。HoverCard 点外面的触摸监听留着。
3. 调用点：Popover 的 `hasEscapeDismiss === false` 传 `'block'`；TimeField、PowerSearch、ChatTriggerMenu、`useAnchoredListbox` 传 `'ignore'`（它们自己处理 Escape 并 `preventDefault`）；原来传 `true` 的改成 `'close'`。
4. `defineLayerScopedKey` / `readLayerScoped`。`scopedProvide.ts` 只留登记表、重置和 `layer.css` 引入。各 context 改用它。加一个扫描测试：成员关系 context 必须走登记，没登记的 context 文件必须在非成员名单里。
5. `LayerProvider` 写到 `<html>` 的宽度变量按持有者计数：卸掉一个根，还在的根继续持有；最后一个卸掉才删变量。嵌套 inset 不改这条变量。台账改成和这个行为一致。
6. Toast 的过渡时长和搬移等待用同一个 CSS 变量 `--astryx-toast-motion-duration`。跑 `node scripts/check-line-limit.mjs --update` 收紧白名单。
7. 交接文档：B4 补「给 D7 的说明」；C3/C4 写明必须拆 `MultiSelector.vue`、`PowerSearch.vue`；C7 写明 `resolveLayerMountTarget`、`isTopLayer` 接入或删除。ROADMAP 只改指定行的备注。
8. `pnpm install --frozen-lockfile` 后 `pnpm typecheck`。`pnpm --filter @astryx-vue/cli generate`，再跑 `generate:check`。

每做完一步，相关测试通过以后就提交一次。

## 自测要求

1. `timeout 180 env -u NODE_ENV pnpm vitest run --maxWorkers=2` 跑关闭栈、Tooltip、HoverCard、Popover、LayerProvider、scopedProvide、Toast 相关测试。
2. 同一组命令再跑一遍 `NODE_ENV=production`，用例数相同。
3. `timeout 180 env -u NODE_ENV pnpm typecheck`。
4. `timeout 120 env -u NODE_ENV pnpm exec eslint` 覆盖改过的源码，以及 `node scripts/check-line-limit.mjs`、`node scripts/check-no-important.mjs`。
5. `timeout 120 pnpm --filter @astryx-vue/cli generate:check`。
6. 不跑全量 `pnpm check` 里耗时很长的文档构建；行数、important、typecheck、相关单测分开跑。

## 提交与回报

- 提交信息用中文。推送 `sync/b4-fix-layer-escape`，开 draft PR，base 为 `swarm-tree`。
- 不改 `SWARM.md`，不合并。
- 回报写到 `.agents-work/upstream-sync-0.7.1/nodes/B4-fix/impl-1.md`。
- 最终回复用中文，300 字以内。

## 验证操作要短小

每次只测一件事，命令加 `timeout`。脚本和结果放在 `/tmp/b4-fix-*`。

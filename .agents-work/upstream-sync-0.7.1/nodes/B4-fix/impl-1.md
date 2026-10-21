# B4-fix 浮层关闭顺序 · 第 1 轮实现回报

- 工作区：`/workspace`，分支 `sync/b4-fix-layer-escape`。
- 提交（基于 `4a5b9a4`）：
  - `c46d599` docs(b4-fix): 写下关闭栈补修的计划和验收清单
  - `9589dc1` fix(layer): 关闭栈只打最上面一层，并补上成员 context 与宽度上限
  - `3f5c433` docs(b4-fix): 补上台账和给后续节点的说明
  - `1d4ad43` chore(cli): 刷新生成的 catalog

## 1. 做了什么

1. Escape 只打最上面那一层。`dismissOnEscape` 是 `'close' | 'block' | 'ignore'`。`'block'` 吃掉按键但不关，也不交给下面。`'ignore'` 不 `preventDefault`，留给自己会取消按键的输入组件。
2. Tooltip、HoverCard 整段生命周期 `pushLayer`。`dismissOnPointerOutside: false`，`isPresent` 读打开状态。删掉它们自己的 document Escape 监听。HoverCard 的触摸 `pointerdown` 还在。
3. Popover 的 `hasEscapeDismiss: false` 传入 `'block'`。TimeField、PowerSearch、ChatTriggerMenu、`useAnchoredListbox` 传入 `'ignore'`。Selector、ContextMenuSubMenu 传入 `'close'`。
4. `defineLayerScopedKey` / `readLayerScoped`。`scopedProvide.ts` 不再引用组件。23 个成员 key 在各自模块登记。扫描测试拦住漏登记。
5. 根 provider 用持有者栈写 `--astryx-layer-max-inline-size`。嵌套 inset 只收紧子树定位空隙，不改这个全局变量。台账按这个行为改过。
6. Toast 搬视口的等待时间改读 `--astryx-toast-motion-duration`，和 CSS 过渡同一份，默认 165ms。
7. `node scripts/check-line-limit.mjs --update` 收紧白名单。`pnpm --filter @astryx-vue/cli generate` 刷新 catalog。

| 文件 | 行数 | 职责 |
| --- | --- | --- |
| `packages/core/src/layer/dismissStack.ts` | 257 | 关闭栈。Escape 三档，不往下传 |
| `packages/core/src/layer/scopedProvide.ts` | 68 | 登记表、读取、重置。不引用组件 |
| `packages/core/src/HoverCard/escapeDismiss.ts` | 24 | HoverCard 登记进关闭栈 |
| `packages/core/src/HoverCard/useHoverCard.ts` | 591 | 仍超 500，交给 C7 拆。本轮没有超过白名单 |
| `packages/core/src/Toast/motionDuration.ts` | 36 | 读 toast 运动时长 |
| `packages/core/src/layer/escapeOrder.test.ts` | 120 | Dialog+Tooltip、Dialog+HoverCard、菜单上的 block Popover |

## 2. 和上游的对照

| 上游改动 | 上游怎么做 | 我们怎么做 | 为什么效果相同 |
| --- | --- | --- | --- |
| 关闭栈 Escape | 只打最上面一层。`'close'` 或 `'block'`。没有 `'ignore'` | 同样只打最上面一层。多了 `'ignore'`，给自己会 `preventDefault` 的输入 | `'close'` / `'block'` 和上游一样。`'ignore'` 是这次评审要求的第三档 |
| Tooltip / HoverCard | `useLayerDismissal`，`isPresent` 读 `:popover-open` | `pushLayer`，`isPresent` 读同步的打开 ref。我们没用 Popover API | 打开时在栈顶，关掉后不再吃 Escape |
| 成员 context | `createLayerScopedContext(default)` 自己登记 | `defineLayerScopedKey` 在定义 key 时登记，读者用同一个默认值 | 浮层里读到的默认值和没有组时是同一个值 |
| 宽度上限 | 上游按层从 context 算，不写一个全局变量 | 全局变量只由根 provider 持有。嵌套只收紧定位空隙 | html 上只有一份变量，表达不了每个子树的宽度上限。定位空隙的收紧和现有测试一致 |

## 3. 和计划不一样的地方

- 嵌套宽度上限：计划允许改代码或改台账。实际改台账。嵌套 inset 不写全局 `--astryx-layer-max-inline-size`。多个根用持有者栈，后挂的生效，卸掉回到上一份。
- `'ignore'` 是我们加的，上游只有 `'close' | 'block'`。
- `isPresent` 读打开 ref，不读 `:popover-open`。
- `useHoverCard.ts` 顶着 592 行的白名单。Escape 登记抽到 `escapeDismiss.ts`，主文件 591 行。没有做 C7 的整文件拆分。

## 4. 台账处理

B4 台账原来已全部勾完。本轮改了三条结论，让它们和现在的行为一致：Escape 三档、宽度上限只由根写入、BottomSheet 接入时传 `'close'`。并补了「给 D7 的说明」。

C3、C4、C7 只加了「给本节点的说明」，没有改勾选状态。ROADMAP 只改了 C3、C4、C7、D7 的说明格子，状态列没动。

## 5. 自测结果

| # | 自测项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | `timeout 180 env -u NODE_ENV pnpm vitest run --maxWorkers=2` 覆盖关闭栈、Tooltip、HoverCard、Popover、成员 context、LayerProvider、Toast 和相关组件 | 过 | 72 个文件，860 条 |
| 2 | 同一组命令，`NODE_ENV=production` | 过 | 72 个文件，860 条，和上一条相同 |
| 3 | `timeout 240 env -u NODE_ENV pnpm typecheck` | 过 | core、cli、docs 都过。先跑了 `pnpm install --frozen-lockfile` |
| 4 | 改过的源码 `eslint --max-warnings 0` | 过 | 无告警 |
| 5 | `node scripts/check-line-limit.mjs` 与 `check-no-important.mjs` | 过 | 白名单已收紧：DropdownMenu 514、TableData 596、useHoverCard 591、PowerSearch 706 |
| 6 | `pnpm --filter @astryx-vue/cli generate:check` | 过 | catalog 245 components |
| 7 | 视觉对照 | 无 | 这次没有改外观，按任务不截图 |

## 6. 拿不准的地方

- C6 如果同时拆 `DropdownMenu.vue`，白名单数字以合并顺序为准。本分支把记录从 517 收到 514，没有改这个文件。
- PowerSearch 里 token 的 Escape 只把焦点送回输入框，没有 `preventDefault`。它仍标成 `'ignore'`，按键可能继续往下走。这是原有行为，本轮没有改那条按键处理。
- `useHoverCard.ts` 仍是 591 行。`resolveLayerMountTarget` 和 `isTopLayer` 仍没有生产调用方。都留给 C7 接入或删除。

## 给 D7 的说明

Tab、TabMenu 必须放在 `TabList` 里，Step 必须放在 `Stepper` 里。放在外面时会抛错，包括浮层边界把成员 context 重置掉的时候。以前放在外面是静默退化。迁移：包进对应的 `TabList` / `Stepper`，或者在浮层内容里再放一层本地的 `TabList` / `Stepper`。

`useDismiss` 不再接收布尔值 `enableEscape`。选项是 `dismissOnEscape`，取值 `'close'`、`'block'`、`'ignore'`。不传等于 `'close'`。

# B4-fix 验收报告 · 第 1 轮

结论：通过（23/23）

- 工作区：`/workspace`，分支 `sync/b4-fix-layer-escape`，受检提交 `b864c90`（本报告是之后另交的一笔，不包含在受检范围内）。
- 比较基点：`BASE = 4a5b9a4227675ee7ca1f56caa17788d5e30adead`（`git merge-base HEAD origin/swarm-tree`）。本地原先没有 `swarm-tree`，先 `git fetch origin swarm-tree`。这个基点就是当时的 `origin/swarm-tree` 尖端，本分支包含它的全部提交。
- 临时文件和截图：`/tmp/verify-B4-fix/`。全部自己重新生成，没有用实现者留下的产物。
- 只读检查：开始时 `git status` 是 `On branch sync/b4-fix-layer-escape` / `nothing to commit, working tree clean`。写本报告之前再跑一次，结果相同。
- 临时改动：无。`pnpm install --frozen-lockfile` 没有改锁文件，也没有留下未提交文件。
- 浏览器：没有开。验收计划写明这条补修以单测为主，不要求截图。没有残留浏览器进程。

## 逐条结果

| # | 检查项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | Dialog 里的 Tooltip，一次 Escape 只关提示，Dialog 仍开，且 `defaultPrevented` | 过 | `timeout 120 env -u NODE_ENV pnpm vitest run --maxWorkers=2 packages/core/src/layer/escapeOrder.test.ts`：1 文件，3 条通过，退出码 0。`NODE_ENV=production` 再跑：同样 3 条。用例「dialog 里的 Tooltip 吃掉一次 Escape，Dialog 保持打开」断言气泡隐藏、`dialog` 仍有 `open`、没有 `openChange`、`defaultPrevented` 为真。 |
| 2 | Dialog 里的 HoverCard，一次 Escape 只关卡片，Dialog 仍开 | 过 | 同一文件、同两次运行。用例「dialog 里的 HoverCard 吃掉一次 Escape，Dialog 保持打开」断言 `.astryx-hover-card` 隐藏、对话框仍开、`defaultPrevented` 为真。 |
| 3 | `hasEscapeDismiss` 为假的 Popover 盖在菜单上，Escape 不关菜单也不关 Popover，按键被吃掉 | 过 | 同一文件。用例「不响应 Escape 的 Popover 盖在菜单上时，Escape 不关菜单」断言菜单和 Popover 都还显示，`defaultPrevented` 为真，菜单的 `openChange` 只有打开时的 `[[true]]`。 |
| 4 | 栈：`block` 不关下层且 `preventDefault`；`ignore` 不关下层且栈不 `preventDefault`；不在屏幕上的层跳过 | 过 | `timeout 120 env -u NODE_ENV pnpm vitest run --maxWorkers=2 packages/core/src/layer/dismissStack.test.ts`：19 条通过。`NODE_ENV=production`：19 条，数量相同。对应用例是「最上层是 block 时吃掉按键，下面那层不关」「最上层是 ignore 时栈不处理，下面那层也不关」「跳过不在屏幕上的层，把按键交给下面那层」。 |
| 5 | Tooltip、HoverCard 不再自己监听 document 上的 Escape；HoverCard 的触摸 `pointerdown` 还在 | 过 | `useTooltip.ts` 用 `pushLayer`（`dismissOnEscape: 'close'`，`isPresent` 读打开状态，`dismissOnPointerOutside: false`），文件里没有 `addEventListener('keydown'`，也没有 `key === 'Escape'`。HoverCard 的关闭登记在 `HoverCard/escapeDismiss.ts` 的 `pushLayer`。`useHoverCard.ts` 仍有 `document.addEventListener('keydown', onModalityKeyDown)`，这个函数只把最近输入记成键盘，不看 Escape，也不关闭。打开时的 `document.addEventListener('pointerdown', onDocumentPointerDown, true)` 还在，并且只处理触摸、点在外面就关掉。 |
| 6 | 没有 `enableEscape`；`useDismiss` 的选项是 `dismissOnEscape` | 过 | `rg "enableEscape" packages/core/src` 无命中。`useDismiss.ts` 的选项类型是 `dismissOnEscape?: MaybeRefOrGetter<DismissEscape>`，不传等于 `'close'`。 |
| 7 | Popover 假值传 `'block'`；TimeField、PowerSearch、ChatTriggerMenu、`useAnchoredListbox` 传 `'ignore'`；Selector、ContextMenuSubMenu 传 `'close'`，不再传布尔 | 过 | `usePopover.ts`：`hasEscapeDismiss` 为假时是 `'block'`，否则 `'close'`。`TimeField.vue`、`PowerSearch.vue`、`ChatTriggerMenu.vue`、`useAnchoredListbox.ts` 都是 `dismissOnEscape: 'ignore'`。`Selector.vue`、`ContextMenuSubMenu.vue` 是 `'close'`。`rg "dismissOnEscape:\\s*(true\|false)"` 无命中。 |
| 8 | `scopedProvide.ts` 不引用组件 context，并导出登记、读取、重置 | 过 | 文件只 import `vue` 和 `styles/layer.css`。导出 `defineLayerScopedKey`、`readLayerScoped`、`resetLayerScopedContext`（另外还有测试用的 `registeredLayerScopedContexts`）。 |
| 9 | 成员关系 context 都走登记；默认值同一个；没登记的在非成员名单 | 过 | `timeout 120 env -u NODE_ENV pnpm vitest run --maxWorkers=2 packages/core/src/layer/scopedProvide.membership.test.ts`：3 条通过。`NODE_ENV=production`：3 条。扫描要求登记数至少 23，并检查 `scopedProvide` 不 `from` 组件或 `context`。 |
| 10 | 按钮组截断、Tab / Step 离开容器报错的原测试仍过 | 过 | `scopedProvide.test.ts`：两种 `NODE_ENV` 都是 6 条通过。`scopedProvide.tabStepper.test.ts`：两种都是 6 条通过。 |
| 11 | 两个根同时在：卸掉一个，变量还在且是剩下那个的值；两个都卸才删 | 过 | `inlineSize.test.ts`「后挂上的根 provider 写变量，卸掉以后回到先挂的那份」：两种 `NODE_ENV` 下整文件都是 10 条通过。`inlineSize.ts` 用 `holders` 栈，`releaseLayerMaxInlineSize` 摘掉后再把当前栈顶写回，空了才 `removeProperty`。 |
| 12 | 嵌套再声明 inset 不改全局变量；定位空隙仍按内层收紧 | 过 | 同一文件「嵌套 provider 只收紧子树定位，不改根上的宽度上限」在 10 条里，两种环境都过。`LayerProvider.test.ts`「lets a nested provider narrow the anchored layer inset, but keeps the root toast」仍在；两种 `NODE_ENV` 都是 15 条通过。`LayerProvider.vue` 只有非嵌套根调用 `retainLayerMaxInlineSize`，嵌套分支只把 inset 收紧后 `provide` 给子树。 |
| 13 | B4 台账的宽度上限说法和上面两条一致，并写明改台账还是改代码 | 过 | `ledger/B4.md` 把这条结论改成：全局变量只由根写入；html 上只有一份，表达不了每个子树的宽度上限，所以嵌套 inset 不改这个变量；多个根用持有者栈，后挂的生效，卸掉回到上一份，最后一份才删。这是把台账改到和代码一致，没有改成每个子树各写一份宽度。 |
| 14 | B4 台账和 ROADMAP 的 D7 备注写明 Tab / TabMenu / Step 离开容器会报错；状态列没改 | 过 | `ledger/B4.md`「给 D7 的说明」写明 Tab、TabMenu 必须在 `TabList` 里，Step 必须在 `Stepper` 里，放在外面会抛错。`ROADMAP.md` D7 行的事项列有同一件事。状态表里 D7 仍是「未开始」，`git diff 4a5b9a4 -- ROADMAP.md` 没动状态列。 |
| 15 | C3 / C4 台账和 ROADMAP 写明必须拆 MultiSelector、PowerSearch，并点出 `4672361` 删空行 | 过 | `ledger/C3.md`：`4672361` 用删空行躲开白名单，必须把 `MultiSelector.vue` 拆开（同段也写了 `Selector.vue`）。`ledger/C4.md`：同一句，对象是 `PowerSearch.vue`。ROADMAP 的 C3、C4 事项列有同样的话。勾选状态没有改。 |
| 16 | C7 台账和 ROADMAP 写明 `resolveLayerMountTarget`、`isTopLayer` 接入或删除 | 过 | `ledger/C7.md`「给本节点的说明」和 ROADMAP C7 事项列都写了「必须接入或删除」。状态列仍是「可开工」。 |
| 17 | Toast 视口不再写死 `250`，时长来自 `--astryx-toast-motion-duration` | 过 | `rg "250" packages/core/src/Toast/ToastViewport.vue` 无命中。等待用 `readToastMotionDurationMs(viewportRef.value)`。`toast.css` 定义 `--astryx-toast-motion-duration`，过渡时长用 `var(--astryx-toast-motion-duration, 165ms)`。`motionDuration.test.ts` 两种 `NODE_ENV` 都是 4 条通过。 |
| 18 | 行数检查通过；DropdownMenu、TableData 白名单不大于 517、598，且按当前行数收紧 | 过 | `timeout 60 node scripts/check-line-limit.mjs` 退出码 0：「源码单文件行数检查通过」。基点白名单是 DropdownMenu 517、TableData 598；现在是 514、596。`wc -l` 分别是 514、596。这两个文件相对基点没有 diff。实现回报写了：若和 C6 一起改 `DropdownMenu.vue`，数字以合并顺序为准。本分支没有改这个文件。 |
| 19 | `pnpm install --frozen-lockfile` 之后 typecheck 通过 | 过 | 安装退出码 0，锁文件已是最新。`timeout 180 env -u NODE_ENV pnpm typecheck` 退出码 0：cli、core、docs 的 typecheck 都是 Done。 |
| 20 | `generate:check` 通过，catalog 更新在本分支提交里 | 过 | `timeout 120 pnpm --filter @astryx-vue/cli generate:check` 退出码 0：`catalog is up to date (245 components, 31 topics, 53 templates)`。catalog 的 diff 在提交 `1d4ad43`。 |
| 21 | 相对基点没有 `SWARM.md`，也没有计划以外的组件大改 | 过 | `git diff 4a5b9a4 --stat` 没有 `SWARM.md`。源码改动是关闭栈、调用点、各 context 改走登记、LayerProvider、Toast 时长和测试。context 文件都是几行到二十行，没有计划外的大改。 |
| 22 | 改过的源码没有新增 `!important`；`useHoverCard.ts` 不超过白名单 | 过 | `git diff 4a5b9a4 -- '*.vue' '*.css' '*.ts'` 里新增行没有 `!important`。`wc -l packages/core/src/HoverCard/useHoverCard.ts` 是 591，白名单也是 591（基点记录是 592）。 |
| 23 | 新增注释不是在讲这次修改史 | 过 | 对 `*.vue`、`*.ts`、`*.css` 的新增行搜「原来\|改成\|之前\|moved\|extracted\|split from」没有命中。全 diff 的命中在计划、验收清单、实现回报、ROADMAP，以及 catalog 里 Markdown 文档原有的「原来」用法，都不是源码在叙述这次修改。 |

## 看图

无。验收计划写明不要求四种外观截图，本轮没有打开文档站，也没有截图。

| 图 | 来源 | 看到的内容 |
| --- | --- | --- |
| 无 | 无 | 无 |

## 对实现者偏离计划的判断

- 嵌套宽度上限改台账、不让内层去写全局变量：合理。计划和验收第 13 条允许这条，代码和台账一致。
- 多出 `'ignore'` 这一档：合理。计划写了这一档只留给自己会 `preventDefault` 的输入。
- `isPresent` 读打开状态的 ref，不读 `:popover-open`：合理。计划写了提示层不用 Popover API。
- `useHoverCard.ts` 仍是 591 行，没有整文件拆开：留给 C7，可接受。计划写明本轮不拆，只要不超过白名单。现在 591 等于白名单 591，比基点的 592 少 1。C7 台账也写了整文件拆分仍由 C7 做。
- `resolveLayerMountTarget`、`isTopLayer` 没有生产调用方：留给 C7，可接受。`rg` 在非测试代码里只有定义本身。验收第 16 条要求的是写明「接入或删除」，不是本轮接上。台账和 ROADMAP 都写了。
- PowerSearch 里 token 的 Escape 没有 `preventDefault`：不因此判不通过，也不能算留给 C7。验收第 7 条只要求 PowerSearch 传入 `'ignore'`，这一点做到了。第 4 条还规定 `'ignore'` 时栈自己不调用 `preventDefault`，下面那层的 `onDismiss` 也不调用。输入框走 `menu.onKeyDown`、编辑器走 `PowerSearchEditor.vue`，这两处 Escape 有 `preventDefault`。token 焦点这条（`onTokenKeyDown`）只把焦点送回输入框。C7 的说明里没有这件事，C4 只要求把文件拆开。

## 不通过的项要怎么改

无。

## 改进建议（不影响结论）

PowerSearch 的 token 在拿到 Escape 时补上 `preventDefault`。现在这一条不阻止关闭栈把按键交给下面的层，但按键没有被吃掉，放在原生 `<dialog>` 里时，浏览器仍可能接着派发 `cancel`，把对话框关掉。这是这一轮 `'ignore'` 的使用前提没补全，不是 C7 的挂载目标或 HoverCard 拆分。

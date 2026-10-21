# B4-fix 关闭栈与浮层补修 · 验收计划

你是验收者，只检查，不改代码。`impl-1.md` 只用来了解改了什么，每一条都要亲自重跑。

判断标准是按键和卸载之后用户还能看到什么，不是代码和上游长得像不像。

## 环境

- 工作区：`/workspace`，分支 `sync/b4-fix-layer-escape`。
- `BASE` 指 `git merge-base HEAD swarm-tree`。
- 只读：开始和结束各跑一次 `git status`，两次结果必须相同。临时文件放 `/tmp/verify-B4-fix/`。
- 测试命令前面加 `env -u NODE_ENV`，再跑一遍 `NODE_ENV=production`。vitest 加 `--maxWorkers=2`。每条命令加 `timeout`。
- 这条补修以单测为主。不要求四种外观截图。

## 检查项

每一项只能判「过」或「不过」，并附上命令和关键输出。

### 一、Escape 只打最上面一层

1. Dialog 里开着 Tooltip，按一次 Escape：Tooltip 关掉（或受控时只上报关闭），Dialog 仍开着。按键的 `defaultPrevented` 为真，所以原生 `<dialog>` 的 `cancel` 不会跟着来。证据：`packages/core/src/layer/escapeOrder.test.ts` 里对应用例，两种 `NODE_ENV` 都过。
2. Dialog 里开着 HoverCard，按一次 Escape：HoverCard 关掉，Dialog 仍开着。同一测试文件。
3. 菜单开着，上面再开一个 `hasEscapeDismiss` 为假的 Popover，按 Escape：菜单不关，Popover 也不关，按键被吃掉（`defaultPrevented` 为真）。同一测试文件。
4. 栈的单元测试：最上层是 `'block'` 时，下面那层的 `onDismiss` 不被调用，并且 `defaultPrevented` 为真。最上层是 `'ignore'` 时，下面那层不关，并且栈自己不调用 `preventDefault`。不在屏幕上的层（`isPresent` 返回假）仍然跳过，按键交给下面还在的层。命令：`timeout 120 env -u NODE_ENV pnpm vitest run --maxWorkers=2 packages/core/src/layer/dismissStack.test.ts`，再跑 production。
5. Tooltip、HoverCard 的源码里不再有自己的 `document.addEventListener('keydown'` Escape 监听。HoverCard 点外面的触摸 `pointerdown` 监听还在。

### 二、三种取值的调用点

6. `rg "enableEscape" packages/core/src` 没有命中。`useDismiss` 的选项是 `dismissOnEscape`。
7. Popover 在 `hasEscapeDismiss` 为假时传入 `'block'`。TimeField、PowerSearch、ChatTriggerMenu、`useAnchoredListbox` 传入 `'ignore'`。Selector、ContextMenuSubMenu 传入 `'close'`（或依赖默认的 `'close'`，但源码里不能再传布尔值）。

### 三、成员关系 context 的依赖方向

8. `packages/core/src/layer/scopedProvide.ts` 不再 import 任何组件的 context。它导出 `defineLayerScopedKey`、`readLayerScoped`、`resetLayerScopedContext`。
9. 跑 `packages/core/src/layer/scopedProvide.membership.test.ts`：每个成员关系 context 都是 `defineLayerScopedKey` 登记的；读取用的默认值和登记的是同一个；没走登记的 context 文件都在非成员名单里。两种 `NODE_ENV` 都过。
10. 原有的按钮组截断、Tab / Step 离开容器就报错的测试仍然过：`scopedProvide.test.ts`、`scopedProvide.tabStepper.test.ts`。

### 四、根上的 CSS 变量和台账

11. 两个根 `LayerProvider` 同时在：卸掉其中一个，`<html>` 上的 `--astryx-layer-max-inline-size` 还在，值是剩下那个的；两个都卸掉才删掉。证据：`inlineSize.test.ts`。
12. 嵌套 provider 再声明 inset 时，这条全局变量不变（仍是外层的值）。定位 gutter 仍然按内层收紧（原有 `LayerProvider.test.ts` 那条还在）。
13. `ledger/B4.md` 里宽度上限的说法和上面两条一致，并写明选的是改台账还是改代码。

### 五、交接和小项

14. `ledger/B4.md` 有「给 D7 的说明」，写明 `Tab`、`TabMenu` 离开 `TabList`、`Step` 离开 `Stepper` 会直接报错。`ROADMAP.md` 的 D7 行备注里有同一件事。状态列没改。
15. `ledger/C3.md`、`ledger/C4.md` 写明 `MultiSelector.vue`、`PowerSearch.vue` 必须拆，并点出 `4672361` 是靠删空行绕白名单。`ROADMAP.md` 的 C3、C4 行备注列有同样的话。
16. `ledger/C7.md` 写明 `resolveLayerMountTarget`、`isTopLayer`「接入或删除」。`ROADMAP.md` 的 C7 行备注列有同样的话。
17. `ToastViewport.vue` 里不再出现字面量 `250`。过渡时长和等待时间都来自 `--astryx-toast-motion-duration`（或读它的函数）。
18. `node scripts/check-line-limit.mjs` 通过。白名单里 `DropdownMenu.vue`、`TableData.vue` 的数字不大于改之前（517、598），并且已经按当前行数收紧。如果和 C6 冲突，回报里要写清以谁为准。

### 六、整体

19. `timeout 180 env -u NODE_ENV pnpm typecheck` 通过。先有 `pnpm install --frozen-lockfile`。
20. `timeout 120 pnpm --filter @astryx-vue/cli generate:check` 通过，`catalog.json` 的更新在本分支的提交里。
21. `git diff $BASE --stat` 里没有 `SWARM.md`，没有计划以外的组件大改。
22. 改过的源码文件没有新增 `!important`。`useHoverCard.ts` 的行数不超过白名单记录。
23. 注释里没有修改历史：`git diff $BASE | grep -nE "^\+.*(原来|改成|之前|moved|extracted|split from)"` 没有命中，或者命中的都不是在讲这次修改。

## 结论

- 只要有一条不过，结论就是「不通过」。
- 报告写到 `.agents-work/upstream-sync-0.7.1/nodes/B4-fix/verify-1.md`。
- 最终回复用中文，200 字以内。

## 验证操作要短小

每次只测一件事，命令加 `timeout`。结果放 `/tmp/verify-B4-fix/`。

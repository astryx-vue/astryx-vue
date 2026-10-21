# B4 浮层运行时 Layer · 执行计划

## 目标

把浮层运行时追到上游 v0.7.1。浮层运行时是所有「浮在页面上面的东西」共用的那套底层逻辑。这些东西包括 Popover、Tooltip、HoverCard、菜单、Dialog、Toast、BottomSheet，它负责定位、层叠、关闭和焦点。

做完以后，用户能感受到这些变化：

1. **按 Escape 或点外面，只关最上面那一层。** 比如 Dialog 里打开一个下拉菜单，按一次 Escape 只关菜单，Dialog 还在；再按一次才关 Dialog。点菜单外面、Dialog 里面的地方，也只关菜单。上游用一个**全局共享的关闭栈**做到这一点（#4881，BottomSheet #7225 也加入了这个栈）。
2. **触发器不会和自己的「点外面关闭」打架。** 点 Popover 的触发器去关它，不会出现「先被点外面关掉，又被点击重新打开」的闪一下（#5004、#5018）。
3. **浮层贴着屏幕边时留出安全边距。** 浮层定位时不会贴到视口边缘或者刘海屏的安全区里，视口内边距由运行时统一管理（AST-059，#6919）。
4. **浮层不继承外面的文字样式。** 浮层里的文字字号、颜色、行高等，不会继承触发器所在位置的样式。比如在一个加粗的大标题里打开 Tooltip，Tooltip 的文字仍然是正常样式（#5064、#6457、AST-038）。
5. **在 Dialog 里打开的浮层，挂在 Dialog 里面。** 这样它不会被 Dialog 的模态遮罩挡住，焦点也不会逃出 Dialog（#7172）。打开 Dialog 以后，Toast 仍然显示在最上面，并且可以点击（#7238）。
6. **没有悬停能力的设备上，点一下就能打开 Tooltip 和 HoverCard**（#5248）。
7. 浮层内容区和外面的「容器内边距系统」互不影响（#5231、#7287）。

这个节点下游有 32 个节点。

## 工作环境

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/B4`，分支 `sync/b4-layer`，已经建好。槽位和端口用 `node scripts/swarm/worktree.mjs ls` 查。
- 动手前先读：
  1. `.agents-work/upstream-sync-0.7.1/SWARM.md`，重点看「对齐上游的标准：看效果，不看代码」和「跑检查时的环境」两节。
  2. 台账 `.agents-work/upstream-sync-0.7.1/ledger/B4.md`，共 29 条。
  3. B3 的回报 `.agents-work/upstream-sync-0.7.1/nodes/B3/impl-1.md`。B3 已经做好了交互模态（`composables/internal/interactionModality.ts`）、按压控制器、焦点归还（`composables/internal/focusReturn.ts`、`useFocusReturnVisibility.ts`），B4 直接复用这些，不要重写。
- 我们现在的实现：
  - `packages/core/src/layer/`：`position.ts` 做定位计算，`usePositionedLayer.ts`，`focus.ts`，`gutter.ts`。
  - `packages/core/src/LayerProvider/`：`LayerProvider.vue`，`inset.ts` 管视口内边距，`context.ts`。
  - `packages/core/src/composables/useLayer.ts`（185 行）和 `useDismiss.ts`（130 行）。
  - 用到 `useDismiss` 的组件有：Selector、TimeField、useAnchoredListbox、ChatTriggerMenu、DropdownMenu、DropdownMenuSubMenu、ContextMenu、ContextMenuSubMenu、usePopover、TabMenu、NavDisclosure、PowerSearch。
- 上游的实现，在 `packages/core/src/Layer/` 下，重点读这几组：
  - `layerStack.ts`、`useLayerDismissal.ts`，以及 `layerDismissalFamilies.test.tsx`、`layerDismissalInvariants.test.tsx`：关闭栈。
  - `layerHost.ts`、`modalOutlet.ts`：浮层挂在哪里。
  - `layerViewportInset.stylex.ts`、`layerInset.ts`：视口内边距。
  - `layerTextReset.stylex.ts`、`layerStructureReset.stylex.ts`：文字和结构重置。
  - `useTouchTrigger.ts`：点一下打开。
  - `useLayer.tsx`、`LayerProvider.tsx`、`layerScopedContext.tsx`。
  - 规范：`docs/specs/AST-038`、`docs/specs/AST-059`，以及 `docs/architecture/` 里讲 layer 的那篇。
  - 读上游文件的方法：`git -C /Users/shenqingchuan/workspace/astryx-upstream show v0.7.1:<路径>`。
- 环境纪律：所有测试和构建命令前面加 `env -u NODE_ENV`，vitest 一律加 `--maxWorkers=2`。
- 浏览器纪律：
  - 整台机器同时最多 2 个浏览器会话。
  - 只能用 `node scripts/swarm/browser-lock.mjs run --purpose B4 -- <命令>`，或者 `pnpm visual ... --out /tmp/B4-...` 开浏览器。
  - 文档站用你的槽位端口，用完关掉。

## 上游这些改动让用户看到或感受到了什么

| 类别 | 台账条目 | 用户感受到的变化 | B4 要做的 |
| --- | --- | --- | --- |
| 共享关闭栈 | #4881 `47d5160dc`、#7225 BottomSheet 加入、#5004/#5018、#7167 ContextMenu、#6950 CommandPalette | 按 Escape 或点外面，只关最上面那一层；触发器不和自己打架 | 新建一个全局关闭栈，把 `useDismiss` 改成走这个栈。**所有现在用 `useDismiss` 的组件会自动加入这个栈**，因为它们本来就调用 `useDismiss` |
| 视口内边距 | #6919、AST-059 `f37274447` | 浮层不贴边，避开安全区 | 对照我们的 `LayerProvider/inset.ts` 和上游，补齐差异，让 `position.ts` 用这个内边距 |
| 挂载位置 | #5039 挂在不会破坏它的祖先之外、#7172 Dialog 内就近挂载、#7238 Toast 在 Dialog 之上 | 浮层不被裁切、不被遮罩挡住 | 对照上游 `layerHost.ts` 和 `modalOutlet.ts`。我们用 Vue 的 `Teleport`，或者原生 `popover` 属性，要确保在 Dialog 内部打开时，浮层挂在 Dialog 里 |
| 文字和结构重置 | #5064、#6457、AST-038、#5507 | 浮层不继承外部文字样式 | 给浮层根元素加重置样式。写在 `packages/core/styles/` 下的 layer 样式文件里 |
| 点一下打开 | #5248 | 触屏上点一下打开 Tooltip 或 HoverCard | 写一个 `useTouchTrigger` composable，可以复用 B3 的交互模态。**Tooltip 和 HoverCard 组件的接入交给 C7** |
| 容器内边距边界 | #5231、#7287、#684b56d19 | 浮层内部不受外面容器内边距的影响 | 在浮层根元素上把容器内边距相关的变量重置掉。具体是哪些变量，先在我们代码里 grep `container` 相关的 CSS 变量 |
| 并发 show/hide | #6941 | 快速切换两个 Popover 时不出错 | 在关闭栈里处理「上一个还在显示或隐藏的过程中，下一个又要显示」的情况 |
| 引用稳定 | #5267、#5272 | 没有多余的重新计算 | 让 `useLayer` 返回的东西引用稳定 |
| 纯文档或流程 | #5741、#6067、#6386、#6485、#6503、#6261、#6629 | — | 读懂规则，在实现里遵守。台账里标「已采纳：体现在 xxx」或「不适用」 |
| lab 和其它节点 | #6073 Drawer、#6184 BottomSheetSwitcher、#5881 交互模态 | — | Drawer 标「交给 F3c」，BottomSheetSwitcher 标「交给 C8」，交互模态标「B3 已完成」 |

## 有没有更适合 Vue 的做法

| 上游怎么做 | 我们怎么做 | 为什么效果一样 |
| --- | --- | --- |
| React context 加模块级的栈 | 模块级单例数组存栈（服务端渲染时不碰 document），再用 `provide`/`inject` 传递层级上下文 | 关哪一层的结果一样 |
| `createPortal` 挂到 host | Vue `Teleport`，目标由 `inject` 来的最近的「浮层挂载点」决定，默认是 body | 浮层实际出现在 DOM 的位置一样 |
| StyleX 写重置样式 | 在 `packages/core/styles/` 里写普通 CSS 类 | 计算样式一样 |

## 任务范围

要改的：

- `packages/core/src/layer/**`
- `packages/core/src/LayerProvider/**`
- `packages/core/src/composables/useLayer.ts`、`useDismiss.ts`
- 新增 `useTouchTrigger`
- 浮层的公共样式（`packages/core/styles/` 下和 layer 相关的文件）
- 相关测试
- 文档站 LayerProvider、useLayer 的文档页（`apps/docs/docs/{zh,en}/components/layer-provider/`、`use-layer/`，以实际目录为准）

不碰的：

- 各个浮层组件自己的行为（Tooltip、HoverCard 的点一下打开，Popover 圆角等），交给 C7。
- BottomSheet 交给 C8，菜单交给 C6。
- 例外：`useDismiss` 改成走关闭栈以后，现有调用方要保证仍然能工作，必要时做最小修复。
- 不碰 B1 的 Theme、B3 的 composables/internal，B5 正在改的 locale 和 Icon。
- 生成文件只能用 `pnpm sync` 生成。

## 开发步骤

一步一步做，每一步做完都跑一次相关测试，通过了再进下一步。

1. **盘点**：把台账 29 条归到上面的类别里，写进回报草稿。
2. **关闭栈**
   1. 新建 `packages/core/src/layer/dismissStack.ts`，导出这些：
      - `pushLayer(entry)`：返回一个函数，调用它就把这一层从栈里移除。
      - `isTopLayer(id)`
      - 一个全局的 document 监听器。它只处理 Escape 和 pointerdown，并且只在栈不空时才挂上去。
      - 每个 entry 包含：`id`、根元素 getter、触发器元素 getter、`onDismiss`，以及「点外面是否关闭」和「Escape 是否关闭」两个开关。
   2. 规则（参考上游 `layerStack.ts` 和 `useLayerDismissal.ts`）：
      - Escape 只交给栈顶那一层。
      - pointerdown 从栈顶往下找：点在某一层里面，就关掉它上面的所有层，这一层本身不关。点在所有层外面，就关栈顶这一层。
      - **点在栈顶那一层自己的触发器上，不算点外面**，这样触发器自己会处理开关。
   3. 改 `useDismiss.ts`：让它内部调用 `pushLayer`，对外的签名尽量保持不变。如果不得不改签名，就去改调用方。
   4. 写测试 `dismissStack.test.ts`，至少覆盖以下 6 个场景：
      - 两层叠着，按 Escape 只关上层。
      - 点上层里面，什么都不关。
      - 点下层里面，只关上层。
      - 点外面，只关栈顶。
      - 点栈顶的触发器，不关（交给触发器处理）。
      - 卸载以后从栈里移除，监听器也被移除。
   5. 照上游 `layerDismissalInvariants.test.tsx` 再挑 3 条不变量，改写成 Vue 测试。
3. **视口内边距**：对照上游 `layerInset.ts`，看我们的 `LayerProvider/inset.ts` 缺什么就补什么。让 `layer/position.ts` 在计算位置时把内边距算进去，并写测试：浮层靠近视口边缘时，位置会被推开到内边距之内。
4. **挂载位置**：
   1. 新建一个「浮层挂载点」的 provide 和 inject。Dialog 打开时由 Dialog 提供它，浮层组件用 `Teleport` 时优先挂到这个挂载点，没有的话挂到 body。
   2. 这一步需要改 Dialog 组件，在 Dialog 内容区 `provide` 挂载点。只改这一处，这样能实现 #7172。
   3. Toast 在 Dialog 之上（#7238）：先在浏览器里确认现在是否已经满足（打开一个 Dialog，再触发一个 Toast，看 Toast 能不能点）。如果不满足，在 ToastViewport 做最小修改；修改很大的话，就交给 C7。
5. **文字和结构重置**：在浮层根元素加 `astryx-layer` 类，或者用现有的类名，重置 `font-size`、`font-weight`、`line-height`、`color`、`text-align`、`letter-spacing`、`white-space` 等属性。具体清单照上游 `layerTextReset.stylex.ts`。写测试或者在浏览器里实测：在一个加粗的大标题里打开 Popover，Popover 里的文字不是粗体。
6. **容器内边距边界**：把浮层根元素上那些容器内边距相关的变量重置掉。
7. **useTouchTrigger**：参照上游 `useTouchTrigger.ts` 实现，并写测试。组件接入交给 C7。
8. **并发 show/hide**（#6941）：在栈或 `useLayer` 里处理这种情况，并写测试。
9. 跑 `pnpm sync`。
10. **台账**：29 条全部改成 `- [x]`，并写清结论。

## 自测要求

1. 两种 NODE_ENV 下，下面这些测试都全部通过，用例数相同：
   `pnpm vitest run --maxWorkers=2 packages/core/src/layer packages/core/src/LayerProvider packages/core/src/composables`
2. 所有用到 `useDismiss` 的组件，测试都通过：Selector、DropdownMenu、ContextMenu、Popover、TabList、NavMenu、PowerSearch、Chat、TimeInput、Typeahead。
3. E3 的交互契约、SSR 冒烟测试都通过。
4. 完整的 `env -u NODE_ENV pnpm check` 通过，其中 test 一步换成 `pnpm vitest run --maxWorkers=2`。
5. **浏览器实测**（只开一个浏览器，套上锁），用 Playwright 写一个小脚本，在文档站上逐项操作：
   1. 打开 Dialog 页，在 Dialog 里打开一个 Selector 或 DropdownMenu，按 Escape，确认只有菜单关闭、Dialog 还在；再按 Escape，Dialog 才关闭。如果文档站上没有现成的「Dialog 里套菜单」示例，就用 `page.evaluate` 或临时页面搭一个。
   2. 打开 Popover，点它的触发器，Popover 关闭，并且不会闪一下又打开。
   3. 把视口调到 390px 宽，打开一个靠右边的 Popover，确认它的右边缘离视口右边至少有内边距那么远。
   4. 打开 Dialog 后触发一个 Toast，确认 Toast 显示在 Dialog 上面，而且能点到。
   5. 截图保存到 `.agents-work/upstream-sync-0.7.1/nodes/B4/evidence/1/`。
6. `pnpm visual Popover`、`Tooltip`、`Dialog`、`DropdownMenu` 各跑一次，输出到 `/tmp/B4-after`。再和改动之前跑的版本（`/tmp/B4-before`，**动手前先跑**）比较 `ours.png`。预期只有浮层文字重置带来的差别，或者完全没有差别，所有差别都要解释清楚。
7. 新写和改动的源码文件不超过 500 行。

## 提交与回报

- 在分支上提交，提交信息用中文，可以分几次提交，不要推送。
- 回报写到 `/Users/shenqingchuan/workspace/astryx-vue/.agents-work/upstream-sync-0.7.1/nodes/B4/impl-1.md`，格式照 `templates/impl-report.md`。另外写清楚以下几项：
  1. 台账归类结果。
  2. 关闭栈的规则，以及和上游的对照。
  3. `useDismiss` 签名有没有变化，调用方改了哪些。
  4. 「交给 Cx」清单，按 C 节点分组，写到 C 节点能照着做的程度。
  5. 浏览器实测的结果和截图路径。
- 最终回复用中文，300 字以内。

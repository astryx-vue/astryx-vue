# B4 浮层运行时 Layer · 第 1 轮实现回报

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/B4`，分支 `sync/b4-layer`。只在本地提交，没有推送。
- 提交（基于 `7473170`）：
  - `6e963f4` feat(layer): 浮层运行时追到上游 v0.7.1——共享关闭栈、视口内边距、Dialog 内挂载、文字重置、点一下打开
  - `9cda1d4` docs(layer): B4 台账 29 条全部处理并写明结论

## 1. 做了什么

按计划「开发步骤」：

1. **盘点**：台账 29 条归类结果见第 4 节，结论已写进分支里的 `ledger/B4.md`。
2. **关闭栈**
   - 新增 `packages/core/src/layer/dismissStack.ts`。导出 `pushLayer(entry)`（返回摘除函数）、`isTopLayer(token)`、`resetDismissStackForTests()`。
   - document 上只挂一套监听：`pointerdown`（捕获）和 `keydown`（冒泡），栈空了就摘掉，服务端不碰 DOM。
   - 排序用三条线索：登记顺序（同一身份 `token` 只认第一次拿到的 `seq`，重新登记不插队）、容器互相包含（DOM 上包着别人的在上）、两两比较求最大值（不用 `sort`，比较器是偏序）。
   - `useDismiss` 重写为「`isEnabled` 变真就登记，变假/销毁就摘掉」，对外签名不变（含 `onEscape`）。
   - 测试 `layer/dismissStack.test.ts` 18 条。
3. **视口内边距**：`position.ts` 原本就按 `LayerProvider` 的 gutter 夹紧，这次补上上游的嵌套语义——内层 `LayerProvider` 声明了 `inset` 时，只收紧它子树里的锚定浮层，toast 视口仍看最外层；`LayerProvider.test.ts` 加了 2 条（嵌套收紧、根 toast 不变）。`computeLayerPosition` 的 gutter 用例原本就有（靠边被推开到内边距之内），保留。
4. **挂载位置**
   - 新增 `layer/mount.ts`：`layerMountKey`、`provideLayerMountTarget`、`resolveLayerMountTarget`（上游 layerHost 的「不能挂进去的祖先」清单，走到最近的 `<dialog>` 停）。
   - 新增公开 composable `composables/useLayerMountTarget.ts`（`useLayerMountTarget`、`useLayerTeleportTarget`）。
   - `Dialog.vue` 在对话框里渲染 `<div class="astryx-dialog__layer-host">` 并 `provide` 它；`dialog.css` 里这个挂载点 `display: contents`，不参与布局。
   - `usePositionedLayer` 返回值新增 `teleportTarget`；Popover、Tooltip、HoverCard、DropdownMenu(+SubMenu)、ContextMenu(+SubMenu)、TabMenu、Selector 的 `<Teleport to="body">` 改成 `:to="teleportTarget"`。
   - Toast 在 Dialog 之上（#7238）：新增 `layer/modalOutlet.ts`（模块级「最新打开的模态对话框」清单），Dialog 打开时登记、关闭或原生 `close` 事件时摘掉；`ToastViewport` 的 `Teleport` 目标改成这个清单里最新的对话框，没有就 `body`。
   - 测试：`layer/mount.test.ts` 7 条、`Toast/ToastViewport.modalOutlet.test.ts` 2 条、`Dialog.test.ts` 新增 2 条。
5. **文字重置**：新增 `packages/core/styles/layer.css`（`pnpm sync` 已汇总进 `styles.css`）。规则写在 `:where(.astryx-layer, .astryx-popover, .astryx-tooltip, .astryx-hover-card, .astryx-dropdown-menu-popover, .astryx-dropdown-menu, .astryx-context-menu, .astryx-tab-menu-dropdown, .astryx-selector-listbox)` 上，优先级 0：组件自己的字号、颜色照旧赢，只切断从外面继承来的排版。
6. **容器内边距边界**：同一份 layer.css 里把 `--container-padding-*` 归零、`--layout-padding-*` 和 `--_section-padding-propagated` 还原为 `initial`。
7. **useTouchTrigger**：新增 `packages/core/src/composables/useTouchTrigger.ts`（导出了 `isActionTrigger`、`LayerTouchTrigger`、`UseTouchTriggerOptions`、`UseTouchTriggerReturn`），复用 B3 的 `internal/interactionModality`；测试 17 条。组件接入交 C7。
8. **并发 show/hide**（#6941）：`useLayer` 在关闭过程中收到的 `show()` 排到微任务，随后的 `hide()` 取消它；`useLayer.test.ts` 加了 2 条，另加 1 条「引用稳定」。
9. 跑了 `pnpm sync` 和 `pnpm --filter @astryx-vue/cli generate`。
10. 台账 29 条全部 `[x]`，每条写了结论。

| 文件 | 行数 | 职责 |
| --- | --- | --- |
| layer/dismissStack.ts | 241 | 全局关闭栈：排序、Escape、点外面、按压编号 |
| layer/dismissStack.test.ts | 329 | 关闭栈的 6 个场景 + 3 条不变量 + 边界 |
| layer/mount.ts | 127 | 浮层挂载点的 provide/inject、不能挂的祖先清单 |
| layer/mount.test.ts | 102 | 挂载点解析与 teleport 目标 |
| layer/modalOutlet.ts | 50 | 最新打开的模态对话框清单（toast 用） |
| layer/usePositionedLayer.ts | 105 | 新增 `teleportTarget` |
| composables/useDismiss.ts | 76 | 改为登记进关闭栈（签名不变） |
| composables/useLayer.ts | 212 | 并发 show/hide 排队与取消 |
| composables/useTouchTrigger.ts | 241 | 触屏点一下打开 |
| composables/useTouchTrigger.test.ts | 231 | 触屏行为用例 |
| composables/useLayerMountTarget.ts | 27 | 公开的挂载点 composable |
| Toast/ToastViewport.modalOutlet.test.ts | 68 | toast 进出模态框 |
| styles/layer.css | 70 | 文字与内边距重置 |

改动过的源码文件全部在 500 行以内，`check-line-limit` 通过（DropdownMenu 516 行、Selector 583 行都比白名单记录的更短）。

## 2. 和上游的对照

| 上游改动 | 上游怎么做 | 我们怎么做 | 为什么效果相同 |
| --- | --- | --- | --- |
| #4881 共享关闭栈 | `layerStack.ts` 只处理 Escape，document 上一条监听；点外面靠原生 `popover="auto"` 的 light dismiss | `dismissStack.ts` 一套监听同时管 Escape 和 pointerdown，两种关闭共用同一个栈顶判定 | 一次按键/一次点外面都只关最上面一层；用户看到的顺序一样 |
| 栈的排序 | 深度（React 树）+ DOM 包含 + 登记序号，`token` 固定 `seq` | 没有 React 树深度，用容器包含 + 登记序号（`token` 同样固定 `seq`），两两比较求最大 | 我们的浮层都在打开时登记，登记顺序就是打开顺序；Dialog 里开菜单时容器包含关系也会给出同样的顺序（浏览器实测第 1 项） |
| `escapeBehavior: 'close' | 'block'` | bool + 三态枚举 | 我们保留 `dismissOnEscape` 布尔（`enableEscape: false` 就是「不吃这个键，让给下面」），和上游 `'block'` 的区别写进了注释 | `'block'` 用在我们还没有的 `purpose="required"` Dialog 上（Dialog 走原生 `cancel`），所以没引入 |
| IME 拼字中的 Escape | 声称按键但不关闭 | 一样：`isImeKeyEvent` 命中就 `preventDefault` 且不关层 | 半成品拼字不会被一次按键清掉 |
| #5004/#5018 触发器与点外面打架 | 手势计数器 `wasJustDismissed`，把关闭那次手势的 click 吸收掉 | 点栈顶自己的触发器直接不算点外面；再加「本次按压里才登记的层不被本次按压关掉」 | 触发器自己那一下开关照常执行，不会被点外面抢走，也不会闪开（浏览器实测第 2 项连续采样） |
| #5039 layerHost | `resolveLayerPortalTarget` 往上找，遇到 dialog 停 | 照抄规则（`layer/mount.ts`） | 结果一样：返回最近的安全祖先，找不到就原地渲染 |
| #7172 Dialog 内挂载 | sentinel `<template>` 标位置 + `createPortal` | Dialog `provide` 内部挂载点，浮层 `Teleport` 优先挂过去，没有就 `body` | 浮层仍在原生模态层里，不被遮罩挡住、焦点不逃出（浏览器实测第 1、4 项） |
| #7238 Toast 在 Dialog 之上 | `modalOutlet` 模块级清单 + 全局宿主跟最新模态框 | 同样模块级清单，用 Vue 的 `shallowRef` 通知 `ToastViewport` 改 `Teleport` 目标 | toast 进到对话框里，`elementFromPoint` 命中的是 toast 自己（浏览器实测第 4 项） |
| #5064/#6457/AST-038 文字重置 | StyleX `layerTextReset` | `styles/layer.css` 的 `:where(...)` 普通 CSS，0 优先级 | 计算样式一致：粗体大标题里的浮层是 400 字重、`letter-spacing: normal`、`text-transform: none`、`text-align: start`（浏览器实测第 5 项） |
| #5231/#7287 容器内边距 | `overlayPaddingReset`：两族变量相反处理 | 同一份 layer.css，同样的「归零 / 还原」两族 | 浮层里的 Divider、Layout 不再按外面的内边距做负边距 |
| #6919/AST-059 视口内边距 | 用 CSS 变量 + `env()` 表达 gutter，浮层写内联变量 | 用 JS 量（`gutter.ts`）算进坐标，`inset` 由 provider 解析；嵌套 provider 声明 inset 时只收紧子树 | 落点一致：靠边的浮层被推开到内边距之内（浏览器实测第 3 项，390px 宽下右边留 31px > 16px） |
| #5248 点一下打开 | `useTouchTrigger` + 交互模态钩子 | 照上游行为实现，交互模态直接复用 B3 的模块级单例 | `auto` / `tap` / `none` 三态的判定和 `isActionTrigger` 的规则一致 |
| #6941 并发 show/hide | 原生 Popover API 在操作进行中会抛错，所以把 `show()` 排微任务重放 | 我们不用原生 Popover API，只保留「同一个浮层在关闭过程中被要求重新打开」这一种排队 + 可取消 | 上游那两条测试的等价场景：关闭时焦点回到触发器、触发器上的浮层要被唤醒，行为一致（`useLayer.test.ts`） |
| #5267/#5272 引用稳定 | `useMemo`/`useCallback` | 不需要：Vue composable 每个作用域只建一份返回值 | 补了一条引用稳定性测试 |

关闭栈的具体规则（写进代码注释，也写在这里）：

- Escape：只交给「最上面那一层」。`dismissOnEscape: false` 的层不认领这个键，往下找第一个认领的层。命中就 `preventDefault`（同时压掉浏览器自己的关闭请求，例如原生 dialog 的 `cancel`）。
- pointerdown：先看栈顶自己的触发器，点在它上面什么都不关（交给触发器开关）。否则从上往下找，点在某一层里面就只关它上面那些层；点在所有层外面只关栈顶那一层。
- 本次按压里才登记进来的层（`bornPress`）不参与这次按压的判定，避免「按下就打开」的浮层被同一次按压关掉。
- 登记了但 `isPresent()` 返回假的层会被跳过。

## 3. 和计划不一样的地方

1. **`useDismiss` 签名没变**，调用方一个都没改。计划说「必要时改调用方」，实际不需要。
2. **`useFocusTrap` 没改**。原本担心 Dialog 的焦点陷阱和关闭栈抢同一个 Escape，实测不需要：Dialog 的 Escape 走的是原生 `<dialog>` 的 `cancel` 事件（`useFocusTrap` 在 Dialog 里没传 `onEscape`），而关闭栈命中时会 `preventDefault`，把这次关闭请求压掉。浏览器实测第 1 项证实一次 Escape 只掉一层。
3. **没有做 `LayerTeleport` 包装组件**。我先写了这个组件（把「挂到哪」收成一个组件），结果它让 `document.body.innerHTML = ''` 这类测试清理 + 自动卸载的组合在 Vue 卸载阶段崩掉（`Cannot read properties of null (reading 'nextSibling')`，浮层所在组件的根是片段时触发）。改成各组件直接 `<Teleport :to="teleportTarget">`，`teleportTarget` 从 `usePositionedLayer` 或 `useLayerTeleportTarget()` 取，问题消失，也少一层组件。
4. **上游 `clampInlineSize` 没搬**。我们的浮层宽高上限一律写在各自 CSS 里（`calc(100vw - 16px)` 这类），没有上游那种「消费方的 width 规则压过视口上限」的入口，搬过来是没有调用者的死代码。
5. **`layerStructureReset` 只搬了一半**。上游重置 `--step-connector-gap`；我们的 `stepper.css` 里没有这个继承通道（grep 无结果），所以 layer.css 里没有这一条，理由写进了台账。
6. **`layerScopedContext` 没搬**。上游用它把 surface 级 React context 整值重置；我们的浮层组件不用 context 承载 surface 成员关系，没有可截断的东西（台账 #6457 已写明）。
7. **Selector / MultiSelector 的列表浮层**：Selector 已接 `teleportTarget`（用文件里已有的 `computed` 顺手改，没加行数）；MultiSelector 的写法一样但不在 B4 范围（交 C3），它仍挂 `body`。
8. **DropdownMenu.vue / Selector.vue 贴着行数上限走**：这两个文件已在白名单里（517 / 584 行），为了不越线，我把新增的注释和中间变量压到最少（现在是 516 / 583 行，都比记录更短）。

## 4. 台账处理

一共 29 条：**已采纳 10 条、部分采纳 2 条、交给其他节点 4 条、不适用 13 条**（10 + 2 + 4 + 13 = 29）。每条的理由写在分支里的 `ledger/B4.md` 条目下面。

| 类别 | 条目 |
| --- | --- |
| 已采纳（10） | #4881 `47d5160dc`、#6919 `d45599cb8`、#5064 `77b013d2a`、#5231 `4aacbbedc`、#5004/#5018 `009bcb37f`、#6941 `d4d2151b8`、#7172 `fcf255b26`、#7238 `4607f2fbc`、#5248 `5d8ece19c`、#5881 `de72688e7` |
| 部分采纳（2） | #5039 `5db7f15bd`：`resolveLayerMountTarget` 已实现并测过，组件侧要不要按 sentinel 的方式接入交 C7。#7167 `5c3d45821`：栈相关（`onEscape` 逐层退栈、`ContextMenuSubMenu` 的挂载点）已采纳，触发器事件和嵌套层次的其它行为交 C6 |
| 交给其他节点（4） | #6184 `65dedfe9d` → C8、#6073 `189056a43` → F3c、#7225 `516c4541c` → C8、#6950 `2710a135a` → C4 |
| 不适用（13） | #5267 `540f19e62`、#5272 `f67544e1c`（Vue 的返回引用天生稳定）、#5507 `bdbda6dc4`（StyleX 的 xstyle 优先级语义）、#7287 `684b56d19`（我们的 Stepper 没有那条结构变量）、#6457 `4ec26d757`（文字重置已采纳，`layerScopedContext` 那半不适用）、以及 8 条上游文档/规范/审阅流程：`397e0c68b`、`a9f6cf4a8`、`176dfa624`、`6ef7b746a`、`3ee796ccc`、`17044ab1e`、`0788c49ae`、`f37274447` |

## 5. 自测结果

| # | 自测项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | `pnpm vitest run --maxWorkers=2 packages/core/src/layer packages/core/src/LayerProvider packages/core/src/composables`，两种 NODE_ENV 各一遍 | 过 | 都是 54 个文件、458 条用例 |
| 2 | `NODE_ENV=production pnpm vitest run --maxWorkers=2`（全量） | 过 | 243 个文件、3273 条用例，和开发模式用例数相同 |
| 3 | 全量测试（开发模式） | 过 | 243 个文件、3273 条用例（含 Selector、DropdownMenu、ContextMenu、Popover、TabList、NavMenu、PowerSearch、Chat、TimeInput、Typeahead 等全部 `useDismiss` 调用方） |
| 4 | E3 交互契约 + SSR 冒烟 | 过 | 在 3 的全量里；`known-failures.ts`、`ssr-known-failures.json` 没有改动 |
| 5 | `env -u NODE_ENV pnpm check`（test 换成 `vitest run --maxWorkers=2`） | 过 | check:packages / lint / typecheck / vitest / build:packages / docs:build / lint:pkg 全部退出码 0 |
| 6 | 浏览器实测（套 browser-lock，同一时刻只开一个浏览器） | 11/11 过 | 见下 |
| 7 | 视觉对照 | 过 | 13 个「改动前后都截到」的组合全部 **0 像素差**，见下 |
| 8 | 单文件不超过 500 行 | 过 | `check-line-limit` 通过 |

### 浏览器实测

脚本 `.agents-work/upstream-sync-0.7.1/nodes/B4/evidence/1/browser-check.mjs`，被测页面是同目录下的 `harness/`（Vite + 直接引用 core 源码，未提交，被 gitignore；跑之前用 `vite --port 5199` 起服务）。结果 `evidence/1/results.json`，截图是同目录下的 `1-*.png` ~ `6-*.png`。命令：

```
node scripts/swarm/browser-lock.mjs run --purpose B4 -- node .agents-work/upstream-sync-0.7.1/nodes/B4/evidence/1/browser-check.mjs
```

| # | 操作 | 期望 | 实测 |

| # | 操作 | 期望 | 实测 |
| --- | --- | --- | --- |
| 1 | Dialog 里开 DropdownMenu，按 Escape | 只关菜单，Dialog 还在 | 过（`1-dialog-menu-open.png`、`1-dialog-after-first-escape.png`） |
| 1b | 再按一次 Escape | Dialog 关掉 | 过（`1-dialog-after-second-escape.png`） |
| 1c | 菜单打开时检查 DOM 位置 | 菜单在 `<dialog>` 里面 | 过 |
| 2 | 点 Popover 触发器关闭 | 关掉后 12 次采样都保持关闭，不闪开 | 过（`2-popover-closed-after-trigger.png`） |
| 3 | 390px 宽，靠右的 Popover | 右边缘离视口右边 ≥ 16px | 过，实测留 31.1px（`3-narrow-edge-popover.png`） |
| 4 | Dialog 打开时触发 toast | toast 在 Dialog 里面、能点到 | 过（`insideDialog: true`、`hitTestInside: true`，`4-toast-above-dialog.png`） |
| 5 | 在 30px/800 粗体、3px 字距、大写的标题里开 Popover | 浮层文字是 400 字重、`letter-spacing: normal`、`text-transform: none`、不居中 | 过（`fontWeight: 400`、`letterSpacing: normal`、`textTransform: none`、`textAlign: start`，`5-text-reset.png`） |
| 6 | 触屏（390px + hasTouch）点一下 Popover 触发器 | 浮层打开 | 过（`6-touch-tap-popover.png`） |

### 视觉对照

`pnpm visual <组件> --out /tmp/B4-after/<组件>`，和改动前的 `/tmp/B4-before` 比 `ours.png`（pixelmatch，阈值 0.1）。

| 组件 | 组合 | 结果 |
| --- | --- | --- |
| Dialog | desktop-light / desktop-dark / mobile-light / mobile-dark | 全部 0 像素差 |
| DropdownMenu | desktop-light / desktop-dark / mobile-light / mobile-dark | 全部 0 像素差 |
| Popover | desktop-light / mobile-dark | 0 像素差 |
| Tooltip | desktop-light / mobile-dark / mobile-light | 0 像素差 |

说明：上游站点多次 `page.goto` 超时（60s），所以每次只截到一部分组合；上面列的每一行都是「改动前」和「改动后」都截到了的组合，逐像素比较。其余组合缺一边，没法比，缺失清单在 `/tmp/B4-before/run.log`、`/tmp/B4-after/run.log`、`/tmp/B4-after/run2.log`。文档站这几个组件页在默认状态下没有展开的浮层，所以 0 像素差是符合预期的——文字重置的实际效果由下面「浏览器实测」表里的第 5 行覆盖。

## 6. 拿不准的地方

1. **Selector / MultiSelector 的列表浮层**：Selector 已接 Dialog 内挂载点，MultiSelector 没接（不在 B4 范围）。MultiSelector 在 Dialog 里打开时列表还会挂在 `body`，被遮罩挡住。接入方法见第 7 节。
2. **`text-align: start` 的取舍**：`layer.css` 里把对齐重置成 `start`。如果某个浮层原来故意继承触发器的居中排版，改完会变成左对齐（上游就是这么做的，AST-038）。验收时值得在右侧对齐（RTL）下再看一眼。
3. **`useLayer` 的并发排队只覆盖「同一个浮层」**。上游还覆盖「另一个浮层的关闭过程中要打开」——那是因为原生 Popover API 会抛错；我们不用这套 API，两者同时发生也不会有异常（Vue 状态各自独立）。如果验收者希望看到上游那种「跨浮层的操作门」，需要另开任务。
4. **toast 进 Dialog 之后的生命周期**：`Teleport` 目标在「对话框打开/关闭」时会变化，Vue 会移动节点，toast 的组件状态和动画在这期间是否会有闪动，只验证了「能看见、能点到」和单元测试（进出各一次）。极端情况（对话框在 toast 退场动画中途关闭）没有专门验证。
5. **视觉对照的缺失组合**：上游站点超时导致 4 个组合没有「改动前」的图（Popover desktop-dark、Popover mobile-light、Tooltip desktop-dark 等）。若需要完整对照，需要网络好时重跑一次基线。

## 7. 交给 C 节点的接入清单

### C3 选择器家族（MultiSelector、Typeahead）

- MultiSelector 的列表浮层：`const { teleportTarget } = usePositionedLayer(...)`，模板改成 `<Teleport :to="(isSheet && sheetSlot) ? sheetSlot : teleportTarget">`（和已经改好的 `Selector.vue` 一样）。
- Typeahead：`useAnchoredListbox` 里已经调 `usePositionedLayer`，把 `teleportTarget` 一并返回给 `BaseTypeahead.vue`，替换 `<Teleport to="body">`。

### C4 搜索类（CommandPalette、PowerSearch）

- CommandPalette 已经用 `useDismiss`，自动进关闭栈；不用改。
- `PowerSearch.vue` 的 `<Teleport to="body">` → `teleportTarget`（同上）。PowerSearch 自己的 Escape 监听如果还在，删掉，交给关闭栈。

### C6 菜单家族（DropdownMenu、ContextMenu、MoreMenu）

- DropdownMenu / DropdownMenuSubMenu / ContextMenu / ContextMenuSubMenu 的关闭栈和挂载点都接好了，不用再动。
- MoreMenu 的两处 `<Teleport to="body">`（`MoreMenuPanel.vue` 两处、`MoreMenuSheet.vue` 一处）改成 `teleportTarget`。
- 把 `DropdownMenuSubMenu`、`PowerSearchEditPopover` 自己那套 Escape 监听迁到关闭栈（上游 `useLayerDismissal` 的注释里点名了这两个）。
- 菜单的 `onEscape` 逐层退栈行为要保留（现在就是这么用的）。

### C7 浮层家族（Popover、Tooltip、HoverCard、Dialog、Lightbox、MobileNav、Toast）

- **Tooltip / HoverCard 接 `useTouchTrigger`**（#5248）：`const touch = useTouchTrigger({ touchTrigger: () => props.touchTrigger, isOpen, layerId: layer.id, triggerRef, show, hide })`；触发器上 `@pointerenter="touch.handlePointerEnter" @pointerdown="event => touch.handlePointerDown(event)"`，`handlePointerDown` 返回 true 时跳过自己的按下逻辑；其它关闭路径调 `touch.clearTapOpen()`。
- `Chat/ChatTriggerMenu.vue`、`TimeInput/TimeField.vue`、`Tokenizer/Tokenizer.vue`、`NavMenu/NavDisclosure.vue` 的 `<Teleport to="body">` 改成 `teleportTarget`。
- `resolveLayerMountTarget` 已经实现但还没有调用者：如果某个浮层要挂在「不能挂进去的祖先」之外（例如触发器在一个 `<p>` 或 `<a>` 里），需要浮层组件拿到自己的渲染位置（可以渲染一个空 `<span ref>` 当标记），再把它传给 `resolveLayerMountTarget`，返回值盖掉 `teleportTarget`。
- 结构重置（`--step-connector-gap` 那类）：我们的 Stepper 没有这条继承通道，不需要；将来若新增这类「祖先给自己后代用」的结构变量，要在 `layer.css` 里按名字逐个截断（不要按前缀）。

### C8 BottomSheet、BottomSheetSwitcher（#7225、#6184）

- BottomSheet 现在自己用焦点陷阱处理 Escape。改成 `useDismiss({ container, isEnabled: isOpen, onDismiss: close, enableEscape: ref(true) })`，或者直接 `pushLayer({ token, getContainer, dismissOnEscape: true, dismissOnPointerOutside: false, onDismiss })`（模态面板不该被点外面关掉）。
- `isPresent` 用在「打开状态比 DOM 慢一帧」的场景；BottomSheet 打开时才登记，可以不传。
- BottomSheetSwitcher 切换面板时用同一个 `token` 重新登记，顺序不会插队。

### F3c Drawer

- 同上：`pushLayer` + `dismissOnEscape: true`；拖拽关闭（swipe）不在栈的模型里，需要自己判断 `isTopLayer(token)` 再关。

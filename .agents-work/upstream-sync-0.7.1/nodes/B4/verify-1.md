# B4 验收报告 · 第 1 轮

结论：不通过（计划 19 项里过 17 项；第 4、16 项不过；另有 2 条计划外的补充发现也不过）

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/B4`，分支 `sync/b4-layer`，提交 `9848edd`（实现者的两个提交是 `6c8baa4`、`9848edd`）。
- 比较基点：`BASE = ab335779bca8f2349bc22cfc1610bf8197c28dc8`（`git merge-base HEAD swarm-tree`，等于 `HEAD~2`）。
- 临时文件和截图：`/tmp/verify-B4/`。浏览器脚本和测试页（`harness/`、`check.mjs` 等）都是我自己写的，没有用实现者的产物。BASE 对照用 `git archive` 导出到 `/tmp/verify-B4/base/`。
- 只读检查：开始时 `git status` 为空，结束时也为空，两次相同。
- 临时改动（全部已还原，还原后 `git status` 为空）：
  - 第 9 项：改 `dismissStack.ts` 的 Escape 分发，跑完用备份还原。
  - 第 10、15 项和补充发现 2：在 `packages/core/src/layer/` 下放过 3 个临时测试文件，已删除。
  - 第 13 项：`git checkout BASE -- packages/core` 截 BASE 图，再 `git checkout HEAD -- packages/core` 还原。
- 浏览器：每次都通过 `browser-lock.mjs run --purpose B4-verify` 或 `pnpm visual ... --out /tmp/verify-B4/...` 开，同一时刻只开 1 个。中途 B1、B5 占着两个锁，我排队等，没有碰它们的锁。文档站只用 5172 端口，收尾时端口没有监听，没有残留浏览器。
- 并行与 NODE_ENV：vitest 全部加 `--maxWorkers=2`，测试和构建都加 `env -u NODE_ENV`，测试项在 unset、`production`、`development` 三种下各跑一遍。
- 上游：只读仓库 `/Users/shenqingchuan/workspace/astryx-upstream` 的 `v0.7.1` 标签。线上站点 `https://astryx.atmeta.com` 的组件页能打开，但 Toast 页的交互测试两次超时，所以上游的 Toast 动效没有在线上实测（见风险点 (b)）。

## 逐条结果

| # | 检查项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | Escape 只关最上面一层 | 过 | 在 Dialog 里分别开 DropdownMenu 和 Selector。第 1 次 Escape：菜单不可见，Dialog 还开着。第 2 次：Dialog 关闭。两种菜单都不报错（`check.mjs`，结果在 `/tmp/verify-B4/b4/results.json`）。BASE 上同样操作也是对的，所以 B4 在这一项上不是修 bug，是把行为改走共享栈，并且让菜单挂进了 Dialog 里。 |
| 2 | 点外面只关栈顶 | 过 | Dialog 里开着菜单时点 Dialog 里菜单外的文字，菜单关闭，Dialog 还开着（DropdownMenu 和 Selector 各一次）。BASE 同样是对的。 |
| 3 | 触发器不和自己打架 | 过 | 点触发器关闭 Popover，之后每 50ms 采样 7 次（350ms），全是关闭状态。再点一次，Popover 打开。 |
| 4 | 视口内边距 | **不过** | 普通宽度的浮层通过：390×844 下，260px 宽的 Popover 右边留 24px（≥16px）。但是宽度大于视口的浮层不过：给 Popover 设 `width=400`，在 390px 视口下实测 `left=16, right=390, width=374`，右边距为 0（`/tmp/verify-B4/huge.mjs`）。上游 AST-059 的约定是宽度上限为 `100vw − 左内边距 − 右内边距`（`layerViewportInset.maxInlineSizeFallback = calc(100vw - 16 - 16 - inset...)`，通过 `clampInlineSize` 给 Popover 的 `width`、DropdownMenu 的 `menuWidth` 套上）。我们的 CSS 只有 `max-inline-size: calc(100vw - 16px)`（`styles/popover.css:63`），只扣了一边的内边距，而且不跟 `LayerProvider` 的 `inset` 联动。所以超宽浮层会贴到视口右边。 |
| 5 | 浮层不继承外部文字样式 | 过（Popover、Selector 列表、DropdownMenu） | 对照 BASE，用一个有区分力的脚本（`reset.mjs`）：在 `body` 上设 `font-weight:700; font-size:32px; color:red; letter-spacing:4px; text-transform:uppercase; font-style:italic; text-align:center; line-height:50px; word-spacing:9px; text-shadow; white-space:nowrap; text-indent:20px`。BASE 的 Popover 和 Selector 列表继承了粗体、大写、字距 4px、居中、nowrap、缩进 20px。B4 上两者都是 `400 / normal / none / start / normal / 0px / 0px`，和上游 `layerTextReset` 的 15 个属性值一致。Dialog 里的 Popover 和菜单也一样。字号和颜色是组件自己的 CSS 在管，不是继承。覆盖面不足见补充发现 1。 |
| 6 | Dialog 内的浮层挂在 Dialog 里 | 过 | 菜单的父节点是 `.astryx-dialog__layer-host`，在 `<dialog>` 里。菜单项中心的 `elementFromPoint` 命中菜单自己。BASE 上菜单在 Dialog 外面（`inDialog:false`），命中的是 Selector 触发器，B4 把这个问题修好了。 |
| 7 | Toast 在 Dialog 之上 | 过 | Dialog 打开后触发 Toast：Toast 在 `<dialog>` 里，点击位置命中 Toast，能点它的关闭按钮，点完 Toast 消失，Dialog 仍然开着。BASE 上 `hitToast:false`（被遮罩挡住）。不报错。回报里没有把这一项交给 C7，是 B4 自己做完的。 |
| 8 | 关闭栈测试覆盖 6 个场景 + 3 条不变量 | 过 | 6 个场景：两层叠着只关上层（`两层叠着，按 Escape 只关上层`）、点上层里面不关（`点上层里面，什么都不关`）、点下层里面只关上层、点外面只关栈顶、点栈顶触发器不关、卸载后摘掉且监听也摘掉，都有对应测试。上游不变量（对照 `layerDismissalInvariants.test.tsx`）：一次 Escape 只掉一层（`三层叠着，按一次 Escape 只掉一层`）、重新登记不改顺序（`同一层重新登记不会插到后开的层上面`）、IME 拼字中的 Escape（`输入法拼字中的 Escape 什么都不关，但仍然吃掉按键`），另有「跳过不在屏幕上的层」。共 18 条。 |
| 9 | 反向检查 | 过 | 把「Escape 交给栈顶」临时改成「交给所有层」后，`dismissStack.test.ts` 有 4 条失败：`两层叠着，按 Escape 只关上层`、`三层叠着，按一次 Escape 只掉一层…`、`同一层重新登记不会插到后开的层上面`、`包里层的那一层算在上面…`。已还原，`git diff` 为空。 |
| 10 | 监听器只在栈非空时挂 | 过 | 临时测试用 `vi.spyOn(document, 'addEventListener' / 'removeEventListener')`：栈空时挂 0 个；第一层进栈挂 2 个（`pointerdown`、`keydown`）；第二层进栈不再挂；先摘一层不摘监听；摘完最后一层摘 2 个。两种 NODE_ENV 都过。临时文件已删。 |
| 11 | 并发 show/hide 有测试 | 过 | `useLayer.test.ts`：`关闭过程中来的 show 等关闭走完再打开`（在 `onHide` 里重新 `show()`，断言关闭生效后、微任务后才重新打开且 `onShow` 只调一次）、`排队中的打开会被随后的 hide 取消`。这两条测的是同一个浮层。上游的真实场景是跨浮层（A 的关闭把焦点还给触发器，触发器上的 Tooltip 立刻要显示），所以我自己用浏览器测了一遍，见偏离 (4)。 |
| 12 | `useTouchTrigger` 有测试 | 过 | `useTouchTrigger.test.ts` 17 条，包括 `opens an inert trigger on a finger tap`（`pointerType: 'touch'`，点一下打开）、`toggles a tap-opened layer shut on the next tap`、`closes a tap-opened layer when the next press lands outside`。 |
| 13 | 视觉对比 Selector、ContextMenu | 过 | 用 `pnpm visual selector/context-menu --out /tmp/verify-B4/vis-{b4,base}/...` 各截 B4 和 BASE。逐像素比较 `ours.png`（pixelmatch，阈值 0.1）：Selector desktop-light 912×513、mobile-dark 708×640、ContextMenu desktop-light 912×513、mobile-dark 708×640，差异像素全部为 0。看过 ContextMenu desktop-light 的图：浅色背景，菜单有 Edit / Duplicate / Delete 三行，右侧有说明文字，不是空白。 |
| 14 | E3 交互契约、SSR 冒烟测试，名单没有变长 | 过 | 都在全量 vitest 里通过。`known-failures.ts`、`ssr-known-failures.json` 不在 `git diff BASE --stat` 里，没有变。 |
| 15 | 服务端渲染不碰 `document` | 过 | 临时测试用 `// @vitest-environment node`，确认 `typeof document === 'undefined'`，动态 import `dismissStack`、`mount`、`modalOutlet`、`useDismiss`、`useTouchTrigger`、`useLayerMountTarget` 都不报错，还在 node 里 `pushLayer(...)()` 一次也不报错。两种 NODE_ENV 都过。 |
| 16 | 台账 29 条全打勾并写了结论，抽 5 条核对 | **不过** | 29 条全部 `[x]`，都有结论。抽查 #5248、#4881、#5039、#6941、#7238 的结论与代码一致。但抽查 #6919 和 #6457 时发现结论的理由站不住：#6919 写「`clampInlineSize` 不适用：宽高上限已经在各自 CSS 里按 `calc(100vw - 16px)` 封顶」，与第 4 项的实测矛盾。#6457 写「我们库里的浮层组件不走 context 提供 surface 成员关系，没有要截断的东西」，与补充发现 2 的实测矛盾。 |
| 17 | 「交给 Cx」清单 | 过 | 按 C3、C4、C6、C7、C8、F3c 分组。C7 这一组读过：写了 `useTouchTrigger` 的接入代码（绑定哪些事件、返回值怎么用）、4 个还写死 `to="body"` 的文件（`ChatTriggerMenu.vue`、`TimeField.vue`、`Tokenizer.vue`、`NavDisclosure.vue`），能照着做。我实测还有 `ButtonTooltip.vue`、`TableData.vue` 也是写死 `to="body"`，清单没列到（不影响本项）。清单里没有交给任何节点的补充发现 1、2，这两项见下面。 |
| 18 | 全量 vitest 两种 NODE_ENV + `pnpm check` | 过 | `env -u NODE_ENV pnpm vitest run --maxWorkers=2`、`NODE_ENV=production`、`NODE_ENV=development` 三次都是 243 个文件、3273 条通过，用例数相同。`pnpm check` 各步骤（test 一步已由上面三次代替）：`check:packages`、`lint`、`typecheck`、`build:packages`、`docs:build`、`lint:pkg` 退出码全部为 0。 |
| 19 | 源码不超过 500 行、没有越界改动 | 过 | 新增的 `dismissStack.ts` 241 行、`useTouchTrigger.ts` 241 行、`mount.ts` 127 行、`Dialog.vue` 257 行，都在限制内；`check-line-limit` 通过（`DropdownMenu.vue`、`Selector.vue` 在白名单里且比记录短）。`git diff BASE --stat` 里没有 Theme、`composables/internal`、locale、Icon。注意：Dialog 除了「提供挂载点」之外还多了约 25 行 `modalOutlet` 登记，这是 #7238（Toast 在 Dialog 之上）需要的，我认为合理。 |
| 补 1 | 文字重置的覆盖面（计划外，对照上游） | **不过** | 上游把 `layerTextReset` 用在 Dialog、Toast 视口、Lightbox、MobileNav、BottomSheet 的根上（`Dialog.tsx:709/745`、`ToastViewport.tsx:686`、`Lightbox.tsx:630`、`MobileNav.tsx:646`、`BottomSheetPanel.tsx:715`）。`layer.css` 的 `:where(...)` 名单里只有 9 个类，没有这些。实测（`bodytext.mjs`，外层设粗体、大写、字距 4px、居中、斜体）：`body` 里的 Toast 是 `700 / 4px / uppercase / center / italic`；`main` 里的 Dialog 内容也是 `700 / 4px / uppercase / center / italic`。Toast 搬进 Dialog 后反而是 `400 / normal / none / start / normal`（因为那时它在 Dialog 里面，而 Dialog 自己不继承外部）。 |
| 补 2 | 外层上下文泄漏进浮层（计划外，对照上游） | **不过** | 上游 `createLayerScopedContext` 让 ButtonGroup、FormLayout、AvatarGroup、CheckboxList、Collapsible、DropdownMenu、Chat、Icon 尺寸等十几种 context 在浮层里被整值重置，并在 `useLayer.tsx:1232/1293` 用 `LayerContentBoundary` 包住内容。Vue 的 `provide/inject` 沿组件树走、不看 DOM，Teleport 也挡不住。实测（临时测试）：`ButtonGroup size=lg` 里放一个 `Popover`，Popover 内容里的 `Button` 变成 `astryx-button secondary lg`，DOM 上它不在按钮组里（`closest('.astryx-button-group')` 为空）。把 `ButtonGroup` 设成 `isDisabled` 时，浮层里的 `Button` 也 `disabled=true`。用户能感知：禁用的按钮组里的 Popover，里面的按钮点不了。 |

## 对实现者偏离计划的判断

| 偏离 | 判断 | 理由 |
| --- | --- | --- |
| (1) Dialog 的 Escape 走原生 `cancel`，关闭栈命中就 `preventDefault`，不改 `useFocusTrap` | 合理 | 浏览器里确认：Dialog 里开着 DropdownMenu 或 Selector，第 1 次 Escape 只关菜单，Dialog 不会因为 `cancel` 一起关；第 2 次 Escape 才关 Dialog；全程无控制台报错。栈里没有 Dialog 的登记，Dialog 自己用原生 `cancel` 关，也符合「栈里有层才吃键」。 |
| (2) 没做 `LayerTeleport` 包装，各组件直接 `<Teleport :to>` | 合理 | 用户感知不受影响。实现者说包装组件在测试里卸载时崩过，我没复现，但直接写 `:to="teleportTarget"` 本身没问题。代价是仍有 10 个文件写死 `to="body"`（已交 C 节点，清单里漏了 `ButtonTooltip.vue`、`TableData.vue`）。 |
| (3) 没搬 `clampInlineSize`、`layerScopedContext`，`layerStructureReset` 只搬一半 | 部分不合理 | `layerStructureReset`（只重置 `--step-connector-gap`）：我 grep 了 `stepper.css` 和源码，确实没有这个变量，理由成立。`clampInlineSize`：理由不成立。上游用它让显式宽度（Popover `width`、DropdownMenu `menuWidth`）被视口上限压住，上限是两边内边距都扣掉。我们的 CSS 只扣一边 16px，超宽浮层右边距为 0，见第 4 项。`layerScopedContext`：理由不成立。「没有要截断的东西」不对，Vue 里 ButtonGroup 等同样用 `provide` 传 context，且会穿过 Teleport，见补充发现 2。 |
| (4) 并发排队只覆盖同一个浮层，不做跨浮层的操作门 | 合理（对用户无可感知差别） | 我用上游测试里的真实场景在浏览器里测了：Tooltip 包着 Popover 的触发器，键盘聚焦触发器 → Enter 打开 Popover → Escape 关闭，焦点回到触发器，8 次采样（每 60ms）Tooltip 都是显示的，无报错。BASE 上同样操作 Tooltip 一直不显示（8 次全 0）。所以 B4 的行为和上游「关闭后 Tooltip 显示」一致，而且没有原生 Popover API，不会抛 `InvalidStateError`。 |

## 风险点 (a)：RTL 下的 `text-align: start`

- 方法：同一个页面分别用 `dir=ltr`、`dir=rtl` 打开，开一个宽 320px、内容只有一个短词的 Popover（`rtl2.mjs`）。
- B4 结果：
  - LTR：`text-align: start`，文字紧贴浮层左侧（左边距 12px，右边空 273px）。
  - RTL：`text-align: start`，文字紧贴浮层右侧（右边距 12px，左边空 273px）。
- 对照：上游 `layerTextReset.stylex.ts` 写的也是 `textAlign: 'start'`，值相同。BASE 上用同一个脚本结果和 B4 完全一样（BASE 外层不是居中；外层居中的情况由补充发现 1 之外的第 5 项脚本覆盖，B4 已重置为 `start`）。
- 判断：对齐方向对，和上游一致，通过。

## 风险点 (b)：Toast 与 Dialog 的 Teleport 搬动

测试页：Toast `isAutoHide:false`，用 `requestAnimationFrame` 逐帧记录 Toast 的 `opacity`、位置、所在父节点。

| 场景 | 结果 |
| --- | --- |
| Toast 正在显示时关闭 Dialog | 通过：整个过程 14 帧，`has` 全为 true，没有消失（`missing=0`）；关闭后 Toast 回到 `body`；无控制台报错。 |
| Toast 退场动画进行到一半时关闭 Dialog（在点关闭按钮后 0、40、80、120ms 关 Dialog，另外用 API 退场 + 60ms 各一次） | 通过：5 种时机都没有控制台报错和页面异常，Toast 最后都被清掉。 |
| 反复开关 Dialog 3 次（Toast 一直在） | 通过：无报错，Toast 仍在。 |
| **Toast 已在显示，打开 Dialog** | **不过：有明显的位置跳动。** 逐帧：Toast 在 `body` 里时位置是 `(608, 696)`（右下角）；Dialog 一打开，Toast 搬进 `<dialog>`，在 Dialog 的 400ms 进场动画期间位置是 `(324~328, 472~474)`（出现在 Dialog 底部，截图 `/tmp/verify-B4/b4/flash-1-dialog-opening-200ms.png` 看到 Toast 贴在 Dialog 里面靠下的位置）；动画结束后才跳回 `(608, 696)`，位移约 220px。原因：`.astryx-dialog` 进场动画用了 `transform`，动画期间它成了子元素 `position: fixed` 的包含块；我们的 Toast 视口不是 `popover="manual"` 顶层元素。上游的视口是 `popover="manual"`，在顶层里按视口定位，不受 Dialog 的 `transform` 影响，所以不会跳。 |
| **Toast 被搬动时的透明度** | 搬进、搬出时 Toast 的 `opacity` 都会从 0 重新淡入（打开 Dialog 时 `0.00 → 1.00`，关闭 Dialog 时 `0.00 → 1.00`，各约 165ms），这是因为节点换父节点后 `@starting-style` 的进场动画重放。我用 `appendChild` 搬节点的最小页面模拟了上游的做法（`up-sim.mjs`），同样会从 0 淡入，所以这一条很可能上游也有，但我没能在上游线上站点上实测（Toast 页的交互测试超时），不把它单独算作不过。 |

- 判断：风险点 (b) 的三个明确要求里，「不消失、不报错」都满足；「不闪动」因为位置跳动不满足。计为不通过，要求返工。

## 不通过的项要怎么改

1. 第 4 项（视口内边距，超宽浮层右边距为 0）
   - 复现：视口 390 宽，`<Popover :width="400">`，点开，`getBoundingClientRect()` 得 `left=16, right=390`。
   - 期望：右边距也不小于内边距，即浮层最大宽度是 `100vw − 左内边距 − 右内边距`（含 `LayerProvider` 的 `inset`）。涉及 Popover 的 `width`、DropdownMenu/SubMenu 的 `menuWidth`（`DropdownMenu.vue:160`、`DropdownMenuSubMenu.vue:86` 都是 `min(width, calc(100vw - 16px))`）、`popover.css:63`。上游的实现在 `Layer/clampInlineSize.ts` 和 `layerViewportInset.stylex.ts`。
2. 第 16 项（台账 #6919、#6457 的结论与实测矛盾）
   - 把这两条的结论改成真实情况，并按下面第 3、4 条补做。
3. 补充发现 1（文字重置覆盖面）
   - 复现：外层容器设粗体、大写、居中，打开 Toast（在 `body`）和 Dialog，计算样式仍是继承值。
   - 期望：Dialog、Toast 视口、Lightbox、MobileNav、BottomSheet 的根也套上同一份重置（上游 `layerTextReset` 用在这些根上）。
4. 补充发现 2（上下文泄漏）
   - 复现：`ButtonGroup`（`isDisabled` 或 `size=lg`）里放 `Popover`，Popover 里放 `Button`，内容里的按钮会继承禁用和尺寸。
   - 期望：浮层内容不继承外层的「成员关系」类 context，行为和上游 `LayerContentBoundary` 一致（至少覆盖 `buttonGroupContextKey`，其余 ButtonGroup 之外的 `provide` 键也要对照上游那十几种逐个确认）。
5. 风险点 (b)（打开 Dialog 时 Toast 位置跳动）
   - 复现：先显示一个 Toast，再打开 Dialog，Toast 先出现在 Dialog 里靠下的位置，约 400ms 后跳回右下角。
   - 期望：Toast 的位置始终停在原来的视口位置，不跟着 Dialog 的 `transform` 动画跳。可以让 Toast 视口脱离 `transform` 包含块（例如对视口用 `popover="manual"`，或者等 Dialog 动画结束后再搬），具体由实现者选。

## 改进建议（不影响结论）

- 清单里补上 `ButtonTooltip.vue`、`TableData.vue` 两处还写死 `to="body"` 的 Teleport。
- 我的 BASE 对照里，B4 的 DropdownMenu/Selector 在 Dialog 里的行为比 BASE 好，值得在回报里直接写成「BASE 菜单被遮罩挡住，B4 修好了」，而不是只写「浏览器实测通过」。

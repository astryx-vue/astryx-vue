# B3 交互底座 composables · 执行计划

## 目标

把组件共用的**交互底座**追到上游 v0.7.1。交互底座就是那些不画界面、只管「怎么操作」的 composable：按压、悬停、焦点、键盘、滚动、平台判断。几十个组件都靠它们。

做完以后，用户能感受到下面这些变化，前提是对应的组件已经接上了这些 composable。接组件是 C 节点的事，B3 只把底座做好：

- **触屏按压**：手指按下按钮或菜单项时，按压反馈立刻出现，手指滑走后反馈消失、也不会触发点击，和上游一样。上游 #6383 用一个统一的「委托控制器」代替了 CSS 的 `:active`。
- **菜单的按压手感**：
  - 鼠标按下就打开菜单，可以按住拖进菜单，在某一项上松开就执行它。
  - 手指按住也能打开菜单，跟着手指移动高亮，松开时执行手指下面那一项。
  - 悬停打开的菜单不会被一次点击误关。如果触发器在悬停过程中被禁用了，菜单保持关闭。
- **焦点**：
  - 焦点陷阱只在焦点真的进入过陷阱时才归还焦点。
  - Tab 键只在焦点位于陷阱内部时才被拦下。
  - 用鼠标或手指关闭浮层后，焦点回到触发器，但不显示焦点环。
- **键盘**：
  - 输入法正在拼字时，按键不触发热键。
  - 列表只在调用方传了 `onEscape` 时才处理 Escape。
  - 方向键循环，PageUp 和 PageDown 翻页，按字母跳转只看标签文字（菜单那几条底层逻辑在这里）。
- **滚动**：
  - 锁住滚动时给滚动条预留宽度，页面不会左右跳。
  - 有一个统一的「可滚动容器」系统。
  - 焦点进入时，滚动的键盘操作交给正确的容器。
  - 菜单打开时，双指缩放仍然交给浏览器处理。
- **禁用状态**：禁用的元素没有悬停效果，鼠标指针统一用默认箭头，不用 `not-allowed`。
- **平台判断**：全库只有一套平台判断逻辑。判断不出来时就是「未知」，不会被当成「非苹果」。

这个节点下游有 35 个节点，所以要做稳。

## 工作环境

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/B3`，分支 `sync/b3-interaction`，已经建好。槽位和端口用 `node scripts/swarm/worktree.mjs ls` 查。
- 动手前先读：
  - `.agents-work/upstream-sync-0.7.1/SWARM.md`，特别是「对齐上游的标准：看效果，不看代码」和「跑检查时的环境」两节。
  - 台账 `.agents-work/upstream-sync-0.7.1/ledger/B3.md`，共 62 条，其中 3 条是破坏性改动。
  - E3 节点做的交互契约：`packages/core/test-support/a11y/README.md`。B3 改了底座以后，button、checkbox、switch 这三个契约不能变差。
- 我们现在的实现：`packages/core/src/composables/`，里面有大约 50 个 composable，还有 `internal/`。
- 上游的实现：
  - `packages/core/src/hooks/`：重点看 `usePressFeedback`、`menuPressGesture`、`useMenuPress`、`useMenuHover`、`useLongPress`、`useFocusTrap`、`useListFocus`、`useGridFocus`、`useHotkeys`、`useAnnounce`、`useContainerReveal`、`useAdaptivePresentation`、`useAutoMediaMode`、`scrollOwnerRegistry`、`scrollGeometry`、`scrollbarGutter`、`scrollKeyboardDelegation`、`useMergedRefs`、`useFocusReturnVisibility`。
  - `packages/core/src/utils/`：A1 规则 `core-utils-press` 把按压模型、交互模态、焦点归还这几块归给了 B3。
- 环境纪律：所有测试和构建命令前面都加 `env -u NODE_ENV`，vitest 一律加 `--maxWorkers=2`。
- 浏览器纪律：
  - 整台机器同时最多开 2 个浏览器会话。
  - 只能用 `node scripts/swarm/browser-lock.mjs run --purpose B3 -- <命令>` 开浏览器。
  - 文档站用你的槽位端口，用完关掉。

## 上游这些改动，让用户看到或感受到了什么

先把台账 62 条逐条归类。下面这几类是重点：

| 类别 | 代表条目 | 用户感受到的变化 | B3 要做的 |
| --- | --- | --- | --- |
| 触屏按压模型 | #6383 `33a14a205`、#5516 按压覆盖悬停、#6384「Pressed state for Switch…」 | 手指按下有反馈，滑走就取消 | 实现统一的按压控制器 composable，以及它要用的「交互模态」（当前是鼠标、键盘还是触屏）全局状态（#5881） |
| 菜单的按压和悬停 | #6681、#6826、#4936、#5346、#5ee81e1、#6078、#7201 | 按住拖进菜单、在某项上松开就执行；悬停的防误关逻辑 | 补齐 `useMenuPress` 和 `useMenuHover` 的底层能力。DropdownMenu 组件接入属于 C6 |
| 菜单键盘（#6823）、子菜单（#6682、#6824）、菜单头尾（#7344） | — | — | 只做 composable 层面能复用的部分（列表焦点循环、翻页、按字母跳转）。组件相关的部分标「交给 C6」 |
| 焦点 | #5681、#5397、#7388、#5266 合并引用 | 焦点归还更准确，不会出现多余的焦点环 | 更新 `useFocusTrap`、`useRestoreFocus`、`useMergedRefs` |
| 键盘 | #6772、#6773 输入法、#4907 输入法守卫统一、#5346 | 拼字时不会误触热键 | 提供一个统一的输入法判断工具，并接到 `useHotkeys`、`useTypeahead` 等用到它的 composable 上 |
| 滚动 | #5219、#6262 可滚动容器系统、#6301、#5817、#7518 | 页面不跳，滚动由正确的容器负责 | 更新 `useScrollLock`、`useScrollOverflow`、`useScrollableArea`，并补上滚动归属、滚动键盘委托 |
| 禁用状态 | #5247、#5323、#5335 | 禁用元素没有悬停效果，指针用默认箭头 | 底座里统一实现。用到的组件样式如果需要改，标出来交给对应的 C 节点 |
| 平台判断 | #5325、#5394 | 苹果设备上的快捷键显示正确 | 统一成一套平台判断，判断不出就是「未知」 |
| 浮层关闭栈 | #4881 | 多层浮层时，按 Escape 只关最上面一层 | 先看这个是不是已经属于 B4 的 Layer。是的话标「交给 B4」 |
| 破坏性改动（#6118、#7331、#7289） | — | — | 删除 0.6 的废弃 API 属于 B6。B3 只处理落在 composable 上的那一部分，其余标「交给 B6」 |

纯组件层面的改动（比如 FormLayout、Table、OverflowList、Popover、DropdownMenu 的适配，以及 BottomSheetSwitcher），标「交给对应的 C 节点」。

## 有没有更适合 Vue 的做法

| 上游怎么做 | 我们怎么做 | 为什么效果一样 |
| --- | --- | --- |
| React hooks，比如 `usePressFeedback` 返回事件处理器 | composable 返回响应式状态，加上要绑定的事件对象，用 `v-bind` 或 `v-on` 绑到元素上；或者提供一个指令（directive） | 用户看到和感受到的按压、悬停、焦点行为一致 |
| 一个委托控制器挂在 document 上，用来替代 `:active` | 同样挂在 document 上的单例，用模块级状态保存，SSR 时不初始化 | 触屏按压的表现一致 |
| `useMergedRefs`，用来合并 React ref | Vue 有模板 ref 和 `useTemplateRef`。只在确实需要「一个元素同时交给多个使用方」时，才提供对应的工具 | 用户感受不到差别。只要保证我们组件里多方共用同一个元素的地方行为正确 |
| `useEffect` 链 | `watch`、`onMounted`、`onScopeDispose` | 生命周期语义一致，卸载时清理干净 |

能复用 VueUse 的地方，先看仓库是否已经依赖它。没有依赖就不要新加，自己写。

## 任务范围

要改的：

- `packages/core/src/composables/**`，包括 `internal/`
- 必要的小工具，比如交互模态、输入法判断、平台判断。放在 composables 或 internal 里，不要和 B7 的 `utils` 混在一起
- 相关测试
- 文档站里 composable 的文档页：`apps/docs/docs/{zh,en}/components/use-*/`。只改行为描述有变化的那几页

不碰的：

- 各个组件的接入。比如 DropdownMenu 用上新的 `useMenuPress`，属于 C6。**但是**，如果你改了某个 composable 的签名，导致现有组件编译不过或者测试失败，就必须在本节点里把调用方改到能工作（只做最小改动，保持原来的行为）。
- Layer（属于 B4）、BaseProps 和废弃 API（属于 B6）、`utils`（属于 B7）。
- 生成文件只能用 `pnpm sync` 重新生成。

## 开发步骤

1. **盘点**：把台账 62 条归类，写进回报的草稿。
2. **交互模态和平台判断**：先做这两块，按压模型和快捷键显示都依赖它们。
3. **按压模型**：
   - 做统一的按压控制器，覆盖鼠标、触屏、键盘，并处理「按下后滑走就取消」的情况。
   - 写测试，覆盖这几种情况：pointerdown/up、pointercancel、滑出元素、触屏粗指针、按压覆盖悬停。
4. **菜单按压和悬停**：补齐能力，并照上游的测试写对应的测试。
5. **焦点、键盘、滚动、禁用**：逐类补齐。
6. **调用方**：用 grep 检查签名变化影响到的组件，做最小修复。
7. 跑 `pnpm sync`。
8. **台账**：62 条全部改成 `- [x]`，并写清结论：已采纳 / 交给 Bx、Cx：理由 / 不适用：理由。

## 自测要求

1. 两种 NODE_ENV 下，`pnpm vitest run --maxWorkers=2 packages/core/src/composables` 都全部通过，用例数相同。
2. E3 的交互契约测试（`packages/core/src/Button/Button.a11y.test.ts`、`Checkbox.a11y.test.ts`、`Switch.a11y.test.ts`）照样通过，已知失败名单不能变长。
3. SSR 冒烟测试通过。新的模块级单例在服务端不碰 `document`。
4. 跑完整的 `env -u NODE_ENV pnpm check`，必须通过。其中 test 那一步换成 `pnpm vitest run --maxWorkers=2`。
5. **在浏览器里亲手试**（只开一个浏览器，套上锁）。用 Playwright 在 Button 页和 DropdownMenu 页上，模拟触屏（`hasTouch`）和鼠标：按下、滑走、松开，看按压状态和点击是否符合上面「目标」里写的效果。组件还没接入新底座的，记下现在的表现，在回报里说明「这部分要等 C 节点接入」。
6. 新写和改动的源码文件，每个都不超过 500 行。

## 提交与回报

- 在分支上提交，提交信息用中文，可以分几次提交，不要推送。
- 回报写到主仓库的 `/Users/shenqingchuan/workspace/astryx-vue/.agents-work/upstream-sync-0.7.1/nodes/B3/impl-1.md`，格式按 `templates/impl-report.md`。另外要写清楚：
  1. 台账归类结果。
  2. 新增或变化的 composable API 清单，标出签名有变化的。
  3. 「交给 Cx」的清单，按 C 节点分组，并写明每个 C 节点要怎样接入新底座。C 节点的计划会直接引用这份清单，所以要写到能照着做的程度。
  4. 调用方的最小修复清单。
  5. 浏览器里试过什么、看到了什么。
- 最终回复用中文，300 字以内。

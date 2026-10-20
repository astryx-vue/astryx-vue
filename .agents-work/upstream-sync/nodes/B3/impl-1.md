# B3 交互底座 composables · 第 1 轮实现回报

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/B3`，分支 `sync/b3-interaction`。只在本地提交，没有推送。
- 提交（基于 `383c402`）：
  - `4236462` feat: 交互底座追到上游 v0.7.1——触屏按压模型、菜单按压与悬停、交互模态、焦点归还、滚动归属
  - `ad02f2c` docs: 更新按压、菜单按压、锁滚动、可滚动区域、焦点陷阱的文档页
  - `a596ed8` docs: B3 台账 62 条全部处理并写明结论

## 1. 做了什么

按计划「开发步骤」：

1. **盘点**：台账 62 条归类，结果见第 4 节，结论已写进分支里的 `ledger/B3.md`。
2. **交互模态和平台判断**：
   - 新增 `internal/interactionModality.ts`。状态挂在 `document` 上，用全局 Symbol 作键，所以整个页面只有一份；服务端返回 keyboard。
   - Chat 和 MultiSelector 各有一份副本，已经删掉，改成用这一份。
   - 新增 `internal/platform.ts`。Client Hints 返回空字符串或 `Unknown` 时算「未知」，接着看 `navigator.platform`。`Kbd/platform.ts` 和 `useHotkeys` 都用它。
   - 新增 `internal/ime.ts`，全库共用一个 `isImeKeyEvent`，判断条件是 isComposing、keyCode 229、key 为 Process 三者之一成立。
   - 新增 `internal/focusReturn.ts`，提供 `isFocusDetached` 和 `focusForLastInput`：上一次操作是指针时，归还焦点不画焦点环。
   - 新增 `internal/useFocusReturnVisibility.ts`。
3. **按压模型**：
   - `internal/pressGesture.ts` 是纯状态机。数值和上游一致：认按压前等 150ms，移动容差 10px，轻点亮 100ms，淡出 200ms，刹车窗口 150ms。
   - `internal/pressFeedback.ts` 是文档级委托控制器。它在元素上写 `data-astryx-press="on|fading"`，并处理这些情况：刹车、禁用元素不亮、嵌套时只亮最里层、第二根手指、visibilitychange、dragstart。
   - `styles/pressable.css` 用 `@property --astryx-press-alpha` 记录按压强度，淡出就是这个强度从 1 降到 0 的动画。
   - `usePressFeedback` 在 onMounted 时装控制器，作用域销毁时释放，服务端不装。
4. **菜单按压和悬停**：
   - `internal/menuPressGesture.ts` 是纯状态机，包含落定规则（`MENU_PRESS_SETTLE_MS = 300`）。
   - DOM 部分拆成三个文件：`menuPressDom.ts`、`menuPressAutoscroll.ts`、`strayClick.ts`。另有 `gestureCounter.ts`。
   - `useMenuPress` 整个重写，`ContextMenu/useMenuPress.ts` 只做转发。
   - `internal/useMenuHover.ts` 照上游实现，只在内部用，不导出。
   - `internal/hoverIntent.ts` 是共用的离开计时器，带安全三角，`useMenuHover` 和 `ContextMenu/useSubmenuHover` 都用它。
   - `safeTriangle.ts` 移进了 `internal/`。
   - `useLongPress` 改了两处：清理改用 onScopeDispose；按住期间落下第二根手指会取消。
5. **焦点、键盘、滚动**：
   - `useFocusTrap`：只在焦点位于陷阱内部时拦 Tab；焦点在容器自身时，Tab 进入循环；输入法拼字中的 Escape 和已经被处理过的 Escape 都不关闭；归还焦点用 focusForLastInput。
   - `useRestoreFocus` 也改为用 focusForLastInput 归还焦点。
   - `useHotkeys` 和 `useTypeahead` 改用共用的 IME 判断。
   - `internal/scrollbarGutter.ts`：`useScrollLock` 锁滚动时给滚动条留出宽度。
   - 新增 `internal/scrollGeometry.ts`、`scrollOwnerRegistry.ts`、`scrollKeyboardDelegation.ts`、`scrollInvalidation.ts`。
   - `useScrollableArea` 重写：新增 `keyboardAccess`，会登记滚动归属；不可测量时保留上一次的状态。
   - `useScrollOverflow`：只在容器真正渲染时测量，滚动时总是测量。
   - `useAnnounce`：清空时取消还没写进去的那一帧。
   - `useClickableContainer`：导出 `hasInteractiveAncestor` 和 `hasTextSelection`。
6. **调用方**：做了最小修复，清单见第 3 小节「调用方最小修复」。
7. 跑了 `pnpm sync` 和 `pnpm --filter @astryx-vue/cli generate`。
8. 台账 62 条全部改成 `[x]`，每条写了结论。

| 文件 | 行数 | 职责 |
| --- | --- | --- |
| composables/internal/ime.ts | 27 | 全库唯一的输入法判断 |
| composables/internal/platform.ts | 45 | 全库唯一的平台判断 |
| composables/internal/interactionModality.ts | 79 | 交互模态单例 |
| composables/internal/focusReturn.ts | 45 | 焦点归还，焦点环跟随上一次输入方式 |
| composables/internal/useFocusReturnVisibility.ts | 40 | 指针关闭后压住触发器的焦点环 |
| composables/internal/pressGesture.ts | 146 | 按压状态机 |
| composables/internal/pressFeedback.ts | 297 | 按压委托控制器 |
| styles/pressable.css | 85 | 按压样式（不是 B1 的主题文件） |
| composables/internal/menuPressGesture.ts | 184 | 菜单按压状态机 |
| composables/internal/menuPressDom.ts | 118 | 菜单按压的命中测试、高亮、派发 |
| composables/internal/menuPressAutoscroll.ts | 68 | 菜单边缘自动滚动 |
| composables/internal/strayClick.ts | 84 | 吞掉浏览器多余的 click，标记模型激活 |
| composables/internal/gestureCounter.ts | 43 | 手势计数器 |
| composables/internal/hoverIntent.ts | 78 | 离开计时器加安全三角 |
| composables/internal/useMenuHover.ts | 279 | 悬停菜单底座（内部用） |
| composables/internal/scrollbarGutter.ts | 78 | 锁滚动时留出滚动条宽度 |
| composables/internal/scrollGeometry.ts | 115 | 逻辑轴几何计算 |
| composables/internal/scrollOwnerRegistry.ts | 38 | 滚动归属登记表 |
| composables/internal/scrollKeyboardDelegation.ts | 195 | 焦点进入时的滚动键盘委托 |
| composables/internal/scrollInvalidation.ts | 57 | 什么时候需要重新测量 |
| composables/useMenuPress.ts | 347 | 菜单按压 composable |
| composables/useScrollableArea.ts | 231 | 可滚动容器系统 |

改动过的源码文件全部在 500 行以内，`check-line-limit` 通过。

## 2. 和上游的对照

| 上游改动 | 上游怎么做 | 我们怎么做 | 为什么效果相同 |
| --- | --- | --- | --- |
| #6383 触屏按压 | StyleX 变体加委托控制器 | 状态机和控制器照上游写，数值相同；样式用普通 CSS，`@property` 加 keyframes | 写在元素上的属性和时序一致，浏览器实测见第 5 节 |
| usePressFeedback | hook 返回标记，样式通过 `interactionOverlayStyles` 组合 | 返回 `pressableProps`，内容是标记加默认 `astryx-pressable` 类；组件自己画时传 `{ hasOverlay: false }`，再读 `--_press-paint-image` | 默认类用 `::after` 画按压，也可以由组件自己画，两种用法都支持 |
| #6681/#6826 菜单按压 | React hook 加 ref | composable；`menuProps`、`triggerProps` 用 Vue 的事件键名（`onPointerdown`、`onContextmenu`），可以直接 `v-bind` | 状态机和上游逐行等价 |
| `isTriggerClickFromPress` | gestureCounter | 照上游 | — |
| useMenuHover | 效果用 `useIsomorphicLayoutEffect` 记录关闭时刻 | `watch(isOpen, { flush: 'sync' })` | 都在浏览器重新做命中测试之前执行 |
| #5881 交互模态 | 挂在 document 上的单例，由 hook 激活 | 同样挂在 document 上；提供 `trackInteractionModality()`，第一次调用时安装 | 一致 |
| #5219 锁滚动 | 用 position:fixed 钉住页面，加 gutter | 继续用 `overflow:hidden`，再加 gutter | 计划没要求改锁定方式。iOS 的背景滚动差异留给 C7/C8 判断，见第 6 节 |
| #6262/#6301 可滚动区域 | 返回 prop getter | 返回 `viewport` 函数 ref、`content` ref、`viewportAttrs`、`viewportStyle`；新增 `keyboardAccess`，保留 `label`/`role` 的老写法 | 状态、登记和委托规则一致 |
| useMergedRefs #5266 | 用 useMemo 让 ref 稳定 | 已有，函数在 composable 生命周期里只有一个 | Vue 没有 ref 身份抖动的问题 |

## 3. 和计划不一样的地方

- **`useMenuHover` 不导出**：上游也没有导出它，导出会让它变成新的公开 API。它放在 `internal/`，C6、C13 按路径引用即可。
- **`useFocusReturnVisibility`、`focusReturn`、`ime`、`platform`、`interactionModality` 都放在 `composables/internal/`**：计划要求不放进 B7 的 `utils`，上游也没有把它们公开。
- **useScrollLock 没有改成 position:fixed**：只补了 gutter。理由见第 2 节，是否要改由 C7/C8 决定。
- **`MenuPress.menuProps` 的键名从 `onPointerDown` 改成了 `onPointerdown`**：这是签名变化。原来写成 `'onPointerDown'`，经过 `v-bind` 绑到元素上虽然也能触发，但类型上会误导人，而且原来的 `triggerProps.onContextMenu` 在 `v-bind` 下其实不会触发（实测 `onContextMenu` 没有被调用）。现在统一用 Vue 的事件键名。现有调用方只用了 `onPointerDown` 这个单独返回的函数，没有影响。
- **`MenuPressOptions.isEnabled` 和 `onDismiss` 改为可选**：`isEnabled` 现在接受 `MaybeRefOrGetter<boolean>`，默认 true。旧写法 `() => boolean` 照样能用。

### 调用方最小修复

| 文件 | 改动 |
| --- | --- |
| Chat/ChatComposerInput.vue、Chat/ChatComposer.vue、MultiSelector/MultiSelector.vue | 改为从 `composables/internal/` 引入 ime 和模态；删掉 `Chat/ime.ts`、`Chat/modality.ts`、`MultiSelector/interactionModality.ts` 三份副本 |
| Kbd/platform.ts | `isApplePlatform` 改为从 internal 重新导出，`useIsApplePlatform` 不变 |
| ContextMenu/useMenuPress.ts、ContextMenu/safeTriangle.ts | 改成只做转发 |
| ContextMenu/useSubmenuHover.ts | 离开计时和安全三角改用共用的 `createHideTimer`，行为不变，原有测试全部通过 |
| ContextMenu/ContextMenu.test.ts | 「鼠标在外面松开」原来派发的是 `mouseup`，改为 `pointerup`。上游模型就是看 pointerup，真实浏览器里两者都会触发，组件行为没变 |

### 新增或变化的公开 API（composables 入口，由 `pnpm sync` 生成）

- `useMenuPress`
  - 签名有变化：`menuProps.onPointerdown`、`triggerProps.onPointerdown/onContextmenu` 改成 Vue 键名；`isEnabled` 和 `onDismiss` 变为可选。
  - 新增选项：`getScroller`、`hitTest`。
  - 新增导出：`isMenuPressActivation`、`MENU_PRESS_MARKER`、`MENU_PRESS_SETTLE_MS`、`menuPressStep`，以及 `MenuPressEffect/Event/Gesture/PointerType/Step` 这几个类型。
- `usePressFeedback`：签名有变化，新增可选参数 `{ hasOverlay }`。`pressableProps` 默认多了 `class: 'astryx-pressable'`。按压属性从 `data-astryx-pressed` 改成上游的 `data-astryx-press="on|fading"`。
- `useScrollableArea`：签名扩展，新增 `keyboardAccess`，`label` 变为可选；新增类型 `ScrollKeyboardAccess`。
- `hasInteractiveAncestor`、`hasTextSelection`：新增导出。
- `UsePressFeedbackOptions`：新增类型。

## 4. 台账处理

一共 62 条：已采纳 30 条，交给其他节点 15 条，不适用 17 条。每条的理由写在分支里 `ledger/B3.md` 对应条目下面。不适用的几类：

- 我们已经实现了：#5346、#5681、#6682、#5084、#5266。
- 上游的纯文档或审查流程：#5291、#5354、#5802、#6235、#6256、#6386、#6917、#5109。
- 上游专用的工具链：StyleX 简写 #6732，测试工具 #4388。
- #5323 被 #5335 取代。#5247 在 composable 层不需要改。

## 交给 Cx 的接入清单

### 所有画按压的组件（C1、C2、C3、C4、C5、C6、C12、C13、C14、C15、C16）

上游有一份完整名单：`git grep -l usePressFeedback v0.7.1 -- packages/core/src` 列出的 31 个组件。每个组件按下面四步接入：

1. 在 `setup` 里调用 `const { pressableProps } = usePressFeedback({ hasOverlay: false })`，在「画按压的那个元素」上写 `v-bind="pressableProps"`。如果组件不想自己写按压样式，可以去掉 `hasOverlay: false`，直接用默认的 `::after` 那层。
2. 组件 CSS 里的 `:active` 按压分支改成 `@media not all and (pointer: coarse) { …:active {…} }`，让手指不触发 `:active`。
3. 加上触屏的两个分支：
   ```css
   .x:where(:not(:disabled,[aria-disabled='true']))[data-astryx-press] {
     background-color: transparent;
     background-image: var(--_press-paint-image);
   }
   ```
   如果按压画在子元素或伪元素上（Switch 的轨道、卡片的 `::after`），就读 `var(--_press-paint)`，这个变量会继承下去。
4. 按压必须盖过悬停（#5516）：`[data-astryx-press]` 分支放在 `:hover` 后面，或者提高优先级。

验收方法：浏览器开 hasTouch，按下 150ms 后元素上有 `data-astryx-press="on"`，手指滑走后这个属性消失。

### C1 基础输入

- 按上面通用步骤接入，组件有 Button、IconButton、NumberInput 等。
- 禁用状态：鼠标指针统一用 `cursor: default`，不用 not-allowed；禁用元素的 `:hover` 加 `:where(:not(:disabled,[aria-disabled="true"]))`。
- `FieldInfoTip` 状态按钮要加 `pointer-events: auto`（#5147），否则放在 TextArea 尾部插槽里时悬停不到。
- TextInput、TextArea、NumberInput 里内联的 `isComposing || keyCode === 229` 判断，改为 `import { isImeKeyEvent } from '../composables/internal/ime.js'`。
- `useResolvedRequired`（#4791）和 FormLayout 的 defaultOptionality 一起做。

### C2 勾选与开关

- Switch、SegmentedControl、CheckboxInput、RadioList、Slider 按通用步骤接入。
- 按压画在子元素上的，读继承下来的 `--_press-paint`（上游 #6380）。
- Slider 判断「键盘焦点环」时，改用 `isKeyboardModality()`，从 `composables/internal/interactionModality.js` 引入。

### C3 选择器家族（Selector、MultiSelector、Typeahead、Tokenizer）

- Selector 的列表框接 `useMenuPress`：传 `itemSelector` 和 `onHighlight(row)` 走 activedescendant 高亮，并在列表框根上 `v-bind="press.menuProps"`。
- 列表框 CSS 的 `touch-action` 改为：放得下时 `pinch-zoom`，会滚动时 `pan-y pinch-zoom`（#7201）。
- 关闭后归还焦点：用 `useFocusReturnVisibility()`，在关闭前调 `prepareFocusReturn()`，把 `isFocusRingSuppressed` 绑到触发器的 data 属性上，并在 CSS 里压掉焦点环。
- 悬停高亮不滚动（#6078）：只有键盘高亮才调用 scrollIntoView，悬停高亮不调用。
- `useAnnounceRenderedText`（#6905）和空状态播报一起做，可以基于 `useAnnounce`。
- `useTypeaheadMenu`、MultiSelector、Typeahead 里内联的 IME 判断，换成 `isImeKeyEvent`。

### C5 日期时间

- 浮层关闭时只在 `isFocusDetached()` 为真时把焦点还给触发器，归还用 `focusForLastInput(trigger)`，两者都从 `composables/internal/focusReturn.js` 引入。

### C6 菜单家族（DropdownMenu、ContextMenu、MoreMenu）

- **DropdownMenu 接 useMenuPress**：
  ```ts
  const press = useMenuPress({
    menuRef: panel,
    triggerRef,
    isEnabled: () => true,
    onTriggerPress: type => { if (isOpen) { close(); return false } openMenu('pointer'); return true },
    onDismiss: close,
  })
  ```
  - 触发器上写 `v-bind="press.triggerProps"`；触发器的 click 处理里先判断 `if (press.isTriggerClickFromPress()) return`。
  - 菜单根上写 `v-bind="press.menuProps"`。
  - 菜单关闭时调 `press.cancel()`。
  - 效果：鼠标按下就打开，可以按住拖进菜单，在某一行上松开就执行；手指按住 500ms 打开，跟着手指高亮，松开时执行手指下面那一行。
- ContextMenu 已经在用新的 `useMenuPress`。还可以给它传 `triggerRef`/`onTriggerPress`，不过 ContextMenu 打开靠的是右键或长按，原来的 `useLongPress` 逻辑保留。
- **DropdownMenuSubMenu 改用 `internal/useMenuHover.ts`**：传 `show`/`hide`/`isOpen`/`isEnabled`/`flyoutRef`；在行的 click 里调 `confirmHoverOpen()`；触发器上写 `v-bind="hover.triggerProps"`，飞出层上写 `v-bind="hover.contentProps"`。这样可以得到 500ms 点击保护、300ms 重开抑制、安全三角，以及等待期间被禁用就不打开（#5ee81e1）。现在 DropdownMenuSubMenu 用的是自己写的 pointerenter/leave 计时器，没有这些能力。
- 菜单 CSS 的 `touch-action` 改为：放得下时 `pinch-zoom`，会滚动时 `pan-y pinch-zoom`。现在 `dropdown-menu.css` 写的是 `pan-y`，`context-menu.css` 写的是 `none`/`pan-y`。
- 方向键循环、`hasPaging`（PageUp/PageDown）、Escape 只在传了 `onEscape` 时才处理：这些 useListFocus 都已经有了。DropdownMenu 需要传 `hasPaging: true`，并补上「ArrowUp 打开菜单时定位到最后一行」和「打开菜单的那个键自动重复时不执行第一行」。
- 指针关闭后归还焦点：用 `useFocusReturnVisibility` 或 `focusForLastInput`。
- 页头页脚（#7344）判断哪些元素可聚焦时，用 `layer/focus.ts` 的 `getFocusables`。
- 把激活转交给内部链接的行，用 `isMenuPressActivation()` 区分是模型派发的 click 还是浏览器多出来的那个。
- `ContextMenuSubMenu.vue` 和 `menuNav.ts` 里的 `event.isComposing`，换成 `isImeKeyEvent`。
- useAdaptivePresentation：查询条件是 `(max-width: 768px) and (pointer: coarse)`，和 `presentation` 属性一起接。

### C7 浮层家族、C8 BottomSheet

- Dialog、Popover、BottomSheet 关闭后归还焦点，已经通过 `useFocusTrap`/`useRestoreFocus` 自动做到「指针关闭不画焦点环」，组件不需要改。如果有组件自己调 `.focus()` 归还焦点，就改成 `focusForLastInput`。
- 如果要在 iOS 上彻底锁住背景滚动，需要在 `useScrollLock` 里改用 position:fixed 方案，请 C7 判断并开新任务。
- `BottomSheet.vue` 和 `BottomSheetSwitcher.vue` 里内联的 IME 判断，换成 `isImeKeyEvent`。
- BottomSheetPanel 的滚动区域用 `useScrollableArea({ keyboardAccess: { owner: 'contentOrViewport', label } })`。

### C11 Table

- 表格滚动区域用 `useScrollableArea({ axis, keyboardAccess: { owner: 'content' } })`。
- 行展开时判断「点到的是不是行里的交互元素」，用新导出的 `hasInteractiveAncestor`、`hasTextSelection`。

### C12 列表与树

- `TreeList/useTreeFocus.ts` 的 typeahead 改为按 `aria-labelledby` 的文字匹配（#7472，上游的内部选项 `matchLabelledBy`）。
- OverflowList 的 `onOverflowChange`（#5199）用 `useOverflow` 的 `visibleCount` 算出来。

### C13 导航家族

- TopNavMenu、TopNavMegaMenu、NavHeadingMenu、SideNavItem 的悬停改为接 `internal/useMenuHover.ts`。
  - SideNavItem 传 `ownsFocus: false, clickGuardMs: 0`。
  - 现在 `NavMenu/NavDisclosure.vue` 用的是自己的 show/hide 计时器，没有点击保护和重开抑制。
- `SideNav` 的 `useHotkeys` 不用改。

### C14 布局与容器、C9 代码块

- CodeBlock 和其他滚动容器改用 `useScrollableArea` 并选好 `keyboardAccess`。ScrollableArea 组件本身不用改，`label`/`role` 的老写法照常可用。

### C16 基础展示与动作

- Kbd 已经和 useHotkeys 共用同一套平台判断，不用改。
- Link、Token 等组件按通用步骤接入按压。
- `useClickableContainer` 的 href 要等 B7 提供 `isSafeUrl` 之后再接入：在 `onClick`/`onMouseUp` 里先判断 `isSafeUrl(href)`，不安全就不跳转。

### 禁用状态（B2 和所有 C 节点）

- 还有 9 处 `cursor: not-allowed` 要改成 `default`：command-palette、overflow-list、token（2 处）、clickable-card、complex-selector、stepper、button、nav-menu。
- 禁用元素不能有悬停效果。

### 交给 B4、B6、B7

- B4：统一的浮层关闭栈（#4881、#6184）。`hasActiveFocusTrapEscape` 依赖这个栈。
- B6：0.6 废弃 API（#6118，在 composable 层没有要删的）、BaseProps 透传（#7331）。
- B7：safeUrl、sharedResizeObserver。

## 5. 自测结果

| # | 自测项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | `env -u NODE_ENV pnpm vitest run --maxWorkers=2` 全量 | 通过 | 239 个文件，3223 个用例 |
| 2 | `NODE_ENV=production pnpm vitest run --maxWorkers=2` 全量 | 通过 | 239 个文件，3223 个用例，和第 1 条相同 |
| 2b | composables 目录单独跑 | 通过 | 包含在上面两次全量里；只跑 composables 和 ScrollableArea 时是 50 个文件、396 个用例 |
| 3 | E3 交互契约（Button、Checkbox、Switch 的 a11y 测试）加 SSR 冒烟 | 通过 | 4 个文件、280 个用例；`known-failures.ts` 和 `ssr-known-failures.json` 没有改动，名单没变长 |
| 4 | `env -u NODE_ENV pnpm check`，其中 test 换成 vitest --maxWorkers=2 | 通过 | check:packages=0、lint=0、typecheck=0、test=0、build=0、lint:pkg=0 |
| 5 | 浏览器实测，套了 browser-lock，同一时刻只开一个浏览器，用 5172 端口 | 通过 | 见下文；证据在 `nodes/B3/evidence/1/`，包括 results.json、截图和 harness 脚本 |
| 6 | 单文件不超过 500 行 | 通过 | `check-line-limit` 通过 |

浏览器实测分两部分。

**测试页**：一个直接挂载新 composable 的小 Vite 页面，脚本放在 evidence/1/harness，没有提交进分支。Chromium 开 hasTouch，用 CDP 发真实的 touch 事件。

- 手指按住：60ms 时没有属性；350ms 时是 `on`；抬手后是 `fading`；淡出结束后属性消失；click 照常触发一次。
- 按住后滑走：属性立刻消失，抬手后也不再出现，click 没有触发。
- 快速轻点：抬手那一刻是 `on`，click 触发一次。
- 手指按住触发器 500ms 后菜单打开，高亮跟着手指移到 Beta、再到 Gamma，松开时执行 Gamma（日志 `select:Gamma:detail0`），菜单关闭。
- 鼠标：控制器不写属性，按下时 `::after` 由 `:active` 画上按压色。鼠标按下菜单立刻打开，拖到 Beta 上松开就执行 Beta。
- 普通点击打开菜单后菜单保持打开（落定规则）。再按一次触发器就关闭，同一次手势里不会重新打开。
- 截图：`harness-touch-held.png`、`harness-touch-menu.png`。

**文档站**：`vitepress preview --port 5172`，看的是用 `pnpm build` 产物，现有组件还没有接入新底座。

- Button 页：按钮上没有 `data-astryx-pressable` 标记。按住 350ms 也没有按压属性，`:active` 在 Chromium 模拟的触屏下也没有命中。也就是说，按钮现在在手指下没有按压反馈。**这部分要等 C1/C16 接入。**
- DropdownMenu 页：页面上本来就有一个展开的示例菜单（打开前就数到 1 个可见的 menu），所以这一项读数不能说明问题。DropdownMenu 还没有接 useMenuPress，「鼠标按下就打开、按住拖进菜单」**这部分要等 C6 接入**。
- 截图：`docs-button-touch-held.png`、`docs-dropdown-mouse.png`。

## 6. 拿不准的地方

1. **useScrollLock 没有改成 position:fixed**。上游这样做是为了 iOS Safari。改它会影响 Dialog、BottomSheet、Lightbox 打开时的滚动位置，属于浮层组件的行为，我没有在 B3 里改。是否改，请总控决定交给 C7 还是 B4。
2. **`pressableProps` 默认多了 `class: 'astryx-pressable'`**。原来的 `pressable.css` 是直接给所有 `[data-astryx-pressable]` 元素画 `::after`，这会和组件自己画的按压冲突。现在改成默认类负责画，组件自己画时传 `{ hasOverlay: false }`。目前全库没有组件用 usePressFeedback，所以没有组件受影响。
3. **`data-astryx-pressed` 改名为 `data-astryx-press`**，和上游保持一致。全库没有组件读过旧名字。
4. **DropdownMenu 页的 openOnPress 读数**：页面上本来就有一个展开的菜单，这个读数没有意义。验收时请在单独打开的那个示例上看。
5. 测试页脚本没有进仓库，放在 evidence 目录（这个目录被 gitignore 忽略），验收者想复现可以直接用。

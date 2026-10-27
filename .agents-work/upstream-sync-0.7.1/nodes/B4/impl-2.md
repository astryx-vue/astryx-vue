# B4 浮层运行时 Layer · 第 2 轮实现回报

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/B4`，分支 `sync/b4-layer`。只在本地提交，没有推送。
- 基点是第 1 轮的 `331e12c`。本轮提交：

| 提交 | 内容 |
| --- | --- |
| `252264c` | 第 1 件：宽度上限减两边空隙 |
| `3d61c78` | 第 2 件：五个浮层根套文字重置 |
| `25bd9eb` | 第 3 件：浮层内容不继承「成员关系」context |
| `832514e` | 第 4 件：Toast 不跟着 Dialog 的动画跳 |
| `5ac5394` | 第 5 件：台账两条结论改写 + 两处 `to="body"` |
| `53d2787` | 补一条 Toast 视口的用例 |

浏览器证据在 `.agents-work/upstream-sync-0.7.1/nodes/B4/evidence/2/`（gitignore，不进提交）：`browser-check.mjs`、`results.json`、`1-toast-over-dialog.png`、`3-huge-popover.png`、`3-wide-menu.png`、`4-text-reset.png`、`5-scoped-context.png`，以及评估原生 popover 用的 `popover-top-layer-probe.mjs` 和几个临时探针。

## 1. 逐件说明

### 第 1 件：超宽浮层两边都留内边距

**问题**：视口 390 宽、`<Popover :width="400">` 实测 `left=16, right=390`（右边贴边）。原因是上限写成 `calc(100vw - 16px)`，只扣一边，而且不跟 `LayerProvider` 的 `inset` 联动。

**做法**（上游 `clampInlineSize.ts` + `layerViewportInset.stylex.ts` 的等价物）：

- 新增 `packages/core/src/layer/inlineSize.ts`（46 行），是这组计算的唯一出处：
  - `layerMaxInlineSize(gutter)` → `calc(100vw - {inlineStart}px - {inlineEnd}px)`；
  - `LAYER_MAX_INLINE_SIZE` → `var(--astryx-layer-max-inline-size, calc(100vw - 32px))`；
  - `clampInlineSize(value)` → `min(value, 上限)`（上游注释里的同一个理由：`min-width` 压得住 `max-width`，所以上限必须写进 `min()`）；
  - `isIntrinsicInlineSize(value)`：`auto`/`max-content` 这类关键字不能当 `min()` 参数，原样用。这条同时把 `DropdownMenu.vue`、`DropdownMenuSubMenu.vue` 里各写一遍的 `INTRINSIC_SIZE` 正则收成一份（DRY）。
- `LayerProvider.vue` 挂在根元素上写 `--astryx-layer-max-inline-size`：浮层被 Teleport 出去，拿不到 provider 的 DOM 继承链，只有写在 `documentElement` 上才全局可见。没有 provider（或者一条都还没挂）时，`inlineSize.ts` 里的默认值兜底。
- 三处消费方都读同一个变量：`popover.css` 的 `max-inline-size`、`Popover.vue` 的 `max-width`、`DropdownMenu.vue`/`DropdownMenuSubMenu.vue` 的 `min-width` 与 `max-width`。

**测试**：`layer/inlineSize.test.ts` 8 条（算法、关键字、provider 写入/摘掉变量）；`Popover.test.ts` 加 2 条（显式 `width` 被上限压住、默认宽度是 `min(320px, 上限)`）；`DropdownMenu.test.ts` 3 条改断言。浏览器实测（390×844）：

| 用例 | 结果 |
| --- | --- |
| `Popover :width="400"` | `left=25, right=25, width=340`（视口 390，含 15px 滚动条） |
| `DropdownMenu :menu-width="400"` | `left=25, right=25, width=340` |

两边都 ≫ 16px 的内边距要求。

### 第 2 件：文字重置覆盖到所有浮层根

`styles/layer.css` 的重置规则本来就认 `.astryx-layer` 这个类名，所以做法是给上游 `layerTextReset` 用在的那些根加上这个类：

| 文件 | 改动 |
| --- | --- |
| `Dialog/Dialog.vue` | `<dialog class="astryx-dialog astryx-layer">` 与 `isInline` 那个根 |
| `Toast/ToastViewport.vue` | 根 div 的 class 列表加 `astryx-layer` |
| `Lightbox/Lightbox.vue` | `<dialog class="astryx-lightbox astryx-layer">` |
| `MobileNav/MobileNav.vue` | `<dialog class="astryx-mobile-nav astryx-layer">` |
| `BottomSheet/BottomSheetPanel.vue` | `<div class="astryx-bottom-sheet astryx-layer">` |

和上游 `layerTextReset` 的落点一致（`Dialog.tsx` 两处、`ToastViewport.tsx`、`Lightbox.tsx`、`MobileNav.tsx`、`BottomSheetPanel.tsx`）。

**测试**：五个组件各自的测试里加一条 class 断言；浏览器里给 `body` 设 `font-weight:700 / font-size:30px / letter-spacing:4px / uppercase / italic / center` 后读计算样式：Toast 视口和 Dialog 根都是 `400 / normal / none / start / normal`。

### 第 3 件：浮层内容不继承「成员关系」context

**问题**：Vue 的 provide/inject 跟组件树走，Teleport 切不断。`ButtonGroup isDisabled` 或 `size="lg"` 里开 Popover，内容里的 Button 也会被禁用、也会变 `lg`。

**做法**（对应上游 `layerScopedContext.tsx` 的 `createLayerScopedContext` + `LayerContentBoundary`）：

- 新增 `layer/scopedProvide.ts`（96 行）：一张登记表（key → 进了浮层要重置成的值）+ `resetLayerScopedContext()`，把登记表里的 key 在当前组件里重新 `provide` 成默认值。默认值一律等于读者自己 `inject` 时用的默认值，所以「组里没有我」和「根本没有组」读起来完全一样。
- 新增 `layer/LayerContentBoundary.vue`（18 行）：一个 renderless 组件，setup 里调 `resetLayerScopedContext()`，模板只有 `<slot />`。
- 边界**包在内容上**，不是包在整个浮层组件上。这一条很关键：`Popover`/`Tooltip`/`HoverCard`/菜单在同一个组件里同时渲染「触发器」和「内容」，如果重置写在组件 setup 里，触发器也会被重置——那正是第一版踩到的坑（`AvatarStatusDot` 里套 `Tooltip` 时头像尺寸丢了、`RadioList` 的选项丢了组状态，全量测试 52 条挂掉）。
- 放了边界的文件：`Popover.vue`（内容插槽）、`Tooltip.vue`、`HoverCard.vue`、`DropdownMenu.vue`（弹层那一支的两个呈现都包了；抽屉那一支走 `BottomSheetPanel` 自有重置）、`DropdownMenuSubMenu.vue`（drill + flyout 两处）、`ContextMenu.vue`、`ContextMenuSubMenu.vue`（两处）。
- 整个组件内容都是浮层内容的，直接在 setup 里重置：`Dialog.vue`、`ToastViewport.vue`、`Lightbox.vue`、`MobileNav.vue`、`BottomSheetPanel.vue`。
- `Layout/context.ts` 把 `emptySlots` 提成导出的 `emptyLayoutSlots`，供登记表复用（DRY）。

**条件**：边界必须落在真实 DOM 元素里面。直接挂在 `<Teleport>` 下时，边界渲染成片段，`document.body.innerHTML = ''` 这类测试清理 + 自动卸载会在 `removeFragment` 里崩（`Cannot read properties of null (reading 'nextSibling')`，第 1 轮也遇到过同一个坑）。所以所有边界都放在浮层的 surface 元素内部。

**上游 → 我们的对照表**（`git grep -n createLayerScopedContext v0.7.1 -- packages/core/src` 去掉实现文件和测试后一共 26 个 context。下表 28 行：上游的 `CollapsibleGroupContext` 在我们这里拆成「行为」和「呈现」两份，另外多一行同一族的 `layoutAreaKey`）：

| # | 上游 context | 我们的 provide 键 | 处理 |
| --- | --- | --- | --- |
| 1 | `ButtonGroup/ButtonGroupContext` | `buttonGroupContextKey` | 截断（`null`）——本轮验收要求的那一条 |
| 2 | `ToggleButton/ToggleButtonGroup` | `toggleButtonGroupContextKey` | 截断（`null`） |
| 3 | `SegmentedControl/SegmentedControlContext` | `segmentedControlContextKey` | 截断（`null`） |
| 4 | `CheckboxList/CheckboxListContext` | `checkboxListKey` | 截断（`undefined`） |
| 5 | `RadioList/RadioList` | `radioContextKey` | 截断（`undefined`） |
| 6 | `List/ListContext` | `listContextKey` | 截断（`undefined`） |
| 7 | `Collapsible/CollapsibleGroupContext` | `collapsibleGroupKey` | 截断（`null`） |
| 8 | 同上（presentation 那份） | `collapsibleGroupPresentationKey` | 截断（`null`） |
| 9 | `FormLayout/FormLayoutContext` | `formLayoutKey` | 截断（`computed(() => null)`） |
| 10 | `InputGroup/InputGroupContext` | `INPUT_GROUP_KEY` | 截断（`null`） |
| 11 | `Icon/IconDefaultSizeContext` | `ICON_DEFAULT_SIZE_KEY` | 截断（`undefined`） |
| 12 | `Avatar/AvatarSizeContext` | `AvatarSizeContext` | 截断（`null`） |
| 13 | `AvatarGroup/AvatarGroupContext` | `AvatarGroupContext` | 截断（`undefined`） |
| 14 | `Breadcrumbs/Breadcrumbs` | `breadcrumbContextKey` | 截断（`undefined`） |
| 15 | `Chat/ChatContext`（消息） | `chatMessageContextKey` | 截断（`undefined`） |
| 16 | `Chat/ChatContext`（列表） | `chatListContextKey` | 截断（`undefined`） |
| 17 | `Layout/LayoutSlotsContext` | `layoutSlotsKey` | 截断（`emptyLayoutSlots`） |
| 18 | `Layout/LayoutDividerContext` | `layoutDividerKey` | 截断（`computed(() => undefined)`） |
| 19 | —（同一族） | `layoutAreaKey` | 截断（`computed(() => null)`） |
| 20 | `MetadataList/MetadataListContext` | `metadataListKey` | 截断（`null`） |
| 21 | `NavMenu/NavMenuContext` | `navMenuKey` | 截断（`null`） |
| 22 | `DropdownMenu/DropdownMenuContext` | `dropdownMenuContextKey` | **不截断，交 C6**。我们的菜单在同一个组件里渲染行、又 provide 自己那份 context；边界放在它下面会连菜单自己的值一起盖掉。要截断得先把「菜单内容」拆成独立组件，让 provide 落在边界下面。 |
| 23 | `Stepper/StepperContext` | `stepperContextKey` | **不截断**：`Step.vue` 是 `inject(stepperContextKey)`，没默认值，拿不到会报错。重置比泄漏更糟（`Tab` 在浮层里本来也不成立）。 |
| 24 | `TabList/TabListContext` | `tabListContextKey` | **不截断**：同上（`Tab.vue`、`TabMenu.vue` 的 `inject` 没有默认值）。 |
| 25 | `SizeContext/SizeContext` | — | **不适用**：我们没有全局的尺寸 context，尺寸由组件 props 和「组」自己的 context 传（按钮组、换算按钮组已经在 #1/#2 里截断）。 |
| 26 | `Selector/SelectorRowLayoutContext` | — | **不适用**：我们的 Selector 行布局由 props 和内部状态决定，没有这个 context。 |
| 27 | `Table/TableContext` | — | **不适用**：我们的 Table 没有 provide context（布局走 props 和 DOM）。 |
| 28 | `TopNav/TopNavContext` | — | **不适用**：我们的 TopNav 没有这个「槽位」context；`mobileNavKey` 是「我在抽屉里」的接驳标记，不是成员关系，截断会打断它。 |

（表里 21 条「截断」= `scopedProvide.ts` 里的 21 行 `registerLayerScopedContext`。）

**测试**：`layer/scopedProvide.test.ts` 6 条，其中两条是验收要求的场景：`ButtonGroup size="lg"` / `isDisabled` 里的 Popover，内容里的 Button 是 `md`、`disabled=false`，而触发器仍然是 `lg`；另一条覆盖菜单（`ButtonGroup` 里的 `DropdownMenu` footer 按钮是 `md`、触发器是 `lg`）。反证：把两处 `resetLayerScopedContext()` 注释掉，这两条立刻失败。

### 第 4 件：Toast 在 Dialog 打开时不能跳

**先评估上游的做法（原生 `popover="manual"`），实测结论**（`evidence/2/popover-top-layer-probe.mjs`）：

| 问题 | 实测 |
| --- | --- |
| 原生 popover 能盖在模态 dialog 上面吗 | 能，但**只在它后进顶层时**。先有 toast 再开 dialog，`elementFromPoint` 命中 dialog，toast 被压在下面 |
| 顶层里的 toast 能点吗（不搬进 dialog） | **不能**。把 popover 留在 `body`、dialog 用 `showModal()` 打开时它是 inert 的，`elementFromPoint` 返回 `null` |
| 搬进 dialog 并重新 `showPopover()` 之后 | 能盖住、能点（`hitInsideToast: true`） |
| dialog 上有 transform 时，顶层 toast 会跟着走吗 | 已经定位好的不会（前后位置一致）；**在动画进行中搬进去的会**，而且一直跟到动画结束才弹回 |

所以 (a) 可行，但要加两个前提：搬进 dialog（否则点不到），以及**不要在 dialog 的进场动画里搬**。

**做法**：

1. `styles/toast.css`：视口按 `popover="manual"` 需要清掉引擎给的弹窗默认样式（`inset: auto` 后由定位类定边、`border: 0`、`background: transparent`、`color: inherit`、`overflow: visible`）。
2. `ToastViewport.vue`：
   - 根元素加 `popover="manual"` + `syncTopLayer()`：不支持 `showPopover` 时什么也不做；已经开着就不重复开。
   - 搬运时机：`watch(activeModal)` 时**先** `hidePopover()` + `showPopover()`（把视口垫到 dialog 上面，位置不动），**再**等 dialog 的进场动画跑完（`whenModalSettled`）、再等两帧，才把 `Teleport` 目标切到 dialog。dialog 关闭时立刻切回 `body`。
   - 搬的这一下加 `astryx-toast-viewport--rehosting`：关掉过渡，并把「行的开合高度」和「卡片的起始位移」钉在终值上，持续 250ms 后摘掉。节点搬动等于重新插入文档，`@starting-style` 会把进场动画重放一遍——不钉住的话 toast 会在原位上下跳 8～64px。
3. `layer/modalOutlet.ts` 新增 `whenModalSettled(element, timeout = 600)`：`getAnimations()` 里正在跑的动画全部 `finished` 才算稳定，兜底 600ms；不支持 Web Animations API 时立刻返回。

**浏览器实测**（`evidence/2/browser-check.mjs`，每 50ms 采样一次、共 1 秒，要求位移 ≤ 2px）：

| 场景 | 结果 |
| --- | --- |
| 先显示 toast，再打开 Dialog | 全部采样都在 `608,696`，**位移 0px**；打开后 `elementFromPoint` 命中 toast、且它在 `<dialog>` 里面 |
| Dialog 开着时来 toast | 位移 0px（新 toast 自己的进场动画走完再开始测） |
| 关掉 Dialog 时 toast 不动 | 位移 0px |
| 关掉 Dialog 后 toast 回到右下角 | `inDialog: false`、能点 |

### 第 5 件：台账与交接

- `ledger/B4.md` 的 #6919、#6457 两条结论按现在的实际情况重写（宽度上限真的做了；`layerScopedContext` 那半也做了，并写清哪些 context 不截断、为什么）。
- 写死 `to="body"` 的两处：
  - `Button/ButtonTooltip.vue` → 改用 `useLayerTeleportTarget()`。
  - `Table/TableData.vue` 里那层 `<Teleport to="body">` → 把挂载责任移进 `Table/TableRowMenu.vue`（它自己 `useLayerTeleportTarget()` + `<Teleport :to>`），`TableData.vue` 少 2 行（596 行）。这样和 `DropdownMenu` 一样「菜单自己管挂载」，也不用给贴在行数上限的 `TableData.vue` 加行。
  - 剩下的 `to="body"`（`TimeField`、`BaseTypeahead`、`MoreMenuPanel`×2、`MoreMenuSheet`、`ChatTriggerMenu`、`Tokenizer`）不在 B4 的组件范围，见第 4 节交接清单。

## 2. 和上游的对照

| 上游改动 | 上游怎么做 | 我们怎么做 | 为什么效果一样 |
| --- | --- | --- | --- |
| AST-059 宽度上限（`clampInlineSize`、`maxInlineSizeFallback`） | StyleX 常量拼 CSS，`min(size, 上限)` 写进消费者自己的 style | 一个 TS 函数 + 一个 CSS 变量（`--astryx-layer-max-inline-size`，由 `LayerProvider` 量出 gutter 写上去） | 上限都是「视口减左右两条空隙」；显式宽度、`min-width` 两种写法都被压住 |
| #6457 `layerTextReset` 的落点 | Dialog 两处、ToastViewport、Lightbox、MobileNav、BottomSheetPanel | 同一个清单，加 `.astryx-layer` 类走 `layer.css` 那份重置 | 计算样式一致（实测 5 个属性 + 字号） |
| #6457 `LayerContentBoundary` | `createLayerScopedContext` 把 context 的默认值登记进数组，render 时从外往里套一层 provider | `registerLayerScopedContext` 登记表 + `LayerContentBoundary` 组件（renderless，setup 里重新 provide） | 「进了浮层就整值重置成默认值」，且只在内容里重置、触发器不受影响 |
| #7238 Toast 在 Dialog 之上 | 视口是 `popover="manual"`；全局宿主搬进最新模态框 | 同样：`popover="manual"` + `Teleport` 到最新模态框 | 都能盖住 dialog、都能点 |
| #7238 搬运时机 | 打开 dialog 的 effect 里立刻搬（`useModalOutlet` 注释：「so the modal is already in the top layer when global hosts move into it」） | **刻意晚搬**：等进场动画跑完再搬 | 上游在动画里搬会因为 `transform` 成为 fixed 的参照物让 toast 跳；我们等动画结束，跳的问题不存在 |

## 3. 和计划不一样的地方

1. **`provideLayerScoped(key, value)` 这个 API 没做**。计划里举例的形态是「一个 provide 包装 + 登记表」；实际做成了「key 的默认值集中登记在 `scopedProvide.ts`，`provide` 调用点一律不动」。理由：修复点全在浮层内容根，改 20 多个 provider 调用点是多余改动（选择改动最小的做法）。对外行为一样。
2. **边界是组件，且必须放在真实 DOM 元素内部**（见第 1 节第 3 件的「条件」）。直接挂在 `<Teleport>` 下会在测试清理时崩，这个坑第 1 轮踩过一次。
3. **`dropdownMenuContextKey` 没有登记**，理由见对照表 #22，已写进台账并交给 C6。
4. **Toast 搬进 Dialog 的时机被推迟到 dialog 进场动画结束后**（最多 400ms，`prefers-reduced-motion` 下几乎是 0）。代价是这段时间里 toast 虽然看得见、位置也对，但点不到（它在 dialog 外面、处于 inert 区域）。换来的是位置完全不跳，这是本轮验收的硬指标。上游是立刻搬、接受跳动，所以这一点我们和上游不一样，写在了第 5 节。
5. **`DropdownMenu.vue` 的 diff 比实际改动大**：为了把边界放进 surface 元素内部，弹层那一段整体缩进了 2 格（102 行变化）。行数从 516 降到 514，仍满足白名单「只能变短」。顺带把一段英文 JSDoc 收成一行中文注释，腾出行数。
6. **`Selector.vue` 没有加边界**：文件在行数白名单里（584 行，实际 583），加 3 行就超。Selector 列表里只有选项行、没有按钮这类会读成员关系 context 的东西，影响面很小，写进交接清单交 C3。

## 4. 交给 C 节点的清单

### C3 选择器家族（Selector、MultiSelector、Typeahead、Tokenizer）

- `Selector.vue` 的列表浮层内容（`.astryx-selector-listbox` 里的选项区）包一层 `LayerContentBoundary`；文件贴在行数白名单上，先拆一个子组件再包。同理 `MultiSelector.vue`。
- `MultiSelector.vue`、`Tokenizer.vue`、`BaseTypeahead.vue` 的 `<Teleport to="body">` 改成 `:to="useLayerTeleportTarget()"`（Selector 已经接好）。

### C4 搜索类（PowerSearch）

- `PowerSearch.vue` 的列表浮层加 `LayerContentBoundary`，`to="body"` 改成挂载点（`useAnchoredListbox` 已经把 `position` 给出去了，把 `teleportTarget` 一起返回即可）。

### C6 菜单家族

- `dropdownMenuContextKey` 的截断：把「菜单内容」从 `DropdownMenu.vue` / `DropdownMenuSubMenu.vue` 里拆成独立内容组件，把 `provide(dropdownMenuContextKey, …)` 放进内容组件内部，然后在 `scopedProvide.ts` 里加一行 `registerLayerScopedContext(dropdownMenuContextKey, undefined)`。做完之后菜单内部的嵌套就不会继承外层菜单的 `closeMenu` / `drillIn`。
- `MoreMenuPanel.vue` 的两处 `to="body"`（314、375 行）、`MoreMenuSheet.vue` 的一处（209 行）改成挂载点；`MoreMenuPanel.vue` 的浮层内容加边界。

### C7 浮层家族（Toast、Chat、TimeInput）

- `Chat/ChatTriggerMenu.vue`（113 行）、`TimeInput/TimeField.vue`（350 行）的 `to="body"` 改成挂载点，内容加边界。
- Toast 视口的顶层行为（`popover="manual"`、`whenModalSettled`、`--rehosting` 类）已经做完；后续要改 Toast 动画时注意：搬运期间 `transition-property` 是被关掉的，`@starting-style` 的起始值被钉在终值上，所以「新 toast 进场」和「搬运」两条路径要分开看。

## 5. 自测结果

| # | 自测项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | `env -u NODE_ENV pnpm vitest run --maxWorkers=2`（全量） | 过 | 246 个文件、3294 条用例 |
| 2 | `NODE_ENV=production pnpm vitest run --maxWorkers=2` | 过 | 246 个文件、3294 条用例，用例数相同 |
| 3 | `NODE_ENV=development pnpm vitest run --maxWorkers=2` | 过 | 同上 |
| 4 | `env -u NODE_ENV pnpm check:packages` | 过 | 包边界、路径大小写、生成文件同步、CLI 生成检查、行数上限、`!important` 检查全部通过 |
| 5 | `env -u NODE_ENV pnpm lint` | 过 | `eslint . --max-warnings 0` 无输出 |
| 6 | `env -u NODE_ENV pnpm typecheck` | 过 | 根 tsconfig + core + cli + docs 全 Done |
| 7 | `env -u NODE_ENV pnpm build`（= `build:packages` + `docs:build`） | 过 | 构建 31.46s 完成 |
| 8 | `env -u NODE_ENV pnpm lint:pkg` | 过 | 发布清单检查通过 |
| 9 | 浏览器实测（`browser-check.mjs`，套 `browser-lock`，同一时刻只开 1 个浏览器） | 13/13 过 | 见第 1 节第 4 件的表和第 1、2、3 件的实测数字；截图在 `evidence/2/` |
| 10 | 单文件 ≤ 500 行 | 过 | 新文件最大 233 行（`ToastViewport.vue`）；`DropdownMenu.vue` 514（白名单 517）、`TableData.vue` 596（白名单 598）、`Selector.vue` 583（白名单 584）都比记录短 |
| 11 | 没有 `!important` | 过 | `node scripts/check-no-important.mjs` 通过 |

## 6. 拿不准的地方

1. **Toast 点不到的窗口**：dialog 打开后的约 400ms 里（`prefers-reduced-motion` 下几乎为 0），toast 看得见、位置对，但点不到（还在 dialog 外面）。如果验收要求「一打开 dialog 就能点 toast」，只能改成上游那样立刻搬、接受位置跳动（实测 64px、约 150ms）。我按「位置不跳」优先，请总控确认这个取舍。
2. **`whenModalSettled` 的 600ms 兜底**：如果某个 dialog 的进场动画被外部改成更长的（或者被 pause），移动会等到 600ms 封顶。正常 400ms 的动画不受影响。
3. **`--rehosting` 期间（250ms）关掉了过渡**：这 250ms 里如果恰好有一条新 toast 进场，它不会做滑入动画（直接出现）。极端时序，肉眼基本看不到。
4. **`TabListContext` / `StepperContext` 没截断**：理由是读者的 `inject` 没有默认值、拿不到会崩。如果以后给它们补了默认值，可以照对照表补上两行登记。
5. **`layer.css` 需要随样式表一起加载**：五个浮层根用的是 `.astryx-layer` 类，类本身在 `styles/layer.css` 里。按组件单独引样式、不引 `styles.css` 的用法下，文字重置不会生效（第 1 轮就是这个约定，本轮没有改）。文档站的示例和 `pnpm visual` 走的都是 `styles.css`，不受影响。

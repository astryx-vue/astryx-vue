# B3 验收报告 · 第 1 轮

结论：通过（17/17）

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/B3`，分支 `sync/b3-interaction`，提交 `0717b54`。
- 比较基点：`BASE = 2e7f0a630972726ffc396ac0dbedf0abbb0c4881`（`git merge-base HEAD swarm-tree`，等于 `HEAD~3`）。实现者的提交是 `c08dee2`、`c827d0b`、`0717b54`。
- 临时文件和截图：`/tmp/verify-B3/`。测试、截图、浏览器脚本都是我自己重新写、重新跑的，没有用实现者留下的产物。实现者的 harness 页面（`main.ts`、`index.html`）我拷到 `/tmp/verify-B3/harness` 里用，探测脚本是我自己写的。
- 只读检查：开始和结束时 `git status --short` 都是空，两次相同。
- 临时改动：
  - 在工作区里放过 4 个临时测试文件（`zz-verify-b3*.test.ts`），已经移到 `/tmp/verify-B3/tmp-tests/`，工作区里没有残留。
  - 为了对比 BASE 的 `ours.png`，在 `/tmp/verify-B3/base-wt` 建过一个 BASE 的临时 worktree，已用 `git worktree remove` 删掉。
  - `git worktree list` 里现在多出的 `/private/tmp/verify-B1/base` 是 B1 验收者的，不是我的。
- 浏览器：每次都走 `browser-lock.mjs run` 或 `pnpm visual`，同一时刻只开 1 个。文档站只用 5172 端口，结束后 `lsof -i :5172` 没有监听，两个锁槽都是「空闲」。机器上有一个存活 2 天 20 小时的 Chrome for Testing 进程（PID 53886，父进程为 1），不是我启动的，我没有动它。

## 逐条结果

| # | 检查项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | 按压模型（触屏） | 过 | 我写的临时测试（两种 NODE_ENV 都过）：粗指针 pointerdown 160ms 后 `data-astryx-press="on"`；移出 10px 外立即清除，之后 pointerup 不再亮；元素内 pointerup 进入 `fading`，250ms 后属性消失；pointercancel 立即清除。「点击」是浏览器原生 click，状态机不接管。浏览器里我自己跑 harness（CDP 触摸，`pointer: coarse` 为 true）：60ms 时没有属性，350ms 为 `on`，抬手为 `fading`，淡出后为 null，log 为 `["click:p1"]`；按住后滑出：属性消失，log 为 `[]`，没有 click。上游 `utils/pressFeedback.test.ts` 的三条对照：`paints the row after the delay, not before` 对应「等满 150ms 才亮」；`clears on pointercancel…` 对应「pointercancel 时清掉」；`clears when the finger travels past the slop…` 对应「手指挪过容差就清掉」。三条在 `usePressFeedback.test.ts` 里都有。另有 `pressGesture.test.ts` 的 150/10/100/200/150 常量断言。 |
| 2 | 按压覆盖悬停 | 过 | `pressable.css` 里 `.astryx-pressable…[data-astryx-press]::after` 用背景图片覆盖，并带 `:where(:not(:disabled,…))`；默认类本身没有悬停层，所以不会盖过按压。组件自己画悬停时，由回报里「交给 Cx」通用步骤 4（按压分支放在 `:hover` 之后）负责。上游 #5516 也是组件样式层的事。**没有自动化测试**，因为测试环境不渲染 CSS，只能靠看实现，列入改进建议。 |
| 3 | 菜单按压和悬停（5 个场景） | 过 | ① 按下就打开：`useMenuPress.test.ts`「鼠标按下就打开，这次手势的 click 不会再切换」，状态机里是 `menuPressGesture.test.ts` 的「鼠标按下触发器立刻打开」。浏览器里鼠标按下后菜单已显示。② 按住拖到某项松开执行：「从触发器拖进菜单、在某一行上松开：执行它」，浏览器里 mouse log 为 `["triggerPress:mouse","select:Beta:detail0"]`，触屏为 `["triggerPress:touch","select:Gamma:detail0"]`。③ 悬停后点击不误关：`useMenuHover.test.ts`「悬停打开后马上点一下：不关，钉住并把焦点移进菜单」。④ 悬停中被禁用：同文件「悬停等待期间被禁用 / 排好的打开作废，菜单保持关闭」。⑤ 打开的菜单不阻止双指缩放：上游 hook 测试里对应的是「第二根手指结束手势」，我们有「pointercancel、第二根手指都以什么都不执行结束」。我另写了临时测试验证：长按打开后，`touchmove` 被拦；第二根手指落下后 `touchmove` 不再被拦（两种 NODE_ENV 都过）。菜单的 `touch-action: pinch-zoom` 属于组件样式，见「偏离判断」和改进建议。 |
| 4 | 焦点陷阱 | 过 | `useFocusTrap.test.ts`：「焦点没进过陷阱就不还焦点，卸载时也一样」；新增「tab 只在焦点位于陷阱里面时才被拦下」；新增「用指针关掉时，焦点回到触发器但不画焦点环」（断言 `focus({ focusVisible: false })`）。全量 vitest 在 `env -u NODE_ENV` 和 `NODE_ENV=production` 下都是 239 个文件、3223 个用例通过。 |
| 5 | 输入法 | 过 | 临时测试：`useHotkeys` 在 `isComposing:true`、`keyCode:229` 时不响应，普通 `k` 响应 1 次；`useTypeahead` 在两种情形下返回 false 且不匹配，普通 `b` 匹配到下标 1。两种 NODE_ENV 都过。`internal/ime.ts` 的判断是 isComposing、keyCode 229、key 为 `Process` 三者任一。上游只判前两个，我们是超集。 |
| 6 | 滚动锁定 | 过 | 单元：`scrollbarGutter.test.ts` 和 `useScrollLock.test.ts` 覆盖锁定、解锁恢复、嵌套只还原一次。浏览器：英文 Dialog 页，给 `html` 加 15px 经典滚动条，点内联预览的 Accept 打开真正的 Dialog。打开前 `clientW=1085, bodyW=1085, h1Left=284`；打开时 `clientW=1100, bodyW=1100, h1Left=284, gutter="stable", bodyOverflow=hidden, paddingRight=15px`；关闭后回到 `1085/1085/284`，gutter、overflow、padding 都为空。内容位置 `h1Left` 全程是 284，没有左右跳。这个 Chromium 配置下 gutter 没让根元素宽度保持 1085，是兜底的 `padding-right` 补上了，符合 `scrollbarGutter.ts` 的设计。截图 `/tmp/verify-B3/shots/dialog-open.png`。 |
| 7 | 平台判断 | 过 | grep `navigator.platform`、`userAgentData`：源码里只在 `composables/internal/platform.ts` 出现。`Kbd/platform.ts` 只做重导出，`useHotkeys` 直接引 internal。其余 `navigator.userAgent` 只有 `CodeBlock.vue`（判断 Safari）和 `volumeAnalyser.ts`（判断 iOS），不属于「是不是 Apple 平台」，上游也同样保留。临时测试：client hints 为 `''`、`'Unknown'`、`undefined` 时都是 `unknown`；hints 为空时按 `navigator.platform` 回退，`MacIntel` 为 true，`Linux x86_64` 为 false。 |
| 8 | 禁用状态 | 过 | 实现：`useMenuHover` 的所有处理函数都先看 `isEnabled()`，被禁用时排好的打开作废。浏览器：Button 文档页的禁用按钮，鼠标悬停前后背景色都是 `rgb(235,235,235)`，没有悬停效果；`cursor` 是 `not-allowed`，和上游的 `default` 不一致。这是组件样式层的事，回报「禁用状态」一节明确交接，写了 9 处 `not-allowed`，我 grep 核对是 8 个 css 文件共 9 处（token.css 2 处），清单属实。 |
| 9 | E3 交互契约 | 过 | `git diff 2e7f0a6 HEAD --stat -- packages/core/test-support`、`known-failures`、`ssr*`、三个 `*.a11y.test.ts`：差异为空。全量 vitest 里三个 a11y 测试和 SSR 冒烟全过，已知失败名单没有变。 |
| 10 | SSR 冒烟 | 过 | 仓库里的 `ssr-smoke.test.ts` 在全量里通过。我另写了 `// @vitest-environment node` 的临时测试，确认 `typeof document === 'undefined'`，再逐个 import 16 个模块（interactionModality、pressFeedback、gestureCounter、strayClick、platform、ime、focusReturn、scrollbarGutter、scrollOwnerRegistry、useMenuHover、useMenuPress、usePressFeedback、useScrollLock、useScrollableArea、useFocusTrap、composables/index），都不报错。调用 `trackInteractionModality()`、`installPressFeedback()()`、`currentGesture()`、`holdScrollbarGutter().settle()` 在无 document 下不抛错；模态答 `keyboard`。两种 NODE_ENV 都过。 |
| 11 | 签名变了的 composable | 过 | grep 调用方：`useMenuPress` 只有 `ContextMenu.vue`，传的 `isEnabled: () => boolean` 仍兼容，用的是 `menuPress.onPointerDown` 和静态 `data-astryx-menu-press`，没有人 `v-bind` 整个 `menuProps`。`usePressFeedback` 在全库没有组件调用。`useScrollableArea` 只有 `ScrollableArea.vue`，其源码没变，测试全过。`Chat/ime.ts`、`Chat/modality.ts`、`MultiSelector/interactionModality.ts` 的调用方（`ChatComposer.vue`、`ChatComposerInput.vue`、`MultiSelector.vue`）都只改了一行 import。视觉：`pnpm visual ChatComposer` 和 `pnpm visual MultiSelector`，各 4 个组合，B3 和 BASE 的 `ours.png` 逐像素比对，8 个组合 `diffPixels=0`（`/tmp/verify-B3/cmp.mjs`）。MultiSelector 的 mobile-light 第一次上游站超时，重跑得到 0 差异。 |
| 12 | 卸载时清理干净 | 过 | spy `document`/`window` 的 `addEventListener`/`removeEventListener`，挂载后卸载：按压控制器（document 和 window 上各自加减次数相同）、`useHotkeys`（window 上 `keydown` 加 1 减 1）、`useScrollLock`（次数相同，`body.style.overflow` 回到空）、`useMenuPress` 按到一半卸载（`pointermove` 加 1 减 1，`blur` 对等）都对等。`useFocusTrap` 净增 2 个监听，我连续挂载卸载 3 次，净增量始终是 `[2,2,2]`，不增长；那两个是交互模态常驻的 `pointerdown`、`keydown`，设计如此，上游 `interactionModality.ts` 同样「监听一直留到页面结束」。两种 NODE_ENV 都过。 |
| 13 | 台账 | 过 | `ledger/B3.md`：`[x]` 62 条，`[ ]` 0 条，每条都有结论。抽 6 条：已采纳 #5219（`scrollbarGutter.ts` 存在，浏览器实测）、#6904（`useMenuHover.test.ts` 有对应用例）；交给 Cx：#6905（`useAnnounceRenderedText` 只服务 Selector 空状态，属组件层）、#5335（9 处 css 在组件里）；交给 B6 或不适用：#6118（`useListFocus`、`useGridFocus` 没有 `isRtl` 选项，`useListFocus.ts` 只有内部的 `isRtlElement`，成立）、#5681（有「焦点没进过陷阱就不还焦点」测试，成立）。另核对 #5346（`onEscape` 为空时不吃 Escape，`useListFocus.ts:338`）、#5266（`useMergedRefs.ts` 存在）、#6682（`isHiddenWithin` 存在），理由都成立。 |
| 14 | 「交给 Cx」清单可操作性 | 过 | 读了 C6 和 C2 两组。C6：`useMenuPress` 的接入代码块可以直接照抄，涉及的 `isTriggerClickFromPress`、`cancel`、`menuProps`、`triggerProps`、`isMenuPressActivation`、`layer/focus.ts` 的 `getFocusables`、`internal/useMenuHover.ts` 都在代码里；`dropdown-menu.css` 写 `pan-y`、`context-menu.css` 写 `none/pan-y` 与实际一致。C2：通用 4 步给了具体 CSS 选择器和验收方法（hasTouch，按下 150ms 后出现 `data-astryx-press="on"`）；Slider 用 `isKeyboardModality()` 也有路径。有两处小瑕疵，见改进建议。 |
| 15 | 全量 vitest 两种模式 | 过 | `env -u NODE_ENV pnpm vitest run --maxWorkers=2`：239 个文件、3223 个用例通过。`NODE_ENV=production`：239 个文件、3223 个用例通过。用例数相同。 |
| 16 | `pnpm check` | 过 | `env -u NODE_ENV`，其中 test 换成 `pnpm vitest run --maxWorkers=2`：`check:packages=0, lint=0, typecheck=0, test=0（3223 个用例）, build=0, lint:pkg=0`。 |
| 17 | 文件行数与越界 | 过 | `check:packages` 里的 `check-line-limit` 通过。新增和改动的源码最大 `useMenuPress.ts` 347 行、`pressFeedback.ts` 297 行。`MultiSelector.vue` 763 行是 BASE 就有的，本次只改 1 行 import，没有变大。`git diff 2e7f0a6 HEAD --stat` 对 `layer/`、`Layer/`、`utils/`、`types/`、`test-support` 的差异为空，组件只有回报列的调用方最小修复。 |

## 看图

| 图 | 看到的内容 |
| --- | --- |
| `/tmp/verify-B3/vis-b3/ChatComposer/desktop-light/ours.png` | 912×513，浅色。灰底，中间一个白色圆角输入框，占位文字「Type a message...」，右下角灰色圆形发送按钮。没有空白、骨架或报错覆盖层。和 BASE 同名图 0 像素差。 |
| `/tmp/verify-B3/vis-b3/MultiSelector/mobile-dark/ours.png` | 708×640，深色。深灰底，标签「Columns」，下面一个选择框，显示「2 selected」和下拉箭头。渲染正常，和 BASE 0 像素差。 |
| `/tmp/verify-B3/shots/dialog-open.png` | 1100×700，深色。打开的「Terms and Conditions」Dialog，居中，右上角有关闭按钮，正文带滚动截断，背景页面被遮罩压暗，没有错位或报错覆盖层。 |

## 对实现者偏离计划的判断

1. **`useMenuHover` 等放在 `composables/internal/`，不公开导出：合理。** 上游的 `hooks/index.ts`、`src/index.ts` 里没有导出 `useMenuHover` 和 `useFocusReturnVisibility`（我 grep 过），导出反而会新增公开 API。C6、C13 按路径引用即可，风险低。
2. **`useScrollLock` 只补 gutter，不改 `position:fixed`：合理。** 浏览器里已确认内容不跳（`h1Left` 全程 284），解锁后完全还原。`position:fixed` 是上游为 iOS Safari 做的，会改变 Dialog、BottomSheet、Lightbox 打开时的滚动位置，属于浮层组件行为，总控已决定交给 C7，回报也写了这条交接。风险是 iOS 背景仍可能滚动，这是已知的、明确交接的。
3. **`menuProps`/`triggerProps` 键名改成 `onPointerdown`/`onContextmenu`：合理，结论成立，但回报里的说法有一处不准确。** 我用真实 Vue 挂载验证：`onContextMenu` 触发 0 次，`onContextmenu` 触发 1 次，这条属实。回报说原来的 `onPointerDown` 经过 `v-bind`「虽然也能触发」，实际 `onPointerDown` 也是 0 次（Vue 把它解析成 `pointer-down` 事件），`onPointerdown` 才是 1 次。所以旧写法本来就是死的，改名只会修好问题。现有唯一调用方 `ContextMenu.vue` 用 `menuPress.onPointerDown` 函数，没有 spread，不受影响。文档页 props 已同步。
4. **`usePressFeedback` 默认加 `astryx-pressable` 类，属性从 `data-astryx-pressed` 改为 `data-astryx-press`：合理，没有残留。** 我全仓库 grep `astryx-pressed`（包括 `apps/docs`、`packages/themes`、`packages/core`、`packages/cli`，不含 `.agents-work` 台账文档）：源码、CSS、文档、`catalog.json` 都没有。`git grep` 的 HEAD 里也没有。命中 `pressed=` 的是 ToggleButton、Lightbox、playground 等，那是各自的 `aria-pressed` 或其他变量，和这个属性无关。BASE 里旧名字只出现在 `pressFeedback.ts` 和 `pressable.css` 两处，已全部改掉。全库没有其他组件使用 `astryx-pressable` 类，所以改默认值不会影响现有组件。
5. **删掉三份副本、`ContextMenu/useMenuPress.ts` 改为转发：基本合理，有一处措辞要纠正。**
   - IME 和模态副本：调用方只改了 import，行为是原来的超集（多认一个 `key === 'Process'`）。视觉 0 像素差，相关测试通过。
   - `ContextMenu/useMenuPress.ts`：新实现换成了上游模型，鼠标在菜单行上按下后改为「松开时执行松开位置那一行」，并吞掉浏览器补发的 click。旧实现是鼠标让行自己的 click 去执行。这是行为变化，不是「不变」。但它正好是上游的体验，也是计划要的「按住拖到某一项再松开，执行这一项」，所以我判断合理。测试里把 `mouseup` 改成 `pointerup` 是同一原因，真实浏览器两个事件都会发。ContextMenu 的全部测试通过。

## 不通过的项要怎么改

无。

## 改进建议（不影响结论）

1. **补一条「按压盖过悬停」和「菜单 touch-action」的自动化保障。** 这两件事现在只靠 CSS 和交接清单，没有测试。建议 C 节点接入时，用 `pressed-overlay-cascade` 之类的脚本或浏览器测试补上。尤其注意：目前 `context-menu.css` 的 `touch-action: none`、`dropdown-menu.css` 的 `pan-y` 仍会挡住双指缩放，要等 C6、C3 改成 `pinch-zoom` / `pan-y pinch-zoom` 才和上游一致。
2. **「交给 Cx」清单有两处小缺口。**
   - C2 一节把 Slider 列在「按通用步骤接入按压」里，但上游 `usePressFeedback` 的使用者里没有 Slider（只有 Switch、SegmentedControlItem、CheckboxInput、RadioListItem）。Slider 只该用 `isKeyboardModality()`。
   - IME 的替换清单漏了仍在用内联 `isComposing` 的几处：`CommandPalette.vue`、`PowerSearch/PowerSearchEditor.vue`、`MultiSelector.vue:376`（B3 自己动过这个文件，却没替换）。建议补进对应 C 节点。
3. **回报里关于 `onPointerDown` 的说法**（见偏离判断第 3 条）建议更正，免得后面的人以为旧键名能用。
4. 实现者说「文档站上 DropdownMenu 页本来就有展开的菜单所以读数无意义」，这点我同意，我没有用那个读数当证据，而是用 harness 页验证了鼠标按下就打开的行为。

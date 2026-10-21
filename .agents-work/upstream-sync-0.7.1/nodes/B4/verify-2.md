# B4 验收报告 · 第 2 轮

结论：**不通过**。27 项里第 26 项不过，其余通过（第 27 项只记录）。

第 26 项是第 1 轮留下的老问题，第 2 轮没有解决。按子路径引入时，`layer.css` 根本没被加载，文字重置在所有浮层上都不生效，包括 Popover 和 Dialog。

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/B4`，分支 `sync/b4-layer`，HEAD `7b80d47`。
- 第 2 轮提交是 `8712beb..7b80d47` 共 5 个。BASE 是 `git merge-base HEAD swarm-tree` 的结果 `310dfa2`。
- 临时文件和截图都在 `/tmp/verify-B4-r2/`，脚本和测试页都是我自己写的。
- 开始时 `git status` 为空，结束时也为空，两次一致。
  - 我在工作区里临时放过 `layer/zz_*.test.ts`，跑完全部删掉了。
  - `pnpm --filter @astryx-vue/core build` 生成的 `packages/core/dist` 被 gitignore 忽略。
- 浏览器：每次都走 `browser-lock.mjs run --purpose B4-verify-r2` 或 `pnpm visual ... --out /tmp/verify-B4-r2/...`，同一时刻只开 1 个，文档站只用 5172 端口。收尾时 5172 没有监听，没有残留我起的浏览器进程。
- 测试与 NODE_ENV：vitest 加 `--maxWorkers=2`，测试和构建加 `env -u NODE_ENV`。测试项在 unset、production、development 三种下各跑一遍。

## 逐条结果

| # | 检查项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | Escape 只关最上面一层 | 过（重验） | 390/1024 视口下，Dialog 里分别开 DropdownMenu 和 Selector。第 1 次 Escape 只关菜单，Dialog 还在；第 2 次关 Dialog。菜单在 `<dialog>` 里。脚本 `/tmp/verify-B4/check.mjs` 的副本 `check2.mjs` 全部 PASS。BASE 的表现沿用第 1 轮：同样对，但菜单在 Dialog 外面。 |
| 2 | 点外面只关栈顶 | 过（重验） | 点 Dialog 里菜单外的文字，只有菜单关，Dialog 还开着（DropdownMenu 和 Selector 各一次）。 |
| 3 | 触发器不和自己打架 | 过（重验） | 点触发器关闭后，每 50ms 采样 7 次（350ms）全是关闭；再点一次，打开。 |
| 4 | 视口内边距 | 过 | 第 20 项覆盖了超宽浮层。普通浮层：390 宽下，260px 宽的 Popover 右边距 24px。 |
| 5 | 浮层不继承外部文字样式 | 过（重验） | `font-weight:700; font-size:32px; color:red; letter-spacing:4px; uppercase; center; italic` 的容器里打开 Popover，内容是 `400 / 14px / 非红 / normal / none / start / normal`，行高、缩进、word-spacing、white-space、text-shadow、hyphens 也都被重置。这是在带总 `styles.css` 的页面上测的。按子路径引入时的情况见第 26 项。 |
| 6 | Dialog 内的浮层挂在 Dialog 里 | 过（重验） | 菜单是 `<dialog>` 的后代，菜单项中心的 `elementFromPoint` 命中菜单自己。 |
| 7 | Toast 在 Dialog 之上 | 过（重验） | Dialog 打开后触发 Toast：Toast 在 `<dialog>` 里，`elementFromPoint` 命中它，点关闭按钮后 Toast 消失，Dialog 仍然开着。关 Dialog 期间 Toast 一直在，没有消失。退场中关 Dialog（0/40/80/120ms）和 API 退场后关 Dialog 都没有报错。反复开关 3 次，Toast 还在。 |
| 8 | 关闭栈测试覆盖 | 过（沿用第 1 轮） | 证据：`git diff 8712beb~1 HEAD --stat -- packages/core/src/layer packages/core/src/composables tests`。第 2 轮只新增 `inlineSize`、`modalOutlet`、`scopedProvide`、`LayerContentBoundary` 及它们的测试，`dismissStack.ts`、`useLayer.ts`、`useTouchTrigger.ts`、`mount.ts` 都没动。 |
| 9 | 反向检查 | 过（沿用第 1 轮） | 同第 8 项。`dismissStack.ts` 没有改动。 |
| 10 | 监听器只在栈非空时挂 | 过（沿用第 1 轮） | 同第 8 项。 |
| 11 | 并发 show/hide 有测试 | 过（沿用第 1 轮） | 同第 8 项。`useLayer.ts` 没有改动。 |
| 12 | `useTouchTrigger` 有测试 | 过（沿用第 1 轮） | 同第 8 项。`useTouchTrigger.ts` 没有改动。 |
| 13 | 视觉对比 Selector、ContextMenu | 过（重验） | 用 `pnpm visual selector/context-menu --combos desktop-light,mobile-dark --out /tmp/verify-B4-r2/vis-b4/...` 截图，和第 1 轮保存的 BASE 截图（`/tmp/verify-B4/vis-base/...`）逐像素比（pixelmatch，阈值 0.1）。Selector desktop-light 912×513、mobile-dark 708×640，ContextMenu desktop-light 912×513、mobile-dark 708×640，差异像素全部为 0。 |
| 14 | E3 交互契约、SSR 冒烟测试，名单没有变长 | 过 | 在全量 vitest 里通过。`git diff 310dfa2 HEAD --stat` 里没有 `known-failures.ts`、`ssr-known-failures.json`。 |
| 15 | 服务端渲染不碰 `document` | 过（重验） | 临时测试用 `// @vitest-environment node`：动态 import `modalOutlet`、`scopedProvide`、`inlineSize`、`dismissStack`、`mount`，再用 `renderToString` 渲染 `ToastViewport`、`Dialog`、`Popover`，都不报错。unset 和 production 都过，测试文件已删。 |
| 16 | 台账 29 条全勾并写了结论 | 过 | `ledger/B4.md`：29 个 `[x]`，0 个 `[ ]`。抽查 #6919、#6457、#7238、#5039、#6941，结论与代码和实测一致。 |
| 17 | 「交给 Cx」清单 | 过 | `impl-2.md` 第 4 节按 C3、C4、C6、C7 分组，写了文件名和做法，能照着做。小遗漏：`NavDisclosure.vue` 的 `to="body"` 没有在第 2 轮的清单里重复，只在台账 #7238 的结论里。 |
| 18 | 全量 vitest 与 `pnpm check` | 过（重验） | 三种 NODE_ENV 下 `pnpm vitest run --maxWorkers=2` 都是 248 个文件、3322 条通过，用例数相同。`check:packages`、`lint`、`typecheck`、`build`（含 `docs:build`）、`lint:pkg` 退出码全是 0，`check-no-important` 通过。`git diff 8712beb~1 HEAD` 里新增行没有 `!important`。 |
| 19 | 行数与越界 | 过 | `check-line-limit` 通过。第 2 轮新文件最大 `ToastViewport.vue` 约 233 行；`TableData.vue` 596、`DropdownMenu.vue` 514 都没有超过白名单。`git diff 310dfa2 HEAD --stat` 里没有 Theme、`composables/internal`、locale、Icon。 |
| 20 | 超宽浮层两边都留内边距 | 过 | 390 宽视口：`<Popover :width="400">` 左 16 / 右 16；同一个 Popover 设 `alignment="end"` 也是 16 / 16；`DropdownMenu menuWidth=400` 是 16 / 16；SubMenu `menuWidth=400`（悬停打开 flyout）也是 16 / 16。`LayerProvider inset={inlineStart:20, inlineEnd:30}`：上面四项都是左 36 / 右 46，期望值是 36 / 46。700、1024 宽下菜单保持 400px，没有被误压。 |
| 21 | 文字重置覆盖所有浮层根 | 过 | 在 `styles.css` 已加载的页面上，外层 `main` 设粗体、大写、居中、字距 4px、斜体。Toast（在 body）、Dialog 内容、Toast（搬进 Dialog 后）、Lightbox 根、MobileNav 内容、BottomSheet 内容的计算样式都是 `400 / none / start / normal / normal`，没有继承外层。无控制台报错。Lightbox 的 caption 是 `center`，是它自己 CSS 设的，不是继承。 |
| 22 | 浮层内容不继承成员关系 context | 过（带风险提示） | 见下面「第 22 项展开」。 |
| 23 | Toast 在 Dialog 打开时不跳 | 过 | 见下面「第 23 项展开」。 |
| 24 | 台账 #6919、#6457 与实际一致 | 过 | #6919 的结论写了 `inlineSize.ts` 和 CSS 变量，与第 20 项实测一致。#6457 的 21 个 context 与 `scopedProvide.ts` 里的 21 行登记一致，StepperContext、TabListContext、DropdownMenuContext 不截断的理由也写了。`ButtonTooltip.vue` 已改走 `useLayerTeleportTarget()`；`TableData.vue` 已不再写死 `to="body"`，挂载移到了 `TableRowMenu.vue`（`:to="teleportTarget"`）。提示：#6457 说文字重置「覆盖」那几个根，没有写按子路径引入时不生效，见第 26 项。 |
| 25 | 被第 2 轮碰到的 1 到 19 项重验 | 过 | 已重验 1、2、3、5、6、7、13、15、18；其余写了「沿用第 1 轮」并附 diff stat 证据，见上。 |
| 26 | 按子路径单独引入时文字重置生效 | **不过** | 见下面「第 26 项展开」。 |
| 27 | Toast 约 400ms 点不到的取舍 | 记录，不影响结论 | 见下面「第 27 项展开」。 |

## 第 22 项展开

**对照表**：`impl-2.md` 第 1 节「第 3 件」有 28 行对照，每个上游 context 都写了「截断」或「不适用 + 理由」。

- 上游 `createLayerScopedContext` 的用处我用 `git grep` 在 `v0.7.1` 上数过，一共 26 处，和表里的上游列对得上。
- 21 个截断，与 `scopedProvide.ts` 的 21 行 `registerLayerScopedContext` 一致。

**实测**（390/1024 视口，浏览器）：

| 场景 | 结果 |
| --- | --- |
| `ButtonGroup isDisabled` 里的 Popover | 触发器 `disabled=true`；浮层里的 `Button` 是 `disabled=false`，`closest('.astryx-button-group')` 为空 |
| `ButtonGroup size=lg` 里的 Popover | 触发器是 `lg`；浮层里的 `Button` 是 `md` |

**测试**：`scopedProvide.test.ts` 有 6 条，包括这两个场景和 DropdownMenu 的 footer 按钮场景。第 2 轮全量测试里都过。

**风险 (4)：TabListContext 和 StepperContext 没有截断。** 我在测试里搭了两个场景，结果成立：

- `TabList` 里放一个 Popover，Popover 里放 `Tab`：这个 Tab 的 class 是 `astryx-tab--size-lg astryx-tab--selected`。它读到了外面 TabList 的尺寸和选中值，并且去外面注册了自己。
- `Stepper activeStep=3 orientation=vertical` 里放一个 Popover，Popover 里放 `Step`：这个 Step 变成 `data-progress="completed" data-orientation="vertical"`，也读到了外面 Stepper 的状态。

这是用户能看见的「继承了外面不该继承的状态」。实现者的理由（`inject` 没有默认值，重置会让 `Tab`、`Step` 读到 `undefined` 后报错）在代码上成立：`Tab.vue:27`、`TabMenu.vue:15`、`Step.vue:21` 都是 `inject(key)` 不带默认值。

但这只在有人把 `Tab`、`Step` 放进 Popover 里时才出现，几乎没有真实用法，所以我不把它记为不过，写进风险。把读者改成 `inject(key, null)` 后再登记即可。`TabMenu` 的下拉自己要读 TabList 的值，所以这一项要小心做。

## 第 23 项展开

脚本用 `requestAnimationFrame` 逐帧记录 Toast 的 `getBoundingClientRect`，共 1.5 秒，要求位移不超过 2px。

| 场景 | 正常动画 | `prefers-reduced-motion: reduce` |
| --- | --- | --- |
| A：先显示 Toast，再打开 Dialog | 32 帧，dx=0 dy=0，一直在 `(608, 696)` | 24 帧，dx=0 dy=0 |
| B：上面 A 之后再关 Dialog | 19 帧，dx=0 dy=0 | 19 帧，dx=0 dy=0 |
| C：Dialog 开着时出现 Toast，再关 Dialog | 20 帧，dx=0 dy=0 | 19 帧，dx=0 dy=0 |

- 两种方式下 Toast 的透明度一直是 1。
- 动画结束后 Toast 在 `<dialog>` 里，`elementFromPoint` 命中它。
- 关 Dialog 后 Toast 回到 `body`。
- 控制台无报错。

**其他风险点的判断**

- (2) `whenModalSettled` 有 600ms 兜底：代码上成立，只在 Dialog 进场动画被改到比 600ms 更长时才会提前搬、产生跳动。默认 400ms 的动画不受影响，**不构成问题**。
- (3) rehosting 期间关掉了过渡：我在窗口内实测。
  - 在 Toast 刚搬进 Dialog 时点 Toast 的关闭按钮：413ms 后消失，正常。
  - 在窗口内再来一条新 Toast：新 Toast 直接出现在 `(608, 696)`，旧的两条在 568、632，堆叠正确，透明度都是 1。只是少了滑入动画。
  - 这是视觉上的小差异，**不构成问题**。

## 第 26 项展开

**方法**

1. 先运行 `env -u NODE_ENV pnpm --filter @astryx-vue/core build`。
2. 在 `/tmp/verify-B4-r2/sub` 起一个最小 Vite 页面，`node_modules/@astryx-vue/core` 软链到 `packages/core`，`themes` 也软链过来。
3. 页面里只做这几件事：
   - `import '@astryx-vue/themes/neutral.css'`；
   - 只按子路径引入 `Button`、`Popover`、`Dialog`；
   - 不引入 `@astryx-vue/core/styles.css`。
4. 外层 `body` 设置 `font-weight:700; text-transform:uppercase; text-align:center; letter-spacing:4px; font-style:italic`，然后点开 Popover 和 Dialog。
5. 对照组：同一页面加 `import '@astryx-vue/core/styles.css'`。

**结果**

| 页面 | Popover 内容的计算样式（粗细 / 字距 / 大小写 / 对齐 / 斜体） | Dialog 根（`astryx-dialog astryx-layer`）的计算样式 |
| --- | --- | --- |
| 只按子路径引入 | `700 / 4px / uppercase / center / italic`（全部继承了外层） | `700 / 4px / uppercase / center / italic`（全部继承） |
| 加上总 `styles.css` | `400 / normal / none / start / normal` | `400 / normal / none / start / normal` |

- 对照组说明测试页本身没问题：加上总 `styles.css` 后重置就生效了。
- 原因：
  - `packages/core/styles/layer.css` 只被 `styles.css` 里的 `@import './styles/layer.css'` 引入。
  - 在 `packages/core/src` 里 grep `layer.css`，没有任何组件 import 它。
  - 构建产物 `dist/` 里也没有。`Popover.vue` 只 import `popover.css`，`Dialog.vue` 只 import `dialog.css`。
- README 第 31 行写「Import each component from its own subpath. That entry loads the matching structural styles.」按这个推荐方式用，所有浮层根（Popover、Tooltip、HoverCard、菜单、Dialog、Toast、Lightbox、MobileNav、BottomSheet）都拿不到文字重置。
- 实现者在 `impl-2.md` 第 6 节第 5 条自己承认了。
- 判定：不过。

**怎么改（只给方向）**：让每个浮层根所在组件的样式入口都能带上这份重置。可选做法有两种：

- 在 `LayerContentBoundary`、`Dialog`、`ToastViewport`、`Lightbox`、`MobileNav`、`BottomSheetPanel`、`Popover`、`Tooltip`、`HoverCard`、菜单这些浮层组件里 `import '../../styles/layer.css'`。
- 把重置规则拆进各组件自己的 css。

改完以后，再用同一个最小页面验证。

## 第 27 项展开（只记录）

**我测到的情况**（正常动画，Toast 先显示，再打开 Dialog，逐帧记录 `elementFromPoint`）：

| 阶段 | 起止 | 状态 |
| --- | --- | --- |
| Toast 在 body 里，Dialog 打开前 | 0–292ms | 能点到 |
| Dialog 打开，进场动画中 | 292–820ms（约 530ms） | Toast 看得见、位置不变，但点不到 |
| 搬进 Dialog 后 | 820ms 起 | 能点到 |

`prefers-reduced-motion` 下点不到的时间只有约 55ms（236–290ms）。

**判断**

- 这 0.5 秒里 Dialog 正在从无到有进场，用户的注意力在 Dialog 上，一般不会同时去点一个后台 Toast。
- 上游立刻搬运，代价是 Toast 在原位上下跳 64px 左右，约 150ms。上游的跳动是眼睛能看见的，这里的「点不到」多数人不会发现。
- 从「用户感受和上游一致」看，上游的行为更接近「立刻能点，但会跳」，我们是「不会跳，但半秒内点不到」。用户的感受是：我们的更平稳，上游的更灵敏。两边都有取舍，不能说谁更一致。
- 建议：保留现在的做法，把这个取舍写进 C7 的交接清单（`impl-2.md` 已经写了）。

## 其他观察（不影响结论）

- 文档站/测试页的控制台里有 Vue 警告 `Extraneous non-props attributes (data-testid) ... teleport root nodes`，是我的测试页给 `Popover` 传了 `data-testid`。在 BASE（`310dfa2`）上同样出现（BASE 6 条，B4 7 条，多出的一条是 Dialog 里的那个 Popover 多报了一次）。我没有深究这多出的一条，对用户行为没有可见影响。
- 浏览器检查里的 PASS/FAIL 我已经把这条警告过滤掉，再看其余报错：没有。
- 第 20 项里我第一版脚本把 SubMenu 判成失败，是脚本在点击 flyout 的行时被已经打开的 flyout 挡住了，用悬停重测后通过。结果以悬停重测为准。

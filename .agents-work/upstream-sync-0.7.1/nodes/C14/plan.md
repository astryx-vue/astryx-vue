# C14 布局与容器 · 执行计划

## 目标

布局组件和上游 v0.7.1 用起来一致。调整大小时：Enter 和双击恢复折叠前的尺寸；折叠后只有「变大」方向键会展开；有吸附点时方向键在吸附点之间跳；没有配置上限时，读屏仍能读到一个最大值，但 End 不会乱跳；使用者自己写的 `@keydown` 会和内置按键一起触发；手柄方向和区域方向不一致时，开发环境打一条警告；从右往左排版时，抓取区仍盖在握把上。工具栏中间槽不再裁切内容。禁用的可选卡片仍能用键盘聚焦。数字 `0` 作为分隔线标签会显示出来，并成为无障碍名称。

## 工作环境

- 工作区：当前云端仓库 `/workspace`，分支 `sync/c14-layout`。总控在云端派活，不使用本机 worktree 路径。
- 动手前已读：
  - `.agents-work/upstream-sync-0.7.1/SWARM.md`
  - `ROADMAP.md` 的 C14 行
  - 台账 `.agents-work/upstream-sync-0.7.1/ledger/C14.md`（107 条）
  - `nodes/A3/impl-1.md` 第 4 节
- 上游源码：`/tmp/astryx-upstream`，标签 `v0.7.1`（浅克隆）。
- 环境纪律：测试和检查命令前面加 `env -u NODE_ENV`；vitest 加 `--maxWorkers=2`。
- 浏览器：本轮以组件测试锁住行为。不另开文档站。

## 上游这条改动让用户看到或感受到了什么

| 上游改动 | 用户看到或感受到的变化 |
| --- | --- |
| A3 差距 1，`f11eb6d09` | 没写最大尺寸时，分隔条仍报 `aria-valuemax`：没容器时用窗口宽（竖向用高），百分比上限正在观察容器时用容器内容盒。服务端首屏不带这个属性，注水后再出现，避免对不上。比当前尺寸还小的窗口不会把最大值报得比最小值还低。End 只在真的配置了最大值时才跳。 |
| A3 差距 2 | 手柄 `direction` 和 `useResizable` 的方向不一致时，开发环境警告一次。手写的 props 没带方向时不警告。 |
| A3 差距 3，`458a74c2a` | 可折叠区域按 Enter 或双击，展开时回到折叠前的尺寸，不是最小值。没有注册折叠控制的手写 props 仍退回到「收到最小值」。 |
| A3 差距 4，`cbafe4ad4` | 折叠后，只有让面板变大的方向键会展开，展开到「最小值加一步」和折叠阈值里较大的那个。变小的方向键不动。反向布局和从右到左时，变大的方向跟着翻。 |
| A3 差距 5，`a05bcd24b` | 有吸附点时，方向键跳到相邻吸附点，Shift 跳两个。超出最小或最大的吸附点算作那个边界。面板只能停在吸附点上。 |
| A3 差距 6 | 使用者写在 `ResizeHandle` 上的 `@keydown` 会被调用，然后内置键盘调整照常发生。 |
| A3 差距 7，`3ed227e9b` | 握把不在正中时，抓取区跟握把走同一套物理偏移；6.5px 的居中修正在从右到左时改号，抓取区仍盖住握把。 |
| A3 差距 8 | 上游的 Chromium 无障碍套件依赖 `@astryxdesign/a11y-spec`，本仓库没有这套运行器，归 E3。本轮把同一批用户能感知的分隔条约定写进现有单测。`utils.test.ts` 的子路径导出和 `shippedDirections.test.ts` 的 Storybook 扫描对不上我们的包结构，不照搬。 |
| `490970c7a` | 工具栏中间槽不再 `overflow: hidden`，焦点环和阴影不会被裁掉；中间槽仍可缩到比内容更窄（`min-width: 0`）。 |
| `396e48759` | 方向键只在本工具栏里移动焦点，不进嵌套的另一个工具栏。 |
| `d88274b4b` | 禁用的可选卡片仍可聚焦，用 `aria-disabled`，不用原生 `disabled`。禁用时 Space 和 Enter 不切换。 |
| `8a9d85fdf`、`d990fb58d` | 禁用的可点卡片指针是 `default`，不是 `not-allowed`；禁用时没有悬停和按下的底色。 |
| `33a14a205`、`6203871c7` | 可点卡片、可选卡片、折叠标题在触屏上走 B3 的按压模型：粗指针不用 `:active`，鼠标仍用 `:active`。 |
| `c9dfc7a81` | 分隔线标签为数字 `0` 时仍然显示，并作为无障碍名称。空字符串不显示。 |
| `408cef219` | `Card` 的 `variant` 改成可扩展的 `CardVariantMap`，主题可以用模块扩充加自己的变体名。现有变体名字不变。 |
| 台账里其余已落地的布局行为 | 分边距、宽高比用类上的 `aspect-ratio`（变量写在自定义属性上，使用者的类可以覆盖）、卡片在弹性行里让出宽度、布局内容区滚动条在外缘、折叠箭头可放前面、AppShell 裁切和窄屏时主内容保持挂载，这些现有代码已经做到，本轮核对后在台账标已采纳。 |
| 纯文档、规范、Storybook、主题兼容层、BottomSheet 默认内边距 | 不改变本节点组件的操作。文档和规范标不适用；BottomSheet 交给 C8；主题兼容层交给 B1。 |

## 上游依据

- 台账：`ledger/C14.md` 全部 107 条。
- 上游源码：`packages/core/src/Resizable/ResizeHandle.tsx`、`useResizable.ts`；`Toolbar/Toolbar.tsx`；`SelectableCard/SelectableCard.tsx`；`Divider/Divider.tsx`；`Card/index.ts`；`Collapsible/Collapsible.tsx`。
- 上游测试：`ResizeHandle.test.tsx` 里键盘、`aria-valuemax`、方向警告、RTL 抓取区；`Toolbar.test.tsx` 的中间槽；`Divider.test.tsx` 的数字 0；`SelectableCard` 的禁用仍可聚焦。

## 有没有更适合 Vue 的做法

| 上游怎么做 | 我们怎么做 | 为什么效果一样 |
| --- | --- | --- |
| `useSyncExternalStore` 让服务端快照没有窗口尺寸，注水后再读 `window` | `aria-valuemax` 的窗口尺寸只在 `onMounted` 里读。`renderToString` 不跑 `onMounted` | 服务端 HTML 没有这个属性，挂载后才出现，注水不会对不上 |
| 折叠控制放在模块级 `WeakMap`，不放进导出的 props | 同样用 `WeakMap`，手写 props 没有登记，就退回「收到最小值」 | Enter 对真实 hook 恢复旧尺寸，对手写 props 行为和上游一致 |
| StyleX 在同一条 `transform` 里写 LTR 和 RTL 两个分支 | 抓取区偏移写进样式表，`:is([dir="rtl"] ...)` 把 6.5px 改号 | 从右到左时抓取区仍盖住握把，不依赖内联样式 |
| `onKeyDown` 先调使用者的，再跑内置逻辑 | 先 `invoke` attrs 里的 `onKeydown`，再跑内置逻辑 | 使用者的处理函数会被调用，内置调整不丢 |
| 触屏按压用 StyleX 的 pressable | 复用 B3 的 `usePressFeedback`，组件自己的按下色只在非粗指针的 `:active` 里 | 鼠标按下仍有反馈，触屏走统一按压模型 |

## 任务范围

- 要改：
  - `packages/core/src/composables/useResizable.ts`，以及新的 `resizableChannel.ts`
  - `packages/core/src/Resizable/ResizeHandle.vue`、`resizeKeyboard.ts`、`ResizeHandle.test.ts`、`styles/resize-handle.css`
  - `packages/core/src/composables/useResizable.test.ts`
  - `Toolbar.vue` 的样式和测试
  - `SelectableCard.vue` 和测试
  - `ClickableCard.vue`、`Collapsible.vue` 和 `clickable-card.css`、`collapsible.css`
  - `Divider` 的类型、组件、文档属性表、测试
  - `Card` 的 `CardVariantMap`
  - 分隔条文档里键盘说明里还没写到的吸附点和无上限读屏
  - 台账 `ledger/C14.md`
- 不碰：
  - `ROADMAP.md` 的状态表
  - `verify.md`
  - 生成文件（只通过 `pnpm sync`）
  - BottomSheet、主题包、无障碍浏览器套件（E3）
  - 别的节点的组件

## 开发步骤

1. 写本计划并提交。
2. Resizable：吸附点只能停在点上；登记折叠控制和上报最大值；手柄键盘、方向警告、使用者的 `@keydown`、RTL 抓取区。补测试。提交。
3. Toolbar 中间槽不裁切，并锁住焦点不出本工具栏。提交。
4. SelectableCard 禁用仍可聚焦；可点卡片和折叠标题接上按压模型，禁用指针为 `default`；Divider 保留数字 0；Card 变体图可扩充。提交。
5. 跑 `pnpm sync`。台账 107 条全部打勾并写结论。
6. 两种 `NODE_ENV` 下跑相关测试，再尽量跑 `pnpm check`。
7. 写 `impl-1.md`。PR 的 base 是 `swarm-tree`。

## 自测要求

1. `env -u NODE_ENV pnpm vitest run --maxWorkers=2`，路径覆盖 Resizable、useResizable、Toolbar、SelectableCard、ClickableCard、Collapsible、Divider、Card。
2. `NODE_ENV=production pnpm vitest run --maxWorkers=2` 跑同一组，用例数相同。
3. 尽量跑完整的 `env -u NODE_ENV pnpm check`。检查脚本里的 test 若不受 `--maxWorkers` 控制，就按脚本原样跑；跑不完要在回报里写明停在哪一步。
4. 新写和改到的源码文件不超过 500 行。样式里不用 `!important`。

## 提交与回报

- 分支 `sync/c14-layout`，提交信息用中文。可以分几次提交。
- 不改 `ROADMAP.md` 的节点状态。
- 回报写到 `.agents-work/upstream-sync-0.7.1/nodes/C14/impl-1.md`。
- 最终回复用中文，300 字以内，带 PR 链接。

## 验证操作要短小

每次只跑一组组件测试，命令前加 `timeout`。超时就拆出失败的文件，不原样重跑整组。

# C14 布局与容器 · 第 1 轮实现回报

- 工作区：`/workspace`，分支 `sync/c14-layout`。提交后推送到 `origin`，PR 的 base 是 `swarm-tree`。
- 提交（基于 `1419a29`）：
  - `53a9791` docs: 写下 C14 布局与容器的对齐计划
  - `adb9f1b` fix: 对齐可调整大小的键盘、读屏上限和抓取区
  - `9996c21` fix: 对齐卡片、工具栏、分隔线和折叠的容器行为
  - `63dda72` docs: 勾完 C14 布局与容器的上游台账
  - `869eeb4` docs: 吸附点改为总是停在最近点，并更新 CLI 目录

## 1. 做了什么

1. 写了 `nodes/C14/plan.md` 并提交。没有写 `verify.md`，也没有改 `ROADMAP.md`。
2. Resizable：吸附点总是停在最近点，等距留更靠前的那个。折叠控制和上报的最大值放在 `WeakMap` 里，不进导出的 `ResizableProps`。窗口尺寸只在 `onMounted` 里读，所以服务端 HTML 没有 `aria-valuemax`。手柄先调用使用者的 `keydown`，再跑内置按键。方向不一致时开发环境警告一次。抓取区用 `data-bias`，从右往左时 6.5px 改号。
3. Toolbar：中间槽去掉 `overflow: hidden`，保留 `min-width: 0`。嵌套工具栏的方向键停在自己的边界里。
4. SelectableCard 禁用时用 `aria-disabled`，仍可聚焦，Space 和 Enter 不切换。ClickableCard、SelectableCard、Collapsible 接上 `usePressFeedback`。禁用时光标是 `default`。粗指针不用 `:active`。Divider 的标签接受数字，`0` 会显示并成为无障碍名称。`CardVariant` 改为 `keyof CardVariantMap`。`pnpm sync` 只把 `CardVariantMap` 加进总入口。
5. 台账 107 条全部打勾。
6. 两种 `NODE_ENV` 下跑了布局组件测试，并跑完 `pnpm check`。
7. 写本回报。

| 文件 | 行数 | 职责 |
| --- | --- | --- |
| `packages/core/src/composables/useResizable.ts` | 488 | 尺寸、吸附、折叠、上报最大值 |
| `packages/core/src/composables/internal/resizableChannel.ts` | 33 | 折叠控制和有效最大值的 WeakMap |
| `packages/core/src/composables/internal/resizableStorage.ts` | 45 | `localStorage` 读写 |
| `packages/core/src/Resizable/resizeKeyboard.ts` | 93 | 方向键、Home、End、Enter |
| `packages/core/src/Resizable/ResizeHandle.vue` | 266 | 分隔条、使用者的 keydown、方向警告 |
| `packages/core/styles/resize-handle.css` | 170 | 抓取区偏移，含从右往左改号 |
| `packages/core/src/Card/types.ts` | 112 | `CardVariantMap` |
| `packages/core/src/ClickableCard/ClickableCard.vue` | 94 | 按压模型；禁用时光标与点击 |
| `packages/core/src/SelectableCard/SelectableCard.vue` | 92 | 禁用仍可聚焦 |
| `packages/core/src/Collapsible/Collapsible.vue` | 100 | 标题按压 |
| `packages/core/src/Divider/Divider.vue` | 51 | 数字标签，含 0 |
| `packages/core/styles/toolbar.css` | 67 | 中间槽不裁切 |

## 2. 和上游的对照

| 上游改动 | 上游怎么做 | 我们怎么做 | 为什么效果相同 |
| --- | --- | --- | --- |
| `f11eb6d09` 没配上限时的 `aria-valuemax` | `useSyncExternalStore`：服务端快照没有窗口尺寸，注水后再读 | 只在 `onMounted` 里读窗口。百分比边界才用容器内容盒。比当前尺寸或折叠中的最小值更小的结果会被抬上去 | 服务端 HTML 没有这个属性，挂载后才出现。End 只在真的配置了最大值时才跳 |
| `458a74c2a` Enter / 双击 | 模块级 WeakMap 记住折叠前尺寸。手写 props 没有登记 | 照这个登记方式 | 真实 hook 回到折叠前尺寸。手写 props 仍收到最小值 |
| `cbafe4ad4` 折叠后的方向键 | 只有变大的方向展开，步长取最小值加一步和折叠阈值里较大的 | `resizeKeyboard.ts` 用同一套符号和 RTL 倍数 | 变小的方向键不动。反向和从右往左时变大的方向跟着翻 |
| `a05bcd24b`、`f24d0e9c9` 吸附点 | 尺寸总是停在最近点。键盘跳到相邻点，Shift 跳两个 | 去掉原来的 8px 阈值。键盘按相邻点跳 | 面板只能停在吸附点上。超出边界的点算作那个边界 |
| 使用者的 `@keydown` | 先调外部 `onKeyDown`，再跑内置逻辑 | 过滤 `onKeydown` 和 `onKeyDown`，先调用再跑内置逻辑。禁用时内置逻辑不跑 | 使用者的处理函数会被调用，内置调整不丢 |
| 方向不一致 | 开发环境警告一次 | `devWarn`，每个实例一次 | 手写 props 没带方向时不警告 |
| `3ed227e9b` 抓取区 | StyleX 在同一条 transform 里写两个方向 | `data-bias` 加 `:is([dir='rtl'] ...)`，6.5px 改号 | 从右往左时抓取区仍盖住握把 |
| `490970c7a`、`396e48759` 工具栏 | 中间槽 `minWidth: 0`，焦点边界用 closest | 去掉 `overflow: hidden`。`useListFocus` 已按边界过滤 | 焦点环不被裁掉。方向键不进嵌套工具栏 |
| `d88274b4b`、`33a14a205`、`8a9d85fdf` | `aria-disabled`、pressable、禁用光标 `default` | 复用 B3 的 `usePressFeedback`。`:active` 只在非粗指针 | 禁用卡片仍可聚焦。鼠标按下有反馈，触屏走统一按压 |
| `c9dfc7a81`、`408cef219` | 数字 0 算标签。`CardVariant = keyof CardVariantMap` | 有限数字都算标签。类型改成可扩充接口 | `0` 显示并成为名称。主题可以 `declare module` 加变体 |
| A3 差距 8 | Chromium 套件、`utils` 子路径、Storybook 方向扫描 | 同一批用户能感知的分隔条约定写进 `ResizeHandle.test.ts` | 套件依赖 `@astryxdesign/a11y-spec`，归 E3。包结构对不上，不照搬 |

## 3. 和计划不一样的地方

- 计划把 `resizableChannel.ts` 和持久化放在 `composables/` 根目录。实际放进 `composables/internal/`。根目录的新文件会被 `pnpm sync` 收进公共入口，这两个辅助函数不该变成公共 API。
- 计划里的注水测试原想调用 `hydrate`。Vue 3.5 没有这个具名导出。测试改成 `renderToString` 断言没有 `aria-valuemax`，再在客户端 `mount` 后断言有窗口尺寸。首屏渲染发生在 `onMounted` 之前，注水不会先写出这个属性。
- 读 CSS 源码的测试不用 `new URL(..., import.meta.url)`。Vitest 里这个地址不是 `file:`。改成从 `process.cwd()` 读。
- 文档里还留着「8px 以内才吸附」。行为改完后这句话是错的，所以又改了 resize-handle 和 use-resizable 的中英文说明，并重新生成 CLI catalog。

## 4. 台账处理

一共 107 条。已采纳 43 条，不适用 64 条。

不适用：

- 主题、兼容层、裸 class、派生变量、环境适配：`a1a6a636f`、`ea0483449`、`62bf723ed`、`41950da6a`、`1232b85af`、`6e6b9b476`。归 B1。
- BottomSheet 内边距：`b507cdef4`、`031021b81`。归 C8。
- 浮层宿主、浮层内边距、文字重置：`5db7f15bd`、`4aacbbedc`、`4ec26d757`。归 B4。
- 共享 ResizeObserver、滚动规范、导航协议：`d55751f88`、`bfee8a4a3`、`54be197d0`。归 B3。
- React ref 合并、StyleX 构建：`540f19e62`、`ca8f5292b`。本仓库没有对应机制。
- Drawer 容器：`7189141b9`。本仓库没有这个 lab 组件。
- 文档站预览和上游 prose：`58d4b80c8`、`a13883d2e`、`8449e3823`、`088e039de`、`33ba2b6a8`、`297921949`、`d334c4a19`、`5c396656f`、`41494fcd4`、`b5656ff75`、`3828a31d5`、`f994ddba0`、`a19888426`、`89dbbf7c6`、`05994f898`、`42584aaf8`、`d93c5479f`、`fa93107ff`、`8824ca1ba`、`07d7fc911`、`e074389e9`、`2ffdf8eed`、`7de58fcb4`、`d7ceeac85`、`176dfa624`、`17044ab1e`、`db4e378fa`、`e7723cddf`、`c695d0f3a`、`271692f49`、`5f9be6c18`。
- 上游 spec 和发版记录：`8bf4b5136`、`7d4628128`、`a8d6bf291`、`3714ccb2c`。Grid 的数字列固定、对象形式重排，代码里已经是这样。
- Chromium 无障碍套件和测试工程划分：`1581b0900`、`43f4f7d09`、`af44c3a66`、`22be8db9b`、`f4ae1e7ec`、`d5b123da0`、`664eae9b3`、`2b0123b9c`、`b9f454bef`、`5a184b794`、`655fc299f`。归 E3。分隔条能感知的约定已有单测。
- 横幅关闭按钮命名：`d7c163c1d`。归 B5。

## 5. 自测结果

| # | 自测项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | `env -u NODE_ENV pnpm vitest run --maxWorkers=2`，路径覆盖 Resizable、useResizable、Toolbar、SelectableCard、ClickableCard、Collapsible、Divider、Card，以及 Layout、Grid、Stack、Center、AspectRatio、Section、ScrollableArea、AppShell | 过 | 18 个文件，178 条 |
| 2 | `NODE_ENV=production` 跑同一组 | 过 | 18 个文件，178 条。`vitest.config.ts` 会把 `NODE_ENV` 写成 `test`，两次实际编译模式相同，命令仍各跑了一遍 |
| 3 | `env -u NODE_ENV pnpm check` | 过 | `check:packages`、eslint、typecheck、全量 vitest（263 个文件、3568 条）、build、`lint:pkg` 都退出 0。行数检查通过，没有 `!important` |
| 4 | 视觉对照 | 没做 | 计划写明本轮用单测锁行为，不开文档站。没有在浏览器里点分隔条、工具栏和卡片 |

## 6. 拿不准的地方

- 有吸附点时，拖动和初值都会吸到最近点。这和本仓库原来的「8px 以内才吸」不一样，和上游 v0.7.1 一样。文档已改掉旧句子。
- 手写的 `ResizableProps` 没有 WeakMap 登记。Enter 和双击仍收到最小值，没配上限时也不报 `aria-valuemax`。这是故意跟上游对齐，不是漏登记。

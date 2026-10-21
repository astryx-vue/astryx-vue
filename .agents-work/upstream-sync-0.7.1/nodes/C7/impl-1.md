# C7 浮层家族 · 第 1 轮实现回报

- 工作区：`/workspace`，分支 `sync/c7-overlays`。
- 提交（基于 swarm-tree `0f6f605`）：
  - `10ab42f` docs(C7): 写下浮层家族的执行计划和验收清单
  - `1d35b15` feat(C7): 页眉换肤、安全挂载、悬停卡片拆分和轻提示滑动
  - 本文件在提交「docs(C7): 写下第 1 轮实现回报」里，哈希以 `git log` 为准。

## 1. 做了什么

对话框页眉可以按部件换肤。悬停卡片在上面还有别的浮层时，点外面不关。气泡、工具提示、悬停卡片在段落或按钮里会挂到不安全祖先的外面。轻提示可以顺着所在的边滑掉。`useHoverCard.ts` 降到 500 行，并从行数白名单删掉。滚动锁和 Toast 搬运时机按下面的取舍保持原样。`dismissStack.ts` 没动。

| 文件 | 行数 | 职责 |
| --- | --- | --- |
| `packages/core/src/Dialog/DialogHeader.vue` | 111 | 五个换肤挂点、补偿轴、标题插槽、关闭文案 |
| `packages/core/src/HoverCard/useHoverCard.ts` | 500 | 悬停卡片逻辑；点外关闭先看 `isTop()` |
| `packages/core/src/HoverCard/hoverCardTrigger.ts` | 101 | 触发器角色和 id 合并 |
| `packages/core/src/Toast/useToastGesture.ts` | 302 | 触摸和笔的滑动关闭 |
| `packages/core/src/Toast/Toast.vue` | 207 | 手势、MediaTheme、关闭文案 |
| `packages/core/src/composables/useLayerMountTarget.ts` | 47 | `useResolvedLayerTeleport` |
| `packages/core/src/layer/useHoverLayerDismiss.ts` | 33 | 返回 `isTop()` |
| `packages/core/src/composables/internal/scrollLock.ts` | 66 | 仍是 overflow 锁，注释写明不钉 position |

页眉挂点类和 BEM 类在同一节点上：`astryx-dialog-header`、`astryx-dialog-header-start-content`、`astryx-dialog-header-title-block`、`astryx-dialog-header-end-content`、`astryx-dialog-header-close-icon`。有关闭按钮且没传 `endContentEdgeCompensation` 时，后置槽同时收上下和行末。传 `inline`、`block` 或 `all` 时按这个轴收。标题和副标题可以用插槽。关闭按钮没写名字时走 `messages.dialog.close`。

`useResolvedLayerTeleport`：Dialog 提供了挂载点就用它；否则 `resolveLayerMountTarget` 找到最外层不安全祖先就挂到它外面；安全祖先返回 `null`，浮层仍挂 `body`。HoverCard、Popover、Tooltip、ButtonTooltip 都改用它。

`useHoverLayerDismiss` 用稳定 token 登记关闭栈，并返回 `isTop()`。悬停卡片的文档点外关闭先问这一层是不是最上面。Toast 不进关闭栈。

轻提示滑动在 `useToastGesture`。方向由视口传：贴底向下，贴顶向上。手指和笔认，鼠标不关。阈值是高度的 0.4 和 48px 里较大的那个；甩动是距离超过 48px 且速度大于 1.2。横向、反向、第二指、点在按钮或链接上都不关。内容套 `MediaTheme mode="auto"`。

## 2. 和上游的对照

| 上游改动 | 上游怎么做 | 我们怎么做 | 为什么效果相同 |
| --- | --- | --- | --- |
| #6240 #6415 #6465 页眉挂点 | StyleX theme target，补偿分轴 | 稳定类名加 CSS 负外边距 | `defineTheme` 选中同一批节点，补偿只在有关闭按钮或显式传入时出现 |
| #5039 挂载 | 从触发器往上走到不安全标签外面 | `resolveLayerMountTarget` | 段落里的浮层不拆标签；安全处仍挂 body，避免被 transform 裁切 |
| 最上层 | `isTopmostLayer` | `isTopLayer` | 上面还有层时，点外面不关悬停卡片 |
| #5375 滑动 | `useToastGesture` | 同名 composable，函数 ref | 顺边滑动关闭，横向留给页面 |
| #5299 MediaTheme | `mode="auto"` | 同样包在内容外 | 按卡片底色选深浅 |
| 滚动锁 | `position: fixed` 再 `scrollTo` | 不改，见第 6 节 | 桌面滚动位置不跳；iOS 背景仍可能滚 |
| Toast 进 Dialog | 立刻搬 | 保持 `whenModalSettled`，见第 6 节 | 位置不跳；进场约半秒点不到 |

## 3. 和计划不一样的地方

无。滚动锁和 Toast 搬运都按计划里写好的取舍做，没有改行为。

## 4. 台账处理

`ledger/C7.md` 共 80 条，全部勾上。已采纳 47 条，不适用 33 条。

不适用：

- `a1a6a636f`：主题兼容层由 B1 拆除。
- `1fdecb1ae`：Selector 选项行挂点，归 C3。
- `ea0483449`、`6e6b9b476`：外观嵌套令牌已撤回，归 B1。
- `e891c0dc8`：禁用光标一度是 not-allowed，随后回到 default，归 B2。
- `cea9ecd17`：useListFocus 的 Escape 归 B3。
- `540f19e62`：合并 ref 是 React 的问题。
- `f747a49f2`、`41ab6db2a`：旧挂点名和兼容层归 B1。
- `65dedfe9d`、`516c4541c`：BottomSheet 归 C8。
- `189056a43`：Drawer 归 F3c。
- `12a6e8a83`：手写 CSS，没有 StyleX 简写改写。
- `d4d2151b8`：本库 Tooltip 不用原生 popover 的 show/hide。
- `1581b0900`：测试工程路由。
- `4d2bde2c6`、`9c83d436c`、`ec71b5582`、`e212fdb51`、`980187a16`：Playwright 夹具，同等行为由 vitest 覆盖，菜单夹具归 C6。
- `4773c7825`、`2ad586e5d`：文档标点。
- `c6bea9123`、`f994ddba0`、`a19888426`、`43892489d`、`87a0f717e`、`8bf4b5136`：上游知识库或契约文档，仓库没有这套生成。
- `ea86c8bc1`：上游 playground 默认值。
- `176dfa624`：审查基线路由。
- `655fc299f`：AlertDialog 规范草稿。行为已在组件里。
- `5c3d45821`：ContextMenu 归 C6。
- `2710a135a`：CommandPalette 归 C4。

## 5. 自测结果

| # | 自测项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | `env -u NODE_ENV pnpm exec vitest run --maxWorkers=2` 覆盖 Dialog、AlertDialog、Popover、HoverCard、Tooltip、Lightbox、Toast、`layer/mount.test.ts`、`useScrollLock.test.ts` | 过 | 17 个文件，211 条 |
| 2 | `NODE_ENV=production` 同一命令 | 过 | 仍是 17 个文件、211 条 |
| 3 | `env -u NODE_ENV pnpm --filter @astryx-vue/core typecheck` | 过 | 退出码 0 |
| 4 | eslint 改过的源码 `--max-warnings 0` | 过 | 退出码 0。两个 css 不在 eslint 配置里，没有放进这次命令 |
| 5 | `node scripts/check-line-limit.mjs` | 过 | `useHoverCard.ts` 500 行，已移出白名单 |
| 6 | `node scripts/check-no-important.mjs` 与 `node scripts/sync-exports.mjs --check` | 过 | 退出码 0 |
| 7 | 文档站整页 | 过 | 见下方路径。没有并排上游图 |

没有跑全仓库 `pnpm check`。相关套件、core typecheck、行数、导出和 eslint 已过。

文档站 `http://127.0.0.1:4173`，截完已关。图未进 git：

- `/opt/cursor/artifacts/c7-dialog-header-desktop-light.png` 文档站整页，侧栏和顶栏可见，对话框打开
- `/opt/cursor/artifacts/c7-dialog-header-desktop-dark.png` 文档站整页，深色，对话框打开
- `/opt/cursor/artifacts/c7-dialog-header-390-light.png` 文档站整页，窄屏浅色，对话框打开，顶栏被遮罩压暗
- `/opt/cursor/artifacts/c7-dialog-header-390-dark.png` 文档站整页，窄屏深色
- `/opt/cursor/artifacts/c7-toast-desktop-light.png` 文档站整页，示例里两条常驻提示
- `/opt/cursor/artifacts/c7-toast-390-dark.png` 文档站整页，窄屏深色

## 6. 拿不准的地方

1. **滚动锁不改成 `position: fixed`。** 上游 `hooks/useScrollLock.ts` 把 body 钉成 `position: fixed`，记下 `scrollY`，解锁时 `scrollTo` 回去。注释写的原因是 iOS Safari 不认 `overscroll-behavior`。`nodes/B3/impl-1.md` 第 6 节把这件事留给 C7：钉住 body 会改页面里 `position: fixed` 的参照，放开时的 `scrollTo` 也会在画完之后才把滚动位置拽回去。本库继续用 `overflow: hidden` 加滚动条槽。`useScrollLock.test.ts` 锁定：锁住时 `position` 保持调用前的值，不调用 `scrollTo`。没有 iOS 设备，背景仍可能被带着滚，这是这套锁的边界。

2. **对话框打开后约半秒点不到已有轻提示，保留。** `dialog.css` 进场是 `var(--astryx-duration-medium-max, 400ms)`。`whenModalSettled` 等进场动画结束再把 Toast 视口搬进 dialog，兜底 600ms，然后再等两帧。B4 `verify-2.md` 逐帧记录：大约 530ms 里提示看得见、位置不变、点不到。上游立刻搬，B4 `verify-1.md` 记过会跳，后来对照大约 64px。`prefers-reduced-motion` 时动画是 none，窗口接近 0。本轮没有改 `ToastViewport.vue` 的搬运时机，也没有改 `dismissStack.ts`。

## 给 D7 的说明

对话框关闭按钮没写 `closeButtonLabel` 时，英文是 Close，中文是「关闭」。以前不传名字时不一定跟当前语言走。调用方如果依赖固定英文字符串，需要自己传入。

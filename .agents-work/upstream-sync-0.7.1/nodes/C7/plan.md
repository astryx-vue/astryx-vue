# C7 浮层家族 · 执行计划

## 目标

对话框、提示框、气泡、悬停卡片、工具提示、灯箱和轻提示用起来跟上上游 v0.7.1。对话框页眉能按部件换肤。悬停卡片在上面还有别的浮层时，点外面不把卡片关掉。轻提示可以顺着所在的边滑掉。大文件 `useHoverCard.ts` 降到 500 行以内。

## 工作环境

- 工作区：`/workspace`，分支 `sync/c7-overlays`，从最新 `swarm-tree`（含 B4-fix #142、C15、C6、C2）切出。云端没有本机 worktree，文档站用空闲端口 4173，用完关掉。
- 动手前已读：`SWARM.md`、`ROADMAP.md` 里 C7 那一行和「B4 留下的事」、`ledger/C7.md`、`nodes/B3/impl-1.md` 第 6 节、`nodes/B4/impl-2.md` 第 4 节与 `verify-2.md`、`nodes/B4-fix/`。
- 环境纪律：测试前加 `env -u NODE_ENV`；vitest 加 `--maxWorkers=2`；再以 `NODE_ENV=production` 跑一遍，用例数要相同。
- 浏览器纪律：同一时刻只开一个文档站。截图放 `/opt/cursor/artifacts`，不进 git。

## 上游这条改动让用户看到或感受到了什么

| 上游改动 | 用户看到或感受到的变化 |
| --- | --- |
| #6240 #6415 #6465 | 对话框页眉可以按标题行、前置槽、标题块、后置槽、关闭图标分别换肤。有关闭按钮时，后置槽默认收进一档间距，用来抵消按钮内边距；也可以只收行末或只收上下。标题和副标题能放行内富文本。 |
| #5248 | 没有悬停的设备上，轻点打开工具提示和悬停卡片。 |
| #5375 | 轻提示可以朝它所在的边滑掉。手指和笔都认，横向滑动留给页面，点在按钮或链接上不开始滑。鼠标拖动不关。 |
| #5299 | 轻提示内容按卡片实际底色选深浅。 |
| #5428 | 自定义轻提示布局时，关闭入口不会丢。 |
| #4881 #7225 相关 | Escape 只关最上面一层。悬停卡片上面还有别的层时，点外面不关卡片。 |
| #5039 | 触发器包在段落、链接、按钮里时，浮层挂到那个不安全祖先的外面，避免标签被拆开。安全的祖先仍挂到 `body`，避免被裁切。Dialog 里面优先挂进对话框。 |
| 滚动锁 | 打开对话框时页面滚动位置留在原地，body 不被钉成 `position: fixed`。见下面取舍。 |
| B4 留下的 Toast 窗口 | 对话框进场的大约半秒里，已经出现的轻提示看得见但点不到。本轮评估后保留。见下面取舍。 |

## 上游依据

- 台账条目：`ledger/C7.md` 全部 80 条。
- 上游源码：`packages/core/src/Dialog/`（优先 `DialogHeader.spec.md`）、`Popover/`、`HoverCard/`、`Tooltip/`、`Lightbox/`、`Toast/`（`useToastGesture.ts`）、`hooks/useScrollLock.ts`、`layer/useLayer.tsx` 里的挂载目标、`layer/useLayerDismissal.ts` 里的最上层判断。
- 上游测试：上述目录的 `*.test.tsx`。行为改写成 Vue 测试，不搬 Playwright 夹具。

查上游用 `git -C /tmp/astryx-upstream show v0.7.1:<路径>`。

## 有没有更适合 Vue 的做法

| 上游怎么做 | 我们怎么做 | 为什么效果一样 |
| --- | --- | --- |
| StyleX theme target | 稳定类名 `astryx-<component>-<part>`，和现有 BEM 类并存 | `defineTheme` 的 `targetSelectors` 能选中同一批节点 |
| `renderContent` | 已有的 `content` 作用域插槽，带 `dismiss` | 自定义布局时关闭入口还在 |
| React ref 合并 | 模板 ref 和 composable 返回的函数 ref | 手势能拿到真实元素 |
| 原生 `popover` 顶层 | 继续用 `Teleport` + 固定定位 | 本库气泡不是顶层 popover，挂到 `body` 才能逃出 `transform` |
| `useScrollLock` 的 `position: fixed` | 保持 `overflow: hidden` 加滚动条槽 | 见取舍。iOS 背景仍可能被带着滚 |
| Toast 立刻搬进 dialog | 保持 `whenModalSettled` 再搬 | 见取舍。位置不跳，进场约半秒点不到 |

涉及图标的地方继续用语义名，不引入另一套注册表。

**滚动锁取舍（计划内就定下来）：** 不改成 `position: fixed`。上游注释写明是为了 iOS Safari 不认 `overscroll-behavior`。钉住 body 会改页面里 `position: fixed` 的参照，放开时还要 `scrollTo` 把滚动位置拽回去（`nodes/B3/impl-1.md` 第 6 节）。本库测试锁定：锁住时 body 的 `position` 不变，也不调用 `scrollTo`。没有 iOS 设备，背景滚动记为边界。

**Toast 半秒点不到（计划内就定下来）：** 不改搬运时机，不回退 #142。`dialog.css` 进场默认 `var(--astryx-duration-medium-max, 400ms)`，`whenModalSettled` 默认超时 600ms，再等两帧。B4 `verify-2.md` 实测大约 530ms 看得见、位置不跳、点不到。上游立刻搬会跳大约 64px。`prefers-reduced-motion` 时动画是 none，窗口接近 0。

## 任务范围

- 要改：
  - `packages/core/src/Dialog/`（页眉挂点、补偿、富文本插槽、关闭文案）
  - `packages/core/styles/dialog-header.css`、`toast.css`
  - `packages/core/src/HoverCard/`（拆文件，点外关闭先看是不是最上层）
  - `packages/core/src/Popover/`、`Tooltip/`、`Button/ButtonTooltip.vue`（安全挂载）
  - `packages/core/src/composables/useLayerMountTarget.ts`、`layer/useHoverLayerDismiss.ts`
  - `packages/core/src/Toast/`（滑动手势、MediaTheme）
  - `packages/core/src/composables/internal/scrollLock.ts`（只补决定，不改锁定方式）
  - `scripts/guardrails/line-limit-allowlist.json`（`useHoverCard.ts` 移出）
  - 中英文文档：对话框页眉、对话框、轻提示
  - `ledger/C7.md` 逐条打勾
  - 本目录的 `verify.md`、`impl-1.md`
- 不碰：
  - `layer/dismissStack.ts` 的关闭顺序和三档语义（#142）
  - `ROADMAP.md`、`SWARM.md`
  - BottomSheet、菜单、Selector、CommandPalette
  - 生成文件，除非 `pnpm sync` 确实需要

## 开发步骤

1. 写本计划和 `verify.md`。
2. `DialogHeader` 加上五个换肤挂点，补偿按轴拆开，标题和副标题支持插槽，关闭按钮默认文案跟语言走。
3. `useHoverCard.ts` 把触发器角色判断拆到 `hoverCardTrigger.ts`，主文件降到 500 行以内，从白名单删掉。
4. `useHoverLayerDismiss` 返回 `isTop()`。悬停卡片点外面时，上面还有层就不关。
5. `useResolvedLayerTeleport` 接入 `resolveLayerMountTarget`。Popover、HoverCard、Tooltip、ButtonTooltip 改用它。Dialog 挂载点优先，安全祖先仍是 `body`。
6. 轻提示抽出 `useToastGesture`。内容套 `MediaTheme mode="auto"`。关闭按钮文案跟语言走。视口按上下位置传滑动方向。
7. `useScrollLock` 保持现状，注释和测试写明不钉 `position`、不 `scrollTo`。
8. 台账 80 条写结论。更新中英文文档。跑相关 vitest 两种 `NODE_ENV`、typecheck、eslint、行数、`!important`、导出检查。截文档站整页。

## 自测要求

1. `env -u NODE_ENV pnpm exec vitest run --maxWorkers=2` 覆盖 Dialog、AlertDialog、Popover、HoverCard、Tooltip、Lightbox、Toast、`layer/mount.test.ts`、`composables/useScrollLock.test.ts`，全部通过。
2. `NODE_ENV=production` 同一路径，用例数相同。
3. `env -u NODE_ENV pnpm --filter @astryx-vue/core typecheck`、改过文件的 eslint `--max-warnings 0`、`node scripts/check-line-limit.mjs`、`node scripts/check-no-important.mjs`、`node scripts/sync-exports.mjs --check`。
4. 文档站中文 `/components/dialog-header`、`/components/toast`：桌面与 390px、浅色与深色。页眉示例要打开对话框。图放 `/opt/cursor/artifacts`，能看见侧栏或顶栏。
5. 新写和改到的源码不超过 500 行。`useHoverCard.ts` 不在白名单里。

## 提交与回报

- 提交信息用中文。分几次提交。完成后推送 `sync/c7-overlays`，开 draft PR，base 为 `swarm-tree`。
- 不改 `ROADMAP.md`、`SWARM.md`，不合并。
- 回报写 `nodes/C7/impl-1.md`。滚动锁和 Toast 半秒都要写取舍和证据。
- 最终回复用中文：摘要、取舍、PR 链接。

## 验证操作要短小

每次只测一件事，命令加 `timeout`。浏览器命令套 `browser-lock.mjs run --max-run`。脚本和结果放 `/tmp/c7-*`。

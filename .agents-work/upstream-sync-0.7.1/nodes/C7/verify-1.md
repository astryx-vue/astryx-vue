# C7 验收报告 · 第 1 轮

结论：通过（24/24）

- 工作区：`/workspace`，分支 `sync/c7-overlays`。被验收的代码提交是 `f3c74f72`。
- 比较基点：`BASE = 0f6f6057a18b548b37d4cd42fbea513078bf960e`（`git merge-base HEAD origin/swarm-tree`。本地没有 `swarm-tree` 分支，用的是刚抓下来的 `origin/swarm-tree`，和 `HEAD` 的合并基点就是 #142 那次提交）。
- 临时文件：`/tmp/verify-C7/`。截图在 `/opt/cursor/artifacts/c7-verify/`，没有进 git。图是这轮重新截的。
- 只读检查：开始时 `git status` 是干净的。写这份报告之前再跑一次，仍是干净的。两次相同。`packages/core/dist/` 是构建文档站配置时生成的，已被 `**/dist/` 忽略。
- 没有改业务代码，没有改 `layer/dismissStack.ts`，没有合入。
- 浏览器：`browser-lock` 的 `browser-1`。文档站是 VitePress 开发服务器 `http://127.0.0.1:4173`。测完已停掉，该端口不再应答。锁已空闲。
- 上游同页没有做左右对照。主证据是本库 VitePress 中文文档站整页。

## 逐条结果

| # | 检查项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | 文档站整页，页眉展开，另加轻提示 | 过 | 中文 `/components/dialog-header` 滚到「基础」，点开 Invite teammates。桌面浅色、桌面深色、390 浅色、390 深色各一张。页眉有标题、副标题、关闭按钮。另有一张 `/components/toast` 桌面浅色，滚到「堆叠」并点了 Show toast。侧栏或顶栏都在。见「看图」。 |
| 2 | 页眉换肤挂点和补偿轴 | 过 | 打开的页眉 DOM：`astryx-dialog-header`、`astryx-dialog-header-title-block`、`astryx-dialog-header-close-icon`。有关闭按钮且没传补偿时，后置槽类名同时含 `compensate-block` 和 `compensate-inline`（四张图的页面探测一致）。`DialogHeader.test.ts` 里 `puts theme targets...` 断言 `defineTheme` 的 CSS 含 `.astryx-dialog-header` 和四个短横线类；`inline` 只有行末；没有关闭按钮且不传补偿时两类都没有。该文件在第 20 条的 211 条里。 |
| 3 | 标题副标题插槽、空副标题、关闭文案 | 过 | 中文文档站关闭按钮 `aria-label` 是「关闭」。`renders rich title and subtitle slots, and skips an empty subtitle`：插槽渲染行内内容；`subtitle: ''` 且没有插槽时 `.astryx-dialog-header__subtitle` 不存在。`names the close button in the active language`：默认英文 Close，`zh-CN` 是「关闭」。 |
| 4 | 轻提示顺边滑动 | 过 | 正式套件 `Toast.test.ts`：高度 80 时向下滑 60px（阈值是 `max(32, 48)=48`）关掉，`--_toast-swipe-exit-y` 为 `120%`；横向、第二指、点在关闭按钮上都不关。贴顶方向：`ToastViewport.vue` 在 `placement` 以 `top` 开头时传 `swipeDirection: -1`。临时测试（跑完已删，日志 `/tmp/verify-C7/vitest-flick.txt`）用同一套函数：高度 200、阈值 80 时，60px / 30ms（2 px/ms）关掉且退出量是 `120%`；60px / 60ms（1 px/ms）不关。方向为 -1 时向上滑，退出量是 `calc(-1 * 120%)`；贴底时向上滑不关。公式和上游 v0.7.1 `useToastGesture.ts` 一样，时间用的是毫秒差。 |
| 5 | 上面还有 ignore 层时，点外面不关悬停卡片 | 过 | `useHoverCard.test.ts` 的 `上面还有浮层时，点外面不关卡片`：压上 `dismissOnEscape: 'ignore'` 的层之后点 `document.body`，卡片仍开；这层摘掉后再点，卡片才关。 |
| 6 | 段落外的安全挂载；安全祖先挂 body；对话框挂载点优先 | 过 | `mount.test.ts`：`挂到不安全祖先的外面，安全祖先仍挂到 body` 断言段落里的目标是外层 `#safe`，安全父级是 `body`。`对话框提供了挂载点时，不再搬到段落外面` 断言目标是 `dialog-host`。`useResolvedLayerTeleport` 先看 Dialog 挂载点，否则才 `resolveLayerMountTarget`。HoverCard、Popover、Tooltip、ButtonTooltip 都改用它。 |
| 7 | 键盘焦点、Escape 三档、不回退 #142 | 过 | 文档站只用键盘：聚焦「基础」里的 Invite teammates，按 Enter。焦点类名是 `astryx-dialog-header__title`，文字是 Invite teammates。再按 Escape，对话框关掉，焦点回到这个按钮。日志 `/tmp/verify-C7/keyboard2.log`。`dismissStack.ts` 相对 BASE 的 diff 是空的，类型仍是 `'close' \| 'block' \| 'ignore'`。抽 #142 已有用例 `最上层是 ignore 时栈不处理，下面那层也不关`：1 通过、20 跳过，退出码 0。`escapeOrder.test.ts` 里带 HoverCard 的两条（对话框里的卡片先吃掉 Escape）也通过。 |
| 8 | 滚动锁不钉 position，不 scrollTo | 过 | `scrollLock.ts` 只在锁住时把 `body.style.overflow` 写成 `hidden`，并留滚动条槽。没有写 `position`，也没有 `scrollTo`。`useScrollLock.test.ts` 的 `锁定时不把 body 钉成 position:fixed，也不改滚动位置`：调用前 `position` 是 `relative`，锁住和解开都还是 `relative`，`scrollTo` 没被调用。这条在第 20 条的 211 条里。理由见下「滚动锁」。没有 iOS 实机，按清单不补实机图。 |
| 9 | 对话框进场约半秒点不到已有轻提示 | 过（只记录） | 搬运时机没有改。`ToastViewport.vue` 相对 BASE 只多了 `:swipe-direction`。仍是 `await whenModalSettled(modal)` 再 `afterTwoFrames()`。`dialog.css` 进场是 `var(--astryx-duration-medium-max, 400ms)`，这文件没有 diff。`whenModalSettled` 默认兜底 600ms，`modalOutlet.ts` 也没有 diff。B4 `verify-2.md` 记过大约 530ms 看得见、位置不跳、点不到，以及上游立刻搬会跳大约 64px。本轮没有改这段。 |
| 10 | 轻提示不进关闭栈 | 过 | `packages/core/src/Toast` 里没有 `pushLayer`、`useDismiss`、`Escape`。文档站点开一条轻提示后按 Escape，提示还在，文字仍是 `Changes saved. ×`。同一轮里对话框的 Escape 关的是对话框。 |
| 11 | 空副标题和超长标题不撑出视口；窄屏宽度规则还在 | 过 | `dialog.css` 相对 BASE 没有 diff。390 宽打开对话框：`max-width` 和 `width` 都是 351px（390 的 90%），`dialog.right` 是 371，页面 `scrollWidth` 仍是 390。把标题改成「超长标题」重复 40 次后，标题 `scrollWidth` 没有超过 `clientWidth`，对话框右缘仍是 371。空副标题那一行不存在，由第 3 条的测试断言。全屏规则仍是 `100dvw`，本轮没改。 |
| 12 | 关闭按钮仍是 IconButton，没有新图标注册表 | 过 | `DialogHeader.vue` 的关闭按钮还是 `IconButton`，图标仍是原来的内联 svg，只多了换肤类 `astryx-dialog-header-close-icon`。`git diff BASE` 没有动 `Icon/`。 |
| 13 | 不用 important | 过 | `node scripts/check-no-important.mjs` 退出码 0。 |
| 14 | 台账每条有结论，抽查对得上 | 过 | `ledger/C7.md`：`- [x]` 80 条，`- [ ]` 0 条，结论 80 条。已采纳 47，不适用 33，没有第三种。抽查已采纳：`224b53065` 对上页眉五个挂点类和 `defineTheme` 测试；`d72e4d6b4` 对上补偿轴的三档测试；`5db7f15bd` 对上 `mount.test.ts` 的段落和对话框挂载点。33 条不适用都写了理由，分别是别的节点（B1、B2、B3、C3、C4、C6、C8、F3c）、React ref、StyleX、Playwright 夹具、知识库或已撤回的令牌。 |
| 15 | 新增测试两种 NODE_ENV | 过 | 与第 20 条同一组：两种环境都是 17 个文件、211 条，退出码 0。 |
| 16 | 中英文文档写了挂点、补偿、关闭文案、滑动；中文示例能点开 | 过 | 中文 `dialog-header/index.md` 写了五个挂点、`endContentEdgeCompensation` 的 inline / block / all、关闭文案跟语言、标题副标题插槽和空副标题。英文同页写了 Theme targets 和 Close / 关闭。中文 `toast/index.md` 写了贴底向下、贴顶向上、横向留给页面、按钮或链接上不关、鼠标拖动不关。英文同页同样写了。中文页眉示例和轻提示「堆叠」都点开过。 |
| 17 | SSR 失败名单里没有这七个浮层 | 过 | `packages/core/src/ssr-known-failures.json` 是空对象 `{}`。 |
| 18 | 整页图亲眼看过 | 过 | 下面五张都标了「文档站整页」，都看过。 |
| 19 | useHoverCard 不超过 500 行且不在白名单；两个函数仍有生产调用 | 过 | `wc -l` 是 500。`line-limit-allowlist.json` 里没有 `useHoverCard`。`node scripts/check-line-limit.mjs` 通过。`resolveLayerMountTarget` 由 `useResolvedLayerTeleport` 调用，HoverCard、Popover、Tooltip、ButtonTooltip 在用。`isTopLayer` 由 `useHoverLayerDismiss` 返回的 `isTop()` 调用，悬停卡片点外关闭会问它。两个都没有删。 |
| 20 | 浮层 vitest 两种环境 | 过 | `env -u NODE_ENV pnpm exec vitest run --maxWorkers=2` 覆盖 Dialog、AlertDialog、Popover、HoverCard、Tooltip、Lightbox、Toast、`layer/mount.test.ts`、`composables/useScrollLock.test.ts`：17 个文件，211 通过。`NODE_ENV=production` 再跑：仍是 17 个文件、211 条。退出码都是 0。日志在 `/tmp/verify-C7/vitest-unset.txt`、`vitest-prod.txt`。`vitest.config.ts` 加载时会把 `NODE_ENV` 设成 `test`，所以两次实际跑的是同一套测试环境；清单要求的是命令和用例数，两边一致。 |
| 21 | typecheck 和 eslint | 过 | `env -u NODE_ENV pnpm --filter @astryx-vue/core typecheck` 退出码 0。`pnpm exec eslint --max-warnings 0` 覆盖本轮改过的 vue/ts 源码和测试，退出码 0，无输出。两个 css 不在 eslint 配置里，没有放进这次命令。 |
| 22 | 行数检查 | 过 | `node scripts/check-line-limit.mjs` 退出码 0，打印「源码单文件行数检查通过（上限 500 行）」。 |
| 23 | diff 不碰路线图、规程和关闭栈；导出一致 | 过 | `git diff BASE --stat` 没有 `ROADMAP.md`、`SWARM.md`，也没有 `layer/dismissStack.ts`。`node scripts/sync-exports.mjs --check` 打印「生成结果和已提交文件一致」，退出码 0。 |
| 24 | 新增行不讲修改历史 | 过 | 全 diff 有 3 处命中，都在 `plan.md`、`impl-1.md`、`verify.md`。两处是滚动锁「不改成 position: fixed」的取舍，一处是本检查项自己的句子。`packages/`、`apps/`、`scripts/` 里没有命中。 |

## 看图

下面五张都是文档站整页。地址是中文路由，没有 `/zh/`。没有用夹具页、Vite preview 单页，也没有用 `pnpm visual` 的 overview。

| 图 | 来源 | 看到的内容 |
| --- | --- | --- |
| `/opt/cursor/artifacts/c7-verify/dialog-header-desktop-light.png` | 文档站整页 | `http://127.0.0.1:4173/components/dialog-header`，1440×900，浅色。顶栏有「文档 / 组件 / 演练场 / 主题」，左侧是组件侧栏。滚到「基础」并打开对话框。页眉是 Invite teammates、副标题、右上角关闭按钮，下面是说明和 Send invites。 |
| `/opt/cursor/artifacts/c7-verify/dialog-header-desktop-dark.png` | 文档站整页 | 同一页，深色。`html` 带 `dark`，`color-scheme: dark`。侧栏和顶栏还在。同一组页眉展开，底是深色，主按钮是浅色。 |
| `/opt/cursor/artifacts/c7-verify/dialog-header-390-light.png` | 文档站整页 | 390×844，浅色。侧栏收到屏外，顶上是窄屏条。对话框页眉展开，右缘 371，没有超出 390，页面 `scrollWidth` 仍是 390。 |
| `/opt/cursor/artifacts/c7-verify/dialog-header-390-dark.png` | 文档站整页 | 390×844，深色。同样有窄屏顶栏，页眉展开，底色是深色。 |
| `/opt/cursor/artifacts/c7-verify/toast-desktop-light.png` | 文档站整页 | `http://127.0.0.1:4173/components/toast`，1440×900，浅色。侧栏和顶栏都在。滚到「堆叠」，点了 Show toast。卡片区有三条常驻提示，右下角多出一条 Changes saved. |

## 滚动锁

仍不是 `position: fixed`。`nodes/B3/impl-1.md` 第 6 节第 1 点把这件事留给后面的浮层节点：上游钉住 body 是为了 iOS Safari，但会改变 Dialog、BottomSheet、Lightbox 打开时的滚动位置。C7 的实现按这个理由继续用 `overflow: hidden` 加滚动条槽。钉住 body 会改页面里 `position: fixed` 的参照，放开时还要 `scrollTo` 把位置拽回去。本库测试锁定的是：锁住时 `position` 保持调用前的值，并且不调用 `scrollTo`。没有 iOS 设备，背景仍可能被带着滚，这是这套锁的边界，不因此判否。

## 第 9 条取舍

对话框打开后大约半秒内，已经出现的轻提示看得见但点不到。这是 B4 第 2 轮留下的行为，本轮没有改搬运时机，所以只记录，判过。

- 进场默认 `var(--astryx-duration-medium-max, 400ms)`（`packages/core/styles/dialog.css`）。
- `whenModalSettled` 兜底 600ms（`packages/core/src/layer/modalOutlet.ts`），然后再等两帧。
- B4 `verify-2.md` 实测大约 530ms 看得见、位置不跳、点不到。上游立刻搬会跳大约 64px。

## 不通过的项要怎么改

无。

# C7 浮层家族 · 验收计划

你是验收者，只检查，不改代码。`impl-1.md` 只用来了解做了什么，不能当成证据。判断标准是效果。

## 环境

- 工作区：`/workspace`，分支 `sync/c7-overlays`。
- `BASE` 指 `git merge-base HEAD swarm-tree`。
- 开始和结束各跑一次 `git status`，两次结果必须相同。临时文件放 `/tmp/verify-C7/`。
- 测试前加 `env -u NODE_ENV`，再以 `NODE_ENV=production` 跑一遍，用例数相同。vitest 加 `--maxWorkers=2`。
- 文档站整页才是给用户的图。中文地址是 `/components/<slug>`。夹具页和 `pnpm visual` 的 overview 不能冒充。

## 检查项

每一项只能判「过」或「不过」。

### 一、效果和上游一致

1. 打开文档站中文 `/components/dialog-header`，滚到「基础」示例，点开对话框。桌面浅色、桌面深色、390px 浅色、390px 深色各一张整页图。图里要有侧栏或顶栏，对话框页眉（标题、副标题、关闭按钮）是展开的。再至少补一张 `/components/toast` 的整页图，点开一条提示。报告里每张标「文档站整页」。
2. 页眉换肤：`defineTheme` 里写 `dialog-header`、`dialog-header-start-content`、`dialog-header-title-block`、`dialog-header-end-content`、`dialog-header-close-icon`，生成的 CSS 选择器分别是 `.astryx-dialog-header` 和对应的短横线类。这些类在页眉 DOM 上。有关闭按钮且没传补偿时，后置槽同时带 block 和 inline 补偿类；传 `inline` 时只有行末；没有关闭按钮且没传补偿时两类都没有。
3. 标题、副标题插槽能渲染行内内容。副标题是空字符串且没有插槽时，副标题那一行不存在。没写 `closeButtonLabel` 时，英文环境关闭按钮名称是 Close，中文是「关闭」。
4. 轻提示：向下滑过阈值（高度的 0.4 和 48px 里较大的那个，或距离超过 48px 且速度大于 1.2）会关掉，退出位移变量是 `120%`。横向滑动、第二根手指、点在关闭按钮上，都不关。贴在上方的视口滑动方向是向上。
5. 悬停卡片打开后，再压上一层 `dismissOnEscape: 'ignore'` 的浮层，点文档外面卡片还在；这层关掉之后再点外面，卡片才关。
6. 触发器的父级是段落时，浮层 Teleport 目标是这段外面的安全容器，不是把浮层塞进段落。父级本身安全时，目标是 `body`。Dialog 提供了挂载点时，用挂载点，不用段落修正。

### 二、反向挑刺

7. 只用键盘：对话框打开后焦点在标题上，Escape 按关闭栈的三档处理。本轮没有把三档改回布尔，也没有改 `dismissStack.ts` 的关闭顺序。抽一条 #142 已有测试，确认还在。
8. 滚动锁：锁住时 body 的 `position` 保持调用前的值，不调用 `scrollTo`。回报里写了不改 `position: fixed` 的理由，并引用 `nodes/B3/impl-1.md` 第 6 节。没有 iOS 实机时，这一条只核对代码和测试，不要求补 iOS 截图。
9. 对话框打开后约半秒内点不到已有轻提示：行为与 B4 第 2 轮相同（`whenModalSettled` 再搬）。回报写了取舍和证据（进场默认 400ms、兜底 600ms、B4 实测约 530ms、上游立刻搬会跳）。这一条只记录，不要求改代码。若实现者改了搬运时机，判不过。
10. 轻提示没有登记进关闭栈。Escape 先关的是对话框或卡片，不是一条轻提示。
11. 空副标题、超长标题：页眉不把对话框撑出视口。窄屏对话框仍是现有的 `90vw` / `100dvw` 规则，本轮没有改坏。
12. 图标：关闭按钮仍走现有 IconButton 语义名，没有新的图标注册表。
13. `node scripts/check-no-important.mjs` 通过。

### 三、C 节点通用检查

14. `ledger/C7.md` 每一条都是 `- [x]`，下面有 `- 结论：已采纳` 或 `- 结论：不适用：<理由>`。抽查至少 3 条已采纳，确认代码或测试对得上；全部不适用都要有站得住的理由。
15. 本轮新增的 Vue 测试在两种 NODE_ENV 下都通过，用例数相同。
16. 中英文文档写了页眉挂点、补偿轴、关闭文案跟语言、轻提示触摸滑动。打开中文文档页，示例能点开。
17. `ssr-known-failures.json` 里没有 Dialog、AlertDialog、Popover、HoverCard、Tooltip、Lightbox、Toast。
18. 第 1 条的整页图你亲眼看过。
19. `packages/core/src/HoverCard/useHoverCard.ts` 不超过 500 行，并且不在 `scripts/guardrails/line-limit-allowlist.json` 里。`resolveLayerMountTarget` 和 `isTopLayer` 都有生产调用，没有删掉。

### 四、整体

20. `env -u NODE_ENV pnpm exec vitest run --maxWorkers=2` 覆盖 Dialog、AlertDialog、Popover、HoverCard、Tooltip、Lightbox、Toast、`layer/mount.test.ts`、`composables/useScrollLock.test.ts` 通过；`NODE_ENV=production` 再跑一遍，用例数相同。
21. `env -u NODE_ENV pnpm --filter @astryx-vue/core typecheck` 通过。改过的源码 eslint 无警告。
22. `node scripts/check-line-limit.mjs` 通过。
23. `git diff $BASE --stat` 没有 `ROADMAP.md`、`SWARM.md`，也没有 `layer/dismissStack.ts`。`node scripts/sync-exports.mjs --check` 通过。
24. `git diff $BASE | grep -nE "^\+.*(原来|改成|之前|moved|extracted|split from)"` 没有命中，或命中的都不是在讲修改历史。

## 结论

- 只要有一条不过，结论就是「不通过」。第 9 条只记录取舍，行为被改掉才算不过。
- 报告写到 `nodes/C7/verify-<N>.md`。实现者不要写这份验收报告。
- 最终回复用中文，200 字以内。

## 验证操作要短小

每次只测一件事，命令加 `timeout`。浏览器命令套 `browser-lock.mjs run --max-run`。脚本和结果放 `/tmp/verify-C7/`。

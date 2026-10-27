# C13 导航家族 · 执行计划

## 目标

页面导航和上游 0.7.1 对齐这几件事：标签条比容器宽时能横向滚动，并在两端淡出、给出滚动箭头；侧栏每一行可以在主控件旁边放操作，收起后这些操作不出现，调用方写的无障碍名称优先于项的名字；移动端抽屉打开后登记进全页关闭栈，里面再开一层时 Escape 先关那一层，关掉后焦点回到打开它的按钮，双指缩放留给浏览器；面包屑当前项用字重标出，默认斜杠在从右到左时镜像；`javascript:` 这类地址不会变成链接；悬停刚打开的导航菜单，短时间内再按触发器不会马上关掉。

## 工作环境

- 工作区：`/workspace`，分支 `cursor/c13-nav-family-071d`，从最新 `swarm-tree`（`5691a8ca`）切出。云端没有本机 worktree，文档站用空闲端口，用完关掉。
- 动手前已读：`SWARM.md`、`ROADMAP.md` 里 C13 那一行、C 阶段 6 条、`ledger/C13.md`、`nodes/C8/plan.md`。
- 环境纪律：测试和构建前加 `env -u NODE_ENV`；vitest 加 `--maxWorkers=2`；再以 `NODE_ENV=production` 跑一遍，用例数要相同。
- 浏览器纪律：同一时刻只开一个文档站。截图放 `/opt/cursor/artifacts`，不进 git。

## 上游这条改动让用户看到或感受到了什么

| 上游改动 | 用户看到或感受到的变化 |
| --- | --- |
| #5348 | 标签比条宽时，条可以横向滚。滚过的一端淡出，可悬停的指针还能点箭头往前或往后滚一截。选中的标签如果在视口外，会滚回来。`overflow="visible"` 时不滚、没有箭头。 |
| #5349 #5347 | 不传 `role` 时，标签条是导航地标，当前项是 `aria-current="true"`，带地址的标签是链接，左右和上下方向键都能换项。`role="tablist"` 时才是标签页：`role="tab"`、`aria-selected`，上下方向键留给页面。 |
| #3938 #6440 | `edgeCompensation="inline"` 和 `isFullBleed` 都是把条贴到容器内容边。两个都写时，以前者为准。 |
| #5005 #5644 | 侧栏一行的主控件旁边可以放按钮或菜单。这些操作不在主控件里面，收起成图标条后不出现。收起后如果调用方写了 `aria-label`，读屏读这个，不读项的名字。 |
| #7190 #4936 | 收起后的标题菜单靠悬停打开。打开后的一小段时间里再按下触发器，菜单保持打开；过了这段时间再按，才关掉。 |
| #5075 #6196 #7473 | 侧栏的收起状态只有一个主人。能拖宽时，拖拽配置里的收起状态优先。可拖的外框不把页面撑出横向滚动。把手的 `aria-controls` 指向侧栏。 |
| #4388 #5218 #5219 #7193 #4410 #4881 | 移动端抽屉从一侧滑入。打开时页面滚动锁住，并给滚动条留位置。关掉或卸载后页面能点，焦点回到打开它的按钮。抽屉里再开一层时，Escape 先关上面那一层。双指缩放留给浏览器。 |
| #5332 #4605 #6206 #5365 | 面包屑当前项用半粗字重标出，不只靠颜色。没人声明当前项时，最后一项是当前页；明确写 `false` 的项不参与。分隔符对读屏隐藏。默认斜杠在从右到左时镜像一次，自定义分隔符不镜像。链接和按钮都有可见焦点环。 |
| #5335 #5247 #6380 #5516 | 禁用的导航控件指针是默认箭头，没有禁止符号，也没有悬停底。标签和导航项按下时有按压底，盖过悬停。 |
| #5524 #5796 | `javascript:`、`vbscript:` 和会当成页面打开的 `data:text/html` 不会渲染成链接。 |
| #5449 #7302 | 图标圆底的类名是 `astryx-nav-icon`，不输出已经删除的 `navicon`。 |

## 上游依据

- 台账条目：`ledger/C13.md` 全部 67 条。
- 上游源码：`TabList/TabList.tsx` 的滚动条与 `overflow`、`SideNav/SideNavItem.tsx` 的 `actions`、`MobileNav/MobileNav.tsx` 的关闭栈和 `touch-action`、`Breadcrumbs/BreadcrumbItem.tsx` 的当前项与斜杠、`NavItem` 与导航家族文档里的危险协议。
- 上游测试：`TabList.test.tsx` 的 overflow 与 tabs pattern、`SideNav.test.tsx` 的 actions 与收起时的 `aria-label`、`MobileNavFocus.test.tsx`、`Breadcrumbs.test.tsx` 的当前项与分隔符。行为改写成 Vue 测试，不搬 Playwright 夹具。

查上游用 `git -C /tmp/astryx-upstream show v0.7.1:<路径>`。

## 有没有更适合 Vue 的做法

| 上游怎么做 | 我们怎么做 | 为什么效果一样 |
| --- | --- | --- |
| StyleX 滚动条、淡出遮罩、箭头按钮 | 标签条上加滚动类，淡出用遮罩类，箭头用语义图标 `chevronLeft` / `chevronRight` | 宽了能滚，两端淡出，箭头不进 Tab 顺序，选中项滚回视口 |
| `actions` 是 React 节点 | `actions` 插槽，和主控件并列 | 操作不在链接或按钮里面，收起后不渲染 |
| `useLayerDismissal` | 打开时 `pushLayer`，点遮罩仍由对话框自己认 | Escape 只打最上面一层 |
| `holdScrollbarGutter` | 打开时走已有的 `useScrollLock` | 锁滚动的同时给滚动条留位置 |
| 合并 ref、StyleX 简写 | 不搬 | Vue 模板 ref 和普通 CSS 没有这两类问题 |
| 图标注册表 | 语义名，已有 `chevronLeft`、`chevronRight`、`chevronDown` | 不引入第二套图标 |

## 任务范围

- 要改：
  - `packages/core/src/TabList/`（`overflow`、滚动、标签页模式的方向键）
  - `packages/core/styles/tab-list.css`
  - `packages/core/src/SideNav/SideNavItem.vue`、`packages/core/styles/side-nav.css`
  - `packages/core/src/NavItem/NavItem.vue`、`packages/core/src/NavItem/link.ts`
  - `packages/core/src/NavMenu/NavDisclosure.vue`、`packages/core/styles/nav-menu.css`
  - 导航链接的危险协议：标题、菜单项、面包屑、顶栏大菜单
  - `packages/core/src/MobileNav/MobileNav.vue`、`packages/core/styles/mobile-nav.css`
  - `packages/core/src/Breadcrumbs/`、`packages/core/styles/breadcrumbs.css`
  - 对应测试
  - 中英文文档里标签条、侧栏项、移动导航这几处说明
  - `ledger/C13.md`
  - 本目录的 `verify.md`、`impl-1.md`
- 不碰：
  - `ROADMAP.md`、`SWARM.md`、`HANDOFF.md`
  - `scripts/guardrails/line-limit-allowlist.json`、`packages/cli/src/generated/catalog.json`（本节点不新增公开导出，也不该超行）
  - 滚动锁和关闭栈的实现本身（继续用 B3、B4、C7 已有的）
  - 别的组件家族

## 开发步骤

1. 写本计划和 `verify.md`。
2. 标签条默认横向滚动：`overflow` 为 `auto` 或 `scroll` 时滚，`visible` 时不滚。淡出、箭头、选中项滚入视口。`role="tablist"` 时上下方向键不换项。
3. 侧栏 `actions` 插槽与收起时的 `aria-label`。悬停打开的导航菜单在保护时间内按下不关闭。菜单项禁用指针改为 `default`。
4. 导航地址走 `isSafeUrl`。不安全的地址渲染成按钮或静态文字，不带 `href`。
5. 移动端抽屉：`overflow: clip`、`touch-action`、`useScrollLock`、关闭栈、卸载时关掉仍开着的对话框。焦点恢复继续用已有的 `useRestoreFocus`。
6. 面包屑：未声明时最后一项是当前页，`false` 退出；当前项半粗；默认斜杠可镜像；焦点环。
7. 台账 67 条写结论。更新中英文文档。跑相关 vitest 两种 `NODE_ENV`、typecheck、eslint、行数、`!important`、导出检查。截文档站整页。

## 自测要求

1. `env -u NODE_ENV pnpm exec vitest run --maxWorkers=2` 覆盖 `packages/core/src/TabList`、`packages/core/src/SideNav`、`packages/core/src/TopNav`、`packages/core/src/MobileNav`、`packages/core/src/NavMenu`、`packages/core/src/NavItem`、`packages/core/src/Breadcrumbs`、`packages/core/src/Pagination`，全部通过。
2. `NODE_ENV=production` 同一路径，用例数相同。
3. `env -u NODE_ENV pnpm --filter @astryx-vue/core typecheck`、改过文件的 eslint `--max-warnings 0`、`node scripts/check-line-limit.mjs`、`node scripts/check-no-important.mjs`、`node scripts/sync-exports.mjs --check`。这些组件会出现在文档站，再跑 `env -u NODE_ENV pnpm docs:build`。
4. 文档站中文 `/components/side-nav`、`/components/tab-list`、`/components/mobile-nav`、`/components/breadcrumbs`：桌面与 390px、浅色与深色。图放 `/opt/cursor/artifacts`，能看见侧栏或顶栏上的「菜单」。无对位，不拼上游图。
5. 新写和改到的源码不超过 500 行。样式里没有 `!important`，导航菜单里没有 `cursor: not-allowed`。

## 提交与回报

- 提交信息用中文。分几次提交。完成后推送 `cursor/c13-nav-family-071d`，开 draft PR，base 为 `swarm-tree`，标题 `C13 导航家族`。
- 不改 `ROADMAP.md`、`SWARM.md`、`HANDOFF.md`，不合并。
- 回报写 `nodes/C13/impl-1.md`。
- 最终回复用中文：PR 链接、分支、tip、是否改了白名单或 catalog、自测摘要。

## 验证操作要短小

每次只测一件事，命令加 `timeout`。浏览器命令套 `browser-lock.mjs run --max-run`。脚本和结果放 `/tmp/c13-*`。

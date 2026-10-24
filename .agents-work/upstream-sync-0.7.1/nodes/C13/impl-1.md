# C13 导航家族 · 第 1 轮实现回报

- 工作区：`/workspace`，分支 `cursor/c13-nav-family-071d`。云端没有本机 worktree。
- 提交（基于 swarm-tree `5691a8ca`）：
  - `c964aaf4` docs(C13): 写下导航家族的执行计划和验收清单
  - `98fdecb6` feat(C13): 对齐标签滚动、侧栏操作、抽屉关闭栈和面包屑当前页
  - 本回报和文档、台账是随后那一次 docs 提交

## 1. 做了什么

按计划的开发步骤做完。

1. 已写 `plan.md` 和 `verify.md`。
2. 标签条默认横向滚动。`overflow` 为 `auto` 或 `scroll` 时，挡住的一端淡出并出现箭头，一步滚过可见宽度的 80%。`visible` 不滚。选中项或刚获得焦点的项如果被挡住，立刻滚回可见区域。`role="tablist"` 时上下方向键不改选中项。
3. `SideNavItem` 增加 `actions` 插槽，和主控件并排，收起后不渲染。收起后调用方的 `aria-label` 优先于 `label`。
4. 导航地址先过 `isSafeUrl`。`javascript:` 这类地址渲染成按钮，不带 `href`。
5. 悬停刚打开的导航菜单，500 毫秒内鼠标再按触发器会钉住；再按一次才关。关掉后 300 毫秒内不会因为指针还在上面又打开。
6. 移动端抽屉打开时 `pushLayer`，点遮罩仍由对话框自己认。里面再开一层时，Escape 先关上面那一层。滚动锁走 `useScrollLock`。对话框 `overflow: clip`，双指缩放留给浏览器。关掉后焦点回到打开它的按钮。卸载时如果对话框还开着，会先 `close()`。
7. 面包屑没人标明当前页时，最后一项带 `aria-current="page"`，有安全地址时仍是链接。`isCurrent="false"` 退出。明确的当前页仍是 `span`。默认斜杠可在从右到左时镜像。当前项半粗，supporting 变体的当前色是次级文字色。
8. 台账 67 条都写了结论。中英文文档改了标签条角色、`overflow`、侧栏 `actions`、抽屉里的 Escape 和缩放。

| 文件 | 行数 | 职责 |
| --- | --- | --- |
| `packages/core/src/TabList/useTabListScroll.ts` | 129 | 溢出、翻页、把选中项滚回可见区域 |
| `packages/core/src/TabList/TabList.vue` | 178 | 滚动条、淡出、箭头 |
| `packages/core/src/MobileNav/useMobileNavLayer.ts` | 44 | 抽屉登记关闭栈 |
| `packages/core/src/MobileNav/MobileNav.vue` | 151 | 滚动锁、取消事件、卸载时关掉对话框 |
| `packages/core/src/Breadcrumbs/breadcrumbTrail.ts` | 46 | 自动当前页 |
| `packages/core/src/Breadcrumbs/BreadcrumbItem.vue` | 145 | 当前页、斜杠、安全地址 |
| `packages/core/src/SideNav/SideNavItem.vue` | 263 | `actions` 插槽和收起后的无障碍名称 |
| `packages/core/src/NavMenu/NavDisclosure.vue` | 199 | 悬停打开后的点击钉住 |
| `packages/core/src/NavItem/link.ts` | 38 | 能不能当成链接 |

## 2. 和上游的对照

| 上游改动 | 上游怎么做 | 我们怎么做 | 为什么效果相同 |
| --- | --- | --- | --- |
| #5348 | 标签比条宽时滚动，箭头步长是可见宽度的 0.8，选中项用 `instant` 滚回 | `useTabListScroll` 同样的步长和 `scrollBy({ behavior: 'instant' })` | 两端淡出和箭头只在真的挡住时出现；`visible` 不滚 |
| #5349 #5347 | `role="tablist"` 才是标签页模式；导航模式 `aria-current="true"` | 已有的角色分支保留，并补了上下方向键只在导航模式移动 | 标签页模式把上下方向键留给页面 |
| #5005 #5644 | `actions` 和主控件并列；收起后调用方 `aria-label` 优先 | 插槽只在展开分支渲染；`accessibleLabel` 先读属性 | 操作不进链接；收起后读屏读调用方给的名字 |
| #5524 #5796 | 危险协议不渲染成链接 | `isNavigableHref` / `safeNavHref` 接到导航项、菜单、标题、顶栏和面包屑 | `javascript:` 变成按钮或静态文字 |
| #4936 #7190 | 悬停打开后 500 毫秒内的点击钉住，关掉后 300 毫秒内不重开 | `NavDisclosure` 用同一对常量 | 键盘 click 的 `detail` 是 0，仍按开关处理 |
| #4881 #4388 #4410 #5219 #7193 | 抽屉进关闭栈，关掉还焦点，锁滚动，缩放留给浏览器 | `pushLayer`、`useScrollLock`、`useRestoreFocus`、`overflow: clip`、`touch-action` | Escape 只关最上层；页面滚动被锁住并给滚动条留位 |
| #5332 #6206 #5365 | 自动当前页、半粗、斜杠镜像、焦点环 | 子项登记后，父级在挂载完成时标最后一项 | 有地址的自动当前页仍是链接；自定义分隔符不镜像 |

## 3. 和计划不一样的地方

- 计划写焦点恢复继续用 `useRestoreFocus`。同一个 ref 既当启用开关又当恢复开关时，关掉的那一下启用开关已经是 false，焦点回不去。抽屉改成启用开关一直开着，只把打开状态交给 `shouldRestore`。
- Vue 会把没写的布尔属性收成 `false`。面包屑的 `isCurrent` 用 `withDefaults` 保持「没说」，否则自动当前页永远不会出现。自动标记等父级 `onMounted` 再亮，避免前面的项在同一轮渲染里先把自己标成当前页。
- 没有搬上游关掉抽屉时那套延迟 `display` 和滑出停留。对话框马上 `close()`，`overflow: clip` 让它不再当滚动容器。滑入动画原来就有。
- 标签条淡出用类名上的渐变，没有搬上游整套 mask 计算公式。测试断言类名和 `scrollBy`，不断言计算后的 `mask-image`。

## 4. 台账处理

一共 67 条。已采纳 44 条，不适用 23 条。

不适用：

- `3c50fccc8`：本库没有发布过上游 0.6 要删的 SideNav 旧接口。
- `ea0483449`、`6e6b9b476`：主题嵌套令牌已被撤回，归 B1。
- `52a359239`：菜单分组归 C6。
- `41950da6a`：文档站不生成上游 derived-var 守护。
- `2192a2834`、`d72fc1255`、`ea86c8bc1`：不搬上游预览夹具。
- `0c6ab035b`、`4aacbbedc`、`4ec26d757`：浮层边距和文字重置已由 B4 的 `astryx-layer` 覆盖。
- `e891c0dc8`：随后被 `8a9d85fdf` 改成 `default`。本库禁用指针是 `default`。
- `540f19e62`、`7a9ff42ba`：Vue 模板 ref 不需要合并 ref。
- `60cea48a9`：越界提交归 C1。
- `560d7333c`：跨 iframe 拖拽归 C14。
- `d55751f88`：共用 ResizeObserver 归 B3。
- `41ab6db2a`：0.7 已删除 `navicon`，本库从不输出。
- `12a6e8a83`：普通 CSS，没有 StyleX 简写问题。
- `684b56d19`：步进器连接线归 C15。
- `ec71b5582`、`176dfa624`、`8bf4b5136`：上游知识库或整套无障碍夹具读法，归 E3，或不维护那套 spec。

## 5. 自测结果

| # | 自测项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | `env -u NODE_ENV pnpm exec vitest run --maxWorkers=2` 覆盖计划里的八个目录 | 过 | 15 个文件、125 条通过 |
| 2 | `NODE_ENV=production` 同一路径 | 过 | 15 个文件、125 条通过 |
| 3 | typecheck、eslint、行数、`!important`、导出检查、`docs:build` | 过 | typecheck 退出码 0。改过的 Vue/TS `eslint --max-warnings 0` 退出码 0。行数检查打印「源码单文件行数检查通过」。`check-no-important.mjs` 退出码 0。`sync-exports.mjs --check` 打印「生成结果和已提交文件一致」。`docs:build` 打印 `build complete in 51.52s` |
| 4 | 视觉对照 | 过 | 无对位。图在 `/opt/cursor/artifacts/c13-nav/`。桌面能看见文档站侧栏，390px 顶栏能看见「菜单」。抽屉打开后能看见 Navigation 和 Dashboard，关掉后 `open` 消失 |

## 6. 拿不准的地方

无。白名单和 `packages/cli/src/generated/catalog.json` 都没有改。`pnpm sync` 只把 `TabListOverflow` 和 `TabListEdgeCompensation` 补进了 `packages/core/src/index.ts`。

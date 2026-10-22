# C13 验收报告 · 第 1 轮

结论：通过（24/24）

- 工作区：`/workspace`，分支 `cursor/c13-nav-family-071d`，验收开始时的 tip 是 `862a9031`。
- 比较基点：`BASE = 5691a8caf71ead19c6e142be702e78fec278caba`（`git merge-base HEAD origin/swarm-tree`）。
- 临时文件和截图：`/tmp/verify-C13/`，整页图同时在 `/opt/cursor/artifacts/c13-verify/`。全部这次重新生成，没有用实现者留下的图。
- 只读检查：开始时 `git status` 是干净工作区。验收操作结束、写本报告之前仍是干净工作区。两次相同。本报告是随后提交的唯一新增文件。
- 临时改动：探针 `packages/core/src/TabList/c13-verify.probe.test.ts` 跑完即删，已还原。`pnpm --filter @astryx-vue/core build` 和 `pnpm docs:build` 的产物在 gitignore 里，没有留下已跟踪改动。
- 浏览器：`node scripts/swarm/browser-lock.mjs run --purpose C13-verify`。文档站是构建结果的预览，`http://127.0.0.1:5197`。测完关掉预览进程。结束时该端口没有响应，browser-1 和 browser-2 都空闲，没有残留的 Chromium 进程。

## 逐条结果

| # | 检查项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | 四个中文文档页，桌面/390 × 浅色/深色，整页并滚到实质 Demo；移动导航打开抽屉；无对位 | 过 | 见「看图」。桌面侧栏可见，390 宽顶上有「菜单」。滚到「尾部内容」「撑满宽度」「基本抽屉」「分隔符」。抽屉四套都打开，能看见 Navigation 和 Dashboard。 |
| 2 | 标签条横向滚动、结束边箭头、`aria-hidden` 与 `tabindex="-1"`、按下不拿走焦点、点击约 0.8 倍宽度、`visible` 不滚、选中项 `instant` 滚回 | 过 | `TabList.scroll.test.ts` 在两套 vitest 里通过。箭头 `aria-hidden="true"`、`tabindex="-1"`，mousedown 被 `preventDefault`（`TabList.vue` 的 `@mousedown.prevent`）。点击记录到 `scrollBy({ left: 240 })`，可见宽度 300 的 0.8。`overflow="visible"` 没有箭头、`scrollBy` 没有被调用。选中项在视口外时 `scrollBy({ behavior: 'instant', left: 280 })`。 |
| 3 | 不传 `role` 是 `nav` 且 `aria-current="true"`；`tablist` 时上下方向键不切换；贴边类以前者为准 | 过 | `TabList.test.ts` 断言根是 `NAV`、选中项 `aria-current="true"`。`TabList.scroll.test.ts` 在 `role="tablist"` 时 ArrowDown 不发出 `update:value`。`isFullBleed` 与 `edgeCompensation="inline"` 都带 `astryx-tab-list--full-bleed`。探针把两个都写上，类名仍在。`TabList.vue` 里 `edgeCompensation === 'inline'` 先判断。 |
| 4 | `actions` 在主控件旁边，收起后不出现；收起后调用方 `aria-label` 盖过项名 | 过 | `SideNav.test.ts`：`.astryx-side-nav-item__actions` 在链接外，收起后节点消失；收起后链接的 `aria-label` 是 `Go home`。模板里插槽和 `NavItem` 并列，收起分支不渲染这个插槽。 |
| 5 | 悬停打开后 500 毫秒内再点触发器，菜单仍开着，再点一次才关 | 过 | `MENU_HOVER_CLICK_GUARD_MS` 是 500。`NavDisclosure.vue` 在这段时间内直接返回，不调用 `close`。`NavMenu.test.ts` 的 `pins a hover-opened menu...` 在两套 vitest 里通过：第一下 `detail: 1` 后面板还在，第二下后面板消失。 |
| 6 | `javascript:alert(1)` 的导航项、菜单项、面包屑不是链接，没有 `href` | 过 | `NavItem.test.ts`、`NavMenu.test.ts`、`Breadcrumbs.test.ts`、`TabList.scroll.test.ts` 都断言没有 `a`。探针再挂了一次 `NavMenuItem`，按钮上没有 `href`。地址先过 `isNavigableHref` / `safeNavHref`。 |
| 7 | 抽屉锁住 `body` 滚动，关掉后恢复；后登记的层先吃 Escape，`openChange` 不发出；焦点回到打开它的按钮；`overflow: clip` 且允许 `pinch-zoom` | 过 | `MobileNav.test.ts` 覆盖锁滚动、卸载释放、焦点回到 `Open menu`、后压一层时第一次 Escape 不发出 `openChange`。浏览器打开文档站「基本抽屉」：`dialog[open]` 的 `overflow` 是 `clip`，`touch-action` 是 `pinch-zoom`，`document.body.style.overflow` 是 `hidden`。按 Escape 后对话框消失，overflow 恢复成空，焦点回到 `Open Navigation`。记录在 `/tmp/verify-C13/interact-drawer.log`。 |
| 8 | 没人声明当前项时最后一项是当前页；`isCurrent` 为 false 的项不是当前项；默认斜杠可镜像，自定义分隔符不镜像；当前项半粗 | 过 | `Breadcrumbs.test.ts`：最后一项 `aria-current="page"` 且仍是链接；`isCurrent: false` 的项没有 `aria-current`，自定义 `>` 不带 `astryx-breadcrumb-item__slash`。样式里 `[dir='rtl'] .astryx-breadcrumb-item__slash` 做 `scaleX(-1)`，当前项 `font-weight` 是 semibold。 |
| 9 | 键盘：左右和 Home、End 仍能换项；`tablist` 的 ArrowDown 不选中；抽屉 Escape 仍能关 | 过 | 受控探针：Home 从 b 到 a，End 到 c，ArrowLeft 到 b，ArrowRight 到 c。日志 `/tmp/verify-C13/probe-keys.log`，1 条通过。ArrowDown 见第 3 条。Escape 见第 7 条。 |
| 10 | 侧栏是 `nav`；宽度把手 `aria-controls` 指向侧栏 id；滚动箭头不进无障碍树；面包屑分隔符 `aria-hidden` | 过 | `SideNav.vue` 外框里是 `<nav :id="navId">`，`ResizeHandle` 写 `:aria-controls="navId"`。`SideNav.test.ts` 断言把手的 `aria-controls` 等于这个 id。滚动箭头 `aria-hidden="true"`。探针里单条面包屑的分隔符 `aria-hidden="true"`。 |
| 11 | 这些组件不在 `ssr-known-failures.json`；`docs:build` 通过 | 过 | 名单是空对象 `{}`。工作区一开始没有 core 的 dist，第一次 `docs:build` 找不到 `dist/Icon/plugin.js`。`env -u NODE_ENV pnpm --filter @astryx-vue/core build` 之后，`env -u NODE_ENV pnpm docs:build` 打印 `build complete in 51.44s`，退出码 0。产物未入库。 |
| 12 | 面包屑一项、标签条一项、分页没有溢出时不报错，也不凭空出现滚动箭头 | 过 | 探针 6 条里这三条通过：一项面包屑标成当前页；一项标签在 `scrollWidth === clientWidth` 时没有 `.astryx-tab-scroll-button`；`total: 30` 的分页没有 `.is-ellipsis`，也没有滚动箭头。日志 `/tmp/verify-C13/probe.log`。 |
| 13 | 滚动箭头用 `chevronLeft`、`chevronRight`；没有搬上游图标组件；`NavIcon` 类是 `astryx-nav-icon`，源码没有 `navicon` | 过 | `TabList.vue` 两个箭头分别是这两个语义名，语义表在 `Icon/semantic.ts`。`NavIcon.vue` 的类是 `astryx-nav-icon`。`packages/core` 里搜不到 `navicon`。探针渲染结果也不含这个字符串。 |
| 14 | 没有 `!important`；`nav-menu.css` 没有 `not-allowed` | 过 | `node scripts/check-no-important.mjs` 退出码 0。`nav-menu.css` 的指针是 `pointer` 和 `default`。 |
| 15 | 台账 67 条都勾了，结论格式对；抽查已采纳；全部不适用站得住 | 过 | 67 条都是 `- [x]`，44 条已采纳，23 条不适用，没有第三种写法。抽查见下文。 |
| 16 | 本轮行为都有 Vue 测试，两种 `NODE_ENV` 都通过 | 过 | 标签滚动、actions、收起时的 `aria-label`、悬停按下不关、危险地址、抽屉焦点与关闭栈、面包屑自动当前项和斜杠，都在上面点名的测试文件里。两套 vitest 都是 15 个文件、125 条通过。 |
| 17 | 中英文文档和现在的行为一致；中文侧栏页和标签页的示例能操作 | 过 | 中英文都写了不传 `role` 是导航地标、`overflow` 默认横向滚动、`actions` 在链接外且收起后不渲染、抽屉里再开一层时 Escape 先关上面那一层、双指缩放留给浏览器。文档站点「撑满宽度」的 Projects，`aria-current` 从 `home` 变成 `projects`。点「嵌套项」的 Settings，`aria-expanded` 从 `true` 变成 `false`，子列表容器高度变成 0，并带上收起类和 `aria-hidden="true"`。 |
| 18 | 本节点组件不在 SSR 已知失败名单 | 过 | 同第 11 条，`ssr-known-failures.json` 是 `{}`。 |
| 19 | 四种组合的文档站整页都看过，来源写明，无对位 | 过 | 见「看图」。20 张都读过。 |
| 20 | 新写和改到的源码不超过 500 行，没有改白名单 | 过 | `node scripts/check-line-limit.mjs` 打印「源码单文件行数检查通过（上限 500 行）」。`line-limit-allowlist.json` 不在 diff 里。 |
| 21 | 八个目录的 vitest，两种 `NODE_ENV`，用例数相同 | 过 | 命令见下。两边都是 15 个文件、125 条通过，退出码 0。 |
| 22 | typecheck、eslint、行数、`!important`、`sync-exports --check` | 过 | typecheck 退出码 0。改过的 Vue/TS `eslint --max-warnings 0` 退出码 0。行数和 `!important` 见上。`sync-exports.mjs --check` 打印「生成结果和已提交文件一致」。 |
| 23 | diff 没有计划外文件；ROADMAP、SWARM、HANDOFF、白名单、catalog 没改 | 过 | `git diff 5691a8ca --stat` 共 49 个文件，都在导航组件、对应样式和测试、中英文的侧栏/标签/移动导航文档、台账和本节点计划里。`packages/core/src/index.ts` 只补了 `TabListOverflow` 和 `TabListEdgeCompensation` 两个类型导出，属于标签条公开类型。上述保护文件的 diff 为空。 |
| 24 | 注释里没有修改历史 | 过 | 源码和文档 diff 里，模式只命中两句说明：「回到原来的焦点」「有下级的项改成从侧面弹出的菜单」。这是在描述行为，不是在注释里讲这次怎么改的。 |

第 21 条命令：

`env -u NODE_ENV pnpm exec vitest run --maxWorkers=2 packages/core/src/TabList packages/core/src/SideNav packages/core/src/TopNav packages/core/src/MobileNav packages/core/src/NavMenu packages/core/src/NavItem packages/core/src/Breadcrumbs packages/core/src/Pagination`

`NODE_ENV=production` 用同一条命令再跑一遍。日志在 `/tmp/verify-C13/vitest-unset.log` 和 `vitest-prod.log`。

## 看图

无对位。没有和上游拼图。下面每张都是文档站整页，预览地址 `http://127.0.0.1:5197`。桌面视口 1280×900，窄屏 390×844。浅色背景是 `rgb(255, 255, 255)`，深色是 `rgb(13, 15, 26)`。图同时在 `/tmp/verify-C13/shots/` 和 `/opt/cursor/artifacts/c13-verify/`。

| 图 | 来源 | 看到的内容 |
| --- | --- | --- |
| `side-nav-desktop-light.png` | 文档站整页，无对位 | `/components/side-nav`。左侧是中文组件侧栏，顶栏有文档、组件、演练场、主题。滚到「示例 / 尾部内容」，能看见 Dashboard、Projects、12、New、Team。浅色。 |
| `side-nav-desktop-dark.png` | 文档站整页，无对位 | 同一页、同一滚动位置。侧栏还在。深色，示例内容与浅色对应。 |
| `side-nav-mobile-light.png` | 文档站整页，无对位 | 390 宽。侧栏收起，顶上有「菜单」和「返回顶部」。同一段「尾部内容」还在。浅色。 |
| `side-nav-mobile-dark.png` | 文档站整页，无对位 | 同上，深色。 |
| `tab-list-desktop-light.png` | 文档站整页，无对位 | `/components/tab-list`。侧栏在。滚到「撑满宽度」，Home、Projects、Settings 平分一行；下面是「带操作」。浅色。 |
| `tab-list-desktop-dark.png` | 文档站整页，无对位 | 同一页、同一位置。深色。 |
| `tab-list-mobile-light.png` | 文档站整页，无对位 | 390 宽，顶上有「菜单」。三个标签都在。浅色。 |
| `tab-list-mobile-dark.png` | 文档站整页，无对位 | 同上，深色。 |
| `mobile-nav-desktop-light.png` | 文档站整页，无对位 | `/components/mobile-nav`。侧栏在。滚到「基本抽屉」，中间是菜单按钮；下面是「结束边抽屉」和 Open from Right。浅色。 |
| `mobile-nav-desktop-dark.png` | 文档站整页，无对位 | 同一页、同一位置。深色。 |
| `mobile-nav-mobile-light.png` | 文档站整页，无对位 | 390 宽，顶上有「菜单」。两个示例都在。浅色。 |
| `mobile-nav-mobile-dark.png` | 文档站整页，无对位 | 同上，深色。 |
| `mobile-nav-desktop-light-drawer.png` | 文档站整页，无对位，抽屉打开 | 点 Open Navigation 之后。左侧抽屉标题 Navigation，有 Dashboard、Projects、Analytics、General、Team，右上角是关闭。后面的文档页被遮罩盖住。浅色。 |
| `mobile-nav-desktop-dark-drawer.png` | 文档站整页，无对位，抽屉打开 | 同一打开状态。深色。 |
| `mobile-nav-mobile-light-drawer.png` | 文档站整页，无对位，抽屉打开 | 390 宽。抽屉从左侧盖住页面，同样能看见 Navigation 和 Dashboard。浅色。 |
| `mobile-nav-mobile-dark-drawer.png` | 文档站整页，无对位，抽屉打开 | 同上，深色。 |
| `breadcrumbs-desktop-light.png` | 文档站整页，无对位 | `/components/breadcrumbs`。侧栏在。滚到「分隔符」，能看见 Chevron、Arrow、Dot 三条路径；下面是「深层路径」。浅色。当前项字重更重。 |
| `breadcrumbs-desktop-dark.png` | 文档站整页，无对位 | 同一页、同一位置。深色。 |
| `breadcrumbs-mobile-light.png` | 文档站整页，无对位 | 390 宽，顶上有「菜单」。分隔符和深层路径都在，长路径换行。浅色。 |
| `breadcrumbs-mobile-dark.png` | 文档站整页，无对位 | 同上，深色。 |

页面上没有空白骨架，也没有报错覆盖层。

## 台账抽查

已采纳抽了 3 条，对照的是现在的代码和这次跑过的测试：

- `0da2f5b0e`：`useTabListScroll.ts` 的步长是 0.8，`overflow !== 'visible'` 才滚动。滚动测试通过。
- `e5e83effd`：`SideNavItem.vue` 的 `actions` 插槽在主控件旁边，收起分支不渲染。侧栏测试通过。
- `13ae375a3`：`SideNav.vue` 把 `navId` 交给拖宽把手的 `aria-controls`。侧栏测试断言两者相等。

23 条不适用都站得住：

- `3c50fccc8`：上游 SideNav 那一处只是把 `useResizable` 的 `minSizePx` / `maxSizePx` 改名。本库调用已经用 `minSize` / `maxSize`，没有发布过旧名字。
- `ea0483449`、`6e6b9b476`：主题嵌套令牌后来被撤回，归 B1。
- `52a359239`：菜单分组归 C6。面包屑只是被上游测试碰到。
- `41950da6a`：文档站没有上游那套 derived-var 守护。
- `2192a2834`、`d72fc1255`、`ea86c8bc1`：不搬上游预览夹具。
- `0c6ab035b`、`4aacbbedc`、`4ec26d757`：`MobileNav` 根上有 `astryx-layer`。`layer.css` 把浮层上的 `--container-padding-*` 归零。
- `e891c0dc8`：随后被 `8a9d85fdf` 改成 `default`。导航菜单禁用指针现在是 `default`。
- `540f19e62`、`7a9ff42ba`：Vue 模板 ref 不需要合并 ref。
- `60cea48a9`：越界提交归 C1 的 NumberInput。
- `560d7333c`：跨 iframe 拖拽归 C14。
- `d55751f88`：标签条用自己的 `ResizeObserver`，没有改共用观察器。
- `41ab6db2a`：0.7 已删掉 `navicon`。本库源码不输出这个类。
- `12a6e8a83`：这边是普通 CSS，没有 StyleX 简写被丢掉的问题。
- `684b56d19`：步进器连接线归 C15。抽屉已经走 `resetLayerScopedContext`。
- `ec71b5582`、`176dfa624`、`8bf4b5136`：上游知识库或整套无障碍夹具的读法，归 E3。

## 对实现者偏离计划的判断

四条都合理。

- 焦点恢复不把同一个 ref 同时当启用开关和恢复开关。浏览器里关掉抽屉后，焦点确实回到 Open Navigation。
- `isCurrent` 用 `withDefaults` 保持「没说」。自动当前页的测试通过，明确写 `false` 的项也不会被标上。
- 关掉抽屉时没有搬上游那套延迟 `display`。对话框会马上 `close()`，打开时的滑入还在，`overflow: clip` 也在。
- 淡出用类名上的渐变，没有搬上游的 mask 计算公式。滚动、箭头和 `visible` 不滚都有测试。

## 不通过的项要怎么改

无。

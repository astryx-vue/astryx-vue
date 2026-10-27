# C13 导航家族 · 验收计划

你是验收者，只检查，不改代码。实现者写的 `impl-1.md` 只用来了解他做了什么，不能当成证据，每一条都要你亲自重新验证。

**判断标准是效果，不是代码长得像不像上游。** 只要用户看到的样子、操作的手感、读屏读出的内容、公开 API 能做到的事和上游一致，代码结构不同不算问题。

## 环境

- 工作区：`/workspace`，分支 `cursor/c13-nav-family-071d`。
  - `BASE` 指 `git merge-base HEAD swarm-tree`。
- 只读铁律：开始和结束时各跑一次 `git status`，两次结果必须相同。
  - 需要临时改文件做反向检查时，改完马上用 `git checkout -- <文件>` 还原，并在报告里写明「已还原」。
  - 临时文件都放在 `/tmp/verify-C13/`。
- 测试环境：
  - 所有测试和构建命令前面加 `env -u NODE_ENV`。
  - 测试相关的检查项跑两遍：一遍 `env -u NODE_ENV`，一遍 `NODE_ENV=production`。两遍都要通过，用例数要相同。
  - vitest 一律加 `--maxWorkers=2`。
- 浏览器：
  - 整台机器同时最多 2 个浏览器会话。
  - 只能这样开：`node scripts/swarm/browser-lock.mjs run --purpose C13-verify -- <命令>`。拿不到锁就排队，不许私开。
  - 文档站用空闲端口，同一时刻只开一个，用完关掉。
  - 看截图用读图工具直接读 PNG 文件。
  - 主证据是文档站整页。中文打开 `http://127.0.0.1:<端口>/components/side-nav`，以及 tab-list、mobile-nav、breadcrumbs。桌面要看见侧栏，390 宽要看见顶栏上的「菜单」，并滚到有实质 Demo 的段落。没有对位 Demo 就写「无对位」，发单侧整页。截图不入库。

## 检查项

每一项只能判「过」或「不过」，并附上证据：命令和输出、截图路径和你看到的内容。

### 一、效果和上游一致

1. 文档站中文 `/components/side-nav`、`/components/tab-list`、`/components/mobile-nav`、`/components/breadcrumbs` 四种组合（桌面/390px × 浅色/深色）都是整页，并滚到有实质 Demo 的段落。无对位，不和上游拼图。移动导航要打开一个抽屉。
2. 标签条默认可以横向滚动。把条的 `scrollWidth` 设得比 `clientWidth` 大并触发 `scroll` 后，结束边出现箭头；箭头 `aria-hidden="true"` 且 `tabindex="-1"`，按下不拿走焦点，点击会 `scrollBy` 大约 0.8 倍可见宽度。`overflow="visible"` 时没有箭头，也不为选中项滚动。选中项在视口外时，会以 `behavior: 'instant'` 滚回来。
3. 不传 `role` 时标签条是 `nav`，选中项 `aria-current="true"`。`role="tablist"` 时是标签页模式，上下方向键不切换标签。`edgeCompensation="inline"` 与 `isFullBleed` 都带贴边类，两个都写时以前者为准。
4. `SideNavItem` 的 `actions` 插槽渲染在主控件旁边，不在链接里面。侧栏收起后这一块不出现。收起后调用方的 `aria-label` 盖过项的名字。
5. 悬停打开导航菜单后，在 500 毫秒内再点触发器，菜单仍开着；再点一次才关掉。
6. `href="javascript:alert(1)"` 的导航项、菜单项、面包屑不是链接，元素上没有 `href`。
7. 移动导航打开时 `document.body` 的 `overflow` 被锁住，关掉后恢复。打开后再登记一层更晚的关闭层，按 Escape 先关那一层，抽屉的 `openChange` 不发出。关掉后焦点回到打开它的按钮。抽屉样式是 `overflow: clip`，并允许 `pinch-zoom`。
8. 面包屑没有人声明当前项时，最后一项带 `aria-current="page"`。某一项 `isCurrent` 为 `false` 时，它不是当前项。默认分隔符 `/` 带镜像类，自定义分隔符不带。当前项有半粗字重的类。

### 二、反向挑刺

9. 只用键盘：标签条左右方向键和 Home、End 仍能换项。`role="tablist"` 时 ArrowDown 不调用选中。抽屉的 Escape 仍能关。
10. 读屏：侧栏是 `nav`；宽度把手 `aria-controls` 指向侧栏 id；滚动箭头不在无障碍树里；面包屑分隔符 `aria-hidden`。
11. 服务端渲染：这些组件不在 `ssr-known-failures.json`。`env -u NODE_ENV pnpm docs:build` 通过。
12. 空数据：面包屑只有一项、标签条只有一项、分页没有溢出时，界面不报错，也不凭空出现滚动箭头。
13. 图标：滚动箭头用语义名 `chevronLeft`、`chevronRight`。没有把上游图标组件搬过来。`NavIcon` 的类是 `astryx-nav-icon`，源码里没有 `navicon` 这个类。
14. 没有 `!important`：`node scripts/check-no-important.mjs` 通过。`nav-menu.css` 里没有 `not-allowed`。

### 三、C 节点通用检查

15. 台账 `ledger/C13.md` 每一条都是 `- [x]`，下面都有 `- 结论：已采纳` 或 `- 结论：不适用：<理由>`。抽查至少 3 条「已采纳」，确认确实做了；抽查全部「不适用」的理由，确认站得住。
16. 上游新增或改动的测试里，本轮改到的行为（标签滚动、actions、收起时的 aria-label、悬停按下不关、危险地址、抽屉焦点与关闭栈、面包屑自动当前项和斜杠）都有对应的 Vue 测试，两种 `NODE_ENV` 下都通过。Playwright 夹具不要求逐条搬。
17. 中英文文档里标签条的 `overflow`、侧栏项的 `actions`、移动导航的焦点和关闭，和现在的行为一致。打开中文侧栏页和标签页，示例能操作。
18. 本节点组件不在 SSR 已知失败名单里。
19. 附带了四种组合的文档站整页图，并且你亲眼看过。报告里每张图标明是「文档站整页」。无对位。
20. 新写和改到的源码不超过 500 行：`node scripts/check-line-limit.mjs` 通过。没有为了过线去改白名单。

### 四、整体

21. `env -u NODE_ENV pnpm exec vitest run --maxWorkers=2 packages/core/src/TabList packages/core/src/SideNav packages/core/src/TopNav packages/core/src/MobileNav packages/core/src/NavMenu packages/core/src/NavItem packages/core/src/Breadcrumbs packages/core/src/Pagination` 通过；`NODE_ENV=production` 同一命令通过；用例数相同。
22. `env -u NODE_ENV pnpm --filter @astryx-vue/core typecheck`、改过源码的 eslint `--max-warnings 0`、`node scripts/check-line-limit.mjs`、`node scripts/check-no-important.mjs`、`node scripts/sync-exports.mjs --check` 通过。
23. 改动范围：`git diff $BASE --stat` 里没有计划范围以外的文件。`ROADMAP.md`、`SWARM.md`、`HANDOFF.md` 没有改动。`line-limit-allowlist.json` 和 `catalog.json` 没有改动。
24. 注释里没有修改历史：`git diff $BASE | grep -nE "^\+.*(原来|改成|之前|moved|extracted|split from)"` 没有命中，或者命中的都不是在讲修改历史。

## 结论

- 只要有一条不过，结论就是「不通过」。
- 报告写到 `.agents-work/upstream-sync-0.7.1/nodes/C13/verify-<N>.md`。
- 最终回复用中文，200 字以内。

## 验证操作要短小

每次验证只测一件事，每条命令都要有时间上限：浏览器命令用 `browser-lock.mjs run --max-run <秒>`，默认 180 秒；其他命令用 `timeout <秒>`。超时了不要原样重跑，先把卡住的那一步单独拆出来。脚本和结果都放在 `/tmp/verify-C13/`。

# C15 验收报告 · 第 1 轮

结论：不通过（24/26）

- 工作区：`/workspace`，分支 `sync/c15-feedback`，验收时的实现提交 `90aef90`。本报告若另有提交，只增加本文件。
- 比较基点：`BASE = 4a5b9a4227675ee7ca1f56caa17788d5e30adead`。本地没有 `swarm-tree` 这个名字，`git fetch origin swarm-tree` 之后 `git merge-base HEAD origin/swarm-tree` 就是这个提交，并且 `origin/swarm-tree` 目前也停在这里。
- 临时文件和截图：`/tmp/verify-C15/`。截图在 `/opt/cursor/artifacts/`，没有进 git。全部自己重新生成，没有用实现者留下的产物。
- 只读检查：开始时 `git status` 是 `On branch sync/c15-feedback` / `nothing to commit, working tree clean`。结束时同样是干净工作区。两次相同。
- 临时改动：为确认空插槽，曾写入 `packages/core/src/Banner/c15-probe.test.ts`，跑完已删除。本地 `pnpm --filter @astryx-vue/core build` 生成的 `dist/` 被 gitignore，没有进提交。已还原，无残留。
- 浏览器：`scripts/swarm/browser-lock.mjs run --max-run`，槽位 `browser-1`。文档站 `http://127.0.0.1:5199`，`env -u NODE_ENV pnpm --filter @astryx-vue/docs dev`。结束后端口 5199 没有监听，没有残留 Chrome，两把浏览器锁都空闲。

给 D7 的说明写在 `impl-1.md` 末尾，和代码一致：提示条不再从 `status` 推导 `role` / `aria-live`，要实时区域得自己写 `role`；进度条默认 `variant` 从 `neutral` 改成 `accent`。这不是验收清单里的单独一条，不另判不过。

## 逐条结果

| # | 检查项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | 提示条文档站四套整页 | 过 | 中文 `/components/banner`。桌面 1440×900、390×844，浅色和深色，都滚到「可折叠」。侧栏或「菜单」顶栏可见。彩色条、状态图标、说明在标题下，详情可展开。另截「通栏」「状态」「浮动」：通栏 `border-radius: 0px`，浮动有阴影。图见下表。 |
| 2 | 加载圈弧线、步骤条轨道指示点 | 过 | `/components/spinner` 深色桌面和 390，浅色「带文字」。弧的 `animation-name` 是 `astryx-spinner-dash`，400ms 内 `stroke-dashoffset` 从 `-18.56px` 变到 `-11.08px`；svg 的 `transform` 是 `none`，动画数 0，弧的动画数 1。`onMedia` 描边 `rgb(255, 255, 255)`。带文字的示例文字在圆环下面。`/components/stepper` 滚到「轨道上的水平步骤」：当前步是 Integrations，数字嵌在线上。 |
| 3 | 提示条不按 status 推导 role，折叠行为 | 过 | 文档站上 `.astryx-banner-frame` 的 `role` 和 `aria-live` 都是 null。`Banner.test.ts` 对 info/success/error/warning 断言没有 role；传入 `role="alert"` 留在根上。默认有详情时先收起，点开后出现；`collapsible: false` 没有按钮、详情直接在。浏览器里「可折叠」点击能收起再展开。 |
| 4 | 关闭按钮的名字和提示 | 过 | 文档站中文聚焦关闭按钮：无障碍名 `关闭“Deployment complete”`，提示「关闭」且处于显示。英文页名是 `Dismiss Deployment complete`，提示 `Dismiss`。探针里显式 `dismissLabel="关掉这条"` 时，名字和提示都是这句话。英文默认名 `Dismiss Saved` 由 `Banner.test.ts` 锁住。 |
| 5 | 关闭和收起时交还焦点 | 过 | 浏览器：先聚焦顶栏搜索，再聚焦关闭按钮并按 Enter，焦点回到 `VPNavBarSearchButton`，该示例里的提示条少一条。父组件收起且焦点在详情里时，`Banner.test.ts` 的 `returns focus to the disclosure when a parent closes focused content` 通过（两种 NODE_ENV 都在这 62 条里）。 |
| 6 | 加载圈无障碍名 | 过 | `Spinner.test.ts`：不写 label 时英文 `Loading`、简体中文 `加载中`。字符串 label 且没有 `aria-label` 时用 `aria-labelledby`，没有重复的 `aria-label`。 |
| 7 | 不确定进度不报数值，刻度在外面 | 过 | 文档站不确定进度条 `data-variant="accent"`，`aria-valuenow/min/max/valuetext` 都是 null。刻度 `tabindex="0"`，不在 `progressbar` 里面。`ProgressBar.test.ts` 同一组断言通过。非有限值见第 14 条。 |
| 8 | 状态点默认无图标 | 过 | `StatusDot.test.ts`：不传图标时没有 `.astryx-status-dot__icon`。传入图标或插槽后，图标 `aria-hidden`，圆点 `aria-label` 仍是 `label`。文档站状态点页没有图标节点，`role="img"`。 |
| 9 | 步骤条空隙、按压、禁用指针 | 过 | 水平根有 `astryx-stepper-frame`，变量计算值 `0px`，列表也是 `0px`。祖先写成 20px 时外框仍是 `0px`。`.astryx-popover` 上该变量是空（initial），里面的外框回到 `0px`。把外框设成 8px 后，连接线 `clip-path` 为 `inset(0px 8px 0px 0px)`。可点步骤有 `data-astryx-pressable`。窄步骤条禁用的「上一步」`cursor` 是 `default`。`styles/layer.css` 浮层根选择器里有 `--astryx-step-connector-gap: initial`。 |
| 10 | 键盘 | 过 | 提示条展开按钮按 Enter 从 `aria-expanded=true` 变成 false，详情卸载；再按 Space 回到 true，详情出现。步骤按钮是 `button`，Enter 后当前步变成 Workspace。进度刻度聚焦后 `document.activeElement` 就是 `.astryx-progress-bar-mark`。 |
| 11 | 装饰元素隐藏、状态点是 img | 过 | 提示条图标 `aria-hidden="true"`。加载圈 svg `aria-hidden="true"`。状态点 `role="img"`。测试文件里也有同样断言。 |
| 12 | 服务端渲染 | 过 | `ssr-known-failures.json` 是空对象，Banner、Spinner、ProgressBar、StatusDot、Stepper、EmptyState、Skeleton 都不在里面。`Banner.test.ts` 的 SSR 用例要求 `defaultIsOpen` 时 HTML 含详情和 `aria-expanded="true"`，已通过。 |
| 13 | 长标题折行，空插槽不出展开按钮 | 不过 | 折行过了：标题 `overflow-wrap` 是 `anywhere`；把标题改成 120 个 `A` 后，宽 856px、行高 17.5px、高度 35px，折成两行。空插槽不过：不传默认插槽时没有按钮；插槽返回 null、false、空字符串、空数组，或模板里 `v-if="false"`，都会出现「展开」。`collapsible=false` 且插槽为空时没有按钮，但 `.astryx-banner-content` 仍然在。上游 v0.7.1 `Banner.test.tsx` 的 empty slots 要求 `{false}` 不画展开按钮，也不画详情区。原因是 `hasContent` 用了 `!!slots.default`，只判断函数在不在。 |
| 14 | 未知状态和非法进度值 | 过 | `Banner.test.ts`：`status` 写成 neutral 时没有 `data-status`，也没有 `.astryx-field-icon`。样式只给 info/success/warning/error 铺底色。探针：`value` 为 Infinity、`max` 为 NaN 时 `aria-valuenow` 是 `0`，HTML 不含 `NaN`。 |
| 15 | 沿用现有图标 | 过 | 提示条用 `FieldIcon`。状态点用调用方传入的组件或插槽。步骤条是组件里的 svg。`git diff $BASE --stat` 没有新的图标注册表。 |
| 16 | 没有 !important，没改 layer/ 和 Toast | 过 | `node scripts/check-no-important.mjs` 退出码 0。`git diff $BASE --stat` 没有 `layer/` 目录，也没有 `ToastViewport.vue`。改到的是 `packages/core/styles/layer.css` 里原有浮层根重置，加了一行变量。 |
| 17 | 台账 57 条和抽查 | 不过 | 57 个 `- [x]`，57 条都有「结论：」。抽到的已采纳里，不推导 role、连接线空隙、不确定进度不报数值，都做到了。`4d004cdb4` 写成「空插槽没有展开按钮」，和第 13 条的实测相反，这条已采纳不成立。不适用的理由能站住：骨架屏那条上游提交 `a19888426` 只改 doc/spec；禁用指针先改成 not-allowed 再改回，页面上禁用「上一步」已是 `default`；CheckIndicator 只在选中时画勾。其余不适用按台账文件列表是规范、文档、CLI、StyleX 或 lab，不改变本节点组件行为。 |
| 18 | 对应的 Vue 测试，两种 NODE_ENV 用例数相同 | 过 | 角色、关闭命名、折叠、加载圈名字、不确定进度、连接线空隙都有测试。`env -u NODE_ENV` 与 `NODE_ENV=production` 都是 6 个文件、62 条，退出码 0。 |
| 19 | 文档去掉过时的 role=alert 说法，中英文能展开能关闭 | 过 | 中英文提示条页都改成 status 只决定颜色和图标，不再写「warning 和 error 使用 role=alert」。英文页 Enter 把 Collapse 收成 Expand；Space 关掉一条 Dismiss 示例。 |
| 20 | 组件不在 ssr 失败名单 | 过 | 同第 12 条，名单为空。 |
| 21 | 至少 4 张文档站整页，并且亲眼看过 | 过 | 见「看图」。超过 4 张，都是中文文档站整页，能看到顶栏，桌面能看到侧栏，390 能看到「菜单」。夹具和 `pnpm visual` 没有当作这一条。 |
| 22 | 源码不超过 500 行 | 过 | `node scripts/check-line-limit.mjs` 通过。本分支改过的源码最长是 `stepper.css` 398 行。 |
| 23 | 相关测试与全量测试 | 过 | 相关 6 文件 62 条，两种 NODE_ENV 相同。全量也跑完了：两种都是 287 个文件、4033 条，退出码 0。不是只拿相关测试充当全量。 |
| 24 | typecheck 和相关 lint | 过 | `env -u NODE_ENV pnpm typecheck` 退出码 0。对改过的 Banner、Spinner、ProgressBar、StatusDot、Stepper、CheckboxIndicator 源码和测试跑 `eslint --max-warnings 0`，退出码 0。 |
| 25 | diff 范围和生成文件 | 过 | `git diff $BASE --stat` 没有 `layer/`，没有 Toast 关闭栈。`node scripts/sync-exports.mjs --check` 打印「生成结果和已提交文件一致」，退出码 0。 |
| 26 | 注释不写修改历史 | 过 | `git diff $BASE` 的新增行里，`原来|改成|之前|moved|extracted|split from` 有命中。代码里只有 `spinnerGeometry.ts` 的「原来的登记仍然有效」，说的是重复登记 CSS 属性时保留已有登记，不是修改历史。其余命中在台账、计划和文档用词里。 |

## 看图

下面除最后一行对照图以外，都是文档站整页。地址是 `http://127.0.0.1:5199/components/<slug>`。浅色页 `html` 没有 `dark`，深色页有。没有白屏、骨架或报错层。

| 图 | 来源 | 看到的内容 |
| --- | --- | --- |
| `/opt/cursor/artifacts/c15-banner-desktop-light.png` | 文档站整页 | 1440×900 浅色。顶栏和左侧「提示条」高亮。滚到「可折叠」：黄底警告条、图标、说明、Review、展开和关闭，详情已展开。下面「关闭」有绿、黄、灰三条。 |
| `/opt/cursor/artifacts/c15-banner-desktop-dark.png` | 文档站整页 | 同一位置深色。警告条变成深黄，详情区是深底。侧栏和顶栏都在。 |
| `/opt/cursor/artifacts/c15-banner-mobile-light.png` | 文档站整页 | 390×844 浅色。顶上是「菜单」和「返回顶部」。可折叠示例里按钮换到文字下面。 |
| `/opt/cursor/artifacts/c15-banner-mobile-dark.png` | 文档站整页 | 390 深色，同样能看到菜单顶栏和可折叠示例。 |
| `/opt/cursor/artifacts/c15-banner-section-light.png` | 文档站整页 | 滚到「通栏」和「状态」。通栏两条没有圆角。状态四条分别是灰、绿、黄、红。 |
| `/opt/cursor/artifacts/c15-banner-section-dark.png` | 文档站整页 | 同一段深色。计算样式里 section 圆角仍是 0。 |
| `/opt/cursor/artifacts/c15-banner-floating-light.png` | 文档站整页 | 「浮动」那条有一圈阴影。下面通栏仍是直角。 |
| `/opt/cursor/artifacts/c15-spinner-desktop-dark.png` | 文档站整页 | `/components/spinner` 滚到「深色底」。左边浅环，右边深底上的环是浅色。下面四种尺寸，弧线停在圆环上，整圈没有跟着转。 |
| `/opt/cursor/artifacts/c15-spinner-desktop-light.png` | 文档站整页 | 滚到「带文字」。Loading... 和 Fetching data 都在圆环下面。 |
| `/opt/cursor/artifacts/c15-spinner-mobile-dark.png` | 文档站整页 | 390 深色，顶栏是「菜单」。深色底和尺寸示例都在视口里。 |
| `/opt/cursor/artifacts/c15-stepper-desktop-light.png` | 文档站整页 | `/components/stepper` 滚到「轨道上的水平步骤」。1 到 5 嵌在线上，当前是加粗的 3 Integrations，前面的线是深色。下面垂直步骤也能看到当前步。 |
| `/opt/cursor/artifacts/c15-progress-desktop-light.png` | 文档站整页 | `/components/progress-bar` 滚到「不确定进度」，一段深色填充在灰轨道上移动。下面语义颜色里 Accent 是深色，不是中性灰。 |
| `/opt/cursor/artifacts/c15-status-desktop-dark.png` | 文档站整页 | `/components/status-dot` 深色，滚到「变体」。色点旁边有文字，变体是五个纯色点，没有图标。 |
| `/opt/cursor/artifacts/c15-upstream-banner.png` | 上游官网整页 | `https://astryx.atmeta.com/components/Banner` 总览，v0.7.1。info 是浅蓝。 |
| `/opt/cursor/artifacts/c15-banner-vs-upstream.png` | 左右对照 | 左是上游总览，右是文档站「通栏 / 状态」。下半截黑边是两张图拼完后视口剩下的空白，不是页面报错。 |

## 对实现者偏离计划的判断

台账把 `dfdd77805` 按「内容默认可见」写，实现改成默认可折叠、一开始收起，并在结论里写明。这和上游 v0.7.1 源码以及本次验收第 3 条一致，合理。

EmptyState、Skeleton 没有改组件源码。台账里骨架屏那条是解剖记录，上游提交只动 doc/spec，标不适用站得住。台账没有单独的 EmptyState 行为条。这不算不过。

实现者没有交步骤条整页图。验收第 2 条和第 21 条要求的是验收者自己打开页面并留下文档站整页。我补了 `/components/stepper` 的桌面浅色整页，当前步和轨道指示点都在，不因此不过。

## 不通过的项要怎么改

1. 第 13 条。现象：`<Banner>` 里默认插槽存在但画不出节点时，仍出现展开按钮；`collapsible` 为 false 时还会留下一块空的详情区。复现：挂一个 `slots.default` 返回 `null`，或在模板里写 `<span v-if="false">`。期望：和上游一样，空内容不出现展开按钮，也不画详情区；真正有子节点时才出现展开按钮，并且默认收起。
2. 第 17 条。把 `ledger/C15.md` 里 `4d004cdb4` 的结论改成和上面的实际行为一致。空插槽补上测试之后，才能再写成已采纳。

## 改进建议（不影响结论）

上游官网总览的 info 底色大约是 `rgb(184, 208, 248)`，我们文档站 neutral 主题是 `rgb(245, 245, 245)`。`packages/themes/neutral/banner.css` 这次没有改，token 本来就是 `#f5f5f5`。如果要和官网那套蓝底对齐，应单独看主题，不要算进这次空插槽的问题。

中文进度条文档仍写「进度条没有可以聚焦的元素」。刻度已经能被 Tab 聚焦，这句话过时了。

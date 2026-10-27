# C15 验收报告 · 第 2 轮

结论：通过（26/26）

- 工作区：`/workspace`，分支 `sync/c15-feedback`。验收时的实现提交是 `af9ebe7`（`docs(c15): 写下反馈与状态第 2 轮实现回报`）。本报告若另有提交，只增加本文件。
- 比较基点：`BASE = 4a5b9a4227675ee7ca1f56caa17788d5e30adead`。`git fetch origin swarm-tree` 之后，`git merge-base HEAD origin/swarm-tree` 与 `origin/swarm-tree` 都停在这个提交。
- 临时文件和截图：`/tmp/verify-C15/`。截图在 `/opt/cursor/artifacts/`，没有进 git。全部自己重新生成。
- 只读检查：开始时 `git status` 是 `On branch sync/c15-feedback` / `nothing to commit, working tree clean`。为在文档页上确认空插槽，临时加过 `apps/docs/components/demos/banner/empty-probe.vue` 和提示条页末尾一节，测完已用 `git checkout --` 和删除还原。`pnpm --filter @astryx-vue/core build` 生成的 `dist/` 被 gitignore。还原后、提交本报告前，工作区里只有本文件。
- 浏览器：`scripts/swarm/browser-lock.mjs run`，槽位 `browser-1`。文档站 `http://127.0.0.1:5199`，`env -u NODE_ENV pnpm --filter @astryx-vue/docs dev --port 5199 --host 127.0.0.1`。结束后端口 5199 没有响应，两把浏览器锁都空闲。

## 逐条结果

| # | 检查项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | 提示条文档站四套整页 | 过 | 中文 `/components/banner`。桌面 1440×900、390×844，浅色和深色，都滚到「可折叠」。桌面能看到侧栏和顶栏，390 能看到「菜单」。彩色条、状态图标、说明在标题下，详情可展开。另截「通栏」「状态」「浮动」：通栏计算样式 `border-radius: 0px`，浮动阴影不是 `none`。图见下表。 |
| 2 | 加载圈弧线、步骤条轨道指示点 | 过 | `/components/spinner` 深色桌面和 390，浅色「带文字」。弧的 `animation-name` 是 `astryx-spinner-dash`，400ms 内 `stroke-dashoffset` 从 `-32.67px` 变到 `-22.20px`。svg 的 `transform` 是 `none`，动画数 0，弧的动画数 1。`onMedia` 描边 `rgb(255, 255, 255)`。带文字的示例，文字在圆环下面。`/components/stepper` 桌面滚到「轨道上的水平步骤」：1 到 5 嵌在线上，当前步是 Integrations。390 宽时这条水平步骤收成当前一步，下面的垂直步骤仍能看到轨道上的指示点。 |
| 3 | 提示条不按 status 推导 role，折叠行为 | 过 | 文档站上全部 `.astryx-banner-frame` 的 `role` 都是 null，没有 `aria-live`。`Banner.test.ts` 对 info/success/error/warning 断言没有 role；传入 `role="alert"` 留在根上。文档「可折叠」示例写了 `default-is-open`，所以一打开是展开的；Enter 收起后详情卸载，`aria-expanded` 变成 `false`，Space 再展开。不写 `defaultIsOpen` 的真实子节点（探针 `real`，以及 `starts closed` 这条测试）一开始没有详情，按钮是「展开」。`collapsible: false` 且有真实详情时，测试断言没有按钮、详情直接在。 |
| 4 | 关闭按钮的名字和提示 | 过 | 中文页聚焦关闭按钮：无障碍名 `关闭“Deployment complete”`，提示「关闭」且处于显示。英文页名是 `Dismiss Deployment complete`，提示 `Dismiss`。`Banner.test.ts` 锁住英文默认名 `Dismiss Saved`，以及显式 `dismissLabel` 同时作为名字和提示。 |
| 5 | 关闭和收起时交还焦点 | 过 | 浏览器：先聚焦顶栏搜索，再聚焦关闭按钮并按 Enter，焦点回到 `VPNavBarSearchButton`，该示例里的提示条少一条。父组件收起且焦点在详情里时，`returns focus to the disclosure when a parent closes focused content` 在两种 `NODE_ENV` 的 74 条里通过。 |
| 6 | 加载圈无障碍名 | 过 | `Spinner.test.ts`：不写 label 时英文 `Loading`、简体中文 `加载中`。文档站「带文字」的字符串 label 使用 `aria-labelledby`，没有重复的 `aria-label`。 |
| 7 | 不确定进度不报数值，刻度在外面 | 过 | 文档站不确定进度条 `data-variant="accent"`，`aria-valuenow/min/max/valuetext` 都是 null。刻度 `tabindex="0"`，聚焦后 `document.activeElement` 就是这个刻度，并且不在 `progressbar` 里面。`ProgressBar.test.ts` 同一组断言通过。 |
| 8 | 状态点默认无图标 | 过 | 文档站状态点页 13 个圆点都是 `role="img"`，带图标节点的数量是 0。`StatusDot.test.ts`：不传图标时没有 `.astryx-status-dot__icon`；传入后图标 `aria-hidden`，圆点 `aria-label` 仍是 `label`。 |
| 9 | 步骤条空隙、按压、禁用指针 | 过 | 水平外框变量计算值 `0px`。把祖先写成 `20px` 后，外框仍是 `0px`。样式表里列表是 `inherit`，这时计算值也是 `0px`。把外框设成 `8px` 后，连接线 `clip-path` 为 `inset(0px 8px 0px 0px)`。可点步骤有 `data-astryx-pressable`。窄步骤条点到头之后，禁用的「上一步」`cursor` 是 `default`。`styles/layer.css` 浮层根有 `--astryx-step-connector-gap: initial`。 |
| 10 | 键盘 | 过 | 提示条展开按钮按 Enter 从展开变成收起，再按 Space 展开。英文页 Enter 把 Collapse 收成 Expand。步骤按钮聚焦后按 Enter，当前步变成 Workspace。进度刻度能被聚焦。 |
| 11 | 装饰元素隐藏、状态点是 img | 过 | 提示条图标 `aria-hidden="true"`。加载圈 svg `aria-hidden="true"`。状态点 `role="img"`。测试文件里也有同样断言。 |
| 12 | 服务端渲染 | 过 | `ssr-known-failures.json` 是空对象。`Banner.test.ts` 的 SSR 用例要求 `defaultIsOpen` 时 HTML 含详情和 `aria-expanded="true"`，已通过。 |
| 13 | 长标题折行，空插槽不出展开按钮 | 过 | 标题 `overflow-wrap` 是 `anywhere`。把标题改成 120 个 `A` 后，宽 474px、行高 17.5px、高度 53px，折成三行。空插槽：`Banner.test.ts` 的 empty slots 在两种 `NODE_ENV` 下通过。文档页临时探针（源码已还原）在浏览器里读到：`null`、`false`、`''`、`[]`、模板 `v-if="false"`、`collapsible=false` 加空内容，都没有展开按钮，也没有 `.astryx-banner-content`，外框只有 1 个子节点。真实 `<p>Detail</p>` 有「展开」，`aria-expanded="false"`，详情不在。`v-if` 从 false 变成 true 之后才出现「展开」，并且仍然先收起。 |
| 14 | 未知状态和非法进度值 | 过 | `Banner.test.ts`：`status` 写成 neutral 时没有 `data-status`，也没有 `.astryx-field-icon`。`ProgressBar.vue` 用 `Number.isFinite` 把非法值收成 0。`ProgressBar.test.ts`：`value` 为 `NaN` 时 `aria-valuenow` 是 `0`，填充宽度是 `0%`。 |
| 15 | 沿用现有图标 | 过 | 提示条用 `FieldIcon`。状态点用调用方传入的组件或插槽。步骤条是组件里的 svg。`git diff $BASE --stat` 没有新的图标注册表。 |
| 16 | 没有 !important，没改 layer/ 和 Toast | 过 | `node scripts/check-no-important.mjs` 退出码 0。`git diff $BASE --stat` 没有 `layer/` 目录，也没有 `ToastViewport.vue`。改到的是 `packages/core/styles/layer.css` 里原有浮层根重置，加了一行变量。 |
| 17 | 台账 57 条和抽查 | 过 | 57 个 `- [x]`，57 条都有「结论：已采纳」或「结论：不适用」。已采纳 33，不适用 24。`4d004cdb4` 现在写成：空返回值和 `v-if` 为 false 时没有展开按钮，`collapsible` 为 false 时不留空详情区。这和第 13 条的测试、文档页探针一致，可以标已采纳。另抽到的已采纳也对得上：不推导 role、连接线空隙、不确定进度不报数值、关闭按钮带标题、状态点默认无图标、禁用指针是 `default`。不适用的理由能站住：骨架屏 `a19888426` 的 diff 不改组件源码；`e891c0dc8` 被后一条 `8a9d85fdf` 改回 `default`，页面上禁用「上一步」已是 `default`；CheckIndicator 不在本分支 diff 里，测试仍是只在选中时画勾。其余不适用按台账文件列表是规范、文档、CLI、StyleX 或 lab。 |
| 18 | 对应的 Vue 测试，两种 NODE_ENV 用例数相同 | 过 | 角色、关闭命名、折叠、空插槽、加载圈名字、不确定进度、连接线空隙都有测试。`env -u NODE_ENV` 与 `NODE_ENV=production` 都是 6 个文件、74 条，退出码 0。 |
| 19 | 文档去掉过时的 role=alert 说法，中英文能展开能关闭 | 过 | 中英文提示条页都写 status 只决定颜色和图标。英文页 Enter 把 Collapse 收成 Expand；Space 关掉一条 Dismiss 示例。 |
| 20 | 组件不在 ssr 失败名单 | 过 | 同第 12 条，名单为空。 |
| 21 | 至少 4 张文档站整页，并且亲眼看过 | 过 | 见「看图」。都是中文文档站整页，能看到顶栏；桌面能看到侧栏，390 能看到「菜单」，并滚到有实质 Demo 的段落。空插槽两张是同一页上的临时探针，已标明，不拿来代替上面这组。 |
| 22 | 源码不超过 500 行 | 过 | `node scripts/check-line-limit.mjs` 通过。本分支改过的源码最长是 `stepper.css` 398 行。脚本另外提示了几个本节点没改的文件行数下降，不影响这一条。 |
| 23 | 相关测试与全量测试 | 过 | 相关 6 文件 74 条，两种 `NODE_ENV` 相同。全量也跑完了：两种都是 287 个文件、4045 条，退出码 0。比第 1 轮多出的 12 条就是提示条 empty slots。 |
| 24 | typecheck 和相关 lint | 过 | `env -u NODE_ENV pnpm typecheck` 退出码 0。对 Banner、Spinner、ProgressBar、StatusDot、Stepper、CheckboxIndicator 跑 `eslint --max-warnings 0`，退出码 0。 |
| 25 | diff 范围和生成文件 | 过 | `git diff $BASE --stat` 没有 `layer/`，没有 Toast 关闭栈。`node scripts/sync-exports.mjs --check` 打印「生成结果和已提交文件一致」，退出码 0。 |
| 26 | 注释不写修改历史 | 过 | `git diff $BASE` 的新增行里，`原来|改成|之前|moved|extracted|split from` 有命中。代码里只有 `spinnerGeometry.ts` 的「原来的登记仍然有效」，说的是重复登记 CSS 属性时保留已有登记。其余命中在台账、计划和验收文档的用词里。 |

## 看图

下面除对照图和空插槽探针以外，都是改探针之前截的文档站整页。地址是 `http://127.0.0.1:5199/components/<slug>`。浅色页 `html` 没有 `dark`，深色页有。没有白屏、骨架或报错层。

| 图 | 来源 | 看到的内容 |
| --- | --- | --- |
| `/opt/cursor/artifacts/c15-v2-banner-desktop-light.png` | 文档站整页 | 1440×900 浅色。顶栏和左侧「提示条」高亮。滚到「可折叠」：黄底警告条、图标、说明、Review、展开和关闭，详情已展开。下面「关闭」有绿、黄、灰三条。 |
| `/opt/cursor/artifacts/c15-v2-banner-desktop-dark.png` | 文档站整页 | 同一位置深色。警告条变成深黄，详情区是深底。侧栏和顶栏都在。 |
| `/opt/cursor/artifacts/c15-v2-banner-mobile-light.png` | 文档站整页 | 390×844 浅色。顶上是「菜单」和「返回顶部」。可折叠示例里按钮换到文字下面。 |
| `/opt/cursor/artifacts/c15-v2-banner-mobile-dark.png` | 文档站整页 | 390 深色，同样能看到菜单顶栏和可折叠示例。 |
| `/opt/cursor/artifacts/c15-v2-banner-section-light.png` | 文档站整页 | 滚到「通栏」和「状态」。通栏两条贴边。状态四条分别是灰、绿、黄、红。 |
| `/opt/cursor/artifacts/c15-v2-banner-section-dark.png` | 文档站整页 | 同一段深色。计算样式里 section 圆角是 0。 |
| `/opt/cursor/artifacts/c15-v2-banner-floating-light.png` | 文档站整页 | 「浮动」那条有一圈阴影。下面通栏仍是直角。 |
| `/opt/cursor/artifacts/c15-v2-spinner-desktop-dark.png` | 文档站整页 | `/components/spinner` 滚到「深色底」。左边浅环上有一段弧，右边深底上的环是浅色。下面四种尺寸，弧线停在圆环上。 |
| `/opt/cursor/artifacts/c15-v2-spinner-desktop-light.png` | 文档站整页 | 滚到「带文字」。Loading... 和 Fetching data 都在圆环下面。 |
| `/opt/cursor/artifacts/c15-v2-spinner-mobile-light.png` | 文档站整页 | 390 浅色，「菜单」顶栏。带文字示例和下面的无障碍说明都在。 |
| `/opt/cursor/artifacts/c15-v2-spinner-mobile-dark.png` | 文档站整页 | 390 深色。深色底和尺寸示例都在视口里。 |
| `/opt/cursor/artifacts/c15-v2-stepper-desktop-light.png` | 文档站整页 | `/components/stepper` 滚到「轨道上的水平步骤」。1 到 5 嵌在线上，当前是加粗的 3 Integrations。下面垂直步骤也能看到当前步。 |
| `/opt/cursor/artifacts/c15-v2-stepper-desktop-dark.png` | 文档站整页 | 同一位置深色，轨道和当前步都在。 |
| `/opt/cursor/artifacts/c15-v2-stepper-mobile-light.png` | 文档站整页 | 390 浅色。水平步骤因为容器变窄收成「3 Integrations」，上下有箭头。下面垂直步骤仍是轨道指示点。 |
| `/opt/cursor/artifacts/c15-v2-progress-desktop-light.png` | 文档站整页 | `/components/progress-bar` 滚到「不确定进度」，一段深色填充在灰轨道上。下面语义颜色里 Accent 是深色。 |
| `/opt/cursor/artifacts/c15-v2-progress-desktop-dark.png` | 文档站整页 | 同一位置深色。不确定进度是浅色一段，Accent 是白条。 |
| `/opt/cursor/artifacts/c15-v2-progress-mobile-light.png` | 文档站整页 | 390 浅色。「菜单」顶栏下是不确定进度和五种语义颜色。 |
| `/opt/cursor/artifacts/c15-v2-progress-mobile-dark.png` | 文档站整页 | 390 深色，滚到「语义颜色」。五种颜色都在，Accent 是浅色条。 |
| `/opt/cursor/artifacts/c15-v2-status-desktop-dark.png` | 文档站整页 | `/components/status-dot` 深色。色点旁边有文字，变体是五个纯色点，没有图标。 |
| `/opt/cursor/artifacts/c15-v2-upstream-banner.png` | 上游官网整页 | `https://astryx.atmeta.com/components/Banner` 总览，页脚标着 v0.7.1。info 是浅蓝。 |
| `/opt/cursor/artifacts/c15-v2-banner-vs-upstream.png` | 左右对照 | 左是上游总览，右是文档站「通栏 / 状态」。两边都是整页壳子。 |
| `/opt/cursor/artifacts/c15-v2-banner-empty-probe.png` | 文档站整页，临时探针，源码已还原 | 同一条 `/components/banner`，滚到临时加上的「空插槽探针」。null、false、empty、array、pinned、vif、pinned-vif 只有标题条。real 有向下的箭头，详情没收开。侧栏仍在。 |
| `/opt/cursor/artifacts/c15-v2-banner-empty-probe-after.png` | 文档站整页，临时探针，源码已还原 | 点过 reveal 之后。vif-live 和 real 都出现箭头，详情区仍然没收开。其余空行没有箭头。 |

## 对实现者偏离计划的判断

`hasContent` 不放进 `computed`，每次渲染现算。文档页上 `v-if` 从 false 变成 true 之后，展开按钮马上出现，并且默认收起。这样缓存不会把旧的「没有内容」留住，合理。

说明插槽和末尾插槽仍按「插槽函数在不在」判断。验收第 13 条只要求默认插槽。空字符串的 `description` 属性不会画出说明节点，测试锁住了。这不算不过。

台账把 `dfdd77805` 按「内容默认可见」改写成默认可折叠、一开始收起。这和上游 v0.7.1 `Banner.tsx` 里 `collapsible` 默认 true、详情默认收起一致，也和第 3 条实测一致，合理。

上游 v0.7.1 的 `isRenderable` 只拒绝 `null`、布尔和空字符串，空数组算有内容。Vue 这边的 `slots.default()` 经常返回数组，空数组、注释和只有空白的文本都不该算出内容。本仓库的 `isRenderable` 拒绝这些值。文档页探针和测试都按这个结果通过。台账写的是这个实测行为，不是把上游那个浅判断原样抄过来。

## 不通过的项要怎么改

无。

## 改进建议（不影响结论）

上游官网总览的 info 底色是浅蓝，文档站 neutral 主题的 info 是浅灰。`packages/themes/neutral/banner.css` 这次没有改。如果要和官网那套蓝底对齐，应单独看主题。

中文进度条文档仍写「进度条没有可以聚焦的元素」。刻度已经能被 Tab 聚焦，这句话过时了。

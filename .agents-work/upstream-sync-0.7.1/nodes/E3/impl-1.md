# E3 可访问性自动检查 · 第 1 轮实现回报

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/E3`，分支 `sync/e3-a11y`
- 提交：`50c583c feat: 可访问性自动检查——axe 示例区扫描与 button/checkbox/switch 交互契约`（未推送）
- 完整扫描报告副本：`nodes/E3/evidence/1/report.{json,md}`

## 一、做了什么

### 第一层：axe 页面扫描（`pnpm a11y`）

| 文件 | 作用 |
| --- | --- |
| `scripts/swarm/a11y-scan.mjs` | 入口：起文档站、拿浏览器锁、扫描、写报告、对照名单、清理 |
| `scripts/swarm/a11y-scan/pages.mjs` | 从 `apps/docs/components/demos/*/meta.ts` 读 slug（只读文本，不执行），共 245 页 |
| `scripts/swarm/a11y-scan/scan.mjs` | 单页单模式：切深浅色、等示例渲染、只对 `.astryx-demo` 跑 axe |
| `scripts/swarm/a11y-scan/baseline.mjs` | 名单判定：新增、消失、`--update` 只删不加、`--init` 首次建表 |
| `scripts/swarm/a11y-scan/report.mjs` | report.json / report.md 汇总 |
| `scripts/swarm/a11y-scan/args.mjs` | 参数 |
| `scripts/guardrails/a11y-known-issues.json` | 已知问题名单，78 条，值写「负责节点：出现的颜色模式」 |
| `tests/a11y-scan.test.ts` | 纯逻辑测试 14 条，不开浏览器 |

- 依赖：`@axe-core/playwright@4.14.0` 放进 `catalog:visual`。
- 文档站、锁、信号处理复用 A2 的 `serve.mjs` 和 `browser-lock.mjs`，同样的端口 5172 和租约。
- 不接进 `pnpm check`。输出目录 `.agents-work/upstream-sync-0.7.1/a11y/` 已加进 `.gitignore`。
- 用法写进了 `scripts/swarm/README.md`「可访问性扫描」一节。

**范围选择器和计划不同**：计划建议参考 A2 的预览区选择器 `.component-detail__stage`。那只是顶部一块舞台。我改用 `.astryx-demo`：文档站里每个示例都由 `VueDemoHost.vue` 渲染成这个类名，顶部舞台和下面每个示例都算在内，侧栏、导航、标题、说明、代码标签页都不算。这样「组件示例区」覆盖得完整。

**axe 规则**：跑全部规则，关掉和上游 `.github/scripts/accessibility-audit.js` 一样的 5 条页面级规则（html-has-lang、document-title、landmark-one-main、page-has-heading-one、region）。

### 第二层：交互契约（`packages/core/test-support/a11y/`）

位置在 `packages/core/test-support/`，不在 `src/` 下：tsdown 只打 `src/*/index.ts`，`files` 只发 `dist`，`npm pack --dry-run` 里没有任何 a11y 文件。为了让 vue-tsc 也检查它，把 `packages/core/tsconfig.json` 的 `rootDir` 从 `src` 改成 `.`（`noEmit`，不影响产物；我核对过 dist 文件清单和 JS 内容与改动前一致）。

| 文件 | 对应上游 |
| --- | --- |
| `checklist.ts` | checklist.ts，29 个维度 |
| `contract.ts` | contract.ts，`definePattern` 同样拒绝缺出处、缺负责方、级别给错的契约 |
| `harness.ts`、`harness/happy-dom.ts` | harness.ts、harness/jsdom.ts |
| `check.ts`、`report.ts`、`expect.ts` | check.ts、report.ts、expect.ts |
| `patterns/{button,checkbox,switch}.ts` | 同名契约，期望 id 和上游一一对应（button 12 条、checkbox 21 条、switch 16 条） |
| `patterns/*.fixtures.ts`、`self-test.ts`、`patterns/contracts.test.ts` | `*.fixtures.ts`、`*.jsdom.test.ts`，契约自测 |
| `patterns/shared.ts`、`patterns/exemptions.ts` | 新增：三个契约共用的期望实现和清单豁免，避免三份重复 |
| `vue.ts` | 新增：`describeBinding`，Vue 组件绑定的公共写法 |
| `known-failures.ts` | 各组件的 `*.a11y.known-failures.ts` 合成一份 |

绑定测试放在组件旁：
- `src/Button/Button.a11y.test.ts`：Button、IconButton、ClickableCard、SideNavCollapseButton、ChatSendButton，状态和上游 Button.a11y.states.ts 一致，共 16 个状态。另外检查两个排除项（带 href 的 Button、ClickableCard 是链接）和 ToggleButton 带 aria-pressed、归 toggle-button 模式。
- `src/CheckboxInput/Checkbox.a11y.test.ts`：CheckboxInput、CheckboxListItem、DropdownMenuCheckboxItem、SelectableCard，共 29 个状态。
- `src/Switch/Switch.a11y.test.ts`：Switch，10 个状态。

**比上游 jsdom 通道多做的一层（更适合我们的做法）**：上游 jsdom 通道把可访问性树整层报成 unrun，只跑 `dom` 层（description 能不能解析、required 有没有写）。这样「Switch 的 role 被改掉」在快速通道里是抓不到的，计划里的自测第 3 条也就做不到。我加了一个 `computed-dom` 层：用 `dom-accessibility-api`（Testing Library 的 getByRole 用的就是它）按 W3C accname 和 HTML-AAM 规则从 DOM 推算角色、名称、描述、勾选/禁用/无效状态，并用它近似 `accessibility-tree` 层。跑出来的结果带「近似」标记，报告里单独计数。真实浏览器层（焦点、Tab、Space/Enter、指针按下滑开、标签是否真的可见）仍然报 unrun，绝不冒充。新增依赖 `dom-accessibility-api@0.7.1`，放进 `catalog:testing`。

## 二、要回答的问题

### 1. axe 扫出来的现状

- 范围：245 个组件页 × 浅色、深色，共 490 次扫描，没有一次失败。其中 27 页（大多是 `use-*` 组合式函数页）没有示例，扫描结果为空。
- 违规：**140 条**（一条 = 一页 × 一种模式 × 一条规则），涉及 311 个节点，68 个页面有问题。浅色 70 条，深色 70 条。
- 按影响级别：**critical 6，serious 62，moderate 72，minor 0**。
- 按规则：

| # | 规则 | 影响 | 违规数 | 组件数 |
| --- | --- | --- | --- | --- |
| 1 | color-contrast | serious | 40 | 28 |
| 2 | landmark-unique | moderate | 40 | 20 |
| 3 | heading-order | moderate | 24 | 12 |
| 4 | label-content-name-mismatch | serious | 8 | 4 |
| 5 | aria-conditional-attr | serious | 6 | 3 |
| 6 | scrollable-region-focusable | serious | 6 | 3 |
| 7 | aria-required-attr | critical | 4 | 2 |
| 8 | aria-prohibited-attr | serious | 2 | 1 |
| 9 | label | critical | 2 | 1 |
| 10 | landmark-banner-is-top-level（以及 main-is-top-level、no-duplicate-banner、no-duplicate-main，各 2） | moderate | 2 | 1 |

  一共只有 13 条规则，第 10 名并列了 4 条 app-shell 的 landmark 规则。

- critical 明细：`command-palette`、`command-palette-empty` 的搜索框是 combobox 却缺 `aria-controls`（归 C4）；`file-input` 的隐藏 `<input type=file>` 没有关联 label（归 C1）。
- 几条值得交给组件节点注意的 serious：`stepper` 的步骤按钮 aria-label「Go to step 1」不含可见文字（C15）；`table` 和两个 tree 示例在 role=table 的行上用了 aria-expanded/aria-level，应该是 treegrid（C11）；`progress-bar` 在无角色的 span 上写 aria-label（C15）；`layout`、`layout-content`、`layout-panel` 的可滚动区域键盘进不去（C14）；`selector`、`complex-selector`、`avatar-group` 名称不含可见文字（C3、C16）。
- color-contrast 大部分是字段说明文字（`--...-description`）颜色太浅，浅色 #a9a9a9/白底 2.35:1，深色 #5a5b60/#11131d 2.73:1，checkbox-input、switch、field-label 等都是这一处，属于主题色（D1 一起看）。
- **深色比浅色多出的问题**（只在深色出现）：card、command-palette 系列 6 页、context-menu 的 color-contrast，共 8 条。只在浅色出现的也有 8 条：badge、dialog-header、item、link、link-provider、metadata-list-item、theme、visually-hidden 的 color-contrast。总数刚好相同，只是分布不同，计划里「深色问题最多」的预期在我们站上不成立。
- 78 条名单的负责节点：C14 19、C13 16、C4 9、C16 8、C2 3、C3 3、C15 3、C12 3、C11 3、C7 2、C1 2、B1 2、C8 1、C10 1、C6 1、C9 1、C5 1。

### 2. 三个契约里组件过不了的条目

happy-dom 通道能看到的层上：

| 契约 | 组件 | 状态 | 过不了的期望 | 原因 |
| --- | --- | --- | --- | --- |
| button | 5 个组件 16 个状态 | — | **0 条** | — |
| checkbox | CheckboxListItem | list-item-described | `checkbox.description.resolvable`、`checkbox.description.exposed` | `CheckboxListItem` 在自己的 setup 里调 `useItemDescriptionId()`，但提供这个 id 的是它的子组件 `Item`，inject 只能拿到祖先的值，所以永远是 null，说明文字从没挂到复选框的 aria-describedby 上。上游会挂。交给 **C2**（涉及 List/Item，C12 配合）。 |
| checkbox | 其余 3 个组件 25 个状态 | — | 0 条 | — |
| switch | Switch | invalid | `switch.description.resolvable`、`switch.description.exposed` | `Switch` 收了 `status` 只用来设 aria-invalid，既不渲染 FieldStatus 也不把错误信息挂到 aria-describedby，读屏用户只听到「无效」听不到原因，看得见的人也看不到错误文字。上游会挂。交给 **C2**。 |

这 4 条记在 `test-support/a11y/known-failures.ts`，每条钉死期望、组件、状态、环境和失败原文；修好后会变成 unexpected-pass，测试失败，提醒删掉。

**还没验证的**：真实浏览器层（每个契约里的键盘、指针、Tab、可见标签那几条，button 7 条、checkbox 8 条、switch 8 条）这次全部是 unrun。上游在 Chromium 通道记过的已知失败（Button/IconButton 加载中用原生 disabled 导致 Tab 到不了、SelectableCard 禁用时不可聚焦等），我们的组件很可能也有，但没有证据就没有写进名单。

### 3. 其余 21 个模式和 C 节点对应表

上游 patterns 目录共 25 个（含 `listbox-selection` 这个 listbox 的附属测试），去掉这次做的 3 个，剩 21 个：

| 模式 | 上游绑定的组件 | 接手节点 |
| --- | --- | --- |
| toggle-button | ToggleButton、ToggleButtonGroup | C2 |
| radio-group | RadioList、SegmentedControl（DropdownMenu 单选项部分 C6 配合） | C2 |
| slider | Slider | C2 |
| text-input | TextInput、TextArea | C1 |
| spinbutton | NumberInput | C1 |
| listbox（含 listbox-selection） | Selector、MultiSelector 弹出列表 | C3 |
| combobox | Selector 触发器 | C3 |
| menu-button | DropdownMenu、MoreMenu 触发器 | C6 |
| modal-dialog | Dialog | C7 |
| alert-dialog | AlertDialog | C7 |
| status-message | Toast、FieldStatus、Spinner、ProgressBar、ChatSystemMessage、ChatTypingIndicator | C15 主责，C1（FieldStatus）、C7（Toast）、C10（Chat）配合 |
| tabs | TabList、Tab | C13 |
| breadcrumb | Breadcrumbs | C13 |
| disclosure | Collapsible | C14 |
| accordion | CollapsibleGroup | C14 |
| landmark | LayoutHeader、LayoutContent、LayoutFooter、LayoutPanel | C14 |
| window-splitter | ResizeHandle（Resizable） | C14 |
| tree-view | TreeList | C12 |
| grid | Calendar 月视图 | C5 |
| link | Link、LinkProvider、as 路由组件 | C16 |
| carousel | Carousel | C16 |

接法：在 `test-support/a11y/patterns/` 加 `<name>.ts` 和 `<name>.fixtures.ts`，在 `contracts.test.ts` 加一行，组件旁边写 `*.a11y.test.ts` 调 `describeBinding`。共用的期望实现在 `patterns/shared.ts`，按需扩充。

### 4. 台账 ledger/E3.md 37 条

已在工作区的 `.agents-work/upstream-sync-0.7.1/ledger/E3.md` 逐条打勾并在条目下加「结论：」一行，随提交一起。汇总：

- **已采纳（7 条）**：d41bbfa92（框架 + switch）、5967c0764（button）、43f4f7d09（checkbox）、60fc2f233 和 93e81fe14（已知失败和工单分开）、491945a49（expect/check 两层入口）、1252020cd（AST-020/021 规则写进 definePattern 和 check）。每条写明落在哪个文件。
- **交给 Cx（25 条）**：其余 21 个模式各一条，tabs、spinbutton 各多一条修正提交，accordion 多一条规范调整（5a184b794），另有 2710a135a（CommandPalette 空结果播报 → C4）。
- **不适用（5 条）**：ba59d5c99（只改上游 Chromium 通道稳定性，我们暂无该通道）、67f42b3a9（AST-009 真机读屏流程）、176dfa624（上游评审基线分流规则）、17044ab1e（审批人名单）、1f30d4ebc（上游包自己的 vitest 版本），每条都写了理由。

## 三、自测清单

| # | 检查 | 结果 |
| --- | --- | --- |
| 1 | 完整跑 `pnpm a11y`，浅深色都跑，生成 report.json/md，名单和实际一致；再跑一次结果稳定 | 通过。第一次 `--init` 建名单（78 条），约 11 分钟；第二次不带参数，退出码 0，「新增 0、消失 0、仍在 78」。两次的违规集合按（页、模式、规则、节点数）逐条比对完全相同，名单文件也没有变化。 |
| 2 | 在示例里加一个没名字的 `<button>`，`pnpm a11y` 失败并点名组件和 `button-name` | 通过。在 `demos/button/overview.vue` 加 `<button type="button" />`，`pnpm a11y --only button` 退出码 1，输出 `+ button button-name`。还原后同一命令退出码 0。 |
| 3 | 把 Switch 的 role 改掉，switch 契约测试失败 | 通过。去掉 `role="switch"` 后 10 个状态全部失败，信息是「Switch [off] 渲染后找不到角色为 switch 的元素：组件没有把自己报成 switch，switch.role.exposed 不成立」。已还原，`git diff` 无残留。另外契约自测里 `violating-checkbox-role` 夹具也证明了 `switch.role.exposed` 本身会失败。 |
| 4 | 锁目录空、5172 没有服务、没有残留浏览器 | 通过（属于我的部分）。每次扫描后 5172 没有监听，租约 `users/` 为空，锁槽 `browser-2` 已释放。检查时 `browser-1` 被 B1 的 visual-compare 占着，属于 B1；另有一个 10 月 18 日启动、父进程已是 launchd 的 Chrome for Testing（pid 53886），早于本节点开工，不是我开的，没有动它，建议总控确认。 |
| 5 | 两种 NODE_ENV 下全量 vitest 通过；完整 `pnpm check` 通过 | 通过。`vitest run --maxWorkers=2`：不设 NODE_ENV 和 NODE_ENV=production 都是 228 个文件、3033 条全过。check:packages、lint、typecheck、build、lint:pkg 全部退出码 0。新增的契约和绑定测试共 411 条，约 2 秒。 |
| 6 | 新写的源码文件不超过 500 行 | 通过。最长的是 `patterns/checkbox.ts` 353 行；`check-line-limit` 通过。 |

## 四、拿不准的地方

1. **happy-dom 近似层**：`dom-accessibility-api` 的推算和 Chromium 可能有出入。我已按 HTML-AAM 补了原生复选框的 indeterminate 和「必填未勾选就是 invalid」（和上游 fixtures 里 `conforming-required` 的声明一致）。如果评审认为快速通道只该跑 `dom` 层，把 `HAPPY_DOM_APPROXIMATES` 删掉即可，契约不用改；但那样自测第 3 条在 vitest 里就不成立了。
2. **上游 facts 里我们直接沿用了「应该是什么样」**：比如 Button 的 `button-loading` 声明 focusable、SelectableCard 的 `card-disabled` 声明 operable=false。这些在 happy-dom 里只影响 real-browser 期望，所以这次没暴露问题；接上 Chromium 通道后很可能会出现上游那几条同样的已知失败。
3. **上游有、我们没绑的状态**：`input-handlerless-read-only`、`list-item-handlerless-read-only`、`menu-item-handlerless-inert`（上游 React 的「没给 onChange」状态，Vue 的 v-model 没有对应的写法）、`list-item-rich-label-visible-name`（上游 label 可以是节点，我们的 label 是字符串）。这几个不适用于 Vue API，没有硬凑。
4. **名单值的写法**：键是「slug 规则」，值写成「负责节点：模式」。负责节点是我按 ROADMAP 的组件归属手工对照的（`syntax-theme` 归 C9、`theme` 归 B1、`visually-hidden` 归 C14 这几处是就近判断）。
5. **以后接 CI 的建议**：可以在 E4 的 workflow 里加一个只在改到组件或示例时触发的 job，跑 `pnpm a11y --only <改到的 slug>`（复用 `scripts/swarm/changed-components.mjs` 算出 slug），失败时把 report.md 贴进 PR。全量 11 分钟，适合定时任务而不是每个 PR。
6. **浏览器通道怎么接**：见 `packages/core/test-support/a11y/README.md` 末节。要点是实现 `harness/chromium.ts`，`computed()` 读 CDP 的 `Accessibility.getPartialAXTree`，按键和指针用 Playwright；复用同样的状态清单，已知失败用 `harness: 'chromium'` 区分；走浏览器锁，不进 `pnpm check`。

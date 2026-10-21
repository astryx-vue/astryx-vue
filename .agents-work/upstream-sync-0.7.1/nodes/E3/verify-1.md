# E3 可访问性自动检查 · 第 1 轮验收

- 验收者：独立复核，不采信 impl-1.md
- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/E3`，分支 `sync/e3-a11y`，提交 `52380c9`，BASE `b92ee2e`（等于 swarm-tree 当前提交）
- 临时文件：`/tmp/verify-E3/`
- 开始和结束的 `git status --short` 都为空，两次一致

## 结论：通过

20 条检查项全部通过。重点风险（rootDir 改动）已用 BASE/HEAD 双构建比对，产物一致。没有发现需要实现者返工的问题。末尾有几条不影响结论的观察。

## 三处与计划不同的做法

| 编号 | 做法 | 判断 | 证据 |
| --- | --- | --- | --- |
| D1 | 扫描范围改用 `.astryx-demo` | 合理 | 比顶部舞台覆盖全面。见第 3 项：整页探测里文档站导航（`.VPNav`）的违规没有进报告，示例区外的节点都被排除。 |
| D2 | 关掉 5 条页面级规则 | 合理，与上游一致 | `git show v0.7.1:.github/scripts/accessibility-audit.js` 第 121-126 行 `DISABLED_RULES` 是 html-has-lang、document-title、landmark-one-main、page-has-heading-one、region，与 `scan.mjs` 的 `DISABLED_RULES` 逐条相同。 |
| D3 | 契约框架放 `packages/core/test-support/`，tsconfig `rootDir` 由 `src` 改成 `.` | 合理，无副作用 | 见下方「rootDir 风险验证」。 |

## rootDir 风险验证

| 检查 | 结果 | 证据 |
| --- | --- | --- |
| 在 BASE（`/tmp/verify-E3/base`）和 HEAD 各跑 `env -u NODE_ENV pnpm --filter @astryx-vue/core build` | 过 | 两边都构建成功。 |
| 文件清单一致 | 过 | 路径清单去掉哈希后逐行相同，各 502 个文件。`.d.ts` 路径没有多出 `src/`：`find dist -path '*src/*'` 为空，`grep -c 'dist/src'` 在 pack 清单里为 0。 |
| 内容一致 | 过 | `.js`、`.css` 以及入口 `Xxx/index.d.ts`、`index.d.ts` 去掉哈希后相同。 |
| 原始 `diff -r` 有差异 | 已查明，是构建本身的不稳定，与本节点无关 | 第一次 `diff -r` 只有 `.d.ts` 分块文件名里的哈希不同，并且分块内部成员顺序不同（例如 `minRangeSpan` 的行序）。我又在 BASE 上连续构建两次再比，BASE 自己两次的原始 diff 同样不同（涉及 40 多个 `.d.ts`）。把哈希和成员顺序规整后，BASE 两次、HEAD 三份的清单完全一致。 |
| `npm pack --dry-run` 清单 | 过 | BASE 和 HEAD 都是 649 项，去掉哈希后逐行相同。`test-support`、`a11y` 的出现次数为 0。 |
| `publint` | 过 | `All good!`；`pnpm lint:pkg` 退出码 0。 |
| `rootDir` 改动是必要的 | 过 | 临时改回 `src`，`pnpm typecheck` 报 `TS6059: ... test-support/.../contracts.test.ts is not under rootDir`。已还原。 |
| 补充：tsconfig 带 `noEmit`，产物由 tsdown 生成 | 过 | `packages/core/tsconfig.json` 继承 `tsconfig.base.json` 的 `noEmit: true`；`build` 脚本是 `tsdown`。rootDir 只影响类型检查。 |

BASE worktree 已删除，`git worktree list` 里没有 `/tmp/verify-E3/base`。

## 逐条检查表

### 一、axe 页面扫描

| 编号 | 检查项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | 完整 `pnpm a11y` 浅色加深色，能跑完，生成报告，名单检查通过 | 过 | 输出在 `/tmp/verify-E3/scan1/`（`report.json`、`report.md`），日志 `scan1.log`。末行 `245 页 × 2 种模式，违规 140 条`，`EXIT=0`。`failedScans` 为空。 |
| 2 | 页面清单自动生成，数量对得上 | 过 | `pages.mjs` 的 `readDemoMetas` 读 `apps/docs/components/demos/*/meta.ts`，用正则取 slug，重复或缺失直接抛错。没有手写清单。`demos/` 下 246 项 = 245 个 `meta.ts` + 1 个 `registry.ts`（不是目录），扫描 245 页，数量一致，无差异。 |
| 3 | 范围限定在示例区 | 过 | `scan.mjs` 用 `new AxeBuilder({ page }).include('.astryx-demo')`，`report.json` 的 `include` 字段也是 `.astryx-demo`。随机抽 5 条（固定种子）：app-shell/light/landmark-banner-is-top-level、side-nav-heading/light/landmark-unique、layout-header/light/heading-order、app-shell/light/landmark-no-duplicate-banner、token/light/color-contrast。我另写脚本整页跑 axe（`/tmp/verify-E3/probe.mjs`），用 `closest('.astryx-demo')` 判断每个节点。报告里这 5 条的节点都在示例区内；整页探测额外抓到的 `.VPNav`（导航）、card 浅色 4 个、token 的 1 个、link 的 2 个节点，报告里都没有（card/light 报告 0 个，token 报 11 个对整页 12 个，link 报 1 个对整页 3 个）。 |
| 4 | 浅色深色都扫了，抽一条深色独有的亲自确认 | 过 | `report.json` 的 `pages` 有 490 条，每条带 `scheme`，`byScheme` 为 light 70、dark 70。深色独有的对比度违规：`card color-contrast`（另有 command-palette 系列、context-menu）。我打开 card 深色页，`html.dark=true`，axe 在示例区报 3 个节点，数据 `fgColor #a3a3a3 / bgColor #333a53 / contrastRatio 4.44`，低于 4.5:1。浅色同页示例区 0 个。截图 `/tmp/verify-E3/card-dark.png`：深色主题已生效，卡片副标题灰字落在深灰底上。 |
| 5 | 基线真实 | 过 | 从名单随机抽 3 条：`link color-contrast`、`token color-contrast`、`carousel heading-order`。独立整页探测：link 浅色示例区 1 个节点（`#0074e2` 对 `#f5f5f5`，4.19:1）；token 浅色示例区 11 个节点（`#ffffff` 对 `#e33f4a`，4.13:1）；carousel 深色示例区 1 个 heading-order 节点。三条都真实存在。 |
| 6 | 能抓到新问题 | 过 | 在 `demos/button/overview.vue` 加 `<button type="button" />`，跑 `pnpm a11y --only button`：`light/dark button：1 条违规`，输出 `+ button button-name`，退出码 1。已还原，`git status` 为空。 |
| 7 | 名单提示收紧；`--update` 只删不加 | 过 | A 删掉 `badge color-contrast`：失败，`+ badge color-contrast`，退出码 1。B 加不存在的 `badge aria-fake-rule`：失败，`- badge aria-fake-rule`，提示可以跑 `--update`，退出码 1。C 同样加假条目再 `--update`：输出 `已从名单删掉 1 条`，退出码 0，名单恢复为原样。D 删掉真实条目再 `--update`：不会把它加回，仍然失败，`+ badge color-contrast`，退出码 1。每次都已还原，名单与备份一致，`git status` 为空。 |
| 8 | 两次完整扫描结果一致 | 过 | 第 1 项（scan1）和我另跑的一次（scan2，`EXIT=0`）：按（页、模式、规则、节点数）排序后逐条比较，140 对 140，完全一致；按节点选择器比较，235 对 235，也一致。 |

### 二、交互契约

| 编号 | 检查项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 9 | 框架思路与上游一致 | 过 | 读 `contract.ts`、`checklist.ts`、`harness.ts`、`check.ts`、`expect.ts`。模式写成数据：`definePattern` 接收期望、出处、适用条件、豁免，把关缺出处、缺负责方、级别给错、同一维度既编码又豁免等情况，直接抛错。组件只做绑定：`*.a11y.test.ts` 提供状态和 facts，调 `describeBinding`。结果分层：`ResultStatus` 含 pass、fail、known-failure、unexpected-pass、not-applicable、unrun，环境看不到的层报 unrun，不拿低层冒充。浏览器层留了接口：`Harness` 接口含 `click`、`abortedPress`、`press`、`resetFocus`，`README.md` 末节写了接 Chromium 的办法。比上游多了 `computed-dom` 近似层，并在结果上标注「近似」，没有冒充真实可访问性树。 |
| 10 | 3 个契约条目与上游对照 | 过 | 从 `patterns/<name>.ts` 提取期望 id、证据层、级别，和上游 `v0.7.1:internal/a11y-spec/src/patterns/<name>.ts` 逐项 diff：button 12 条、checkbox 21 条、switch 16 条，id 一致，证据层和 enforcement 也完全一致。计划点名的三项都在：`switch.name.stable-across-change`（advisory，与上游一致）、`switch.state.survives-an-aborted-press`、`switch.state.space-round-trip`。 |
| 11 | 绑定组件与上游一致 | 过 | 上游 Button 状态集绑定 Button、IconButton、ClickableCard、SideNavCollapseButton、ChatSendButton；Checkbox 绑 CheckboxInput、CheckboxListItem、DropdownMenuCheckboxItem、SelectableCard；Switch 绑 Switch。我们 10 个组件全绑上了。未绑的状态只有 4 个（`input-handlerless-read-only`、`list-item-handlerless-read-only`、`menu-item-handlerless-inert`、`list-item-rich-label-visible-name`）加 2 个 `*-as-link` 状态：前者是 React 独有的「没传 onChange」概念，后者在 `button 模式的排除项` 测试里用 role=link 校验过。实现者回报里有说明。 |
| 12 | 契约有效（变异测试） | 过 | M1 去掉 `Switch.vue` 的 `role="switch"`：`Switch.a11y.test.ts` 11 个全部失败，信息是「渲染后找不到角色为 switch 的元素……switch.role.exposed 不成立」。M2 去掉 `CheckboxInput.vue` 的 `:checked` 绑定和 `syncNative` 里的 `input.value.checked = ...`：`Checkbox.a11y.test.ts` 33 个里 6 个失败，信息为 `checkbox.state.exposed ... 暴露出来的未勾选、已勾选或部分勾选，和画面上的一致`。两处都已还原，`git status` 为空。 |
| 13 | 已知失败每条有组件、条目、原因；抽 2 条核实 | 过 | `known-failures.ts` 的 4 条都有 `expectation`、`binding`、`state`、`harness`、`failureEquals`、`userImpact`、`reason`。抽 1：Switch invalid 的 description 失败。`Switch.vue` 里 `status` 只用在第 93 行 `data-status` 和第 105 行 `aria-invalid`；`describedBy()`（第 54-56 行）只拼 `description`、`disabledMessage`、loading，没有状态消息，也没有渲染 `FieldStatus`。原因属实。抽 2：CheckboxListItem 说明没挂上。`CheckboxListItem.vue` 第 19 行在自己的 setup 里 `useItemDescriptionId()`，该值由 `List/Item.vue` 第 88 行 `provide` 提供，而 `CheckboxListItem` 是 `Item` 的父组件（模板里 `<ListItem>`），`inject` 取不到子组件 provide 的值，返回默认的 `null`。原因属实。 |
| 14 | 契约测试快，不开浏览器 | 过 | 4 个文件、411 条，`pnpm vitest run --maxWorkers=2` 总耗时 3 秒，vitest 自报 Duration 2.03 秒。`test-support/a11y` 下 grep `playwright\|chromium\|puppeteer` 只有注释里的 `chromium` 字样。运行期间 headless 进程数没有增加（只有早已存在的 53886/53931，见第 18 项）。 |

### 三、交付与整体

| 编号 | 检查项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 15 | 回报回答了 4 个问题 | 过 | impl-1.md 第二节：1 axe 现状（245 页 × 2，140 条，311 节点，按规则和级别汇总，数字与 scan1 一致）；2 契约过不了的条目（4 条已知失败，与 `known-failures.ts` 一致）；3 其余 21 个模式交给哪个 C 节点（21 行表）；4 台账处理（37 条汇总）。 |
| 16 | `ledger/E3.md` 37 条全打勾且有结论；抽 3 条 | 过 | `grep -c '^- \[x\]'` 为 37，`^- \[ \]` 为 0，「结论」行 37 条。抽查：`d41bbfa92`（框架加 switch）写明落在 `contract.ts`、`checklist.ts` 等具体文件，并说明浏览器层未做，该文件存在；`ba59d5c99`（只改上游 Chromium 通道发布稳定性）判不适用，理由合理，我们确实没有 Chromium 通道；`2710a135a`（CommandPalette）交给 C4，并指出基线里 `command-palette aria-required-attr` 也归 C4，名单里这条值是「C4：dark、light」，对得上。 |
| 17 | 21 个模式与 C 节点对应合理；抽 4 个对 ROADMAP | 过 | 对 ROADMAP 第 413-426 行：tabs→C13（C13 含 TabList，对）；combobox→C3（C3 含 Selector，对）；modal-dialog→C7（C7 含 Dialog，对）；window-splitter→C14（C14 含 Resizable，对）。另看了 radio-group→C2（含 RadioList、SegmentedControl）、tree-view→C12、grid→C5（Calendar）、menu-button→C6，也对。 |
| 18 | 收尾状态 | 过，附注 | `browser-lock.mjs status`：browser-1、browser-2 都空闲，租约 `users/` 为空。5172 无监听。`git worktree list` 没有 `/tmp/verify-E3/base`。headless 进程只剩 pid 53886（和子进程 53931）：父进程是 launchd（ppid 1），启动时间 Oct 18 12:01，早于本次验收，不是我开的，我没有动它。impl-1.md 也提到这个进程。建议总控确认并清理。 |
| 19 | 全量 vitest（两种 NODE_ENV）、`pnpm check`、a11y 不在 check 里 | 过 | 无 NODE_ENV、`NODE_ENV=production`、`NODE_ENV=test` 三种环境都是 232 个文件、3108 条全过（加了 `--maxWorkers=2`）。`check` 各步骤：`check:packages`、`lint`、`typecheck`、`build`、`lint:pkg` 都退出码 0；test 一步用上面的 vitest 替代。`package.json` 里 `check` 脚本不含 `a11y`，`a11y` 是独立脚本。 |
| 20 | catalog、500 行、组件源码未改 | 过 | `@axe-core/playwright` 放在 `catalog:visual`，`dom-accessibility-api` 放在 `catalog:testing`，`package.json` 都用 `catalog:` 引用。`git diff <merge-base> --name-only -- packages/core/src apps/docs` 去掉文件名含 a11y 的之后为空，组件源码零改动（只新增了 3 个 `*.a11y.test.ts`）。新增源码里最长 353 行（`patterns/checkbox.ts`）。注：merge-base 等于 swarm-tree 当前提交 `b92ee2e`。 |

## 不影响结论的观察

1. 第 8 项只比较了两次本机完整扫描，没有对不同机器或不同字体环境做比较。扫描冻结了动画、等字体就绪，两次的节点级结果完全相同。
2. 契约的「快速通道」只覆盖 DOM 与推算出的可访问性树。真实浏览器层（键盘、指针、Tab、可见标签）全部 unrun，这是设计内的、诚实的缺口，实现者已写明，C 节点需要接 Chromium 通道才能验证交互。
3. 名单值里的负责节点（如 `C14：dark、light`）判定只看键不看值，值是人工写的说明。抽查过 `command-palette`、`card`，归属与 ROADMAP 一致。
4. 实现者回报里，残留 headless 进程的说法与我的观察一致。

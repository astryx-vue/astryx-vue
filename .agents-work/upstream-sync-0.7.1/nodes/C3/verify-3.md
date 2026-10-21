# C3 验收报告 · 第 3 轮

结论：通过（21/21）

- 工作区：`/workspace`，分支 `sync/c3-selectors`，被验收的提交 `4e19246c`。
- 比较基点：`BASE = 05d97aff82ee379cf8cf2abd0f04d5325b17cc0d`（`git merge-base HEAD origin/swarm-tree`）。
- 临时文件：`/tmp/verify-C3/`。截图在 `/opt/cursor/artifacts/c3-verify-3/`，没有进 git。
- 只读检查：开始时 `git status` 干净（快进到 `4e19246c` 之后）。写这份报告之前再跑一次，仍是干净的。报告提交并推送后工作区回到干净。两次相同。
- 临时改动：无。没有改业务代码。
- 浏览器：`browser-lock` 的 `browser-1`。文档站 `http://127.0.0.1:5197`，测完已停，端口不再应答。
- 留给 D7、不因此判否：`labelHidden` 仍是别名；`variant="default"` 仍画成 `input`。

## 对照图已按用户反馈重做

上一轮左右不是同一个 Demo，这轮作废，不拿来当证据。这轮只拼 Overview 里标题对得上的 Demo：先把两边的标题都滚到距视口顶 150px，再截。打开态先对齐再点同一颗 Week，点完把两颗触发器都对齐到 220px。上游没有「Selector — Secondary」和「选项操作」这两个示例标题，所以不和 Guidance 硬拼，单独截本地整页，标明无对位 Demo。

| 图 | 来源 | 左边 | 右边 |
| --- | --- | --- | --- |
| `/opt/cursor/artifacts/c3-verify-3/selector-ghost-closed-desktop-light.png` | 文档站整页对照 | 本地 `/components/selector`，1440×900 浅色，侧栏在。Demo「幽灵工具栏」，关闭。Today / Week / Comfortable / Export。 | 上游 `https://astryx.atmeta.com/components/Selector` Overview，同一块「Selector — Ghost Toolbar」，关闭。同一排按钮。 |
| `/opt/cursor/artifacts/c3-verify-3/selector-ghost-open-desktop-light.png` | 文档站整页对照 | 同一页、同一块「幽灵工具栏」，Week 打开。列表 Day / Week / Month，Week 带勾，列表在触发器下面。 | 同一块「Selector — Ghost Toolbar」，Week 打开。列表同样是 Day / Week / Month。上游这张列表在触发器上面展开，选项内容一致。 |
| `/opt/cursor/artifacts/c3-verify-3/selector-ghost-closed-desktop-dark.png` | 文档站整页对照 | 「幽灵工具栏」，1440×900 深色，关闭。 | 「Selector — Ghost Toolbar」，深色，关闭。 |
| `/opt/cursor/artifacts/c3-verify-3/selector-ghost-closed-390-light.png` | 文档站整页对照 | 「幽灵工具栏」，390×844 浅色，关闭。侧栏收进「菜单」。 | 「Selector — Ghost Toolbar」，390 浅色，关闭。顶栏还在。窄屏把 Today / Export 裁掉一截，两边都是这一排。 |
| `/opt/cursor/artifacts/c3-verify-3/multi-form-closed-desktop-light.png` | 文档站整页对照 | 本地 `/components/multi-selector`，「表单组合」，关闭。Visible columns 为 Name, Email；Status filter 为 All statuses；Locked columns 为已选 1 项。 | 上游 MultiSelector Overview，「MultiSelector — Form Composition」，关闭。同样三行：Name, Email / All statuses / 1 selected。 |
| `/opt/cursor/artifacts/c3-verify-3/selector-secondary-local-only-desktop-light.png` | 文档站整页，无对位 Demo | 「次要样式」。Priority 的 Normal 浅灰无边框。侧栏在。 | 上游 Overview 没有这块示例，不拼。 |
| `/opt/cursor/artifacts/c3-verify-3/selector-actions-local-only-desktop-light.png` | 文档站整页，无对位 Demo | 「选项操作」。City 为 Paris，关闭。侧栏在。 | 上游 Overview 没有这块示例，不拼。 |

上面每张都读过图。

## 逐条结果

| # | 检查项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | 三个中文文档页里，secondary 与次要按钮同类，ghost 仍透明 | 过 | 次要样式字段：`data-variant=secondary`，背景 `rgba(0,0,0,0.06)`，边框宽 0，字色 `rgb(23,23,23)`，字重 500。按钮页未禁用的 Secondary 这几项相同，阴影都是 none。幽灵工具栏背景和边框色都是透明，和上游同一排对得上。多选、复合的页面这轮也打开过。 |
| 2 | 点操作不改选择；没有 action 时仍是 listbox | 过 | 选项操作里焦点在 Edit 上按 Escape，值仍是 Paris。没有操作的 Priority 用方向键选成了 High。 |
| 3 | 演练场 settings 的 Search 不占布局，标题一行 | 过 | `/playground/?template=settings`。Search 标签 `data-hidden=true`，绝对定位，1×1。Settings 标题高 40。其余模板这轮没有逐个再开。 |
| 4 | 列表是 option；有 action 是 grid；底部弹层 haspopup 为 dialog | 过 | 英文 Option actions 打开可见网格，文案 Paris Edit Lyon Edit。Edit 不在 option 里。可搜索列表里聚焦的是 option 行。 |
| 5 | 搜索框、选项、Edit 上 Escape 焦点回到触发器；点外面焦点留在外面 | 过 | 见下面专节。搜索框输入 ` zzz` 后空状态是 Nothing like that。键盘把 Priority 选成 High，焦点还在触发器上。 |
| 6 | 禁用 ComplexSelector 指针是 default；操作按钮不在 option 里 | 过 | 截止日期按钮启用时指针 `pointer`，克隆并 `disabled` 后是 `default`。Edit 的可访问名字是 Edit。 |
| 7 | 五个组件不在 SSR 失败名单，冒烟能渲染 | 过 | `ssr-known-failures.json` 是 `{}`。两种 `NODE_ENV` 都是 6 通过、207 跳过。 |
| 8 | 超长选项不撑破触发器；空列表有空状态 | 过 | 值改成重复的「超长选项」后字段宽 320，预览 910，页面 `scrollWidth` 1440。overflow hidden，ellipsis，nowrap。空状态 Nothing like that。 |
| 9 | 图标仍是语义名 | 过 | 选择器家族仍是 `chevronDown`、`close`、`search`。这轮 diff 没有 `Icon/`。 |
| 10 | 没有 !important | 过 | `node scripts/check-no-important.mjs` 退出码 0。 |
| 11 | 台账都有结论 | 过 | `- [x]` 108，已采纳 92，不适用 16，没有未勾。不适用仍是主题兼容面、StyleX、iOS 字号地板、测试基建或上游文档。 |
| 12 | 样式分层和选项操作测试，两种环境用例数相同 | 过 | 与第 17 条同一组，都是 31 个文件、279 条，含 `*.parts.test.ts` 和新建的 `Selector.escapeFocus.test.ts`。 |
| 13 | 中英文示例能操作 | 过 | 中文选择器、多选、复合都点开过。英文 Option actions 打开了 Paris Edit / Lyon Edit。 |
| 14 | 本节点组件不在 SSR 失败名单 | 过 | 与第 7 条同一份 `{}`。 |
| 15 | 文档站整页对照图亲眼看过 | 过 | 上表。主证据是这轮重做的对照图。 |
| 16 | Selector.vue、MultiSelector.vue ≤500 且不在白名单 | 过 | 491 行、469 行。白名单没有这两个文件。`selectorEscape.ts` 51 行。 |
| 17 | 本节点 vitest 两种环境，用例数相同 | 过 | 路径含 Selector、MultiSelector、ComplexSelector、Typeahead、Tokenizer、Token、Field、layer、useDismiss、InputGroup。两种环境都是 31 个文件、279 条，退出码 0。全仓库 vitest 没跑。 |
| 18 | typecheck 和 `pnpm lint` 通过 | 过 | `env -u NODE_ENV pnpm typecheck` 退出码 0。`env -u NODE_ENV pnpm lint` 退出码 0。 |
| 19 | 行数检查通过 | 过 | `node scripts/check-line-limit.mjs` 退出码 0。这轮改过的 vue/ts 没有超过 500 行。 |
| 20 | diff 在计划范围内；导出检查通过 | 过 | 相对 BASE 61 个文件，源码仍在选择器家族和文档。这轮功能提交只动了 Selector、MultiSelector、ComplexSelector 的测试和 Escape 焦点。`sync-exports --check` 退出码 0。 |
| 21 | 新增行不讲修改历史 | 过 | `packages/`、`apps/` 的新增行没有「原来 / 改成 / 之前 / moved / extracted / split from」。 |

## 第 5 条和嵌套、输入组

文档站上亲自做的，焦点用 `document.activeElement` 看：

- Search fruit 的搜索框获焦后按 Escape：列表关掉，`aria-expanded=false`，焦点是这颗 `.astryx-selector-trigger`，文字 Apple。
- 同一列表里把选项（Apple 那一行）聚焦再按 Escape：列表关掉，焦点回到同一颗触发器。
- 「选项操作」里 Edit 按钮获焦再按 Escape：网格关掉，值仍是 Paris，焦点回到 City 的触发器。
- 次要样式的列表打开着，去点幽灵工具栏的 Export：列表关掉，焦点留在 Export（`.astryx-button`），没有被拉回 Priority。
- MultiSelector「可搜索」：搜索框、选项（全选那一行）按 Escape，焦点都回到 `.astryx-multi-selector-trigger`。
- ComplexSelector「截止日期」：弹出层里焦点在单选框上时按 Escape，弹出层关掉，焦点回到 `.astryx-complex-selector`，文字 Today。
- 对话框只关最上层：文档站没有「模态对话框里套选择器」的现成 Demo。`Selector.escapeFocus.test.ts` 把 Selector 放进打开的 Dialog，搜索框上按 Escape。这组测试含在上面的 279 条里并通过：对话框仍开着，焦点回到触发器。点外面时只有焦点还在弹出层里才把焦点送回触发器，和 Export 那次点击一致。

InputGroup：选项说明里选择器带 `is-grouped`，自己的标签 1×1 绝对定位。选成 Public 后再点 Save，值不变。

## 对实现者偏离计划的判断

横排 Typeahead 没传宽度时用 20rem。演练场 Settings 标题这轮仍是 40px、一行。合理。

## 不通过的项要怎么改

无。

## 改进建议（不影响结论）

上游 Ghost Toolbar 的 Week 列表朝上展开，本地朝下。选项都是 Day / Week / Month，这轮不因此判否。台账 `a8ee9d8d0` 的结论仍写成 secondary，和选项操作那条提交对不上，可以改一句。

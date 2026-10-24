# C3 验收报告 · 第 1 轮

结论：不通过（20/21）

- 工作区：`/workspace`，分支 `sync/c3-selectors`，被验收的提交 `8a495945`（功能提交 `1ffa12b4`）。
- 比较基点：`BASE = 71671a9268271e7716914d73c498d6abbef99d30`（`git merge-base HEAD origin/swarm-tree`）。
- 临时文件：`/tmp/verify-C3/`。截图在 `/opt/cursor/artifacts/c3-verify/`，没有进 git。材料是这轮重新生成的。
- 只读检查：开始时 `git status` 是干净的。写这份报告之前再跑一次，仍是干净的。报告提交并推送后工作区回到干净。两次相同。`packages/core/dist/` 是本轮为了把文档站配置里的图标插件解析出来而构建的，目录已被 gitignore。
- 临时改动：无。没有改业务代码。
- 浏览器：`browser-lock` 的 `browser-1`，`node scripts/swarm/browser-lock.mjs run --max-run`。文档站 `http://127.0.0.1:5197`，`env -u NODE_ENV pnpm --filter @astryx-vue/docs dev --port 5197 --host 127.0.0.1`。测完已停掉，5197 不再应答。没有残留的 vitepress 或浏览器进程。
- 留给 D7、本轮不因此判否：`labelHidden` 仍是 `isLabelHidden` 的别名；Selector 的 `variant="default"` 仍画成 `input`，`data-variant` 用的是 `input`。

## 逐条结果

| # | 检查项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | 三个中文文档页整页；secondary 静止态与次要按钮同类，ghost 仍透明 | 过 | 桌面浅色 1440×900：`/components/selector` 滚到「次要样式」，`/components/multi-selector` 滚到「表单组合」，`/components/complex-selector` 滚到「截止日期」。侧栏和顶栏都在。secondary 触发器静止时显示 Normal，`data-variant=secondary`，`border-top-width: 0px`，背景 `rgba(0,0,0,0.06)`，字色 `rgb(23,23,23)`，字重 500，无阴影。同一文档站「按钮 / 变体」里未禁用的 Secondary 按钮这四项完全相同。ghost 工具栏里选择器背景和边框色都是透明，旁边的 Today 幽灵按钮也是透明底。另有桌面深色和 390 浅色，见「看图」。 |
| 2 | 点操作不改选择；键盘执行操作；没有 action 时仍是 listbox | 过 | 文档站「选项操作」。点 Paris 的 Edit：值仍是 Paris，出现 Last edited: Paris，弹出层不关。ArrowDown、ArrowRight、Enter 后值仍是 Paris，文案变成 Last edited: Lyon，`aria-activedescendant` 落在 `...-action-1`。没有操作的 Priority：`aria-haspopup=listbox`，弹出层 `role=listbox`，选项是 option（Low / Normal / High）。键盘把它改成了 High。 |
| 3 | 演练场 settings 的 Search 不占布局，标题一行；其余 is-label-hidden 也不占布局 | 过 | `http://127.0.0.1:5197/playground/?template=settings`。Search 的 `.astryx-field-label-group[data-hidden=true]` 是绝对定位、1×1。Settings 标题盒 40×一行。预览里只看得到占位符 Search settings...。其余能打开的模板里，隐藏标签都是绝对定位且不超过 8px，没有一条占布局。`settings-sidebar` 点开第一行 Edit 后，Legal name 也是 1×1。`shell-nav` 的搜索挂在 `#end`，预览里没有这块隐藏标签，和实现者说的槽名对不上是同一件事，页面上没有露出 Search。 |
| 4 | 列表是 option；有 action 后是 grid / row / 第二个 gridcell；aria-haspopup 网格为 grid，底部弹层为 dialog | 过 | 有操作时触发器 `aria-haspopup=grid`，可见弹出层 `role=grid`，2 行，每行 2 个 `gridcell`，没有 `role=option`。Edit 在第二个 gridcell。没有操作时 `aria-haspopup=listbox`。底部弹层触发器 `aria-haspopup=dialog`；打开后是原生 `<dialog open>`，读屏角色 dialog，`aria-label=Team`。 |
| 5 | 键盘能打开、移动、选中、执行操作、Escape 关闭；搜索框空格仍是输入 | 过 | Priority：ArrowDown 打开，再按方向键和 Enter 选成 High，Escape 关掉。City：方向键走到 Lyon 的操作再按 Enter，选择不变。Search fruit 的搜索框值是 ` zzz`（开头有空格），没有误触操作。 |
| 6 | 禁用 ComplexSelector 指针是 default；操作按钮有自己的名字，不在 option 里 | 过 | 文档站已加载的 `.astryx-complex-selector` 启用时指针是 `pointer`。同一颗按钮设上 `disabled` 后指针是 `default`。组件模板写的是 `:disabled="isDisabled"`。Edit 的可访问名字是 Edit，`closest('[role=option]')` 为空。 |
| 7 | 五个组件不在 SSR 失败名单，冒烟能渲染 | 过 | `ssr-known-failures.json` 是 `{}`。两种 `NODE_ENV` 下 `ssr-smoke.test.ts -t` 这五个加上 BaseTypeahead：都是 6 通过、207 跳过。整份冒烟文件另有 1 条 `DropdownMenuSubMenu` 失败（`HTMLElement is not defined`），diff 里没有这个组件，不记在本节点。 |
| 8 | 超长选项不撑破触发器；空列表有空状态 | 过 | 把「次要样式」的值改成重复的「超长选项」后，触发器从 66px 宽到 862px，仍在预览区 910px 内，页面 `scrollWidth` 保持 1440。值的 `overflow` 是 hidden，`text-overflow` 是 ellipsis，`white-space` 是 nowrap。搜索框输入 ` zzz` 后空状态是 Nothing like that，没有报错。 |
| 9 | 图标仍是语义名 | 过 | Selector、MultiSelector、ComplexSelector 里是 `chevronDown`、`close`、`search`。`git diff BASE` 没有动 `Icon/`，没有另一套注册表。 |
| 10 | 没有 !important | 过 | `node scripts/check-no-important.mjs` 退出码 0，无输出。 |
| 11 | 台账 108 条都有结论；抽查采纳和不适用 | 过 | `- [x]` 108，`- [ ]` 0，已采纳 92，不适用 16。抽查已采纳：`5777977fe` 的外壳/本体落点有 `Selector.parts.test.ts` 并且在 238 条里通过；`f2beffa10` 的 secondary 静止色和次要按钮实测一致；`18d2bcb24` 的操作网格在文档站点过。16 条不适用分别是主题兼容面或 StyleX、iOS 16px 字号地板、测试基建、上游文档或知识库，和条目上的提交说明对得上。选择器样式里没有 16px 字号地板。 |
| 12 | 样式分层和选项操作的 Vue 测试，两种 NODE_ENV 用例数相同 | 过 | 与第 17 条同一组，两种环境都是 26 个文件、238 条。其中包含 `*.parts.test.ts` 的分层和「点操作不改选择」。 |
| 13 | 中英文文档示例能操作 | 过 | 中文三个页面都点开过。英文 `/en/components/selector` 的 Option actions 打开可见 grid（Paris Edit / Lyon Edit）；multi-selector 的 Form Composition 打开 listbox；complex-selector 的 Deadline picker 打开 dialog。中文多选「可搜索」、复合「截止日期」同样能打开。 |
| 14 | 本节点组件不在 SSR 失败名单 | 过 | 与第 7 条同一份 `{}`。Selector、MultiSelector、ComplexSelector、Typeahead、Tokenizer 都不在里面。 |
| 15 | 文档站整页图亲眼看过，并标明来源 | 过 | 下面每张都读过图。主证据是文档站整页。按钮变体页只用来对照次要按钮。演练场单独标明。 |
| 16 | Selector.vue、MultiSelector.vue 不超过 500 行，且不在白名单 | 过 | `Selector.vue` 473 行，`MultiSelector.vue` 451 行。`scripts/guardrails/line-limit-allowlist.json` 里没有这两个文件。 |
| 17 | 本节点 vitest 两种环境，用例数相同 | 过 | 路径：Selector、MultiSelector、ComplexSelector、Typeahead、Tokenizer、Token、Field、layer。`env -u NODE_ENV` 与 `NODE_ENV=production` 都是 26 个文件、238 条，退出码 0。日志 `/tmp/verify-C3/vitest-unset-core.txt`、`vitest-prod.txt`。全仓库 vitest 没跑。 |
| 18 | typecheck 通过；改过的源码 eslint 通过 | 不过 | `env -u NODE_ENV pnpm typecheck` 退出码 0。`packages/core` 里改过的选择器目录 eslint `--max-warnings 0` 退出码 0。文档示例没过：`apps/docs/components/demos/selector/index.ts` 第 8 行 `perfectionist/sort-imports`，`./actions.vue` 排在 `./ghost.vue` 后面。`actions.vue` 第 28 行两处 `vue/singleline-html-element-content-newline`。一共 1 个 error、2 个 warning，退出码 1。 |
| 19 | 行数检查通过 | 过 | `node scripts/check-line-limit.mjs` 退出码 0，打印「源码单文件行数检查通过（上限 500 行）」。它另外提示 PowerSearch、TableData 可以收紧白名单，那是原有文件。`selector.css` 505 行，检查范围不含 css。 |
| 20 | diff 在计划范围内；导出检查通过 | 过 | `git diff BASE --stat` 55 个文件，没有 `ROADMAP.md`、别的节点的 verify、PowerSearch、日期选择器。多出来的 `useAsyncSource.ts` 只是给可搜索项加上 `action`。`typeahead.css` 的横排 20rem 写在实现回报里，见下面的判断。`node scripts/sync-exports.mjs --check` 打印「生成结果和已提交文件一致」，退出码 0。 |
| 21 | 新增行不讲修改历史 | 过 | 全 diff 只有 `verify.md` 里这条检查自己的句子命中。`packages/`、`apps/` 里没有命中。 |

## 看图

前几张是文档站整页，中文地址没有 `/zh/`。都是亲眼看过的。

| 图 | 来源 | 看到的内容 |
| --- | --- | --- |
| `/opt/cursor/artifacts/c3-verify/selector-desktop-light.png` | 文档站整页 | `http://127.0.0.1:5197/components/selector`，1440×900，浅色。顶栏有文档 / 组件 / 演练场 / 主题，左侧是组件侧栏。滚到「次要样式」：Priority 下面是浅灰无边框的 Normal。再往下能看见「选项操作」的 Paris。 |
| `/opt/cursor/artifacts/c3-verify/selector-ghost-desktop-light.png` | 文档站整页 | 同一页，浅色，滚到「幽灵工具栏」。Today、Week、Comfortable、Export 都没有框，底是透明的。次要样式的 Normal 仍在下面。 |
| `/opt/cursor/artifacts/c3-verify/multi-selector-desktop-light.png` | 文档站整页 | `http://127.0.0.1:5197/components/multi-selector`，1440×900，浅色。侧栏和顶栏都在。滚到「表单组合」：Visible columns 显示 Name, Email，Status filter 显示 All statuses，Locked columns 显示已选 1 项。 |
| `/opt/cursor/artifacts/c3-verify/complex-selector-desktop-light.png` | 文档站整页 | `http://127.0.0.1:5197/components/complex-selector`，1440×900，浅色。侧栏和顶栏都在。滚到「截止日期」：带边框的 Today。下面还能看见「树搜索」。 |
| `/opt/cursor/artifacts/c3-verify/selector-secondary-desktop-dark.png` | 文档站整页 | 同一选择器页，深色。`html` 带 `dark`，页面底是深色。次要样式的 Normal 仍无边框，填充是 `rgba(255,255,255,0.1)`，字是浅色。 |
| `/opt/cursor/artifacts/c3-verify/selector-secondary-390-light.png` | 文档站整页 | 390×844，浅色。侧栏收起。顶上是「菜单」和「返回顶部」。次要样式的 Normal 在卡片里，页面 `scrollWidth` 仍是 390。 |
| `/opt/cursor/artifacts/c3-verify/selector-actions-open-desktop-light.png` | 文档站整页 | 同一选择器页，浅色，滚到「选项操作」并打开。City 仍是 Paris，行上有勾。Lyon 旁边的 Edit 带着键盘焦点框。 |
| `/opt/cursor/artifacts/c3-verify/button-variants-desktop-light.png` | 文档站整页 | `http://127.0.0.1:5197/components/button`，浅色，滚到「变体」。用来对照：Secondary 和选择器的 Normal 是同一类浅灰无边框。不是选择器页，不代替上面三张。 |
| `/opt/cursor/artifacts/c3-verify/playground-settings-desktop-light.png` | 文档站演练场 | `http://127.0.0.1:5197/playground/?template=settings`。右侧预览里 Settings 是一行，搜索框只有占位符，没有 Search 标签。 |

## 对实现者偏离计划的判断

- 横排 Typeahead 在没传 `width` 时用 20rem，避免标题被挤成两行。演练场 Settings 标题实测 40px、一行。合理。
- `shell-nav` 的搜索写在 `#end`，预览里没有挂上这块隐藏标签。实现者没改 AppShell。页面上没有因此露出标签。合理。

## 不通过的项要怎么改

第 18 条。`pnpm exec eslint --max-warnings 0 apps/docs/components/demos/selector` 退出码 1。

- `apps/docs/components/demos/selector/index.ts`：把 `./actions.vue` 和它的 `?raw` 导入按字母序放到 `./ghost.vue` 前面。
- `apps/docs/components/demos/selector/actions.vue` 第 28 行：`<p>` 的文字「Last edited」按项目的单行元素换行规则拆开。

改完用同一条 eslint 再跑，退出码应为 0。选择器的观感和操作这轮没有因此判否。

## 改进建议（不影响结论）

台账 `a8ee9d8d0`（AST-058 选项操作）的结论写成了「secondary 对齐次要按钮」。选项操作本身已经做了，这句话和这条提交对不上，可以改成网格和「点操作不改选择」。

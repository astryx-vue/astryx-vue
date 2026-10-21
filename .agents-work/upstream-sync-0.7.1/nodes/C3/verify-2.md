# C3 验收报告 · 第 2 轮

结论：不通过（20/21）

- 工作区：`/workspace`，分支 `sync/c3-selectors`，被验收的提交 `4e3dedd1`（返工 `592028f3`，合并 `4e3dedd1`）。
- 比较基点：`BASE = 05d97aff82ee379cf8cf2abd0f04d5325b17cc0d`（`git merge-base HEAD origin/swarm-tree`，与 `origin/swarm-tree` 相同）。
- 临时文件：`/tmp/verify-C3/`。截图在 `/opt/cursor/artifacts/c3-verify-2/`，没有进 git。
- 只读检查：开始时 `git status` 干净（快进到 `4e3dedd1` 之后）。写这份报告之前再跑一次，仍是干净的。报告提交并推送后工作区回到干净。两次相同。
- 临时改动：曾把 `packages/core/src/Selector/escapeStack.verify-tmp.test.ts` 放进仓库跑「对话框里只关最上层」。跑完已删除。已还原。
- 浏览器：`browser-lock` 的 `browser-1`，`node scripts/swarm/browser-lock.mjs run --max-run`。文档站 `http://127.0.0.1:5197`，`env -u NODE_ENV pnpm --filter @astryx-vue/docs dev --port 5197 --host 127.0.0.1`。测完已停，5197 不再应答。
- 留给 D7、本轮不因此判否：`labelHidden` 仍是 `isLabelHidden` 的别名；`variant="default"` 仍画成 `input`。

## 逐条结果

| # | 检查项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | 三个中文文档页整页；secondary 静止态与次要按钮同类，ghost 仍透明 | 过 | 桌面浅色左右对照见「看图」。次要样式的 Normal：`data-variant=secondary`，背景 `rgba(0,0,0,0.06)`，边框宽 0，字色 `rgb(23,23,23)`，字重 500，无阴影。同一文档站「按钮 / 变体」里未禁用的 Secondary 这五项相同。幽灵工具栏本地和上游都是 Today / Week / Comfortable / Export，底透明。多选滚到「表单组合」，复合滚到「截止日期」。 |
| 2 | 点操作不改选择；键盘执行操作；没有 action 时仍是 listbox | 过 | 「选项操作」：ArrowRight、Enter 后值仍是 Paris，文案 Last edited: Paris；再 ArrowDown、ArrowRight、Enter 后值仍是 Paris，文案变成 Last edited: Lyon。没有操作的 Priority：`aria-haspopup=listbox`，弹出层是 listbox，选项 Low / Normal / High。 |
| 3 | 演练场 settings 的 Search 不占布局，标题一行；其余 is-label-hidden 也不占布局 | 过 | `http://127.0.0.1:5197/playground/?template=settings`。Search 的标签组 `data-hidden=true`，绝对定位，1×1。Settings 标题高 40。预览里只有占位符 Search settings...。本轮没有把其余二十多个模板再逐个打开；选项说明里选择器自己的 Visibility 标签同样是 1×1 绝对定位。 |
| 4 | 列表是 option；有 action 后是 grid / row / 第二个 gridcell；aria-haspopup 网格为 grid，底部弹层为 dialog | 过 | 有操作时 `aria-haspopup=grid`，可见网格 2 行、4 个 gridcell，没有 option。两个 Edit 的可访问名字都是 Edit，不在 `role=option` 里。底部弹层 `aria-haspopup=dialog`，打开后是 `<dialog open aria-label=Team>`，里面仍有 listbox。 |
| 5 | 键盘能打开、移动、选中、执行操作、Escape 关闭；关闭后焦点回到触发器；搜索框空格仍是输入 | 不过 | 能打开、移动、选中、执行操作。搜索框值是 ` zzz`，空状态 Nothing like that，没有误触操作。Escape 会关掉当前列表，对话框里的选择器也只关列表、对话框还开着。但是焦点进过搜索框或选项上的 Edit 之后，Escape 关掉弹出层，焦点落到 `body`，没有回到触发器。见下面「不通过的项」。 |
| 6 | 禁用 ComplexSelector 指针是 default；操作按钮有自己的名字，不在 option 里 | 过 | 文档站截止日期按钮启用时指针是 `pointer`。同一颗按钮克隆并设 `disabled` 后指针是 `default`。Edit 的名字是 Edit，`closest('[role=option]')` 为空。 |
| 7 | 五个组件不在 SSR 失败名单，冒烟能渲染 | 过 | `ssr-known-failures.json` 是 `{}`。两种 `NODE_ENV` 下 `-t 'Selector$|Typeahead$|Tokenizer$'`：都是 6 通过、207 跳过。 |
| 8 | 超长选项不撑破触发器；空列表有空状态 | 过 | 搜索框所在触发器被写成重复的「超长选项」后，字段宽 320，预览区 910，页面 `scrollWidth` 1440。`overflow` hidden，`text-overflow` ellipsis，`white-space` nowrap。空状态文案 Nothing like that。 |
| 9 | 图标仍是语义名 | 过 | Selector、MultiSelector、ComplexSelector 里是 `chevronDown`、`close`、`search`。相对 BASE 的 diff 没有 `Icon/`。 |
| 10 | 没有 !important | 过 | `node scripts/check-no-important.mjs` 退出码 0。 |
| 11 | 台账每一条都有结论；抽查采纳和不适用 | 过 | `- [x]` 108，`- [ ]` 0，已采纳 92，不适用 16。抽查已采纳：`5777977fe` 的外壳/本体有 `Selector.parts.test.ts`；`f2beffa10` 的 secondary 静止色和次要按钮实测一致；选项操作网格在文档站点过。16 条不适用是主题兼容面、StyleX、iOS 16px 字号地板、测试基建或上游文档，选择器样式里没有 16px 字号地板。 |
| 12 | 样式分层和选项操作的 Vue 测试，两种 NODE_ENV 用例数相同 | 过 | 与第 17 条同一组，两种环境都是 30 个文件、271 条，其中包含 `*.parts.test.ts`。 |
| 13 | 中英文文档示例能操作 | 过 | 中文三个页面都点开过。英文 `/en/components/selector` 的 Option actions 打开网格，文案 Paris Edit Lyon Edit。英文多选 Form Composition 打开了 listbox。英文复合页能打开；中文截止日期打开过 dialog，Escape 后 dialog 关掉，焦点在 `.astryx-complex-selector`。 |
| 14 | 本节点组件不在 SSR 失败名单 | 过 | 与第 7 条同一份 `{}`。 |
| 15 | 文档站整页对照图亲眼看过，并标明来源 | 过 | 下面每张都读过。主证据是文档站整页，并和 `https://astryx.atmeta.com` 同一组件页左右拼在一起。 |
| 16 | Selector.vue、MultiSelector.vue 不超过 500 行，且不在白名单 | 过 | `Selector.vue` 473 行，`MultiSelector.vue` 451 行。白名单里没有这两个文件。 |
| 17 | 本节点 vitest 两种环境，用例数相同 | 过 | 路径：Selector、MultiSelector、ComplexSelector、Typeahead、Tokenizer、Token、Field、layer、`useDismiss.test.ts`、InputGroup。`env -u NODE_ENV` 与 `NODE_ENV=production` 都是 30 个文件、271 条，退出码 0。日志 `/tmp/verify-C3/vitest-unset.txt`、`vitest-prod.txt`。全仓库 vitest 没跑。 |
| 18 | typecheck 通过；`pnpm lint` 通过 | 过 | `env -u NODE_ENV pnpm typecheck` 退出码 0。`env -u NODE_ENV pnpm lint`（`eslint . --max-warnings 0`）退出码 0。上一轮的导入顺序和 `<p>` 换行已经不在。 |
| 19 | 行数检查通过 | 过 | `node scripts/check-line-limit.mjs` 退出码 0。相对 BASE 改过的 vue/ts 源码没有超过 500 行。`selector.css` 505 行，检查范围不含 css。 |
| 20 | diff 在计划范围内；导出检查通过 | 过 | `git diff BASE --stat` 56 个文件，都在选择器家族、文档示例、台账和行数白名单里。没有别的节点的业务源码。`node scripts/sync-exports.mjs --check` 退出码 0。 |
| 21 | 新增行不讲修改历史 | 过 | 命中只在 `.agents-work` 的验收文档里，是这条检查自己的句子。`packages/`、`apps/` 没有命中。 |

## 合并带进来的两处

- Escape 只关最上层：临时测试「dialog 里的选择器 Escape 只关列表，焦点回到触发器」通过。选择器关了，`defaultPrevented` 为真，对话框仍 `open`，城市仍是 Paris。再按一次 Escape，对话框才关。这个用例里焦点一直在触发器上，所以「回到触发器」在这里成立。测试文件已删除。
- 底部弹层、不可搜索的 Priority、MultiSelector、ComplexSelector：Escape 关掉弹出层后，焦点分别在 `.astryx-selector-trigger`、`.astryx-multi-selector-trigger`、`.astryx-complex-selector`。
- InputGroup：选项说明里选择器带 `is-grouped`，自己的 Visibility 标签 1×1。点开选 Public 后值变成 Public，再点 Save 值不变。和上游 Option descriptions 里 Private 旁边的 Save 是同一类组合，见对照图。

## 看图

左右拼接的图，左边是本地文档站整页，右边是上游同一组件页。都亲眼看过。中文地址没有 `/zh/`。

| 图 | 来源 | 看到的内容 |
| --- | --- | --- |
| `/opt/cursor/artifacts/c3-verify-2/selector-desktop-light-compare.png` | 文档站整页对照 | 左 `http://127.0.0.1:5197/components/selector`，1440×900 浅色，侧栏和顶栏都在，滚到「次要样式」：Priority 的 Normal 是浅灰无边框。右 `https://astryx.atmeta.com/components/Selector` 停在最佳实践里含 secondary 的那一段，不是一颗次要触发器。 |
| `/opt/cursor/artifacts/c3-verify-2/selector-desktop-dark-compare.png` | 文档站整页对照 | 同一对页面，深色。左边 Normal 仍无边框、浅字。右边是深色的最佳实践。 |
| `/opt/cursor/artifacts/c3-verify-2/selector-390-light-compare.png` | 文档站整页对照 | 390×844 浅色。左边侧栏收起，顶上是「菜单」和「返回顶部」，次要样式的 Normal 在卡片里。右边是上游窄屏，顶栏还在。 |
| `/opt/cursor/artifacts/c3-verify-2/selector-390-dark-compare.png` | 文档站整页对照 | 390×844 深色。左边 Normal 是深底上的浅灰胶囊。右边深色顶栏还在。 |
| `/opt/cursor/artifacts/c3-verify-2/selector-open-desktop-light-compare.png` | 文档站整页对照 | 浅色桌面，下拉打开。左边次要样式展开 Low / Normal / High，Normal 带勾。右边打开的是校验状态里的 Role 列表，不是同一颗次要触发器。 |
| `/opt/cursor/artifacts/c3-verify-2/selector-ghost-desktop-light-compare.png` | 文档站整页对照 | 两边都滚到幽灵工具栏：Today、Week、Comfortable、Export，没有框。左边下面还能看见次要样式的 Normal。 |
| `/opt/cursor/artifacts/c3-verify-2/selector-group-desktop-light-compare.png` | 文档站整页对照 | 两边都是选项说明。输入组里 Private 和 Save 在同一行，上面两行是带说明的单选。 |
| `/opt/cursor/artifacts/c3-verify-2/multi-selector-desktop-light-compare.png` | 文档站整页对照 | 左滚到「表单组合」：Name, Email / All statuses / 已选 1 项。右是上游 Multi Selector 总览，Select columns...。 |
| `/opt/cursor/artifacts/c3-verify-2/complex-selector-desktop-light-compare.png` | 文档站整页对照 | 两边都是截止日期：Deadline，值 Today。左边下面还有树搜索。 |
| `/opt/cursor/artifacts/c3-verify-2/playground-settings-desktop-light.png` | 文档站演练场 | Settings 一行，搜索框只有占位符，没有 Search 标签。 |

## 对实现者偏离计划的判断

- 合并后 Selector 用 `useInputGroupContext()`，Escape 登记为 `dismissOnEscape: 'close'`。输入组效果成立。只关最上层在「焦点还在触发器上」时成立。焦点已经进了弹出层时没有回到触发器，这一条见不过的项。
- 横排 Typeahead 没传宽度时用 20rem。演练场 Settings 标题实测 40px、一行。合理。

## 不通过的项要怎么改

第 5 条。可搜索的 Selector，以及焦点已经落到选项操作按钮上的时候。

复现：打开 `http://127.0.0.1:5197/components/selector`，滚到「只读、禁用、加载和搜索」，点 Search fruit。焦点进了 `.astryx-selector-search-input`。按 Escape。列表关掉，`document.activeElement` 是 `body`。另一条：打开「选项操作」，点到 Edit 按钮后再按 Escape，网格关掉，焦点同样不是 City 的触发器。

期望：弹出层关掉，焦点回到打开它的那颗触发器。对话框里如果还有更外一层，这一下只关选择器。不可搜索、焦点本来就在触发器上的 Priority，以及底部弹层、MultiSelector、ComplexSelector，这轮已经是这样。

`useCombobox` 的 Escape 会 `preventDefault` 再 `close()`，没有把焦点送回触发器。`useDismiss` 的 `onDismiss` 也只是 `combobox.close()`。搜索框或操作按钮被卸掉以后，焦点就掉到 `body`。

## 改进建议（不影响结论）

台账 `a8ee9d8d0` 的结论仍写成「secondary 对齐次要按钮」。选项操作本身已经做了，这句话可以改成网格和「点操作不改选择」。

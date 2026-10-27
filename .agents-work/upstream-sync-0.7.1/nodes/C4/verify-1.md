# C4 验收报告 · 第 1 轮

结论：通过（23/23）

- 工作区：`/workspace`，分支 `sync/c4-power-search`，被验收的提交 `f5d23dc9`。
- 比较基点：`BASE = dd1967e79bf25c3a139b928bf2bf72bd0798b61b`（`git merge-base HEAD origin/swarm-tree`）。
- 临时文件：`/tmp/verify-C4/`。截图在 `/opt/cursor/artifacts/c4-verify-1/`，没有进 git。脚本和日志都是这轮自己跑的。
- 只读检查：开始时 `git status` 干净。写这份报告之前再跑一次，仍是干净的。报告提交并推送后工作区回到干净。两次相同。
- 临时改动：曾加过 `packages/core/src/CommandPalette/aria-disabled.verify.test.ts`，只用来挂载禁用项看 `aria-disabled`。跑完已删除。删除后 `git status` 干净，已还原。
- 浏览器：`browser-lock` 的 `browser-1`，用途 `C4-verify`。文档站 `http://127.0.0.1:4184`，测完已停，端口不再应答，没有残留浏览器进程。

## 逐条结果

| # | 检查项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | 文档站整页四种组合 | 过 | 本地中文页四种图都看过。桌面 1440 侧栏宽 260，390 顶栏「菜单」高 47。滚到「字段和运算符」和「异步搜索」。结构化搜索的示例标题和上游对不上，无对位。命令面板「异步搜索」对得上上游「CommandPalette — Async Search」。 |
| 2 | 空运算符选中即保存，再点只提交一次 | 过 | 文档站「字段和运算符」：聚焦列出 Name / Role / Active / Age。点 Active 后条件是「Active: 为真」，编辑器不在，焦点回到输入框，`change` 为 `add`，名单剩 Alice、Carol、Diego。再点这条，编辑器仍不出现，`change` 再来一次且是 `edit`。文档站字符串字段没有空运算符。手写配置里把运算符改成 `is_empty`，两种 `NODE_ENV` 的 `PowerSearchEditor.test.ts` 都是只保存一次，再选同一个不再保存。 |
| 3 | 取消上按 Enter 不增加；非法数字不保存 | 过 | 打开 Name 编辑器，焦点在「取消」上按 Enter：条件仍是空，四人都在，编辑器关掉，焦点回到搜索框。打开 Age，输入 `12abc`（`aria-invalid=true`），按 Enter：条件仍空，编辑器还在，文案含「数字无效」，应用按钮是灰的。图 `ps-bad-number.png`。 |
| 4 | 外壳 / 外框 / input 的 class 和 id | 过 | 文档站现场：外壳 `.astryx-field` 边框 0，外框 `.astryx-power-search-control` 边框 1px，input 边框 0，且没有外框的 class。input 的 id 是 `astryx-power-search-v-321`，标签「搜索」的 `for` 相同。`containerClass` / `controlClass` 文档示例没传。两种环境下 `puts container and control classes on their own boxes` 通过：`box-a` 在外壳，`ctl-a` 和根 class 在外框，都不在 input 上。 |
| 5 | 禁用指针、悬停不滚、方向键才滚、Home/End、Page Down | 过 | 「分组」：ArrowDown 高亮 Home；鼠标移到 Settings，高亮过去，`scrollIntoView` 0 次；再按 ArrowDown，滚的是 New File。Home、End 后高亮仍是 New File。PageDown 到 Save，PageUp 到 Home。禁用样式：带 `data-disabled` 的项悬停，指针 `default`，背景 `rgba(0,0,0,0)`，透明度 0.5，没有高亮。启用项指针是 `pointer`。 |
| 6 | 单独输入框是 searchbox；单独列表保留 id；面板里有结果才是 listbox | 过 | 「异步搜索」没打字时：输入框 `role=combobox`，名字是「搜索命令」，占位是 `Search files...`，没有 `aria-expanded` / `aria-controls`，列表没有 `role`。输入 `read` 后：`aria-expanded=true`，`aria-controls` 等于列表 id，列表是 `listbox`，README.md 是 `option`。单独使用的 searchbox 和调用方 id，两种环境下 `names a standalone input from its label and keeps a standalone list id` 通过。 |
| 7 | option、aria-disabled、combobox、页脚跟语言 | 过 | 面板里搜索框是 combobox。有结果的行是 `option`。临时挂载禁用项（已删）：`role=option`，`aria-disabled=true`，`data-disabled=true`，1 通过。页脚是「↑ ↓ 移动 ↵ 选择 Esc 关闭」，不是 Navigate / Select / Close。 |
| 8 | 只用键盘增删条件，并用方向键和 Enter 选中命令 | 过 | 搜索框打 `Name` 再 Enter，编辑器是「字段 Name 运算符 包含」。值打 `Ali` 再 Enter，条件「Name: 包含 Ali」，只剩 Alice，编辑器关掉。ArrowLeft 焦点到条件，Backspace 删掉，四人回来。选择模式：ArrowDown 两次高亮 Dark，Enter 后打勾，并发出 `valueChange=dark`、`openChange=false`。示例把 `is-open` 写死，所以面板还在页面上。绑定了开关的测试里，Enter 之后 `isOpen` 变成 false。 |
| 9 | 文档站能构建；两个组件不在 SSR 失败名单 | 过 | `env -u NODE_ENV pnpm docs:build` 退出码 0，`build complete in 69.19s`，`rendering pages` 成功。`ssr-known-failures.json` 是空对象，没有 PowerSearch、CommandPalette。 |
| 10 | emoji 截断完整；没有匹配字段时有空状态 | 过 | 40 个家庭 emoji 存成 Name 包含。标签值 34 个字素，末尾是 `…`，前面每个都是完整的家庭 emoji，没有替换字符。图 `ps-emoji.png`。`format.test.ts` 同样断言省略号算进上限。「放不下的标签」输入 `zzzz`：可见菜单 280×52，文案「没有结果」，0 个选项。页面 `scrollWidth` 与 `clientWidth` 都是 1440。图 `ps-no-match.png`。 |
| 11 | 自带空运算符编辑器仍会打开 | 过 | 文档站没有这个示例。两种环境下 `opens a consumer empty editor instead of committing` 通过：点空条件后 `change` 为空，页面上出现自定义编辑器。 |
| 12 | 搜索和清除用语义名 | 过 | 命令面板搜索图标 class 含 `astryx-icon--search`。清条件按钮的字形 class 是 `astryx-icon__glyph astryx-icon--close`。源码是 `icon="search"`、`icon="close"`。 |
| 13 | 没有 !important | 过 | `node scripts/check-no-important.mjs` 退出码 0。 |
| 14 | 台账每条有结论，抽查站得住 | 过 | `- [x]` 46，未勾 0。已采纳 37，不适用 9，没有缺结论。抽查已采纳：样式分层（现场边框在外框）、空运算符只存一次（浏览器和测试）、禁用指针 `default`（算出的指针）。不适用 9 条都站得住：后一条改回 default、React ref、上游 spec、文档种子 props、StyleX、Typeahead 归 C3 的两条、vitest 分项目、模块合同。 |
| 15 | 新增行为有 Vue 测试，两种环境用例数相同 | 过 | 与第 20 条同一组：6 个文件、77 条，两次都通过。覆盖了空运算符只存一次、点空条件只提交一次、非法数字 Enter 不保存、Home 不移动高亮、禁用指针、单独列表保留 id。 |
| 16 | 中英文写了这些行为，中文示例能操作 | 过 | 中英文使用说明写了空运算符的保存和再点只提交。属性页写了 `containerClass` 在外壳、`controlClass` 在外框。中英文命令面板写了 Home / End 留在输入框，Page Up / Page Down 跳到可用项两端。中文两个页面的示例都点开过。 |
| 17 | 本节点组件不在 SSR 失败名单 | 过 | 与第 9 条同一份空对象。 |
| 18 | 四种整页图亲眼看过 | 过 | 下表。主证据是文档站整页。 |
| 19 | PowerSearch.vue 不超过 500 行且不在白名单 | 过 | `wc -l` 为 493。白名单没有这个文件。`node scripts/check-line-limit.mjs` 通过。 |
| 20 | 指定 vitest 两种环境通过且用例数相同 | 过 | `env -u NODE_ENV` 与 `NODE_ENV=production` 都是 `Test Files 6 passed`、`Tests 77 passed`，退出码 0。命令带 `--maxWorkers=2`，路径与计划一致。 |
| 21 | typecheck、eslint、行数、!important、导出 | 过 | core typecheck 退出码 0。改过的 Vue、TS、文档 eslint `--max-warnings 0` 退出码 0。样式文件不在 eslint 配置里，没有算进这次。行数、`!important`、`sync-exports.mjs --check` 都是退出码 0。 |
| 22 | diff 没有计划以外的文件 | 过 | 相对 BASE 30 个文件：台账、本节点计划/验收/回报、中英文两个组件的说明和属性、PowerSearch、CommandPalette、两份样式、行数白名单。都在计划范围内。没有 ROADMAP、SWARM、HANDOFF。 |
| 23 | 新增行不讲修改历史 | 过 | 命中 2 行，都在 `verify.md`：一句是验收步骤里的「改成空运算符」，一句是这条检查自己的命令。不是源码注释里的修改历史。 |

## 看图

每张都读过。本地四种是文档站整页。上游在线文档页头写的是 `@astryxdesign/core v0.7.2`，不是本轮锁定的 v0.7.1，只作对照，不单独当验收基线。

结构化搜索：上游示例是 Content Search、Full Featured、Preset Filters、Search with Table。本地是「字段和运算符」「放不下的标签」「组合条件」「暂停搜索」。标题对不上，无对位，没有硬拼。

命令面板：「异步搜索」对得上「CommandPalette — Async Search」。两边都是没输入时的空状态，占位 `Search files...`，中间一行提示输入文件名，底下是快捷键。英文站写 Navigate / Select / Close，中文站写 移动 / 选择 / 关闭。浅色、深色都看过。390 宽时上游预览被裁掉一截，本地整张面板还在卡片里。

| 图 | 来源 | 看到的内容 |
| --- | --- | --- |
| `/opt/cursor/artifacts/c4-verify-1/ps-desktop-dark.png` | 文档站整页，无对位 | `http://127.0.0.1:4184/components/power-search`，1440×900 深色。侧栏在。滚到「字段和运算符」，搜索框和 Alice、Bob、Carol、Diego。 |
| `ps-desktop-light.png` | 文档站整页，无对位 | 同一页、同一块，1440×900 浅色。侧栏在。 |
| `ps-390-dark.png` | 文档站整页，无对位 | 390×844 深色。顶栏「菜单」。同一块 Demo。 |
| `ps-390-light.png` | 文档站整页，无对位 | 390×844 浅色。顶栏「菜单」。 |
| `cp-desktop-dark.png` | 文档站整页 | `http://127.0.0.1:4184/components/command-palette`，1440×900 深色。侧栏在，当前项是命令面板。「异步搜索」空状态，页脚「移动 / 选择 / 关闭」。下面露出「分组」。 |
| `cp-desktop-light.png` | 文档站整页 | 同一页、同一块，浅色。 |
| `cp-390-dark.png` | 文档站整页 | 390×844 深色。顶栏「菜单」。「异步搜索」整张面板都在。 |
| `cp-390-light.png` | 文档站整页 | 390×844 浅色。顶栏「菜单」。 |
| `up-cp-async-desktop-light.png` | 文档站整页对照 | 上游 `https://astryx.atmeta.com/components/CommandPalette`，1440×900 浅色，侧栏在。示例「CommandPalette — Async Search」，关闭着的空状态。页脚 Navigate / Select / Close。 |
| `up-cp-async-desktop-dark.png` | 文档站整页对照 | 同一块 Async Search，深色。 |
| `up-cp-async-390-light.png` | 文档站整页对照 | 390 浅色。顶栏是英文站的菜单图标。Async Search 被裁掉左边一截。 |
| `ps-bool-token.png` | 文档站整页 | 选中 Active 之后。条件「Active: 为真」，没有编辑器，名单没有 Bob。 |
| `ps-empty-click.png` | 文档站整页 | 再点这条空条件之后。编辑器仍不出现，名单仍是 Alice、Carol、Diego。 |
| `ps-bad-number.png` | 文档站整页 | Age 等于 `12abc`，编辑器还在，应用是灰的，上面仍是 4 个结果。 |
| `ps-emoji.png` | 文档站整页 | Name 包含一长串家庭 emoji，末尾省略号，没有半个 emoji。 |
| `ps-no-match.png` | 文档站整页 | 「放不下的标签」输入 `zzzz`，菜单写「没有结果」，页面没有被撑出横向滚动。 |
| `cp-picked.png` | 文档站整页 | 选择模式里 Dark 带勾。面板仍开着，因为示例没有接 `open-change`。 |

## 对实现者偏离计划的判断

计划只写抽一个动作 composable。`PowerSearch.vue` 若把分组标题留在里面会超过 500 行，所以又拆了 `menuPresentation.ts`。行为没有变。合理。

禁用指针的测试读样式表，不靠 happy-dom 的 `getComputedStyle`。浏览器里算出的指针确实是 `default`。合理。

## 不通过的项要怎么改

无。

## 改进建议（不影响结论）

文档站用 `createPowerSearchConfig` 生成的字符串字段没有空运算符，所以「把字符串运算符改成空运算符」在示例里做不到。行为由手写配置的测试守着。

命令面板的文档示例把 `is-open` 写死。Enter 会发出关闭，面板仍留在页面上。绑定开关的测试里会关掉。

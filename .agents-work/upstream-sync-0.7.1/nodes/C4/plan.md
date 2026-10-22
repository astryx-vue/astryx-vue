# C4 PowerSearch / CommandPalette · 执行计划

## 目标

结构化搜索和命令面板用起来跟上上游 v0.7.1。空运算符选中就保存一次，再点已有的空条件也只提交一次、不打开编辑器。外壳和输入外框可以分开上样式。命令面板里禁用项用默认指针，鼠标划过不高亮滚动，Home / End 留在输入框里。`PowerSearch.vue` 拆到 500 行以内，并从行数白名单移出。

## 工作环境

- 工作区：`/workspace`，分支 `sync/c4-power-search`，从最新 `swarm-tree`（`dd1967e7`，含 C3）切出。云端没有本机 worktree。文档站用空闲端口 `4184`，用完关掉。
- 动手前已读：`SWARM.md`、`ROADMAP.md` 里 C4 那一行和「C 阶段每个节点都适用的 6 条」、`ledger/C4.md`、`templates/plan.md`、`templates/verify.md`、`templates/impl-report.md`、`nodes/C7/plan.md`。
- 上游：`/tmp/astryx-upstream`，标签 `v0.7.1`。读文件用 `git -C /tmp/astryx-upstream show v0.7.1:<路径>`。
- 环境纪律：测试和构建前加 `env -u NODE_ENV`；vitest 加 `--maxWorkers=2`；相关测试再以 `NODE_ENV=production` 跑一遍，用例数要相同。
- 浏览器纪律：同一时刻只开一个文档站。截图放 `/opt/cursor/artifacts`，不进 git。浏览器命令套 `browser-lock.mjs run --max-run`。

## 上游这条改动让用户看到或感受到了什么

| 上游改动 | 用户看到或感受到的变化 |
| --- | --- |
| #7347 | 在编辑器里选中空运算符，或换成默认就是空运算符的字段，条件立刻保存一次并关掉编辑器，焦点回到搜索框。再选同一个空运算符不会再保存。打开时已经是完整的空条件，不会因为打开本身再保存一次。点已有的空条件标签，只提交这一次、不打开编辑器；如果调用方自己换了空运算符的编辑器，点标签仍打开那个编辑器。 |
| #7339 | 结构化搜索的外壳和画边框的外框可以分开上样式。`id`、`data-*`、`aria-*` 落到搜索输入框上，不落到外壳。 |
| #6919 #4768 | 编辑器宽度跟浮层运行时的视口留白走，窄窗口时下限让给视口。编辑器自己变窄时，字段、运算符、值上下排列，不挤出一行。 |
| #5235 #5233 #5237 | 空查询按分组浏览字段，未分组的在前，最多 1000 条。打字后的结果受 `maxSearchResults` 限制。`menuWidth` 只改字段菜单的宽度。 |
| #4759 #4776 #5195 #5303 | 条件标签按人眼看到的字符截断，不把 emoji 切成两半。数字和日期跟当前语言走，日期用公历。 |
| #5546 #6004 #6481 #6357 #7500 | 数字没填完时按 Enter 不会把前面几个有效数字存成条件。日期区间用一个区间选择器。枚举列表打开时列出全部值。字段或运算符一变，值菜单换成新的。焦点在取消或删除按钮上时，Enter 按的是那个按钮。 |
| #5247 #5335 #6383 #5516 #6078 | 命令面板禁用项没有悬停底色，指针是默认箭头。触屏按压不会在滚动时粘住。按下的底色盖过悬停。鼠标划过高亮时不滚动，方向键才把当前行滚进视野。 |
| #6950 #7321 #6988 #4506 | 模态面板的 Escape 交给对话框，里面还有一层时先关里面。内嵌预览仍自己关。Home / End 移动光标，Page Up / Page Down 跳到第一项或最后一项。单独用的输入框是搜索框，名字不拿占位文字凑。单独用的列表保留调用方给的 id。页脚快捷键说明跟语言走。 |

## 上游依据

- 台账条目：`ledger/C4.md` 全部 46 条。
- 上游源码：`packages/core/src/PowerSearch/`（优先 `PowerSearch.spec.md`、`PowerSearch.tsx`、`PowerSearchEditPopover.tsx`）、`packages/core/src/CommandPalette/`（优先各 `*.spec.md`）。
- 上游测试：上述目录的 `*.test.tsx` 和 `formatFilterValue.test.ts`。行为改写成 Vue 测试，不搬 Playwright 夹具。

## 有没有更适合 Vue 的做法

| 上游怎么做 | 我们怎么做 | 为什么效果一样 |
| --- | --- | --- |
| Tokenizer 包一层，再把 `className` 转成 `containerClassName` | `useFieldPartStyling`：`container*` 在外壳，`control*` 和根上的 class 在外框，透传属性在输入框 | 外壳和外框都能单独上样式，输入框接到 `id` 和 `aria-*`。本库其它输入已经是这个落点 |
| React `useState` + `queueMicrotask(onSave)` | 编辑器里同样在选择回调里 `queueMicrotask` 保存 | 选择器先收起并还焦点，保存再把焦点送回搜索框，只发生一次 |
| StyleX 长写、主题 target | 现有 BEM 类和 CSS 层 | 禁用、按下、悬停的颜色关系一样 |
| `usePressFeedback` | 本库同名 composable，组件自己画按下底色 | 鼠标仍走 `:active`，触屏走按压标记 |
| 图标组件注册表 | 语义名 `search`、`close` | 用户用 `defineTheme({ icons })` 替换，缺图标时有内置图形 |

## 任务范围

- 要改：
  - `packages/core/src/PowerSearch/`（拆出动作 composable，空运算符、样式分层、截断、视口留白）
  - `packages/core/src/PowerSearch/placement.ts`、`format.ts`
  - `packages/core/styles/power-search.css`、`command-palette.css`
  - `packages/core/src/CommandPalette/`（指针、按压、滚动、键盘、列表 id、输入框语义）
  - `scripts/guardrails/line-limit-allowlist.json`（移出 `PowerSearch.vue`）
  - 中英文文档：`power-search`、`command-palette` 的说明和属性
  - `ledger/C4.md`
  - 本目录的 `verify.md`、`impl-1.md`
- 不碰：
  - `ROADMAP.md`、`SWARM.md`、`HANDOFF.md`
  - Selector、Typeahead、Dialog 的关闭栈
  - 生成的 catalog，除非 `generate:check` 真的报过期

## 开发步骤

1. 写本计划和 `verify.md`。写完不再改 `verify.md`。
2. 把筛选提交、编辑器开关和键盘处理从 `PowerSearch.vue` 抽到 `usePowerSearchActions.ts`。主文件降到 500 行以内，从白名单删除。
3. 接上样式分层。空运算符从选择回调保存一次；点已有空条件只提交一次；调用方自带空编辑器时仍打开。编辑器宽度改用浮层留白，窄容器里字段换行。截断改用已有的 grapheme 工具。
4. 命令面板：禁用指针改为 `default`；接上按压模型并让按下盖过悬停；悬停不高亮滚动；Home / End 留在输入框；单独使用时保留列表 id，输入框没有弹层时是搜索框。搜索图标改语义名。
5. 补 Vue 测试。更新中英文文档。台账 46 条写结论。
6. 跑相关 vitest 两种 `NODE_ENV`、typecheck、改过文件的 eslint、行数、`!important`、导出检查。涉及服务端渲染，再跑 `pnpm docs:build`。截文档站整页。

## 自测要求

1. `env -u NODE_ENV pnpm exec vitest run --maxWorkers=2` 覆盖 `packages/core/src/PowerSearch`、`packages/core/src/CommandPalette`、`packages/core/src/inputFontFloor.test.ts`、`packages/core/src/layer/layerCss.test.ts`，全部通过。
2. `NODE_ENV=production` 同一路径，用例数相同。
3. `env -u NODE_ENV pnpm --filter @astryx-vue/core typecheck`、改过文件的 eslint `--max-warnings 0`、`node scripts/check-line-limit.mjs`、`node scripts/check-no-important.mjs`、`node scripts/sync-exports.mjs --check`。
4. 文档站中文 `/components/power-search`、`/components/command-palette`：桌面与 390px、浅色与深色。图放 `/opt/cursor/artifacts`。桌面能看见侧栏，390 能看见顶栏「菜单」，并滚到有实质 Demo 的段落。上游文档站此环境没有对位页面，报告写「无对位」。
5. 新写和改到的源码不超过 500 行。`PowerSearch.vue` 不在白名单里。
6. `env -u NODE_ENV pnpm docs:build` 通过。

## 提交与回报

- 提交信息用中文。分几次提交。完成后推送 `sync/c4-power-search`，开 draft PR，base 为 `swarm-tree`，标题 `C4 PowerSearch / CommandPalette`。
- 不改 `ROADMAP.md`、`SWARM.md`，不合并。
- 回报写 `nodes/C4/impl-1.md`。
- 最终回复用中文：摘要和 PR 链接。

## 验证操作要短小

每次只测一件事，命令加 `timeout`。浏览器命令套 `browser-lock.mjs run --max-run`。脚本和结果放 `/tmp/c4-*`。

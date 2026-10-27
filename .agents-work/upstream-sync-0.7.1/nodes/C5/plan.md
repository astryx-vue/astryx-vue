# C5 日期时间家族 · 执行计划

## 目标

日历、日期、日期区间、日期时间、时间、时间戳和计时器跟上上游 v0.7.1。鼠标上仍是可输入的字段加弹出日历；手指上按展现模式换成系统控件，或换成底部面板里的月份网格和时分滚轮。字段外壳和带边框的本体可以分别加 class 和行内样式。标签隐藏的正名是 `isLabelHidden`，旧名 `labelHidden` 继续能藏起标签。

## 工作环境

- 工作区：`/workspace`，分支 `sync/c5-datetime`，从最新 `swarm-tree`（`dd1967e7`）切出。云端没有本机 worktree，文档站用空闲端口，用完关掉。
- 动手前已读：`SWARM.md`、`ROADMAP.md` 里 C5 那一行和 C 阶段 6 条通用验收、`ledger/C5.md`、`nodes/C7/plan.md`、C1 的 `useFieldPartStyling`、B7 的时间解析。
- 环境纪律：测试前加 `env -u NODE_ENV`；vitest 加 `--maxWorkers=2`；再以 `NODE_ENV=production` 跑一遍，用例数要相同。
- 浏览器纪律：同一时刻只开一个文档站。截图放 `/opt/cursor/artifacts`，不进 git。

## 上游这条改动让用户看到或感受到了什么

| 上游改动 | 用户看到或感受到的变化 |
| --- | --- |
| #7337 FR10 | 外壳（标签、控件、状态）和带边框的本体分开加样式。`container*` 只落在外壳，`control*` 只落在本体，都不落到原生 input 上。放进 InputGroup 或横向标签的 FormLayout 时，外壳样式不生效，开发环境会警告。 |
| #5243 #6628 AST-043 | `presentation` 决定打开什么。不传时，鼠标是弹出日历或可输入时间，粗指针是系统日期或时间控件。`bottom-sheet` 无论指针都打开底部面板：日期是单月网格，点标题换成月份和年份滚轮，重置在顶栏，保存才收起；时间是小时和分钟滚轮。`adaptive-bottom-sheet` 只在粗指针上走面板。显式 `presentation` 压过旧的 `nativePicker`。 |
| #5582 #5620 #5811 | 日期时间在底部面板里是同一个面板，顶上可以在日期和时间之间切换，而不是两个各自弹出的控件。需要秒或自定义步进时，系统时间控件表达不了，退回可输入字段；面板模式仍用滚轮表达秒。 |
| #5145 #5581 #4837 | 区间可以限制最短和最长天数，同一天可以选成一段。日期时间可以按固定间隔弹出预设时间。 |
| #6438 | 计时器按经过时间改文字节点，不靠组件反复重绘。 |
| #5335 | 禁用控件的指针是默认箭头，不是禁止图标。 |
| #7337 附带的透传 | 调用者写的 `id`、`data-*`、`aria-*` 和事件落在真正的输入控件上，并和组件自己的描述、名称拼在一起。 |

## 上游依据

- 台账条目：`ledger/C5.md` 全部 73 条。
- 上游源码：`packages/core/src/DateInput/`（优先 `DateInput.spec.md`、`TouchDateField.tsx`）、`DateRangeInput/`、`DateTimeInput/`、`TimeInput/`（`Presentation.test.tsx`、`TouchTimeField.tsx`）、`Calendar/`、`Timestamp/`、`Timer/`。
- 上游测试：`DateInput.fr10.test.tsx`、`DateInput/Presentation.test.tsx`、`DateInputTouch.test.tsx` 里能在 jsdom 里断言的表面和提交行为；`TimeInput/Presentation.test.tsx`、各 `*.fr10.test.tsx`。滚动吸附和整世纪虚拟列表不搬，改写成「一次只显示一个月、滑一下翻月」。

查上游用 `git -C /tmp/astryx-upstream show v0.7.1:<路径>`。本轮已把 v0.7.1 的这些目录检出到 `/tmp/astryx-upstream`。

## 有没有更适合 Vue 的做法

| 上游怎么做 | 我们怎么做 | 为什么效果一样 |
| --- | --- | --- |
| StyleX 的 `containerClassName` / `controlClassName` | 已有的 `useFieldPartStyling`：`containerClass` / `containerStyle` / `controlClass` / `controlStyle` | 外壳和本体各管各的。Vue 根上的 `class` / `style` 仍落在本体，和 C1 的文本框一样，不把根样式当成非法属性 |
| 虚拟化的横向月份滚动条，靠滚动吸附停在整月 | 底部面板里一次只画一个月。箭头翻月，横向滑动超过阈值也翻月 | 不会停在两个月中间，也没有整世纪的月份节点 |
| 时分滚轮是滚动定位 | `role="listbox"` 的选项列表，点选或方向键改值 | 读屏能读到 Hour、Minute，选中值立刻写回字段 |
| React ref 合并、`useOptimistic` | 模板 ref、`v-model` 和已有的 `usePendingChange` | 提交后的值和加载状态一样 |
| 图标注册表 | 语义名 `calendar`、`clock`、`chevronLeft`、`chevronRight`、`close` | 不引入另一套注册表 |

## 任务范围

- 要改：
  - `packages/core/src/DateInput/`（FR10、触屏面板、`labelHidden`）
  - `packages/core/src/TimeInput/`（展现模式补上底部面板、FR10）
  - `packages/core/src/DateTimeInput/`（粗指针底部面板合成一个、FR10）
  - `packages/core/src/DateRangeInput/`（FR10、清除按钮只在键盘激活时把焦点送回触发器）
  - `packages/core/src/composables/useTimeValue.ts`（表面解析补上 `sheet`）
  - 四个输入的中英文文档和演练场示例
  - `packages/core/styles/date-input.css`、`time-input.css`、`date-time-input.css`
  - `ledger/C5.md`
  - 本目录的 `verify.md`、`impl-1.md`
- 不碰：
  - `ROADMAP.md`、`SWARM.md`、`HANDOFF.md`
  - BottomSheet 的默认内边距（C8）
  - Calendar、Timestamp、Timer 里已经和上游效果一致的行为，只在台账里写结论
  - 生成文件，除非文档改动让 `pnpm --filter @astryx-vue/cli generate` 必须重写 catalog

## 开发步骤

1. 写本计划和 `verify.md`。
2. 四个输入接入 `useFieldPartStyling`，补上 `labelHidden` 别名和 `aria-required` 跟 FormLayout 默认必填走。补样式分层测试。
3. 日期底部面板换成单月网格：点一天就写入但面板不关，保存才关，重置在顶栏并清空，标题打开月份和年份滚轮。
4. 时间的 `bottom-sheet` / 粗指针上的 `adaptive-bottom-sheet` 打开小时和分钟滚轮。秒和自定义步进在系统控件下仍退回文本框。
5. 日期时间在面板模式下合成一个面板，顶上切换日期和时间。
6. 中英文文档写上展现模式、样式分层和标签别名。改到说明的话重新生成 CLI catalog。
7. 台账 73 条写结论。跑相关 vitest 两种 `NODE_ENV`、typecheck、eslint、行数、`!important`、导出检查。截文档站整页。若组件服务端渲染路径有变，跑 `pnpm docs:build`。

## 自测要求

1. `env -u NODE_ENV pnpm exec vitest run --maxWorkers=2` 覆盖 DateInput、DateRangeInput、DateTimeInput、TimeInput、Calendar、Timestamp、Timer、`composables/useTimeValue.test.ts`、`utils/inputPresentation.test.ts`，全部通过。
2. `NODE_ENV=production` 同一路径，用例数相同。
3. `env -u NODE_ENV pnpm --filter @astryx-vue/core typecheck`、改过文件的 eslint `--max-warnings 0`、`node scripts/check-line-limit.mjs`、`node scripts/check-no-important.mjs`、`node scripts/sync-exports.mjs --check`。文档改了 catalog 的话，`pnpm --filter @astryx-vue/cli generate:check` 通过。
4. 文档站中文 `/components/date-input`、`/components/date-range-input`、`/components/date-time-input`、`/components/time-input`、`/components/calendar`、`/components/timestamp`、`/components/timer`：桌面与 390px、浅色与深色。图放 `/opt/cursor/artifacts`，能看见侧栏或顶栏上的「菜单」。
5. 新写和改到的源码不超过 500 行。

## 提交与回报

- 提交信息用中文。分几次提交。完成后推送 `sync/c5-datetime`，开 draft PR，base 为 `swarm-tree`，标题 `C5 日期时间家族`。
- 不改 `ROADMAP.md`、`SWARM.md`，不合并。
- 回报写 `nodes/C5/impl-1.md`。
- 最终回复用中文：摘要、PR 链接。

## 验证操作要短小

每次只测一件事，命令加 `timeout`。脚本和结果放 `/tmp/c5-*`。

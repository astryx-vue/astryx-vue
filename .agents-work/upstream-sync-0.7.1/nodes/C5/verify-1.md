# C5 验收报告 · 第 1 轮

结论：通过（23/23）

- 工作区：`/workspace`，分支 `sync/c5-datetime`。被验收的代码提交是 `6f73d3e7`。本报告提交在此之后。
- 比较基点：`BASE = dd1967e79bf25c3a139b928bf2bf72bd0798b61b`。本地没有名为 `swarm-tree` 的分支。先 `git fetch origin swarm-tree`，再用 `git merge-base HEAD origin/swarm-tree`。抓取后 `origin/swarm-tree` 就是 `dd1967e7`，也是本分支的祖先。
- 临时文件：`/tmp/verify-C5/`。截图在 `/opt/cursor/artifacts/c5-verify-1/`，没有进 git。图是这轮重新截的。
- 只读检查：开始时 `git status` 是 `On branch sync/c5-datetime` / `nothing to commit, working tree clean`。写这份报告之前再查，仍是干净的。提交本报告之后工作区恢复干净。两次相同。`packages/core/dist/` 和 `node_modules/` 被忽略。
- 临时改动：为了亲自断言键盘、空选、清除焦点和 SSR，曾写入 `packages/core/src/DateInput/c5-verify-probe.test.ts` 和 `c5-verify-ssr.test.ts`。跑完已删除。已还原。
- 浏览器：`scripts/swarm/browser-lock.mjs run --max-run`，槽位 `browser-1`。文档站 `http://127.0.0.1:5196`，`env -u NODE_ENV pnpm exec vitepress dev --port 5196 --host 127.0.0.1`（先构建了 `@astryx-vue/core`，配置要读 `dist`）。结束后端口 5196 没有响应，没有残留 Chrome，两把浏览器锁都空闲，tmux 会话 `c5-docs` 已关掉。
- 上游同页没有做左右对照。主证据是本库 VitePress 中文文档站整页。来源列写「无对位」。

## 逐条结果

| # | 检查项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | 文档站整页四种组合，日期页有带标签的日期字段，时间页有时间字段，标签不把标题挤折行 | 过 | 中文 `/components/date-input`、`/components/time-input`、`/components/date-time-input`，桌面 1280×900 与 390×844，浅色与深色，共 12 张。桌面侧栏宽 260px，390 顶栏按钮文字是「菜单」。`h1` 和示例标题都是 1 行。日期页能看到 Event date、Start date；时间页能看到 Dinner reservation、24-hour。见「看图」。 |
| 2 | 日期底部面板：点一天不关，保存才关；月份标题打开两个列表；重置在顶栏 | 过 | 文档站「底部面板」里的 Due 字段。打开后面板标题 March 2026，Reset 在顶栏（top 552），Save 在底部（top 844），`resetInHeader` 为真，`saveInHeader` 为假。点 Sunday, March 1, 2026 后字段变成 March 1, 2026，`dialog[open]` 仍是 1。点月份标题后列表名是 Month、Year，翻月箭头和 Reset 都没有，按钮文案变成 Done。月历状态下再点 Save，`dialog[open]` 为 0。图：`date-sheet-open-desktop-light.png`、`date-sheet-day-kept-desktop-light.png`、`date-sheet-wheels-desktop-light.png`。日志 `/tmp/verify-C5/interact-date.txt`、`interact-follow.txt`。 |
| 3 | 不传 presentation 时细指针可输入、粗指针是系统日期；presentation 压过 nativePicker | 过 | 文档站桌面（细指针）Start date 是 `input[type=text]`，`role=combobox`，`readOnly` 为 false。粗指针和「presentation 压过 nativePicker」由这轮重跑的 `DateInput.touch.test.ts` 断言：粗指针 `type=date`；`presentation="bottom-sheet"` 且 `nativePicker="always"` 时仍是只读字段，没有 `input[type=date]`。该文件在第 20 条的 112 条里。 |
| 4 | 时间 bottom-sheet 细指针也是只读 combobox，能看到小时和分钟列表；adaptive 细指针仍是文本；秒或步进不是 1 时粗指针不用系统控件 | 过 | 中文文档站 Start 字段 `type=text`、`readonly`、`role=combobox`。点开后只有 1 个 `dialog[open]`，列表名是「小时」「分钟」「上午/下午」（页面语言是 zh-CN）。英文默认名由 `TimeInput.presentation.test.ts` 断言为 Hour、Minute；临时探针在默认语言下也按这个名字找到列表，并已删除。同一测试文件断言：`adaptive-bottom-sheet` 在细指针上可输入；`text-input` 压过 `nativePicker="always"`；`hasSeconds` 时粗指针是 `type=text`。临时探针另断言 `increment: 15` 的粗指针也是文本框，不是 `input[type=time]`。图：`time-sheet-open-desktop-light.png`。 |
| 5 | 日期时间 bottom-sheet 是同一个面板，能在日期和时间之间切换 | 过 | 中文文档站「底部面板」点开 Meeting。`dialog[open]` 为 1，页签是「日期」「时间」，里面是一个月历。点「时间」后仍是 1 个对话框，「时间」`aria-selected=true`，列表名是「小时」「分钟」「上午/下午」，没有第二个面板。图：`datetime-sheet-date-desktop-light.png`、`datetime-sheet-time-desktop-light.png`。日志 `/tmp/verify-C5/interact-dt2.txt`。 |
| 6 | containerClass 在外壳，controlClass 在本体，都不在原生 input 上；InputGroup 里 containerClass 不生效 | 过 | `DateInput.parts.test.ts`：`box-a` 在 `.astryx-field`，不在本体和 input；`ctl-a` 和根 class 在 `.astryx-date-input`，不在 input；InputGroup 和横向标签里找不到 `.box-a`，并警告 `no Field box renders`。`TimeInput.presentation.test.ts`、`DateTimeInput.sheet.test.ts` 对时间、日期时间、日期区间有同样的落点断言。四个输入都走 `useFieldPartStyling`，没有外壳时 `containerClass` 返回空。这些文件都在第 20 条的 112 条里。 |
| 7 | labelHidden 或 isLabelHidden 为真时，标签视觉隐藏，读屏名称还在 | 过 | `DateInput.parts.test.ts` 两条都把 `.astryx-field-label-group` 的 `data-hidden` 设成 `true`。临时探针：`isLabelHidden` 时该组没有 `aria-hidden`，文字仍含 Due，输入框有 `aria-labelledby`。`field.css` 对 `[data-hidden='true']` 用 1px 裁切，不是从读屏树里拿掉。时间、日期时间、日期区间的测试同样断言 `data-hidden`。 |
| 8 | 向下键打开日期弹出层；时间滚轮上下键改值；日历 PageUp / PageDown 按月移动 | 过 | 文档站 Start date 按 ArrowDown 后，第一个 combobox 的 `aria-expanded` 是 `true`，可见弹出层 280×288，焦点进了日历导航按钮。时间面板里小时列表的 `aria-activedescendant` 从 `小时-2` 变成 `小时-3`，字段变成 `3:30 PM`。临时探针：底部月历从 January 按 PageDown 到 February，PageUp 回到 January；24 小时滚轮 ArrowDown / ArrowUp 写出 `15:30` 再写出 `15:29`。`Calendar.test.ts` 的 PageDown 从 January 2026 翻到 February 2026。`useCalendarKeyboard.ts` 的 Page 键按 `add({ months })` 移动。 |
| 9 | 日期字段是 combobox 或 type=date；时间面板小时分钟是 listbox；周数角是 columnheader | 过 | 细指针日期字段 `role=combobox`（第 3 条）。粗指针 `type=date` 由 `DateInput.touch.test.ts` 断言。时间面板三个 `role=listbox`（第 4 条）。`Calendar.vue` 在 `hasWeekNumbers` 时，星期行第一个格子是 `role="columnheader"`，里面是视觉隐藏的周字段名；周数格子是 `rowheader`。临时探针挂上 `hasWeekNumbers` 后，这个角格的文字是 `week`，角色就是 columnheader。`TouchMonthGrid.vue` 的星期标题也是 columnheader。 |
| 10 | 本节点组件不在 SSR 失败名单；日期字段服务端能输出标签和输入框 | 过 | `packages/core/src/ssr-known-failures.json` 是 `{}`。临时 SSR 探针（`@vitest-environment node`，`renderToString`）输出含 `Due`、`<input` 和 `astryx-date-input`。探针已删除。日志 `/tmp/verify-C5/probe.txt`。 |
| 11 | 空值时面板没有选中日；清除后焦点回字段并调用 preventScroll | 过 | 临时探针：`modelValue: null` 的底部面板里 `.is-selected` 为 null，日期按钮数量大于 0。清除按钮点击后 `document.activeElement` 是该字段，`HTMLElement.prototype.focus` 收到 `{ preventScroll: true }`，最后一次 `update:modelValue` 是 `null`。`DateInput.vue` 的 `onClear` 就是 `inputRef.focus({ preventScroll: true })`。 |
| 12 | 禁用指针是 default，没有 not-allowed，没有 !important | 过 | 文档站时间页「状态」里 Disabled field：`disabled` 为 true，输入框和外壳的 `cursor` 都是 `default`，`getPropertyPriority('cursor')` 是空字符串。`date-input.css`、`time-input.css`、`date-range-input.css`、`calendar.css` 里禁用规则写的是 `cursor: default`。这四个文件和本节点 Vue 源码里没有 `not-allowed`，也没有 `!important`。全库 `node scripts/check-no-important.mjs` 退出码 0。 |
| 13 | 图标用语义名，没有另一套注册表 | 过 | 日期、时间、区间、日期时间面板用的是 `calendar`、`clock`、`chevronLeft`、`chevronRight`、`close`。`git diff BASE --name-only` 没有 `Icon/`。 |
| 14 | 台账每条有结论；抽查已采纳和不适用 | 过 | `ledger/C5.md`：`- [x]` 73 条，未勾 0 条。已采纳 58，不适用 15，没有第三种，没有缺结论。抽查已采纳：`2e0dbb5b9` 对上四个输入的 `useFieldPartStyling` 和第 6 条测试；`c1c233522` 对上 `resolveDatePresentation` 和「显式 presentation 压过 nativePicker」；`d51dbad80` 对上第 5 条的同一个面板。15 条不适用的理由都站得住：没有废弃主题兼容面、BottomSheet 默认内边距归 C8 且本节点面板 `padding` 为 0、StyleX 令牌和层叠不搬、禁用指针以后一条 default 为准、React ref 合并不适用于模板 ref、英文标点和规范正文不搬。按压那两条见文末建议，不因此判否。 |
| 15 | 上游 FR10、presentation、触屏面板有 Vue 测试，两种 NODE_ENV 用例数相同 | 过 | 与第 20 条同一组：两种环境都是 15 个文件、112 条，退出码 0。其中 `DateInput.parts.test.ts`、`DateInput.touch.test.ts`、`TimeInput.presentation.test.ts`、`DateTimeInput.sheet.test.ts`、`useTimeValue.test.ts`、`inputPresentation.test.ts` 覆盖样式分层、展现模式和底部面板。 |
| 16 | 中英文文档写了 presentation、containerClass / controlClass、labelHidden；中文日期页和时间页示例能显示 | 过 | 中英文 `date-input`、`time-input`、`date-time-input` 的 `props.md` 都写了 `presentation`、`isLabelHidden`（并写明旧名 `labelHidden`）、`containerClass`、`controlClass`。日期区间没有 presentation，它的中英文 props 写了后三项。中文日期页和时间页的示例都渲染出来了，见第 1 条的图，没有报错覆盖层。 |
| 17 | Calendar、DateInput、DateRangeInput、DateTimeInput、TimeInput、Timestamp、Timer 都不在 SSR 失败名单 | 过 | `ssr-known-failures.json` 是空对象，这七个名字都不在里面。 |
| 18 | 四种组合的文档站整页图亲眼看过 | 过 | 下面 12 张都标了「文档站整页」，都看过。另外 5 张交互图也看过。没有上游对位。 |
| 19 | 改到的源码不超过 500 行，白名单没有本节点躲行数的文件 | 过 | `node scripts/check-line-limit.mjs` 打印「源码单文件行数检查通过（上限 500 行）」，退出码 0。本轮源码最长的是 `DateInput.vue` 449 行、`TimeField.vue` 445 行。`scripts/guardrails/line-limit-allowlist.json` 里没有 DateInput、TimeInput、DateTimeInput、DateRangeInput、Calendar、Timestamp、Timer。 |
| 20 | 相关 vitest 两种 NODE_ENV 都通过，用例数相同 | 过 | `env -u NODE_ENV pnpm exec vitest run --maxWorkers=2` 覆盖 DateInput、DateRangeInput、DateTimeInput、TimeInput、Calendar、Timestamp、Timer、`useTimeValue.test.ts`、`inputPresentation.test.ts`：15 个文件，112 通过，约 6.6 秒。`NODE_ENV=production` 同一命令：仍是 15 个文件、112 条，约 5.8 秒。退出码都是 0。日志 `/tmp/verify-C5/vitest-unset.txt`、`vitest-prod.txt`。`vitest.config.ts` 加载时会把 `NODE_ENV` 设成 `test`，所以两次实际是同一套测试环境；清单要求的命令和用例数一致。 |
| 21 | typecheck、eslint、!important、导出；catalog 有变则 generate:check | 过 | `env -u NODE_ENV pnpm --filter @astryx-vue/core typecheck` 退出码 0。`eslint --max-warnings 0` 覆盖本轮改过的 vue/ts，退出码 0，无输出。`check-no-important.mjs` 退出码 0。`sync-exports.mjs --check` 打印「生成结果和已提交文件一致」。`catalog.json` 有改动，`pnpm --filter @astryx-vue/cli generate:check` 打印 `catalog is up to date (245 components, 31 topics, 53 templates)`。 |
| 22 | diff 没有计划范围以外的产品代码 | 过 | `git diff BASE --stat` 是 50 个文件。产品代码只在 DateInput、DateRangeInput、DateTimeInput、TimeInput、`useTimeValue.ts`、`composables/index.ts`、`date-input.css`、`time-input.css`。其余是中英文文档、演练场示例、`catalog.json`、台账和 `nodes/C5/`。没有 `ROADMAP.md`、`SWARM.md`、`HANDOFF.md`。 |
| 23 | 新增行不讲修改历史 | 过 | 全 diff 有 5 处命中。台账和 `impl-1.md` 在说上游提交把禁用指针改成 default，以及时间字段从 `useCoarsePointer` 改成 `useMediaQuery`。`verify.md` 是本检查项自己的句子。`catalog.json` 里的「也可以改成短日期」是组件说明，不是修改记录。`packages/core/src` 和样式里没有命中。 |

## 看图

下面 12 张是文档站整页。地址是中文路由，没有 `/zh/`。没有用夹具页，也没有用 `pnpm visual` 的 overview。上游没有同页可对，来源写「无对位」。桌面浅色底是白的，深色底是 `rgb(13, 15, 26)`，`html` 带或不带 `dark` 与 `color-scheme` 一致。页面没有报错覆盖层。示例标题滚到视口上沿，所以有的标题被顶栏挡住，卡片里的字段是露出来的。

| 图 | 来源 | 看到的内容 |
| --- | --- | --- |
| `/opt/cursor/artifacts/c5-verify-1/date-input-desktop-light.png` | 文档站整页，无对位 | `http://127.0.0.1:5196/components/date-input`，1280×900，浅色。顶栏有文档 / 组件 / 演练场 / 主题，左侧栏 260px，「日期输入框」被选中。滚到「可清除」：Event date，值 April 6, 2026，下面还有 Start date。标签和标题都是一行。 |
| `/opt/cursor/artifacts/c5-verify-1/date-input-desktop-dark.png` | 文档站整页，无对位 | 同一页，深色。侧栏和顶栏还在。同一组日期字段，输入框是深色。 |
| `/opt/cursor/artifacts/c5-verify-1/date-input-390-light.png` | 文档站整页，无对位 | 390×844，浅色。侧栏在屏外，顶上是「菜单」和「返回顶部」。Event date、Start date 都在，标签没有把标题折成两行。 |
| `/opt/cursor/artifacts/c5-verify-1/date-input-390-dark.png` | 文档站整页，无对位 | 390×844，深色。顶栏「菜单」还在，字段是深色。 |
| `/opt/cursor/artifacts/c5-verify-1/time-input-desktop-light.png` | 文档站整页，无对位 | `http://127.0.0.1:5196/components/time-input`，1280×900，浅色。侧栏在。滚到「限制范围」：Dinner reservation，下面是 24-hour 的 14:30 和 With seconds 的 2:30:45 PM。 |
| `/opt/cursor/artifacts/c5-verify-1/time-input-desktop-dark.png` | 文档站整页，无对位 | 同一页，深色。侧栏在，时间字段是深色。 |
| `/opt/cursor/artifacts/c5-verify-1/time-input-390-light.png` | 文档站整页，无对位 | 390×844，浅色。顶栏「菜单」。Dinner reservation 和两个格式字段都在。 |
| `/opt/cursor/artifacts/c5-verify-1/time-input-390-dark.png` | 文档站整页，无对位 | 390×844，深色。顶栏「菜单」，字段是深色。 |
| `/opt/cursor/artifacts/c5-verify-1/date-time-input-desktop-light.png` | 文档站整页，无对位 | `http://127.0.0.1:5196/components/date-time-input`，1280×900，浅色。侧栏在。滚到「校验」：Meeting time、Preferred time、Start time 都是日期加时间两段，错误是红的、警告是黄的、成功是绿的。再往下能看到「底部面板」的 Meeting。 |
| `/opt/cursor/artifacts/c5-verify-1/date-time-input-desktop-dark.png` | 文档站整页，无对位 | 同一页，深色。侧栏在，三段校验和底部面板示例都在。 |
| `/opt/cursor/artifacts/c5-verify-1/date-time-input-390-light.png` | 文档站整页，无对位 | 390×844，浅色。顶栏「菜单」。日期和时间两段并排，没有把「校验」标题挤折行。 |
| `/opt/cursor/artifacts/c5-verify-1/date-time-input-390-dark.png` | 文档站整页，无对位 | 390×844，深色。顶栏「菜单」，同一组字段是深色。 |

交互图也是文档站整页，浅色桌面，面板打开：

| 图 | 来源 | 看到的内容 |
| --- | --- | --- |
| `date-sheet-open-desktop-light.png` | 文档站整页，无对位 | 日期页底部面板打开。顶栏是 March 2026、翻月箭头和 Reset。21 日选中。Save 在面板底部，不和 Reset 并排。 |
| `date-sheet-day-kept-desktop-light.png` | 文档站整页，无对位 | 点了 1 日后面板还在，1 日变成选中，Save 仍在。 |
| `date-sheet-wheels-desktop-light.png` | 文档站整页，无对位 | 点了月份标题。左边是月份列表，March 高亮；右边是年份列表。箭头和 Reset 收起，底部按钮是 Done。 |
| `time-sheet-open-desktop-light.png` | 文档站整页，无对位 | 时间页一个底部面板，三列是小时、分钟、上午/下午。2 和「下午」高亮。底部是「保存」。 |
| `datetime-sheet-date-desktop-light.png` | 文档站整页，无对位 | 日期时间页一个面板。顶上是「日期」「时间」。下面是 2026 年 3 月，重置在顶栏右侧，底部是「确定日期」。 |
| `datetime-sheet-time-desktop-light.png` | 文档站整页，无对位 | 同一个面板切到「时间」。三列滚轮，底部是「保存」。没有第二个弹出层。 |

## 对实现者偏离计划的判断

计划里时间字段继续用 `useCoarsePointer`。实现改成 `useMediaQuery('(pointer: coarse)')`，setup 时就读 `matchMedia`。合理。挂载后才更新的话，粗指针上的 `adaptive-bottom-sheet` 第一帧仍会是文本框。

根上的 class 和 style 落在本体。这是计划里已经写明的，和 C1 一致，不算偏离。

## 不通过的项要怎么改

无。

## 改进建议（不影响结论）

日历格子没有 `data-astryx-pressable`。B3 的按压控制器只认这个标记，所以粗指针按在日期上不会走出那套按压高亮。台账把 `33a14a205` 和 `8bb01b1f0` 记成不适用，理由是不要在日期组件里再写一套按压，这和计划的分工一致。格子本身也没有用 `:active` 画按压，悬停放在 `@media (hover: hover)` 里，粗指针上不会留下悬停叠层。

底部面板的拖动手把是绝对定位的一整条，高 24px，盖住日期时间页签的上沿。页签下半截仍能点开，已经在同一个面板里切到小时和分钟。Playwright 点页签正中心时会被手把挡住。

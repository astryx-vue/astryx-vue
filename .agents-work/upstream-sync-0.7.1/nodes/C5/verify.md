# C5 日期时间家族 · 验收计划

你是验收者，只检查，不改代码。实现者写的 `impl-1.md` 只用来了解他做了什么，不能当成证据，每一条都要你亲自重新验证。

**判断标准是效果，不是代码长得像不像上游。** 只要用户看到的样子、操作的手感、读屏读出的内容、公开 API 能做到的事和上游一致，代码结构不同不算问题。

## 环境

- 工作区：`/workspace`，分支 `sync/c5-datetime`。
  - `BASE` 指 `git merge-base HEAD swarm-tree`。
- 只读铁律：开始和结束时各跑一次 `git status`，两次结果必须相同。
  - 需要临时改文件做反向检查时，改完马上用 `git checkout -- <文件>` 还原，并在报告里写明「已还原」。
  - 临时文件都放在 `/tmp/verify-C5/`。
- 测试环境：
  - 所有测试和构建命令前面加 `env -u NODE_ENV`。
  - 测试相关的检查项**跑两遍**：一遍 `env -u NODE_ENV`，一遍 `NODE_ENV=production`。两遍都要通过，用例数要相同。
  - vitest 一律加 `--maxWorkers=2`。
- 浏览器：
  - 同一时刻只开一个文档站。
  - 中文页地址是 `http://127.0.0.1:<端口>/components/<slug>`，源文件在 `apps/docs/docs/zh/components/<slug>/`。
  - 看截图用读图工具直接读 PNG。截图在 `/opt/cursor/artifacts` 或 `/tmp/verify-C5/`，不要 `git add -f`。
  - 主证据必须是文档站整页。桌面要看见侧栏，390 宽要看见顶栏上的「菜单」，并滚到有实质 Demo 的段落。没有上游对位就写「无对位」，发单侧整页。

## 检查项

每一项只能判「过」或「不过」，并附上证据：命令和输出、截图路径和你看到的内容。

### 一、效果和上游一致

1. 文档站整页四种组合（桌面/390px × 浅色/深色），至少覆盖 `/components/date-input`、`/components/time-input`、`/components/date-time-input`。日期页能看到带标签的日期字段；时间页能看到时间字段。标签没有把标题挤折行。
2. 日期 `presentation="bottom-sheet"`：点字段打开底部面板，里面是一个月，点一天后面板还在，点保存才收起。点月份标题出现月份和年份两个列表，重置在顶栏而不是和保存并排。
3. 不传 `presentation` 时，细指针是可输入的日期字段，粗指针（`(pointer: coarse)`）是 `input[type=date]`。`presentation` 和 `nativePicker` 同时传时，以 `presentation` 为准。
4. 时间 `presentation="bottom-sheet"`：即使是细指针，字段也是只读 combobox，点开后能看到名为 Hour 和 Minute 的列表。`adaptive-bottom-sheet` 在细指针上仍是可输入文本框。带秒或步进不是 1 分钟时，默认粗指针仍是文本框，不用系统时间控件。
5. 日期时间 `presentation="bottom-sheet"`：一个底部面板里能在日期和时间之间切换，不是两个各自弹出的面板。
6. `containerClass` 落在字段外壳，`controlClass` 落在带边框的本体，两者都不出现在原生 input 上。InputGroup 里 `containerClass` 不生效。
7. `labelHidden` 和 `isLabelHidden` 任一为真，标签视觉上隐藏，读屏名称还在。

### 二、反向挑刺

8. 键盘：日期字段按向下键能打开弹出层；时间滚轮用上下键改值；日历 PageUp / PageDown 按月移动。
9. 读屏：日期字段是 combobox 或 `type=date`；时间面板里的小时、分钟是 listbox；日历周数角上的格子是 columnheader。
10. 服务端渲染：本节点组件不在 `packages/core/src/ssr-known-failures.json` 里。日期字段在服务端能输出标签和输入框。
11. 空值：没有选中日期时，面板里没有选中的一天。清除之后焦点回到字段，且调用了 `preventScroll`。
12. 禁用：禁用控件的指针是 `default`，样式里没有 `not-allowed`，也没有 `!important`。
13. 图标用语义名（`calendar`、`clock`、`chevronLeft`、`chevronRight`、`close`），没有另一套图标注册表。

### 三、C 节点通用检查

14. 台账 `ledger/C5.md` 每一条都是 `- [x]`，下面都有 `- 结论：已采纳` 或 `- 结论：不适用：<理由>`。抽查至少 3 条「已采纳」，确认确实做了；抽查全部「不适用」的理由，确认站得住。
15. 上游 FR10、presentation、触屏面板的行为，都有对应的 Vue 测试，两种 NODE_ENV 下都通过，用例数相同。
16. 中英文文档写了 `presentation`、`containerClass` / `controlClass`、`labelHidden`。打开中文日期页和时间页，示例能显示。
17. Calendar、DateInput、DateRangeInput、DateTimeInput、TimeInput、Timestamp、Timer 都不在 `ssr-known-failures.json` 里。
18. 四种组合的文档站整页图你亲眼看过。报告里标明是「文档站整页」。没有上游对位就写「无对位」。
19. 改到的源码文件都不超过 500 行，`node scripts/check-line-limit.mjs` 通过。白名单里没有本节点为了躲行数而留下的文件。

### 四、整体

20. `env -u NODE_ENV pnpm exec vitest run --maxWorkers=2` 覆盖本节点相关测试通过；`NODE_ENV=production` 同一命令通过；用例数相同。全量 vitest 不在本节点验收里强制重跑。
21. `env -u NODE_ENV pnpm --filter @astryx-vue/core typecheck`、改过文件的 eslint、`node scripts/check-no-important.mjs`、`node scripts/sync-exports.mjs --check` 通过。若 catalog 有变，`generate:check` 通过。
22. `git diff $BASE --stat` 里没有计划范围以外的产品代码。允许文档、catalog、台账和 `nodes/C5/`。
23. 注释里没有修改历史：`git diff $BASE | grep -nE "^\+.*(原来|改成|之前|moved|extracted|split from)"` 没有命中，或者命中的都不是在讲修改历史。

## 结论

- 只要有一条不过，结论就是「不通过」。
- 报告写到 `nodes/C5/verify-<N>.md`。
- 最终回复用中文，200 字以内。

## 验证操作要短小

每次验证只测一件事，命令加 `timeout`。脚本和结果放 `/tmp/verify-C5/`。

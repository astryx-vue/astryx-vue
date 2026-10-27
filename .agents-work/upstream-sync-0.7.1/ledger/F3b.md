# F3b 实验包：展示类组件 · 上游改动台账

范围：96f9917f..v0.7.1 · 共 31 个提交 · 其中破坏性 0 个

每条处理完后打勾，并在条目下注明「已采纳」或「不适用：理由」。

## 破坏性改动

无。

## 新功能 / 修复 / 其它

### feat

- [x] `5d8ece19c` feat(Tooltip, HoverCard): tap to open where there is no hover (#5248)
  - 文件：packages/lab/src/InfoTip/InfoTip.doc.mjs、packages/lab/src/InfoTip/InfoTip.test.tsx、packages/lab/src/InfoTip/InfoTip.tsx
  - 规范文档：packages/lab/src/InfoTip/InfoTip.doc.mjs
  - 测试：packages/lab/src/InfoTip/InfoTip.test.tsx
  - 还涉及：B4、C7
  - 链接：https://github.com/facebook/astryx/commit/5d8ece19c46512f591535133aa3c21db4ad3380b
  - 结论：已采纳：InfoTip 用 core `Tooltip` 的 `touchTrigger="tap"`，按钮上轻点也能打开气泡（`packages/lab/src/InfoTip/InfoTip.vue`），并有轻点开、再点关的测试。
- [x] `47d5160dc` feat(core): one shared dismissal stack for every overlay layer (#4881)
  - 文件：packages/lab/src/InfoTip/InfoTip.tsx
  - 还涉及：B3、B4、C7、C13
  - 链接：https://github.com/facebook/astryx/commit/47d5160dc76c435276d4502a320d3cf72e2b0dae
  - 结论：已采纳（部分）：InfoTip 不再自己拦 Escape，交给 core `Tooltip` 的关闭栈。但 core 目前把 hover 层登记成 `dismissOnPointerOutside: false`，点外面不关，这一条要等 core 浮层关闭栈（B4 / C7）补齐，已写进回报。
- [x] `ea0483449` feat(theme): add appearance nesting tokens (#5963)
  - 文件：packages/lab/src/Schedule/shared.tsx
  - 还涉及：B1、C1、C2、C5、C7、C8、C9、C10、C11、C12、C13、C14、C16、D4、F1b、F2b、F3a、F3c、F3d
  - 链接：https://github.com/facebook/astryx/commit/ea0483449dcbdd69aed43aa0d4ba9d6f57f54447
  - 结论：不适用：这条改的是 `Schedule/shared.tsx` 的 appearance 嵌套，Schedule 归 F3d；嵌套变量本身属于 themes 包（B1 / F1b），本节点不改 themes。
- [x] `a4787ffbd` feat(lab): open Schedule day and week grids one hour before now (#6928)
  - 文件：packages/lab/src/Schedule/Schedule.doc.mjs、packages/lab/src/Schedule/Schedule.tsx、packages/lab/src/Schedule/TimeGridView.test.tsx、packages/lab/src/Schedule/TimeGridView.tsx、packages/lab/src/Schedule/__tests__/ScheduleTimeGridInitialPosition.a11y.chromium.spec.ts、packages/lab/src/Schedule/timeGridScrollMemory.ts
  - 规范文档：packages/lab/src/Schedule/Schedule.doc.mjs
  - 测试：packages/lab/src/Schedule/TimeGridView.test.tsx、packages/lab/src/Schedule/__tests__/ScheduleTimeGridInitialPosition.a11y.chromium.spec.ts
  - 链接：https://github.com/facebook/astryx/commit/a4787ffbd3baade8d2504c0ac8cb2bd11afd44b2
  - 结论：不适用：Schedule 组件不在本节点（归 F3d），本节点只做 Stat、CircularProgress、InfoTip、SVGIcon、LogStream。
- [x] `c3016f8f0` feat(lab): Schedule week and day views open a popover they own from each event (#6929)
  - 文件：packages/lab/src/Schedule/DayView.tsx、packages/lab/src/Schedule/Schedule.doc.mjs、packages/lab/src/Schedule/Schedule.test.tsx、packages/lab/src/Schedule/TimeGridView.tsx、packages/lab/src/Schedule/WeeklyView.tsx、packages/lab/src/Schedule/__tests__/ScheduleEventPopover.a11y.chromium.spec.ts、packages/lab/src/Schedule/index.ts、packages/lab/src/Schedule/shared.tsx 等 9 个
  - 规范文档：packages/lab/src/Schedule/Schedule.doc.mjs
  - 测试：packages/lab/src/Schedule/Schedule.test.tsx、packages/lab/src/Schedule/__tests__/ScheduleEventPopover.a11y.chromium.spec.ts
  - 链接：https://github.com/facebook/astryx/commit/c3016f8f054b917cdaa1d888c8023426521adfb6
  - 结论：不适用：Schedule 组件不在本节点（归 F3d），本节点只做 Stat、CircularProgress、InfoTip、SVGIcon、LogStream。
- [x] `b5e5e6832` feat(lab): the Schedule month view takes renderPopover (#7113)
  - 文件：packages/lab/src/Schedule/MonthlyView.tsx、packages/lab/src/Schedule/Schedule.doc.mjs、packages/lab/src/Schedule/Schedule.test.tsx、packages/lab/src/Schedule/__tests__/ScheduleMonthChip.a11y.chromium.spec.ts、packages/lab/src/Schedule/__tests__/ScheduleMonthEventPopover.a11y.chromium.spec.ts、packages/lab/src/Schedule/__tests__/ScheduleMonthOverflow.a11y.chromium.spec.ts、packages/lab/src/Schedule/shared.tsx、packages/lab/src/Schedule/useScheduleViewPopover.ts
  - 规范文档：packages/lab/src/Schedule/Schedule.doc.mjs
  - 测试：packages/lab/src/Schedule/Schedule.test.tsx、packages/lab/src/Schedule/__tests__/ScheduleMonthChip.a11y.chromium.spec.ts、packages/lab/src/Schedule/__tests__/ScheduleMonthEventPopover.a11y.chromium.spec.ts、packages/lab/src/Schedule/__tests__/ScheduleMonthOverflow.a11y.chromium.spec.ts
  - 链接：https://github.com/facebook/astryx/commit/b5e5e68325520dbc9d4c79b64887ddcec70c504d

  - 结论：不适用：Schedule 组件不在本节点（归 F3d），本节点只做 Stat、CircularProgress、InfoTip、SVGIcon、LogStream。
### fix

- [x] `d990fb58d` fix(a11y): no hover state on disabled elements (#5247)
  - 文件：packages/lab/src/InfoTip/InfoTip.tsx、packages/lab/src/LogStream/LogStream.tsx
  - 还涉及：B1、B3、C1、C2、C3、C4、C5、C10、C11、C12、C13、C14、C15、C16、F3a、F3e
  - 链接：https://github.com/facebook/astryx/commit/d990fb58d902b2315d9809f1469cfc8c753c4889
  - 结论：已采纳：InfoTip 和 LogStream 的悬停样式都写成 `:hover:where(:not(:disabled, [aria-disabled='true']))`，禁用元素没有悬停态。
- [x] `e891c0dc8` fix(a11y): a disabled control answers the pointer with not-allowed (#5323)
  - 文件：packages/lab/src/InfoTip/InfoTip.tsx、packages/lab/src/LogStream/LogStream.tsx
  - 还涉及：B2、B3、C1、C2、C3、C4、C5、C6、C7、C8、C9、C10、C11、C12、C13、C14、C15、C16、F3a、F3e
  - 链接：https://github.com/facebook/astryx/commit/e891c0dc871628ab69fef5f44be04deeb3fe6c2f
  - 结论：已采纳：禁用态光标先用 `not-allowed`，随后被 `8a9d85fdf` 统一改成 `default`，我们直接落到最终形态（见下一条）。
- [x] `8a9d85fdf` fix(a11y): one disabled cursor everywhere — default, not not-allowed (#5335)
  - 文件：packages/lab/src/InfoTip/InfoTip.tsx、packages/lab/src/LogStream/LogStream.tsx
  - 还涉及：B2、B3、C1、C2、C3、C4、C5、C6、C7、C8、C9、C10、C11、C12、C13、C14、C15、C16、F3a、F3e
  - 链接：https://github.com/facebook/astryx/commit/8a9d85fdf35e23788938b739e4d0d8443ad7d739
  - 结论：已采纳：禁用元素的光标统一是 `default`，InfoTip 触发器、LogStream 的展开行和「跳到最新」按钮都一样。
- [x] `ea9983363` fix(lab): add tab stops to scrollable regions (#4691)
  - 文件：packages/lab/src/Schedule/MonthlyView.tsx、packages/lab/src/Schedule/Schedule.test.tsx
  - 测试：packages/lab/src/Schedule/Schedule.test.tsx
  - 还涉及：F3d
  - 链接：https://github.com/facebook/astryx/commit/ea9983363399c1b86ade1cca405107dfb1c479dd
  - 结论：不适用：Schedule 组件不在本节点（归 F3d），本节点只做 Stat、CircularProgress、InfoTip、SVGIcon、LogStream。
- [x] `6c8b15c01` fix(a11y,rtl): unbreak the weekly a11y scan and Schedule's RTL chevrons (#5383)
  - 文件：packages/lab/src/Schedule/plugins/PaginationPlugin.tsx、packages/lab/src/Schedule/shared.tsx
  - 还涉及：B5、C11
  - 链接：https://github.com/facebook/astryx/commit/6c8b15c0131f4323d02c644a62933f0240aea024
  - 结论：不适用：Schedule 组件不在本节点（归 F3d），本节点只做 Stat、CircularProgress、InfoTip、SVGIcon、LogStream。
- [x] `2458b03b3` fix(i18n): harden date locale handling (#5303)
  - 文件：packages/lab/src/Schedule/DayView.tsx、packages/lab/src/Schedule/ListView.tsx、packages/lab/src/Schedule/MonthlyView.tsx、packages/lab/src/Schedule/Schedule.doc.mjs、packages/lab/src/Schedule/Schedule.test.tsx、packages/lab/src/Schedule/Schedule.tsx、packages/lab/src/Schedule/TimeGridView.tsx、packages/lab/src/Schedule/WeeklyView.tsx 等 10 个
  - 规范文档：packages/lab/src/Schedule/Schedule.doc.mjs
  - 测试：packages/lab/src/Schedule/Schedule.test.tsx
  - 还涉及：B7、C4、C5、F2a、F3d
  - 链接：https://github.com/facebook/astryx/commit/2458b03b35a45512b996b0c2c764d9530a36a052
  - 结论：不适用：Schedule 组件不在本节点（归 F3d），本节点只做 Stat、CircularProgress、InfoTip、SVGIcon、LogStream。
- [x] `56f796623` fix(lab): normalize CircularProgress indeterminate dash (#5916)
  - 文件：packages/lab/src/CircularProgress/CircularProgress.tsx
  - 链接：https://github.com/facebook/astryx/commit/56f79662368eb71c55cbac56c6050fe4e5761f78
  - 结论：已采纳：CircularProgress 不确定进度用归一化后的关键帧（2%/300% → 175%/-68% → 2%/-302%），首尾正好接上（`packages/lab/styles/circular-progress.css`）。
- [x] `77a62df7e` fix(lab): give the Schedule time grid one scroll owner with pinned header, all-day row, and gutter (#6926)
  - 文件：packages/lab/src/Schedule/DayView.tsx、packages/lab/src/Schedule/Schedule.doc.mjs、packages/lab/src/Schedule/Schedule.test.tsx、packages/lab/src/Schedule/TimeGridView.tsx、packages/lab/src/Schedule/WeeklyView.tsx、packages/lab/src/Schedule/__tests__/ScheduleTimeGridGeometry.a11y.chromium.spec.ts、packages/lab/src/Schedule/__tests__/timeGridProbe.ts、packages/lab/src/Schedule/schedule.stylex.ts 等 9 个
  - 规范文档：packages/lab/src/Schedule/Schedule.doc.mjs
  - 测试：packages/lab/src/Schedule/Schedule.test.tsx、packages/lab/src/Schedule/__tests__/ScheduleTimeGridGeometry.a11y.chromium.spec.ts、packages/lab/src/Schedule/__tests__/timeGridProbe.ts
  - 链接：https://github.com/facebook/astryx/commit/77a62df7eae6ae856e0f552da6590182be015087
  - 结论：不适用：Schedule 组件不在本节点（归 F3d），本节点只做 Stat、CircularProgress、InfoTip、SVGIcon、LogStream。
- [x] `fdc76dc24` fix(lab): lay out simultaneous Schedule events side by side (#6927)
  - 文件：packages/lab/src/Schedule/TimeGridView.tsx、packages/lab/src/Schedule/__tests__/ScheduleTimeGridOverlap.a11y.chromium.spec.ts、packages/lab/src/Schedule/shared.tsx、packages/lab/src/Schedule/timeGridLayout.test.ts、packages/lab/src/Schedule/timeGridLayout.ts
  - 测试：packages/lab/src/Schedule/__tests__/ScheduleTimeGridOverlap.a11y.chromium.spec.ts、packages/lab/src/Schedule/timeGridLayout.test.ts
  - 链接：https://github.com/facebook/astryx/commit/fdc76dc240a1a3d8fc7a7dcf7e8e6be35672a802
  - 结论：不适用：Schedule 组件不在本节点（归 F3d），本节点只做 Stat、CircularProgress、InfoTip、SVGIcon、LogStream。
- [x] `195c46579` fix(lab): Schedule paints a timed event that ends at midnight (#7079)
  - 文件：packages/lab/src/Schedule/Schedule.test.tsx、packages/lab/src/Schedule/TimeGridView.tsx、packages/lab/src/Schedule/__tests__/ScheduleTimeGridMidnight.a11y.chromium.spec.ts、packages/lab/src/Schedule/shared.tsx
  - 测试：packages/lab/src/Schedule/Schedule.test.tsx、packages/lab/src/Schedule/__tests__/ScheduleTimeGridMidnight.a11y.chromium.spec.ts
  - 链接：https://github.com/facebook/astryx/commit/195c46579b4eee7462dacee06fd3434074520d9a
  - 结论：不适用：Schedule 组件不在本节点（归 F3d），本节点只做 Stat、CircularProgress、InfoTip、SVGIcon、LogStream。
- [x] `aea0d3e03` fix(lab): Schedule times read in order right-to-left (#7077)
  - 文件：packages/lab/src/Schedule/Schedule.test.tsx、packages/lab/src/Schedule/TimeGridView.tsx、packages/lab/src/Schedule/__tests__/ScheduleTimeDirection.a11y.chromium.spec.ts、packages/lab/src/Schedule/__tests__/ScheduleTimeGridOverlap.a11y.chromium.spec.ts、packages/lab/src/Schedule/shared.tsx
  - 测试：packages/lab/src/Schedule/Schedule.test.tsx、packages/lab/src/Schedule/__tests__/ScheduleTimeDirection.a11y.chromium.spec.ts、packages/lab/src/Schedule/__tests__/ScheduleTimeGridOverlap.a11y.chromium.spec.ts
  - 链接：https://github.com/facebook/astryx/commit/aea0d3e03e9b93218ed994df9164aed58fa32509
  - 结论：不适用：Schedule 组件不在本节点（归 F3d），本节点只做 Stat、CircularProgress、InfoTip、SVGIcon、LogStream。
- [x] `9eed5cb13` fix(lab): a busy Schedule month day shows +N more instead of losing events (#7050)
  - 文件：packages/lab/src/Schedule/MonthlyView.tsx、packages/lab/src/Schedule/Schedule.doc.mjs、packages/lab/src/Schedule/Schedule.test.tsx、packages/lab/src/Schedule/__tests__/ScheduleMonthOverflow.a11y.chromium.spec.ts、packages/lab/src/Schedule/monthLayout.test.ts、packages/lab/src/Schedule/monthLayout.ts、packages/lab/src/Schedule/shared.tsx、packages/lab/src/Schedule/useScheduleViewPopover.ts
  - 规范文档：packages/lab/src/Schedule/Schedule.doc.mjs
  - 测试：packages/lab/src/Schedule/Schedule.test.tsx、packages/lab/src/Schedule/__tests__/ScheduleMonthOverflow.a11y.chromium.spec.ts、packages/lab/src/Schedule/monthLayout.test.ts
  - 链接：https://github.com/facebook/astryx/commit/9eed5cb1300fe23f2c21c6f4c1591092b3150243
  - 结论：不适用：Schedule 组件不在本节点（归 F3d），本节点只做 Stat、CircularProgress、InfoTip、SVGIcon、LogStream。
- [x] `5a877f46b` fix(lab): Schedule month chips lead with the title (#7107)
  - 文件：packages/lab/src/Schedule/Schedule.doc.mjs、packages/lab/src/Schedule/Schedule.test.tsx、packages/lab/src/Schedule/__tests__/ScheduleMonthChip.a11y.chromium.spec.ts、packages/lab/src/Schedule/shared.tsx
  - 规范文档：packages/lab/src/Schedule/Schedule.doc.mjs
  - 测试：packages/lab/src/Schedule/Schedule.test.tsx、packages/lab/src/Schedule/__tests__/ScheduleMonthChip.a11y.chromium.spec.ts
  - 链接：https://github.com/facebook/astryx/commit/5a877f46baf58e58957f4531cd4e15e67152aaa8
  - 结论：不适用：Schedule 组件不在本节点（归 F3d），本节点只做 Stat、CircularProgress、InfoTip、SVGIcon、LogStream。
- [x] `9acf2845a` fix(lab): Schedule's event popover shows no scrollbar when its content fits (#7062)
  - 文件：packages/lab/src/Schedule/MonthlyView.tsx、packages/lab/src/Schedule/TimeGridView.tsx、packages/lab/src/Schedule/__tests__/ScheduleEventPopover.a11y.chromium.spec.ts、packages/lab/src/Schedule/shared.tsx
  - 测试：packages/lab/src/Schedule/__tests__/ScheduleEventPopover.a11y.chromium.spec.ts
  - 链接：https://github.com/facebook/astryx/commit/9acf2845a12bc5d601d286ca54608206912d2837
  - 结论：不适用：Schedule 组件不在本节点（归 F3d），本节点只做 Stat、CircularProgress、InfoTip、SVGIcon、LogStream。
- [x] `cc018abe9` fix(lab): Schedule paints a timed event of 24 hours or more as an all-day span (#7057)
  - 文件：packages/lab/src/Schedule/Schedule.doc.mjs、packages/lab/src/Schedule/TimeGridView.test.tsx、packages/lab/src/Schedule/TimeGridView.tsx、packages/lab/src/Schedule/__tests__/ScheduleMonthEventPopover.a11y.chromium.spec.ts、packages/lab/src/Schedule/__tests__/ScheduleTimeGridLongSpan.a11y.chromium.spec.ts、packages/lab/src/Schedule/dateMath.ts、packages/lab/src/Schedule/shared.tsx
  - 规范文档：packages/lab/src/Schedule/Schedule.doc.mjs
  - 测试：packages/lab/src/Schedule/TimeGridView.test.tsx、packages/lab/src/Schedule/__tests__/ScheduleMonthEventPopover.a11y.chromium.spec.ts、packages/lab/src/Schedule/__tests__/ScheduleTimeGridLongSpan.a11y.chromium.spec.ts
  - 链接：https://github.com/facebook/astryx/commit/cc018abe9982156de54564f5cac8431ef5c8eb93
  - 结论：不适用：Schedule 组件不在本节点（归 F3d），本节点只做 Stat、CircularProgress、InfoTip、SVGIcon、LogStream。
- [x] `2fadc27f7` fix(core): a day whose midnight daylight saving skips starts at its first instant (#7081)
  - 文件：packages/lab/src/Schedule/Schedule.test.tsx、packages/lab/src/Schedule/__tests__/ScheduleTimeGridSkippedMidnight.a11y.chromium.spec.ts
  - 测试：packages/lab/src/Schedule/Schedule.test.tsx、packages/lab/src/Schedule/__tests__/ScheduleTimeGridSkippedMidnight.a11y.chromium.spec.ts
  - 还涉及：B7
  - 链接：https://github.com/facebook/astryx/commit/2fadc27f7159f8adb5d26f58e21d5d762d2a321f

  - 结论：不适用：Schedule 组件不在本节点（归 F3d），本节点只做 Stat、CircularProgress、InfoTip、SVGIcon、LogStream。
### test

- [x] `1581b0900` test: route charts/vega into the ui vitest project and cover the untested viz packages and hooks (#4295) (#4377)
  - 文件：packages/lab/src/SVGIcon/SVGIcon.test.tsx
  - 测试：packages/lab/src/SVGIcon/SVGIcon.test.tsx
  - 还涉及：B3、B5、C1、C3、C4、C5、C7、C10、C11、C14、F2a、F2b、F3d、F5
  - 链接：https://github.com/facebook/astryx/commit/1581b0900091ece263b18bb1dcb431841b1cbdcb

  - 结论：已采纳：SVGIcon 有覆盖变体、遮罩、角色分组和 a11y 属性的测试，跟着 `packages/**/*.test.ts` 的 vitest 项目一起跑。
### docs

- [x] `378d17022` docs(lab): show how Schedule fits a page that pages, groups, and loads on its own (#7058)
  - 文件：packages/lab/src/Schedule/Schedule.doc.mjs
  - 规范文档：packages/lab/src/Schedule/Schedule.doc.mjs
  - 链接：https://github.com/facebook/astryx/commit/378d17022f51ab1c7531e607b869c56e10f2f43b

  - 结论：不适用：Schedule 组件不在本节点（归 F3d），本节点只做 Stat、CircularProgress、InfoTip、SVGIcon、LogStream。文档站页面归 F3f。
### 其它

- [x] `6e6b9b476` revert(theme): restore local stacking contracts (#6031)
  - 文件：packages/lab/src/Schedule/shared.tsx
  - 还涉及：B1、C1、C2、C5、C7、C8、C9、C10、C11、C12、C13、C14、C16、D4、F1b、F2b、F3a、F3c、F3d
  - 链接：https://github.com/facebook/astryx/commit/6e6b9b476713156899fc8bd2107f3f3ee2d26a90
  - 结论：不适用：Schedule 组件不在本节点（归 F3d），本节点只做 Stat、CircularProgress、InfoTip、SVGIcon、LogStream。不适用：属于 themes 包的 appearance nesting 与会话栈契约（B1 / F1b），本节点不改 themes。
- [x] `4eb7ea268` spec(Schedule): component:Schedule record — time-grid geometry, overlap, initial position, event popover (#6925)
  - 文件：packages/lab/src/Schedule/Schedule.spec.md
  - 规范文档：packages/lab/src/Schedule/Schedule.spec.md
  - 链接：https://github.com/facebook/astryx/commit/4eb7ea26844e4c239687d410d776f23812a60ea9
  - 结论：不适用：Schedule 组件不在本节点（归 F3d），本节点只做 Stat、CircularProgress、InfoTip、SVGIcon、LogStream。规范文档归 F3d。
- [x] `7b8bd1953` spec(Schedule): a busy month day shows a count that opens the whole day (#7049)
  - 文件：packages/lab/src/Schedule/Schedule.spec.md
  - 规范文档：packages/lab/src/Schedule/Schedule.spec.md
  - 链接：https://github.com/facebook/astryx/commit/7b8bd1953a4db5bd4b97594b625c7b8511b19d04
  - 结论：不适用：Schedule 组件不在本节点（归 F3d），本节点只做 Stat、CircularProgress、InfoTip、SVGIcon、LogStream。
- [x] `5f6cd746f` spec(Schedule): a busy month day keeps its earliest events (#7060)
  - 文件：packages/lab/src/Schedule/Schedule.spec.md
  - 规范文档：packages/lab/src/Schedule/Schedule.spec.md
  - 链接：https://github.com/facebook/astryx/commit/5f6cd746ff0d5bd5f57a913e4c6d8ad96ac6f5cc
  - 结论：不适用：Schedule 组件不在本节点（归 F3d），本节点只做 Stat、CircularProgress、InfoTip、SVGIcon、LogStream。
- [x] `2c5034c5f` spec(Schedule): month chips lead with the title (#7053)
  - 文件：packages/lab/src/Schedule/Schedule.spec.md
  - 规范文档：packages/lab/src/Schedule/Schedule.spec.md
  - 链接：https://github.com/facebook/astryx/commit/2c5034c5fa9706bbfedb1c08cfac4dfed23ac3af
  - 结论：不适用：Schedule 组件不在本节点（归 F3d），本节点只做 Stat、CircularProgress、InfoTip、SVGIcon、LogStream。
- [x] `3879a54dc` spec(Schedule): the month view offers the time grid's event popover (#7055)
  - 文件：packages/lab/src/Schedule/Schedule.spec.md
  - 规范文档：packages/lab/src/Schedule/Schedule.spec.md
  - 链接：https://github.com/facebook/astryx/commit/3879a54dc727ebf03b0d188399022a60ecc8cb01
  - 结论：不适用：Schedule 组件不在本节点（归 F3d），本节点只做 Stat、CircularProgress、InfoTip、SVGIcon、LogStream。
- [x] `9f978fa03` spec(Schedule): a timed event of 24 hours or more is an all-day span (#7056)
  - 文件：packages/lab/src/Schedule/Schedule.spec.md
  - 规范文档：packages/lab/src/Schedule/Schedule.spec.md
  - 链接：https://github.com/facebook/astryx/commit/9f978fa031c5621a96052093ca490cedd37b308c

  - 结论：不适用：Schedule 组件不在本节点（归 F3d），本节点只做 Stat、CircularProgress、InfoTip、SVGIcon、LogStream。
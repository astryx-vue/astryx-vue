# C5 日期时间家族 · 第 1 轮实现回报

- 工作区：`/workspace`，分支 `sync/c5-datetime`。云端 VM，没有本机 worktree。
- 提交（基于 swarm-tree `dd1967e7`）：
  - `9bb2aa03` docs: 写下 C5 日期时间家族的执行计划和验收计划
  - `aab51c13` feat: 日期时间家族接上样式分层和底部面板
  - `2192cf43` test: 补日期时间的样式分层和面板测试
  - `83b15ea1` docs: 补日期时间的展现模式说明和底部面板示例
  - `0e8c2ad3` docs: 回写 C5 日期时间台账的处理结论
  - 实现回报就是本文件，提交说明是「写下 C5 第 1 轮实现回报」。

## 1. 做了什么

四个输入接入 `useFieldPartStyling`。`containerClass` / `containerStyle` 落在 Field 外壳，`controlClass` / `controlStyle` 和根上的 class、style 落在带边框的本体，不落到内部输入框。InputGroup 和横向标签的 FormLayout 里没有外壳时，外壳样式不生效并在开发环境警告。调用者的 `id` 和 `aria-describedby` 落到真正的控件上，并和组件自己的描述拼在一起。

`isLabelHidden` 是正名，`labelHidden` 任一为真就藏起标签。演练场里的日期区间已经写的是 `is-label-hidden`。

日期底部面板一次画一个月。点一天就写入，面板不关，保存才关。重置在顶栏，打开月份和年份滚轮时箭头和重置一起藏起。横向滑动超过 48px 翻月，从右到左时方向反过来。时间的 `bottom-sheet` 始终是小时和分钟滚轮，`adaptive-bottom-sheet` 只在粗指针上用滚轮。有秒、步进不是 1 或设了预设间隔时，系统时间控件退回文本框，滚轮不受这个限制。日期时间在面板模式下是同一个底部面板，顶上在日期和时间之间切换。

时间字段改用 `useMediaQuery('(pointer: coarse)')`，第一帧就能读到指针类型，不用等到挂载。日期和日期时间本来就是这个查询。

iOS 粗指针上，日期输入框和时间输入框的字号至少 1rem，避免聚焦时页面被放大。

| 文件 | 行数 | 职责 |
| --- | --- | --- |
| `packages/core/src/DateInput/DateInput.vue` | 449 | 样式分层、面板开关、输入法组合期间不提交 |
| `packages/core/src/DateInput/NativeDateField.vue` | 305 | 系统日期控件的外壳和本体样式 |
| `packages/core/src/DateInput/TouchDateSheet.vue` | 184 | 顶栏、滚轮、保存和重置 |
| `packages/core/src/DateInput/TouchMonthGrid.vue` | 134 | 单月网格和键盘 |
| `packages/core/src/DateInput/PickerWheel.vue` | 74 | 月份、年份和时分共用的 listbox |
| `packages/core/src/DateInput/monthRange.ts` | 30 | 可达月份，前后各 600 个月 |
| `packages/core/src/TimeInput/TimeField.vue` | 445 | 文本、系统控件和底部滚轮 |
| `packages/core/src/TimeInput/TouchTimeWheels.vue` | 138 | 小时、分钟、秒和上下午 |
| `packages/core/src/DateTimeInput/DateTimeInput.vue` | 201 | 样式分层，面板模式交给合成字段 |
| `packages/core/src/DateTimeInput/TouchDateTimeField.vue` | 180 | 一个面板里切换日期和时间 |
| `packages/core/src/DateRangeInput/DateRangeInput.vue` | 198 | 样式分层；键盘清除才把焦点送回触发器 |
| `packages/core/src/composables/useTimeValue.ts` | 原文件加上 `sheet` 表面 | 时间展现模式解析 |

## 2. 和上游的对照

| 上游改动 | 上游怎么做 | 我们怎么做 | 为什么效果相同 |
| --- | --- | --- | --- |
| #7337 FR10 | StyleX 的 container / control className | `useFieldPartStyling` | 外壳和本体各管各的，都不落到原生 input |
| #5243 触屏日期 | 虚拟横向月份，滚动吸附停在整月 | 一次一个月，箭头或滑动 48px 翻月 | 不会停在两个月中间；点一天写入，保存才收起 |
| #6628 presentation | `presentation` 压过 `nativePicker` | `resolveDatePresentation` 和 `resolveTimeSurface` | 显式展现模式优先。日期的 never 是面板策略，时间的 never 是文本框 |
| #5582 日期时间面板 | 一个面板里切日期和时间 | `TouchDateTimeField` | 两边都齐才写出 `YYYY-MM-DDTHH:MM` |
| #5335 禁用指针 | `cursor: default` | 同样，放在组件层，没有 `!important` | 禁用时不是禁止图标 |
| #6438 Timer | 直接改文字节点 | 原先就已经这样 | 经过时间不靠组件反复重绘 |
| 图标 | 上游图标注册表 | 语义名 `calendar`、`clock`、`chevronLeft`、`chevronRight`、`close` | 主题只认本库的语义名 |

## 3. 和计划不一样的地方

计划里时间字段继续用 `useCoarsePointer`。那个值要到挂载后才更新，粗指针上的 `adaptive-bottom-sheet` 第一帧仍是文本框。实际改成 `useMediaQuery`，和日期输入一样，setup 时就读 `matchMedia`。

根上的 class 和 style 落在本体，不学上游把 `className` 当成非法属性。这一点计划里已经写了，和 C1 一致。

## 4. 台账处理

`ledger/C5.md` 73 条全部打勾。已采纳 58 条，不适用 15 条。

不适用：

- `a1a6a636f`、`41ab6db2a`：本库没有上游那层废弃主题兼容面，不恢复。
- `b507cdef4`：BottomSheet 默认内边距属于 C8。本节点面板显式 padding 为 0。
- `ea0483449`、`6e6b9b476`：上游改的是 StyleX 嵌套和层叠。本库用 CSS 变量。
- `e891c0dc8`：后一条把禁用指针改成 default。本库直接用 default。
- `540f19e62`、`8a055dfb3`：React ref 合并。Vue 用模板 ref。
- `33a14a205`、`8bb01b1f0`：日历格子没有用 `:active` 画按压。粗指针按压是 B3 的共享模型。
- `013e72813`、`c04ec04ae`、`351dfc7ec`：上游英文文档的破折号和弯引号清理，不搬。
- `17044ab1e`、`e7723cddf`：规范审批人和版本规格正文不搬。

`0899f21ae`、`1013a818d`、`6f03d729c`、`655fc299f` 的行为已经在代码里，规范正文不搬，台账记为已采纳行为。

## 5. 自测结果

| # | 自测项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | `env -u NODE_ENV pnpm exec vitest run --maxWorkers=2` 覆盖 DateInput、DateRangeInput、DateTimeInput、TimeInput、Calendar、Timestamp、Timer、`useTimeValue.test.ts`、`inputPresentation.test.ts` | 过 | 15 个文件，112 条 |
| 2 | `NODE_ENV=production` 同一路径 | 过 | 仍是 15 个文件，112 条 |
| 3 | `pnpm --filter @astryx-vue/core typecheck` | 过 | `vue-tsc --noEmit` 退出码 0 |
| 4 | 改过文件 `eslint --max-warnings 0` | 过 | 修完 import 顺序、缩进和 combobox 的 `aria-controls` 后通过 |
| 5 | `node scripts/check-line-limit.mjs` | 过 | 源码单文件不超过 500 行。最长的是 DateInput.vue 449 行、TimeField.vue 445 行 |
| 6 | `node scripts/check-no-important.mjs` | 过 | 没有 `!important` |
| 7 | `node scripts/sync-exports.mjs --check` | 过 | `TimeSurface` 已从 composables 导出 |
| 8 | `pnpm --filter @astryx-vue/cli generate:check` 和 `node scripts/check-i18n-catalog.mjs` | 过 | catalog 245 个组件；i18n catalog 通过 |
| 9 | `env -u NODE_ENV pnpm docs:build` | 过 | 先构建了 `@astryx-vue/core`，文档站渲染完成，约 55 秒 |
| 10 | 文档站整页 | 过 | `/opt/cursor/artifacts/c5/`。桌面 1280 宽侧栏 260px，390 宽顶栏有「菜单」。浅色和深色都截了 calendar、date-input、date-range-input、date-time-input、time-input、timestamp、timer。没有上游同页可对，只发我们这边 |

行为证据：`DateInput.parts.test.ts`、`DateInput.touch.test.ts`、`TimeInput.presentation.test.ts`、`DateTimeInput.sheet.test.ts`，以及文档站的底部面板示例。

## 6. 拿不准的地方

桌面日期时间的日历图标和时钟图标仍用日期输入和时间字段自己的类。底部面板上才有 `astryx-date-time-toggle-icon` 和 `astryx-date-time-clock-icon`。如果主题要同时换桌面那两个图标，现在得选 `.astryx-date-time-input` 里面的原有图标类。

日期时间面板里，只选了日期、时间还空着时，值仍是 `null`，清除按钮要等两边都有值才出现。

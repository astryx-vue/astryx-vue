# B7 工具函数 utils · 执行计划

## 目标

把上游 v0.7.1 里、台账记在 B7 名下的通用纯函数落到 `packages/core/src/utils/`。做完以后，日期、时间、字数、安全地址、分组、输入法、共享尺寸观察这些能力有一份和上游行为一致的实现，并且单元测试能锁住这些行为。日期输入、时间输入、图表、日程表这些组件本轮不改，它们接着用现在的实现，下一节点再接这些函数。

## 工作环境

- 工作区：`/workspace`，分支 `sync/b7-utils`。云端代理的工作目录就是这个仓库。`worktree.mjs new` 会在仓库外面再开一份目录并重装依赖，写文件对不上，所以这一轮用普通分支，不建旁路工作区。
- 动手前先读：
  - `.agents-work/upstream-sync-0.7.1/SWARM.md` 的「对齐上游的标准」「不用 `!important`」「跑检查时的环境」。
  - 台账 `.agents-work/upstream-sync-0.7.1/ledger/B7.md`，26 条。
  - 上游 `v0.7.1` 的 `packages/core/src/utils/`。用 `gh api` 读 facebook/astryx，不依赖用户本机的上游克隆。
- 环境纪律：测试和构建命令前面加 `env -u NODE_ENV`。vitest 一律加 `--maxWorkers=2`。两条 NODE_ENV 都要跑。
- 浏览器：本节点没有界面改动，不开浏览器。

## 上游这条改动让用户看到或感受到了什么

这些函数大多不直接画界面。用户能感受到的，是以后接上它们的组件会按下面的规则工作。本轮先把规则做成可测的函数。

| 上游改动 | 用户看到或感受到的变化 |
| --- | --- |
| `473252320` 紧凑时间 | 输入 `2pm`、`2:30 p.m.`、`1430` 能解析成 24 小时时间，不会把下午解析成上午。 |
| `7646e927e`、`2458b03b3` 日期解析 | 数字日期在 `en-US` 按月/日读，在 `es-ES` 按日/月读。只打了一个数字还不算日期。 |
| `1c071c466` 公元 1–99 年 | 年份 1 到 99 保持原样，不会被当成 1901–1999。 |
| `1cd52d97d` 日期加减 | 1 月 31 日加一个月落到 2 月最后一天，不会冒到 3 月。 |
| `69d734586` 周序号 | 能算出 ISO 周序号，以及当前语言里「周」这个词。 |
| `2fadc27f7` 夏令时空档 | 某天午夜被夏令时跳过时，这一天从空档之后的第一刻开始。重复的钟点取较早的那一次。 |
| `52720e0d8` 纯日期 | 提供不带时分秒的日期记录和周起始计算。指针切换选择器本身留给 C5。 |
| `86a7f1752` 可见字符 | emoji、国旗、带音标的字母各算一个字；截断不会把 emoji 切成半个。 |
| `54be197d0`、`19651c632` 安全地址 | `javascript:`、`vbscript:`、会当页面打开的 `data:text/html`（含协议冒号后的空格）不能当导航地址。 |
| `d55751f88`、`0da2f5b0e` 共享尺寸观察 | 同一个元素上的多个订阅互不影响，退订一个不会让另一个收不到尺寸变化。 |
| `2e0dbb5b9` 事件链和输入 ARIA | 前一个处理函数调用了 `preventDefault`，后面的处理函数仍然会执行。分组输入的读屏名称把分组标签和自己的标签接在一起。 |
| `c1c233522` 展现方式 | `presentation` 优先于旧的 `nativePicker`。粗指针下自适应原生选择器走系统控件，细指针走桌面浮层。 |
| `14781b556` 分组 | 按 `auxiliaryData.group` 分组，组的先后跟第一次出现的顺序走。未分组可以放在最前或最后。 |
| `a7b6045d5` 输入法 | 拼字中的 Enter / Escape 不当成命令。`isComposing`、`keyCode === 229`、`key === 'Process'` 任一成立都算拼字。 |
| `54bb9227b` 苹果平台 | Client Hints 回答不了（空字符串或 `Unknown`）时，再看 `navigator.platform`，不能把「不知道」当成「不是苹果」。 |
| `1232b85af` 样式键 | `variant:secondary` 编成 `[data-variant="secondary"]`，裸状态编成 `[data-checked="checked"]`，不再是不带轴的类名。 |
| `e5e83effd` 焦点环 StyleX | 上游是 StyleX 样式。我们没有 StyleX，侧栏槽位归 C13。 |
| `33a14a205` 触屏按压样式 | 上游只是在 utils 入口导出 StyleX 按压样式。按压模型已在 B3。 |
| `a078d7aaf` 以及 4 条规范文档 | 文档提交不带来可运行的函数。`isRenderable` 在 Vue 里必须看插槽内容，Indicator 已有实现。 |

## 上游依据

- 台账条目：`ledger/B7.md` 全部 26 条。
- 上游源码：`packages/core/src/utils/` 下的 `timeParser.ts`、`dateParser.ts`、`plainDate.ts`、`dateTypes.ts`、`characters.ts`、`safeUrl.ts`、`sharedResizeObserver.ts`、`chainEventHandlers.ts`、`inputAria.ts`、`inputPresentation.ts`、`groupItems.ts`、`ime.ts`、`isApplePlatform.ts`、`parseStyleKey.ts`，以及各自的测试。
- 不搬：`focusOutline.stylex.ts`、`interactionOverlay.stylex.ts`、`color.ts`（不在本台账，F2a 自己移植）、`isRenderable.ts` 的 React 浅检查。

## 有没有更适合 Vue 的做法

| 上游怎么做 | 我们怎么做 | 为什么效果一样 |
| --- | --- | --- |
| React `SyntheticEvent` | `chainEventHandlers` 接受任意带 `preventDefault` 的事件对象 | 调用顺序和对 `preventDefault` 的态度不变 |
| `Locale` 来自上游 i18n 类型 | 参数用 `string`，直接交给 `Intl` | 语言标签怎么传，解析结果一样 |
| `SearchableItem` 来自 Typeahead | `groupItems` 只要求 `auxiliaryData` | 只要 `group` 是字符串，分组结果一样 |
| StyleX 的 `themeDataAttributeName` | `parseStyleKey` 自己把驼峰转成 `data-*` | 选择器字符串和上游一致 |
| 输入法只看两个信号 | 保留 B3 已经在用的第三个信号 `key === 'Process'` | 上游能拦住的拼字键我们也能拦住，老 Safari 的 `Process` 键也不会漏 |
| `isRenderable` 只看一层 ReactNode | 继续用 Indicator 里会看 VNode 的版本 | Vue 的空注释、空白文本、空片段不算有内容；换浅检查会把空插槽当成有内容 |
| 从包入口导出全部 utils | 和现有公开名字撞车的不从总入口再导出 | `DateRange`、`ISOTimeString`、`ParsedTime`、`parseISOTime`、`formatISOTime`、`isTimeInRange`、`isRenderable` 已经有主。`isImeKeyEvent` 按 B6 的约定不能回到包入口 |

## 任务范围

- 要改：
  - 新建 `packages/core/src/utils/` 里上面列出的函数和测试。
  - `utils/index.ts` 只导出不撞名的公开函数。然后跑 `pnpm sync`，让总入口和 `package.json` 的 `./utils` 生成出来。
  - 已有实现改成从 utils 再导出，避免两份逻辑：`Link/safeUrl.ts`、`composables/internal/ime.ts`、`composables/internal/platform.ts`、`composables/countCharacters.ts`。
  - 台账 `ledger/B7.md` 逐条写结论。
- 不碰：
  - DateInput、TimeInput、Calendar、PowerSearch、Chart、Schedule 的组件接入。
  - 主题编译器 `Theme/componentStyles.ts`（B1 已经不用裸类名）。
  - `useTimeValue.ts` 的 `{hours, minutes, seconds}` 形状。TimeInput 继续用它。
  - 图标、`!important`、ROADMAP 里除 `status.mjs` 以外的手改。

## 开发步骤

1. 写本计划和 `verify.md`，把 B7 标成实现中。
2. 放入日期、时间、字符、安全地址、尺寸观察、事件链、ARIA、展现方式、分组、样式键。输入法和平台判断把现有实现挪进 utils，旧路径再导出。
3. 把上游测试改成从 `.js` 路径引入，补展现方式和分组的测试。
4. 跑 `pnpm sync`。
5. 两种 NODE_ENV 下跑本节点测试，再跑 `check:packages`、lint、typecheck、build 里能跑的部分。
6. 台账 26 条全部打勾并写结论。写 `impl-1.md`。

## 自测要求

1. `env -u NODE_ENV pnpm vitest run --maxWorkers=2 packages/core/src/utils packages/core/src/Link/safeUrl.test.ts packages/core/src/composables/internal/inputSignals.test.ts` 通过。
2. `NODE_ENV=production` 下同一条命令通过，用例数相同。
3. `env -u NODE_ENV pnpm check:packages`、`pnpm lint`、`pnpm typecheck`、`pnpm --filter @astryx-vue/core build` 能跑则跑。全量 `pnpm check` 若超时，在回报里写明跑到哪一步。
4. 没有界面，不做视觉对照。
5. 抽查：`parseTimeInput('2:30 p.m.')` 得到 `14:30`；`parseDateInput('3/4/2026', 'es-ES')` 是 3 月 4 日；年份 99 的 `plainDateToDate` 不是 1999；`data: text/html,x` 被 `isSafeUrl` 拒绝；`truncateCharacters` 不切断 emoji。
6. 新写和改到的源码文件不超过 500 行。没有 `!important`。

## 提交与回报

- 提交信息用中文。可以分几次提交。
- 不要手改 ROADMAP 的节点状态，用 `status.mjs set`。
- 回报写到 `.agents-work/upstream-sync-0.7.1/nodes/B7/impl-1.md`。
- 最终回复用中文，150 字以内：PR 链接、测过什么、遗留。

## 验证操作要短小

每次只测一组相关测试。命令前面加 `timeout`。结果落在命令输出里。超时就拆小，不原样重跑整条 `pnpm check`。

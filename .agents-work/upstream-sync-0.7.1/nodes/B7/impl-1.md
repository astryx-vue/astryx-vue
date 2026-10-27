# B7 工具函数 utils · 第 1 轮实现回报

- 工作区：`/workspace`，分支 `sync/b7-utils`。云端仓库里直接切分支，没有用旁路 worktree。
- 提交（基于 `202336f`）：
  - `25a4b86` docs(B7): 写下工具函数的执行计划和验收计划
  - `1496465` feat(B7): 同步 v0.7.1 的通用工具函数

## 1. 做了什么

按台账把上游 v0.7.1 的通用纯函数放进 `packages/core/src/utils/`，并补上测试。`pnpm sync` 生成了包根入口和 `package.json` 的 `./utils`。

已有实现改为从 utils 再导出，避免两套逻辑：`Link/safeUrl.ts`、`composables/internal/ime.ts`、`composables/internal/platform.ts`、`composables/countCharacters.ts`。

| 文件 | 行数 | 职责 |
| --- | --- | --- |
| `packages/core/src/utils/timeParser.ts` | 394 | 解析和格式化时间，含紧凑上下午 |
| `packages/core/src/utils/dateParser.ts` | 215 | 按语言解析用户输入的日期 |
| `packages/core/src/utils/plainDate.ts` | 440 | 不带时分秒的日期运算、周序号、时区瞬间 |
| `packages/core/src/utils/dateTypes.ts` | 57 | 日期类型和星期归一 |
| `packages/core/src/utils/characters.ts` | 72 | 按人眼字符计数、取首字、截断 |
| `packages/core/src/utils/safeUrl.ts` | 79 | 导航地址的协议检查 |
| `packages/core/src/utils/sharedResizeObserver.ts` | 122 | 全库共用一个 ResizeObserver |
| `packages/core/src/utils/groupItems.ts` | 73 | 按 `auxiliaryData.group` 分组 |
| `packages/core/src/utils/inputPresentation.ts` | 128 | 日期和时间选择器的展现策略 |
| `packages/core/src/utils/inputAria.ts` | 49 | 输入框读屏 id 的拼接 |
| `packages/core/src/utils/chainEventHandlers.ts` | 14 | 事件处理函数按顺序都执行 |
| `packages/core/src/utils/parseStyleKey.ts` | 50 | 样式键编成 data 属性选择器 |
| `packages/core/src/utils/ime.ts` | 27 | 输入法拼字键判断 |
| `packages/core/src/utils/isApplePlatform.ts` | 45 | 是不是苹果平台 |
| `packages/core/src/utils/index.ts` | 87 | 对外入口，避开已经占用的名字 |

## 2. 和上游的对照

| 上游改动 | 上游怎么做 | 我们怎么做 | 为什么效果相同 |
| --- | --- | --- | --- |
| 时间解析 | `parseTimeInput` 认 `2pm`、`2:30 p.m.`、`1430` | 照上游 | 同一套规则，测试断言相同 |
| 日期解析 | `Intl` 判断日月谁在前，单独数字不算日期 | 语言参数用 `string`，直接交给 `Intl` | 解析结果不依赖上游的 Locale 类型 |
| 纯日期和夏令时 | `PlainDate` 加 `setFullYear`，空档钟点往前推 | 照上游 | 年份 1–99、闰月夹紧、空档和重复钟点的测试相同 |
| 可见字符 | `Intl.Segmenter`，没有就按码点 | 照上游。`countCharacters` 再导出 `characterCount` | 计数和截断结果相同，C1 不用第二套实现 |
| 安全地址 | 一条规则查字符串和路由对象，拒绝 `data: text/html` | 照上游，Link 再导出 | 通过和拒绝的地址列表相同 |
| 尺寸观察 | 一个元素可以有多个回调，退订只卸自己 | 照上游 | 测试覆盖了互不影响和分发中退订 |
| 事件链 | React `SyntheticEvent` | 任意带 `preventDefault` 的对象 | 调用顺序和对 preventDefault 的态度相同 |
| 展现方式 | `presentation` 压过 `nativePicker` | 照上游 | 粗指针和细指针得到的表面相同 |
| 分组 | `SearchableItem.auxiliaryData.group` | 只要求 `auxiliaryData` | 组的顺序和未分组的位置相同 |
| 样式键 | 依赖 StyleX 的属性名函数 | 自己把驼峰转成 `data-*` | 选择器字符串和上游测试一致 |
| 输入法 | `isComposing` 和 keyCode 229 | 再加 `key === 'Process'` | 上游能拦住的都能拦住，B3 已经在用的第三个信号还在 |
| 苹果平台 | Client Hints 的 Unknown 不算否定 | 照上游，拆出 `readClientHintsPlatform` | 空字符串、Unknown、没有 navigator 的结果相同 |
| 焦点环、按压样式、规范文档、React 版 isRenderable | StyleX 或文档或浅检查 | 不搬 | 见台账里的不适用 |

## 3. 和计划不一样的地方

- 没有建旁路 worktree。云端工作目录就是本仓库，再开一份会重装依赖，而且写文件对不上。
- `parseISOTime`、`formatISOTime`、`isTimeInRange`、`ISOTimeString`、`ParsedTime` 不从 `utils/index.ts` 导出。这些名字已经由 `useTimeValue` 公开，形状是 `{hours, minutes, seconds}`。新实现在 `utils/timeParser.ts`，形状是 `{hour, minute, second}`。TimeInput 继续用旧的，避免这一轮改到 C5。
- `dateTypes.ts` 里的 `DateRange` 不从入口导出。包根上的 `DateRange` 仍是日期范围组件的类型。
- `parseStyleKey` 从 `@astryx-vue/core/utils` 导出，不出现在包根入口。生成器把以 `Key` 结尾的名字当成注入键滤掉了。
- `isImeKeyEvent`、`isApplePlatform` 不放进公开入口。前者是 B6 明确删掉的公共 API。

## 4. 台账处理

一共 26 条。已采纳 19 条，不适用 7 条。

不适用：

- `e5e83effd`：StyleX 焦点环，侧栏槽位归 C13。
- `33a14a205`：StyleX 按压样式，按压模型已在 B3。
- `de42f11b5`、`176dfa624`、`17044ab1e`：上游内部规范文档。
- `a078d7aaf`：Vue 的 `isRenderable` 必须看 VNode，Indicator 里已有。
- `021f14182`：规范文档。钟点消歧已经落在 `plainDateToInstant`。

## 5. 自测结果

| # | 自测项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | `env -u NODE_ENV pnpm vitest run --maxWorkers=2 packages/core/src/utils packages/core/src/TextArea/TextArea.test.ts packages/core/src/Link/safeUrl.test.ts packages/core/src/composables/internal/inputSignals.test.ts` | 过 | 17 个文件，338 条 |
| 2 | `NODE_ENV=production` 下同一条命令 | 过 | 17 个文件，338 条 |
| 3 | `env -u NODE_ENV pnpm check:packages` | 过 | 边界、sync、行数、`!important`、文案目录都通过 |
| 4 | `env -u NODE_ENV pnpm lint` | 过 | 退出码 0 |
| 5 | `env -u NODE_ENV pnpm typecheck` | 过 | core、cli、docs 都通过 |
| 6 | `env -u NODE_ENV pnpm --filter @astryx-vue/core build` | 过 | 约 12.5 秒，退出码 0 |
| 7 | 视觉对照 | 不适用 | 没有界面改动 |
| 8 | 全量 `pnpm check` 和文档站构建 | 未跑 | 本节点没有文档页。全量 vitest 没有跑 |

## 6. 拿不准的地方

- TimeInput、DateInput、Calendar 还没有改用这批函数。`useTimeValue` 的字段名和这里不一样，C5 接入时要单独对一下。
- PowerSearch 浏览结果把未分组放在最前。`groupItems(..., { ungroupedFirst: true })` 能对上，这一轮没有改 PowerSearch。
- `parseStyleKey` 没有接进 B1 的主题编译器。主题那边已经同时输出 data 属性和带组件前缀的修饰类，不是裸类名。

## 交给后续节点

- C5：日期和时间组件改用 `plainDate`、`dateParser`、`timeParser`、`inputPresentation`。包根上不要再导出一份同名的 `parseISOTime`。
- C4：PowerSearch 分组可以换成 `groupItems`，未分组要用 `ungroupedFirst: true`。
- C13：TabList 可以换成 `observeResize`。
- B3 留下的 `useClickableContainer`：`isSafeUrl` 现在从 `utils/safeUrl.ts` 和 `@astryx-vue/core/utils` 都能拿到。

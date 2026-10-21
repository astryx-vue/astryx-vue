# B5 文案与图标 · 第 1 轮实现回报

第 2 轮：只改正回报，代码与第 1 轮相同。

第 3 轮：只补全第 8 节清单，代码与第 1 轮相同。

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/B5`，分支 `sync/b5-i18n-icons`。只在本地提交，没有推送。
- 提交（基于 `22fd14b`）：
  - `21a22d6` feat(i18n): locales 跟到原版最新，修 ICU 撇号，语言标签保留地区，日历表头覆盖全部语言
  - `9054fc2` feat(i18n): 补齐原版 v0.7.1 新增和改动的词条，upstreamMap 按组件家族拆分
  - `797ed9f` feat: i18n 目录检查接进 check，图标注册表要求 upload 并支持组件自有键
- locales 新拉取的上游提交号：**`25548b9e71d4243c5e3d922af22deb935bf68e5d`**（原版 main 最新，原来是 `fbc03f7b`）。30 个 JSON 文件内容和上次逐字相同，只有 `SOURCE.json` 的提交号变了。

## 1. 做了什么

### 1.1 盘点
- 台账 72 条逐条读过上游 diff。本节点只做翻译这一侧：词条、映射、机制、检查脚本、图标注册表。组件里把文字换成 `t()` 的工作都列进第 7 节的「交给 Cx」清单。
- 原版 `en.json`：0.4.1 有 263 个键，v0.7.1 有 411 个，main 最新有 522 个。三者之间没有删掉的键。只有一个键的英文变了：`dateTimeInput.dialogLabel` 从 "Choose date" 改成 "Choose date and time"。

### 1.2 拉取 locales
- 运行 `node scripts/vendor-astryx-locales.mjs`（不带参数，走了代理），结果见上面的提交号。

### 1.3 词条
- 新增 16 个文案文件：`alert-dialog`、`avatar-group`、`banner`、`breadcrumbs`、`button`、`code-block`、`context-menu`、`dialog`、`field`、`more-menu`、`popover`、`spinner`、`switch`、`text-area`、`text-input`、`toast`。
- 已有的 19 个文件补了新字段。每个字段都同时写了 `en` 和 `zh-CN`。
- **内置英文现在和原版 `en.json` 逐字一致**，`check:i18n-catalog` 会守着这一点。原来有 29 处不一致，例如 "Previous" 对 "Go to previous page"、"Sidebar" 对 "Side navigation"、"No matches" 对 "No options"、"Read-only" 对 "Read only"、"equals" 对 "is"、"Completed" 对 "completed"。计数都补上了千分位（`1,234`）。
- 有些字段我们组件的用法和上游不同，就保留旧字段，另加一个新字段专门接上游的键，交给 C 节点切换：
  - `pagination.previous` / `next` 是按钮上看得见的短文字，`previousPage` / `nextPage` 是无障碍名。
  - `markdown.headingLink` 是我们的 `#` 锚点名，`headingLinkCopy` 是上游复制按钮的名字。
- 中文按「自然、不机翻」写。和原版 `zh-CN.json` 不一样的地方是有意的，例如「转到第 2 步：付款」对原版「转到步骤 2：付款」，「快捷日期范围」对「预设日期范围」。
- `upstreamMap.ts` 原来是 329 行，再加 90 多个键就会超过 500 行。我把它拆到 `locale/upstream/` 下，按家族分成 `forms`、`dates`、`navigation`、`overlays`、`data`、`search`、`chat` 七个文件。`upstreamMap.ts` 只负责合并，同一个键写了两次会直接报错。现在共接入 **333 个原版键**，原来是 238 个，新增 95 个，没有删除。

### 1.4 机制
- **修了 ICU 解析器的一个 bug**：原来遇到任何撇号都会开始引用，于是南非语 `Kies 'n datum`、英文 `{name}'s comment` 里的撇号被吞掉，后面的文字也解析错。现在和 intl-messageformat 一样，只在撇号后面紧跟 `{ } < >`（复数里还有 `#`）时才开始引用。
- **语言标签保留地区**：原来 `normalizeLocale` 会把所有 `en-*` 都收成 `en`，所以 `en-GB` 用户看到的是美式日期和排序。原版 `useLocale` 原样返回 provider 给的标签，现在我们也一样：`en-GB` 就返回 `en-GB`。内置文案只分简体中文和其他两种，提取成 `builtInMessages()` 共用，`catalog.ts` 里重复的那一份删掉了。`ChatMessageMetadata` 原来用 `locale === 'en'` 判断要不要转小写，改成只看语言部分，不然 `en-GB` 会判断错。
- **日历表头**：新建 `locale/weekdays.ts`，放原版 CLDR 48.2.0 的 31 个语言的独立短星期名。查找顺序是完整标签、基础语言、英文，和原版一致。原来只有 en 和 zh-CN 有这份数据，其他语言用的是 Intl 的 `short`，例如法语显示成「dim.」，原版是「di」。
- 新增 `icuArgumentKinds()`，给每个占位符算出它的写法（`argument`、`number`、`plural`、`select`），检查脚本靠它比较占位符。
- provider 的语言对所有组件生效、`useLocale` / `useCollator` / `useTranslator` 这几个 hook，原来就基于 provider，这次没有再改。

### 1.5 图标
- 新增公开类型 `IconRegistry = Readonly<Record<IconName, string>>`，`defaultSemanticIcons` 用 `satisfies IconRegistry` 守着，完整注册表缺了 `upload` 就编译不过。
- 新增公开类型 `NamespacedIconName = \`${string}:${string}\``，`ExtendedIconName` 把它也包进去。组件自有的图标用 `owner:role` 这样的键，主题用同一个 `defineTheme({ icons })` 覆盖。
- `ICON_GLYPHS` 加了 `numberInput:stepperDown`，`icon.css` 加了对应的内置字形，SVG 路径照抄原版。
- 测试 `Icon/registry-contract.test.ts` 检查了这几件事：缺 `upload` 编译不过；`upload` 和 `arrowUp` 是两个不同的图形；主题只换 `upload` 时 `arrowUp` 不受影响；命名空间键能画出内置字形，主题也能覆盖它。

### 1.6 检查脚本
- `scripts/check-i18n-catalog.mjs` 是入口，判定逻辑都是纯函数，放在 `scripts/i18n-catalog/checks.mjs`；「暂不接入」的命名空间清单放在 `coverage.mjs`；`ts-hooks.mjs` 用 Node 自带的 `registerHooks` 加类型擦除直接加载 core 的 TS 源码，不需要新依赖，Node 22.18 可用。
- 它在 `package.json` 里注册成 `check:i18n-catalog`，并接在 `check:packages` 的末尾。一共查 7 件事：
  1. en 和 zh-CN 字段一样，形状一样，不为空。
  2. 映射里的键都在 en.json 里，字段都存在，`args` 正好是原文的占位符。
  3. 内置 en 和 zh-CN 用上了每个占位符，结果里没有残留的 `{x}`。
  4. 内置英文和原版英文逐字一致，用 1、3、1234 三个值各比一次。
  5. 29 种语言的每句译文都能解析，占位符的名字和写法和英文一致，没有过期的键。
  6. en.json 的每个键要么已经接入，要么在 coverage 清单里写了理由。
  7. 源码里 `t('@astryx.…')` 用到的键都在映射里。
- 测试：`tests/check-i18n-catalog.test.ts`，15 条，每类检查都有正例和反例，另有一条在真实仓库上跑一遍。

### 1.7 文档
- `guide/i18n.md`（中英两版）：
  - 更新了标签归一化的规则。
  - 新增「在组件之外读语言和翻译」一节，讲 `useLocale` 和 `useTranslator`。
  - vendor 的说明改成「默认跟原版 main」。
  - 新增 check 的说明。
  - 改正了原来那句「内置英文和原版用词不同」，现在是逐字一致。
- `use-locale/index.md`（中英两版）：更新了标签说明。
- `icon/props.md`（中英两版）：新增「共享名字和完整注册表（必须有 upload）」和「组件自有键」两节。
- CLI 的 `catalog.json` 用 `pnpm --filter @astryx-vue/cli generate` 重新生成了，因为文档变了。

### 1.8 行数

| 文件 | 行数 | 职责 |
| --- | --- | --- |
| packages/core/src/locale/icu.ts | 353 | ICU 解析和格式化，新增 `icuArgumentKinds` |
| packages/core/src/locale/upstreamMap.ts | 41 | 合并 `upstream/*` |
| packages/core/src/locale/upstream/forms.ts | 101 | 输入框、选择器家族的映射 |
| packages/core/src/locale/upstream/navigation.ts | 87 | 导航、分页、菜单、Stepper 的映射 |
| packages/core/src/locale/upstream/dates.ts | 67 | 日期家族的映射 |
| packages/core/src/locale/upstream/search.ts | 92 | PowerSearch 和 CommandPalette 的映射 |
| packages/core/src/locale/upstream/data.ts / overlays.ts / chat.ts / types.ts | 46 / 42 / 37 / 13 | 表格、浮层、Chat 的映射和类型 |
| packages/core/src/locale/weekdays.ts | 42 | CLDR 短星期名 |
| packages/core/src/locale/messages/power-search.ts | 208 | 最大的文案文件 |
| scripts/i18n-catalog/checks.mjs | 315 | 检查的判定逻辑 |
| scripts/check-i18n-catalog.mjs | 113 | 检查入口 |

所有源码文件都在 500 行以内，`check-line-limit` 通过。

## 2. 和上游的对照

| 上游改动 | 上游怎么做 | 我们怎么做 | 为什么效果相同 |
| --- | --- | --- | --- |
| #5194 locale hooks | `useLocale()` 读 React context | `useLocale()` 返回 `{ locale: ComputedRef }`，读 inject | 拿到的是同一个 provider 标签，provider 换语言时跟着变 |
| #5195 provider 语言全局生效 | 每个组件改成读 `useLocale()` | 组件原来就读 `useAstryxLocale()`，这次补上了 `en-*` 不再被折叠 | `en-GB` 的日期和排序和原版一致 |
| #4696 查找表 / #6697 精简目录 / #6706 热更新 | 预先合并目录，构建期生成精简目录 | provider 里用 computed 合成一次文案树；目录同时接受完整写法和纯字符串写法；Vite 原生支持 JSON 热更新 | 同一个键在每种语言下显示的文字一样，用户的写法也一样 |
| #4925 / #5188 目录检查 | formatjs 解析器 + TS AST 找 `t()` 调用 | 复用运行时的 ICU 解析器；`t()` 调用用正则找；另外加了内置文案和映射的检查 | 拦下的问题一样（占位符契约、过期的键、找不到的键），还多查了我们自己的映射 |
| #5190 CLDR 星期名 | 脚本从 cldr-dates-full 生成 | 照抄它生成的数据 | 数据相同；以后更新时照抄就行，不用加 cldr 依赖 |
| #7329 / #6971 upload | `IconRegistry = Record<IconName, ReactNode>` | `IconRegistry = Record<IconName, string>`（值是 Iconify id） | 完整注册表缺 upload 都编译不过 |
| #5466 命名空间键 | `defaultIcons['numberInput:stepperDown']` | `ICON_GLYPHS` 加了这个键，配内置字形，主题用 `icons` 覆盖 | 不覆盖时都画内置箭头，覆盖时两边写法一样 |
| ICU 撇号 | intl-messageformat 的规则 | 照它的规则修了 | 带撇号的译文显示一样 |

## 3. 和计划不一样的地方

1. **`upstreamMap.ts` 拆成了目录**。不拆就会超过 500 行。对外导出没变，sync 只扫 `locale/messages`，所以不受影响。
2. **改了 `normalizeLocale`**。计划里没写，但它是用户能感受到的差别（`en-GB` 被当成美式英文），按计划「发现差别就修正」的要求修了。`useAstryxLocale` 的返回值现在可能是 `en-GB`，组件里用 `=== 'en'` 判断的只有 ChatMessageMetadata 一处，已经修好。
3. **改了 `Step.vue` 两行**。`stepper.goToStep` 的签名必须加上 `label`，才能对上原版的 `{stepNumber}: {label}`，不改就编译不过。这属于计划允许的「签名改动导致编译失败时做最小修复」。附带的效果：可点步骤的无障碍名现在带上了步骤标签，例如 "Go to step 2: Payment"，和原版一致。
4. **改了 6 个组件测试的期望文字**：Calendar、DateInput、FileInput、SideNav、Typeahead、MobileNav。原因是内置英文对齐了原版，这些测试检查的正是那几句文字。组件代码没动。
5. **`ComponentIconSlotMap` / `componentIcons`（AST-032 的 FR2，send 插槽）没有做**。v0.7.1 和 main 的代码里都还没有它，只写在文档里，上游的 ChatSendButton 也还是直接读 `arrowUp`。我们的 ChatSendButton 已经有 `sendIcon` 插槽。等上游真正实现了，再交给 C10。
6. **i18n 检查没有沿用上游的「复数分支可达性」检查**。运行时用 `Intl.PluralRules` 选分支，到不了的分支永远不会被选中，用户看不出差别。
7. **两种 NODE_ENV 下都跑了全量测试**，比计划要求的范围大。

## 4. 台账处理

72 条全部改成 `- [x]` 并写了结论。已采纳 54 条（其中「词条侧已采纳、组件侧交给 Cx」的占大多数），不适用 18 条。

不适用的条目和理由：
- `bc3423808`、`1e823c153`、`e3259c946`、`6040af6c8`：listInput / transferList 属于 lab，由 F3a 接入。
- `2247368d3`：chart 属于 charts 包，由 F2b 接入。
- `11a80dd00`：richTextEditor 属于 richtext 包，由 F1b 接入。
- `f22695aab`：默认图标尺寸已经由 `provideIconSize` 实现。
- `4ec26d757`：按浮层隔离 context 属于 layer 运行时，交给 B4。
- `8359f1a36`：预建查找表，computed 已经达到同样的效果。
- `14d078e19`、`71f8be3fe`：精简目录和热更新，见第 2 节。
- `630cf2725`、`176dfa624`、`4a66200ef`、`17044ab1e`、`8bf4b5136`、`7d4628128`、`a8d6bf291`：只改了上游的 spec 或文档元数据。

`node scripts/upstream-ledger.mjs --check` 显示「台账是最新的」。

## 5. 新增和删除的 key

- **删除**：0 个。原版这段时间没有删键。`commandPalette.noResultsFor` 被原版标成「组件不再读」，但键还留着，我们的映射也保留。
- **这次新接入映射的原版键**（95 个，按家族列）：
  - pagination：previousBy、nextBy、first、last、goToPage、goToPageInput、pageLabel、ofTotalPages、pageIndicators（itemsPerPage、previous、next 原来就映射了，这次改成同时填两个字段）
  - 浮层与反馈：alertDialog.cancel、dialog.close、popover.close、toast.dismiss、toast.viewport、banner.dismiss / dismissTitled / collapse / expand、spinner.loading、switch.loading（button.loading 原来就映射了，这次多填一个 button.loading 字段）
  - 导航：avatarGroup.label / keyboardHint、breadcrumbs.label、contextMenu.label、moreMenu.label、dropdownMenu.label、link.newTab、sideNav.resizeSidebar、sideNav.heading.dialogLabel、topNav.heading.openMenu、topNav.heading.dialogLabel、keyboardHint.toNavigate、step.goToStep、step.goToStepWithStatus
  - 输入：field.optional / required、textInput.clearLabel、textArea.charactersRemaining / charactersOverLimit、numberInput.clearLabel / invalidNumber、fileInput.clearLabel / dropHint / triggerWithFiles、checkboxList.item.checkbox
  - 选择器：selector.searchOptions、multiSelector.searchOptions / selectAllPartiallySelected / selectionCleared / allSelected / selectionCount、typeahead.resultCount
  - 日历和日期：calendar.daySelected / dayInRange、dateRangeInput.presetDateRanges、dateInput.toggleCalendarClose / resetPicking / savePicking / doneChoosingMonth / chooseMonthYear / monthWheel / yearWheel、dateTimeInput 的 placeholder / timePlaceholder / dialogLabel / timeSuffix / timeOptionsLabel / pickerMode / openTimePicker / saveDatePicking 和 7 个滚轮相关的键、timeInput.invalidTime / openPicker
  - 表格：table.sort.sortedBy / sortedByWithPriority、tableFiltering.filterByColumn、tableTree 的 4 个键
  - 其他：markdownHeadingLinks.copied、markdown.table、codeBlock 的 3 个键、powersearch.editor.groupOperator、chatTypingIndicator.many / others、chatToolCalls.status.complete / error
- **暂不接入的原版键**（189 个，清单在 `scripts/i18n-catalog/coverage.mjs`）：
  - richTextEditor 29 个，交给 F1b
  - chart 3 个、chartLegend 1 个，交给 F2b
  - listInput 16 个、transferList 26 个、transferListSelector 3 个，交给 F3a
  - diffViewer 19 个，交给 F3h
  - emojiPicker 16 个，交给 F3e
  - comments 65 个、commentComposer 11 个：这是 lab 里的 Comments，ROADMAP 里还没有对应节点，见第 6 节。

## 6. 自测结果

| # | 自测项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | `env -u NODE_ENV pnpm vitest run --maxWorkers=2 packages/core/src/locale packages/core/src/Icon tests/check-i18n-catalog.test.ts` | 过 | 10 个文件、85 条用例 |
| 1 | `NODE_ENV=production` 跑同一条命令 | 过 | 10 个文件、85 条用例，数量相同 |
| 1 | 全量 `vitest run --maxWorkers=2`，两种 NODE_ENV 各跑一遍 | 过 | 都是 234 个文件、3135 条用例 |
| 2 | 临时删掉 zh-CN 的 `spinner.loading` | 检查失败（退出码 1） | 「spinner.loading：zh-CN 缺这个字段」，之后已还原 |
| 2 | 临时让 zh-CN `selector.resultCount` 不用占位符 | 检查失败 | 「没有用上占位符 count」，之后已还原 |
| 2 | 临时把 fr-FR.json 里的 `{label}` 改成 `{name}` | 检查失败 | 「占位符是 name:argument，英文原文是 label:argument」，之后已还原 |
| 2 | 临时把映射的 args 写错 | 检查失败 | 4 条报错，之后已还原；`git status` 干净 |
| 3 | SSR 冒烟 `ssr-smoke.test.ts` | 过 | 212 条 |
| 4 | `env -u NODE_ENV pnpm check`（test 一步换成 vitest --maxWorkers=2），分步跑 | 过 | check:packages 0、lint 0、typecheck 0、vitest 0、build 0、lint:pkg 0 |
| 5 | 浏览器：中文文档站 5173 端口（经 browser-lock，用 browser-2，只开 1 个 Chromium，跑完已关） | 部分中文，见下 | `/tmp/B5-browser/report.json`、`report-2.json`、`*-zh.png` |
| 6 | 新写和改动的源码文件 ≤ 500 行 | 过 | check-line-limit 通过 |

第 5 项的当前状态。这些组件还没有接上 `t()` 或词条，写在这里供 C 节点参考：
- **Spinner**：默认的读屏名是「Loading」，写死在 `Spinner.vue:22`。词条 `spinner.loading` 已经备好，交给 C15。
- **Switch**：忙碌时播报「Loading」，写死在 `Switch.vue:17` 的 `loadingLabel` 默认值。词条 `switch.loading` 已经备好，交给 C2。我用组件测试确认了：在 zh-CN provider 下，播报区仍然是英文。
- **NumberInput**：步进按钮已经是中文（「增加Quantity」，Quantity 是示例写的英文标签）；清除按钮是「Clear Progress」，写死在 `NumberInput.vue:364`；输入无效时没有任何播报。词条 `numberInput.clear`、`invalidNumber` 已经备好，交给 C1。
- **Calendar**：Calendar 文档页的示例都写了 `provideAstryxLocale('en')`，所以页面上是英文，这是示例故意锁的，不是组件的问题。我在 DateRangeInput 页面的中文 provider 下看了同一个日历：导航按钮显示「上个月」「下个月」，弹层名是「选择日期范围」。组件测试里，zh-CN 下的表头是「周日」到「周六」，都是中文。
- **文档示例**：有 36 个示例写死了 `provideAstryxLocale('en')`，涉及 calendar、date-input、table、typeahead 等 20 个组件页。这些页面在中文文档里也显示英文。这不在 B5 范围内，交给 D 节点或各 C 节点决定要不要放开。

## 7. 「交给 Cx」清单

格式是：组件，现在写死的文字或用的旧字段，换成哪个字段，对应哪个原版键。这些字段都已经在 `useAstryxMessages()` 里，`t('@astryx.…')` 也能取到。

### C1 基础输入
- **TextInput**：`TextInput.vue:23` 的 `loadingLabel: 'Loading'` 改成 `messages.button.loading`（`@astryx.button.loading`）。`:145` 的 `` `Clear ${label}` `` 改成 `messages.textInput.clear(label)`（`@astryx.textInput.clearLabel`）。
- **TextArea**：`loadingLabel` 同上。字数提示播报用 `textArea.charactersRemaining(count)` 和 `charactersOverLimit(count)`（`@astryx.textArea.*`）。
- **NumberInput**：
  - `:364` 的 `` `Clear ${label}` `` 改成 `numberInput.clear(label)`（`@astryx.numberInput.clearLabel`）。
  - 输入无效时在 assertive 播报区念 `numberInput.invalidNumber`（`@astryx.numberInput.invalidNumber`）。
  - 步进按钮改用 `<Icon icon="numberInput:stepperDown" size="xsm" />`，加号那一格把它翻过来。
- **FileInput**：
  - 清除按钮的无障碍名改用 `fileInput.clearField(label)`（`@astryx.fileInput.clearLabel`），提示文字保持 `fileInput.clear`。
  - 拖进来时显示 `fileInput.dropHint`。
  - 有文件时触发按钮的名字用 `fileInput.triggerWithFiles(label, names)`。
  - upload 图标已经是对的。
- **Field / FieldLabel**：`FieldLabel.vue:11-12` 的 `'Optional'` / `'Required'` 改成 `field.optional` / `field.required`（`@astryx.field.*`）。
- **InputClearButton**：提示文字说「Clear」（`fileInput.clear` 对应 `@astryx.inputClearButton.tooltip`），无障碍名保留字段名，用上面的 `*.clear(label)`。
- **announce 播报**（#4920）：输入类组件的播报都改成走词条。

### C2 勾选与开关
- **Switch**：`Switch.vue:17` 的 `loadingLabel: 'Loading'` 改成 `switch.loading`（`@astryx.switch.loading`）。播报区要一直挂着，按原版 #6114。
- **CheckboxInput**：`CheckboxInput.vue:17` 的 `loadingLabel: 'Loading'` 改成 `button.loading`。
- **CheckboxListItem**：富文本标签藏在里面的词用 `checkboxList.checkbox`（`@astryx.checkboxList.item.checkbox`）。

### C3 选择器家族
- **Selector / MultiSelector**：
  - 搜索框的无障碍名用 `selector.searchOptions` / `multiSelector.searchOptions`。
  - 清除按钮改用 `textInput.clear(label)`，原版这里用的是 `@astryx.textInput.clearLabel`。
- **MultiSelector**：
  - 只选了一部分时，「全选」那一行的名字用 `multiSelector.selectAllPartial(label)`。
  - 播报用 `multiSelector.selectionCleared`、`allSelected`、`selectionCount(count, total)`。
- **Typeahead / BaseTypeahead**：搜索返回后播报 `typeahead.resultCount(count)`。`typeahead.clear` 现在是 "Clear selection"（原来是 "Clear"），`typeahead.loading` 现在是 "Loading"（原来是 "Loading results"），文字已经自动变了。
- **Tokenizer**：`tokenizer.loading` 现在是 "Loading"，已经自动生效。

### C4 PowerSearch / CommandPalette
- **PowerSearchEditPopover**：组内 AND / OR 切换按钮的名字用 `powerSearch.editor.groupOperator`。
- **PowerSearch**：`equals` / `notEquals` 的英文已经变成 "is" / "is not"，和原版一致，确认显示正常。`PowerSearch/dates.ts` 写死了 `'en-US'` 去拆日期，这样不影响显示；只有显示给用户看的格式化才需要换成 `useLocale()`，按原版 #5195。

### C5 日期时间家族
- **Calendar**：单选模式下选中的那天用 `calendar.daySelected(date)`；区间中间的日子用 `calendar.dayInRange(date)`。
- **DateInput / DateRangeInput / DateTimeInput**：日历已经打开时，切换按钮的名字用 `dateInput.toggleCalendarClose`（中文是「收起日历」，和弹层里的「关闭日历」区分开）。
- **DateRangeInput**：快捷区间那一列用 `dateRangeInput.presetDateRanges` 当名字；必填标记用 `field.required`。
- **DateTimeInput**：
  - 用 `dateTimeInput.placeholder`、`timePlaceholder`、`dialogLabel`、`timeSuffix(label)`、`timeOptionsLabel(label)`、`openTimePicker(label)`。
  - 时间解析失败时播报 `timeInput.invalidTime`；日期解析失败时播报 `dateInput.invalidDate`（英文已经变成 "Invalid date"）。
- **TimeInput**：时钟按钮的名字用 `timeInput.openPicker(label)`；解析失败时播报 `timeInput.invalidTime`。
- **触屏选择器**（#5243 破坏性改动、#5582、#5502）：用 `dateInput.resetPicking` / `savePicking` / `doneChoosingMonth` / `chooseMonthYear(monthYear)` / `monthWheel` / `yearWheel`，以及 `dateTimeInput.pickerMode` / `saveDatePicking` / `hourWheel` / `minuteWheel` / `secondWheel` / `meridiemWheel` / `meridiemAM` / `meridiemPM`。
- 计数播报已经带千分位。

### C6 菜单家族
- **DropdownMenu**：`DropdownMenu.vue:25` 和 `:80` 写死的 `'Menu'` 改成 `dropdownMenu.label`。
- **ContextMenu**：`ContextMenu.vue:21` 的 `label: 'Context menu'` 改成 `contextMenu.label`（中文「快捷菜单」）。
- **MoreMenu**：`MoreMenu.vue:17` 的 `label: 'More options'` 改成 `moreMenu.label`。
- **BreadcrumbItem**：`BreadcrumbItem.vue:67` 写死的 `'Menu'` 改成 `dropdownMenu.label`。

### C7 浮层家族
- **AlertDialog**：`AlertDialog.vue:20` 的 `cancelLabel: 'Cancel'` 改成 `alertDialog.cancel`。
- **DialogHeader**：`DialogHeader.vue:12` 的 `closeButtonLabel: 'Close'` 改成 `dialog.close`。
- **Popover**：`Popover.vue:22` 的 `closeButtonLabel: 'Close'` 改成 `popover.close`（"Close popover"）。
- **Toast**：`Toast.vue:168` 的 `aria-label="Close"` 改成 `toast.dismiss`（"Dismiss notification"）；通知区域的名字用 `toast.viewport`。
- **Lightbox**：`imagePosition` / `mediaPosition` 已经带千分位，不用改。

### C9 Markdown 与代码
- **Markdown 标题链接**（#6915）：做成复制按钮后，名字用 `markdown.headingLinkCopy(heading)`，复制成功后显示并播报 `markdown.headingLinkCopied`。原来的 `markdown.headingLink` 只给 `#` 锚点用。
- **Markdown 表格**：名字用 `markdown.table`。
- **CodeBlock**：`CodeBlock.vue:18-22` 的 `'Code'` / `'Copied'` / `'Copy code'` 改成 `codeBlock.code` / `copied` / `copyCode`。

### C10 Chat
- **ChatTypingIndicator**（#6220）：一个人时用 `chat.typingOne(name)`。两个人时用 `Intl.ListFormat(locale, { type: 'conjunction' })` 把名字连起来，交给 `chat.typingNames(names)`。三个人及以上时，把 `[names[0], chat.typingOthers(count)]` 连起来，再交给 `typingNames`。旧的 `typingTwo` / `typingMany` 接完就可以删掉。
- **ChatStatusMark / ChatToolCalls**（#5666）：成功用 `chat.toolComplete`，失败且没有详情用 `chat.toolFailed`。现在失败借的是 `chat.statusFailed`，成功借的是 `chat.statusSent`。
- **ChatSendButton**：不用改。上游的 send 插槽（AST-032 FR2）在 v0.7.1 还没有代码。

### C11 Table
- **排序表头**：
  - 已经排了序的列用 `table.sortedBy(label, direction)`；多列排序时用 `table.sortedByWithPriority(label, direction, rank, total)`。`direction` 取 `table.sortedAscending` / `sortedDescending`，现在是小写的 "ascending" / "descending"，专门填进这两句话里。
  - 现在 `sortable.ts:78` 是自己拼的 `` `${sortBy}. ${action}` ``。
- **列筛选**：控件的名字、占位文字和无障碍名都用 `table.filterByColumn(header)`。
- **树形数据**：`TableTreeCell.vue:41` 现在借用的是 rowExpansion 的字段，改成 `table.treeExpandRow` / `treeCollapseRow` / `treeExpandAllRows` / `treeCollapseAllRows`（`@astryx.tableTree.*`）。
- **排序**：`columnUtils.ts:199` 的 `localeCompare` 改成 `useCollator()`，按原版 #5195。

### C13 导航家族
- **Pagination**：
  现在的读屏名和原版不同：我们是 "Previous" / "Page 3" / "Pagination"，原版是 "Go to previous page" / "Go to page 3" / "Page indicators"。组件还在读旧字段，这条要做完下面几处才会变。
  - 上一页 / 下一页按钮的 `aria-label` 改用 `pagination.previousPage` / `nextPage`；跳多页时用 `previousPages(step)` / `nextPages(step)`。
  - 看得见的短文字是继续保留 `previous` / `next` / `previousBy` / `nextBy`，还是像原版那样只留图标，由 C13 决定。
  - 每页条数选择器的无障碍名用 `pagination.itemsPerPage`。
  - 页码按钮用 `pagination.goToPageNumber(page)`，现在用的是 `page(page)`，读出来是「Page 3」，原版是「Go to page 3」。
  - dots 变体那一组的名字用 `pagination.pageIndicators`，现在用的是 `pagination.nav`。
- **SideNav / TopNav 标题**：TopNav 的「⋯」按钮用 `nav.topNavOpenMenu`；标题下拉弹层的名字，SideNav 用 `nav.headingDialog`，TopNav 用 `nav.topNavHeadingDialog`。
- **MobileNavToggle**：`MobileNavToggle.vue:12` 现在打开时显示 `nav.close`（"Close navigation"），关上时显示 `nav.openMenu`。原版这个按钮只有一个名字 `nav.openNavigation`（`@astryx.mobileNav.toggle.open`），状态靠 `aria-expanded` 表达。
- **Breadcrumbs**：`Breadcrumbs.vue:11` 的 `label: 'Breadcrumb'` 改成 `breadcrumbs.label`。
- **SideNav**：`nav.sideNav` 现在是 "Side navigation"（原来是 "Sidebar"），已经自动生效。

### C15 反馈与状态
- **Spinner**：`Spinner.vue:22` 的 `'Loading'` 改成 `spinner.loading`（`@astryx.spinner.loading`，中文「加载中」）。
- **Banner**（#5113）：
  - 关闭按钮的提示文字用 `banner.dismiss`，无障碍名用 `banner.dismissTitled(banner.dismiss, title)`，现在 `Banner.vue:81` 写死的是 `` `Dismiss ${title}` ``。
  - 展开 / 折叠按钮用 `banner.expand` / `banner.collapse`，现在默认值是 `'Expand details'` / `'Collapse details'`，见 `Banner.vue:10`。
- **Stepper**：`goToStep` 已经带上了步骤标签，这次 `Step.vue` 已经改好，C15 核对一下就行。

### C16 基础展示与动作
- **Button**：`Button.vue:26` 的 `loadingLabel: 'Loading'` 改成 `button.loading`（`@astryx.button.loading`）。
- **AvatarGroup**：整组的名字用 `avatarGroup.label`；有可交互的头像时，读屏提示用 `avatarGroup.keyboardHint`。
- **Link**：已经在用 `nav.opensInNewTab`（`@astryx.link.newTab`），不用改。

### D2 主题
- 每套主题如果自己写了 `icons`，要给 `upload` 单独配一个上传图形，不能拿 `arrowUp` 顶替，见 AST-032 FR6。我们的 7 套主题目前都没写 `icons`，用的是默认的 `lucide:upload`，不受影响。CLI 主题模板如果以后加上 `icons`，同样要遵守这条。

## 8. 拿不准的地方

1. **英文从此和原版逐字一致**。这次是一个组件一个组件核对的：先看它的英文在 `messages/` 里有没有真的改，再看组件是不是真的读了这个字段。**现在就真的变了**的是下面这些：
   - **SideNav**：区域名从 "Sidebar" 变成 "Side navigation"（`nav.sideNav`，`SideNav.vue:76`）。
   - **AppShell**：手机端的那条导航区域和手机抽屉的名字从 "Navigation" 变成 "Mobile navigation"（`layout.mobileNavigation`，`AppShell.vue:157`、`:191`）。
   - **MobileNav**：抽屉里的关闭按钮从 "Close" 变成 "Close navigation"（`nav.close`，`MobileNav.vue:131`）。同一个字段还被 `MobileNavToggle.vue:12` 读：手机导航开关在打开状态下显示的名字，也从 "Close" 变成了 "Close navigation"。
   - **Selector**：没有选项时从 "No matches" 变成 "No options"（`selector.empty`，`Selector.vue:61`）；只读时从 "Read-only" 变成 "Read only"（`selector.readOnly`，`Selector.vue:433`）。
   - **MultiSelector**：没有选项时的 "No matches" 变成 "No options"（`multiSelector.empty`，`MultiSelector.vue:99`）；只读时从 "Read-only" 变成 "Read only"（`multiSelector.readOnly`，`MultiSelector.vue:584`）。
   - **PowerSearch**：数字字段的等于号从 "equals" / "does not equal" 变成 "is" / "is not"（`powerSearch.operators.equals` / `notEquals`，值在 `power-search.ts:82-83`，组件在 `operators.ts:49` 读它）。
   - **Typeahead**：清除按钮从 "Clear" 变成 "Clear selection"，加载中从 "Loading results" 变成 "Loading"（`typeahead.clear` / `typeahead.loading`，`BaseTypeahead.vue:53`、`:326`、`:369`）。
   - **Tokenizer**：加载中从 "Loading results" 变成 "Loading"（`tokenizer.loading`，`Tokenizer.vue:450`）。
   - **FileInput**：三条报错都变了，类型不对变成 `"xxx" is not an accepted file type`，超过大小变成 `"xxx" exceeds 2 MB limit`，超过数量变成 `Maximum 5 files allowed`（`fileInput.errorType` / `errorSize` / `errorCount`，`FileInput.vue:81-85`）；选好文件后的播报也从 `xxx selected` 变成 `1 file selected: xxx`（`FileInput.vue:94`）。
   - **DateInput**：日期不可用时从 "That date is not available" 变成 "Invalid date"（`dateInput.invalidDate`，`NativeDateField.vue:276`）。
   - **Calendar**：选日期范围的三句播报全变了，开头那句从 "Range start, 3 May" 变成 "Start date 3 May. Select an end date."，另外两句同理（`calendar.rangeStart` / `rangeCleared` / `rangeComplete`，`Calendar.vue:298`、`:306`、`:316`、`:332`）。
   - **Stepper**：状态词从 "Completed" / "Warning" / "Error" 变成小写的 "completed" / "warning" / "error"，因为它们要填进 "Go to step 2: Payment, completed" 这样的句子里（`stepper.status.*`，`Step.vue:50-69`）。
   - **Pagination 的「第一页 / 最后一页」两个按钮**：从 "First page" / "Last page" 变成 "Go to first page" / "Go to last page"（`pagination.first` / `pagination.last`，`Pagination.vue:200`、`:310`）。这两个按钮只在 `input` 变体里出现，或者显式打开 `hasFirstLast` 时出现。

   另有一类只在数字达到 1000 以上时才变：英文里的数字加了千分位（`1234` → `1,234`）。按组件列出字段和读它的行号：
   - **Pagination**：`pagination.page`（`Pagination.vue:260`、`:284`）、`pagination.total`（`:190`、`:239`）、`pagination.pageOf`（`:243`）、`pagination.ofTotal`（`:235`）。
   - **Selector**：`selector.resultCount`（`Selector.vue:254`，句子由 `searchResultMessage.ts` 拼出）。
   - **MultiSelector**：`multiSelector.resultCount`（`MultiSelector.vue:243`）、`multiSelector.selected`（`:553`）。
   - **Carousel**：`carousel.slide`（`Carousel.vue:130`）。
   - **CommandPalette**：`commandPalette.resultCount`（`CommandPalette.vue:165`）。
   - **Lightbox**：`lightbox.imagePosition` / `lightbox.mediaPosition`（`Lightbox.vue:188`、`:189`）。
   - **AvatarGroupOverflow**：`nav.avatarOverflow`（`AvatarGroupOverflow.vue:39`）。
   - **TableSelectionToolbar**：`table.selectedCount`（`TableSelectionToolbar.vue:29`）。
   - **Stepper**：步骤号也从 `1,234` 这样带千分位（`Step.vue:57`、`:58`），已经写在上面的 Stepper 那一条里，这里不重复计数。

   这份清单是怎么来的：把 `HEAD~3` 和 `HEAD` 的 `packages/core/src/locale` 各导出一份，用仓库自带的 `scripts/i18n-catalog/ts-hooks.mjs` 加载 `astryxMessages.en`，对每个字段用 0、1、2、3、5、1234、12345 求值后逐字比较。结果：**42 个字段的英文变了，90 个是新字段，没有被删除的字段**。42 个变了的字段里，有组件读的就是上面这些；`table.sortedAscending` / `sortedDescending` 也变了（"Ascending" / "Descending" → 小写），但没有任何组件读，所以不列。没有读的变了字段不列，有读的一个不漏。

   我认为这符合「文字和上游一致」的原则，请总控确认。
2. **Pagination 的上一页 / 下一页 / 页码 / dots 分组名，这次没有变**。组件还在读旧字段：`Pagination.vue:36-37` 的 `pagination.previous` / `next`、`:284` 的 `pagination.page(page)`、`:250` 的 `pagination.nav`。所以读屏名仍然是 "Previous" / "Page 3" / "Pagination"，原版是 "Go to previous page" / "Go to page 3" / "Page indicators"。词条里已经有 `previousPage`、`nextPage`、`goToPageNumber`、`pageIndicators`，要等 C13 把组件接上这几个新字段才会和原版一致，见第 7 节 C13。第 1 轮回报把这一条写进了「会变的组件」，是写错了。
3. **`useAstryxLocale` / `useLocale` 现在可能返回 `en-GB` 这样的标签**，原来一定是 `en`。仓库里用 `=== 'en'` 判断的只找到 ChatMessageMetadata 一处，已经修了；文档站的 `useDemoText` 也用了 `=== 'en'`，但文档站只会传 `'en'` 或 `'zh-CN'`，不受影响。如果使用者自己写了 `locale.value === 'en'`，在 en-GB 下会判断成 false，这条应该写进迁移说明（D7）。
4. **comments / commentComposer 的 76 个键**来自原版 lab 的 Comments 组件，ROADMAP 里还没有对应节点，我先把它们放进了 coverage 清单。要不要排一个节点，请总控决定。
5. **有 36 个文档示例写死了 `provideAstryxLocale('en')`**，所以中文文档里这些示例显示英文，验收在浏览器里看 Calendar 页时会看到英文。这不是组件的问题。
6. **zh-CN 有些译法有意没有照抄原版 `zh-CN.json`**，见 1.3 节。如果验收要求和原版中文逐字一致，需要先改项目原则。

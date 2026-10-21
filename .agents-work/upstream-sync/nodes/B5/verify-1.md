# B5 验收报告 · 第 1 轮

结论：不通过（15/16）

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/B5`，分支 `sync/b5-i18n-icons`，提交 `8fc8994`（上面 3 个提交：`9290633`、`b322630`、`8fc8994`）。
- 比较基点：`BASE = 4c8734e12cb1452894a545ed97c9b4082acc29d1`（`git merge-base HEAD swarm-tree`，等于 `HEAD~3`）。
- 临时文件和截图：`/tmp/verify-B5/`。全部自己重新生成，没有用实现者留下的产物。
- 只读检查：开始时 `git status` 为空，结束时为空，两次相同。
- 临时改动：
  - 3 个临时测试文件（`zz-verify-b5.test.ts`），用完已删。
  - 第 9、10 项的反向测试改过 `spinner.ts`、`typeahead.ts`、`fr-FR.json`、`ja-JP.json`、`upstream/forms.ts`，每个测完都还原（`.bak` 还原或 `git checkout`）。
  - 全部已还原，`git status` 为空。
- 浏览器：
  - 每次都走 `pnpm visual ... --out /tmp/verify-B5/...` 或 `browser-lock.mjs run --purpose B5-verify`。
  - 同一时刻只开 1 个浏览器，文档站只用 5173。
  - 用 BASE 对照时，是把 BASE 导出到 `/tmp/verify-B5/base`，在那里构建并起 5173 的站，测完关掉并删除目录。
  - 结束后 5173 没有监听，我的进程都已退出。机器上还有 B1 的 `visual-compare` 等别人的浏览器，不是我的。

## 逐条结果

| # | 检查项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | locales 是最新的 | 过（有说明） | 见下方「第 1 项说明」。`SOURCE.json` 的 `25548b9e` 不是上游 main 的最新提交（现在是 `64e1dde8`），但两者的 `packages/core/locales` 目录树哈希相同（`931ef71c`），所以内容等于 main 最新。30 个文件和 `25548b9e` 里的同名文件去掉末尾空白后完全一致（`en.json` 逐字节相同；其余 29 个只差文件末尾多的空行，是 vendor 脚本有意收掉的）。`de-DE.json` 同样一致。 |
| 2 | 新 key 都补齐了 | 过 | 抽了 5 条台账（#6217 Spinner、#6220 ChatTypingIndicator、#7482 NumberInput、#4920 announce、#5190 Calendar）。`messages/*.ts` 里都有 `en` 和 `zh-CN`，`upstream/*.ts` 里都有映射。临时测试用 translator 在 `de-DE` 下取值：`spinner.loading` 得「Wird geladen」，`chatTypingIndicator.one` 得「Ana schreibt…」，`others` 得「3 weitere Personen」，`calendar.daySelected` 得「3. Mai, ausgewählt」，`typeahead.resultCount(1234)` 得「1.234 Ergebnisse」，都与上游 de-DE 一致。`numberInput.invalidNumber` 在上游 de-DE 里本来就没有（上游缺），所以退回英文，行为正确。`en` 和 `zh-CN` 也取到了。两种 NODE_ENV 都通过。 |
| 3 | 中文自然 | 过 | 抽 30 多条新增 zh-CN（含 spinner、switch、banner、toast、text-area、field、popover、context-menu、more-menu、breadcrumbs、日期滚轮、calendar 等）。例：「加载中」「还可以输入 N 个字符」「已超出 N 个字符」「把文件拖到这里」「转到第 2 步：付款」「组内条件关系」「数字无效」。没有机翻腔，术语和已有一致（复选框、菜单、关闭、展开/收起）。不合格 0 条。 |
| 4 | provider 的语言全局生效 | 过 | 临时测试：`InternationalizationProvider locale="de-DE"` 加完整 de-DE 目录，包住 Pagination，aria-label 为「Seitennummerierung」「Zur vorherigen Seite wechseln」「Seite 3」「Zur nächsten Seite wechseln」。切换语言后 `t` 跟着变（已有 `useTranslator.test.ts` 覆盖）。例外：目录里没有的 `pagination.more` 仍是英文「More pages」，属于 C13 的接入工作，不是 B5 的问题。 |
| 5 | locale hooks | 过 | 上游 `i18n/index.ts` 导出 `useTranslator`、`useLocale`、`useCollator`。我们 `index.ts:668-670` 导出同名三个，另有 `useAstryxLocale` 等。`locale.test.ts`、`useLocale.test.ts` 在两种 NODE_ENV 下通过。 |
| 6 | upload 图标是必需的 | 过 | `IconRegistry = Readonly<Record<IconName, string>>`，`defaultSemanticIcons` 用 `satisfies IconRegistry`。`registry-contract.test.ts` 里的 `@ts-expect-error` 证明缺 `upload` 的完整注册表编译不过（`pnpm typecheck` 通过，说明该指令确实命中了错误）；有 `upload` 的正常工作。`upload` 是独立名字，`lucide:upload`，和 `arrowUp` 区分。FileInput 用 `upload`，ChatSendButton、Table 排序用 `arrowUp`，主题改 `upload` 不影响它们。 |
| 7 | 语义图标机制 | 过 | `semantic.ts` 的 `resolveSemanticIcon(name, themeIcons)`：主题条目优先，包括包里没有的命名空间键。对照上游 #6153：上游 spec 说「新的组件级插槽用 componentIcons」，但代码里还没有（见偏离 5）。我们的等价能力：组件用语义名或 `owner:role` 键声明图标，用户用 `defineTheme({ icons })` 替换。 |
| 8 | 浏览器实测（中文站） | 过 | 中文站 `/components/spinner`、`switch`、`number-input`、`calendar`，`lang=zh-CN`。Spinner 页示例的 aria-label 为 Small/Medium/Large（示例自己写的英文）；Switch 页只有文字 "Enable notifications"；NumberInput 的步进按钮 aria-label 是「增加Quantity」「减少Quantity」（前缀已是中文）；Calendar 页是英文（"Previous month"、"Sunday, March 29, 2026"），原因是示例 `calendar/*.vue` 都写了 `provideAstryxLocale('en')`，这是实现者回报第 6 节已列出的「文档示例」问题，不是组件问题。Spinner、Switch、NumberInput 的默认 Loading、Clear、无效数字播报还没接 `t()`，回报「交给 Cx」里有对应条目（C15、C2、C1），并且我核对了行号：`Spinner.vue:22`、`Switch.vue:17`、`NumberInput.vue:364` 都是写死的英文。截图 `/tmp/verify-B5/zh-number-input.png`、`zh-calendar.png` 已看，是深色模式的单个组件，无报错覆盖层。 |
| 8b | 图标符合我们自己的方案 | 过 | 改动只在 `Icon/semantic.ts`、`types.ts`、`glyphs.ts`、`index.ts`、`icon.css`、`registry-contract.test.ts`。新增的只有类型（`IconRegistry`、`NamespacedIconName`）、一个内置图形 `numberInput:stepperDown` 和对应 CSS 兜底，没有新的注册机制，没有 React 图标翻译。`upload` 默认 `lucide:upload`，有内置图形。临时测试：`defineTheme({ icons: { upload: 'carbon:upload', 'numberInput:stepperDown': 'carbon:caret-down' } })`，两个都生效（SVG 里分别出现自己的路径）。另有项目自己的 `registry-contract.test.ts` 通过。 |
| 9 | 目录检查接进 pnpm check，三个反向测试 | 过 | `package.json`：`check:packages` 末尾 `&& pnpm check:i18n-catalog`。基线通过（333 个键，30 个目录）。反向测试都退出码 1，且已还原：(a) 删 `spinner.loading` 的 zh-CN：「zh-CN 缺这个字段」；(b) zh-CN `typeahead.resultCount` 不用占位符：「没有用上占位符 count」；fr-FR 把 `{count` 改成 `{n`：「占位符是 count:plural, n:number，英文原文是 count:number+plural」；(c) 映射里写 `@astryx.spinner.noSuchKey`：「映射里有，但 locales/en.json 里没有这个键」。 |
| 10 | ICU 契约覆盖 29 种语言 | 过 | 删 `ja-JP.json` 里 `@astryx.calendar.daySelected` 的 `{date}`：检查失败，「ja-JP.json … 占位符是 （无），英文原文是 date:argument」，已还原。 |
| 11 | 台账 72 条打勾并有结论 | 过 | `- [x]` 72 条，`- [ ]` 0 条，`upstream-ledger.mjs --check` 显示「台账是最新的」。抽 6 条：已采纳 2（#5243 `dateInput.resetPicking` 等：`messages/date-input.ts:38-41` 有 en、zh-CN，映射在 `upstream/dates.ts`；`calendar.rangeClearedAnnounce`：`messages/calendar.ts:28,41`，映射 `dates.ts:8`，英文与上游一致）；交给 Cx 2（`stepper.label` 写了 C15、`dateTimeInput.timeOptionsLabel` 写了 C5，都有 key 名）；不适用 2（#6697 精简目录：我们的 provider 同时接受完整和纯字符串目录；预建查找表：computed 合成一次，理由站得住）。 |
| 12 | 「交给 Cx」清单能直接照做 | 过 | 读了 C5、C15。每条都有组件、文件和行号、换成哪个 `messages.xxx` 字段、对应哪个 `@astryx.*` 键。我核对了其中 10 处行号：Spinner:22、Switch:17、NumberInput:364、Banner:81 和 :10、FieldLabel:11、MobileNavToggle:12、TableTreeCell:41、sortable.ts:78（在 `Table/plugins/` 下）、columnUtils:199，都对得上。字段在 `messages/*.ts` 里都存在。 |
| 13 | 全量 vitest 两种 NODE_ENV，完整 check | 过 | 不设 NODE_ENV：241 个文件、3250 条通过；`NODE_ENV=production`：241 个文件、3250 条通过，数量相同。（回报里是 234/3135，差额来自 rebase 到最新 swarm-tree 后别的节点新增的测试。）分步：`check:packages` 0、`lint` 0、`typecheck` 0、`build` 0、`lint:pkg` 0，test 用 `vitest run --maxWorkers=2`。 |
| 14 | 文件行数和越界 | 过 | 新增或改动的源码最大：`icu.ts` 353、`checks.mjs` 315、`messages.ts` 263、`power-search.ts` 208，都不超过 500；`index.ts` 本来 1336 行，本次加了 3 行，在行数检查的白名单里，`check-line-limit` 通过。组件只改了 `Step.vue`（2 行）和 `ChatMessageMetadata.vue`（1 行）。`Theme/`、`composables/` 没动。 |
| 4a | 重点：Pagination、SideNav、Calendar 的英文与上游一致，BASE 与 B5 差别只在文字 | 不过 | 见下方「第 4a 项」。上游一致这一半成立：SideNav 和 Calendar 的上游 aria-label 与我们一致。BASE 对比这一半有一个问题：Pagination 的可见英文没有变（见下），按钮的名字仍是 "Previous"，和上游 "Go to previous page" 不同。 |

## 第 1 项说明

实现者说拉到了上游「最新的」`25548b9e`。我 fetch 后，上游 main 是 `64e1dde8`，比它新 9 个提交。差别不影响结论：这 9 个提交（CLI、SideNavItem className、AvatarGroupOverflow、CheckboxList、PowerSearch disabled 等）都没碰 `packages/core/locales`，两个提交的该目录树哈希都是 `931ef71c09de1b31ecf4165009bf5decbeaa43ff`。所以文件内容等于 main 最新。建议实现者以后把「拉取时的最新」写成当时 `git ls-remote` 的结果，避免被误会。

## 第 4a 项（重点）

对 Pagination、SideNav、Calendar 各跑一次 `pnpm visual <C> --out /tmp/verify-B5/vis`（桌面浅色、深色；Pagination 的手机浅色上游超时，重跑 `--combos desktop-light` 时通过），再把 BASE 导出到 `/tmp/verify-B5/base`、构建后在 5173 上用同样参数跑一遍（`/tmp/verify-B5/vis-base`）。

| 组件 | 上游读屏名（我自己在上游页面读） | B5 的内置英文（临时组件测试） | BASE 的 ours.png 对 B5 的 ours.png |
| --- | --- | --- | --- |
| SideNav | `Side navigation` | `Side navigation`（BASE 是 `Sidebar`） | 逐字节相同，内容区分数都是 2.14% |
| Calendar | `Previous month`、`Next month`、`April 2026`、`Sunday, March 29, 2026` | `Previous month`、`Next month`、`April 2026`、`Sunday`… | 逐字节相同，内容区 4.89% |
| Pagination | `Pagination`、`Go to previous page`、`Page indicators`、`Go to page 1…`、`Go to next page` | `Previous`、`Page 1…`、`More pages`、`Next`；`pagination.previousPage` 字段已有 "Go to previous page"，但组件还没用 | 逐字节相同，内容区 0.91% |

截图看了三张 side-by-side（浅色）。差别和 BASE 完全一样：SideNav 上游的内容靠左、图标不同（Analytics 图标不同）；Calendar 上游导航箭头更粗、行距略大；Pagination 上游有四种样式，我们的示例只有一种（"3 / 5"）。这些都是 B5 之前就有的视觉差异，不是本次改动引入。这说明 B5 没有改变任何看得见的像素，而「内置英文变了」只体现在读屏名和 `t()` 取值上，Overview 截图看不出来。

判断：
- SideNav 和 Calendar：英文已对齐上游。过。
- Pagination：词条里已经有上游的字段（`previousPage` 等），但组件还在用旧字段，读屏名与上游不一致。回报已经把它列入 C13，所以是预期中的「交给 Cx」，不算 B5 的失败。但我们现在的内置英文和上游仍不同，实现者回报第 8 节第 1 条说「Pagination（读屏名）」会变化，实际并没有变（`Pagination.vue:36-37` 仍读 `pagination.previous`）。这是回报与事实不符，要在文档里改正。

我把这一项记为「不过」的唯一原因：验收口径是「用户看到和读屏读到的文字要和上游一致」，目前 Pagination 的按钮读屏名（"Previous"）与上游（"Go to previous page"）不一致，而回报还声称已对齐。要么 B5 就把这一处最小接上（计划要求「签名变化后的最小修复」之外，不允许），要么在回报里改正说法并确认归 C13。下面「怎么改」里写了。

## 对实现者偏离计划的判断

1. `upstreamMap.ts` 拆成目录：合理。原文件加 95 个键会超 500 行。`mergeParts` 遇到重复键会抛错，对外导出没变，`check-i18n-catalog` 也读得到。我跑了 `sync-exports --check` 和 `check:packages`，都通过。无风险。
2. 改 `normalizeLocale`（`en-GB` 不再被当成 `en`）：合理，与上游 `useLocale` 原样返回标签一致。我 grep 了全仓库：
   - `packages/core` 里 `=== 'en'` 只有 `ChatMessageMetadata.vue:33`，已改成取语言部分比较。
   - `useDateRange.ts:93` 用 `locale === 'zh-CN' ? 'zh-CN' : 'en'`，`en-GB` 会得到美式短日期。这不会出错，只是 `en-GB` 下没有用上地区习惯，和改动前一致，不是退步。
   - `RangeCalendar.vue:40` 用 `=== 'zh-CN'` 决定周起始日，`en-GB` 周日起始，和改动前一致。
   - `useSpeechRecognition.ts:156`、`Timestamp`、`DateInput` 等把标签直接交给 `Intl`，`en-GB` 正确。
   - docs 里的 `=== 'en'` 都是文档站路由的 `en`/`zh`，不受影响；`useDemoText.ts:12` 读 `useAstryxLocale()` 比较 `'en'`，只在 provider 传 `en-*` 时才会出错，文档站只传 `en`/`zh-CN`。
   - 临时测试：provider 设 `en-GB`，`useAstryxLocale` 返回 `en-GB`，文案是 "Side navigation"，方向 ltr，星期名 `Su,Mo,…`，日期 `15/04/2026`。
   结论：没有会在 `en-GB` 下出错的地方。迁移说明里要提醒用户别写 `locale.value === 'en'`（回报已提）。
3. `Step.vue` 改两行：合理。`StepProps.label` 是必填 `string`，不会是空。`goToStep` 现在读 "Go to step 2: Payment"，和上游格式一致。属于签名变化的最小修复。
4. 改 6 个组件测试的期望文字：合理。6 处我逐一看了：Calendar「上一月」→「上个月」，DateInput 「not available」→「Invalid date」，FileInput 带引号，SideNav「Sidebar」→「Side navigation」，Typeahead「Loading results」→「Loading」，MobileNav 改用类名选取。都是跟着上游文字走的。MobileNav 那条用类名代替 `aria-label="Close"` 是因为按钮名字变成 "Close navigation"，也合理。有风险的是 Pagination：回报声称会变，实际没变（见上）。
5. AST-032 的 `componentIcons` 没做：合理，核对属实。上游 v0.7.1 和 main 的包代码里搜不到 `ComponentIconSlotMap` 或 `componentIcons`（`git grep v0.7.1 -- packages` 无结果），只出现在 `docs/architecture/icon-resolution-and-component-slots.md` 和 `docs/specs/AST-032/spec.md` 里；上游 `ChatSendButton.tsx` 仍是 `useIcon('arrowUp')`。我们的 `ChatSendButton` 已有 `sendIcon` 插槽。
6. 不沿用「复数分支可达性」检查：合理。运行时用 `Intl.PluralRules` 选分支，到不了的分支永远不会被选中，用户看不出差别；其余占位符契约检查已覆盖。

## 不通过的项要怎么改

第 4a 项（Pagination）：

- 现象：`Pagination.vue:36-37` 仍用 `messages.pagination.previous` / `next`（"Previous" / "Next"），读屏名与上游的 "Go to previous page" / "Go to next page" 不一致。回报第 8 节第 1 条却说 Pagination 的读屏名已经改成和上游一致。同时，页码按钮读屏名是 "Page 3"，上游是 "Go to page 3"，分页的 dots 变体分组名是 "Pagination" 而上游是 "Page indicators"。
- 复现：在 B5 里挂载 `Pagination`，读 `[aria-label]`，得到 `Previous | Page 1 | Page 2 … | More pages | Page 10`；上游页面得到 `Go to previous page | Page indicators | Go to page 1 … | Go to next page`。
- 期望：二选一，写进第 2 轮回报。
  - A：回报改正说法，明确「Pagination 的读屏名要等 C13 接 `previousPage`、`nextPage`、`goToPageNumber`、`pageIndicators` 才会变」，并且在 C13 清单里写清「读屏名现在和上游不同」。这一条回报里已有，只需删掉第 8 节里与事实不符的话。
  - B：如果总控认为读屏名必须在 B5 里对齐，那就要明确批准改 `Pagination.vue` 的 4 处引用，现行计划不允许。

## 改进建议（不影响结论）

- `SOURCE.json` 的提交号说明里不要写「最新」，写成拉取日期加 `git ls-remote origin main` 的结果。
- `useDateRange.ts:93` 在 `en-GB` 下退成美式短日期，C5 接入时可以顺手改成直接传标签。
- 文档站里 36 个示例写死 `provideAstryxLocale('en')`，中文站看不到翻译效果，这点已在回报里提了，需要总控决定交给 D 节点还是各个 C 节点。

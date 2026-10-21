# B5 验收报告 · 第 2 轮

结论：不通过（第 17 项不过，第 18、19 项过，第 1 轮其余 15 项沿用）。

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/B5`，分支 `sync/b5-i18n-icons`，HEAD `8fc8994`。BASE = `HEAD~3` = `4c8734e`。
- 只读检查，没有改任何代码或文件。临时文件在 `/tmp/verify-B5-r2/`。
- 工作区和主仓库的 `git status` 开始、结束各跑一次，都是空，两次相同。
- 没开浏览器，没跑全量测试（代码没变）。

## 第 2 轮三项

| # | 检查项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 17 | `impl-2.md` 第 8 节不再说 Pagination 读屏名会变；列出的「英文会变的组件」逐个属实，且没有遗漏 | 不过 | 前半成立，后半有遗漏，见下方「第 17 项」。 |
| 18 | C13 清单写明 Pagination 现在和上游的差别 | 过 | `impl-2.md` 第 7 节 C13 第一条：现在是 "Previous" / "Page 3" / "Pagination"，上游是 "Go to previous page" / "Go to page 3" / "Page indicators"，要接 `previousPage`、`nextPage`、`goToPageNumber`、`pageIndicators`。我对了组件源码：`Pagination.vue:36-37` 读 `previous`/`next`，`:260`、`:284` 读 `page()`，`:250` 读 `nav`，说法属实。 |
| 19 | 第 2 轮没有新的代码提交 | 过 | `git log` 的最上面 3 个提交就是第 1 轮验收的 `9290633`、`b322630`、`8fc8994`，HEAD 仍是 `8fc8994`；`git reflog` 在 rebase 完成后没有新条目；`git status` 为空；`git diff HEAD~3 --stat` 与第 1 轮相同（91 个文件，+2415/-583）。 |

## 第 17 项

### 做法

1. 把 `HEAD~3` 和 `HEAD` 的 `packages/core/src/locale` 各导出一份，用项目自带的 `scripts/i18n-catalog/ts-hooks.mjs` 加载 `astryxMessages.en`。
2. 对每个字段（函数字段用多组参数，含 1234 这种带千分位的数）求值，比较两边的英文。结果：42 个字段的英文变了，90 个是新增。没有被删除的字段。
3. 对 42 个变了的字段，逐个 grep 组件源码，看谁实际读取。
4. 反过来，把读取到的组件和 `impl-2.md` 第 8 节的 13 项对照。

### 正向：13 项逐个核对（全部属实）

| 组件 | 字段 | BASE 英文 | HEAD 英文 | 组件读取处 | 结果 |
| --- | --- | --- | --- | --- | --- |
| SideNav | `nav.sideNav` | Sidebar | Side navigation | `SideNav.vue:76` | 属实 |
| AppShell | `layout.mobileNavigation` | Navigation | Mobile navigation | `AppShell.vue:157`、`:191` | 属实 |
| MobileNav | `nav.close` | Close | Close navigation | `MobileNav.vue:131` | 属实 |
| Selector | `selector.empty` / `readOnly` | No matches / Read-only | No options / Read only | `Selector.vue:61`、`:433` | 属实 |
| MultiSelector | `multiSelector.empty` | No matches | No options | `MultiSelector.vue:99` | 属实 |
| PowerSearch | `powerSearch.operators.equals` / `notEquals` | equals / does not equal | is / is not | `operators.ts:49`（回报写 `:48`，差 1 行） | 属实 |
| Typeahead | `typeahead.clear` / `loading` | Clear / Loading results | Clear selection / Loading | `BaseTypeahead.vue:53`、`:326`、`:369` | 属实 |
| Tokenizer | `tokenizer.loading` | Loading results | Loading | `Tokenizer.vue:450` | 属实 |
| FileInput | `errorType` / `errorSize` / `errorCount` / `fileSelected` | 见 dump | 见 dump | `FileInput.vue:81-85`、`:94` | 属实 |
| DateInput | `dateInput.invalidDate` | That date is not available | Invalid date | `NativeDateField.vue:276`（只被 `DateInput.vue` 用） | 属实 |
| Calendar | `rangeStart` / `rangeCleared` / `rangeComplete` | Range start, X / Range cleared, X / X to Y | Start date X. Select an end date. / Cleared start date X. Select a start date. / Selected range: X to Y. | `Calendar.vue:298`、`:306`、`:316`、`:332` | 属实 |
| Stepper | `stepper.status.*`、`goToStep`、`goToStepWithStatus` | Completed / Warning / Error | completed / warning / error | `Step.vue:50-69` | 属实 |
| Pagination 首页 / 末页 | `pagination.first` / `last` | First page / Last page | Go to first page / Go to last page | `Pagination.vue:200`、`:310`；只在 `input` 变体或 `hasFirstLast` 时出现（`:133-136`） | 属实 |

第 8 节第 2 条已经改正：说 Pagination 的上一页 / 下一页 / 页码 / dots 分组名没有变。这一点对了。

### 反向：英文变了、有组件读取、但第 8 节没列的

| 字段 | BASE → HEAD | 读取的组件 | 性质 |
| --- | --- | --- | --- |
| `nav.close` | Close → Close navigation | `MobileNavToggle.vue:12`（打开状态下的按钮名） | 文字变了，漏列。第 8 节只列了 `MobileNav.vue:131`。C13 清单里提到了这个按钮，但没进第 8 节。 |
| `multiSelector.readOnly` | Read-only → Read only | `MultiSelector.vue:584` | 文字变了，漏列。第 8 节只在 Selector 下写了 readOnly，MultiSelector 下只写了 empty。 |
| `pagination.page` / `total` / `pageOf` / `ofTotal` | 1234 → 1,234（数字 ≥ 1000 时） | `Pagination.vue:190`、`:235`、`:239`、`:243`、`:260`、`:284` | 千分位。Pagination 在第 8 节只列了首页 / 末页。 |
| `selector.resultCount`、`multiSelector.resultCount` / `selected` | 同上 | `Selector.vue:254`、`MultiSelector.vue:243`、`:553` | 千分位。 |
| `carousel.slide` | 同上 | `Carousel.vue:130` | 千分位。Carousel 整个没列。 |
| `commandPalette.resultCount` | 同上 | `CommandPalette.vue:165` | 千分位。CommandPalette 整个没列。 |
| `lightbox.imagePosition` / `mediaPosition` | 同上 | `Lightbox.vue:188-189` | 千分位。Lightbox 整个没列（第 7 节 C7 写了「已经带千分位」，第 8 节没写）。 |
| `nav.avatarOverflow` | 同上 | `AvatarGroupOverflow.vue:39` | 千分位。AvatarGroup 没列。 |
| `table.selectedCount` | 同上 | `TableSelectionToolbar.vue:29` | 千分位。Table 没列。 |
| `stepper.goToStep` 等的步骤号 | 同上 | `Step.vue` | 已在 Stepper 条目里，不算漏。 |

没有读取者的变了的字段（`table.sortedAscending` / `sortedDescending`）：没有任何组件读，不用列，回报也没列，正确。

### 判定

第 8 节的 13 项没有一项写错。但「现在就真的变了的是下面这些」是个完整清单的说法，实际有遗漏：

- 硬遗漏 2 处：`MobileNavToggle` 的 `nav.close`，`MultiSelector` 的 `readOnly`。
- 软遗漏（只在计数 ≥ 1000 时才变）：Pagination 的页码和总数、Selector / MultiSelector 的计数、Carousel、CommandPalette、Lightbox、AvatarGroupOverflow、TableSelectionToolbar。第 1.3 节有一句「计数都补上了千分位」，但第 8 节的清单里没写，也没有说「另有千分位」。

按验收计划「变了却没写进去，就判不过」，第 17 项不过。

### 怎么改

不用改代码。只改 `impl-2.md` 第 8 节：

1. 在 MobileNav 条目里加上 `MobileNavToggle.vue:12`（`nav.close`）。
2. 在 MultiSelector 条目里加上 `readOnly`（`MultiSelector.vue:584`）。
3. 加一条「千分位」：数字 ≥ 1000 时，下面这些组件的英文多了逗号，例如 `1,234`：Pagination（页码、总数）、Selector、MultiSelector、Carousel、CommandPalette、Lightbox、AvatarGroupOverflow、TableSelectionToolbar、Stepper 的步骤号。
4. 把 `PowerSearch` 的行号 `operators.ts:48` 改成 `:49`。

## 补充说明（不影响判定）

- `impl-1.md:275` 里还留着「Pagination（读屏名）」会变的旧说法。总控让改正的是 `impl-2.md`，所以不算不过，但两份回报现在互相矛盾，建议在 `impl-1.md` 顶部加一句「以 `impl-2.md` 为准」。
- `impl-2.md` 开头写的提交号（`21a22d6`、`9054fc2`、`797ed9f`，基于 `22fd14b`）是 rebase 之前的。现在实际是 `9290633`、`b322630`、`8fc8994`，基于 `4c8734e`。第 1 轮验收报告已经用的是新号。
- C13 的 Pagination 差别只写在 `impl-2.md` 第 7 节；`.agents-work/upstream-sync/ledger/C13.md` 里没有。如果 C13 的实现者只读台账，会看不到。建议总控在派 C13 时把第 7 节的 C13 条目一起给它。

## 第 1 轮其余 15 项：沿用原结论

代码没变（HEAD 仍是 `8fc8994`，工作区干净），按验收计划第 19 项沿用。

| # | 检查项 | 沿用结论 |
| --- | --- | --- |
| 1 | locales 是最新的 | 过 |
| 2 | 新 key 都补齐了 | 过 |
| 3 | 中文自然 | 过 |
| 4 | provider 的语言全局生效 | 过 |
| 5 | locale hooks | 过 |
| 6 | upload 图标是必需的 | 过 |
| 7 | 语义图标机制 | 过 |
| 8 | 浏览器实测（中文站） | 过 |
| 8b | 图标符合我们自己的方案 | 过 |
| 9 | 目录检查接进 `pnpm check`，三个反向测试 | 过 |
| 10 | ICU 契约覆盖 29 种语言 | 过 |
| 11 | 台账 72 条打勾并有结论 | 过 |
| 12 | 「交给 Cx」清单能直接照做 | 过 |
| 13 | 全量 vitest 两种 NODE_ENV，完整 check | 过 |
| 14 | 文件行数和越界 | 过 |

第 4a 项（第 1 轮不过）的处理：按总控裁定改为第 17、18 项检查。第 18 项过；第 17 项不过的原因是新发现的遗漏，不是 Pagination 的说法。

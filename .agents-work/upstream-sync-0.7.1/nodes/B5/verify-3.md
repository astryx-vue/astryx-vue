# B5 验收报告 · 第 3 轮

结论：通过（第 20 项过；代码没动；第 1 轮其余项沿用）。

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/B5`，分支 `sync/b5-i18n-icons`，HEAD `8fc8994`。BASE = `HEAD~3` = `4c8734e`。
- 只读检查，没改任何代码或文件。临时文件在 `/tmp/verify-B5-r3/`。
- 开始和结束各跑一次 `git status --short`（工作区和主仓库都跑了），结果都是空，两次一致。
- 没开浏览器，没跑全量测试。

## 代码确实没动

- `git log`：最上面 3 个提交仍是 `9290633`、`b322630`、`8fc8994`，往下是 `4c8734e`。没有第 4 个新提交。
- `git diff HEAD~3 --stat`：91 个文件，+2415/-583，和第 2 轮一模一样。
- `git status` 为空。

## 第 20 项

### 做法

1. 用 `git archive` 把 `HEAD~3` 和 `HEAD` 的 `packages/core/src/locale` 各导出一份，用仓库自带的 `scripts/i18n-catalog/ts-hooks.mjs` 加载 `astryxMessages.en`。
2. 每个字段求值。函数字段带入 18 组参数：无参、0、1、2、3、5、`(1,10,30)`、`(3,5,7)`、1234、12345、`(1234,5678)`、`(1,10,1234)`、`(1234,5678,9012)`、`(1234,5678,9012,3456)`、`'Lbl'`、`('Lbl','a.txt','2 MB','5')`、`(3,'Pay')`、`(3,'Pay','completed')`。逐字比较。
3. 结果：**42 个字段英文变了，90 个新增，0 个删除**。和 impl-3 的数字一致。
4. 对 42 个字段逐个 grep 组件源码（排除测试、locale 目录），看谁读取。
5. 再和 impl-3.md 第 8 节双向核对。

### 42 个变了的字段：分类

文字变了（零参数也不同）和只在 ≥1000 时才变（千分位），分开核对。

**A. 文字变了，有组件读取（第 8 节主清单）**

| 字段 | BASE → HEAD | 读取处（我 grep 的行号） | 清单行号 | 结果 |
| --- | --- | --- | --- | --- |
| `nav.sideNav` | Sidebar → Side navigation | `SideNav.vue:76` | `:76` | 对 |
| `layout.mobileNavigation` | Navigation → Mobile navigation | `AppShell.vue:157`、`:191` | `:157`、`:191` | 对 |
| `nav.close` | Close → Close navigation | `MobileNav.vue:131`、`MobileNavToggle.vue:12` | 两处都写了 | 对（上轮硬遗漏已补） |
| `selector.empty` / `readOnly` | No matches → No options / Read-only → Read only | `Selector.vue:61`、`:433` | 同 | 对 |
| `multiSelector.empty` / `readOnly` | 同上 | `MultiSelector.vue:99`、`:584` | 同 | 对（上轮硬遗漏已补） |
| `powerSearch.operators.equals` / `notEquals` | equals / does not equal → is / is not | `operators.ts:49`（值在 `power-search.ts:82-83`） | `operators.ts:49` | 对（行号已改正） |
| `typeahead.clear` / `loading` | Clear → Clear selection / Loading results → Loading | `BaseTypeahead.vue:53`、`:326`、`:369` | 同 | 对 |
| `tokenizer.loading` | Loading results → Loading | `Tokenizer.vue:450` | `:450` | 对 |
| `fileInput.errorType` / `errorSize` / `errorCount` / `fileSelected` | 见 dump | `FileInput.vue:81`、`:83`、`:85`、`:94` | `:81-85`、`:94` | 对 |
| `dateInput.invalidDate` | That date is not available → Invalid date | `NativeDateField.vue:276` | 同 | 对 |
| `calendar.rangeStart` / `rangeCleared` / `rangeComplete` | 三句全变 | `Calendar.vue:298`、`:306`、`:316`、`:332` | 同 | 对 |
| `stepper.status.completed/warning/error`、`goToStep`、`goToStepWithStatus` | 首字母小写；句子加了步骤标签 | `Step.vue:50-69`（`:57`、`:58` 是 goToStep 调用） | `:50-69` | 对 |
| `pagination.first` / `last` | First page / Last page → Go to first page / Go to last page | `Pagination.vue:200`、`:310` | 同 | 对 |

**B. 只在数字 ≥1000 时才变（千分位）**

我用 `(1234)`、`(1234,5678)` 等参数确认：这些字段在 0 到 5 的小数字下英文相同，只在 ≥1000 时多逗号，例如 `Page 1234` → `Page 1,234`，`Slide 1234 of 5678` → `Slide 1,234 of 5,678`，`1234 results` → `1,234 results`。

| 字段 | 读取处 | 清单行号 | 结果 |
| --- | --- | --- | --- |
| `pagination.page` | `Pagination.vue:260`、`:284` | 同 | 对 |
| `pagination.total` | `Pagination.vue:190`、`:239` | 同 | 对 |
| `pagination.pageOf` | `Pagination.vue:243` | `:243` | 对 |
| `pagination.ofTotal` | `Pagination.vue:235` | `:235` | 对 |
| `selector.resultCount` | `Selector.vue:254` | 同 | 对 |
| `multiSelector.resultCount` / `selected` | `MultiSelector.vue:243`、`:553` | 同 | 对 |
| `carousel.slide` | `Carousel.vue:130` | 同 | 对 |
| `commandPalette.resultCount` | `CommandPalette.vue:165` | 同 | 对 |
| `lightbox.imagePosition` / `mediaPosition` | `Lightbox.vue:188`、`:189` | 同 | 对 |
| `nav.avatarOverflow` | `AvatarGroupOverflow.vue:39` | 同 | 对 |
| `table.selectedCount` | `TableSelectionToolbar.vue:29` | 同 | 对 |
| `stepper.goToStep*` 的步骤号 | `Step.vue:57`、`:58` | 已并入 A 的 Stepper 条目，第 8 节明说「不重复计数」 | 对 |

**C. 变了但没有组件读取**

- `table.sortedAscending` / `sortedDescending`（Ascending → ascending）：grep 全仓库（排除 locale 目录）没有任何读取。清单明确说了不列，属实。

### 双向核对结论

- **清单里写的，是否真的变了、行号对不对**：第 8 节所有条目都核对过，字段确实变了，行号和 grep 完全一致。没有写错的。
- **实际变了且有组件读取的，是否漏列**：42 个字段里，除 `sortedAscending` / `sortedDescending` 外都在清单里。上轮指出的 2 处硬遗漏（`MobileNavToggle` 的 `nav.close`、`MultiSelector` 的 `readOnly`）已补。上轮指出的 8 个千分位组件（Pagination、Selector、MultiSelector、Carousel、CommandPalette、Lightbox、AvatarGroupOverflow、TableSelectionToolbar）已单独成一小节。
- 验收计划要求的三点都满足：补上 `MobileNavToggle` 和 `MultiSelector.readOnly`；单独加了千分位小节并列全那 8 个组件；PowerSearch 行号写 `operators.ts:49`。

第 20 项：过。

### 小提示（不影响判定）

- `impl-1.md` 里还留着第 1 轮「Pagination 读屏名会变」的旧说法，第 2 轮已提醒过。`impl-3.md` 开头只写了「第 3 轮只补全第 8 节清单」，没有写以哪份为准。建议总控以 `impl-3.md` 为准。

## 第 1 轮其余项：沿用原结论

代码没变（HEAD 仍是 `8fc8994`，工作区干净），按验收计划沿用。

| # | 检查项 | 结论 |
| --- | --- | --- |
| 1-3 | locales 最新、新 key 补齐、中文自然 | 过 |
| 4-5 | provider 语言全局生效、locale hooks | 过 |
| 6-8b | upload 图标、语义图标机制、浏览器实测、图标符合自有方案 | 过 |
| 9-10 | 目录检查接进 check、ICU 契约覆盖 29 种语言 | 过 |
| 11-12 | 台账 72 条、「交给 Cx」清单 | 过 |
| 13-14 | 全量 vitest 与 check、文件行数与越界 | 过 |
| 17-19 | 第 2 轮：Pagination 说法已改正（17 的后半由第 20 项补全）、C13 清单、无新代码 | 过 |

# A3 工程护栏 · 第 1 轮验收报告

## 结论：通过

22 项检查全部为「过」。实现者的两处偏离（统计未提交的新文件、SSR 渲染时临时删掉 navigator 等全局）都是加严，不是削弱，我判断合理。已知失败名单为空，我用反向方式验证了名单机制，并确认空名单是真实的（见第 11、12 项）。

## 逐条结果

| 编号 | 检查项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | 行数检查退出码 0 | 过 | `node scripts/check-line-limit.mjs` 输出「检查通过」，exit=0 |
| 2 | 白名单真实 | 过 | 自己统计：`git ls-files` 过滤扩展名 .ts/.tsx/.mts/.js/.mjs/.cjs/.vue，再按配置的 8 条排除规则 grep -Ev 过滤，`xargs wc -l`，取 >500 的。得到 26 条，与白名单 26 条的「路径: 行数」逐行 diff 完全一致（LC_ALL=C 排序）。未过滤时超标但被排除的 11 个文件都是 `*.test.ts` 或 `packages/core/src/index.ts`。 |
| 3 | 排除规则合理 | 过 | 8 条规则全部带 reason。抽查 3 个被排除文件：`packages/core/src/index.ts`（首行「这个文件由 `pnpm sync` 生成」，且在 `sync-exports.mjs` 的 generatedFiles 里）、`Chat/Chat.test.ts`、`DropdownMenu/DropdownMenu.test.ts`，都名副其实。`MultiSelector.vue`(763)、`cli.ts`(623)、`sync-exports.mjs`(673) 都不被排除，都在白名单里。`index.ts` 的理由是「由 pnpm sync 生成」。另外 composables/index.ts、locale/messages.ts 首行也是生成标记；`apps/docs/public` 下没有被跟踪的源码文件，该规则没有实际影响。 |
| 4 | 新文件超标被拦 | 过 | 新建 `packages/core/src/__verify_tmp.ts`（501 行）并 `git add`。结果 exit=1，中文报错「packages/core/src/__verify_tmp.ts 有 501 行，超过上限 500 行……新文件不能加进白名单」。`git rm --cached` 并删除后 exit=0。已还原。 |
| 5 | 白名单文件变大被拦 | 过 | `Selector.vue` 末尾加一行后，exit=1，报「有 585 行，比白名单记录的 584 行多了 1 行」。`git checkout` 还原后 exit=0。 |
| 6 | 降到 500 行以内要删条目 | 过 | `Selector.vue` 截到 400 行，exit=1，报「已经降到 400 行……请从 line-limit-allowlist.json 删掉这一条」。已还原。 |
| 7 | `--update` 只能收紧 | 过 | (a) 白名单里 Selector 改成 580（实际 584），跑 `--update`：数字仍是 580，没有被改大，exit=1，复查仍失败。(b) Selector 截到 550 行，跑 `--update`：584 变成 550，复查通过。两次均已还原。 |
| 8 | check:packages 调用脚本 | 过 | `package.json` 第 22 行 `check:packages` 末尾是 `&& node ./scripts/check-line-limit.mjs`。`pnpm check:packages` 实跑 exit=0，输出末行是行数检查通过。 |
| 9 | SSR 冒烟通过、node 环境 | 过 | `ssr-smoke.test.ts` 第 1 行是 `// @vitest-environment node`。`--maxWorkers=2` 跑，212 条全过。 |
| 10 | 组件列表自动生成 | 过 | 测试用 `import * as core from './index.js'`，按「对象且有 render 或 setup」筛选，没有手写清单。我用临时探针测得 index 共导出 203 个组件对象，与 verbose 输出里 203 个组件用例一致。212 条 = 203 + 3 条列表自检 + 6 条 harness 自检。导出的大写名字里有 10 个不是组件（PASTE_TOKEN_THRESHOLD、DIFF_SYNTAX_TOKEN_KEYS、HIGHLIGHTED_TOKEN_TYPES、SYNC_TOKENIZE_THRESHOLD、SYNTAX_TOKEN_KEYS、ICON_GLYPHS、SELECT_ALL_VALUE、TOKEN_COLORS、CHAT_MESSAGE_CLASS、INTERACTIVE_SELECTORS），是常量，不渲染。函数式组件：没有（大写命名的函数导出为 0）。探针文件已删除。 |
| 11 | 已知失败名单自我更新 | 过（部分用反向方式） | 名单是 `{}`，「从名单删一条」做不了。反向验证：(a) 加 `Badge`：1 条失败，`Error: Expect test to fail`。(b) 加 `NotAComponent`：失败，「这些名字已经不是公开组件，请从 ssr-known-failures.json 删掉」。(c) 为了证明「组件仍失败却不在名单」会红：删掉 `Kbd` 的参数表条目，`Kbd` 用例失败。另外把整个参数表清空，104 个用例失败，说明名单机制和参数表是联动的。全部已还原。 |
| 12 | 名单每条有道理 | 过 | 名单为空，按计划直接算过。额外确认空名单是真实的：清空参数表后失败原因全是 `Cannot read properties of undefined (reading 'label'/'items'/...)`，也就是缺必填 props，与实现者「失败都出在参数表上」的说法一致。抽查 Button/Toolbar/StatusDot/ToggleButton/Token 的 `label: string`、Timestamp 的 `value`、Toast 的 `body` 都是必填，需要参数表。没有发现需要进名单的、组件自身读 window 的失败。 |
| 13 | 能抓到 window | 过 | 在 `Badge.vue` setup 前加 `void window.innerWidth`：Badge 和 ChatComposerTokenElement 失败，「ReferenceError: window is not defined」。又试了 `navigator.language`：同样失败，说明删除 Node 自带 navigator 的做法确实起作用。已还原。 |
| 14 | 能抓到 Vue 警告 | 过 | 参数表里把 Button 的 `label` 改成对象：`Button` 失败，「Vue 警告：Invalid prop: type check failed for prop "label"」。已还原。 |
| 15 | allowEmpty 有理由 | 过 | 参数表里没有任何条目使用 `allowEmpty`（`grep -c` 只命中接口定义那一行）。类型是 `string`，要求写原因。没有要审的条目。 |
| 16 | Resizable 测试通过且无警告 | 过 | `vitest run --maxWorkers=2 packages/core/src/Resizable`：37 条全过，`grep -c "Vue warn"` = 0。每条用例结束还断言 `console.warn` 未被调用。 |
| 17 | 覆盖对照 | 过 | 读 `ResizeHandle.vue`。读屏属性：role、aria-orientation、valuenow/min/max/valuetext、aria-label（含默认文案）、aria-disabled、tabindex 都有测试。键盘：四个方向键、Shift 大步长、Home、End、Enter 折叠、反向、无上限 End，都有断言。指针：capture、move/up、竖向、其他 pointerId、cancel/lostpointercapture、反向、RTL、卸载恢复 body 样式。禁用：tabindex/aria-disabled/data-disabled，键盘、双击、拖动都不起作用。没有未覆盖的主要行为。 |
| 18 | 测试有效（变异） | 过 | 10 处变异全部被抓到并已还原：键盘步长 10→5（6 条失败）、Shift 步长 50→20（2 条）、删 aria-valuemin、删 aria-label、删 aria-valuetext、aria-orientation 对调、删 pointerDown 的禁用判断、删 keydown 的禁用判断、去掉 pointer 的 isReversed 符号、删 tabindex。每一处都至少有 1 条测试失败。 |
| 19 | ResizeHandle.vue 未改动 | 过 | `git diff swarm-tree -- packages/core/src/Resizable/ResizeHandle.vue` 输出 0 行。 |
| 20 | pnpm check 通过 | 过 | 按要求把 test 换成 `pnpm vitest run --maxWorkers=2`，其余照常：`check:packages` exit=0、`lint` exit=0、`typecheck` exit=0、vitest 218 个文件 2440 条全过且 0 个 Vue warn、`build` exit=0、`lint:pkg` exit=0。 |
| 21 | 未改组件源码 | 过 | `git diff $(git merge-base HEAD swarm-tree) --stat`：只有 9 个文件，分别是 package.json、ResizeHandle.test.ts、ssr-known-failures.json、ssr-smoke.fixtures.ts、ssr-smoke.test.ts、check-line-limit.mjs、白名单 json、配置 mjs、tests/check-line-limit.test.ts。没有任何 `.vue` 或组件源码。 |
| 22 | 新增源码文件不超 500 行 | 过 | check-line-limit.mjs 171 行、line-limit.config.mjs 49 行、ssr-smoke.fixtures.ts 165 行。测试文件 164/352/187 行（测试不受限）。 |

## 对实现者两处偏离的判断

1. 行数检查把未提交的新文件也算进去（`--cached --others --exclude-standard`）：合理，只会拦住更多东西，被 .gitignore 忽略的文件仍不统计。第 4 项就是靠它在 `git add` 之前也能测出来。
2. SSR 渲染时临时删掉 `navigator`、`sessionStorage`、`localStorage`：合理，也是加严。第 13 项实测 `navigator` 读取会被抓到，渲染后会还原（有专门的自检用例）。
3. 已知失败名单为空：合理，不削弱检查。因为参数表被清空时有 104 个失败，说明测试确实在检查，只是现有组件在给了必填 props 后都通过。

## 不通过的项要怎么改

无。

## 可选的小提示（不影响结论）

- `renderToString` 不跑 `onMounted`，所以只在挂载后访问浏览器对象的代码查不出来，实现者回报里已经说明。
- Resizable 与上游的行为差异（实现者回报第 4 节列了 8 条，例如使用者绑定的 `@keydown` 被过滤掉），按计划留给 C14，这一轮不算。

## 还原情况

所有临时改动（__verify_tmp.ts、白名单数字、Selector.vue 截短/加行、Badge.vue 加 window/navigator、ssr-known-failures.json、ssr-smoke.fixtures.ts、ResizeHandle.vue 的 10 处变异、临时探针测试文件）都已用 `git checkout`、`git rm --cached` 或删除还原。开始时 `git status` 为 clean，结束时也是 clean，两次相同。临时文件放在 /tmp/verify-A3/。

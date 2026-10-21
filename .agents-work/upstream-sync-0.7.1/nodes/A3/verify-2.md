# A3 工程护栏 · 第 2 轮验收报告

## 结论：通过

26 项检查全部为「过」。第 2 轮新增的代码只有提交 `9a1d2f2`，只改了 `ResizeHandle.test.ts` 一个文件。测试相关的检查，我都跑了两遍：一遍 `env -u NODE_ENV`，一遍 `NODE_ENV=production`。两遍的结果和用例数完全一样。

核心数字（全量 `pnpm vitest run --maxWorkers=2`）：

| 模式 | 测试文件 | 用例 | Vue warn | 退出码 |
| --- | --- | --- | --- | --- |
| `env -u NODE_ENV` | 218 通过 | 2440 通过 | 0 | 0 |
| `NODE_ENV=production` | 218 通过 | 2440 通过 | 0 | 0 |

## 逐条结果

第 1 到 8 项只涉及行数检查脚本，和测试环境无关。这一轮没有改动脚本、配置和白名单（`git show 9a1d2f2 --stat` 只有一个测试文件），所以沿用第 1 轮的结论。我只重跑了第 1 项和第 8 项里能直接看到的部分，作为确认。

| 编号 | 检查项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | 行数检查退出码 0 | 过 | `node scripts/check-line-limit.mjs` 输出「源码单文件行数检查通过（上限 500 行）」，exit=0。 |
| 2 | 白名单真实 | 过（沿用第 1 轮） | 脚本、配置、白名单这一轮没有改动。本轮新增的唯一改动是测试文件，不在统计范围内。 |
| 3 | 排除规则合理 | 过（沿用第 1 轮） | 同上，配置文件没有改动。 |
| 4 | 新文件超标被拦 | 过（沿用第 1 轮） | 同上。`tests/check-line-limit.test.ts` 的 13 条用例在两种模式下都通过（见第 25 项）。 |
| 5 | 白名单文件变大被拦 | 过（沿用第 1 轮） | 同上。 |
| 6 | 降到 500 行以内要删条目 | 过（沿用第 1 轮） | 同上。 |
| 7 | `--update` 只能收紧 | 过（沿用第 1 轮） | 同上。 |
| 8 | check:packages 调用脚本 | 过 | `package.json` 第 22 行 `check:packages` 末尾是 `node ./scripts/check-line-limit.mjs`。`env -u NODE_ENV pnpm check:packages` exit=0，输出末行是行数检查通过。 |
| 9 | SSR 冒烟通过、node 环境 | 过 | 第 1 行是 `// @vitest-environment node`。两种模式都是 212 条全过（见第 25 项）。 |
| 10 | 组件列表自动生成 | 过 | 两种模式下，verbose 输出里「ssr smoke」组件用例都是 206 条，「ssr smoke harness」自检 6 条，合计 212 条。206 = 203 个组件 + 3 条名单和参数表自检，与第 1 轮一致。测试仍然是从 `index.ts` 的导出里筛选，没有手写清单（这个文件这一轮没有改动）。 |
| 11 | 已知失败名单自我更新 | 过 | 名单仍然是 `{}`，沿用第 1 轮的反向验证方式，两种模式各做一遍：(a) 加 `Badge`：1 条失败，`Error: Expect test to fail`。(b) 加 `NotAComponent`：失败，提示「这些名字已经不是公开组件，请从 ssr-known-failures.json 删掉」。(c) 删掉参数表里 `Kbd` 的条目：`Kbd` 用例失败，提示「Vue 警告：Missing required prop: "keys"」。每次都是 `Tests 1 failed \| 211 passed (212)`，两种模式一致。已还原。 |
| 12 | 名单每条有道理 | 过 | 名单为空，按计划直接算过。这一轮没有改动名单。 |
| 13 | 能抓到 window | 过 | 在 `Badge.vue` 的 `defineOptions` 前加 `void window.innerWidth`：两种模式都是 2 条失败，报「Badge 没法在服务端渲染： Vue 错误：ReferenceError: window is not defined」。已还原。 |
| 14 | 能抓到 Vue 警告 | 过 | 参数表里把 `Kbd` 的 `keys` 改成对象：两种模式都是 1 条失败，报「Vue 警告：Invalid prop: type check failed for prop "keys"」。已还原。 |
| 15 | allowEmpty 有理由 | 过 | `grep -c "allowEmpty:" ssr-smoke.fixtures.ts` = 0，没有条目使用，没有要审的理由。 |
| 16 | Resizable 测试通过且无警告 | 过 | 两种模式都是 37 条全过，输出里 `Vue warn` 出现 0 次。 |
| 17 | 覆盖对照 | 过 | 读屏属性、键盘、指针、禁用状态这四类的用例都还在。用例数没变，还是 37 条。`9a1d2f2` 只是把「对根节点调用」换成「对 separator 元素调用」，没有删用例也没有削弱断言（我读了 diff 的前 150 行，其余行是同样的机械替换）。 |
| 18 | 测试有效（变异，两种模式） | 过 | 对 `ResizeHandle.vue` 做了 11 处变异，每处在 `env -u NODE_ENV` 和 `NODE_ENV=production` 下都被抓到，失败条数两边一致：键盘步长 10 改 5（6 条）、Shift 步长 50 改 20（2 条）、删 `aria-valuemin`（1 条）、删 `aria-label`（2 条）、删 `aria-valuetext`（1 条）、`aria-orientation` 对调（1 条）、删 `tabindex`（2 条）、删 `aria-disabled`（1 条）、`isReversed` 符号去掉（2 条）、指针按下去掉禁用判断（1 条）、键盘去掉禁用判断（1 条）。每次变异后立即 `git checkout -- ResizeHandle.vue`，已还原。 |
| 19 | ResizeHandle.vue 未改动 | 过 | `git diff swarm-tree --stat -- packages/core/src/Resizable/ResizeHandle.vue types.ts index.ts` 输出 0 行。 |
| 20 | pnpm check 通过 | 过 | 用 `env -u NODE_ENV`，test 一步换成 `pnpm vitest run --maxWorkers=2`：`check:packages` exit=0、`lint` exit=0、`typecheck` exit=0、vitest 218 个文件 2440 条全过、`build` exit=0、`lint:pkg` exit=0。跑完 `git status` 仍是干净的。 |
| 21 | 未改组件源码 | 过 | `git diff swarm-tree --name-only` 去掉 `.agents-work` 后只剩 `packages/core/src/Resizable/ResizeHandle.test.ts`。`.agents-work` 的差异是总控后来提交的文档，不算。 |
| 22 | 新增源码文件不超 500 行 | 过 | 这一轮没有新增源码文件。被改的测试文件现在是 361 行，测试文件本来也不受限。 |
| 23 | 两种模式全量测试 | 过 | 见上面的核心数字表。两种模式都是 218 个文件、2440 条用例，全部通过，用例数相同。输出文件在 `/tmp/verify-A3-r2/full-dev.txt` 和 `full-prod.txt`。 |
| 24 | 修复方式正确 | 过 | (a) 新增的 `separatorOf(wrapper)` 就是 `wrapper.get('[role="separator"]')`。(b) 我用 grep 在测试文件里找 `wrapper/horizontal/vertical/handle/mountStub(...)` 后面直接接 `attributes/trigger/classes/element/html/text` 的写法，除了 `separatorOf(...)` 之外一条都没有，说明没有遗漏的根节点读取。(c) `ResizeHandle.vue` 零改动，模板第 221 行的 `<!-- eslint-disable-next-line ... -->` 注释原样保留，没有靠删注释让测试通过。(d) 这个提交只动了一个测试文件，没有改任何配置。 |
| 25 | 两种模式的 SSR 冒烟和行数检查测试 | 过 | `ssr-smoke.test.ts`、`tests/check-line-limit.test.ts` 和 `Resizable` 三组一起跑：两种模式都是 3 个文件、262 条用例通过，0 个 Vue warn。其中 ssr-smoke 212 条、check-line-limit 13 条、ResizeHandle 37 条，两种模式的数字相同。 |
| 26 | 第 1 轮 9 到 18、20 项在不设 NODE_ENV 下重跑 | 过 | 上面第 9 到 18 项、第 20 项已经在不设 NODE_ENV 的模式下重新执行，需要变异的项两种模式都做了。结论和第 1 轮相同。 |

## 关于实现者的建议（改全局测试配置）

不影响本轮结论。我的看法：

- 这条建议说得对。根因是 `vitest.config.ts` 在 import 完 `vite.config.ts`（也就是 `@vitejs/plugin-vue`）之后才把 `NODE_ENV` 改成 `test`，所以模板编译器用哪一份是由外部环境决定的，运行时却永远是开发模式。这是一个「两头不一致」的隐患。
- 我建议单独开一个小任务来做，不要塞进 A3。因为它会改动全局测试配置，影响全部 218 个测试文件，需要把两种模式都再跑一遍。
- 做法上，我更倾向于让两种模式的编译结果一致，比如给 `vue()` 显式传 `template.compilerOptions.comments: true`，或者在加载插件之前就固定 `NODE_ENV`。这样根节点是否带注释就不再取决于终端环境。
- 在这之前，SWARM.md 里「跑两遍」的规定已经能挡住同类问题。这一轮的修法是对的：测试不该依赖根节点，这样就算以后配置变了也不会受影响。

## 不通过的项要怎么改

无。

## 还原情况

所有临时改动都已还原：SSR 变异里改过的 `ssr-known-failures.json`、`ssr-smoke.fixtures.ts`、`Badge.vue`，以及 Resizable 变异里改过的 `ResizeHandle.vue`。每次改完立即用 `git checkout -- <文件>` 还原，并删除了 `.bak` 备份。开始时 `git status --short` 是空的，结束时也是空的，`diff` 比对结果相同。临时输出文件放在 `/tmp/verify-A3-r2/`。

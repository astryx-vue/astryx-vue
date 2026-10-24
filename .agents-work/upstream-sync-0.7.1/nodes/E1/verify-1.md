# E1 拆分脚本与 CLI 生成器大文件 · 验收报告（第 1 轮）

## 结论：通过

16 条检查全部过。其中第 6 条有一处偏离清单的小事（见下），我判过，请总控确认。

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/E1`，分支 `sync/e1-split-scripts`，HEAD `e41828a`。
- BASE：`b7133ab`。`git rev-parse HEAD~5` 和 `git merge-base HEAD swarm-tree` 都是它。实现者的 5 个提交是 `fd4c297`、`aaf3c44`、`854eb1f`、`40a14fb`、`e41828a`。
- 基准 worktree：`/tmp/verify-E1/base`，检出 `b7133ab`，自己 `pnpm install --frozen-lockfile` 装好。验收后已删除。
- 环境：本机 shell 默认 `NODE_ENV=production`。构建、docs:build、check 各步一律用 `env -u NODE_ENV`。测试按规程跑两遍。

## 逐条结果

| 编号 | 检查项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | sync 产物逐字节相同 | 过 | 两边都 `pnpm build:packages` 成功，`sync-exports.mjs --check` 都输出「生成结果和已提交文件一致。」。`cmp` 比较 `core/src/index.ts`、`composables/index.ts`、`locale/messages.ts`、`core/styles.css`、`core/package.json`，5 个全部相同。`packages/themes/*.css` 两边各 8 个，逐个 `cmp` 无差异。 |
| 2 | CLI catalog 相同 | 过 | 两边 `pnpm --filter @astryx-vue/cli generate` 都输出 245 components, 31 topics, 53 templates。`cmp catalog.json`（5126311 字节）相同。 |
| 3 | llms 产物相同 | 过 | base、E1 依次各跑一次 `env -u NODE_ENV pnpm docs:build`，没有并行。日志里 `llms:` 几行相同（559 pages；llms.txt 59.1 KB；llms-zh.txt 82.4 KB；llms-full.txt 1803.9 KB；llms-full-zh.txt 1806.4 KB）。dist 里所有 `.txt` 和 `.md` 共 563 个，两边文件清单相同，逐个 `cmp` 差异数 0。`diff -rq` 整个 dist 只多报出 `components/timestamp.html` 和 `en/components/timestamp.html`。原因是 Timestamp 演示页把构建时的当前时间写进了 HTML（两边只差 21:53:59 和 21:54:39 这类秒数）。它是 HTML，不在 llms 产物里，和本次改动无关。 |
| 4 | `TEMPLATE_META` 不变 | 过 | 脚本 `/tmp/verify-E1/tm.mjs` 分别 import 两边的 `template-meta.ts`。条目数都是 53。`Object.keys` 顺序和 `JSON.stringify` 结果合在一起输出，`cmp tm-base.json tm-E1.json` 相同。 |
| 5 | 对外导出不变 | 过 | 用 TypeScript 编译器 API（`/tmp/verify-E1/tsexp.mjs`）对 4 个原入口列出全部导出名、声明种类和类型签名，两边 `cmp` 完全相同。`sync-exports.mjs` 导出 `syncExports`。`markdown.ts` 导出 10 个：`PageExample`、`PageExtract` 和 8 个函数。`template-meta.ts` 导出 `TEMPLATE_META` 和 `TemplateMeta`。`llms-txt.ts` 导出 14 个，包括 `SITE_URL`、`createExpander`、`ExpandContext`、`LlmsPage`、`LlmsPageEntry`。 |
| 6 | 引用路径未改、diff 范围 | 过（有一处偏离，见下） | 对仓库全文搜这 4 个文件名。引用方（`tests/*.test.ts`、`apps/docs/.vitepress/llms.ts`、`cli/src/templates.ts`、`format.ts`、`cli.test.ts`、`build-catalog.ts`、`package.json`、`line-limit.config.mjs`）的 import 路径一处都没变。`git diff b7133ab --stat`：33 个文件，包含 4 个原文件、25 个新子模块、白名单。没有测试文件被改。偏离：多出 3 个文档类文件，`packages/cli/README.md`、`README.zh-CN.md`、`catalog-types.ts`（只改一行注释）。三处都只是把「数据在 `template-meta.ts`」改成指向 `template-meta/` 目录，内容准确，没有改任何 import。清单里没列它们，请总控确认可以接受。 |
| 7 | 行数不超过 500 | 过 | 4 个原文件分别是 124、157、33、127 行。新模块最长是 `package-exports.mjs` 的 189 行。最短是 `types.ts` 14 行。全部不超过 500。 |
| 8 | 职责单一 | 过 | 每个模块的头部注释都能用一句话说清职责。没有 misc 或 utils 之类的杂烩文件。`sync-exports/source-layout.mjs`（29 行）被 package-exports、render-css、render-index、render-messages 4 个模块共用。`template-meta/types.ts`（14 行）被入口和 8 个数据文件共用。两个小文件都有理由，也不是单一使用方的碎片。其余模块都不少于 30 行。 |
| 9 | 入口变薄 | 过 | `sync-exports.mjs` 只剩汇总、写盘、eslint、比较、回滚和命令行入口。`markdown.ts` 保留 `extractPage`、`extractTopic` 等编排函数加重新导出。`template-meta.ts` 只做合并和重新导出。`llms-txt.ts` 保留 `generateLlmsArtifacts` 和 `writeArtifact`，其余是重新导出。没有残留大块逻辑。 |
| 10 | 无循环依赖 | 过 | 脚本 `/tmp/verify-E1/cyc.mjs` 从 4 个入口递归遍历相对 import，共 37 个文件，循环数 0。结构是入口指向子模块，子模块再指向 `source-layout`、`text`、`types`、`paths` 这类底层模块。 |
| 11 | 注释无变更历史 | 过（有说明） | `grep` 命中 2 处：`render-css.mjs:13`「styles.css 原来没有汇总」，`render-index.mjs:17`「composables/index.ts 原来没有收录」。这两句在 base 的 `sync-exports.mjs` 第 26、32 行就有，原样搬过来。它们讲的是为什么要排除这些文件，不是「从某文件拆出」的历史，所以判过。其余关键词没有命中。 |
| 12 | 白名单 | 过 | `git diff b7133ab -- scripts/guardrails/line-limit-allowlist.json` 只删了 `llms-txt.ts`、`markdown.ts`、`template-meta.ts`、`sync-exports.mjs` 这 4 条，加上 `TableData.vue` 末尾逗号的 JSON 格式调整，其余条目不变。`node scripts/check-line-limit.mjs` 在 `env -u NODE_ENV` 和 `NODE_ENV=production` 下都通过。 |
| 13 | 4 组测试，两边通过数相同 | 过 | 命令：`pnpm vitest run --maxWorkers=2 tests/sync-exports.test.ts tests/llms-txt.test.ts packages/cli/src/generate/ packages/cli/src/cli.test.ts`。base 和 E1 各跑 `env -u NODE_ENV` 与 `NODE_ENV=production` 两遍，共 4 次，结果都是 5 个文件、83 条全部通过。 |
| 14 | 测试覆盖新模块（3 处，要求至少 2 处） | 过 | 破坏后都已 `git checkout --` 还原。（1）`sync-exports/render-css.mjs`：把排序反过来，`sync-exports.mjs --check` 退出码 1，报 `styles.css` 不一致。（2）`markdown/tables.ts`：把 `columnKind` 的 type 列名改错，3 条测试失败（`markdown.test.ts` 2 条，`cli.test.ts` 1 条）。（3）`llms-txt/paths.ts`：把 `markdownPathFor` 的目录索引路径改错，`tests/llms-txt.test.ts` 的 `folds a directory index into a sibling file` 失败。 |
| 15 | 完整 `pnpm check` | 过 | 用 `env -u NODE_ENV` 逐步跑：`check-package-boundaries`、`check-path-case`、`sync-exports --check`、`generate:check`、`check-line-limit`、`lint`、`typecheck` 全部退出码 0。`build:packages` 和 `docs:build` 成功（见第 1、3 条）。`lint:pkg` 退出码 0。test 步骤换成 `pnpm vitest run --maxWorkers=2`：`env -u NODE_ENV` 下 218 个文件、2440 条全部通过。`NODE_ENV=production` 下也是 218 个文件、2440 条全部通过。实现者说的 ResizeHandle 14 条失败已被 BASE 的 `b7133ab` 修好，这次没有复现。 |
| 16 | 不新增依赖 | 过 | `git diff b7133ab --stat -- package.json pnpm-lock.yaml pnpm-workspace.yaml '**/package.json'` 输出为空。 |

## 开始与结束的 git status

- E1 工作区：开始和结束都是干净，`cmp` 相同。三处破坏性修改都已还原。
- 主仓库 `astryx-vue`：开始时有 `?? .agents-work/upstream-sync-0.7.1/nodes/A4/`，结束时已干净，`swarm-tree` 的 HEAD 从 `d7b4f10` 变成了 `8e82bd6`。这是并行的另一位验收者或总控提交了 A4 的文件，不是我造成的。我只在主仓库写了这份报告，没有动别的文件。

## 不通过的项要怎么改

没有不通过的项。

建议（不影响结论）：
- 请总控确认第 6 条中 README 两份和 `catalog-types.ts` 一行注释的改动可以接受。
- D4 起步时可以顺手处理实现者提到的两件小事。一是 `generatedFiles()` 里 composables 被解析两遍。二是 `LlmsPage.sitePath` 注释里的例子不准确。

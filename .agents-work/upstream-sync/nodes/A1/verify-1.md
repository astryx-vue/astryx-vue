# A1 验收报告 · 第 1 轮
结论：通过

工作区 `/Users/shenqingchuan/workspace/astryx-vue-wt/A1`，分支 `sync/a1-upstream-ledger`，提交 `04ff1a3`（rebase 在 `b7133ab` 之上）。上游 `96f9917f..v0.7.1`，上游 HEAD `7ae39ea46`。开始与结束各跑一次 `git status`，都是 `nothing to commit, working tree clean`，`diff` 无差异。临时文件都在 `/tmp/verify-A1/`。

| # | 检查项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | `--check` 退出码 0 | 过 | `node scripts/upstream-ledger.mjs --check` → `台账是最新的（50 个文件）。` exit=0 |
| 2 | 两次生成一致 | 过 | `--out /tmp/verify-A1/run1`、`run2` 各 50 个文件；`diff -r run1 run2` 无输出（SAME12） |
| 3 | 与已提交台账一致 | 过 | `diff -r run1 .agents-work/upstream-sync/ledger` 只有一行 `Only in ...: README.md`（README 是手写的，脚本不生成，README 里已写明）。其余 50 个文件相同 |
| 4 | 无时间戳 | 过 | 在 run1 里 grep `generated at`、`生成时间`、`2026-`、`T\d\d:\d\d:\d\d` 等，无任何命中 |
| 5 | 不漏提交 | 过 | `git rev-list --no-merges 96f9917f..v0.7.1 \| sort -u` = 1693；从台账链接提取的 40 位哈希去重 = 1693；`comm -23`（全集有、台账没有）= 0。节点文件 1350 + `_unrelated.md` 343 = 1693，两边交集为 0 |
| 6 | 无范围外提交 | 过 | `comm -13`（台账有、全集没有）= 0；1693 个短哈希也都是全集的前缀 |
| 7 | 未覆盖文件会报错 | 过 | 用 `git clone --shared` 做临时克隆 `/tmp/verify-A1/up2`，用 plumbing 命令在 v0.7.1 上提交 `weird/unknown.txt`（分支 weirdtest）；`--upstream /tmp/verify-A1/up2 --to weirdtest --out /tmp/verify-A1/x` → `有 1 个上游文件没有被任何归类规则命中：weird/unknown.txt`，exit=2，输出目录没有创建。（`--to HEAD` 在 `--shared` 克隆里因为缺对象无法 checkout，所以改用 plumbing 造提交，效果相同。）另在 `up` 克隆里得到 59 个未命中文件，是 `--from 7ae39ea46` 的范围里混入了该不完整克隆缺少的目录，也正确报错并退出码 2 |
| 8 | 九行抽查 | 过 | 在 `ledger/<节点>.md` 里按 `## 破坏性改动` 小节定位：5777977fe→C3、936b1f73a→C1、2e0dbb5b9→C5、a1a6a636f→B1、b507cdef4→C8、dfdd77805→C15、7ec7d16d3→B2、6ecd41722→D2、458ff35b1→D4，九条全部在期望节点的「破坏性改动」一节。上游标题也都带 `!` |
| 9 | 自选 3 个单组件提交 | 过 | 396e48759（Toolbar，只改 Toolbar.tsx/test）→ C14；62279335c（ContextMenu）→ C6；0472ec190（DateInput）→ C5。另外多看了 5 个：0365e236b CodeBlock.spec.md→C9；d72fc1255 SideNav doc→C13；8530ece69 Badge→C16；8112fcc62 TreeList→C12；917db9ef1 Banner+probe 主题→C15+D3。都与 ROADMAP 范围一致 |
| 10 | 跨节点标「还涉及」 | 过 | 5777977fe 在 C3 里写「还涉及：C1、D5、D7、D8、F3a」，并出现在 C1、D5、D7、D8、F3a；9b3e25a46（NumberInput+locales）同时在 B5 和 C1；5f9be6c18（Grid+cli docs）在 C14 和 D4 |
| 11 | `_unrelated.md` 抽查 | 过 | 随机抽 8 条（seed 7）：debb82b90、38e58e402、bdea6e22c、17306ce7a、840d66f06、78e8e1ce7、55fe415d7、e6dc4bda5。都是 storybook、CI、docsite、根脚本，且都有「原因」。另外把 `_unrelated.md` 里所有文件路径汇总：没有任何 `packages/{core,lab,cli,richtext,charts,themes,vega}` 下的源码、`.doc.mjs`、`.spec.md`（只剩 `package.json`、`CHANGELOG`、构建配置，规则写明原因）。额外复核了 6e84905d7、c050bc5a8、9e4c5458d、a37a8951d、3649b4370、docs/contributing/api-conventions.md，判断都无关 |
| 12 | 每个 core 组件目录都有对应规则 | 过 | 取 `96f9917f` 与 `v0.7.1` 两端 `packages/core/src/` 的目录并集共 111 个，逐个用 `classifyPath` 验证：106 个命中 `core-dir` 表；`Icon`→`core-icon`（B5+C16，已在「需要总控确认」）；`__tests__`→`core-tests-contract`（B6，已在「需要总控确认」）；`HStack`、`VStack`、`VisuallyHidden`→`core-dir-extra`（C14，规则里带 review 说明）。后三个目录在 `96f9917f..v0.7.1` 内没有任何提交（`git log -- <目录>` = 0），所以不出现在 `_summary.md`「需要总控确认」里。备注：不算兜底漏接，但若总控想在摘要里看到这三个目录，需要让脚本把「零命中的 review 规则」也列出来 |
| 13 | C3.md 格式 | 过 | 有 `- [ ]` 勾选框；`## 破坏性改动` 单独成节；2769 个条目的链接全部匹配 `https://github.com/facebook/astryx/commit/<40位哈希>$`，没有一个不匹配的；`curl -sI https://github.com/facebook/astryx/commit/5777977fea4a8ebc29ea47621eaafb56140e6383`（走代理）→ 200；条目下有「规范文档」（`.spec.md`/`.doc.mjs`）和「测试」行。排序：相邻三条 01592f7b7（2026-08-16）→22e61b523（08-18）→1fdecb1ae（08-20），`git log -1 --format=%ci` 核对顺序正确。另写脚本对全部 2426 条节点条目做时间顺序检查：只有 C4 里 14781b556 与 598700a96 两条时间戳相同（1787587855），脚本按哈希字典序排（14781b < 598700），确定且稳定，不算违规 |
| 14 | 总表数量和 | 过 | 脚本解析 `_summary.md` 总表 60 行，提交数之和 = 2769；数各台账文件里的条目（含 `_unrelated.md`）= 2769；逐个节点比对无 MISMATCH |
| 15 | README 三件事 | 过 | `ledger/README.md`：「重新生成」一节给出命令；「怎么改规则」一节列出各类修改位置；参数表列出 `--from/--to/--upstream/--out/--check` 及默认值，另有退出码说明 |
| 16 | 测试通过且不依赖上游 | 过 | `env -u NODE_ENV pnpm vitest run --maxWorkers=2 tests/upstream-ledger.test.ts` → 72 passed；`NODE_ENV=production` 同样 72 passed；两种模式下再加 `ASTRYX_UPSTREAM_DIR=/nonexistent/path` 各跑一次，仍是 72 passed。测试在 `mkdtemp` 的临时 git 仓库里造提交（`tests/upstream-ledger.test.ts` 第 133–177 行） |
| 17 | 测试覆盖 | 过 | 对照测试代码：跨节点提交（189 行「跨节点提交两边都有，并互相标出还涉及」）；两种写法破坏性（200 行；另有 `isBreaking` 单测）；无关提交（211 行）；未覆盖文件报错（229 行，`UnmatchedFilesError`）；两次运行一致（241 行）；另有 D7/pins、总表、参数解析、规则表登记节点校验 |
| 18 | `pnpm check` | 过 | 按 `package.json` 里 `check` 的顺序拆开跑（`env -u NODE_ENV`）：`check:packages` exit 0（含 500 行检查「源码单文件行数检查通过」）；`lint` exit 0；`typecheck` exit 0；测试步骤换成 `pnpm vitest run --maxWorkers=2` → 219 个文件、2512 tests passed，exit 0；`build` exit 0（`build complete in 29.35s`）；`lint:pkg` exit 0。测试步骤另用 `NODE_ENV=production` 再跑一遍：219 个文件、2512 tests passed，exit 0 |
| 19 | 文件不超 500 行 | 过 | `wc -l`：`upstream-ledger.mjs` 149、`commits.mjs` 154、`render.mjs` 211、`rules.mjs` 406 |
| 20 | 无新增依赖 | 过 | `git diff HEAD~1 --name-only` 只有 4 个脚本文件、1 个测试文件和 `ledger/` 下文件；`package.json`、`pnpm-lock.yaml` 均未改动 |
| 21 | 规则表独立、unrelated 有原因 | 过 | 规则在 `scripts/upstream-ledger/rules.mjs`。`unrelated(id, pattern, reason)` 强制要原因；查表型的 `SPEC_UNRELATED`、`KNOWLEDGE_DOC_UNRELATED` 每项也都有原因。`_unrelated.md` 里 343 条都带「原因」 |

## 对实现者四处偏离的判断

1. `COMMIT_PINS` 按 PR 编号把 #6118、#7289、#7331 追加到 B6：合理。ROADMAP B6 点名了这三项，但按路径归类根本到不了 B6；条目里写了「归入原因」。
2. 18 个破坏性提交全部追加到 D7：合理。我另外独立数了一遍：标题带 `!` 的 18 个（git log 加 grep 匹配 `^type(scope)!:`），正文含 `BREAKING CHANGE` 的 2 个（458ff35b1、dfdd77805）都已在 18 个之内，并集仍是 18；D7 「破坏性改动」一节的 18 个短哈希与这 18 个 `comm -3` 无差异。
3. 每条多一行「测试」：合理，ROADMAP A1 说明要求列出测试文件，台账确实有。
4. 上游目录参数多找一处（git worktree 主工作区旁边）：合理，只影响默认值的查找，不改变结果；README 已写明。

## 不通过的项要怎么改
无。

## 给总控的备注（不影响结论）
- D4 有 313 个提交、783 个文件，偏重。原因是 `cli-other` 规则把 `packages/cli/assets/docs` 等全部兜给 D4，实现者已在回报里列出，请总控决定是否拆分。
- `HStack/VStack/VisuallyHidden`：ROADMAP 没提，脚本归 C14，上游这个范围内对它们零提交，不影响工作量。
- 重新生成会覆盖已打的勾，README 已写明处理方式（先在 swarm-tree 重新生成，各节点再 rebase）。

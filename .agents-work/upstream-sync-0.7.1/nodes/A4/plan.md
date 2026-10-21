# A4 蜂群基础设施 · 执行计划

## 目标

把 `SWARM.md` 里那些靠总控手工执行的约定，做成能直接运行的小工具。同时修掉 A2、A3 留下的 5 条遗留问题。

做完以后，总控派一个节点只需要三步：

1. 一条命令建好工作区。
2. 用模板写出计划。
3. 一条命令更新状态，进度图和总表会自动保持一致。

B 阶段的 7 个节点和后面所有节点都要用这些工具，所以它们必须稳。

## 工作环境

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/A4`，分支 `sync/a4-swarm-infra`。只在这里改。
- 动手前先读三份文件：
  - `/Users/shenqingchuan/workspace/astryx-vue/.agents-work/upstream-sync-0.7.1/SWARM.md`（全文）
  - 同目录下的 `ROADMAP.md`（看「全局进度树状图」和「当前状态总表」的格式）
  - `nodes/A4/carry-over.md`（遗留问题）
- 已有的工具：
  - `scripts/swarm/browser-lock.mjs`、`scripts/swarm/visual-compare*`（A2 做的）
  - `scripts/upstream-ledger*`（A1 做的）
  - `scripts/check-line-limit.mjs`（A3 做的）
- 所有测试和构建命令前面加 `env -u NODE_ENV`。vitest 一律加 `--maxWorkers=2`。
- 浏览器纪律：本节点只有第 6 项要开浏览器。只能用 `pnpm visual` 或者 `browser-lock.mjs run` 开。文档站用 **5171** 端口（1 号槽位）。

## 要做的事

### 1. 状态脚本 `scripts/swarm/status.mjs`

`ROADMAP.md` 是唯一的进度来源。节点状态会同时出现在三个地方：mindmap 里的 emoji、总表里的「状态」列、依赖关系。现在都靠手改，容易对不上。这个脚本负责把它们管起来。

- `status.mjs check`：
  - 解析 `ROADMAP.md`，检查 mindmap 里每个节点的 emoji 和总表里的状态一致。
  - 总表里每个节点的依赖都存在。
  - 不能出现「依赖没有全部完成，却已经是可开工或之后的状态」的节点。
  - 没有节点只出现在 mindmap 或只出现在总表。
  - 依赖里的「C全部」「F3a–F3e」这类简写也要能展开。
  - 有问题就列出来，退出码 1。
- `status.mjs ready`：列出「依赖全部完成、自己还是未开始」的节点。也就是应该改成可开工的节点。按「下游节点数」从多到少排序，这就是派活顺序。
- `status.mjs set <节点> <状态> [--round N] [--impl 名字] [--verify 名字] [--result 文本] [--pr 文本]`：
  - 同时改 mindmap 的 emoji 和总表的那一行。
  - 改完自动跑一遍 check。
  - 节点变成「已完成」后，自动把那些依赖已经全部完成的下游节点从「未开始」改成「可开工」。
  - 状态名同时接受中文（「验收中」）和英文简写（`verifying`）。
- `status.mjs show`：在终端里打印一份简短的现状，按阶段分组，每个节点一行。
- 解析和改写都要很保守。只改需要改的那几处，文件其它内容一个字节都不动。改写前后可以做一次「除目标行以外完全相同」的自检。

### 2. 工作区脚本 `scripts/swarm/worktree.mjs`

- `worktree.mjs new <节点ID> <简短名>`：
  - 从 `swarm-tree` 切出 `sync/<小写节点ID>-<简短名>` 分支，建到 `../astryx-vue-wt/<节点ID>`。
  - 分配一个空闲的槽位号（1–4），记到 `$(git rev-parse --git-common-dir)/swarm-slots/<槽位>.json`。端口按 `5170 + 槽位号` 计算。
  - 执行 `pnpm install --frozen-lockfile`。
  - 最后打印工作区路径、分支、槽位和端口。
  - 4 个槽位都被占了就报错，提示先清理。
- `worktree.mjs rm <节点ID>`：删掉工作区和分支（分支没合入时拒绝删除，加 `--force` 才删），释放槽位。
- `worktree.mjs ls`：列出现有的节点工作区、槽位、端口、分支，以及这个分支领先 `swarm-tree` 几个提交。
- `worktree.mjs rebase <节点ID>`：把节点分支 rebase 到最新的 `swarm-tree`。遇到冲突时，如果冲突的只是 `pnpm sync` 生成的那些文件（清单从 `scripts/sync-exports.mjs` 的 `generatedFiles` 取，不要另外写死一份），就自动用节点这一边的版本，再在工作区跑一次 `pnpm sync` 重新生成，然后继续 rebase。还有别的冲突就停下来，报出冲突文件。
- `worktree.mjs merge <节点ID>`：
  - 先 rebase。
  - 跑一遍 `env -u NODE_ENV` 下的完整检查：check:packages、lint、typecheck、vitest（加 `--maxWorkers=2`）、build、lint:pkg。
  - 全部通过后，fast-forward 合入 `swarm-tree`，然后删掉工作区。
  - 任何一步失败就停下，不合入。
  - 这就是总控「复核加合入」的那一步。

### 3. 计划模板

放在 `.agents-work/upstream-sync-0.7.1/templates/` 下：

- `plan.md`：照 `SWARM.md` 里 plan.md 的必填项写成模板。要包含「上游这条改动让用户看到或感受到了什么」「有没有更适合 Vue 的做法」这两节，规程要求先讲效果、再讲实现。
- `verify.md`：照 `SWARM.md` 里 verify.md 的必填项写成模板。要包含环境要求（`NODE_ENV` 两遍、浏览器锁、端口），以及 C 节点通用的 6 条检查。
- `impl-report.md` 和 `verify-report.md`：两份回报的格式。
- 可以参考现有的 `nodes/A1`、`A2`、`A3`、`E1`、`E2`、`E4` 里写得好的部分。

### 4. 台账重新生成时保留勾选

现在重新跑 `scripts/upstream-ledger.mjs` 会把各节点已经打的勾冲掉。改成这样：

- 写入前先读出旧台账里已勾选的条目（按提交短哈希和节点来认），新台账里同一条继续保持勾选，勾后面附的备注也保留。
- `--check` 比较的时候忽略勾选状态和备注，只比较条目本身。
- 补上相应的测试。

### 5. 修 A2 和 A3 的遗留问题

`nodes/A4/carry-over.md` 里有 5 条，逐条修掉：

1. 窄屏下内容框会漏掉贴边的内容：改成只排除四个圆角区域，不要整圈都排除。
2. README 里写的上游选择器和代码不一致：改成一致。
3. 组件名拼错时报错太晚：在起服务、拿锁之前，先用 HTTP 请求检查上游页面和我们的 slug 是否存在。
4. README 里提醒验收者用 `--out /tmp/...`。
5. 测试配置不要受外部 `NODE_ENV` 影响：让 vitest 的运行结果和外面的 `NODE_ENV` 无关。可以在 `vitest.config.ts` 里给 `vue()` 显式传 `template.compilerOptions.comments: true`，也可以用别的你认为更好的办法。改完以后，原来只在开发模式下才会出现的「根节点变成 Fragment」问题，要能在两种模式下都暴露出来。
   - 改完要跑两遍全量测试。注意：这一条可能会让一批原来能通过的测试失败，因为它们和 ResizeHandle 有同样的问题。如果出现这种情况，一并修掉这些测试（只改测试，不改组件），并在回报里列出来。

`.github/workflows/release.yml` 里已经有一个 `test-under-production-env` job，你改完以后它要仍然有意义，或者在回报里说明它是不是可以简化。

### 6. 更新 SWARM.md

把规程里「总控手动执行」的步骤，改成对应的命令：

- 派活前：`status.mjs ready`
- 建工作区：`worktree.mjs new`
- 改状态：`status.mjs set`
- 复核加合入：`worktree.mjs merge`

这一节可以改 SWARM.md。**不要改** ROADMAP.md 里节点的状态（那是总控的事），但可以用 `status.mjs check` 去检查它。

最后在你的工作区里用浏览器跑一次 `pnpm visual Button --out /tmp/a4-visual`，确认第 5 节的第 1、3 条修好了：拼错组件名时，要在开浏览器之前就报错。

## 测试

- `tests/swarm-status.test.ts`：用一份裁剪过的 ROADMAP 样本（放在 fixtures 里）测这几项：
  - 解析
  - check 能发现各类不一致
  - set 同时改两处，其它内容不变
  - 完成一个节点后，下游自动变成可开工
  - 简写依赖能展开
  - ready 的排序
- `tests/swarm-worktree.test.ts`：在临时目录里 `git init` 一个小仓库，测这几项：
  - new、ls、rm
  - 槽位分配和释放
  - 槽位占满时报错
  - rebase 时生成文件冲突能自动处理，其它冲突会停下
  - merge 的检查命令可以替换成假的，方便测试
- 台账保留勾选的测试，加到现有的 `tests/upstream-ledger.test.ts` 里。
- 视觉工具改动对应的测试，加到 `tests/visual-compare.test.ts` 里。

## 自测清单

1. 用真实的 `ROADMAP.md` 跑 `status.mjs check`，通过。如果没通过，说明现在的 ROADMAP 本身有不一致，**不要改 ROADMAP**，把问题写进回报。
2. `status.mjs ready` 的输出和你自己读 ROADMAP 得出的结论一致。
3. 把 ROADMAP 复制到 `/tmp` 里，在副本上跑一次 `set` 和一次「完成后自动解锁下游」，用 diff 确认只改了该改的行。
4. 在真实仓库上跑 `worktree.mjs new ZZ test-a4`，然后 `ls`，再 `rm`。确认分支、工作区、槽位都清理干净了。
5. 两种 NODE_ENV 下都跑全量测试，全部通过，用例数相同。
6. 完整的 `env -u NODE_ENV pnpm check` 通过，其中 test 那一步换成 `pnpm vitest run --maxWorkers=2`。
7. 新写的源码文件都不超过 500 行。

## 提交与回报

- 在分支上提交，提交信息用中文。可以分几次提交。不要推送。
- 回报写到 `/Users/shenqingchuan/workspace/astryx-vue/.agents-work/upstream-sync-0.7.1/nodes/A4/impl-1.md`（写在主仓库这个路径），内容包括：
  1. 每个工具的用法和关键设计。
  2. 5 条遗留问题分别怎么修的。如果第 5 条连带修了其它测试，把它们列出来。
  3. 用真实 ROADMAP 跑 `status.mjs check` 的结果。
  4. 自测清单每一项的结果。
  5. 拿不准的地方。
- 最终回复用中文，300 字以内。

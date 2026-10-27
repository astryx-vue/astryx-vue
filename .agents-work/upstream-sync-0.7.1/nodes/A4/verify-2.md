# A4 蜂群基础设施 · 第 2 轮验收报告

- 验收对象：`/Users/shenqingchuan/workspace/astryx-vue-wt/A4`，分支 `sync/a4-swarm-infra`，提交 `12823cb`。第 2 轮新增 `c73e303`、`12823cb` 两个提交。
- 临时文件都在 `/tmp/verify-A4-r2/`。真实 `ROADMAP.md` 没有执行过 `set`（改写类操作都在它的副本上）。真实仓库上只用了 `ZZ1` 一个假节点（槽位 4），A4、E3、F0 没有动。
- 结论：**通过**，33 项全部通过。发现 1 个小问题（软链接修复在极少见的调用方式下会抛错），不阻塞，见末尾。

## 检查结果

「沿用第 1 轮」的条目，证据是 `git diff HEAD~2 --stat`：第 2 轮只改了 12 个文件，分别是 `SWARM.md`、`scripts/swarm/README.md`、`status.mjs`、`worktree.mjs`、`worktree/integrate.mjs`、`worktree/json-merge.mjs`（新）、`worktree/slots.mjs`、`worktree/sync-conflicts.mjs`（新）、`sync-exports.mjs`、`sync-exports/package-exports.mjs`、`tests/swarm-json-merge.test.ts`（新）、`tests/swarm-worktree.test.ts`。没有碰模板、台账、`image.mjs`、`capture.mjs`、`vite.config.ts`、`vitest.config.ts`、任何组件。

| 编号 | 检查项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | 真实 ROADMAP 跑 `status.mjs check` | 过（重验） | `status.mjs` 被改过（入口判断）。用真实 ROADMAP 的当前副本跑：「60 个节点，树状图与总表状态相同，依赖都满足」，退出码 0。 |
| 2 | `ready` 与手工推算一致，下游数排序 | 过（重验） | 副本上 `ready`：没有该解锁的；等待派发的只有 D4a（下游 5 个）。和第 1 轮手工推算一致（A4 仍是验收中，E3 实现中）。排序逻辑代码没改，沿用第 1 轮的手工数下游结论。 |
| 3 | 4 种坏输入被 `check` 发现 | 过（沿用第 1 轮 + 抽查） | 状态检查代码没改（status.mjs 只改了 import 和入口两处）。抽查 2 种：B2 的依赖改成 Z9，报「B2：依赖「Z9」不存在」，退出码 1；总表删掉 B3，报「B3：只出现在进度树状图里，总表没有这一行」并列出 7 个依赖它的节点。其余 2 种（emoji 对不上、依赖未完成就改实现中）沿用第 1 轮。 |
| 4 | `set` 只改两行 | 过（重验） | 副本上 `set B1 实现中 --impl X --round 1 --force`，`diff` 只有 2 处（mindmap 17 行、总表 310 行，共 4 个 diff 行）。 |
| 5 | A4 完成后解锁下游 | 过（沿用第 1 轮） | `status.mjs` 的 diff 只有 `import` 一行和入口一行，解锁逻辑未改。 |
| 6 | `C全部` 简写展开 | 过（沿用第 1 轮） | 同第 5 条，展开逻辑未改。 |
| 7 | 状态名与错误状态 | 过（重验） | `set B1 胡说` 退出码 2；`status.mjs bogus` 打印用法，退出码 2。 |
| 8 | 真实仓库 `new ZZ1` | 过（重验） | 真实仓库上 `worktree.mjs new ZZ1 r2verify --slot 4`：分支 `sync/zz1-r2verify`，HEAD `c26ee80` 等于 swarm-tree；路径 `…/astryx-vue-wt/ZZ1`；`node_modules` 已装；打印槽位 4、端口 5174；`.git/swarm-slots/4.json` 存在。随后 `rm ZZ1`（分支没有新提交，不用 `--force`）清理干净。另在 /tmp 克隆里也跑了一遍，结果一致。 |
| 9 | 槽位占满 | 过（重验） | /tmp 克隆里建 ZZ1–ZZ4 占满 4 个槽位（端口 5171–5174），第 5 个 `new ZZ5` 报「4 个槽位都被占了」，退出码 1。`git worktree list`、`git branch --list 'sync/zz*'`、`ls repo-wt` 里都没有 ZZ5。全部清理后 `swarm-slots/` 目录也消失。 |
| 10 | `ls` 输出 | 过（重验） | 在 ZZ1 提交一个文件后，`ls` 显示「领先 1」，其他显示「领先 0」。真实仓库的 `ls` 对 A4/E3/F0 显示「领先 8，落后 1」等，对 ZZ1 显示槽位 4、端口 5174。 |
| 11 | `rm` 拒绝与 `--force` | 过（重验） | 有未合入提交的 ZZ1：`rm` 报「还没合入 swarm-tree，确认不要了就加 --force」，退出码 1；`--force` 成功，槽位 1 被释放。 |
| 12 | rebase 冲突处理 | 过（重验） | 测试里「只有生成文件冲突」和「还有别的冲突就放弃」两类都有，另新增 `package.json` 4 个用例。手工：①两边都改 `index.ts`：自动合并，`pnpm sync --check` 通过，工作区干净；②两边都改 `README.md`：退出码 1，报冲突文件 README.md，节点 HEAD 与 rebase 前相同、工作区干净；③节点有 2 个提交、每个提交都新增组件、基线也新增组件：两次冲突都自动处理，最终 7 个 Zz 组件都在 exports，`--check` 通过。 |
| 13 | 检查不过不合并 | 过（重验） | 测试里有 4 个相关用例（失败/多出改动/手动冲突/在要删的工作区里）。手工：检查命令 `exit 3`，输出「检查没通过（退出码 3）…没有合入」，swarm-tree 提交号不变，ZZ1 保留，锁目录为空。检查通过后才 fast-forward 并删工作区。（这次 rebase 也走了新的自动合并路径。） |
| 14 | 生成文件清单来自 `sync-exports` | 过（重验） | `sync-conflicts.mjs:14` `import { generatedFiles, partlyGeneratedFiles } from '../../sync-exports.mjs'`。grep 整个 `scripts/swarm` 没有另写的清单。`partlyGeneratedFiles` 在 `sync-exports.mjs` 里调用 `package-exports.mjs` 的 `syncOwnedPackagePath`，规则和生成器放在同一个文件里。 |
| 15 | 4 个模板 | 过（沿用第 1 轮） | `git diff HEAD~2 --stat` 里没有 `templates/`。 |
| 16 | SWARM.md 命令与脚本一致 | 过（重验） | SWARM.md 本轮改了第 3 条（rebase 描述），README 也改了。照文档跑通了 `ready`、`set`、`new`、`ls`、`rm`、`rebase`、`merge`（见第 12、13、30、33 条）。`worktree.mjs --help` 里 rebase 的说明与文档一致。 |
| 17 | 台账保留勾选和备注 | 过（沿用第 1 轮） | diff 里没有台账相关文件。 |
| 18 | `--check` 一致与不一致 | 过（沿用第 1 轮） | 同上。 |
| 19 | 窄屏内容框 | 过（沿用第 1 轮） | diff 里没有 `image.mjs`。 |
| 20 | README 选择器与代码一致 | 过（沿用第 1 轮） | diff 里 README 只改了 worktree 部分（rebase/merge/槽位目录），没动 capture 相关段落，`capture.mjs` 未改。 |
| 21 | 组件名拼错提前报错 | 过（沿用第 1 轮） | 视觉对照脚本未改。 |
| 22 | README 提醒 `--out /tmp/...` | 过（沿用第 1 轮） | README 改动只在 worktree 段，该提醒未被动过（`git diff HEAD~2 -- scripts/swarm/README.md` 只有一个 @@ 块，在第 240 行附近）。 |
| 23 | NODE_ENV 无关 | 过（重验） | `vite.config.ts`、`vitest.config.ts` 没有改动。全量 vitest：`env -u NODE_ENV` 227 文件 2683 条通过；`NODE_ENV=production` 227 文件 2683 条通过，用例数相同。回退配置的反向检查沿用第 1 轮（配置没有变化）。 |
| 24 | 连带修改的测试 | 过（重验） | 第 2 轮改动的测试只有 `swarm-worktree.test.ts`（新增）和 `swarm-json-merge.test.ts`（新建），没有组件或组件测试被改。 |
| 25 | `pnpm visual Button` | 过（沿用第 1 轮） | 本轮不开浏览器，视觉脚本、`image.mjs` 未改。 |
| 26 | 新增测试 + 完整 check | 过（重验） | 新增测试在两种 NODE_ENV 下都通过（`swarm-worktree` + `swarm-json-merge`，production 下 34 条通过）。`env -u NODE_ENV` 下 `check:packages`、`lint`、`typecheck`、`build`、`lint:pkg` 退出码都是 0；test 一步用上面 `--maxWorkers=2` 的两次全量代替。`check:packages` 里包含 `sync-exports --check` 和行数检查。跑完 `git status` 为空。 |
| 27 | 文件行数与白名单 | 过（重验） | `check-line-limit` 输出「通过（上限 500 行）」。新文件：`json-merge.mjs` 81 行、`sync-conflicts.mjs` 121 行；最大的是 `integrate.mjs` 215 行。`git diff HEAD~2` 没有 `scripts/check-line-limit.mjs` 或 guardrails 的改动，白名单没有新增。 |
| 28 | 结束时无残留 | 过（重验） | 见下方「收尾状态」。 |
| 29 | 真实场景：两边各新增一个组件 | 过 | 在 `/tmp/verify-A4-r2/repo`（真实仓库的克隆，装了依赖）里，ZZ1 新增 Zzzz，基线新增 Zzaa，两边都跑真实 `pnpm sync` 并提交。先用普通 `git rebase` 确认：`package.json` 和 `index.ts` 同时冲突。然后（经 `/tmp` 软链接路径）执行 `worktree.mjs rebase ZZ1`：退出码 0，日志「已合并，重新生成：package.json、index.ts」。结果：`exports` 和 `publishConfig.exports` 里都有 `./Zzaa`、`./Zzzz`；`index.ts` 里两条导出都在；`pnpm sync --check` 输出「一致」退出码 0；`git status` 为空；没有 rebase 残留；`git diff swarm-tree HEAD` 只有 3 个文件、11 行新增，`package.json` 里只多了 Zzzz 的两段，没有格式上的变动。 |
| 30 | 不吃掉别人的改动（含依赖升级） | 过 | 克隆里：基线把 `dependencies.overlayscrollbars` 改成 `^9.9.9` 并新增 Zzbase；节点新增 Zznode。`rebase` 退出码 0。结果：`dependencies.overlayscrollbars` 是 `^9.9.9`（基线的改动保留）；`exports` 和 `publishConfig.exports` 里是 Zzaa、Zzbase、Zznode 三个；`pnpm sync --check` 通过；`git diff swarm-tree HEAD` 只有节点自己的 3 个文件 11 行新增，没有改到依赖行。测试里另有「基线改 description 和 `publishConfig.access`，节点加依赖」的用例。 |
| 31 | 该停的时候要停 | 过 | 克隆里：节点把 `description` 改成 `node desc` 并新增组件，基线把它改成 `base desc` 并新增另一个组件。`rebase` 退出码 1，输出「rebase 在提交 8e9c17e 上遇到冲突，已放弃这次 rebase，分支保持原样。冲突文件：packages/core/package.json：两边都改了 description，改法不同」。HEAD 与 rebase 前相同，`git status` 为空，没有 `rebase-merge` 目录，description 仍是 `node desc`，swarm-tree 不变。另有测试覆盖 `exports["./locale"]` 手写条目两边不同也会停下。 |
| 32 | 29、30、31 在测试里有对应用例，两种 NODE_ENV 都过 | 过 | `swarm-worktree.test.ts` 的 describe「rebase 时 package.json 的冲突」有 4 个用例：「两边各新增一个组件…」对应 29；「基线改了 description、节点改了依赖并新增组件…」对应 30；「两边把同一个非 sync 字段改成不同的值…」对应 31；「exports 里手写的条目…也要停下」是补充。用的是真的 `syncExports`，不是假 sync。两种 NODE_ENV 都通过（63 条 / production 34 条）。注意测试里的依赖用例是「节点加依赖、基线改 description」，没有「基线升级依赖版本」这种写法，这个组合我在第 30 条手工补测过，通过。 |
| 33 | 第 1 轮的两个小提示 | 过 | ①空 `swarm-slots/`：释放最后一个槽位后目录被删（克隆里 `rm` 后 `ls .git/swarm-slots` 报不存在，真实仓库同样）；还有登记时保留；测试里有对应用例。占槽加了 ENOENT 重建目录重试，最多 3 次，我读了代码，逻辑正确。②在要删的工作区里执行 merge：实际跑了 3 次——工作区根目录、子目录 `packages/core`、经 `/tmp` 软链接路径，都输出「merge 结束时会删掉这个工作区，请在主工作区里执行，或者加 --keep。什么都没有改」，退出码 1；节点 HEAD、swarm-tree 不变，没有锁，槽位登记还在。 |

## 软链接修复的判断

**核心修复正确。** 问题是 `/tmp` 在 macOS 上指向 `/private/tmp`，原来用字面路径比较 `import.meta.url` 和 `argv[1]`，对不上就什么都不跑还返回 0。验证：
- 把修复前的 `status.mjs` 取出来，从 `/tmp/...` 路径调用：什么都不输出，退出码 0（问题重现）。修复后同样调用：正常输出，退出码 0。
- 相对路径调用、通过软链接指向的脚本文件调用，都正常。
- 被 `import` 时不会误跑主逻辑（`import()` 后只拿到函数）。
- 全部 2683 个测试通过（测试里大量 `import` 这两个模块）。

**新问题（小，不阻塞）：** `realpathSync(argv[1])` 在 `argv[1]` 不存在时会抛 `ENOENT`。修复前同样的调用不会报错。能触发的情况很少：比如 `node -e "import('…/status.mjs')" 某个参数`，或者用 stdin 加参数运行（`node - foo`）时，`argv[1]` 是个不存在的路径，这时仅仅 `import` 这个模块就崩了（我实测复现：`ENOENT: no such file or directory, lstat '…/someArg'`）。正常 `node script.mjs`、vitest、`node -e` 不带参数都不受影响。建议后续给 `realpathSync` 包一层 try/catch，找不到就当作不是直接运行。另外 `changed-components.mjs`、`browser-lock.mjs`、`visual-*.mjs` 有同样的老写法没改，实现者已说明不在本节点范围，我同意先不动，但它们从 `/tmp` 软链接调用同样会静默。

## 其他观察（不影响结论）

1. 合并后的 `package.json` 用 `JSON.stringify(…, 2)` 重写。我核对了当前文件原文等于重写结果，所以 diff 里没有格式噪音；以后如果有人手工把数组写成一行，会被规范化。已在实现回报里说明。
2. 数组整体比较：两边各往 `files` 里加一项会算冲突、停下来。偏保守，但不会丢改动。
3. 节点分支有多个提交时，每个提交的冲突都会单独处理（我跑了 2 个提交的场景，通过）。

## 收尾状态

| 位置 | 状态 |
| --- | --- |
| 真实工作区 A4 | `git status` 为空，HEAD `12823cb` |
| 真实主仓库 | `git status` 为空；`git worktree list` 只有主工作区、A4、E3、F0；`git branch --list 'sync/zz*'` 为空；`.git/swarm-slots` 不存在；`.git/swarm-locks` 为空；swarm-tree 仍是 `c26ee80`；`astryx-vue-wt` 里只有 A4、E3、F0 |
| 端口与进程 | 5171–5174 无监听，无 headless 进程 |
| /tmp 克隆 | 里面的 ZZ 工作区和 `sync/zz*` 分支已全部清掉（`git worktree list` 只剩克隆本身）；克隆目录保留在 `/tmp/verify-A4-r2/`，不影响仓库 |

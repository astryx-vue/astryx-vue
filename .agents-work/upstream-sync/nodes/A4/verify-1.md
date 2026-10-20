# A4 蜂群基础设施 · 第 1 轮验收报告

- 验收对象：`/Users/shenqingchuan/workspace/astryx-vue-wt/A4`，分支 `sync/a4-swarm-infra`，提交 `c121d02`，BASE 为 `53b27a8`。
- 临时文件都在 `/tmp/verify-A4/`。没有在真实 `ROADMAP.md` 上执行 `set`。
- 结论：**通过**，26 项里没有不过的。有 1 条不阻塞的缺口，建议尽快修（见末尾「发现的问题」）。

## 检查结果

| 编号 | 检查项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | 真实 ROADMAP 跑 `status.mjs check` | 过 | 「60 个节点，树状图与总表状态相同」，退出码 0 |
| 2 | `ready` 与手工推算一致，下游数排序 | 过 | 真实表里非「未开始」的节点是 A1–A3、A4、D4a、E1–E4、F0。其余节点都依赖未完成的节点，所以没有该解锁的。可开工的只有 D4a（E3 已是实现中）。我用脚本从总表重新算下游数：D4a=5。在副本上 A4 完成后，B1=41、B3=35、B2=23、B5=21、B7=11，和工具输出逐个一致，也是按下游数从多到少排。 |
| 3 | 反向检查 4 种坏输入 | 过 | emoji 改掉：`B2：进度树状图是 ✅ 已完成，总表是 ⬜ 未开始`。B1 在 A4 未完成时改成实现中：`B1：已经是「实现中」，但依赖 A4（验收中）还没完成`。总表删掉 B3：`B3：只出现在进度树状图里，总表没有这一行`，同时报出 7 个节点「依赖 B3 不存在」。依赖写 Z9：`B2：依赖「Z9」不存在`。以上退出码都是 1。 |
| 4 | `set B1 实现中 --impl X --round 1` 只改两行 | 过 | 这条要加 `--force`（实现者的做法 2，见下）。`diff` 只有 mindmap 17 行和总表 310 行。去掉这两行后 `cmp` 其余字节完全相同。CRLF 文件也只变 4 个物理行，其余行的 `\r` 都在。 |
| 5 | A4 完成后解锁下游 | 过 | A4 设为未开始再设已完成，自动变成可开工的是 B1、B2、B3、B5、B7。B4（依赖 B3）、B6（依赖 B1）仍是未开始。`check` 通过。不加 `--force` 走「待验收→已完成」的合规路径也得到同样的结果。 |
| 6 | `C全部` 简写展开 | 过 | C1–C15 完成：D7 不在可开工清单里。再加 C16：D7（下游 4）、F4 被列出。分别用工具 `set` 和手工改文件两种方式做，结果一致。`F3a–F3e` 区间也对：F3a–F3d 完成时 F3f 不列出，F3e 也完成才列出。 |
| 7 | 中文、英文状态名和错误状态 | 过 | `verifying`、`验收中`、`🔷 验收中`、`返工中` 都能用。`胡说八道` 报「不认识的状态」，退出码 2，文件没变（`cmp` 相同）。不存在的节点 ZZ9 报错退出码 1。补充：`--round abc` 被拒绝；`--result` 里的 `\|` 被转义；`--result` 含换行被拒绝。 |
| 8 | 真实仓库 `new ZZ1 a4verify` | 过 | 当时 A4、E3、F0 三个都未登记，不带 `--slot` 被拒绝。加 `--slot 4` 建成：分支 `sync/zz1-a4verify` 的 HEAD 等于 swarm-tree（78bc315）；路径 `…/astryx-vue-wt/ZZ1`；`node_modules` 已装好（5.3 秒）；打印「槽位 4 端口 5174」；`.git/swarm-slots/4.json` 内容正确。 |
| 9 | 槽位占满 | 过 | 在 `/tmp` 克隆里重建 A4、E3、F0 并依次 adopt 到 1、2、3，再建 ZZ1 占 4。第 5 个 `new ZZ2` 报「4 个槽位都被占了」，退出码 1，没有留下目录和分支（`git worktree list`、`git branch --list 'sync/zz*'` 里只有 ZZ1）。重复 adopt 被拒绝。真实仓库没有被占满。 |
| 10 | `ls` 输出 | 过 | 显示节点、槽位、端口、分支、「领先 N，落后 M」。真实仓库里 A4 显示「领先 6，落后 1」，与 `git rev-list` 一致。ZZ1 提交后显示「领先 1」。 |
| 11 | rm 拒绝与 --force | 过 | 未合入的分支：`分支 … 还没合入 swarm-tree，确认不要了就加 --force`，退出码 1。加 `--force` 后工作区、分支、槽位 4 都清掉。在要删的工作区里执行 rm 也被拒绝。 |
| 12 | rebase 冲突处理 | 过（有缺口，见问题 1） | 读测试：「只有生成文件冲突」和「还有别的冲突就放弃，分支回到原样」两条都有。手工：在克隆里节点和基线同时改 `packages/core/src/index.ts`，普通 `git rebase` 冲突，工具自动取节点版本、重跑 `pnpm sync`，成功，工作区干净。**但在真实场景里（两边各新增一个组件），`index.ts` 和 `packages/core/package.json` 同时冲突，工具直接放弃。** |
| 13 | 检查不过不合并 | 过 | 读代码和测试（`任何一步检查失败都不合入`、`检查跑完多出没提交的生成物时不合入` 等）。手工：检查命令 `exit 3`，swarm-tree 的提交号前后相同，ZZ1 保留；检查后工作区变脏，同样不合入，swarm-tree 不变；检查全过才 fast-forward 并删工作区。 |
| 14 | 生成文件清单来源 | 过 | `integrate.mjs` 里 `import { generatedFiles } from '../../sync-exports.mjs'`，grep 没有另写的一份清单。 |
| 15 | 4 个模板 | 过 | `plan.md`、`verify.md`、`impl-report.md`、`verify-report.md`。plan 里有「上游这条改动让用户看到或感受到了什么」「有没有更适合 Vue 的做法」。verify 里有 NODE_ENV 跑两遍、浏览器锁、端口规则（`5170 + 槽位号`，用 `worktree.mjs ls` 查），以及 C 节点通用的 6 条（第 9–14 条，与 ROADMAP 的 6 条逐条对应）。 |
| 16 | SWARM.md 命令与脚本一致 | 过 | 速查表里的子命令、参数名都和 `--help` 一致。照文档跑了 3 组：①`set` 全流程（待验收→验收中→返工中→实现中→待验收→验收中→已完成，带 `--verify`、`--result`、`--pr`、`--round`），结果 `check` 一致；②`new / ls / rm / adopt`；③`ready`。都能跑通。 |
| 17 | 台账保留勾选和备注 | 过 | 复制台账到 `/tmp`，在 C3.md 打 3 个勾并加一句备注。用 `--out` 重新生成，输出「保留了 3 条已有的勾选或备注」。3 个 `[x]` 和备注都在。备注原来在条目中间，重新生成后挪到了该条目末尾，内容不变。 |
| 18 | `--check` 一致与不一致 | 过 | 带勾选的副本：「台账是最新的（50 个文件）」，退出码 0。删掉 6 行（一条目）：`C3.md` 不一致，退出码 1。只删 1 行也能发现。还原后再次一致。真实台账 `--check` 通过。 |
| 19 | 窄屏内容框 | 过 | `image.mjs` 新增 `isOutsideCorner`，只排除四个圆角。我自己构造 780×300 的图：贴左边的内容框 `x:0,w:40`；贴右边 `x:740`；贴上边 `y:0`；贴下边 `y:290`；只有 (0,0) 角上的像素返回 null；纯居中内容不变。测试 `只排除四个圆角：贴着左右边的内容照样算进内容框` 存在。 |
| 20 | README 选择器与代码一致 | 过 | README 和 `capture.mjs` 里都是 `[data-astryx-theme="neutral"]:first-child > .astryx-card:only-child`，并写明第一个子元素带内联 `aspect-ratio` 或 `min-height`，与 `previewReady` 的逻辑一致。 |
| 21 | 组件名拼错提前报错 | 过 | 基线：无 headless 进程，锁目录空，5171、5172 无监听。`pnpm visual NotAThing --out /tmp/verify-A4/x`：7.7 秒内两边都报「没有这个组件页」（我们这边是文档源文件不存在，上游是 HTTP 404），退出码 1。每 0.2 秒轮询：全程没有出现 headless 进程、锁、监听端口；`/tmp/verify-A4/x` 没有创建。 |
| 22 | README 提醒 `--out /tmp/...` | 过 | README 第 17、20、48 行（一句话用法、醒目提示、参数表）。 |
| 23 | NODE_ENV 无关 | 过 | 配置已改（`vite.config.ts` 改成函数式配置、动态加载 plugin-vue；`vitest.config.ts` 先设 `NODE_ENV=test`）。全量 vitest：`env -u NODE_ENV` 226 个文件 2670 条全过；`NODE_ENV=production` 226 个文件 2670 条全过。用例数相同。反向检查①：把两个配置还原成 BASE 版本，`NODE_ENV=production` 下 `test-env.test.ts` 失败（`expected '<div class="leading-comment-probe"> p…' to contain '<!-- …-->'`，1 failed / 2 passed）；不设 NODE_ENV 则 3 条全过。已用 `git checkout` 还原，`git status` 为空。反向检查②：临时探针测试读 `ResizeHandle.vue`（模板根部带注释）的 `wrapper.attributes('role')`，两种 NODE_ENV 下都失败（`expected undefined to be 'separator'`），说明问题稳定暴露。探针已删除。 |
| 24 | 连带修改的测试 | 过 | 相对 BASE 只有 `tests/upstream-ledger.test.ts`（删掉 1 行 import，换成带新导出的 import，并新增用例）和 `tests/visual-compare.test.ts`（新增用例）被改动。没有改任何组件，也没有改组件测试。第 5 条没有连带修改其他测试。 |
| 25 | `pnpm visual Button` | 过 | 端口 5171，只开 1 个会话。第一次 4 个组合里 desktop-dark 和 mobile-dark 上游加载 60 秒超时（按说明属网络问题，不算工具问题）；用 `--combos desktop-dark,mobile-dark` 重跑成功，退出码 0。读了 `desktop-light` 和 `mobile-light` 的 `side-by-side.png`：左上游、右我们，标签清晰；窄屏上游的 Primary 按钮贴左边缘，没有被裁掉；两边按钮样式一致，仅示例文字不同（Primary 与 Save，属已知差异）。结束后 5171 无监听，无 headless 进程，两个锁都空闲。 |
| 26 | 新增测试与完整 check | 过 | 全量见第 23 项（含 `swarm-status`、`swarm-worktree`、`test-env`、`visual-compare`、`upstream-ledger`，两种模式都过）。`check:packages`、`lint`、`typecheck`、`build`、`lint:pkg` 退出码都是 0；test 那一步用上面 `--maxWorkers=2` 的两次全量代替。跑完工作区 `git status` 为空。 |
| 27 | 文件行数和白名单 | 过 | 新增或改动的源码里最大的是 `image.mjs` 280 行，`integrate.mjs` 234 行。`check-line-limit.mjs` 通过。`scripts/guardrails` 相对 BASE 没有改动，白名单没有新增条目。 |
| 28 | 收尾状态 | 过 | 真实仓库：`git worktree list` 只有主工作区、A4、E3、F0；`git branch --list 'sync/zz*'` 为空；`.git/swarm-slots` 里没有 ZZ（测试时工具留下的空目录我已删掉）；`swarm-locks` 空；5171、5172 无监听；无 headless 进程；swarm-tree 仍是 `78bc315`。A4、E3、F0 没有被动过。开始和结束时工作区、主仓库的 `git status` 都是空的。 |

## 对实现者 5 处做法的判断

1. **第 5 条动态加载 plugin-vue（不用 `comments: true`）：合理。** 第 23 项证明根因在加载时机，且还原配置后测试能失败，能守住回退。`comments: true` 只保住注释，其它生产版编译器差异仍在。
2. **状态流转更严格，不合规需要 `--force`：合理。** 它拦住了 `实现中→已完成`、`未开始→实现中`（依赖未完成）、`验收中→待验收` 等错误。`--force` 后仍只改目标行。总控要注意：自动化脚本里需要跳步时要显式加 `--force`。
3. **新增 `adopt`：合理，而且必需。** 真实仓库 A4、E3、F0 都未登记，不 adopt 就没法 `new`。它还拒绝重复登记和占用已用槽位。
4. **`pnpm visual` 新增 `--port`、默认读槽位：合理。** 端口规则与 SWARM 的 `5170 + 槽位号` 一致，没登记才用 5172。
5. **ready 的下游数含间接下游：合理。** 我手工算出的数字与工具逐个一致，符合「谁卡住的人多」。

## 发现的问题（不阻塞，建议下一轮或下一个节点修）

1. **rebase 对「两边各新增一个组件」不会自动处理。** 在克隆里，节点新增 `Zzzz`、基线新增 `Zzaa`，各自跑了 `pnpm sync`。`packages/core/src/index.ts` 和 `packages/core/package.json`（exports 字段）同时冲突。工具报 `冲突文件：packages/core/package.json`，放弃 rebase，分支保持原样（失败是安全的，没有损坏任何东西）。原因是 `generatedPaths` 只取 `generatedFiles`，而 `package.json` 只被当作 `pnpm sync` 允许改动的范围（`SYNC_TOUCHED_EXTRA`），不算可自动解决的冲突。这和 SWARM.md「绝不手动解决生成文件冲突」的承诺不符，C 阶段的节点新增组件或子路径时会碰到。验收计划第 12 项只要求 `index.ts` 的冲突，该项通过，但这个真实场景值得补上：把 `package.json` 的冲突也交给 `pnpm sync` 重新生成，并加一条测试。
2. **小事：** `rm` 释放最后一个槽位后会留下空的 `swarm-slots/` 目录（无害）；`merge` 不能在要删的工作区里执行这条，我只读了代码和测试，没有实际跑（我手工准备的节点因槽位被占没建成）。

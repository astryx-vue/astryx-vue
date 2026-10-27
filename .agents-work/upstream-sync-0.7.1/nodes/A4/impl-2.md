# A4 蜂群基础设施 · 第 2 轮实现回报

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/A4`，分支 `sync/a4-swarm-infra`。只在本地提交，没有推送。
- 开工前先 `git rebase swarm-tree`，没有冲突。收尾时 `swarm-tree` 又多了一个提交 `4dbf806`（只改了 ROADMAP 和 F0 的回报），我用 `worktree.mjs rebase A4` 再跟了一次，也没有冲突。
- 本轮新增的提交：
  - `c73e303` fix: rebase 时 package.json 冲突做 JSON 三方合并，exports 交给 pnpm sync 重新生成
  - `12823cb` fix: status 和 worktree 命令经软链接路径调用时也能认出是直接运行
- ROADMAP.md 没有动。verify.md 没有读。

## 1. package.json 冲突怎么解决的

### 先弄清哪些字段归 sync 管

我读了 `scripts/sync-exports/package-exports.mjs` 的 `renderPackageExports`。`pnpm sync` 对 package.json 只做两件事：

1. 改 `exports`：
   - 每个组件目录都有一个 `./<组件>` 条目。条目存在时，值会被改写成标准的三件套（source、types、import）。
   - 源文件已经不在的条目会被删掉。
   - 其它条目原样保留，比如 `.`、`./locale`、`./package.json`、`./reset.css`。这些是人手写的。
2. 改 `publishConfig.exports`：整份由 `exports` 推出来。`publishConfig` 里的其它键（比如 `access`）原样保留。

所以「归 sync 管」的位置是：

- `publishConfig.exports`；
- `exports["./<X>"]`，其中 X 是当前存在的组件目录。

其它字段都由人维护，包括 exports 里手写的条目。这条规则写在 `package-exports.mjs` 新导出的 `syncOwnedPackagePath(rootDir)` 里，就在生成器旁边。以后生成器改了，规则在同一个地方跟着改。

`sync-exports.mjs` 新导出了 `partlyGeneratedFiles(rootDir)`，返回「文件 → 字段判断函数」。合并工具从这里拿清单，不另外写死一份。原来的 `generatedFiles`（整份生成的文件）不变。

### 合并流程

rebase 停在冲突上时：

1. 冲突文件分三类：
   - 整份生成的文件（`generatedFiles`）；
   - 部分生成的文件（`partlyGeneratedFiles`，目前只有 `packages/core/package.json`）；
   - 其它文件。

   只要有「其它文件」，就 `rebase --abort`，行为和以前一样。
2. 部分生成的文件：从 git 暂存区读出三份内容，分别是共同祖先（`:1:`）、基线（`:2:`）、节点（`:3:`），然后做 **JSON 三方合并**。逐个字段比较的规则：
   - 两边相同，取任一边。
   - 只有一边改了，取改了的那边。
   - 两边都改了，并且都是对象，就按键递归比较。
   - 两边都改了，改法又不同，记为冲突，并记下字段路径。
   - 一边删了、另一边改了，也算冲突。
   - 数组整体比较，不逐项合并。
   - 归 sync 管的位置不比较，只取基线这一边，节点新增的组件条目由下一步的 sync 补上。这样得到的 exports 和「在基线上直接跑 sync」完全一样，条目顺序也由 sync 的插入规则决定。
   - 键的顺序以基线为准。节点新增的键，插在它在节点版本里的前一个键后面。
3. 只要有一个字段冲突，就什么都不写，直接 `rebase --abort`，分支回到原样。报错会写出文件名和字段名，例如：

   ```
   packages/core/package.json：两边都改了 description，改法不同
   ```
4. 合并成功后，用两格缩进写回文件（和仓库现在的写法一致，CRLF 和末尾换行也保留），再 `git add`。整份生成的文件照旧取节点版本。
5. 在工作区跑 `pnpm sync`。sync 改到生成范围以外的文件时停下，并 abort。没有改到范围外，就把改动加进暂存区，然后 `rebase --continue`。

### 文件拆分

| 文件 | 行数 | 职责 |
| --- | --- | --- |
| `worktree/json-merge.mjs`（新） | 81 | 纯函数：`mergeJson({ base, ours, theirs, isOwned })` 返回 `{ value, conflicts }`，另有 `formatJsonPath` |
| `worktree/sync-conflicts.mjs`（新） | 121 | 冲突分类、调用 JSON 合并、整份文件取节点版本、sync 后暂存（从 integrate.mjs 挪过来，加上 JSON 合并） |
| `worktree/integrate.mjs` | 215 | rebase 的主循环和 merge，只负责调度 |
| `sync-exports.mjs` | 143 | 新增 `partlyGeneratedFiles` |
| `sync-exports/package-exports.mjs` | 205 | 新增 `packageJsonFile`、`syncOwnedPackagePath` |

`RebaseConflictError` 新增 `reasons` 字段，记录每个文件不能自动合并的原因。

### 在 /tmp 克隆上用真实的 `pnpm sync` 端到端验证

我把 A4 克隆到 `/tmp/a4e2e`，用 `worktree.mjs new ZZ e2e` 建了节点。每一步都真的新建组件目录、跑真的 `pnpm sync`、再提交。

| 场景 | 结果 |
| --- | --- |
| 节点新增 Zzzz，基线新增 Zzaa | 先用普通 `git rebase` 确认：`index.ts` 和 `package.json` 同时冲突。工具 rebase：退出码 0，日志写「已合并，重新生成：package.json、index.ts」。<br/>exports 和 publishConfig.exports 里两个组件都在，index.ts 里两条导出也都在。`pnpm sync --check` 通过，工作区干净。<br/>`git diff swarm-tree HEAD` 只有 3 个文件、11 行新增，package.json 里只多了 Zzzz 的两段，没有格式上的变动 |
| 节点新增 Zzbb 并加了 devDependencies `zz-dev`，基线新增 Zzcc 并改了 description | 退出码 0。两个提交都自动处理。<br/>description 是基线的新值，`zz-dev` 保留，4 个 Zz 组件都在 exports 里。`sync --check` 通过 |
| 节点和基线都改了 description，改成不同的值 | 退出码 1，报「两边都改了 description，改法不同」。<br/>HEAD 和 rebase 前相同，工作区干净，没有 rebase 残留 |

## 2. 新增的测试

`tests/swarm-worktree.test.ts` 新增 describe「rebase 时 package.json 的冲突」。这组测试用的是**真的 sync 生成器**（`syncExports({ eslint: false })`），没有用假的 sync，所以 exports 怎么生成、怎么排序，都和 `pnpm sync` 一致。

1. **两边各新增一个组件**：自动完成。exports 和 publishConfig.exports 的键都是 `. ./Button ./Zzaa ./Zzzz ./package.json`，`publishConfig.access` 保留，index.ts 里两个组件都在，工作区干净，只剩节点的那个提交，`syncExports --check` 通过。
2. **基线改了 description 和 publishConfig.access，节点加了一个依赖并新增组件**：两边的改动都保留，依赖变成 `{a, b}`，顶层键的顺序不变，`--check` 通过。
3. **两边改了同一个非 sync 字段（description）**：抛出 `RebaseConflictError`，`files` 是 `[package.json]`，消息里有字段名。HEAD 不变，工作区干净，description 仍是节点的值。
4. **exports 里手写的条目（`./locale`）两边改法不同**：也会停下，报出 `exports["./locale"]`。这条用来确认「exports 字段」没有被整个当成 sync 管的字段。

`tests/swarm-json-merge.test.ts`（新）：7 条，测合并规则本身，包括单边修改、嵌套对象、两边各加不同的键、数组整体比较、删了又改算冲突、sync 字段只取 ours、键的顺序、路径格式。

另外为两个小提示各加了 1 条（见第 3 节）。

## 3. 第 1 轮的两个小提示

### 3.1 空的 swarm-slots/ 目录：现在会清掉

`slots.mjs` 释放登记时（`releaseSlot`、`removeSlotFile`），会顺手 `rmdir` 这个目录。目录里还有别的文件就跳过，不删。

这里有一个并发风险：别的进程正要往里写登记时，目录刚好被删掉。为了防这种情况，占槽改成：先建目录，再用 `wx` 写文件；如果遇到 `ENOENT`（目录不见了），就重建目录再试，最多试 3 次。

新增测试「释放最后一个槽位时删掉空的 swarm-slots/……」：

- 释放一个槽位后，目录还在（另一个登记还在）；
- 释放最后一个后，目录没了；
- 再 `new` 一次，目录重建，分到槽位 1。

端到端验证：在 /tmp 克隆里 `rm ZZ` 之后，`.git/swarm-slots` 不存在。

### 3.2 在要删除的工作区里执行 merge：实际跑过了

改动：这个检查原来只在命令行入口（`worktree.mjs`）里做，现在挪进了 `mergeWorktree` 本身，在拿合并锁、rebase、跑检查之前就拒绝。直接调用函数的代码也受这条保护。命令行那份重复的判断已经删掉。

在 /tmp 克隆里实际跑：节点和基线各新增一个组件，所以 merge 本来需要 rebase。然后分别在节点工作区根目录和它的子目录 `packages/core` 里执行 `node <主仓库>/scripts/swarm/worktree.mjs merge ZZ`。两次的结果都是：

```
merge 结束时会删掉这个工作区，请在主工作区里执行，或者加 --keep。什么都没有改
exit=1
```

之后检查：节点 HEAD 不变，swarm-tree 不变，工作区干净，没有 rebase 残留，没有 `swarm-locks/merge`，槽位登记还在。

新增测试「在要删的工作区里执行时一开始就拒绝……」覆盖了同样的断言：检查命令没有执行，没有锁，HEAD 和基线都不变。它还验证了加 `--keep` 时可以在节点工作区里合入。

**顺带发现并修掉一个问题**：第一次实际跑时，命令什么都没输出，退出码却是 0。原因是 `/tmp` 在 macOS 上是软链接（指向 `/private/tmp`），`worktree.mjs` 和 `status.mjs` 判断「是不是直接运行」时，比较的是 `import.meta.url` 和 `argv[1]` 的字面路径，两者对不上，主逻辑就没跑。现在两边都先取真实路径（`realpathSync`）再比较。修好以后重跑，结果就是上面的报错。正常路径不受影响，用真实 ROADMAP 跑 `status.mjs check` 照样通过。仓库里其它几个脚本也有同样的写法，比如 `browser-lock.mjs`、`visual-*.mjs`，这次不在本节点范围内，没有改。

## 4. 检查结果

| 项目 | 结果 |
| --- | --- |
| `env -u NODE_ENV pnpm check:packages` | 退出码 0（rebase 到 `4dbf806` 后又跑了一次，还是 0） |
| `env -u NODE_ENV pnpm lint` | 退出码 0 |
| `env -u NODE_ENV pnpm typecheck` | 退出码 0 |
| `env -u NODE_ENV pnpm vitest run --maxWorkers=2` | 227 个文件、2683 条用例，全部通过 |
| `NODE_ENV=production pnpm vitest run --maxWorkers=2` | 227 个文件、2683 条用例，全部通过，用例数相同 |
| `env -u NODE_ENV pnpm build` | 退出码 0 |
| `env -u NODE_ENV pnpm lint:pkg` | 退出码 0 |
| 跑完后 `git status` | 干净 |
| 源码行数 | `check-line-limit` 通过。本轮改动过的文件里最大的是 `integrate.mjs`，215 行 |
| 最后一次 rebase 后 | 相关的 3 个测试文件 36 条通过；`status.mjs check` 一致 |
| 真实仓库收尾 | worktree 只有主工作区、A4、E3、F0；没有 `sync/z*` 分支；没有 `swarm-slots/`。E3 和 F0 没有动过。`/tmp/a4e2e` 已删除 |

## 5. 拿不准的地方

1. **合并后的 package.json 会按 `JSON.stringify(…, null, 2)` 重写。** 现在仓库里的文件正好就是这个格式（我核对过：原文等于 `JSON.stringify(JSON.parse(原文), null, 2) + '\n'`），所以 diff 里只有真正的改动。以后如果有人手工写成别的格式，比如数组写在一行里，合并时会被规范成标准格式。内容不会丢，但 diff 会变大。
2. **数组整体比较。** 比如两边都往 `files` 或 `keywords` 里各加了一项，会被当成冲突，停下来交给人处理，不会自动合成一个数组。这样做偏保守，但不会悄悄丢掉任何一边的改动。
3. **sync 管的 exports 条目只取基线这一边，再由 sync 重新生成。** 如果节点故意把某个组件的 exports 条目改成非标准写法，sync 本来也会把它改回标准写法。所以这条规则和「在合并结果上跑 sync」的效果是一样的，不会额外丢掉东西。

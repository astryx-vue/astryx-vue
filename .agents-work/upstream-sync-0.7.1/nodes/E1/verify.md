# E1 拆分脚本与 CLI 生成器大文件 · 验收计划

你是验收者，只检查，不改代码。实现者的回报只能用来了解情况，不能当证据。每一条都要你自己重新验证。

## 环境

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/E1`，分支 `sync/e1-split-scripts`。
- 用 `git merge-base HEAD swarm-tree` 得到分支起点，记作 `BASE`。下面所有「拆之前」都指 `BASE`。
- 跑测试时限制并发：`--maxWorkers=2`。不需要开浏览器。
- 如果环境里有 `NODE_ENV=production`，跑构建和测试前先 `unset NODE_ENV`。
- 开始和结束时各跑一次 `git status`，两次结果要相同。临时文件都放在 `/tmp/verify-E1/`。

## 检查项

每一项只能判「过」或「不过」，并附上证据。

### 一、产物完全不变（最重要）

自己造一份「拆之前」的基准，不用实现者留下的：

```sh
git worktree add /tmp/verify-E1/base $BASE
cd /tmp/verify-E1/base && pnpm install --frozen-lockfile
```

在 base 和 E1 两个目录里分别执行下面的步骤，然后对比。

1. **`pnpm sync` 的产物**：两边都跑 `pnpm build:packages`，再跑 `node scripts/sync-exports.mjs --check`，都要通过。然后用 `diff` 比较下面这些文件，两边必须逐字节相同：
   - `packages/core/src/index.ts`
   - `packages/core/src/composables/index.ts`
   - `packages/core/src/locale/messages.ts`
   - `packages/core/styles.css`
   - `packages/themes/*.css`
   - `packages/core/package.json`
2. **CLI catalog**：两边都跑 `pnpm --filter @astryx-vue/cli generate`，比较 `packages/cli/src/generated/catalog.json`，要逐字节相同。
3. **llms 产物**：两边都跑 `pnpm docs:build`，用 `diff -r` 比较文档站产物里 llms 相关的全部文件：`llms.txt`、`llms-full.txt`、各语言版本，以及逐页 `.md`。具体位置看 `apps/docs/.vitepress/llms.ts`。必须完全相同。
4. **`TEMPLATE_META` 不变**：写一个临时脚本，放在 `/tmp/verify-E1/`。它分别 import 两边的 `TEMPLATE_META`，比较三样东西：`Object.keys` 的顺序、`JSON.stringify` 的结果、条目数（应该是 53）。三样都要相同。
5. **对外导出不变**：对 4 个原入口文件，分别列出两边导出的名字，要完全一致。TS 文件可以用 `node --experimental-strip-types` 动态 import 后取 `Object.keys`，也可以对照源码。
6. 用 `grep` 查找仓库里所有引用这 4 个文件的地方，确认没有任何引用路径被改动：`git diff $BASE --stat` 里只出现这 4 个文件、它们的新子模块、白名单，以及可能的测试文件。

验收结束后，删掉 `/tmp/verify-E1/base` 这个 worktree：`git worktree remove --force`。

### 二、拆得合理

7. 这 4 个原文件，以及所有新模块，`wc -l` 都不超过 500 行。
8. 每个新模块逐个看一遍，职责要单一：
   - 能用一句话说清它负责什么。
   - 没有「misc」「utils」「constants」这类什么都装的大杂烩文件，除非它确实只装一类东西。
   - 没有少于 30 行、又只被一个地方用到的碎片模块。如果有，要说明理由。
9. 原入口文件变薄了，主要用来编排流程或重新导出，没有残留大块逻辑。
10. 新模块之间没有循环依赖。可以自己画一下 import 关系，确认是一棵树。
11. 注释里没有「从 xxx 拆出」「原来在」这类变更历史。用 `grep -nE "拆出|原来|moved|extracted|split from" <新文件>` 检查。

### 三、护栏和测试

12. 白名单里这 4 条已经删掉，其余条目和 `BASE` 时一模一样（用 `git diff $BASE -- scripts/guardrails/line-limit-allowlist.json` 看）。运行 `node scripts/check-line-limit.mjs`，要通过。
13. 两边分别跑下面这些测试，通过数要相同，而且全部通过：
    - `tests/sync-exports.test.ts`
    - `tests/llms-txt.test.ts`
    - `packages/cli/src/generate/`
    - `packages/cli/src/cli.test.ts`
14. **测试确实覆盖到了新模块**：在新模块里随便改坏一处逻辑。比如在 markdown 表格解析模块里，把列类型识别改错；或者在 sync 的 css 渲染模块里，把排序反过来。改完后对应的测试或 `--check` 必须失败。然后还原。至少做 2 处。
15. 跑完整的 `pnpm check`，必须通过。其中 test 步骤换成 `pnpm vitest run --maxWorkers=2`。
16. 不能新增任何依赖：`package.json` 和 lock 文件都没有变化。

## 结论

- 任何一条不过，结论就是「不通过」。
- 报告写到 `/Users/shenqingchuan/workspace/astryx-vue/.agents-work/upstream-sync-0.7.1/nodes/E1/verify-<N>.md`，格式和其他节点一样：先写结论，再写逐条表格（编号、检查项、结果、证据），最后写「不通过的项要怎么改」。
- 最终回复用中文，不超过 200 字。

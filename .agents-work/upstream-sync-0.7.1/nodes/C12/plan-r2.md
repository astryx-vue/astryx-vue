# C12 列表与树 · 第 2 轮执行计划

## 目标

树行用 `target="_blank"` 打开时，链接带上 `rel="noopener noreferrer"`，和列表行一样。树的选中仍由调用方写在条目的 `isSelected` 上，不新造根上的 `v-model`。台账 `17b2fcfed` 标成不适用，并写清理由。

## 工作环境

- 工作区：`/workspace`，分支 `cursor/c12-list-tree-dffe`。先快进到验收 tip `da79c71b`。
- 动手前已读：`nodes/C12/verify-1.md`、PR #161 的验收评论、上游 `TreeListItem.tsx` 与 `TreeList.spec.md` 的 DEC-2、本库 `Item.vue` 的 `rel` 合并。
- 环境纪律：测试前加 `env -u NODE_ENV`；vitest 加 `--maxWorkers=2`；再以 `NODE_ENV=production` 跑一遍，用例数要相同。
- 这一轮不改视觉，不新开文档站，不截图。

## 上游这条改动让用户看到或感受到了什么

| 上游改动 | 用户看到或感受到的变化 |
| --- | --- |
| #6835 / `c3f64eff9` | 树行是链接且 `target="_blank"` 时，新窗口打开，并带上 `noopener noreferrer`。同页链接不额外加 `rel`。 |
| #7460 / `17b2fcfed` | 选择由调用方在条目上设 `isSelected`。树不提供根上的选中值，不强制只有一行选中，也没有选择用的组合键。 |

## 上游依据

- 台账：`c3f64eff9`、`17b2fcfed`。
- 上游源码：`TreeListItem` 把 `target` 交给 `Link`，`Link` 在 `target="_blank"` 时用 `computeTargetAndRel` 补上两个 token。条目类型只有 `isSelected`，没有根上的 `selected`。
- 上游规范 DEC-2：调用方最多标一行选中，树不强制，也不声明 `aria-multiselectable`。

## 有没有更适合 Vue 的做法

| 上游怎么做 | 我们怎么做 | 为什么效果一样 |
| --- | --- | --- |
| `Link` 在新窗口时补 `rel` | 树行自己在 `target="_blank"` 时写出 `noopener noreferrer` | 没有 `LinkProvider` 时渲染的就是 `<a>`，关系标记仍在 |
| 条目 `isSelected` | 继续用条目 `isSelected` | 和上游公开 API 相同，不另造 `v-model` |

## 任务范围

- 要改：
  - `packages/core/src/TreeList/TreeListItem.vue`
  - `packages/core/src/TreeList/TreeList.test.ts`
  - 中英文 `tree-list/props.md`
  - `ledger/C12.md` 里 `17b2fcfed` 的结论
  - 本目录的 `verify.md`（追加第 2 轮）、`impl-2.md`
- 不碰：
  - `ROADMAP.md`、`HANDOFF.md`、`PR128-BODY.md`
  - 行数白名单、`catalog.json`
  - 树的选择数据模型

## 开发步骤

1. 写本计划，并在 `verify.md` 末尾追加第 23–27 项。
2. 树行链接在 `target="_blank"` 时带上 `rel="noopener noreferrer"`。同页链接不写 `rel`。补两条 Vue 测试。
3. 中英文文档写明新窗口的 `rel`，以及选中写在条目上、树没有根上的选中值。
4. `17b2fcfed` 标成不适用，理由写明上游就是 `isSelected`。
5. 跑相关 vitest 两种 `NODE_ENV`、typecheck、eslint、行数、`!important`、导出检查。写 `impl-2.md`。推送到 PR #161，更新正文。不合入。

## 自测要求

1. `env -u NODE_ENV pnpm exec vitest run --maxWorkers=2` 覆盖 List、TreeList、Outline、OverflowList、MetadataList，全部通过。
2. `NODE_ENV=production` 同一路径，用例数相同。
3. `env -u NODE_ENV pnpm --filter @astryx-vue/core typecheck`、改过文件的 eslint `--max-warnings 0`、`node scripts/check-line-limit.mjs`、`node scripts/check-no-important.mjs`、`node scripts/sync-exports.mjs --check`。
4. 新写和改到的源码不超过 500 行。这一轮不截图。

## 提交与回报

- 提交信息用中文。完成后推送 `cursor/c12-list-tree-dffe`，更新 draft PR #161 的正文。
- 不改 `ROADMAP.md`、`HANDOFF.md`、`PR128-BODY.md`，不合并。
- 回报写 `nodes/C12/impl-2.md`。

## 验证操作要短小

每次只测一件事，命令加 `timeout`。浏览器这一轮不用。

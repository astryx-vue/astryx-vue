# C12 列表与树 · 第 2 轮实现回报

- 工作区：`/workspace`，分支 `cursor/c12-list-tree-dffe`。已快进到验收 tip `da79c71b`。
- 提交（基于 `da79c71b`）：
  - `c8d17fd7` fix(C12): 树行新窗口补上 noopener，选择台账标成不适用
  - 本回报是随后那一次 docs 提交

## 1. 做了什么

按 `plan-r2.md` 做完。第 1 轮验收不过的是台账第 13 条。

1. 树行链接在 `target="_blank"` 时写出 `rel="noopener noreferrer"`。同页链接不写 `rel`。`TreeList.test.ts` 加了这两条。
2. 中英文树文档写明新窗口的 `rel`，以及选中写在条目的 `isSelected` 上，树没有根上的选中值。
3. 台账 `17b2fcfed` 标成不适用。上游 `TreeList` 的选择就是条目上的 `isSelected`，没有根上的 `selected` 或 `onSelectionChange`。本库本来就是这个字段，不另造 `v-model`。
4. `verify.md` 末尾追加了第 23–27 项。

| 文件 | 行数 | 职责 |
| --- | --- | --- |
| `packages/core/src/TreeList/TreeListItem.vue` | 212 | 新窗口链接补上 `noopener noreferrer` |
| `packages/core/src/TreeList/TreeList.test.ts` | 206 | 新窗口带 `rel`，同页链接不带 |

## 2. 和上游的对照

| 上游改动 | 上游怎么做 | 我们怎么做 | 为什么效果相同 |
| --- | --- | --- | --- |
| #6835 | `Link` 在 `target="_blank"` 时补 `noopener noreferrer` | 树行自己写出这两个 token | 没有链接提供者时，`<a>` 上仍有同样的 `rel` |
| #7460 | 调用方在条目上设 `isSelected`，树不强制单选 | 继续用条目 `isSelected` | 公开 API 相同，不另造根上的选中值 |

## 3. 和计划不一样的地方

无。

## 4. 台账处理

`c3f64eff9` 仍是已采纳，树行新窗口的 `rel` 已经和结论一致。`17b2fcfed` 由已采纳改为不适用。54 条仍全部打勾。已采纳 32 条，不适用 22 条。

## 5. 自测结果

| # | 自测项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | `env -u NODE_ENV pnpm exec vitest run --maxWorkers=2` 覆盖 List、TreeList、Outline、OverflowList、MetadataList | 过 | 7 个文件、78 条用例 |
| 2 | `NODE_ENV=production` 同一命令 | 过 | 7 个文件、78 条用例 |
| 3 | core typecheck、改过的 TreeList 源码 eslint `--max-warnings 0`、行数、`!important`、导出 | 过 | `vue-tsc` 退出码 0；eslint 退出码 0；行数检查通过；`check-no-important` 退出码 0；`sync-exports --check` 一致 |

这一轮没有改视觉，没有重跑 `docs:build`，也没有新截图。没有改行数白名单，也没有改 `catalog.json`。

## 6. 拿不准的地方

无。

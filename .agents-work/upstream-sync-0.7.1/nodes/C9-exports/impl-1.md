# C9-exports Markdown 子路径构建 · 第 1 轮实现回报

- 工作区：`/workspace`，分支 `sync/c9-markdown-exports`。
- 提交（基于 `0f6f605`，即 #142 合入后的 `swarm-tree`）：
  - `69a9453` fix(core): 把 Markdown 三个子路径打进 dist
  - 这份回报紧跟在上面那笔提交之后。

## 1. 做了什么

`packages/core/tsdown.config.ts` 的 entry 是 `src/index.ts`、`src/*/index.ts`、`src/Icon/plugin.ts`。星号只匹配一层目录，所以 `src/Button/index.ts` 会进 dist，`src/Markdown/parser/index.ts` 不会。C9 #138 已经在 `package.json` 里把三个子路径指到 dist，构建却不产出这些文件。Check and dry-run 在 catalog 修好之后会在 publint / attw 这里失败。

1. entry 补上三个源文件：`src/Markdown/parser/index.ts`、`src/Markdown/plugin-protocol/index.ts`、`src/Markdown/plugin-renderer/index.ts`。没有改成 `src/**/index.ts`，避免以后内部目录被一起打成公开入口。
2. `publishConfig.exports` 本来就和开发 exports 一致（只是没有 `source`），没有改 `package.json` 的导出表。
3. 构建脚本在 tsdown 之后跑 `scripts/smoke-markdown-subpaths.mjs`。它按包名 import 三个子路径，并调用一次 `parseMarkdownAst`。vitest 开了 `source` 条件，单测读的是 src，发现不了 dist 缺失。
4. `parserPublic.test.ts` 补了两处断言：`publishConfig.exports` 与开发 exports 的 types/import 相同；tsdown 配置里写了这三个入口。

| 文件 | 行数 | 职责 |
| --- | --- | --- |
| `packages/core/tsdown.config.ts` | 43 | 三个子路径进入构建入口 |
| `packages/core/scripts/smoke-markdown-subpaths.mjs` | 18 | 构建后按包名 import |
| `packages/core/src/Markdown/parserPublic.test.ts` | 194 | 导出表和入口登记的断言 |
| `packages/core/package.json` | 构建脚本多了一段 smoke | 不改 exports |

## 2. 和上游的对照

无新的上游行为。三个子路径的公开名字仍是 C9 已经定下的：`Markdown/parser`、`Markdown/plugins`（源码在 `plugin-protocol/`）、`Markdown/plugin-renderer`。

| 上游改动 | 上游怎么做 | 我们怎么做 | 为什么效果相同 |
| --- | --- | --- | --- |
| 无 | 无 | 只补构建入口 | import 到的仍是现有函数和组件 |

## 3. 和计划不一样的地方

无。`exports` 和 `publishConfig.exports` 核对后已经一致，没有改这两段。

## 4. 台账处理

无。不改 `ledger/C9.md`，不改 `ROADMAP.md`。这是 #128 的构建补修，不是新的上游条目。

## 5. 自测结果

| # | 自测项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | `timeout 240 env -u NODE_ENV pnpm --filter @astryx-vue/core build` | 过 | 约 9 秒。末尾 `markdown subpath smoke ok`。六个文件都在：`dist/Markdown/parser/index.js` 与 `.d.ts`，`dist/Markdown/plugin-protocol/index.js` 与 `.d.ts`，`dist/Markdown/plugin-renderer/index.js` 与 `.d.ts` |
| 2 | `node ./scripts/sync-exports.mjs --check` | 过 | 「生成结果和已提交文件一致。」 |
| 3 | `pnpm --filter @astryx-vue/cli generate:check` | 过 | `catalog is up to date (245 components, 31 topics, 53 templates)` |
| 4 | vitest `parserPublic.test.ts`，先 `env -u NODE_ENV`，再 `NODE_ENV=production`，都加 `--maxWorkers=2` | 过 | 两次都是 1 个文件、6 条 |
| 5 | `pnpm --dir packages/core pack` 后 `publint --level error`、`attw --profile esm-only` | 过 | publint `All good!`。attw 里 `Markdown/parser`、`Markdown/plugins`、`Markdown/plugin-renderer` 的 node16 ESM 和 bundler 都是绿色。tarball 里有上面六个文件 |
| 6 | eslint（三个改过的源码文件，`--max-warnings 0`）和 `pnpm --filter @astryx-vue/core typecheck` | 过 | 无告警；`vue-tsc` 退出码 0 |
| 7 | `check-line-limit.mjs`、`check-no-important.mjs` | 过 | 退出码 0 |

没有跑全量 `pnpm check`。文档站构建和 themes/cli 的 lint:pkg 与这次改动无关。

开发 exports 和 `publishConfig.exports` 三对路径用脚本比过，都是 match。

## 6. 拿不准的地方

无。Check and dry-run 里如果还有别的红，不会是这三个子路径缺文件。`Test under production shell` 上一次红在 `DropdownMenuSubMenu` 的服务端渲染（`HTMLElement is not defined`），不在本节点范围里。

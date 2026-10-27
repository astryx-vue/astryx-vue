# C9-exports Markdown 子路径构建 · 执行计划

## 目标

`@astryx-vue/core` 构建之后，`Markdown/parser`、`Markdown/plugins`、`Markdown/plugin-renderer` 这三个子路径在 `dist` 里有对应的 `.js` 和 `.d.ts`，并且能按包名 import。总 PR #128 的 Check and dry-run 因此不再卡在缺文件上。

## 工作环境

- 工作区：`/workspace`，分支 `sync/c9-markdown-exports`。从 `swarm-tree`（含 #142）切出。只在这里改。
- 动手前已读：`packages/core/tsdown.config.ts`、`packages/core/package.json` 的 `exports` 与 `publishConfig.exports`、`scripts/sync-exports/package-exports.mjs`、`scripts/lint-published.mjs`、`.github/workflows/release.yml` 的 Check and dry-run、B4-fix `impl-2.md` 末尾给 C9 的说明。
- 环境纪律：测试和构建命令前面加 `env -u NODE_ENV`；vitest 加 `--maxWorkers=2`；每条命令加 `timeout`。
- 浏览器：不涉及界面，不开浏览器。

## 上游这条改动让用户看到或感受到了什么

无。这是发布构建补洞，不改 Markdown 的解析或渲染行为。

| 上游改动 | 用户看到或感受到的变化 |
| --- | --- |
| 无 | 包能装上并 import 这三个子路径；界面行为不变 |

## 上游依据

- 无新的上游行为。导出形状是 C9 #138 已经写进 `package.json` 的那三份。
- 根因在本仓库的 tsdown 入口：`src/*/index.ts` 只匹配一层目录，三个入口都在 `src/Markdown/<子目录>/index.ts`。

## 有没有更适合 Vue 的做法

无。不改组件写法，只把已有入口交给现有的 tsdown 配置。

| 上游怎么做 | 我们怎么做 | 为什么效果一样 |
| --- | --- | --- |
| 无 | 在 entry 里补上三个源文件，沿用 `src/Icon/plugin.ts` 那种显式入口 | dist 路径和 `exports` 里写的一致 |

## 任务范围

- 要改：`packages/core/tsdown.config.ts`；必要时给构建加一段只检查这三个子路径的 smoke；`parserPublic.test.ts` 里补上「入口已登记、publishConfig 与开发 exports 一致」。
- 不碰：catalog（#142 已修）、Markdown 解析和渲染、其它组件、`ROADMAP.md`。
- 不手改 `exports` / `publishConfig.exports`，除非核对后发现路径不一致。

## 开发步骤

1. 核对 tsdown 的 entry 为什么漏掉这三个文件。
2. 把三个源文件写进 entry，跑 `pnpm --filter @astryx-vue/core build`，确认 dist 路径与 exports 一致。
3. 核对 `publishConfig.exports` 是开发 exports 去掉 `source` 之后的同一份路径。
4. 跑 `sync-exports --check`、`generate:check`、parser 子路径测试，以及 core 包的 publint / attw。
5. 构建末尾加一段 import smoke，避免 vitest 的 `source` 条件把缺 dist 藏过去。

## 自测要求

1. `timeout 240 env -u NODE_ENV pnpm --filter @astryx-vue/core build`，三个 dist 的 js 和 d.ts 都在，smoke 打印成功。
2. `timeout 90 node ./scripts/sync-exports.mjs --check` 与 `timeout 90 pnpm --filter @astryx-vue/cli generate:check`。
3. `timeout 120 env -u NODE_ENV pnpm vitest run --maxWorkers=2 packages/core/src/Markdown/parserPublic.test.ts`，再以 `NODE_ENV=production` 跑同一条，用例数相同。
4. core 打一次包，`publint --level error` 和 `attw --profile esm-only` 通过，三个子路径在 attw 里是 ESM 绿色。
5. 改过的文件 `eslint --max-warnings 0`，`vue-tsc` 通过。不跑全量 `pnpm check`（含文档站构建和全部包的 lint:pkg）。

## 提交与回报

- 提交信息用中文。推送 `sync/c9-markdown-exports`，开 draft PR，base 为 `swarm-tree`。
- PR 写明：修 #128 CI 的 Markdown 子路径；与 catalog 无关。不合入。
- 回报写到 `.agents-work/upstream-sync-0.7.1/nodes/C9-exports/impl-1.md`。

## 验证操作要短小

每次只测一件事，命令加 `timeout`。打包产物放在 `/tmp/c9-pack`。

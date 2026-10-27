# C9-exports 验收报告 · 第 1 轮

结论：通过（10/10）

- 工作区：`/workspace`，分支 `sync/c9-markdown-exports`。
- 受检提交：`69a9453`（构建入口）和 `06c30ce`（实现回报）。本报告另交，不计入受检范围。
- 比较基点：`BASE = 0f6f6057a18b548b37d4cd42fbea513078bf960e`（`git merge-base HEAD origin/swarm-tree`，也是当时的 `origin/swarm-tree` 尖端）。
- 节点目录没有 `verify.md`，按任务清单和 `plan.md` 的自测项重跑。没有把 `impl-1.md` 的勾选当作证据。
- 开始时 `git status` 是 `nothing to commit, working tree clean`。依赖是本轮自己装的：`timeout 300 pnpm install --frozen-lockfile`，退出码 0。锁文件没有改动。
- 环境：Node `v22.23.3`，pnpm `11.21.0`。浏览器没开。没有跑全量 `pnpm check`。
- 没有合入，没有改业务代码，没有改 `ROADMAP.md`，没有改 #128 的描述。

## 逐条结果

| # | 检查项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | `pnpm --filter @astryx-vue/core build` 产出六个 dist 文件 | 过 | `timeout 240 env -u NODE_ENV pnpm --filter @astryx-vue/core build`，退出码 0，约 12 秒。末尾打印 `markdown subpath smoke ok`。六个文件都在：`dist/Markdown/parser/index.js`（389 字节）与 `index.d.ts`（2543），`dist/Markdown/plugin-protocol/index.js`（4380）与 `index.d.ts`（3039），`dist/Markdown/plugin-renderer/index.js`（1135）与 `index.d.ts`（1183）。 |
| 2 | 按包名 import 三个子路径，落到 dist | 过 | 再跑 `timeout 30 node ./packages/core/scripts/smoke-markdown-subpaths.mjs`，退出码 0，同样打印 `markdown subpath smoke ok`。在 `packages/core` 下 `import.meta.resolve`：`Markdown/parser` → `dist/Markdown/parser/index.js`；`Markdown/plugins` → `dist/Markdown/plugin-protocol/index.js`；`Markdown/plugin-renderer` → `dist/Markdown/plugin-renderer/index.js`。不是 `src`。 |
| 3 | `sync-exports --check` | 过 | `timeout 90 node ./scripts/sync-exports.mjs --check`，退出码 0。输出「生成结果和已提交文件一致。」 |
| 4 | `generate:check` | 过 | `timeout 90 pnpm --filter @astryx-vue/cli generate:check`，退出码 0。`catalog is up to date (245 components, 31 topics, 53 templates)`。 |
| 5 | `parserPublic.test.ts`，未设 `NODE_ENV` | 过 | `timeout 120 env -u NODE_ENV pnpm vitest run --maxWorkers=2 packages/core/src/Markdown/parserPublic.test.ts`，退出码 0。1 个文件、6 条通过。文件里就是 6 个 `it`。 |
| 6 | 同一文件，`NODE_ENV=production` | 过 | `timeout 120 env NODE_ENV=production pnpm vitest run --maxWorkers=2 packages/core/src/Markdown/parserPublic.test.ts`，退出码 0。仍是 1 个文件、6 条。和上一条数量相同。 |
| 7 | core tarball 的 publint | 过 | `pnpm --dir packages/core pack --pack-destination /tmp/c9-pack`，退出码 0，得到 `/tmp/c9-pack/astryx-vue-core-0.3.0.tgz`。包内有上面六个文件。`timeout 90 pnpm exec publint /tmp/c9-pack/astryx-vue-core-0.3.0.tgz --level error`，退出码 0，`All good!`。 |
| 8 | attw 抽查三个子路径 | 过 | `timeout 90 pnpm exec attw /tmp/c9-pack/astryx-vue-core-0.3.0.tgz --format ascii --profile esm-only`，退出码 0。`Markdown/parser`、`Markdown/plugins`、`Markdown/plugin-renderer` 的 node16（from ESM）都是 ESM 绿色，bundler 也是绿色。`node10` 和 node16 CJS 的提示被 `esm-only` 忽略，其它子路径同样如此，不单算这三条的失败。 |
| 9 | diff 只动构建入口和必要脚本，不改 Markdown 解析或渲染 | 过 | `git diff --name-only origin/swarm-tree...HEAD` 只有：`plan.md`、`impl-1.md`、`packages/core/package.json`、`packages/core/scripts/smoke-markdown-subpaths.mjs`、`packages/core/src/Markdown/parserPublic.test.ts`、`packages/core/tsdown.config.ts`。`package.json` 只把 `build` 改成 `tsdown && node ./scripts/smoke-markdown-subpaths.mjs`。`tsdown.config.ts` 在原有 `src/index.ts`、`src/*/index.ts`、`src/Icon/plugin.ts` 之外，显式加上三个源文件，没有改成 `src/**/index.ts`。测试只在已有用例里加了导出表和入口断言。`packages/core/src/Markdown` 下没有解析器、渲染器或样式 diff。 |
| 10 | 开发 `exports` 与 `publishConfig.exports` 一致 | 过 | 本 PR 没有改这两段。去掉 `source` 之后，116 个键全部一致，没有只在一边出现的键。三个子路径的 `types` / `import` 分别是 `./dist/Markdown/parser/index.d.ts` 与 `.js`、`./dist/Markdown/plugin-protocol/index.d.ts` 与 `.js`、`./dist/Markdown/plugin-renderer/index.d.ts` 与 `.js`。公开名 `Markdown/plugins` 仍指向源码目录 `plugin-protocol`，和 C9 已登记的形状相同。 |

## 对 #128 的判断

合入 `swarm-tree` 之后，预期能消掉 #128 里 Markdown 三个子路径缺 dist 的问题：`package.json` 已经指向这些文件，本分支的构建会把它们打出来，打好的 tarball 上 publint 和 attw 抽查是绿的。仍要等 CI 实跑 `pnpm build` 和 `lint:pkg` 才能算数。

这不能让 #128 的整份 Check 立刻变绿。最新一次 Check and dry-run（run `39594900200`，提交 `0f6f605`）在 `pnpm test` 就停了，失败是 `DropdownMenuSubMenu` 服务端渲染 `HTMLElement is not defined`，还没跑到 `pnpm build` / `lint:pkg`。再往前一次（run `39594151291`）停在 catalog 过期，那是 #142 的范围。本 PR 不修这两处。

## 不通过的项要怎么改

无。

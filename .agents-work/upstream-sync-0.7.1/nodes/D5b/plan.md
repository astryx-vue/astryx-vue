# D5b 页面模板接入 CLI · 执行计划

## 开工前的现状（别重复做）

D5a 第 7 步重生 catalog 时，57 个演练场模板已经进了 `packages/cli/src/generated/catalog.json`；
D4b 已经把 `template` 命令拆成 list / show / skeleton / copy，`search --type template` 也能搜到模板；
`scripts/check-templates.mjs`（`pnpm check:templates`）会把 catalog 里 `isReady` 的模板用 CLI 自己
逐个落进一个只装了 `vue` 和 `@astryx-vue/core` 的临时项目，再跑 `vue-tsc --noEmit`。

所以这个节点**不是**从零接模板，而是把「模板对外提供」这件事补完整、说明白、锁住：

1. catalog 每条模板记录目前缺一项：**这个模板要装什么包**。用户和 AI 助手只能靠读源码猜。
2. 命令输出里没有一句「模板只依赖 `vue` 和 `@astryx-vue/core`」，`isReady` 的含义（能读不能复制）也要靠猜。
3. 文档站 `guide/cli.md` 和 `packages/cli/README*.md` 还写着「53 个模板」，实际是 57 个。
4. 「只依赖两个包」这件事没有生成期断言，将来谁在模板里加一个 `import`，只有 CI 的
   `check:templates` 会红，而且报错位置离原因很远。

## 数据从哪来

- 模板清单：`apps/docs/components/playground/templateManifest.ts`（已是 catalog 的输入）。
- 模板源码：`apps/docs/components/playground/pages/<slug>.vue`，原样收进 catalog 的 `source`。
- 说明、关键词、分类：`packages/cli/src/generate/template-meta.ts` + manifest 的分类。
- 依赖：从 `source` 的 `import` 语句里读，去掉相对路径和 `node:`，取包根名
  （`@astryx-vue/core/Button` → `@astryx-vue/core`），排序去重。已有的
  `analyzeTemplateImports` 已经解析同一批 import，扩展它，不另写一套正则（DRY）。

## 要改的文件

| 文件 | 改什么 |
| --- | --- |
| `packages/cli/src/catalog-types.ts` | `TemplateRecord` 加 `dependencies: string[]`：这个模板的源码 import 了哪些 npm 包 |
| `packages/cli/src/generate/build-templates.ts` | `analyzeTemplateImports` 同时返回 `packages`；记录里写 `dependencies`；新增 `TEMPLATE_RUNTIME_PACKAGES = ['@astryx-vue/core', 'vue']`，生成时断言「`isReady` 的模板依赖必须 ⊆ 这两个包」，越界就报错并点名模板和多余包 |
| `packages/cli/src/commands/template.ts` | `template.list` / `template.show` / `template.skeleton` 的 JSON 都带上 `dependencies` |
| `packages/cli/src/format.ts` | 文本输出：list 的页脚说明「可复制模板只依赖 vue 和 @astryx-vue/core」；detail 和 skeleton 各加一行 `Dependencies: ...` |
| `packages/cli/src/spec.ts` | `template` 的 summary 和 `--list` 的说明提到依赖与 57 个模板的来历 |
| `packages/cli/src/templates.test.ts` | 新用例：每条记录都有 `dependencies`；`isReady` 的记录只有那两个包；list 页脚、detail 行、JSON 字段；搜得到模板 |
| `apps/docs/docs/{en,zh}/guide/cli.md` | 53 → 57；补「模板只依赖 `vue` 和 `@astryx-vue/core`，`isReady: false` 的模板能读不能复制」 |
| `packages/cli/README.md`、`README.zh-CN.md` | 同上（各改一句） |
| `packages/cli/src/generated/catalog.json` | `pnpm --filter @astryx-vue/cli generate` 重生成 |

不碰：`packages/core`、`packages/themes`、演练场组件与模板源码、`ROADMAP.md`、`SWARM.md`。
命令依旧只读：本轮不给 `template` 加任何写文件的路径，`copy` 的行为不变。

## 怎么测

1. 先写测试再改代码（`templates.test.ts` 加用例，先红后绿）。
2. 两种 NODE_ENV 下 `pnpm exec vitest run --maxWorkers=2 packages/cli` 都要过。
3. `pnpm exec eslint . --max-warnings 0`、`pnpm check:packages`（含 catalog 新鲜度）、
   `pnpm --filter @astryx-vue/cli generate` 后 `git status` 干净。
4. 在临时目录里真跑：`template --list`、`template --list --json`、`template login`、
   `template login --json`、`template login --skeleton`、`search login --type template`、
   `template login ./src/pages`（落地到临时目录，确认写出文件、命令还是只写目标路径）。
   输出贴进 `impl-1.md`。
5. 归零检查：跑过上面这些命令后，临时目录里除了 copy 的目标文件没有别的新增/改动。

## 节奏

每做完一块提交一次（中文提交信息），不推送、不开 PR。卡住超过 20 分钟就提交现状、
写进 `impl-1.md`，做下一项。

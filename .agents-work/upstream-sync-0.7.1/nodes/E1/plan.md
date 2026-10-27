# E1 拆分脚本与 CLI 生成器大文件 · 执行计划

## 目标

把下面 4 个超过 500 行的文件拆成几个职责单一的小模块。拆完以后每个文件都不超过 500 行，**功能和产出完全不变**。然后把它们从 500 行白名单里删掉。

| 文件 | 现在行数 | 它是干什么的 |
| --- | --- | --- |
| `scripts/sync-exports.mjs` | 673 | `pnpm sync` 的主体，生成总入口、样式汇总、文案汇总、`package.json` 的 exports |
| `packages/cli/src/generate/markdown.ts` | 608 | 从文档页 Markdown 里抽出组件说明、示例、props 表，给 CLI 的 catalog 用 |
| `packages/cli/src/generate/template-meta.ts` | 553 | 手写的数据：每个演练场模板的描述和关键词，共 53 条 |
| `apps/docs/scripts/llms-txt.ts` | 567 | 生成文档站的 `llms.txt`、`llms-full.txt` 和每页 Markdown |

这是一次纯粹的重构，也就是只调整代码的组织方式。**不改任何行为、不改输出、不改对外接口。** 后面的 D4（CLI 命令）会在这些文件上继续加功能，拆好了它才好接手。

## 工作环境

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/E1`，分支 `sync/e1-split-scripts`。只在这里改。
- 已经合入的护栏（A3）：
  - `node scripts/check-line-limit.mjs` 检查行数。
  - 白名单在 `scripts/guardrails/line-limit-allowlist.json`。
  - 拆完后运行 `node scripts/check-line-limit.mjs --update`，它会自动删掉已经不超标的条目。
- 跑测试时限制并发：`pnpm vitest run --maxWorkers=2 <文件>`。
- 不需要开浏览器。
- 如果你的 shell 里 `NODE_ENV=production`，跑文档站构建和测试时用 `NODE_ENV=development` 或者 `unset NODE_ENV`。

## 先存一份「拆之前」的基准

动手前先跑下面这些，把产物复制到 `/tmp/e1-before/`。拆完以后要逐字节对比。

1. `pnpm build:packages`，然后 `pnpm sync --check`，确认现在是干净的。
2. `pnpm --filter @astryx-vue/cli generate`，把 `packages/cli/src/generated/catalog.json` 复制一份。
3. `pnpm docs:build`，把文档站产物里的 `llms.txt`、`llms-full.txt`、`en/llms.txt` 之类的文件，以及所有逐页 `.md` 复制一份。具体位置看 `apps/docs/.vitepress/llms.ts`，一般在 `apps/docs/.vitepress/dist/` 下面。
4. 记下这几个测试文件当前的通过数：`tests/sync-exports.test.ts`、`tests/llms-txt.test.ts`、`packages/cli/src/generate/*.test.ts`、`packages/cli/src/cli.test.ts`。

## 怎么拆

总原则：

- 按职责拆，不按行数硬切。每个新模块要能用一句话说清它负责什么。
- 原来的入口文件路径保留，对外导出的名字和签名一个都不变。别处 import 的路径不用改。原文件可以变成一个很薄的入口，从新模块里重新导出。
- 新模块放在原文件旁边的同名目录里，比如 `scripts/sync-exports/`、`packages/cli/src/generate/markdown/`。
- 能顺手消掉的重复代码就消掉（DRY），但前提是不改变行为。
- 注释写这个模块现在负责什么，不写「从哪里拆出来的」这种历史。

各文件的建议拆法。这只是起点，你读完代码可以调整：

### `scripts/sync-exports.mjs`

- `ts-exports`：用 TypeScript 编译器 API 收集导出。也就是 `collectExports`、`resolveModule`、`modifiersOf` 这一组。
- `render-index`：生成 `packages/core/src/index.ts` 和 `composables/index.ts`。
- `render-css`：生成样式汇总和主题汇总。
- `render-messages`：生成 `locale/messages.ts`。
- `package-exports`：处理 `package.json` 的 exports 和 publishConfig，以及 JSON 局部替换。
- 入口 `sync-exports.mjs`：保留 `syncExports()`、`generatedFiles()`，以及读写、回滚、eslint 修复、diff 汇总这些流程代码，还有命令行入口。
- 常量（`ROOT_NAME_OMISSIONS` 等）放到职责最接近的模块里。不要放进一个什么都装的 `constants`。

### `packages/cli/src/generate/markdown.ts`

- 页面切段和分类：`splitSections`、`classify`。
- 表格解析：Markdown 表格和 HTML 表格，以及列类型识别。
- 文案提取：摘要、句子拆分、首段。
- 示例提取：`extractExamples`、`demoBindings`。
- 入口保留 `extractPage`、`extractTopic` 以及所有现有导出。

### `packages/cli/src/generate/template-meta.ts`

这是数据文件，不是逻辑文件。按模板的类别拆成几个数据文件，比如 `template-meta/dashboards.ts`、`forms.ts`，再由入口合并成同一个 `TEMPLATE_META`。要求：

- 合并后对象的**键的顺序**和原来一样，因为下游有可能按顺序遍历。最简单的办法是让入口按原顺序合并。
- `TemplateMeta` 接口留在入口文件里，或者放进单独的 `types.ts`。
- 顶部那段注释说明了「为什么这是手写数据」，要保留到入口文件里。

### `apps/docs/scripts/llms-txt.ts`

- 路径与分类：`localizeSourcePath`、`markdownPathFor`、`classifyPage` 等。
- 读取素材：Markdown 列表、demo 源码、catalog。
- 块展开：`createExpander` 和那几个 `expand*` 函数。
- 渲染与写出：`renderIndex`、`renderFullText`、`writeArtifact`。
- 入口保留 `generateLlmsArtifacts` 和所有现有导出。

## 拆完以后

1. 运行 `node scripts/check-line-limit.mjs --update`，确认白名单里这 4 条被删掉了，没有动别的条目。再运行一次不带参数的检查，确认通过。
2. 重新生成全部产物，和 `/tmp/e1-before/` 逐字节对比，要求完全一样：
   - `pnpm sync --check`
   - `pnpm --filter @astryx-vue/cli generate:check`
   - 重新 `pnpm docs:build`，再用 `diff -r` 比较 llms 产物
3. 第 4 步记下的那几个测试，通过数和拆之前一样，而且全部通过。
4. 跑完整的 `pnpm check`。为了遵守内存纪律，把其中的 test 步骤换成 `pnpm vitest run --maxWorkers=2`，其余步骤照常。
5. 新文件每个都不超过 500 行。也不要拆得太碎：单个模块少于 30 行时，想想是不是应该和别的合并。

## 不做

- 不改任何生成规则，也不改输出内容。即使你发现了 bug，也只记在回报里，不修。
- 不碰文档站大文件（E2 的事），也不碰 `packages/cli/src/cli.ts`（D4 的事）。
- 不加依赖。

## 提交与回报

- 在分支上提交，提交信息用中文，例如 `refactor: 拆分 sync-exports 与 CLI 生成器大文件`。可以按文件分几次提交。不要推送。
- 回报写到 `/Users/shenqingchuan/workspace/astryx-vue/.agents-work/upstream-sync-0.7.1/nodes/E1/impl-1.md`。注意是主仓库的这个路径。回报包括：
  1. 每个原文件拆成了哪些模块，每个模块一句话说明职责，以及行数。
  2. 「拆之前 / 拆之后」产物对比的命令和结果。
  3. 测试通过数，拆之前和拆之后各是多少。
  4. 白名单的变化。
  5. 顺手发现、但没修的问题。
- 最终回复用中文，300 字以内。

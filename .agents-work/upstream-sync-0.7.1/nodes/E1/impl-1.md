# E1 拆分脚本与 CLI 生成器大文件 · 实现回报（第 1 轮）

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/E1`，分支 `sync/e1-split-scripts`，未推送。
- 提交（基于 `c24deed`）：
  - `e1c85da` refactor: 按职责拆分 sync-exports 脚本
  - `00349de` refactor: 拆分 CLI 生成器的 Markdown 解析模块
  - `81b35ed` refactor: 按模板类别拆分 template-meta 数据
  - `fa3c116` refactor: 拆分文档站 llms-txt 生成脚本
  - `67c7924` chore: 从 500 行白名单移除已拆分的 4 个文件

## 1. 拆分结果

原文件路径都保留，对外导出的名字和签名一个没变。别处的 import 路径一处都没改。

### `scripts/sync-exports.mjs`（673 → 124）

| 模块 | 行数 | 职责 |
| --- | --- | --- |
| `scripts/sync-exports.mjs` | 124 | 入口：`generatedFiles()` 汇总全部生成文件，`syncExports()` 负责写盘、eslint 修复、比较、回滚和差异摘要，还有命令行入口 |
| `sync-exports/ts-exports.mjs` | 127 | 用 TS 编译器 API 收集模块的具名导出（`collectExports`、`resolveModule`、`modifiersOf`） |
| `sync-exports/render-index.mjs` | 121 | 生成 `src/index.ts` 和 `composables/index.ts`；`ROOT_NAME_OMISSIONS`、`COMPOSABLE_FILE_OMISSIONS` 放在这里 |
| `sync-exports/render-css.mjs` | 72 | 生成 `styles.css` 和各主题入口；`STYLE_FILE_OMISSIONS`、`THEME_FONT_IMPORTS`、`CSS_BANNER` 放在这里 |
| `sync-exports/render-messages.mjs` | 61 | 生成 `locale/messages.ts` |
| `sync-exports/package-exports.mjs` | 189 | 维护 `package.json` 的 exports 和 publishConfig，并只替换这两个字段的 JSON 文本；`STATIC_EXPORT_KEYS` 放在这里 |
| `sync-exports/source-layout.mjs` | 29 | 几个生成器共用的约定：`TS_BANNER`、`compareName`/`compareDir`、`componentDirs` |

`source-layout.mjs` 不到 30 行，但我没有把它并进别的模块。原因是它被 4 个模块共用。如果并进其中一个（比如 render-index），另外 3 个就得依赖一个不相干的模块。

顺手去掉的重复（DRY），行为不变：
- `renderIndex` 和 `renderComposables` 里有一段一样的「值导出写一行、类型导出写一行」，抽成了 `pushNamedExports`。
- `renderPackageExports` 和 `replaceOrInsertTopLevel` 里有一样的「找到字段位置 → 替换文本」，抽成了 `replaceJsonValue`。

### `packages/cli/src/generate/markdown.ts`（608 → 157）

| 模块 | 行数 | 职责 |
| --- | --- | --- |
| `markdown.ts` | 157 | 入口：`extractPage`、`extractTopic`、`pascalCase`、`findImport`，并重新导出其余公开函数和类型 |
| `markdown/sections.ts` | 76 | 按 h2/h3 切段，判断每段是什么内容（`splitSections`、`classify`、`isApiKind`） |
| `markdown/tables.ts` | 188 | 解析 Markdown 表格和 HTML 表格，识别列类型，判断表格属于哪组 API，提取最佳实践，去掉表格，把普通表格渲染成列表 |
| `markdown/prose.ts` | 118 | 文案提取：摘要（`pickSummary`）、句子拆分、`firstParagraph`、`firstSentence`、`paragraphContaining` |
| `markdown/examples.ts` | 74 | `PageExample` 类型、`extractExamples`、`demoBindings`，以及读取 DemoExample 属性 |
| `markdown/text.ts` | 54 | 底层文本工具：`cleanMarkdown`、frontmatter 标题、标题层级、HTML 实体解码、跳过代码块做替换、`tidy` |

### `packages/cli/src/generate/template-meta.ts`（553 → 33）

| 模块 | 行数 | 职责 |
| --- | --- | --- |
| `template-meta.ts` | 33 | 入口：保留「为什么这是手写数据」的说明，按演练场清单的顺序把各类数据合并成 `TEMPLATE_META`，并重新导出 `TemplateMeta` |
| `template-meta/types.ts` | 14 | `TemplateMeta` 接口，以及关键词怎么写的说明 |
| `template-meta/content.ts` | 106 | 主题展示、AI 对话、内容类页面（共 10 条） |
| `template-meta/dashboards.ts` | 75 | 仪表盘（7 条） |
| `template-meta/forms.ts` | 85 | 表单（8 条） |
| `template-meta/galleries.ts` | 65 | 主视觉和画廊（6 条） |
| `template-meta/account.ts` | 65 | 登录和设置（6 条） |
| `template-meta/shells.ts` | 45 | 应用框架（4 条） |
| `template-meta/tables.ts` | 75 | 表格（7 条） |
| `template-meta/tools.ts` | 55 | 工具类：编辑器、文件浏览器、IDE、看板（5 条） |

`types.ts` 只有 14 行，但必须单独放。数据文件需要引用这个接口，入口文件又要引用数据文件。如果接口留在入口里，就会形成循环引用。

我验证了两件事：合并后的对象和原对象 JSON 完全相同，53 个键的顺序也一样。验证方法是用 node 同时 import 旧版（从 git 取出）和新版，比较两者的 `JSON.stringify` 结果。

我还同步改了 3 处文档里的路径说明，因为数据已经不在原文件里了：`packages/cli/README.md`、`README.zh-CN.md`，以及 `catalog-types.ts` 里的一行注释。改完后指向 `template-meta/` 目录。

### `apps/docs/scripts/llms-txt.ts`（567 → 127）

| 模块 | 行数 | 职责 |
| --- | --- | --- |
| `llms-txt.ts` | 127 | 入口：`generateLlmsArtifacts` 串起各步骤并写盘（`writeArtifact`）；还有 `LlmsArtifacts`、`LlmsBuildOptions`，并重新导出全部原有导出 |
| `llms-txt/paths.ts` | 99 | 路径换算和页面归属：`LlmsPage`、`COMPONENT_TABS`、`localizeSourcePath`、`markdownPathFor`、`urlForMarkdownPath`、`markdownPathForUrl`、`classifyPage`、`describePage` |
| `llms-txt/sources.ts` | 88 | 读素材：Markdown 列表、demo 源码、组件目录、`resolveHtmlPath` |
| `llms-txt/expand.ts` | 117 | 块展开：`ExpandContext`、`createExpander` 和各个 `expand*` 函数 |
| `llms-txt/render-page.ts` | 63 | 单页渲染：`LlmsPageEntry`、`renderPage`、`titleFromSource` |
| `llms-txt/render-index.ts` | 123 | 两个汇总文件：`SITE_URL`、`collectSections`、`renderIndex`、`renderFullText` |

和计划的差别有两处：
- 计划建议把「渲染」和「写出」放在一起。我拆成了 `render-page`（单页）和 `render-index`（两个汇总文件），`writeArtifact` 留在入口文件。这样渲染模块只算字符串，不碰磁盘。
- 新目录叫 `llms-txt/`，和原文件同名，符合计划里「同名目录」的约定。

去掉的重复：原来的 `RenderOptions` 是手抄的一份接口，字段和 `ExpandContext` 去掉 `locale`、`slug` 后完全一样。现在改成 `Omit<ExpandContext, 'locale' | 'slug'>`。

## 2. 拆之前 / 拆之后的产物对比

基准存在 `/tmp/e1-before/`：`catalog.json`，以及 `apps/docs/.vitepress/dist` 下全部 `.txt` 和 `.md`，共 563 个文件。生成基准时没有设置 NODE_ENV。

| 检查 | 命令 | 结果 |
| --- | --- | --- |
| sync 产物 | `node scripts/sync-exports.mjs --check` | 「生成结果和已提交文件一致。」`git status` 里没有任何生成文件的改动 |
| CLI catalog | `pnpm --filter @astryx-vue/cli generate:check`，再 `cmp packages/cli/src/generated/catalog.json /tmp/e1-before/catalog.json` | 「catalog is up to date (245 components, 31 topics, 53 templates)」，cmp 结果完全相同 |
| llms 产物 | 先删掉 dist，重新 `pnpm docs:build`，复制出 `.txt` 和 `.md`，再 `diff -r /tmp/e1-before/llms /tmp/e1-after/llms` | 没有差异，两边都是 563 个文件。构建日志里的 `llms:` 几行（页面数、各文件大小）也完全相同 |

## 3. 测试通过数

计划第 4 步指定的测试文件，命令是 `pnpm vitest run --maxWorkers=2 <这些文件>`，NODE_ENV 未设置：

| 文件 | 拆之前 | 拆之后 |
| --- | --- | --- |
| `tests/sync-exports.test.ts` | 2 通过 | 2 通过 |
| `tests/llms-txt.test.ts` | 35 通过 | 35 通过 |
| `packages/cli/src/generate/markdown.test.ts` | 10 通过 | 10 通过 |
| `packages/cli/src/generate/build-catalog.test.ts` | 4 通过 | 4 通过 |
| `packages/cli/src/cli.test.ts` | 32 通过 | 32 通过 |
| 合计 | 83 / 83 | 83 / 83 |

完整的 `pnpm check` 里，test 步骤换成了 `pnpm vitest run --maxWorkers=2`，其余步骤照常跑：
- `check:packages`、`lint`、`typecheck`、`build`、`lint:pkg` 都通过。
- 全量测试：218 个文件，2440 条测试，2426 条通过，14 条失败。
- 14 条失败全部来自 `packages/core/src/Resizable/ResizeHandle.test.ts`。拆之前我用 `git stash` 回到基准提交跑过一次，同样是 14 条失败、23 条通过，数量相同。
  - 设了 `NODE_ENV=production` 时 37 条全部通过；没设 NODE_ENV 或设成 `test` 时失败 14 条。
  - 总控已确认，这是 A3 的问题：开发模式下模板注释让组件根节点变成了 Fragment。所以不属于本节点，我没有动这个文件。
- 除了这个文件，其余测试全部通过。

## 4. 白名单变化

运行 `node scripts/check-line-limit.mjs --update` 后，`scripts/guardrails/line-limit-allowlist.json` 删掉了下面 4 条，没有动别的条目：

```
-  "apps/docs/scripts/llms-txt.ts": 567,
-  "packages/cli/src/generate/markdown.ts": 608,
-  "packages/cli/src/generate/template-meta.ts": 553,
-  "scripts/sync-exports.mjs": 673
```

（最后一条删掉后，`TableData.vue` 那一行末尾的逗号也跟着去掉了，这是 JSON 格式的要求。）

之后又运行了一次不带参数的 `node scripts/check-line-limit.mjs`，结果是「源码单文件行数检查通过」。新文件里最长的是 189 行。

## 5. 顺手发现、但没修的问题

1. 运行 `pnpm sync` 时，`generatedFiles()` 先调一次 `renderComposables`，`renderIndex` 内部又调一次，所以同一批 composables 文件会被解析两遍。只是多花一点时间，产出没有错。D4 以后可以把第一次的结果传进去复用。
2. `LlmsPage.sitePath` 的注释写的是「去掉语言前缀后的路径，例如 `en/components/button/index.md`」。实际上它只去掉 `zh/`，英文页面会保留 `en/` 前缀。注释和例子说得不清楚，我原样搬过来，没有改。
3. 环境问题：本机 shell 默认 `NODE_ENV=production`。这会让 ResizeHandle 的 14 条失败看起来像是通过了。验收的时候请注意统一用同一个 NODE_ENV。

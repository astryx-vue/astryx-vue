# D4b CLI 选定能力实现 · 第 1 轮实现回报

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/D4b`，分支 `sync/d4b-cli-commands`。只在本地提交，没有推送。
- 提交（基于 `6579eef`）：

  - `70fcc8c` refactor(cli): 把 cli.ts 拆成每个命令一个文件
  - `0c92e9d` feat(cli): catalog 支持多个包，每条记录标明来源包
  - `3fee9c8` feat(cli): search 结果标明来源包，同分时按领域排序
  - `f77938e` feat(cli): docs 支持 --depth 控制输出到第几层标题
  - `c7e41bd` fix(cli): 标题正则不用可回溯的 `\s+`，避免 lint 报错
  - `fb65683` feat(cli): build、template、manifest 补齐来源包与置信度字段
  - `db7e14c` docs(cli): 说明 docs --depth、结果来源包和多包 catalog
  - `17bb8be` refactor(cli): 根帮助只留一份，删掉 format.ts 里的重复实现
  - `ed23848` feat(cli): docs --depth 的错误码写进命令说明
  - `77410ea` refactor(cli): 模板 catalog 单独一个文件，build-catalog 留出余量

## 1. 做了什么

按计划「第 1 步」的四条做，第 2 步（`init`/`theme`/`upgrade`/`doctor`）没有开始。

1. **拆开 `cli.ts`**：原来 623 行一个文件，现在 71 行，只做「读参数 → 查命令 → 交给对应处理函数」。参数解析在 `cli/args.ts`，输出与命令上下文在 `cli/context.ts`，帮助/版本/`--help` 信封在 `cli/help.ts`，每个命令一个文件在 `commands/`。`component` 和 `composable` 共用一个 `commands/record.ts`（形状完全一样，只差读哪批记录、标签怎么印），两个命令文件各 7 行。`format.ts` 里原来还有一份根帮助，和拆出来的那份重复，删掉了。
2. **catalog 支持多个包**：新增 `generate/packages.ts`，从 `packages/*/package.json` 发现工作区里的包（跳过 CLI 自己），读出「PascalCase 子路径导出」「`src/` 下有源码入口的组件名」「是否只发 canary」。组件归属规则：先看 docs 页面自己写的 import 指向哪个包，没有就找有 `./<Name>` 子路径导出的包，再没有就找 `src/<Name>/` 存在的包。每条 `ComponentRecord` 带 `package`，每个 `TemplateRecord` 带 `package`，`Catalog` 带 `packages`（`name` / `directory` / `canary`）。`markdown.ts` 里只认 `@astryx-vue/core` 的导入正则放宽到所有 `@astryx-vue/*` 包；模板的「可安装包」不再写死 `vue` + core，改由发现的包名单得出。「某个导出没人写文档」的检查也改成按包逐个查。
3. **`search`**：每条结果带来源包（组件取记录自己的包，文档页 `@astryx-vue/docs`，模板记录里的 `@astryx-vue/cli`）；文本输出加了 `Results for "q" (shown of matched)` 表头和每条的包名；同分时按领域（component → composable → doc → template）再按名字排序，跑两次顺序不变。
4. **`docs --depth <n>`**：新增 `--depth`，比它更深的标题连同下面的正文一起省略，代码块里的 `#` 不算标题。JSON 里带 `depth`，`headings` 只留还在正文里的那些；`--depth` 不是正整数、或者不带主题时返回 `ERR_INVALID_ARGUMENT`（退出码 2）。
5. **`build` / `template` / `manifest` 补齐字段**：`build.kit` 加了 `matchCount`、`hasResults`、`directMatch`、`basis`（`direct` / `closest` / `fallback`），`TemplateMatch` 带 `package` 和覆盖率（`matchedTermCount` / `termCount`）；`template --list` 每条带 `package` 和 `componentsUsed`；`manifest` 加 `packages`，让 AI 助手一次看清 CLI 覆盖了哪些包。
6. **`layout` 命令组**：我们的 CLI 从来没有这个命令组（`grep layout packages/cli/src` 只命中正文里的普通词），所以这一条是空操作。
7. **行数白名单**：`scripts/guardrails/line-limit-allowlist.json` 现在是 `{}`，`cli.ts` 不再靠白名单放行。顺手把 `build-catalog.ts` 里模板那段拆到 `generate/build-templates.ts`，让它在 400 行以内留出余量。

| 文件 | 行数 | 职责 |
| --- | --- | --- |
| `packages/cli/src/cli.ts` | 71 | 读参数、查命令、分发给处理函数，出错时统一包成信封 |
| `packages/cli/src/cli/args.ts` | 93 | argv 解析、选项校验、`--cwd` 取目录 |
| `packages/cli/src/cli/context.ts` | 53 | 命令上下文（`--json`/`--dense`/`--zh`/`cwd`）、JSON 输出、结果包装 |
| `packages/cli/src/cli/help.ts` | 91 | 根帮助、单命令帮助、`--help`/`--version` 信封、CLI 版本号 |
| `packages/cli/src/commands/record.ts` | 105 | `component` / `composable` 共用的列表与详情 |
| `packages/cli/src/commands/component.ts` | 7 | `astryx-vue component` |
| `packages/cli/src/commands/composable.ts` | 7 | `astryx-vue composable` |
| `packages/cli/src/commands/docs.ts` | 59 | `docs`，含 `--depth` |
| `packages/cli/src/commands/search.ts` | 39 | `search`，`--limit` / `--type` |
| `packages/cli/src/commands/template.ts` | 110 | `template` 的 list / show / skeleton / copy 四种模式 |
| `packages/cli/src/commands/build.ts` | 49 | `build` 的工作流说明与 kit |
| `packages/cli/src/commands/manifest.ts` | 26 | `manifest` |
| `packages/cli/src/commands/init.ts` | 96 | `init --features agents`（本轮只搬位置，行为不变） |
| `packages/cli/src/docs-depth.ts` | 49 | `--depth` 的取值校验与正文裁剪 |
| `packages/cli/src/generate/packages.ts` | 130 | 发现工作区里的包、判断组件归属、算导入路径、算可安装包名单 |
| `packages/cli/src/generate/build-templates.ts` | 131 | 从演练场页面 + 手写元数据生成模板记录，分析模板的 import |
| `packages/cli/src/generate/site.ts` | 5 | 文档站域名，所有 `docsUrl` 用它 |
| `packages/cli/src/generate/build-catalog.ts` | 372 | 组装整个 catalog（组件、话题、模板、包清单） |
| `packages/cli/src/generated/catalog.json` | 生成物 | 加了 `packages`、每条的 `package`，重新生成并提交 |

## 2. 和上游的对照

| 上游改动 | 上游怎么做 | 我们怎么做 | 为什么效果相同 |
| --- | --- | --- | --- |
| `458ff35b1` 删掉 `astryx layout` 命令组 | 上游删掉 layout check/expand/grammar | 我们不删，因为没有 | 用户敲 `astryx-vue layout` 两边都得到「未知命令」 |
| `aa0134e61` `docs --depth` | 按文档树走 N 层：`0` 只有命名空间本身，`all` 是全部，配 `--detail` 决定每篇显示多少 | 我们的文档只有「话题 + 标题层级」，没有树，所以 `--depth <n>` 理解成「正文留到第 n 层标题」，更深的小节连同正文省略 | 用户要的效果是「别把整页都倒出来、只看我要的那几层」，这一点一致；不同点见第 3 节 |
| `884f1d882` 文本视图印出 search 结果的全部字段 | 每条结果按固定字段顺序印（name、section、domain、package、title…），命令前缀换成调用方的包管理器 | 每条印 `[domain] 名字  包名` + 一句描述 + 下一步命令；包名是新加的 | 用户都能从结果直接看出「这是哪个包的东西、下一步敲什么」 |
| `fb78fa1fb` / `a477e48a2` 搜索排序：同分时按领域、组件排在只有关键词/标题命中的文档前面 | 先按分数，再按领域优先级和名字合并两个序列 | 先按分数，同分按领域（component → composable → doc → template）再按名字 | 用户看到的「同分谁在前面」是稳定且可解释的；上游那套按覆盖率和标题短语打分的细节没有搬，见第 3 节 |
| `444da2a51` CLI README 里写清 `apiVersion` 和真实可用的 flag | 更新 README | 同步更新中英 README：`--depth`、结果的来源包、多包 catalog 与检查规则 | 文档和命令行为对得上 |
| 上游 `component.detail` 的信封 `package` 是「组件所属的包」 | `ComponentDetailResponse.package` = owner package，列表每条带 `package` | 详情信封 `package` = 记录自己的包；列表的信封不再带 `package`，每条带 | 同一条记录说的包和它实际所在包一致；列表可能横跨多个包，放在信封上会误导 |
| 上游 `template.list` 每条带 `package`、`componentsUsed` | `TemplateListEntry` | 我们同样加这两个字段 | 用户在复制前就知道模板从哪来、用到哪些组件 |
| 上游 `build.kit` 有 `matchCount` / `hasResults` / `directMatch` / `start.basis` | 由页面排序器给出 | 加了同名四个字段（`basis` 放 kit 上）：想法里每个词都命中了就 `direct`，只命中一部分是 `closest`，没命中是 `fallback` | 用户/助手能知道「这是最像的」还是「这就是你要的」，和我们自己的排序器口径一致 |
| 上游 `manifest` 有 args/options/responseTypes/exitCodes | `CLIManifest` | 早就对齐了；本轮再加一个 `packages`（上游没有，多包才需要） | 助手一次调用就知道能装哪些包 |

## 3. 和计划不一样的地方

1. **`docs --depth` 的口径**：计划写「控制输出到第几层标题」，我按字面做了；上游的 `--depth` 其实是按文档树的层级遍历（`0` / `1` / `all` + `--detail`）。我们的 catalog 只有「话题 + 扁平标题」，没有树，照搬会得到一个永远只能取 `0` 或 `all` 的旗子。如果验收希望改回上游那种树遍历，得先让 catalog 记录标题层级和父子关系，属于文档站的改动，不在本轮。
2. **`search` 的排序只补了「同分怎么排」**：上游有一整套按名字/关键词/正文分层打分，还有 `domainPriority` 把用户点名的文档抬到其它结果前面。我们把「名字 > 名字包含 > 近似名 > 正文」这套保留原样，只加了领域这一层同分规则。要把上游的打分整段搬过来是一大块工作（上游 `search.mjs` 1933 行），建议单开节点。
3. **`build` 的字段是新增不是重命名**：上游叫 `query` / `start` / `pages` / `domain`，我们沿用 `idea` / `template` / `otherTemplates` / `components`，只补了 `matchCount`、`hasResults`、`directMatch`、`basis`。改名会让 README、AGENTS.md 托管区块和已有测试一起动，本轮不做；如果验收要求字段名也一致，可以在第 2 步一起改。
4. **`component.detail` 没有加 `sourceAvailable`**：上游用它表示「能不能 swizzle 到源码」，我们不做 swizzle（D4a 已定），加了就是空字段。
5. **`init` 没动**：托管区块里仍然只说 core 和 themes，没有提 richtext/charts/lab。原因是 `init` 的完整行为在第 2 步，等它和 `theme`/`doctor` 一起改更合适，见第 6 节。
6. **顺手修的两个小事**：`build-catalog.ts` 里模板那段拆成 `generate/build-templates.ts`（原本 496 行，贴着 500 行红线）；中英 README 里「53 个模板」的旧数字改成实际的 57。

## 4. 台账处理

本轮只做计划里的第 1 步，D4 台账（313 条）按节点安排往后放。本轮实际碰到并处理掉的是这几条：

- `458ff35b1` 删掉 `astryx layout` 命令组 —— 已采纳（我们本来没有这个命令组，`grep` 确认）；
- `aa0134e61` `docs --depth` —— 已采纳，但口径按我们的文档结构调整，理由见第 3 节第 1 条；
- `884f1d882` 文本视图印出 search 结果的全部字段 —— 已采纳（包名 + 描述 + 下一步命令）；
- `fb78fa1fb` / `a477e48a2` 搜索排序 —— 部分采纳（同分按领域），其余留给单独节点；
- `444da2a51` README 写清 `apiVersion` 和真实 flag —— 已采纳。

其余条目（`init`、`theme`、`upgrade`、`doctor`、codemod、integration、swizzle、gap-report、discover、blog、`layout` 的历史条目等）不在本轮范围，留到第 2 步或标记为不适用。

## 5. 自测结果

| # | 自测项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | `env -u NODE_ENV pnpm exec vitest run --maxWorkers=2 packages/cli` | 过 | 8 个文件、109 条用例 |
| 2 | `env NODE_ENV=production pnpm exec vitest run --maxWorkers=2 packages/cli` | 过 | 8 个文件、109 条用例，和上一条相同 |
| 3 | `env -u NODE_ENV pnpm exec vitest run --maxWorkers=2 tests` | 过 | 24 个文件、442 条用例（行数检查、发布检查等仓库级测试） |
| 4 | `pnpm exec eslint . --max-warnings 0` | 过 | 退出码 0，无输出 |
| 5 | `env -u NODE_ENV pnpm check:packages` | 过 | 包边界、路径大小写、生成物一致、`catalog is up to date (245 components, 36 topics, 57 templates)`、行数检查、`!important`、模板变量、i18n 全部通过 |
| 6 | `env -u NODE_ENV pnpm --filter @astryx-vue/cli generate` | 过 | 重新生成并提交 `catalog.json`（+330 行） |
| 7 | 真实二进制冒烟 | 过 | `pnpm --filter @astryx-vue/cli build` 后跑 `node packages/cli/bin/astryx-vue.mjs search clipboard --limit 3`，输出 `[composable] useClipboard  @astryx-vue/core`；`docs guide/styling --depth 2 --dense` 不再打印 `### UnoCSS` |
| 8 | 行数 | 过 | 源码最大 `format.ts` 405 行、`build-catalog.ts` 372 行；`cli.ts` 71 行；白名单文件为 `{}` |

新增的测试：`docs-depth.test.ts`（深度裁剪、代码块里的 `#`、非法取值）、`generate/packages.test.ts`（用临时目录造 4 个假包：发现、canary 标记、归属、导入路径、可安装名单）、`build-catalog.test.ts` 里的模板 import 分析（lab 的组件算组件，演练场图表包算外来包）、`cli.test.ts` 里的来源包与多包 catalog 断言、同分排序不变式。

## 6. 拿不准的地方

1. **`docs --depth` 到底要哪种语义**。我按计划的字面做了「标题层级」，上游是「文档树层级」。如果验收以「和上游一致」为准，这一条要返工，前提是 catalog 先记下标题层级和父子结构。
2. **`build.kit` 要不要跟上游同名字段**（`query` / `start` / `pages` / `domain`）。本轮只加了少量字段，改名会牵动 README、AGENTS.md 托管区块和一批测试，想请总控定一下第 2 步是否一起改。
3. **`component.list` / `composable.list` 的信封不再带 `package`**，改成每条带。这是为多包准备的，但会让依赖 `envelope.package` 的下游（目前只有我们的测试）改一次；如果希望信封继续带一个「默认包」，请说一声，我可以补成「只有全部记录同属一个包时才写信封」。
4. **`init` 的托管区块还只提 core 和 themes**，没提 richtext/charts/lab。第 2 步做 `init` 的完整指引时会一起改；如果现在就想让 `AGENTS.md` 提到新包，我可以提前只动这一段。

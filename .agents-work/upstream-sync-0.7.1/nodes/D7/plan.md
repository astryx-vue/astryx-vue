# D7 迁移指南与版本信息 · 执行计划

## 目标

用户从 `@astryx-vue/core` / `@astryx-vue/themes` 0.3.x 升到下一个版本（对齐上游 v0.7.1）时，打开文档站的「升级指南」就能逐条看到：哪里变了、以前怎么写、现在怎么写、怎么改。文档站标明当前对齐的上游版本。文档示例跟着站点语言走，不再写死英文。`llms.txt` 是最新的。

## 工作环境

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/D7`，分支 `sync/d7-migration`，槽位 3，端口 5173。只在这里改。
- 动手前先读：
  - `.agents-work/upstream-sync-0.7.1/SWARM.md` 的「对齐上游的标准」「跑检查时的环境」。
  - 台账：`.agents-work/upstream-sync-0.7.1/ledger/D7.md`（18 条破坏性 + 10 条其它）。
  - **各节点留给 D7 的说明**（这是迁移指南的主要素材，逐个读完）：`nodes/B1/impl-1.md`（删掉的旧名清单）、`nodes/B2/impl-1.md`（reset）、`nodes/B4-fix/impl-1.md`、`nodes/B5/impl-3.md`（locale 标签变化）、`nodes/B6/impl-1.md`（FR10 公共 props）、`nodes/C1/impl-1.md`、`nodes/C2/impl-1.md`、`nodes/C3/impl-1.md`（`labelHidden`、`variant="default"`）、`nodes/C6/impl-1.md`、`nodes/C7/impl-1.md`、`nodes/C15/impl-2.md`。用 `grep -n "D7" <文件>` 找到对应段落。其余 C 节点（C4、C5、C8–C14、C16）的 `impl-*.md` 和 `ledger/C*.md` 里搜「破坏」「迁移」「改名」「删除」「默认」，确认没有遗漏。
  - `.agents-work/upstream-sync-0.7.1/HANDOFF.md`「用户拍板的决定」一节：B2 完整 reset 是破坏性改动；B6 组件根上直接写的 `class/style` 保持原落点（和上游不同，要写清楚）。
  - ROADMAP D7 那一行（`grep -n "^| D7 迁移" .agents-work/upstream-sync-0.7.1/ROADMAP.md`）：已确认要写的三条（Tab/TabMenu 必须在 TabList 里、Step 必须在 Stepper 里、`useDismiss` 的 `enableEscape` 改为 `dismissOnEscape`）。
  - 上游参考：发布博文 `git -C /Users/shenqingchuan/workspace/astryx-upstream show v0.7.1:apps/docsite/src/content/blog/posts/astryx-v0-5-0.md`（还有 `v0-6-0`、`v0-7-0`，用 `git ls-tree` 找确切路径）。
  - 我们的文档站：`apps/docs/docs/{zh,en}/guide/`、`apps/docs/.vitepress/sidebar.ts`、`apps/docs/.vitepress/llms.ts`。
- 环境纪律：测试和构建命令前加 `env -u NODE_ENV`；vitest 加 `--maxWorkers=2`。
- 浏览器：只能用 `node scripts/swarm/browser-lock.mjs run --purpose D7 --max-run 120 -- <命令>`，同一时刻只开 1 个。文档站用 5173 端口，用完关掉。

## 要交付的东西

| 项 | 效果 |
| --- | --- |
| 升级指南 | 新增 `apps/docs/docs/zh/guide/migration.md` 和 `apps/docs/docs/en/guide/migration.md`，侧栏「更新日志」旁边加入口。每条写四件事：变了什么、以前怎么写、现在怎么写、怎么改（有自动化办法就写，没有就写手动步骤）。按影响面分组：样式与主题、组件 API、行为变化、文案与语言、工具（CLI）。每条后面标上游 PR 号和我们的节点号 |
| 版本信息 | 根 `package.json` 的 `upstream` 字段：`version` 改成 `0.7.1`，`commit` 改成上游 `v0.7.1` 标签指向的提交（`git -C <upstream> rev-list -n1 v0.7.1`）。文档站里如果有展示上游版本的地方，确认它读的就是这个字段（`grep -rn "upstream" apps/docs`），没有就在升级指南开头写一句「本版本对齐 Astryx v0.7.1」 |
| `provideAstryxLocale('en')` 清理 | `apps/docs` 里 38 处写死 `provideAstryxLocale('en')`（`grep -rln "provideAstryxLocale('en')" apps/docs`）。文档页外壳 `apps/docs/.vitepress/theme/ComponentDocsPage.vue` 已经按站点语言提供 locale，示例删掉这一行（和不再用到的 import）就会跟着站点语言走。删之前看清每处为什么写：如果某个示例依赖英文文案做断言或排版（比如 `ThemeStage.vue`），确认删掉后中文页面不会坏；真的必须保持英文的，留下并写一行注释说明用途 |
| llms.txt | 改完文档后跑 `env -u NODE_ENV pnpm docs:build`，确认 `llms.ts` 生成的产物里有升级指南。如果 llms 产物是提交进仓库的（`git ls-files | grep -i llms`），就提交新产物；如果只在构建时生成，就不用提交，在回报里写明 |
| 台账 | `ledger/D7.md` 28 条全部 `- [x]` 并写结论。破坏性的 18 条：写「已采纳：见升级指南第 X 节」或「不适用：<理由>」（例如 CLI 的 `astryx layout` 我们本来没有，`d859ae984` 读 agent 环境变量我们没有）。其它 10 条（博文、浏览器支持策略、版本规范）多半不适用，写理由 |

## 写作要求

- 中文版是主版本，英文版内容对应。句子短，一句只说一件事，用大白话。代码块写 Vue 单文件组件写法（`<script setup lang="ts">`、模板里用 kebab-case 属性）。
- 「以前 / 现在」用两个代码块对照，不要用表格塞代码。
- 只写我们这边真实发生的变化。上游的破坏性改动如果我们从来没有那个 API（例如 StyleX 相关、React 专有），不进升级指南，只在台账里标不适用。
- 每条都要能在代码里找到证据：写之前 `grep` 确认新名字存在、旧名字的现状（删了还是保留为别名）。别名还在的，写「旧名暂时还能用，会在之后的版本删除」。
- 不写修改历史和节点内部过程（不写「C3 第 3 轮发现……」），用户只关心升级要做什么。

## 任务范围

- 要改：`apps/docs/docs/{zh,en}/guide/migration.md`（新建）、`apps/docs/.vitepress/sidebar.ts`、38 个示例文件、根 `package.json` 的 `upstream` 字段、`apps/docs/docs/{zh,en}/guide/changelog.md`（加一句指向升级指南）、`packages/cli/src/generated/catalog.json`（如果 `generate:check` 要求重生，只能用 `pnpm --filter @astryx-vue/cli generate` 生成）、台账 `ledger/D7.md`。
- 不碰：组件源码、主题 CSS、`CHANGELOG.md`（由 changeset 生成）、`.changeset/`（发版是 G1 的事）、`ROADMAP.md`、`SWARM.md`。发现组件行为和说明对不上时，写进回报，不要改组件。

## 开发步骤

1. 收集素材：把上面列的各节点「给 D7 的说明」和 D7 台账 18 条破坏性改动，整理成一份清单 `/tmp/D7-items.md`（不提交）。每条标：我们有没有这个变化、证据（文件和行号）、新旧写法。
2. 写中文 `migration.md`。提交。
3. 写英文 `migration.md`，侧栏加入口，`changelog.md` 加链接。提交。
4. 清理 `provideAstryxLocale('en')`。每改一批（比如 10 个）提交一次。
5. 根 `package.json` 的 `upstream` 字段。提交。
6. `docs:build`，处理 llms 产物和 catalog。提交。
7. 台账 28 条写结论。提交。

## 自测要求

1. `env -u NODE_ENV pnpm exec vitest run --maxWorkers=2 apps/docs tests packages/cli`（docs 下如果没有测试会被跳过，正常），全部通过；`NODE_ENV=production` 同一命令，用例数相同。
2. `env -u NODE_ENV pnpm exec eslint --max-warnings 0 apps/docs/components apps/docs/.vitepress`、`node scripts/check-line-limit.mjs`、`node scripts/sync-exports.mjs --check`、`env -u NODE_ENV pnpm --filter @astryx-vue/cli generate:check`、`env -u NODE_ENV pnpm check:i18n-catalog` 都通过。
3. `env -u NODE_ENV pnpm build:packages && env -u NODE_ENV pnpm docs:build` 成功。
4. 起文档站（5173），打开 `/guide/migration` 和 `/en/guide/migration`，确认侧栏能进、代码块正常高亮、目录完整。再打开 3 个删过 `provideAstryxLocale('en')` 的组件页（挑 typeahead、token、thumbnail），中文页上的组件内置文案（比如「清除」「无结果」）是中文，英文页上是英文。结果写进回报。看完关掉服务。
5. `grep -rn "provideAstryxLocale('en')" apps/docs` 剩下的每一处都有注释说明为什么保留。

## 提交与回报

- 分步提交，提交信息用中文。不要推送。不要改 `ROADMAP.md`。
- 回报写到 `/Users/shenqingchuan/workspace/astryx-vue/.agents-work/upstream-sync-0.7.1/nodes/D7/impl-1.md`，格式见 `templates/impl-report.md`。额外加一节「升级指南条目清单」：每条一行，写条目标题、证据位置、来源（上游 PR / 我们的节点）。再加一节「发现的说明和代码不一致」。
- 最终回复用中文，300 字以内。

# 移植上游 meta/astryx 的一批提交（共用说明）

## 背景
- 你在一个 git worktree 里，仓库是 astryx-vue：React 组件库 meta/astryx 的 Vue 3 移植版。目标是把上游 <起点标签>..<终点标签> 的改动对齐过来。总原则：**用户看到的样子、用起来的手感和上游一致，代码不用照抄**。
- 上游本地克隆：<上游克隆路径>（partial clone，`git -C <它> show <hash>` 会按需拉取，慢一点正常）。读最终形态用终点标签：`git -C <它> show <终点标签>:<路径>`。
- 你的任务清单是一个文本文件（路径在任务说明里）。每个条目第一行是 `<9位hash> <提交标题>`，下面缩进的行是这个提交在你负责的范围里改到的上游文件。带 `[某族名]` 的缩进行是别的组件族已经对这个提交给出的结论：照着它判断是否已经做过，别重复移植。
- 别的代理同时在做别的范围。只做你清单里的条目，只碰与之相关的文件。

## 每个条目怎么判
先读上游 diff（只看你这份清单列出的文件即可，必要时看全貌），弄清它改的是什么行为，再在 Vue 版找对应代码，归到下面一类：
1. **已移植**：在 Vue 里实现等价行为，测试和文档一并补上。
2. **Vue 版已有**：已经是这个行为。写出依据（文件加机制）。
3. **不适用**：只关系到 React、StyleX、React Native、上游内部规范或测试设施、上游独有的包或工具链、上游 CLI 里我们没有也不该有的命令等。写一句具体理由。
4. **暂缓**：确实依赖 Vue 版还没有的大块设施。写清缺什么。尽量少，能做就做。

只改文档的上游提交，检查 Vue 文档 apps/docs（中英两套）要不要补同样的说明，要补就算第 1 类。
上游组件的 `*.doc.mjs` 对应我们 apps/docs 里的组件文档页。上游 `packages/core/locales/*.json` 对应我们的 `packages/core/locales/*.json` 加 `packages/core/src/locale/`（内置文案、upstreamMap）。`pnpm check:i18n-catalog` 会核对它们。

### 关于 CLI（只对 CLI 范围的任务）
我们的 `@astryx-vue/cli`（packages/cli）是自己写的、面向 agent 的查询工具，命令有 component、composable、search、docs、template、theme、doctor、init、upgrade、manifest、build、record。它和上游 CLI 的代码结构完全不同，规模也小得多。判断标准：
- 上游改动对应的能力在我们的 CLI 里有：照用户可见行为移植，包括输出、搜索结果、文档内容、模板、错误提示。
- 上游的能力对 Vue 用户同样有意义，并且符合我们 CLI 的定位（帮 agent 查组件、文档、模板、主题，检查项目）：移植，必要时新增子命令或选项。
- 只服务 React/StyleX、上游自己的发布流水线、源码拷贝（swizzle）这类 React 生态专属能力：不适用，写明理由。
- 上游模板（assets/templates 等）对应我们 CLI 的模板（packages/cli 里 templates 相关代码和资源）。新模板或模板修正要用 Vue SFC 写出等价版本。

## Vue 版约定
- 组件在 packages/core/src/<Comp>/<Comp>.vue，样式在 packages/core/styles/*.css，组合式函数在 packages/core/src/composables。lab、richtext、charts 各在 packages/ 下。
- 测试用 vitest 加 @vue/test-utils，和源码放在一起（*.test.ts）。每条新测试都要先确认：去掉修复会失败，加上修复会通过。
- 文档在 apps/docs，中英各一份，props 表要跟着改。改了组件说明后运行 `pnpm --filter @astryx-vue/cli generate` 重新生成 packages/cli/src/generated/catalog.json。catalog 一旦变了，changeset 里必须带上 `'@astryx-vue/cli': patch`。
- `packages/core/src/index.ts` 是生成文件，加了新导出就运行 `pnpm sync`，不要手改。
- 每个 PR 都加 changeset（.changeset/*.md），一句中文、面向用户的说明。bug 修复记 patch；新增公开 API 记 minor。纯内部改动（只改测试、文档站、脚本）可以不加。
- 单个源码文件不超过 500 行（`scripts/check-line-limit.mjs` 会查），要超了就拆模块。
- 代码注释只描述现状和用途，不写变更历史。
- 参考已合并的同类 PR：astryx-vue/astryx-vue#498 到 #519（例如 `gh pr view 500 --repo astryx-vue/astryx-vue`、`gh pr diff 500 --repo astryx-vue/astryx-vue`）。

## 流程
1. 在 worktree 里先 `pnpm install --frozen-lockfile`。
2. 从 origin/main 新建分支 `feat/sync-<任务名>`，写代码和测试。改动大时拆成两三个 PR，按顺序合并。
3. 提交时**逐个写出文件名**再 `git add`，不要用 `git add -A` 或 `git add .`。提交前看一眼 `git status`，确认没有混进无关文件（比如本地缓存、临时目录）。
4. 推送前本地必须全部通过：
   - `pnpm check:packages`
   - `node ./scripts/check-cli-catalog-release.mjs origin/main HEAD`
   - `pnpm lint`
   - `pnpm typecheck`
   - 相关的 vitest 测试；动到 core 组件时加跑 `pnpm vitest run packages/core/src/ssr-smoke.test.ts`。
   - 改了文档或 catalog 时必须跑 `pnpm vitest run packages/cli`（catalog 里组件、文档页的数量变了它会失败）。
   - 能跑就跑全量 `pnpm test`。已知 List.test.ts 的 "delegates a row click..." 和 Banner 的 "restores the previous focus target on dismissal" 偶发失败，与本任务无关。
   - 动到 apps/docs 时加跑 `pnpm --filter @astryx-vue/docs build`，它会查死链。
5. 提交信息用中文，形如 `fix(core): Token 的移除按钮不再盖住旁边的文字（上游 #7728）`。
6. 开 PR 到 main，标题和正文用中文。正文列出覆盖的上游提交（链接 https://github.com/meta/astryx/commit/<hash>）以及每条怎么处理的。
   不要用 `gh pr edit`（会报 Projects classic 的 GraphQL 错误）。要改正文，用 `gh api -X PATCH repos/astryx-vue/astryx-vue/pulls/N -F body=@file`。
7. 用 `gh pr checks N --repo astryx-vue/astryx-vue --watch` 等 CI。失败就修，修完再推。
8. CI 全绿后**不要自己合并**，在报告里列出 PR 号，由主会话验收后合并。
   如果因为 main 有了新提交而冲突：`git fetch origin && git merge origin/main`。不要 rebase，不要 force push。catalog.json 和 core 的 index.ts 冲突一律重新生成（`pnpm --filter @astryx-vue/cli generate`、`pnpm sync`），不要手工合并。然后重跑第 4 步，推送，等 CI，再合并。
9. 不要动 upstream-sync/pending 分支和清单文件，清单由主会话统一勾选。

## 交付
1. 把每个条目的结论写进结果文件（路径在任务说明里），每个条目一行，一个都不能漏：
   `<9位hash> | <已移植 #PR号 / Vue 版已有 / 不适用 / 暂缓> | <一句话说明>`
   例：`a6740a738 | 已移植 #530 | Popover 先关闭时取消自动聚焦的那一帧，补测试`
   一个 PR 覆盖多条就都写同一个 PR 号。说明里不要出现 `|`。
2. 最终报告：先用一两句话说明开了哪些 PR、CI 是否全绿（不要合并），结果文件写了多少行、各类各多少。然后列出暂缓的条目和原因，以及任何用户能感觉到的默认行为或外观变化。

## 省 token
- 少做发散阅读，不要派子代理或 fork。
- 长命令放后台，用 until 循环等结果。
- 报告要短：PR 号、各类条数、暂缓原因、用户可感知的变化。不用复述过程。
- 不要用 `git stash`/`git stash pop`（stash 栈是所有 worktree 共用的，会弹出别人的东西）。要暂存改动就先做一个临时提交。
- 交报告前确认自己开的后台命令（CI watch、until 循环、构建）都已结束，不要留下还在跑的后台任务。

## 动效（重要）
本仓库的基调是还原上游、功能好用，用 Vue 等价实现，必要时有取舍。动效是上游的长处，要尽量还原：时长和曲线、弹簧和惯性的手感、手势跟手、布局滑动、进退场。不用 StyleX，用普通 CSS 加 TypeScript。详见 docs/adr/0002-motion-fidelity.md（合并后在 main 上）。
- 上游改了动效，而 Vue 版更简单、没有这个动画，这**不是**「不适用」的理由。缺动效或手势设施本身的，判「暂缓」，并写明「归动效与手势引擎任务」。不缺的，直接移植。
- 只有 React 渲染时机、StyleX 写法、上游内部工具链相关的改动，才判「不适用」。

## 常见误判（主会话验收时反复纠正过的）
- 主题挂点：Vue 有组件部位主题挂点机制（defineTheme({ components }) + 元素上的 `astryx-<target>` 类和 data-* 属性，见 packages/core/src/Theme/componentStyles.ts、componentPartTargets.test.ts、apps/docs/docs/*/themes/extending.md）。上游新增 theme target 要移植。
- 触屏呈现（presentation、presentation hold、进场输入遮挡）：Vue 还没有，判「暂缓」归动效与手势引擎任务，不是「不适用」。
- 主题 token 驱动的行为（例如按反色底决定文字深浅）：Vue 的 useTheme 能读 tokens，Theme/contrast.ts 有 parseColor，能做就做。
- 一个上游提交只做了一部分（例如内核做了、组件没接），判「暂缓」并写清剩什么，不要判「已移植」。
- lab 要用 core 里不公开的工具（上游从 `core/internal/*` 引入的那类）：不要做成 core 的正式导出。照 packages/core/src/List/index.ts 的约定，用 `unstable_` 前缀改名导出、加一行说明注释，不写文档，core 的 changeset 记 patch。
- 新增的 core 内部导出如果在服务端渲染出空内容，ssr-smoke 会失败：在 packages/core/src/ssr-smoke.fixtures.ts 里登记一行。

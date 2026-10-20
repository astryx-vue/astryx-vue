# E4 CI 接入视觉对照 · 执行计划

## 目标

有人提了 PR，并且改到了某些组件时，GitHub Actions 要自动做三件事：

1. 只对**被改到的组件**跑一遍 A2 做的视觉对照工具。
2. 把对照图打包，作为 workflow 的附件上传。
3. 在 PR 里留一条评论，列出每个组件在四种组合下的分数，并附上附件的下载链接。

这一步**只报告，不拦截**。分数高不会让 CI 变红。原因是目前我们和上游本来就有不少差距，在后面的 C 节点追平之前，用分数去拦截没有意义。

## 工作环境

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/E4`，分支 `sync/e4-ci-visual`。只在这里改。
- 先读规程：`/Users/shenqingchuan/workspace/astryx-vue/.agents-work/upstream-sync/SWARM.md`，特别是「跑检查时的环境」一节。
- 再读 A2 的工具：
  - `scripts/swarm/README.md`
  - `scripts/swarm/visual-compare.mjs`
  - `scripts/swarm/visual-compare/*.mjs`
- A2 验收时留下的已知问题记在 `/Users/shenqingchuan/workspace/astryx-vue/.agents-work/upstream-sync/nodes/A4/carry-over.md`。这些由 A4 去修，你不要修。但第 3 条（组件名拼错时很晚才报错）会影响 CI：请在你写的那一层，先判断组件页存不存在，避免白白开一次浏览器。
- 现有的 CI 配置在 `.github/workflows/docs.yml` 和 `release.yml`，照着它们的风格写：
  - action 要锁定提交哈希，像 release.yml 那样。
  - 注释用中文，讲清楚「为什么这么做」。
- 跑测试时限制并发：`env -u NODE_ENV pnpm vitest run --maxWorkers=2`。

### 浏览器纪律

- 整台电脑同一时刻最多 2 个浏览器会话。
- 本地开浏览器只能通过 `pnpm visual`（它会自动拿锁）或 `browser-lock.mjs run`。
- 本地自测时，文档站服务固定用 **5174** 端口（4 号槽位）。`pnpm visual` 默认用 5172，可以加 `--no-serve --ours http://localhost:5174/...`，或者看工具支不支持改端口。用完把服务关掉。

## 要做的事

### 1. 从「改了哪些文件」推出「改了哪些组件」

新建脚本 `scripts/swarm/changed-components.mjs`：输入一组改动的文件路径（或者一个 git 范围），输出受影响的组件英文名列表。

映射规则：

| 改了什么 | 受影响的组件 |
| --- | --- |
| `packages/core/src/<Dir>/**` | 这个目录对应的组件。一个目录里可能有好几个组件（比如 `DropdownMenu/` 里有 `DropdownMenuItem`），只取对照工具能找到页面的那几个，至少要包含目录同名的主组件 |
| `packages/core/styles/<kebab>.css`、`packages/themes/neutral/<kebab>.css` | kebab 名换算成对应的组件 |
| `apps/docs/components/demos/<slug>/**` | slug 对应的组件 |
| `packages/themes/neutral.css`、`packages/core/src/composables/**`、`packages/core/src/Theme/**`、`packages/core/reset.css` | 影响面太广，不全跑，改跑一组固定的「代表组件」：`Button`、`TextInput`、`Selector`、`Dialog`、`DropdownMenu`、`Table`。这份名单写在配置里，并说明为什么选这些 |
| 其它文件 | 不触发 |

补充要求：

- 组件名和 slug 的换算，复用 A2 的 `scripts/swarm/visual-compare/names.mjs`，不要另写一份。
- 一次最多跑 **8 个**组件，超出的写进报告，标明「这次没跑」，不要悄悄丢掉。

### 2. GitHub Actions workflow

新建 `.github/workflows/visual-compare.yml`：

- **触发**：
  - `pull_request`，路径只限 `packages/core/**`、`packages/themes/**`、`apps/docs/components/demos/**`。
  - 同时支持 `workflow_dispatch`，可以手动输入组件名。
- **并发控制**：同一个 PR 只保留最新的一次运行。
- **步骤**：
  1. checkout，需要取到 base，用来算 diff。
  2. 安装 pnpm 和 Node。
  3. `pnpm install --frozen-lockfile`。
  4. 安装 Playwright 的 Chromium。CI 上没有本机的缓存，要用 `npx playwright install --with-deps chromium`，版本跟着 lock 文件走。最好再用 `actions/cache` 缓存浏览器。
  5. 算出受影响的组件。没有组件就提前结束。
  6. `pnpm build:packages`。
  7. 逐个组件跑 `pnpm visual <C> --out visual-out`。CI 上不需要本机代理，确认工具在没有代理的环境里也能正常访问上游，或者加上 `--no-proxy`。CI 机器只跑这一个任务，浏览器锁照常拿就行，不会冲突。
  8. 上传 `visual-out` 作为附件，用 `actions/upload-artifact`，保留 14 天。
  9. 在 PR 里评论：每个组件一行，列出四种组合的内容区分数、尺寸差，以及附件下载链接。同一个 PR 的评论要**更新**而不是重复发，用一个隐藏标记找到旧评论再改。评论内容用中文。
- **失败处理**：
  - 某个组件截图失败（比如上游页面不存在）时，在评论里标出来，其他组件继续跑。
  - 整个 job 只有在「工具本身崩溃」时才失败。
- **权限**：只申请需要的，`contents: read`、`pull-requests: write`。
- 从 fork 来的 PR 没有写评论的权限，要能平稳跳过评论这一步，不能报错。

### 3. 评论内容的生成

把「根据 `report.json` 生成评论的 Markdown」写成一个纯函数，放在 `scripts/swarm/visual-comment.mjs`，并且要有单元测试。workflow 里只调用它，不要在 YAML 里拼字符串。

### 4. 测试

新建 `tests/changed-components.test.ts` 和 `tests/visual-comment.test.ts`，覆盖：

- 各类路径怎么映射成组件。
- 公共文件触发「代表组件」那一组。
- 超过 8 个时的截断和报告。
- 不相关的文件不触发。
- 评论内容：分数表、失败的组件、没跑的组件、隐藏标记。

### 5. 本地演练

GitHub Actions 没法在本地完整跑一遍，但下面这些要做到：

1. 在本地，用一个假的改动列表跑一遍「算组件 → 逐个跑 visual → 生成评论」的完整链路。改动列表里包含 `packages/core/src/Button/Button.vue` 和 `packages/core/src/Badge/Badge.vue`。生成的评论 Markdown 贴进回报。
2. 用 `actionlint` 检查 workflow 文件。没有装的话，先试 `npx` 或 `brew`。都装不上就用 `node -e` 解析一下 YAML 确认语法，并在回报里说明。
3. 按 GitHub 文档核对一遍：所有引用的 action 都锁定了哈希，权限是最小的，fork 来的 PR 不会报错。

## 不做

- 不修 A2 工具本身的问题（那是 A4 的事）。如果确实挡住了你，在回报里写清楚。
- 不把分数当成拦截条件。
- 不改现有的 `docs.yml` 和 `release.yml`。

## 提交与回报

- 在分支上提交，提交信息用中文。不要推送。
- 回报写到 `/Users/shenqingchuan/workspace/astryx-vue/.agents-work/upstream-sync/nodes/E4/impl-1.md`（主仓库路径），内容包括：
  1. 新增了哪些文件，各自的职责。
  2. 组件映射规则，以及代表组件名单和选择理由。
  3. 本地演练的结果，附上生成的评论原文。
  4. actionlint 的结果。
  5. 哪些地方只能等第一次真正推到 GitHub 才能验证。
- 最终回复用中文，300 字以内。

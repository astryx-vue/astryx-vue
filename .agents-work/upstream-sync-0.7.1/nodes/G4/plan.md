# G4 持续同步机制 · 执行计划

## 目标

上游 facebook/astryx 每发一个新版本，我们这边自动开一批 issue，放进 GitHub Project「astryx-vue 路线图」。一个组件族一个 issue，正文是这一族要跟进的上游提交清单，每条前面一个勾选框。

之后的工作流程都从 issue 开始：
1. 总控从 Project 里挑 issue，派给 worker。
2. worker 开 PR，PR 正文写 `Closes #N`。
3. PR 合并后，issue 自动关闭，Project 里的卡片自动挪到「已完成」。

用户已确认的决定（2026-10-27）：
- 一个组件族一个 issue。
- 没做完的老任务也搬进 Project，Project 是唯一的看板。
- 上游的 `packages/native` 标成「不适用」。

## 现状

- `scripts/upstream-ledger.mjs` 能把上游 `from..to` 的提交按文件路径归到任务树节点，再写成 Markdown 台账。归类规则在 `scripts/upstream-ledger/rules.mjs`，测试在 `tests/upstream-ledger.test.ts`。
- 上游现在已经到 v0.7.4，比 v0.7.1 多了 312 个提交。用 `--from v0.7.1 --to v0.7.4` 跑脚本会报 83 个文件没有规则命中。没命中的主要是这几类：
  - `packages/native/**`，共 27 个文件。
  - lab 新增的文件，共 32 个。
  - core 新增的文件，共 14 个。
  - docs 新增的文件，共 10 个。
- 现在的节点 ID（C1、C7……）是「追到 v0.7.1」这棵任务树专用的。以后每个版本不再建新树，改按**组件族**分组。组件族直接沿用 C 阶段的分法：基础输入、选择器、浮层……。

## 要做的事

### 1. 归类规则改成能长期用

- 在 `rules.mjs` 里加一张「组件族」表，key 用稳定的英文 slug，比如 `inputs`、`selectors`、`overlays`、`table`、`themes`、`cli`、`richtext`、`charts`、`lab`、`docs`。中文名取自现在的 C 节点名。
- 现有规则的 `nodes` 映射到组件族：C1 → `inputs`，C7 → `overlays`，依此类推。这一层映射写成一张表，不要逐条改规则。
- 新增规则：
  - `packages/native/**` 一律算无关，理由写「原生平台（iOS/Android/macOS/Windows），Vue 版不适用（用户 2026-10-27）」。
  - 补上 v0.7.4 新出现的 core、lab、docs 文件。
- 原来的 v0.7.1 台账输出不能变：`node scripts/upstream-ledger.mjs --check` 必须还是通过。

### 2. 新脚本：`scripts/upstream-sync-issues.mjs`

用法：

```
node scripts/upstream-sync-issues.mjs --from <版本> --to <版本> [--dry-run]
```

- 复用 `classifyCommits`，把提交按组件族分组。
- 每个组件族生成一个 issue：
  - 标题：`同步上游 <to>：<组件族中文名>`。
  - 标签：`upstream-sync`、`area:<slug>`；有破坏性改动的组件族再加 `breaking`。
  - 正文：先放上游 compare 链接，然后是勾选清单。每条写短哈希、标题、上游提交链接，以及改到的文件（最多列 5 个）。破坏性改动排在最前面。
- **不能重复开**：开之前先搜有没有标题相同的 open issue。有就只更新正文里的清单，已经打勾的保留不动。
- 开出的 issue 加进 Project，`Status` 设成 `Todo`，`Upstream` 字段填 `<to>`。
- 加 `--dry-run` 时只打印要开的 issue，不调 GitHub。
- 统一用 `gh` 命令行调 GitHub，脚本里不要直接写 token。
- 和 GitHub 打交道的部分单独放一个模块，issue 正文怎么渲染是纯函数，要有单元测试。

### 3. 记录同步到了哪个上游版本

- 在根目录 `package.json` 的 `upstream` 字段旁边加一个 `syncedTo`，表示 issue 已经开到哪个上游版本，`version` 继续表示代码已经对齐到哪个版本。
- 脚本跑成功后，开一个 PR 更新 `syncedTo`，或者由工作流直接改。选更简单的那种，在回报里说明。

### 4. 定时任务：`.github/workflows/upstream-sync.yml`

- 触发：每周一 UTC 01:00 跑一次；也可以手动触发，手动时能填 `from` / `to`。
- 步骤：
  1. 检出本仓库。
  2. 检出上游，`fetch --tags`。
  3. 找出比 `syncedTo` 更新的最新 tag。没有新 tag 就退出。
  4. 运行 `upstream-sync-issues.mjs`。
  5. 更新 `syncedTo`。
- 权限：`issues: write`、`contents: write`。
- 操作 Project 要用 PAT：Projects v2 的 GITHUB_TOKEN 不能写组织的 Project。从 secret `PROJECT_TOKEN` 读取。secret 没配时，issue 照样开，只是跳过加进 Project 这一步，并在 job summary 里提示。
- 规则没命中时脚本会以退出码 2 失败。这时工作流开一个 `upstream-sync: 归类规则需要补` 的 issue，把没命中的文件列出来。

### 5. 文档

在 `CONTRIBUTING.md` 或 `RELEASING.md` 旁边新建 `docs/upstream-sync.md`，写清楚：
- 流程是怎么跑的。
- 怎么手动触发。
- 规则没命中时怎么补。
- PR 怎么关联 issue。

## 自测

1. `vitest run --maxWorkers=2 tests/upstream-ledger.test.ts tests/upstream-sync-issues.test.ts` 通过，NODE_ENV 不设和设成 production 两种模式都要跑。
2. `node scripts/upstream-ledger.mjs --check` 通过，原台账不变。
3. `node scripts/upstream-sync-issues.mjs --from v0.7.1 --to v0.7.4 --dry-run` 没有未命中的文件。把输出贴进回报，里面应该有每个组件族的 issue 标题和条目数。
4. 用 `actionlint` 检查工作流，有的话就跑。
5. **不要真的开 issue**。真开由总控来做。

## 纪律

- 工作区和分支以派活提示为准。每做完一步就提交，至少每 15 分钟提交一次，不要推送。
- 单个文件不超过 500 行。`rules.mjs` 现在 406 行，加了组件族表之后会超，要拆开。

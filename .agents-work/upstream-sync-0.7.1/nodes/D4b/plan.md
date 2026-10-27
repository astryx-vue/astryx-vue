# D4b CLI 选定能力实现 · 执行计划

## 目标

把 D4a 定下来的命令行能力做出来。范围以 `nodes/D4a/decisions.md` 里「D4b 范围（D4a 定稿）」一节为准，每条怎么做见同文件第 1 到 7 条。

**做完的样子**：用户和 AI 助手在终端里敲 `astryx-vue <命令>`，下面这些都能用。所有命令都只读、只输出指引，**不改用户的任何文件**。

| 命令 | 做什么 |
| --- | --- |
| `search <词>` | 结果按相关度排序，每条标出来自哪个包（core / themes / richtext / charts / lab） |
| `docs <主题> --depth <n>` | 控制输出到第几层标题 |
| `build <描述>` | 按描述挑出最合适的起始模板（已有，要对照上游补细节） |
| `component` / `composable` / `template` / `manifest` | 输出字段对照上游补齐 |
| `init` | 输出给 AI 助手的接入指引，并维护 `AGENTS.md` 里我们那一段（见 D4a 第 3 条）。这是**唯一会写文件的命令**，而且只写 `AGENTS.md` 里起止标记之间的那一段 |
| `theme` | 不带参数时列出全部主题；`theme <名字>` 输出完整接入说明（见 D4a 第 6 条） |
| `upgrade` | 读用户项目里 core 的版本，输出从这个版本升上来要做的事，并列出项目里可能要改的位置（见 D4a 第 7 条） |
| `doctor` | 检查依赖版本有没有对上、样式表引了没有、主题设了没有，只报告，不修改 |

不做：`swizzle`、`gap-report`、`discover`、`integration`、`blog`，以及上游已经删掉的 `layout` 命令组。

## 依据

- 上游 CLI：`git -C /Users/shenqingchuan/workspace/astryx-upstream show v0.7.1:packages/cli/<路径>`，文件清单用 `ls-tree -r --name-only v0.7.1 packages/cli/src`。台账在 `.agents-work/upstream-sync-0.7.1/ledger/D4.md`（313 条）。
- 上游的 `init`、`upgrade`、`theme add`、`doctor` 都会改用户的文件。**我们不照搬**：用户已经定了，这几个命令只输出指引。只学上游**输出了哪些信息**，不学它改了哪些文件。
- 我们现有的代码：`packages/cli/src/`。`cli.ts` 有 623 行，超出了行数上限，现在是靠白名单放行的。

## 分两步做，各开一个 PR

### 第 1 步：拆开 `cli.ts`，补齐已有命令的细节

1. 把 `cli.ts` 拆成「参数解析 + 分发」和 `commands/<命令>.ts`，每个命令一个文件，每个文件不超过 500 行。拆完把 `cli.ts` 从 `scripts/guardrails/line-limit-allowlist.json` 里删掉。
2. `search` 的排序、来源包，`docs --depth`，`build` 选起始模板，以及 `component` / `composable` / `template` / `manifest` 输出字段，都对照上游补齐。
3. catalog 支持多个包（ADR 0001 第 7.3 节）：`packages/cli/src/generate/build-catalog.ts` 里写死 `@astryx-vue/core` 的地方，都改成能识别多个包，每条记录带上 `package` 字段。richtext、lab 现在已经有了，charts 也有，把它们一起收进 catalog。
4. 如果有 `layout` 命令组，删掉。

### 第 2 步：新增 `init`、`theme`、`upgrade`、`doctor`

照 D4a 第 3、6、7 条的定稿来写。

- 每个命令都同时支持 `--json`（AI 助手用）和普通文本两种输出，和现有命令一样。
- 输出的文字内容直接取自文档站（catalog 里那一份），不在 CLI 里另写一套。
- 探测包管理器时，看 `packageManager` 字段和锁文件；都没有的话，四种安装写法都列出来。

## 测试

- 每个命令都写单元测试：把一个临时目录当成用户项目，断言输出内容；`--json` 输出要做结构断言。
- 再加一条测试：在临时目录里跑完全部命令后，除了 `init` 写的 `AGENTS.md`，没有任何文件被改动。
- `env -u NODE_ENV pnpm exec vitest run --maxWorkers=2 packages/cli`：NODE_ENV 不设、设为 production 两种情况都要通过。
- `pnpm --filter @astryx-vue/cli generate`、`check:packages`、`eslint .` 都要通过。

## 纪律

- 每做完一个命令就提交一次，至少每 15 分钟提交一次。提交信息用中文。不要推送。
- 第 1 步做完先写回报（`impl-1.md`），**停下来等总控验收合入**，再开始第 2 步。
- 一个问题卡住超过 20 分钟：先提交，把现状写进回报，然后做下一项。

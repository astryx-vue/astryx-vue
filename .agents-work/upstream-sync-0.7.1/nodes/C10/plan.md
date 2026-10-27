# C10 Chat 对话 · 执行计划

## 目标

输入框在一个触发字符后面可以连续打多个词，建议列表跟着缩，没有匹配时先藏起来，已经打的字留着。`Chat/types.ts` 拆到 500 行以内。文档站对话页的提及示例可以当场试这两种补全。

## 工作环境

- 工作区：`/workspace`，分支 `sync/c10-chat`，从 `swarm-tree` 切出。云端环境，不用本机 worktree。
- 动手前已读：`SWARM.md`、ROADMAP 里 C10 那一行、`ledger/C10.md`、`packages/core/src/Chat/` 现有实现、上游 v0.7.1 的 `ChatComposerInput.spec.md` 和 `useTriggerMenu.tsx`。
- 环境纪律：测试命令前面加 `env -u NODE_ENV`。vitest 加 `--maxWorkers=2`。再跑一遍 `NODE_ENV=production`，用例数要相同。
- 浏览器：本轮以触发器单测和文档示例为主。文档站如果环境里打得开，再看中文对话页的提及示例。打不开就在回报里写明。

## 上游这条改动让用户看到或感受到了什么

| 上游改动 | 用户看到或感受到的变化 |
| --- | --- |
| 多词查询（#6128，FR10–FR16） | `@` 后面可以打 `Ada Lovelace` 这种带空格的名字，列表还开着。不开启时，空格或制表符会关掉列表。 |
| 没有匹配就藏起 | 多词查询对不上任何人时，列表消失，句子还留在输入框里。调用方写了 `emptySearchText` 时，空列表面板仍在。 |
| 搜索还没回来时按回车 | 消息按已经打出的原文发送，不会选中上一次查询的某一行。迟到的结果也不会把列表重新打开。 |
| Escape | 列表关掉。同一段查询继续往下打时，列表不再冒出来。删回到 Escape 之前，列表回来。藏起的列表不吃掉 Escape。 |
| 系统长通知（#6655） | 窄栏里的系统消息换行，不再被省略号截断。 |
| 拆文件 | 使用者看不到。`Chat/types.ts` 不再超过 500 行。 |

## 上游依据

- 台账：`ledger/C10.md` 全部 63 条。本轮把多词查询补上，其余条目按现有实现逐条标「已采纳」或「不适用」。
- 上游公开契约以 v0.7.1 的 `Chat/ChatComposerInput.spec.md` 里 FR10–FR16 为准。
- 上游测试：`Chat/useTriggerMenu.test.tsx` 改写成 Vue 测试。

## 有没有更适合 Vue 的做法

| 上游怎么做 | 我们怎么做 | 为什么效果一样 |
| --- | --- | --- |
| `useTriggerMenu` 用 React state，并自己管 popover | 继续用现有的 composable 和 `ChatTriggerMenu` | 列表仍出现在光标附近，键盘仍先交给列表 |
| `ariaProps` 由 hook 返回 | 输入框按 `isMenuVisible` 绑定 `aria-expanded` | 列表藏起时读屏读到的是收起的 combobox |
| 用 `search('')` 探测数据源是不是异步 | 第一次见到 Promise 再记下来，不额外搜一次空串 | 异步搜索仍然防抖，同步结果仍然马上出来。上游把那次空搜记成实现缺口 |
| Shift+Enter 在有可选行时会选中那一行 | Shift+Enter 留给编辑器换行 | 规格要求 Shift+Enter 保持多行编辑 |

## 任务范围

- 要改：`packages/core/src/Chat/`、`packages/core/styles/chat.css`、行数白名单里的 `Chat/types.ts`、中英文对话文档和提及示例、`ledger/C10.md`。
- 不碰：别的节点的组件、ROADMAP 状态、生成的 `src/index.ts`（导出面没有变，不手改）。
- 不用 `!important`。

## 开发步骤

1. 给触发器加上 `hasMultiWordQuery`，查询规则按 FR10–FR16。
2. 把 `types.ts` 拆成消息类型和输入类型，原文件只再导出。从行数白名单删掉。
3. 系统消息长文改为换行。
4. 补 Vitest。两种 `NODE_ENV` 都跑。
5. 提及示例改成可以连续打多个词，并加一条单词命令。更新中英文说明。
6. 台账每条写上结论。

## 自测要求

1. `env -u NODE_ENV pnpm vitest run --maxWorkers=2 packages/core/src/Chat packages/core/src/composables/useChatNewMessages.test.ts packages/core/src/composables/useChatStreamScroll.test.ts`
2. `NODE_ENV=production pnpm vitest run --maxWorkers=2` 同一组路径，用例数相同。
3. `node scripts/check-no-important.mjs` 与 `node scripts/check-line-limit.mjs`。
4. 新写和改到的源码文件不超过 500 行。

## 提交与回报

- 提交信息用中文。推送分支 `sync/c10-chat`，草稿 PR 指向 `swarm-tree`，标题 `C10 Chat 对话`。
- 不改 ROADMAP 的节点状态，不自己验收。
- 回报写到 `nodes/C10/impl-1.md`。

## 验证操作要短小

每条命令加 `timeout`。浏览器命令如果要跑，套 `browser-lock.mjs run --max-run`。脚本放在 `/tmp/c10-*`。

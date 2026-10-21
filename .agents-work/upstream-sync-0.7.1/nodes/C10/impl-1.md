# C10 Chat 对话 · 第 1 轮实现回报

- 工作区：`/workspace`，分支 `sync/c10-chat`，从 `swarm-tree` 的 `71671a9` 切出。云端环境，没有用本机 worktree。
- 提交（基于 `71671a9`）：
  - `993965d` feat(chat): 输入框可以连续输入多个词触发补全

## 1. 做了什么

1. 触发器可以设 `hasMultiWordQuery`。查询穿过空格和标点，到换行、65 个字符或同一个触发字符再出现时结束。另一个触发字符留在查询里。没设时，空格或制表符结束查询，制表符也算词边界。
2. 多词查询没有匹配、也没写 `emptySearchText` 时，列表藏起来，`aria-expanded` 是 false。写了空文案则列表仍开着。搜索还没回来时，回车不选行。Escape 之后，同一段查询继续增长，列表不回来。迟到的结果丢掉。关掉列表时不再把编辑器从文档里摘掉。
3. `types.ts` 拆成 `messageTypes.ts` 和 `composerTypes.ts`，原文件只再导出，并从行数白名单删掉。
4. 系统消息去掉单行省略，长通知可以换行。
5. 文档站提及示例改成多词人名加一条 `/` 命令，中英文说明写了怎么试。

| 文件 | 行数 | 职责 |
| --- | --- | --- |
| `packages/core/src/Chat/triggerQuery.ts` | 89 | 触发查询的边界和 64 字上限 |
| `packages/core/src/Chat/useTriggerMenu.ts` | 362 | 搜索、键盘、Escape 记忆、藏起列表 |
| `packages/core/src/Chat/messageTypes.ts` | 293 | 消息、列表、工具调用的类型 |
| `packages/core/src/Chat/composerTypes.ts` | 285 | 输入套件、触发器和标记的类型 |
| `packages/core/src/Chat/types.ts` | 61 | 再导出上面两份类型 |

## 2. 和上游的对照

| 上游改动 | 上游怎么做 | 我们怎么做 | 为什么效果相同 |
| --- | --- | --- | --- |
| 多词查询 | `hasMultiWordQuery`，64 字，换行结束 | 同一套扫描 | `@Ada Lov` 列表还在，空格不再把它关掉 |
| 没有匹配 | 多词且没写空文案时不渲染菜单 | `isHidden`，输入框不报展开 | 句子还在，列表不挡字 |
| 待定搜索时回车 | 不选上一轮的行 | `isLoading` 时回车不选 | 原文发出去 |
| Escape | 记住这段查询，继续打不重开 | 记住触发字符、起点和文本节点 | 删回去才会再打开 |
| 探测异步 | 先 `search('')` | 第一次见到 Promise 再记 | 不额外搜空串。上游把空搜记成缺口 |
| Shift+Enter | 有可选行时会选中 | 留给编辑器换行 | 规格要求换行仍可用 |
| 长系统消息 | 在可用宽度里换行 | 去掉 nowrap 和省略号 | 窄栏里整句看得到 |

## 3. 和计划不一样的地方

Shift+Enter 在列表有可选行时不选中，交给编辑器换行。上游实现会选中。规格 FR3 要求 Shift+Enter 保持多行编辑，所以按规格做。

没有用 `search('')` 探测数据源。那次空搜是上游自己标出的实现缺口。

## 4. 台账处理

一共 63 条。已采纳 47 条，不适用 16 条。每条结论写在 `ledger/C10.md`。

不适用的是：StyleX 嵌套和简写、React ref 合并、被后一条覆盖的 not-allowed 指针、浮层重置（B4）、Probe 扫描夹具、Storybook playground 默认值、设计约定文档、spec 状态改名、Divider 的数字标签（C14）、图表测试分拣，以及上游工具链回归修补。

## 5. 自测结果

| # | 自测项 | 结果 | 证据 |
| --- | --- | --- | --- |
| 1 | `env -u NODE_ENV pnpm vitest run --maxWorkers=2 packages/core/src/Chat packages/core/src/composables/useChatNewMessages.test.ts packages/core/src/composables/useChatStreamScroll.test.ts` | 过 | 5 个文件，75 条 |
| 2 | `NODE_ENV=production` 同一命令 | 过 | 5 个文件，75 条 |
| 3 | eslint（Chat 与提及示例）、`check-line-limit`、`check-no-important` | 过 | 退出码 0。没有跑完整的 `pnpm check` |
| 4 | 视觉对照 | 没开文档站 | 提及示例的展开、藏起和空格关命令，由 `ChatComposer.test.ts` 断言 `aria-expanded` 和列表文字。四种组合的文档站整页留给验收 |

`ssr-known-failures.json` 里没有 Chat。样式没有新增 `!important`。

## 6. 拿不准的地方

文档站整页的四种组合这轮没有截。验收者需要在浏览器里打开 `/components/chat` 的提及示例再看一遍。

`math` 之外没有新的公开导出。`pnpm sync` 没跑，`index.ts` 的导出名单没变。

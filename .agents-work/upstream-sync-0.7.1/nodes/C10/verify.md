# C10 Chat 对话 · 验收计划

你是验收者，只检查，不改代码。实现者写的 `impl-1.md` 只用来了解他做了什么，不能当成证据，每一条都要你亲自重新验证。

**判断标准是效果，不是代码长得像不像上游。** 只要用户看到的样子、操作的手感、读屏读出的内容、公开 API 能做到的事和上游一致，代码结构不同不算问题。

## 环境

- 工作区：`/workspace`，分支 `sync/c10-chat`。云端验收时也用这个分支，不用本机 worktree。
  - `BASE` 指 `git merge-base HEAD swarm-tree`。
- 只读铁律：开始和结束时各跑一次 `git status`，两次结果必须相同。
- 测试环境：
  - 所有测试和构建命令前面加 `env -u NODE_ENV`。
  - 测试相关的检查项跑两遍：一遍 `env -u NODE_ENV`，一遍 `NODE_ENV=production`。两遍都要通过，用例数要相同。
  - vitest 一律加 `--maxWorkers=2`。
- 浏览器：
  - 只能这样开：`pnpm visual chat --out /tmp/verify-C10/visual`，或者 `node scripts/swarm/browser-lock.mjs run --purpose C10-verify -- <命令>`。
  - 文档站用完关掉。中文对话页是 `http://127.0.0.1:<端口>/components/chat`。
  - 给用户的主证据必须是文档站整页，能看到文档壳，并滚到「ChatComposerInput — 提及」。

## 检查项

每一项只能判「过」或「不过」，并附上证据。

### 一、效果和上游一致

1. 打开中文文档站 `/components/chat`，滚到「ChatComposerInput — 提及」。输入 `@Ada Lov`，列表缩到 Ada Lovelace，并且还开着。继续打一段对不上的话，列表藏起来，输入框里的字还在。输入 `/sum` 再打一个空格，命令列表关掉。选中一个人后，草稿里是标记，回车发送出去的是标记的值。桌面浅色先做这一遍。
2. 同一页再看三种组合：桌面深色、390px 浅色、390px 深色。提及列表不溢出页面，系统消息长文在窄屏里换行，不出现横向滚动条。
3. 读屏：有触发器时编辑器是 `combobox`。列表开着时 `aria-expanded="true"`。多词查询没有匹配、列表藏起时是 `false`，没有 `aria-activedescendant`。没有触发器时仍是带 `aria-multiline` 的 `textbox`。

### 二、反向挑刺

4. 键盘：列表开着时，上下方向键只动高亮，回车选中当前行，Escape 关掉列表。关掉之后继续打同一个词，列表不回来；删回到 Escape 之前，列表回来。列表藏起时，方向键、回车、Escape 都交给编辑器，回车会发送原文。
5. 搜索还没回来时按回车：不选中上一轮的行，消息按原文发送。结果迟到后，列表不再打开。
6. 输入法拼字中的 Enter 不选建议，也不发送。
7. 服务端渲染：Chat 家族不在 `ssr-known-failures.json` 里。
8. 超长查询：多词查询超过 64 个字符后列表关掉，已打的字还在。空的工具调用列表什么都不渲染。元信息三个字段都空时不出现分隔点。
9. 图标：工具状态用语义名（`circle-check`、`circle-x`），没有引入另一套图标注册。
10. 没有 `!important`：`node scripts/check-no-important.mjs` 通过。

### 三、C 节点通用检查

11. 台账 `ledger/C10.md` 每一条都是 `- [x]`，下面都有 `- 结论：已采纳` 或 `- 结论：不适用`。抽查至少 3 条「已采纳」，确认确实做了；抽查全部「不适用」的理由，确认站得住。
12. 上游 `useTriggerMenu` 的多词、Escape、待定搜索、迟到结果，都有对应的 Vue 测试。两种 `NODE_ENV` 下都通过，用例数相同。
13. 中英文文档、提及示例、`meta.ts` 都在。打开中英文两个页面，提及示例能操作。
14. 本节点的组件都不在 SSR 已知失败名单里。
15. 附带了四种组合的文档站整页对照图，并且你亲眼看过。报告里每张图标明是「文档站整页」。夹具或 overview 不算这一条。
16. `packages/core/src/Chat/types.ts` 不超过 500 行，并且已经从 `scripts/guardrails/line-limit-allowlist.json` 里移出。拆出去的文件也不超过 500 行。

### 四、整体

17. `env -u NODE_ENV pnpm vitest run --maxWorkers=2 packages/core/src/Chat packages/core/src/composables/useChatNewMessages.test.ts packages/core/src/composables/useChatStreamScroll.test.ts` 通过；`NODE_ENV=production` 再跑一遍通过；用例数相同。
18. 改到的源码文件不超过 500 行：`node scripts/check-line-limit.mjs` 通过。
19. 改动范围：`git diff $BASE --stat` 里没有计划范围以外的文件。`node scripts/sync-exports.mjs --check` 通过。
20. 注释里没有修改历史：`git diff $BASE | grep -nE "^\+.*(原来|改成|之前|moved|extracted|split from)"` 没有命中，或者命中的都不是在讲修改历史。

## 结论

- 只要有一条不过，结论就是「不通过」。
- 报告写到 `nodes/C10/verify-1.md`。
- 最终回复用中文，200 字以内。

## 验证操作要短小

每次验证只测一件事，每条命令都要有时间上限。浏览器命令用 `browser-lock.mjs run --max-run`。脚本和结果放在 `/tmp/verify-C10/`。

# C10 Chat 对话 · 第 1 轮验收

结论：**不通过**。第 4 条不过，其余通过。没有改业务代码，没有 rebase，没有合入。

## 环境

- 分支 `sync/c10-chat`，验收头 `f5570725`。`git merge-base HEAD origin/swarm-tree` 是 `71671a92`。
- PR #147（`sync/c10-chat` → `swarm-tree`）状态：`mergeable=CONFLICTING`，`mergeStateStatus=DIRTY`。按当前头验收，没有自行变基。
- 开始 `git status`：`On branch sync/c10-chat`，`nothing to commit, working tree clean`。
- 只读验收结束、写入本文件之前再跑一次：结果相同，工作区干净。
- 测试：`env -u NODE_ENV` 与 `NODE_ENV=production` 各一遍，都是 5 个文件、75 条，退出码 0。日志在 `/tmp/verify-C10/test-unset.txt`、`/tmp/verify-C10/test-prod.txt`。
- 浏览器开在 `http://127.0.0.1:5172/components/chat`，经 `browser-lock.mjs run --purpose C10-verify`。上游没有合并的 `/components/Chat`（HTTP 404），提及段在 `https://astryx.atmeta.com/components/ChatComposerInput`。

## 逐项

### 1. 多词提及、藏起、斜杠空格、标记值 — 过

桌面浅色打开中文页，滚到「ChatComposerInput — 提及」。

- 输入 `@Ada Lov`：列表只剩 Ada Lovelace，`aria-expanded="true"`。
- 再打 ` nobody`：列表消失，`aria-expanded="false"`，输入框仍是 `@Ada Lov nobody`。
- 换成 `/sum `：列表关掉。
- 输入 `@Ada` 后回车：草稿里是标记，可见 `@Ada Lovelace`，`data-astryx-token-value="@ada"`。再回车，示例下方送出的是 `@ada`。

证据：`/tmp/verify-C10/item1.json`。

### 2. 深色、390 浅色、390 深色 — 过

四种组合里提及列表的盒子都在视口内（390 时约 x=65、宽 180，没有溢出）。页面 `scrollWidth` 等于 `clientWidth`（1440 或 390），没有横向滚动条。

文档站原有的系统消息句子不长。在 390 浅色和深色里，把「ChatSystemMessage — 状态更新」第一条正文改成一句长通知后测量：`white-space: normal`，`overflow-wrap: anywhere`，内容宽 217 且 `scrollWidth` 等于 `clientWidth`，高度 90（已换行），页面仍是 390 宽。这是页面上的临时测量，没有改仓库。

证据：`/tmp/verify-C10/shots.json`、`/tmp/verify-C10/item2.json`。

### 3. 读屏角色 — 过

有触发器的提及框是 `combobox`。列表开着时 `aria-expanded="true"` 且有 `aria-activedescendant`。多词没有匹配、列表藏起时是 `false`，没有 `aria-activedescendant`。同一页上没有触发器的编辑器是 `role="textbox"`、`aria-multiline="true"`，没有 `aria-expanded`。

证据：`/tmp/verify-C10/item1.json`、`/tmp/verify-C10/item3.json`。

### 4. 键盘 — 不过

上下方向键、Escape、藏起后回车，这几段是对的：

- `@a` 打开三行。方向键只改 `aria-selected`，不插入标记。
- Escape 关掉列表。继续打成 `@Ada Lov` 列表不回来。删到 `@Ad` 列表回来，只剩 Ada Lovelace。
- 没有匹配时方向键和 Escape 不吃掉按键，回车把原文 `@Ada Lov nobody` 发出去。

回车没有选中当前高亮行。`@a` 的画面顺序是 Grace Hopper（Reviewers 分组）、Ada Lovelace、María José García。高亮停在 Grace Hopper 时按回车，插入的却是 `@ada` / `@Ada Lovelace`。

原因：`groupSearchItems` 把有分组的行排到前面，高亮用的是这个视觉序号；`selectItem` 用的是过滤结果原顺序的 `items[highlightedIndex]`。原顺序第 0 项是 Ada，视觉第 0 项是 Grace。

证据：`/tmp/verify-C10/item4.json` 的 `open`、`afterUp`、`afterEnterSelect`。相关代码在 `packages/core/src/Chat/groupSearchItems.ts`、`ChatTriggerMenu.vue` 的 `flatIndex`、`useTriggerMenu.ts` 的 `selectItem`。

### 5. 搜索未完成时回车 — 过

文档站提及示例用的是同步 `createStaticSource`，浏览器里做不出「结果还没回来」。重跑的 Vue 测试覆盖了这件事：

- `does not pick a row while a newer search is still pending`：加载中回车不调用 `onSelect`，事件不拦截。
- `ignores a result that arrives after Escape`：迟到结果不再打开列表。
- `discards a result that arrives after the draft is cleared`：草稿清空后迟到结果丢掉。

输入框在菜单不拦截回车时会按原文提交，并 `menu.reset()`，请求序号作废，迟到结果进不了列表。两种 `NODE_ENV` 下这些测试都在通过的 75 条里。

### 6. 输入法拼字中的 Enter — 过

`@Ada` 列表开着时，向编辑器派发 `isComposing=true`、`keyCode=229` 的 Enter。列表仍开着，没有插入标记，也没有发送。

证据：`/tmp/verify-C10/item6.json`。

### 7. 服务端渲染失败名单 — 过

`packages/core/src/ssr-known-failures.json` 是空对象 `{}`，没有 Chat。

### 8. 超长查询、空工具调用、空元信息 — 过

- 64 字：`stops a multi-word query after 64 characters` 在 64 字时查询仍有效，第 65 字后 `isActive` 为 false。查询函数只决定要不要结束，不删已经打进去的字。浏览器里没有匹配的句子也留着。
- 空工具调用：`renders nothing for an empty list and one row for a single call` 断言空数组不渲染 `.astryx-chat-tool-calls`。
- 三个字段都空：`localizes a failed status and renders nothing without metadata` 断言不渲染 `.astryx-chat-metadata`，因此没有分隔点。

这些断言都在重跑通过的 `packages/core/src/Chat/Chat.test.ts` 和 `useTriggerMenu.test.ts` 里。

### 9. 图标 — 过

完成和失败用 `ChatIcon` 的 `circle-check`、`circle-x`。Chat 目录没有另一套 `addCollection` / `addIcon` 注册。

### 10. 没有 `!important` — 过

`node scripts/check-no-important.mjs` 退出码 0。日志 `/tmp/verify-C10/no-important.txt`。

### 11. 台账 — 过

`ledger/C10.md` 63 条都是 `- [x]`，47 条「已采纳」，16 条「不适用」，没有缺结论。统计在 `/tmp/verify-C10/ledger-summary.json`。

抽查已采纳：

- `55e2f3ec6` 多词查询：第 1 条浏览器结果对得上。
- `0ad35c3b6` 气泡宽度：`ChatMessageBubble.vue` 把 `width` 写到外框的 `width` 和 `maxWidth`。
- `8a9d85fdf` 禁用光标：`chat.css` 里是 `cursor: default`，没有 `not-allowed`。

16 条不适用都站得住：StyleX 嵌套、简写、构建开关和层叠契约（本仓库用 CSS）；被下一条盖掉的 `not-allowed`；React ref 合并；工具链回归修补；浮层重置归 B4；图表测试分拣；设计约定文档；三处 Storybook playground 默认值；spec 状态改名；Probe 扫描夹具；Divider 数字标签归 C14。

### 12. 触发器测试 — 过

`useTriggerMenu.test.ts` 有多词、64 字、Escape 后同一段查询不重开、删回去重开、加载中回车不选、Escape 或清空后的迟到结果。两种 `NODE_ENV` 都通过，用例数都是 75。

### 13. 中英文文档和示例 — 过

中英文 `apps/docs/docs/{zh,en}/components/chat/index.md` 都有提及示例说明。`composer-mentions.vue` 开了 `hasMultiWordQuery`，并有 `/` 命令。`apps/docs/components/demos/chat/meta.ts` 和 `chat-composer-input/meta.ts` 都在。

英文页 `http://127.0.0.1:5172/en/components/chat` 输入 `@Ada Lov` 缩到 Ada Lovelace，回车送出 `@ada`。证据：`/tmp/verify-C10/item13.json`。

### 14. 本节点不在 SSR 失败名单 — 过

同第 7 条。名单里没有 Chat 家族。

### 15. 四种文档站整页图 — 过

亲自看过。都是 VitePress 文档站整页，不是夹具，也不是 `pnpm visual` 的 overview 卡片。桌面能看到侧栏和顶栏，内容在「ChatComposerInput — 提及」，列表开着。390 宽时文档站把侧栏收成抽屉（`60rem` 以下），画面上是顶栏「菜单 / 返回顶部」和这个 Demo，列表不溢出。

上游没有 `/components/Chat`。左右对照的左边是上游 ChatComposerInput 页，滚到能看见「ChatComposerInput — Mentions」和左侧组件导航，不是顶部那张预览卡片。

| 图 | 标签 | 路径 |
| --- | --- | --- |
| 桌面浅色 | 文档站整页 | `/opt/cursor/artifacts/c10-verify/desktop-light.png` |
| 桌面深色 | 文档站整页 | `/opt/cursor/artifacts/c10-verify/desktop-dark.png` |
| 390 浅色 | 文档站整页 | `/opt/cursor/artifacts/c10-verify/mobile-light.png` |
| 390 深色 | 文档站整页 | `/opt/cursor/artifacts/c10-verify/mobile-dark.png` |
| 左右对照桌面浅色 | 文档站整页 | `/opt/cursor/artifacts/c10-verify/side-by-side-desktop-light.png` |
| 左右对照桌面深色 | 文档站整页 | `/opt/cursor/artifacts/c10-verify/side-by-side-desktop-dark.png` |
| 左右对照 390 浅色 | 文档站整页 | `/opt/cursor/artifacts/c10-verify/side-by-side-mobile-light.png` |
| 左右对照 390 深色 | 文档站整页 | `/opt/cursor/artifacts/c10-verify/side-by-side-mobile-dark.png` |

截图没有入库。

### 16. `types.ts` 行数 — 过

`types.ts` 61 行，`messageTypes.ts` 293 行，`composerTypes.ts` 285 行，`triggerQuery.ts` 89 行，`useTriggerMenu.ts` 362 行。`scripts/guardrails/line-limit-allowlist.json` 里已经没有 `Chat/types`。

### 17. 指定测试两遍 — 过

两遍都是 5 个文件、75 条，退出码 0。命令是 `pnpm vitest run --maxWorkers=2`，路径为 `packages/core/src/Chat`、`useChatNewMessages.test.ts`、`useChatStreamScroll.test.ts`。

### 18. 行数检查 — 过

`node scripts/check-line-limit.mjs` 退出码 0。它另外提示 PowerSearch、Table 的白名单可以收紧，那两个文件不在本分支的 diff 里，这次没有改白名单。

### 19. 改动范围和导出 — 过

`git diff 71671a92 --stat` 共 19 个文件：Chat 源码和测试、`chat.css`、行数白名单、中英文对话页和属性表、提及示例、`ledger/C10.md`，以及本节点的 `plan.md`、`verify.md`、`impl-1.md`。没有别的组件，没有 ROADMAP，没有 `src/index.ts`。`node scripts/sync-exports.mjs --check` 退出码 0，输出「生成结果和已提交文件一致」。

### 20. 注释里的修改历史 — 过

`git diff 71671a92 | grep -nE "^\+.*(原来|改成|之前|moved|extracted|split from)"` 的命中都在台账、计划和验收清单的句子里，或者是 `messageTypes.ts` 里 “removed” 带上了 “moved”。没有哪条是在代码注释里讲修改历史。

## 结论

不通过。需要先让回车选中画面上高亮的那一行（分组和未分组混在一起时也不许插错人），再重新验收。

# C10 Chat 对话 · 第 2 轮验收

结论：**通过**。第 1 轮不过的回车高亮，和这轮要看的空草稿发送按钮，都重新跑过。没有改业务代码，没有 rebase，没有合入，没有改 ROADMAP。

## 环境

- 分支 `sync/c10-chat`。验收的代码头是 `9e26bd88`。本文件是之后单独提交的验收记录。
- `git merge-base HEAD origin/swarm-tree` 是 `71671a92`。
- PR #147（`sync/c10-chat` → `swarm-tree`）在验收时：`mergeable=CONFLICTING`，`mergeStateStatus=DIRTY`。`git merge-tree` 仍只在 `scripts/guardrails/line-limit-allowlist.json` 冲突。按当前头验收，没有自行变基。
- 开始 `git status`：`On branch sync/c10-chat`，工作区干净。写入本文件之前再查一次，仍然干净。提交本文件之后工作区回到干净。
- 测试：`env -u NODE_ENV` 与 `NODE_ENV=production` 各一遍，都是 5 个文件、81 条，退出码 0。日志在 `/tmp/verify-C10-r2/test-unset.txt`、`/tmp/verify-C10-r2/test-prod.txt`。
- 文档站：`pnpm --filter @astryx-vue/core build` 之后，`vitepress dev --host 127.0.0.1 --port 5172`。页面是 `http://127.0.0.1:5172/components/chat`。浏览器经 `browser-lock.mjs run --purpose C10-verify`。用完已关掉，两个浏览器槽都空闲。
- 截图不入库，在 `/opt/cursor/artifacts/c10-verify-r2/`。下面每张文档站图都标「文档站整页」。

## 本轮重验

### 高亮和回车 / Tab — 过

中文文档站桌面浅色，滚到「ChatComposerInput — 提及」。分组把画面顺序和原始数组拆开。

`@a` 滤掉 Lin。原始顺序是 Ada、María、Grace。画面顺序是 Grace Hopper、Ada Lovelace、María José García。

- 默认高亮停在 Grace。`aria-activedescendant` 是 `…-option-0`，这一行 `aria-selected="true"`。回车插入 `@grace`，可见字是 `@Grace Hopper`。上一轮这里会插原始第 0 项 Ada，这次不是。
- 再按一次下方向键，高亮移到第二行 Ada。`aria-activedescendant` 改到 `…-option-1`，只有 Ada 是 `aria-selected="true"`。回车插入 `@ada`。若仍按原始数组的下标取人，下标 1 会是 María。
- 输入 `@`，画面顺序是 Lin、Grace、Ada、María。下方向键把高亮移到 Grace（不是原始第 0 项 Ada，也不是原始下标 1 的 María）。回车插入 `@grace`。
- 再开 `@`，下方向键两次，高亮停在 Ada（画面第 3 行，`…-option-2`）。Tab 插入 `@ada`。若按原始下标 2 取人，会是 Lin。

方向键只改高亮，回车和 Tab 才插入，插入的人和 `aria-activedescendant` 那一行一致。

证据：`/tmp/verify-C10-r2/light-behavior.json` 的 `atA`、`atADown`、`atADownEnter`、`atDown`、`atDownEnter`、`atTabBefore`、`atTabAfter`、`atADefaultEnter`。高亮停在 Ada 的画面是文档站整页 `desktop-light-mentions-highlight.png`。

### 空草稿发送按钮 — 过

外壳示例带 `notes.md`、`focus.png`，草稿是空的。发送按钮 `disabled`，`aria-label="发送"`。

浅色计算样式：`opacity: 1`，文字 `rgb(82, 82, 82)`，背景 `rgba(0, 0, 0, 0.06)`，`cursor: default`。这是中性浅底和次要文字色，不是 `opacity: 0.5` 的近黑实心。强制点击不提交。只打三个空格，按钮仍禁用。打上「你好」后取消 `disabled`，背景变成 `rgb(38, 38, 38)`、文字白色、`cursor: pointer`，点击后示例下方出现「你好」。只有附件、没有可发送文字时发不出去。

深色空草稿：`opacity: 1`，文字 `rgb(163, 163, 163)`，背景 `rgba(255, 255, 255, 0.1)`。有字之后是实心 `rgb(235, 235, 235)`、深色字。390 浅色和深色的计算样式与同色桌面一致。

对照上游 `https://astryx.atmeta.com/components/ChatComposer`（v0.7.1）空草稿：发送按钮同样 `disabled`，但计算样式仍是 `opacity: 0.5`、背景 `rgb(27, 27, 27)`、白字，也就是这轮明确不要的半透明黑。能不能发的手感一致（空的不能发，有字才是实心可点）。视觉按这轮要求做成浅底，不跟上游那颗半透明黑钮。

证据：`light-behavior.json` 的 `shellEmpty`、`shellWhitespace`、`shellFilled`、`shellSubmitted`；`visual.json` 四种组合的 `empty` / `filled`。

## 全表

### 1. 多词提及、藏起、斜杠空格、标记值 — 过

桌面浅色中文页，滚到「ChatComposerInput — 提及」。

- `@Ada Lov`：列表只剩 Ada Lovelace，`aria-expanded="true"`。
- 再打 ` nobody`：`aria-expanded="false"`，没有 `aria-activedescendant`，输入框仍是 `@Ada Lov nobody`。
- `/sum` 列表开着，再打空格，列表关掉，字还在。
- `@Ada` 回车后草稿是标记，`data-astryx-token-value="@ada"`。再回车，示例下方是 `@ada`。

### 2. 深色、390 浅色、390 深色 — 过

亲自看过下面的文档站整页。桌面有侧栏和顶栏。390 宽时侧栏收成「菜单」，顶栏还有「返回顶部」。

提及列表都在视口内。390 时盒子大约 x=65、宽 180、右缘 245，没有溢出 390。页面 `scrollWidth` 等于 `clientWidth`（1440 或 390）。

系统消息原句不长。在 390 浅色和深色里，把「ChatSystemMessage — 状态更新」第一条正文临时改成一句长通知后测量：`white-space: normal`，`overflow-wrap: anywhere`，内容宽 217 且 `scrollWidth` 等于 `clientWidth`，高度 54（已换行）。页面仍是 390 宽。这是页面上的临时测量，没有改仓库。

### 3. 读屏角色 — 过

有触发器的提及框是 `combobox`。列表开着时 `aria-expanded="true"`，并且 `aria-activedescendant` 指向当前高亮行。多词没有匹配、列表藏起时是 `false`，没有 `aria-activedescendant`。外壳里没有触发器的编辑器是 `role="textbox"`、`aria-multiline="true"`，没有 `aria-expanded`。

### 4. 键盘 — 过

上一轮不过的回车已按上面「高亮和回车 / Tab」重测。其余也在同一页重跑：

- 下方向键只改 `aria-selected`，不插入标记。
- `@Ada` 时 Escape 关掉列表。继续打成 `@Ada Lov`，列表不回来。再删到 `@Ad`，列表回来，只剩 Ada Lovelace。
- 没有匹配时，下方向键、上方向键、Escape 都不改草稿。回车把原文 `@Ada Lov nobody` 发出去。

列表开着时的上方向键，第 1 轮已经单独看过，只动高亮。本轮用下方向键把高亮移出第一行，再验证回车和 Tab。

### 5. 搜索未完成时回车 — 过

文档站提及示例是同步 `createStaticSource`，浏览器里做不出「结果还没回来」。重跑的 Vue 测试仍覆盖：`does not pick a row while a newer search is still pending`、`ignores a result that arrives after Escape`、`discards a result that arrives after the draft is cleared`。这些都在通过的 81 条里。第 1 轮对「菜单不拦截回车就按原文提交」的说明仍然成立。

### 6. 输入法拼字中的 Enter — 过

`@Ada` 列表开着时，向编辑器派发 `isComposing=true`、`keyCode=229` 的 Enter。事件没有被拦截，列表仍开着，没有插入标记，也没有新的发送。

### 7. 服务端渲染失败名单 — 过

`packages/core/src/ssr-known-failures.json` 仍是空对象 `{}`，没有 Chat。

### 8. 超长查询、空工具调用、空元信息 — 过

断言还在，并且落在这轮通过的测试里：

- `stops a multi-word query after 64 characters`
- `renders nothing for an empty list and one row for a single call`
- `localizes a failed status and renders nothing without metadata`

第 1 轮写的行为没有被这轮改动推翻。浏览器里没有匹配的句子也留着，见第 1 条。

### 9. 图标 — 过

完成和失败仍用 `ChatIcon` 的 `circle-check`、`circle-x`。Chat 目录没有 `addCollection` / `addIcon`。

### 10. 没有 `!important` — 过

`node scripts/check-no-important.mjs` 退出码 0。日志 `/tmp/verify-C10-r2/no-important.txt`。

### 11. 台账 — 过

`ledger/C10.md` 仍是 63 条 `- [x]`，47 条「已采纳」，16 条「不适用」，没有缺结论。

抽查已采纳：

- 多词查询：第 1 条浏览器结果对得上。
- `0ad35c3b6` 气泡宽度：`ChatMessageBubble.vue` 把 `width` 写到外框的 `width` 和 `maxWidth`。
- 禁用光标：`chat.css` 里是 `cursor: default`，没有 `not-allowed`。

16 条不适用的理由和第 1 轮相同，仍然站得住：StyleX 嵌套、简写、构建开关和层叠契约（本仓库用 CSS）；被下一条盖掉的 `not-allowed`；React ref 合并；工具链回归修补；浮层重置归 B4；图表测试分拣；设计约定文档；三处 Storybook playground 默认值；spec 状态改名；Probe 扫描夹具；Divider 数字标签归 C14。

### 12. 触发器测试 — 过

`useTriggerMenu.test.ts` 仍有多词、64 字、Escape 后同一段查询不重开、加载中回车不选、迟到结果。这轮还覆盖分组后的高亮行。两种 `NODE_ENV` 都通过，用例数都是 81。

### 13. 中英文文档和示例 — 过

中英文 `apps/docs/docs/{zh,en}/components/chat/index.md` 都有提及说明。`composer-mentions.vue` 开了 `hasMultiWordQuery`，并有 `/` 命令。`apps/docs/components/demos/chat/meta.ts` 和 `chat-composer-input/meta.ts` 都在。

英文页 `http://127.0.0.1:5172/en/components/chat` 输入 `@Ada Lov` 缩到 Ada Lovelace，回车送出 `@ada`。证据：`/tmp/verify-C10-r2/followup.json` 的 `english`。

### 14. 本节点不在 SSR 失败名单 — 过

同第 7 条。

### 15. 四种文档站整页图 — 过

亲自看过。都是 VitePress 文档站整页，能看到壳子（桌面是侧栏和顶栏，390 是「菜单 / 返回顶部」），不是夹具，也不是 overview 卡片。空草稿的浅色禁用钮和有字后的实心钮都能看清。提及列表在浅色、深色和 390 里都开着。

| 图 | 标签 | 路径 |
| --- | --- | --- |
| 桌面浅色，空草稿禁用钮 | 文档站整页 | `/opt/cursor/artifacts/c10-verify-r2/desktop-light-shell-empty.png` |
| 桌面浅色，有字实心钮 | 文档站整页 | `/opt/cursor/artifacts/c10-verify-r2/desktop-light-shell-filled.png` |
| 桌面浅色，提及空草稿 | 文档站整页 | `/opt/cursor/artifacts/c10-verify-r2/desktop-light-mentions-empty.png` |
| 桌面浅色，提及有字 | 文档站整页 | `/opt/cursor/artifacts/c10-verify-r2/desktop-light-mentions-filled.png` |
| 桌面浅色，高亮停在 Ada | 文档站整页 | `/opt/cursor/artifacts/c10-verify-r2/desktop-light-mentions-highlight.png` |
| 桌面深色，空草稿 | 文档站整页 | `/opt/cursor/artifacts/c10-verify-r2/desktop-dark-shell-empty.png` |
| 桌面深色，有字 | 文档站整页 | `/opt/cursor/artifacts/c10-verify-r2/desktop-dark-shell-filled.png` |
| 桌面深色，提及列表 | 文档站整页 | `/opt/cursor/artifacts/c10-verify-r2/desktop-dark-mentions.png` |
| 390 浅色，空草稿 | 文档站整页 | `/opt/cursor/artifacts/c10-verify-r2/mobile-light-shell-empty.png` |
| 390 浅色，有字 | 文档站整页 | `/opt/cursor/artifacts/c10-verify-r2/mobile-light-shell-filled.png` |
| 390 浅色，提及列表 | 文档站整页 | `/opt/cursor/artifacts/c10-verify-r2/mobile-light-mentions.png` |
| 390 深色，空草稿 | 文档站整页 | `/opt/cursor/artifacts/c10-verify-r2/mobile-dark-shell-empty.png` |
| 390 深色，有字 | 文档站整页 | `/opt/cursor/artifacts/c10-verify-r2/mobile-dark-shell-filled.png` |
| 390 深色，提及列表 | 文档站整页 | `/opt/cursor/artifacts/c10-verify-r2/mobile-dark-mentions.png` |

截图没有入库。上游空草稿对照图在 `/opt/cursor/artifacts/c10-verify-r2/upstream-composer-light.png`，那是上游站，不是本项要求的文档站图。

### 16. `types.ts` 行数 — 过

`types.ts` 61 行，`messageTypes.ts` 293 行，`composerTypes.ts` 285 行，`triggerQuery.ts` 89 行，`useTriggerMenu.ts` 367 行，`groupSearchItems.ts` 46 行。`scripts/guardrails/line-limit-allowlist.json` 里没有 `Chat/types`。

### 17. 指定测试两遍 — 过

两遍都是 5 个文件、81 条，退出码 0。命令是 `pnpm vitest run --maxWorkers=2`，路径为 `packages/core/src/Chat`、`useChatNewMessages.test.ts`、`useChatStreamScroll.test.ts`。一遍前面是 `env -u NODE_ENV`，一遍是 `NODE_ENV=production`。

### 18. 行数检查 — 过

`node scripts/check-line-limit.mjs` 退出码 0。它另外提示 PowerSearch、Table 的白名单可以收紧。这两个文件不在本分支相对 `71671a92` 的 diff 里，这次没有改白名单。日志 `/tmp/verify-C10-r2/line-limit.txt`。

### 19. 改动范围和导出 — 过

`git diff 71671a92 --stat` 在写入本文件之前是 22 个文件：Chat 源码和测试、`chat.css`、行数白名单、中英文对话页和属性表、提及示例、`ledger/C10.md`，以及本节点的 `plan.md`、`verify.md`、`verify-1.md`、`impl-1.md`、`impl-2.md`。没有别的组件，没有 ROADMAP，没有 `src/index.ts`。本文件是验收记录，同样落在这个节点目录里。`node scripts/sync-exports.mjs --check` 退出码 0，输出「生成结果和已提交文件一致」。

### 20. 注释里的修改历史 — 过

`git diff 71671a92 | grep -nE "^\+.*(原来|改成|之前|moved|extracted|split from)"` 的命中在台账、计划和验收文档的句子里，或者是 `messageTypes.ts` 里 “removed” 带上了 “moved”。没有哪条是在代码注释里讲修改历史。

## 结论

通过。回车和 Tab 插入当前高亮项，和 `aria-activedescendant` 一致。空草稿和仅空白时发送按钮禁用，浅底、次要文字色，不是半透明黑；有可发送文字后是实心强调色，可以点。只有附件不能发。

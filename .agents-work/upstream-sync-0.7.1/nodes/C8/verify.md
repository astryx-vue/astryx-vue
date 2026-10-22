# C8 BottomSheet · 验收计划

你是验收者，只检查，不改代码。实现者写的 `impl-1.md` 只用来了解他做了什么，不能当成证据，每一条都要你亲自重新验证。

**判断标准是效果，不是代码长得像不像上游。** 只要用户看到的样子、操作的手感、读屏读出的内容、公开 API 能做到的事和上游一致，代码结构不同不算问题。

## 环境

- 工作区：`/workspace`，分支 `sync/c8-bottom-sheet`。
  - `BASE` 指 `git merge-base HEAD swarm-tree`。
- 只读铁律：开始和结束时各跑一次 `git status`，两次结果必须相同。
  - 需要临时改文件做反向检查时，改完马上用 `git checkout -- <文件>` 还原，并在报告里写明「已还原」。
  - 临时文件都放在 `/tmp/verify-C8/`。
- 测试环境：
  - 所有测试和构建命令前面加 `env -u NODE_ENV`。
  - 测试相关的检查项跑两遍：一遍 `env -u NODE_ENV`，一遍 `NODE_ENV=production`。两遍都要通过，用例数要相同。
  - vitest 一律加 `--maxWorkers=2`。
- 浏览器：
  - 整台机器同时最多 2 个浏览器会话。
  - 只能这样开：`node scripts/swarm/browser-lock.mjs run --purpose C8-verify -- <命令>`。拿不到锁就排队，不许私开。
  - 文档站用空闲端口，同一时刻只开一个，用完关掉。
  - 看截图用读图工具直接读 PNG 文件。
  - 主证据是文档站整页 `http://127.0.0.1:<端口>/components/bottom-sheet`。桌面要看见侧栏，390 宽要看见顶栏上的「菜单」，并滚到有实质 Demo 的段落。没有对位 Demo 就写「无对位」，发单侧整页。截图不入库。

## 检查项

每一项只能判「过」或「不过」，并附上证据：命令和输出、截图路径和你看到的内容。

### 一、效果和上游一致

1. 文档站中文 `/components/bottom-sheet` 四种组合（桌面/390px × 浅色/深色）都是整页，并且打开了一个有内容的面板。面板从底部升起，顶部有拖拽条，内容不贴死面板边缘。无对位，不和上游拼图。
2. 不传 `padding` 时，内容区的样式把四边内边距指到已发布的 `--container-padding-*`，这条变量的回退链包含 `--astryx-bottom-sheet-padding` 和 `--astryx-spacing-4`。传入 `0` 或 `2` 时，四边都改成对应的 `--astryx-spacing-*`，不再走主题链。面板根上的 `--container-padding-inline-start` 是 `0px`（`astryx-layer` 归零）。切换器里的面板同样把 `padding` 交到内容区。
3. 打开面板后再登记一层更晚的关闭层，在面板上按 Escape，先关掉那一层，面板的 `openChange` 不发出。再按一次 Escape，面板才请求关闭。`required` 两次都不关。输入法拼字中的 Escape 不关。非模态面板在焦点不在对话框里时，页面上的 Escape 不关它。
4. 先指针按下再关闭，还给触发器的 `focus` 带 `focusVisible: false`。键盘关闭不带这个限制。
5. 读屏：打开后是带名字的 `dialog`；`required` 是 `alertdialog`。拖拽条 `aria-hidden`。内容溢出时滚动区是带名字的 `group`。

### 二、反向挑刺

6. 只用键盘：Escape、以及溢出时的 Tab 停靠点仍在。Tab 委托接的是已有的 `attachScrollKeyboardDelegation`，不另写一套。
7. 服务端渲染：`BottomSheet` 不在 `ssr-known-failures.json`。`env -u NODE_ENV pnpm docs:build` 通过。
8. 不传内容以外的超长文字：面板内部滚动，页面不被撑长（现有高度档测试仍过）。`padding` 不传、传 `0`、传 `1.5` 三种样式都不破。
9. 第二指落下时取消已经开始的拖动，不把缩放吃掉。手指下还有没滚到头的盒子时，不把这次下拉交给面板。
10. 图标：本节点不新增图标，不引入另一套注册表。
11. 没有 `!important`：`node scripts/check-no-important.mjs` 通过。`bottom-sheet.css` 里没有 `not-allowed`。拖拽条是 `grab`。

### 三、C 节点通用检查

12. 台账 `ledger/C8.md` 每一条都是 `- [x]`，下面都有 `- 结论：已采纳` 或 `- 结论：不适用：<理由>`。抽查至少 3 条「已采纳」，确认确实做了；抽查全部「不适用」的理由，确认站得住。
13. 上游新增或改动的测试里，本轮改到的行为（默认边距、边距发布、Escape 只关最上层、指针关闭不画环）都有对应的 Vue 测试，两种 `NODE_ENV` 下都通过。Playwright 夹具不要求逐条搬。
14. 中英文文档里内边距的说明和现在的行为一致：不传时是主题边距，没有主题时是间距 4；单独的 Section 会顶掉；表格和分隔线按这份边距伸展。打开中文页面，示例能操作。
15. `BottomSheet` 不在 SSR 已知失败名单里。
16. 附带了四种组合的文档站整页图，并且你亲眼看过。报告里每张图标明是「文档站整页」。无对位。
17. `packages/core/src/BottomSheet/useSheetGestures.ts` 不超过 500 行，而且不在 `scripts/guardrails/line-limit-allowlist.json` 里。拆出去的文件要有自己的职责，不是只删空行。

### 四、整体

18. `env -u NODE_ENV pnpm exec vitest run --maxWorkers=2 packages/core/src/BottomSheet packages/core/src/Theme/registry.test.ts packages/core/src/layer/layerCss.test.ts` 通过；`NODE_ENV=production` 同一命令通过；用例数相同。
19. `env -u NODE_ENV pnpm --filter @astryx-vue/core typecheck`、改过源码的 eslint `--max-warnings 0`、`node scripts/check-line-limit.mjs`、`node scripts/check-no-important.mjs`、`node scripts/sync-exports.mjs --check` 通过。
20. 改动范围：`git diff $BASE --stat` 里没有计划范围以外的文件。`ROADMAP.md`、`SWARM.md`、`HANDOFF.md` 没有改动。
21. 注释里没有修改历史：`git diff $BASE | grep -nE "^\+.*(原来|改成|之前|moved|extracted|split from)"` 没有命中，或者命中的都不是在讲修改历史。

## 结论

- 只要有一条不过，结论就是「不通过」。
- 报告写到 `.agents-work/upstream-sync-0.7.1/nodes/C8/verify-<N>.md`。
- 最终回复用中文，200 字以内。

## 验证操作要短小

每次验证只测一件事，每条命令都要有时间上限：浏览器命令用 `browser-lock.mjs run --max-run <秒>`，默认 180 秒；其他命令用 `timeout <秒>`。超时了不要原样重跑，先把卡住的那一步单独拆出来。脚本和结果都放在 `/tmp/verify-C8/`。

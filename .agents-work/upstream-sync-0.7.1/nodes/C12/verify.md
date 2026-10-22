# C12 列表与树 · 验收计划

你是验收者，只检查，不改代码。实现者写的 `impl-1.md` 只用来了解他做了什么，不能当成证据，每一条都要你亲自重新验证。

**判断标准是效果，不是代码长得像不像上游。** 只要用户看到的样子、操作的手感、读屏读出的内容、公开 API 能做到的事和上游一致，代码结构不同不算问题。

## 环境

- 工作区：`/workspace`，分支 `cursor/c12-list-tree-dffe`。
  - `BASE` 指 `git merge-base HEAD swarm-tree`。
- 只读铁律：开始和结束时各跑一次 `git status`，两次结果必须相同。
  - 需要临时改文件做反向检查时，改完马上用 `git checkout -- <文件>` 还原，并在报告里写明「已还原」。
  - 临时文件都放在 `/tmp/verify-C12/`。
- 测试环境：
  - 所有测试和构建命令前面加 `env -u NODE_ENV`。
  - 测试相关的检查项跑两遍：一遍 `env -u NODE_ENV`，一遍 `NODE_ENV=production`。两遍都要通过，用例数要相同。
  - vitest 一律加 `--maxWorkers=2`。
- 浏览器：
  - 整台机器同时最多 2 个浏览器会话。
  - 只能这样开：`node scripts/swarm/browser-lock.mjs run --purpose C12-verify -- <命令>`。拿不到锁就排队，不许私开。
  - 文档站用空闲端口，同一时刻只开一个，用完关掉。
  - 看截图用读图工具直接读 PNG 文件。
  - 主证据是文档站整页。中文打开 `http://127.0.0.1:<端口>/components/list`，以及树、大纲、溢出列表、元数据列表各自的页面。桌面要看见侧栏，390 宽要看见顶栏上的「菜单」，并滚到有实质 Demo 的段落。没有对位 Demo 就写「无对位」，发单侧整页。截图不入库。

## 检查项

每一项只能判「过」或「不过」，并附上证据：命令和输出、截图路径和你看到的内容。

### 一、效果和上游一致

1. 文档站中文五个页面（`/components/list`、`/components/tree-list`、`/components/outline`、`/components/overflow-list`、`/components/metadata-list`）四种组合（桌面/390px × 浅色/深色）都是整页，并滚到有实质 Demo 的段落。无对位，不和上游拼图。
2. 触屏把带 `swipeActions` 的行向一侧拖过半宽，行停开，操作按钮可以点到并执行。鼠标拖不动。`commit` 拖过整行时执行最外侧那一个，并且 `commit` 一侧只渲染一个操作。停开后在行外按下指针，行收回。`javascript:` 地址的行不渲染链接。
3. 树的一行带 `aria-labelledby`，指向的元素文本就是标题，不是展开按钮的名字。有说明时带 `aria-describedby`。单项的 `className` 和 `style` 在 `role="treeitem"` 的那一行上。根上的 `id` 在外层，`aria-label` 在 `role="tree"` 上；有 `header` 时树的名字来自标题，不用外面传来的 `aria-label`。根上的按键处理函数先执行，它 `preventDefault` 之后方向键不移动焦点。
4. `parseOutlineFromMarkdown('# Getting Started')` 得到 `{ id: 'getting-started', label: 'Getting Started', level: 1 }`。两段同名标题的 id 是 `setup` 和 `setup-1`。围栏代码里的 `# not a heading` 不进目录。引用里的标题不进目录，但后面同名根标题的 id 带上数字后缀。`useOutlineFromDOM` 读到容器里带 id 的 h1–h6。
5. `OverflowList` 在 `visibleCount` 等于项数时不发出 `overflowChange`。收起之后发出被收起的项和原来的下标。同一组不重复发。重新全部可见时再发一次空数组。禁用的溢出项样式是 `cursor: default`，不是 `not-allowed`。
6. 元数据条目并排时，透传的 `id` 在 `dt` 上；上下叠放时在包住标签和值的那一层上。列表根上的透传仍在根上，`data-columns` 仍由组件自己决定。侧标和值的样式包含 `word-break: break-word`。

### 二、反向挑刺

7. 只用键盘：树的 ArrowLeft 仍能收起已展开的父节点。大纲链接仍是单个 Tab 停靠点那一套（`useListFocus`），Space 仍会导航。滑动行在停开时，Escape 打到行上会收回。
8. 读屏：树行的名字来自标题元素。列表行有描述时，描述元素有 id，并且 `useItemDescriptionId` 能读到它。
9. 服务端渲染：这五个组件不在 `ssr-known-failures.json`。`env -u NODE_ENV pnpm docs:build` 通过。
10. 空数据：空的 `OverflowList` 不报溢出。没有标题的 Markdown 解析结果是空数组。超长侧标靠 `word-break` 断开，不把网格撑破（`minmax(0, 1fr)` 仍在）。
11. 图标：本节点不新增语义图标，不引入另一套注册表。滑动操作的图标仍由调用方传入。
12. 没有 `!important`：`node scripts/check-no-important.mjs` 通过。`overflow-list.css` 里没有 `not-allowed`。

### 三、C 节点通用检查

13. 台账 `ledger/C12.md` 每一条都是 `- [x]`，下面都有 `- 结论：已采纳` 或 `- 结论：不适用：<理由>`。抽查至少 3 条「已采纳」，确认确实做了；抽查全部「不适用」的理由，确认站得住。
14. 上游新增或改动的测试里，本轮改到的行为（滑动停开与点外部收回、树行名字、键盘取消、大纲解析、溢出报告、元数据条目透传、危险链接）都有对应的 Vue 测试，两种 `NODE_ENV` 下都通过。Playwright 夹具不要求逐条搬。
15. 中英文文档里，树的行样式和行名、溢出列表的 `overflowChange`、大纲从 Markdown 或 DOM 取目录，和现在的行为一致。打开中文页面，示例能操作。
16. `List`、`TreeList`、`Outline`、`OverflowList`、`MetadataList` 都不在 SSR 已知失败名单里。
17. 附带了五种页面、四种组合的文档站整页图，并且你亲眼看过。报告里每张图标明是「文档站整页」。无对位。
18. 新写和改到的源码不超过 500 行：`node scripts/check-line-limit.mjs` 通过。没有为了过关去改 `line-limit-allowlist.json`。

### 四、整体

19. `env -u NODE_ENV pnpm exec vitest run --maxWorkers=2 packages/core/src/List packages/core/src/TreeList packages/core/src/Outline packages/core/src/OverflowList packages/core/src/MetadataList` 通过；`NODE_ENV=production` 同一命令通过；用例数相同。
20. `env -u NODE_ENV pnpm --filter @astryx-vue/core typecheck`、改过源码的 eslint `--max-warnings 0`、`node scripts/check-line-limit.mjs`、`node scripts/check-no-important.mjs`、`node scripts/sync-exports.mjs --check` 通过。
21. 改动范围：`git diff $BASE --stat` 里没有计划范围以外的文件。`ROADMAP.md`、`SWARM.md`、`HANDOFF.md` 没有改动。`packages/cli/src/generated/catalog.json` 和行数白名单没有改动。
22. 注释里没有修改历史：`git diff $BASE | grep -nE "^\+.*(原来|改成|之前|moved|extracted|split from)"` 没有命中，或者命中的都不是在讲修改历史。

## 结论

- 只要有一条不过，结论就是「不通过」。
- 报告写到 `.agents-work/upstream-sync-0.7.1/nodes/C12/verify-<N>.md`。
- 最终回复用中文，200 字以内。

## 验证操作要短小

每次验证只测一件事，每条命令都要有时间上限：浏览器命令用 `browser-lock.mjs run --max-run <秒>`，默认 180 秒；其他命令用 `timeout <秒>`。超时了不要原样重跑，先把卡住的那一步单独拆出来。脚本和结果都放在 `/tmp/verify-C12/`。

# C3 选择器家族 · 验收计划

你是验收者，只检查，不改代码。实现者写的 `impl-<N>.md` 只用来了解他做了什么，不能当成证据，每一条都要你亲自重新验证。

**判断标准是效果，不是代码长得像不像上游。** 只要用户看到的样子、操作的手感、读屏读出的内容、公开 API 能做到的事和上游一致，代码结构不同不算问题。

## 环境

- 工作区：当前仓库里的分支 `sync/c3-selectors`。云端没有本机 worktree 路径。
  - `BASE` 指 `git merge-base HEAD swarm-tree`。
- 只读铁律：开始和结束时各跑一次 `git status`，两次结果必须相同。
  - 需要临时改文件做反向检查时，改完马上用 `git checkout -- <文件>` 还原，并在报告里写明「已还原」。
  - 临时文件都放在 `/tmp/verify-C3/`。
- 测试环境：
  - 所有测试和构建命令前面加 `env -u NODE_ENV`。
  - 测试相关的检查项**跑两遍**：一遍 `env -u NODE_ENV`，一遍 `NODE_ENV=production`。两遍都要通过，用例数要相同。
  - vitest 一律加 `--maxWorkers=2`。
- 浏览器：
  - 整台机器同时最多 2 个浏览器会话。
  - 只能这样开：`pnpm visual <组件> --out /tmp/verify-C3/visual`，或者 `node scripts/swarm/browser-lock.mjs run --purpose C3-verify -- <命令>`。拿不到锁就排队，不许私开。
  - 文档站用空闲端口，同一时刻只开一个，用完关掉。不占用本机 worktree 槽位。
  - 看截图用读图工具直接读 PNG 文件。
  - **涉及界面时，给总控、再转给用户的主证据图必须来自文档站组件页整页。** 中文打开 `http://127.0.0.1:<端口>/components/<slug>`（源文件在 `apps/docs/docs/zh/components/<slug>/`，地址里没有 `/zh/`）。图里要能看到文档壳（侧栏，或顶栏和标题区），并滚到有实质 Demo 的段落。`pnpm visual` 和夹具只用于内部对像素，报告里要标明。截图放 evidence 或 `/tmp`。evidence 目录已被 gitignore，不要 `git add -f`。

## 检查项

每一项只能判「过」或「不过」，并附上证据：命令和输出、截图路径和你看到的内容。

### 一、效果和上游一致

1. 文档站中文页 `/components/selector`、`/components/multi-selector`、`/components/complex-selector` 整页，桌面浅色至少各一张，图里能看到文档壳和可操作的 Demo。`secondary` 触发器静止时无边框、浅底，和旁边的次要按钮是同一类样子；`ghost` 仍然透明。内部像素对照用 `pnpm visual`，不能拿 overview 冒充这一条。
2. 打开一个带 `action` 的选择器：鼠标点「编辑」不会改变当前选中值；键盘把高亮移到操作上再按 Enter，会执行操作，选择不变。没有 `action` 的选择器仍是 `role="listbox"`。
3. 演练场 `?template=settings` 顶部 Typeahead 不显示「Search」文字，Settings 标题保持一行。其余写了 `is-label-hidden` 的演练场模板，对应标签也不占布局。
4. 读屏：列表模式选项是 `option`；出现 `action` 后弹出层是 `grid`，行是 `row`，操作在第二个 `gridcell` 里。`aria-haspopup` 在网格时是 `grid`，底部弹层仍是 `dialog`。

### 二、反向挑刺

5. 只用键盘能完成：打开、上下移动、选中、走到选项操作并执行、Escape 关闭。搜索框里按空格仍然是在输入，不会误触操作。
6. 无障碍：禁用的 ComplexSelector 指针是 `default`。操作按钮有自己的名字，不包在 `role="option"` 里面。
7. 服务端渲染：Selector、MultiSelector、ComplexSelector、Typeahead、Tokenizer 不在 `ssr-known-failures.json` 里，SSR 冒烟能渲染。
8. 超长选项文字不把触发器撑破；空列表仍显示空状态，不报错。
9. 图标：选择器里的图标仍是语义名（`chevronDown`、`close`、`search`），没有引入另一套注册表。
10. 没有 `!important`：`node scripts/check-no-important.mjs` 通过。

### 三、C 节点通用检查

11. 台账 `ledger/C3.md` 每一条都是 `- [x]`，下面都有 `- 结论：已采纳` 或 `- 结论：不适用：<理由>`。抽查至少 3 条「已采纳」，确认确实做了；抽查全部「不适用」的理由，确认站得住。
12. 样式分层和选项操作有对应的 Vue 测试，两种 `NODE_ENV` 下都通过，用例数相同。
13. 中英文文档、交互示例都更新了：打开中英文选择器页面，示例能操作。
14. 本节点涉及的组件都不在 SSR 已知失败名单 `ssr-known-failures.json` 里。
15. 附带了文档站整页对照图，并且你亲眼看过。报告里每张图标明是「文档站整页」还是「内部 visual」。
16. `Selector.vue` 和 `MultiSelector.vue` 不超过 500 行，并且不在 `scripts/guardrails/line-limit-allowlist.json` 里。

### 四、整体

17. `env -u NODE_ENV pnpm vitest run --maxWorkers=2` 覆盖本节点测试并通过；`NODE_ENV=production` 再跑一遍，用例数相同。全量 vitest 如果环境跑不完，写明跑了哪些路径、哪些没跑。
18. `env -u NODE_ENV pnpm typecheck` 通过。改过的源码 eslint 通过。
19. 新写和改到的源码文件不超过 500 行：`node scripts/check-line-limit.mjs` 通过。
20. 改动范围：`git diff $BASE --stat` 里没有计划范围以外的文件。本轮不改公开导出时，`node scripts/sync-exports.mjs --check` 仍通过。
21. 注释里没有修改历史：`git diff $BASE | grep -nE "^\+.*(原来|改成|之前|moved|extracted|split from)"` 没有命中，或者命中的都不是在讲修改历史。

## 结论

- 只要有一条不过，结论就是「不通过」。
- 报告写到 `.agents-work/upstream-sync-0.7.1/nodes/C3/verify-<N>.md`，格式见 `templates/verify-report.md`。
- 最终回复用中文，200 字以内。

## 验证操作要短小

每次验证只测一件事，每条命令都要有时间上限：浏览器命令用 `browser-lock.mjs run --max-run <秒>`，默认 180 秒；其他命令用 `timeout <秒>`。超时了不要原样重跑，先把卡住的那一步单独拆出来。脚本和结果都放在 `/tmp/verify-C3/`，保证可以重跑。

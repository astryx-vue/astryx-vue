# <节点ID> <节点名称> · 验收计划

<!--
模板用法：
1. 复制到 nodes/<节点ID>/verify.md，把所有 <尖括号> 换成真实内容。
2. 这份计划从产品终态出发独立编写，不照抄实现者的回报。派出实现者以后，本轮不再修改。
3. 每条检查项都要能判「过」或「不过」，写成「做什么操作、应该看到什么」。
4. 不是 C 节点的，删掉「C 节点通用检查」一节。写完删掉这段注释。
-->

你是验收者，只检查，不改代码。实现者写的 `impl-<N>.md` 只用来了解他做了什么，不能当成证据，每一条都要你亲自重新验证。

**判断标准是效果，不是代码长得像不像上游。** 只要用户看到的样子、操作的手感、读屏读出的内容、公开 API 能做到的事和上游一致，代码结构不同不算问题。

## 环境

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/<节点ID>`，分支 `sync/<小写节点ID>-<简短名>`。
  - `BASE` 指 `git merge-base HEAD swarm-tree`。
- 只读铁律：开始和结束时各跑一次 `git status`，两次结果必须相同。
  - 需要临时改文件做反向检查时，改完马上用 `git checkout -- <文件>` 还原，并在报告里写明「已还原」。
  - 临时文件都放在 `/tmp/verify-<节点ID>/`。
- 测试环境：
  - 所有测试和构建命令前面加 `env -u NODE_ENV`。
  - 测试相关的检查项**跑两遍**：一遍 `env -u NODE_ENV`，一遍 `NODE_ENV=production`。两遍都要通过，用例数要相同。
  - vitest 一律加 `--maxWorkers=2`。
- 浏览器：
  - 整台机器同时最多 2 个浏览器会话。
  - 只能这样开：`pnpm visual <组件> --out /tmp/verify-<节点ID>/visual`，或者 `node scripts/swarm/browser-lock.mjs run --purpose <节点ID>-verify -- <命令>`。拿不到锁就排队，不许私开。
  - 文档站用 **<5170 + 槽位号>** 端口（`node scripts/swarm/worktree.mjs ls` 能看到本工作区的槽位），同一时刻只开一个，用完关掉。
  - 看截图用读图工具直接读 PNG 文件。
  - **涉及界面时，给总控、再转给用户的主证据图必须来自文档站组件页整页。** 中文打开 `http://127.0.0.1:<端口>/components/<slug>`（源文件在 `apps/docs/docs/zh/components/<slug>/`，地址里没有 `/zh/`），需要英文时再打开 `/en/components/<slug>`。桌面图里要看见侧栏，390 宽时要看见顶栏上的「菜单」，并滚到有实质 Demo 的段落，不能只剩标题。节点夹具页、Vite preview 单页、`pnpm visual` 的 overview 和卡片拼图、只有一两行示例的首屏，都不能冒充这组图。`pnpm visual` 和夹具只用于内部对像素，报告里要标明。截图放 evidence 或 `/tmp`。evidence 目录已被 gitignore，不要 `git add -f`。左右对照时，两边必须是同一组件、同一 Demo 区块标题、同一滚动位置、同一交互状态（开/关一致）。原版只截 Overview 里的 Demo，禁止截 Guidance / Practices。没有对位就写「无对位」并发单侧整页，禁止把无关区块拼成对照图。详见 SWARM.md「发给用户的验收对照图」。

## 检查项

每一项只能判「过」或「不过」，并附上证据：命令和输出、截图路径和你看到的内容。

### 一、效果和上游一致

<涉及界面的节点必写。每条：打开哪个页面、做什么操作、应该看到什么。>

1. 涉及界面时，主证据是文档站组件页整页的四种组合（桌面/390px 窄屏 × 浅色/深色），逐张用读图工具看：<应该看到什么一致>。中文页 `http://127.0.0.1:<端口>/components/<slug>`，需要时再看 `/en/components/<slug>`。每张图都能看到文档壳，并滚到有实质 Demo 的段落。`pnpm visual <组件> --out /tmp/verify-<节点ID>/visual` 只作内部像素核对；overview、夹具页、Vite preview 单页不能冒充这一条。
2. <交互：键盘、鼠标、触屏、焦点怎么移动、动画节奏。>
3. <读屏：role、名称、状态。>

### 二、反向挑刺

4. 键盘操作：<只用键盘能不能完成全部操作。>
5. 无障碍读屏：<读出来的内容对不对。>
6. 服务端渲染：<SSR 冒烟测试里本节点的组件都能渲染，不在已知失败名单里。>
7. 超长文字、空数据：<界面不破。>
8. <本节点特有的边界情况。>
9. 图标：涉及图标的改动都建在我们自己的方案上（语义名、`defineTheme({ icons })`），没有引入别的注册机制。规则见 `SWARM.md`「图标用我们自己的方案」。本节点不涉及图标的，写「不适用」。
10. 没有 `!important`：`node scripts/check-no-important.mjs` 通过。

### 三、C 节点通用检查

<C 阶段节点保留这一节；其它节点删掉。对应 ROADMAP「C 阶段每个节点都适用的 6 条通用验收清单」。>

9. 台账 `ledger/<节点ID>.md` 每一条都是 `- [x]`，下面都有 `- 结论：已采纳` 或 `- 结论：不适用：<理由>`。抽查至少 3 条「已采纳」，确认确实做了；抽查全部「不适用」的理由，确认站得住。
10. 上游新增或改动的测试用例，都有对应的 Vue 测试，两种 NODE_ENV 下都通过。
11. 中英文文档、交互示例、`meta.ts` 都更新了：打开中英文两个页面，示例能操作。
12. 本节点涉及的组件都不在 SSR 已知失败名单 `ssr-known-failures.json` 里。
13. 附带了四种组合的文档站整页图，并且你亲眼看过。报告里每张图标明是「文档站整页」还是「内部 visual/夹具」；给用户的必须写文档站 URL。夹具或 overview 不算这一条。若做左右对照，左右必须是同一组件、同一 Demo 区块标题、同一滚动位置、同一交互状态（开/关一致）；原版只截 Overview 里的 Demo，禁止截 Guidance / Practices。本地必须是能看到侧栏的 VitePress 文档站整页（390 宽时侧栏收起，改为能看到顶栏上的「菜单」）。没有对位 Demo 就不要硬拼，报告写「无对位」，改发单侧整页。无关区块拼成的图，这一条判不过。
14. 改到的超过 500 行的源码文件都拆开了，并从 `scripts/guardrails/line-limit-allowlist.json` 里移出。

### 四、整体

15. `env -u NODE_ENV pnpm vitest run --maxWorkers=2` 全量通过；`NODE_ENV=production pnpm vitest run --maxWorkers=2` 全量通过；用例数相同。
16. 完整的 `env -u NODE_ENV pnpm check` 通过，其中 test 那一步换成 `pnpm vitest run --maxWorkers=2`。
17. 新写和改到的源码文件不超过 500 行：`node scripts/check-line-limit.mjs` 通过。
18. 改动范围：`git diff $BASE --stat` 里没有计划范围以外的文件。生成文件的变化和 `pnpm sync` 的结果一致（`node scripts/sync-exports.mjs --check` 通过）。
19. 注释里没有修改历史：`git diff $BASE | grep -nE "^\+.*(原来|改成|之前|moved|extracted|split from)"` 没有命中，或者命中的都不是在讲修改历史。

## 结论

- 只要有一条不过，结论就是「不通过」。
- 报告写到 `/Users/shenqingchuan/workspace/astryx-vue/.agents-work/upstream-sync-0.7.1/nodes/<节点ID>/verify-<N>.md`，格式见 `templates/verify-report.md`。
- 最终回复用中文，200 字以内。

## 验证操作要短小

每次验证只测一件事，每条命令都要有时间上限：浏览器命令用 `browser-lock.mjs run --max-run <秒>`，默认 180 秒；其他命令用 `timeout <秒>`。超时了不要原样重跑，先把卡住的那一步单独拆出来。脚本和结果都放在 `/tmp/verify-<ID>/`（实现者放在 `/tmp/<ID>-*`），保证可以重跑。详见 SWARM.md 的「验证操作要短小、可重复」。

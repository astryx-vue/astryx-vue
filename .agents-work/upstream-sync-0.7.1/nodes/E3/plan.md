# E3 可访问性自动检查 · 执行计划

## 目标

给 astryx-vue 搭一套**可访问性（a11y）的自动检查**。可访问性就是：读屏软件能正确读出组件，只用键盘也能操作，焦点不会丢。

它和视觉对照的分工是：视觉对照看「长得像不像」，a11y 检查看「读屏和键盘的体验一样不一样」。按项目规程，这正是「交互体验与上游一致」里很重要的一块。

这个节点交付的是**骨架和基线**：

1. 把工具搭起来。
2. 用它把现状扫一遍。
3. 把现有问题记成一份「已知问题名单」，以后只许变短。
4. 再挑 3 个最基础的交互模式，写成「交互契约」并接上组件。

不需要修组件本身。组件的问题交给各个 C 节点去修。

## 工作环境

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/E3`，分支 `sync/e3-a11y`。只在这里改。
- 规程：`/Users/shenqingchuan/workspace/astryx-vue/.agents-work/upstream-sync-0.7.1/SWARM.md`。重点看「对齐上游的标准」和「跑检查时的环境」两节。
- 台账：同目录 `ledger/E3.md`，有 37 个提交，基本都是上游 `internal/a11y-spec` 的演进。
- 上游仓库（只读）：`/Users/shenqingchuan/workspace/astryx-upstream`，标签 `v0.7.1`。重点读这些：
  - `internal/a11y-spec/README.md`
  - `internal/a11y-spec/src/`（contract、checklist、harness、check、expect、report，以及 patterns 目录下 24 个模式）
  - `docs/specs/AST-020/spec.md`：契约怎么写
  - `docs/specs/AST-021/spec.md`：旧测试怎么迁移
- 已有工具：
  - `scripts/swarm/browser-lock.mjs`：浏览器锁
  - `scripts/swarm/visual-compare/serve.mjs`：起文档站的方法
- 所有测试和构建命令前面加 `env -u NODE_ENV`。vitest 一律加 `--maxWorkers=2`。

### 浏览器纪律

- 整台电脑同时最多开 2 个浏览器会话。开浏览器必须走 `browser-lock.mjs`，可以用 `run` 子命令，也可以在代码里调用 `withBrowserLock`。
- 你同一时刻只开 1 个浏览器。
- 文档站用 **5172** 端口（2 号槽位），用完关掉。

## 上游是怎么做的（先读懂再动手）

上游的思路是：**一个交互模式只写一次契约，组件去「绑定」它。**

拿 switch（开关）举例。凡是开关类的组件，都要满足同一组要求：

- 读屏软件把它报成 switch，并且有名字。
- 状态改变时，名字不变。
- 开或关的状态对外暴露，而且和画面一致。
- 鼠标和键盘都能切换。
- 焦点不乱跳。

上游把这些要求写成数据（`patterns/switch.ts`）。组件只需要声明自己有哪些状态，测试就会去问浏览器：实际暴露出来的是不是这样。

证据分两层：

- jsdom 层：只看 DOM。
- chromium 层：看真实浏览器的可访问性树。

## 我们怎么做（适合 Vue 的方式）

不要求逐行照搬上游代码，要的是**检查的效果一样**。建议这样分层做：

### 第一层：axe 页面扫描（基线）

- 加依赖 `@axe-core/playwright`，放进 `catalog:visual`，因为它和 playwright 是一组。
- 新建 `scripts/swarm/a11y-scan.mjs`：
  - 起文档站。
  - 拿浏览器锁。
  - 遍历组件页，范围是 `/en/components/<slug>/` 的全部页面，从 `apps/docs/components/demos/*/meta.ts` 或 catalog 读取，不要手写清单。
  - 对每页的**组件示例区域**跑 axe。文档站自身的导航、侧栏不算，用 `include` 限定范围，选择器参考 A2 工具里我们站点的预览区选择器。
  - 浅色和深色各跑一遍，因为深色模式下对比度问题最多。
- 输出位置：
  - `report.json`：每页每条违规的规则 id、影响级别、节点选择器、说明。
  - `report.md`：人能读的摘要，按规则和组件汇总。
- **已知问题名单**：`scripts/guardrails/a11y-known-issues.json`，按「组件 slug + 规则 id」记录现有违规。
  - 检查时，出现名单外的新违规就失败。
  - 名单里的某条已经不再出现，也要失败，提示把它删掉。这条和 A3 的 SSR 名单是同一套机制，可以复用 A3 的写法。
  - 提供 `--update`，只能收紧名单。
- 跑一次页面扫描要起服务、开浏览器，比较慢，**不要接进 `pnpm check`**。给它单独一个脚本：`"a11y": "node scripts/swarm/a11y-scan.mjs"`。

### 第二层：交互契约（先做 3 个模式）

- 新建 `packages/core/test-support/a11y/`，或者你认为更合适的位置，要求是不发布到 npm。在里面实现一个小框架：「模式契约 + 组件绑定 + 检查」，思路参照上游的 `contract.ts`、`checklist.ts`、`check.ts`、`expect.ts`。
  - 我们的测试环境是 vitest 加 happy-dom，相当于上游的 jsdom 层，先只做这一层。
  - 浏览器层（真实的可访问性树）先不做，但接口里要留出位置。在回报里写清楚以后怎么接。
- 先做 3 个最基础的模式：**button、checkbox、switch**。
  - 照上游 `patterns/<name>.ts` 写契约。
  - 再照上游 `patterns/<name>.fixtures.ts` 和 `*.jsdom.test.ts`，把我们对应的组件绑定上：
    - Button、IconButton、ToggleButton 绑 button
    - CheckboxInput 等绑 checkbox
    - Switch 绑 switch
  - 具体绑哪些组件，看上游 fixtures 怎么写的，以及我们有哪些组件。
- 契约测试接入普通的 vitest，也就是会跟着 `pnpm check` 跑，所以要快。
- 契约里我们组件过不了的条目，用一份已知失败名单记录，机制和上面一样。写清楚是哪个组件、哪一条、为什么。这些就是后面 C 节点要追平的「交互差距」。
- 其余 21 个模式（tabs、menu-button、combobox、dialog、slider 等）这次不做。在回报里列出一个清单，标明每个模式该由哪个 C 节点接手，总控会写进对应节点的计划。

## 要回答清楚的问题（写进回报）

1. axe 扫出来的现状：
   - 总共多少页、多少条违规。
   - 按影响级别统计：critical、serious、moderate、minor 各有多少。
   - 排前 10 的规则。
   - 深色模式比浅色多出哪些问题。
2. 3 个契约里，我们的组件各有几条过不了，原因分别是什么。
3. 其余 21 个模式和 C 节点的对应表。
4. 台账 `ledger/E3.md` 的 37 条逐条处理：
   - 「已采纳」：写明落在哪个文件。
   - 「交给 Cx」：说明是哪个模式。
   - 「不适用」：写明理由，比如这是 Storybook 专用的。
   - 打勾并写备注。注意台账的格式：在条目下面加一行备注即可。

## 测试

- `tests/a11y-scan.test.ts`：只测纯逻辑，不开浏览器。覆盖这几项：
  - 页面清单怎么生成
  - 违规怎么汇总
  - 已知问题名单的判定：新增、消失、`--update` 只收紧
- 3 个契约的 vitest 测试本身，就是第二层的验证。
- 两种 NODE_ENV 下都要通过。

## 自测清单

1. 跑一遍完整的 `pnpm a11y`，浅色和深色都跑，生成 `report.json` 和 `report.md`，已知问题名单和实际情况一致。再跑一次，结果稳定：同样的输入，违规集合不变。
2. 故意在某个组件的示例里加一个没有名字的 `<button>`，确认 `pnpm a11y` 失败，并点名这个组件和规则 `button-name`。改完后还原。
3. 故意把 Switch 的 `role` 改掉，确认 switch 契约测试失败。改完后还原。
4. 跑完后检查：锁目录是空的，5172 端口没有服务在监听，没有残留的浏览器进程。
5. 两种 NODE_ENV 下全量 vitest 都通过。完整的 `env -u NODE_ENV pnpm check` 也要通过，其中 test 那一步换成 `pnpm vitest run --maxWorkers=2`。
6. 新写的源码文件不超过 500 行。

## 不做

- 不修组件。组件的问题只记进名单。
- 不接 CI。以后可以接进 E4 的 workflow，在回报里给建议就行。
- 不做其余 21 个模式。

## 提交与回报

- 在分支上提交，提交信息用中文，不要推送。
- 回报写到 `/Users/shenqingchuan/workspace/astryx-vue/.agents-work/upstream-sync-0.7.1/nodes/E3/impl-1.md`（注意是主仓库这个路径），内容包括上面「要回答清楚的问题」的 4 项，以及自测清单每一项的结果、拿不准的地方。
- 最终回复用中文，300 字以内。

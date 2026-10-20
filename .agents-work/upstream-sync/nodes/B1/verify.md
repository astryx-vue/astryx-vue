# B1 主题系统与 token · 验收计划

你是验收者，只负责检查，不改代码。实现者的回报不能当证据，每一条都要你自己重新验证。按规程，判断标准是**用户看到的样子和用起来的手感**，代码结构不需要和上游一样。

## 环境

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/B1`。BASE = `git merge-base HEAD swarm-tree`。
- 上游仓库只读：`/Users/shenqingchuan/workspace/astryx-upstream`，标签 `v0.7.1`。
- 所有测试和构建命令前都加 `env -u NODE_ENV`。测试相关的项要用两种 NODE_ENV 各跑一遍。vitest 一律加 `--maxWorkers=2`。
- 浏览器纪律：
  - 整台机器同时最多开 2 个浏览器会话，你同一时刻只开 1 个。
  - 只能通过 `pnpm visual` 或 `browser-lock.mjs run` 开浏览器。
  - 文档站端口用工作区登记的槽位端口（`node scripts/swarm/worktree.mjs ls` 查），用完关掉。
- 上游官网走代理比较慢，`page.goto` 偶尔会超时，遇到了就重跑。访问外网前先设代理：`export https_proxy=http://127.0.0.1:7890 http_proxy=http://127.0.0.1:7890 all_proxy=socks5://127.0.0.1:7890`。
- 临时文件放在 `/tmp/verify-B1/`。开始和结束时各跑一次 `git status`，两次结果要相同。

## 检查项

每一项只能判「过」或「不过」，并附上证据。

### 一、效果和上游一致

1. **默认外观没变**：
   - 自己建一个 BASE 的 worktree（放在 `/tmp/verify-B1/base`）。
   - 对 Button、Card、Dialog、TextInput、Table、Badge 这 6 个组件，在 BASE 和 B1 上各跑一遍 `pnpm visual <C> --out ...`。注意：两次分别在 base 和 B1 目录里跑，依次跑，不要同时跑。
   - 逐张比较两边的 `ours.png`，四种组合都要比。像素差异要是 0；如果不是 0，要能证明只是抗锯齿造成的，并且亲眼看图确认。
2. **间距跟着根字号变**：
   - 在 B1 的文档站打开 Button 页，用 Playwright 把 `html` 的 `font-size` 设成 20px。
   - 测按钮的 `padding-inline` 计算值，应该是 16px 时的 1.25 倍。
   - 同样的操作在 BASE 上做一次，BASE 的值应该不变。这样能说明这个变化确实是 B1 带来的。
3. **间距取值和上游一致**：把 `--astryx-spacing-*` 的全部取值，和上游 `v0.7.1:packages/core/src/theme/tokens.stylex.ts` 的 `spacingDefaults` 逐个对照，都要一致（名字只差前缀）。
4. **数据 token 和上游一致**：`--astryx-color-data-*` 的名字和取值（浅色、深色），和上游 `dataTokens.stylex.ts` 一致。抽 5 个核对。
5. **旧兼容层真的删了**：
   - 从回报里「删掉的旧名字」清单中抽 3 个，写一个用旧名字的主题，确认它已经不生效。
   - 再用新名字写一遍，确认生效。
   - 再从上游 #7302 的 diff 里找一个被删掉的旧名字，确认我们这边也不再支持。
6. **defineTheme 的新能力**：下面每项都要写一个最小用例，在 `/tmp` 里写测试或者用 node 脚本，断言生成的 CSS 和上游同等配置的输出效果一致（变量名只差前缀，取值相同）：
   - `accent: [浅, 深]`
   - 局部 token
   - 环境适配
   - 外观嵌套
   - `extends`
   上游的输出可以照上游测试里的期望值来写。
7. **MediaTheme `mode="auto"`**：
   - 读实现，确认它会测量背景再决定用浅色还是深色。
   - 在文档站或测试里放一张深色背景图和一张浅色背景图，确认分别选到了对应的模式。
8. **深色模式**：读一张深色下 Dialog 的 `side-by-side.png`，确认背景、文字、边框都是深色主题的配色，没有残留浅色。

### 二、反向挑刺

9. 在 `packages/` 和 `apps/docs/` 里 grep 一遍，确认组件样式里没有 spacing 变量和 px 混算、在非默认根字号下会出错的写法，比如 `calc(var(--astryx-spacing-2) - 1px)`。如果有，这些写法在 20px 根字号下的结果要合理。
10. 用户自定义主题的兼容性：拿文档站 `themes/extending` 页的示例主题跑一遍，确认还能用。示例要么本来就不受影响，要么已经按新写法改过。
11. SSR：`packages/core/src/ssr-smoke.test.ts` 在两种 NODE_ENV 下都通过；`Theme`、`MediaTheme` 在服务端渲染时不访问 `window`。
12. 台账 `ledger/B1.md` 的 98 条都打了勾，并写了结论。抽 6 条核对：
    - 2 条「已采纳」：在代码里找到对应的实现。
    - 2 条「交给 Cx」：确认确实是组件接入层的事。
    - 2 条「不适用」：理由站得住。
13. 回报里列了「交给 Cx」的清单，按 C 节点分组，C 节点能直接拿来用。

### 三、整体

14. 主题文档（中英文）讲清楚了间距改用 rem、旧名字已删除、新增了哪些能力，并且说明了 `--astryx-` 前缀这个有意保留的差异。
15. `env -u NODE_ENV` 和 `NODE_ENV=production` 两种模式下，全量 vitest 都通过，用例数相同。
16. 完整执行 `env -u NODE_ENV pnpm check`，其中 test 那一步换成 `pnpm vitest run --maxWorkers=2`，要通过。
17. 新写或改动的源码文件不超过 500 行。没有越界改动，用 `git diff $BASE --stat` 核对：没有改各个组件的 theme target 接入，没有改 Neutral 调色板，没有改 matcha 和 y2k 的间距。

## 结论

- 任何一条不过，结论就是「不通过」。
- 报告写到 `/Users/shenqingchuan/workspace/astryx-vue/.agents-work/upstream-sync/nodes/B1/verify-<N>.md`，格式照 `templates/verify-report.md`。
- 最终回复用中文，200 字以内。

# E4 CI 接入视觉对照 · 验收计划

你是验收者，只负责检查，不改代码。实现者的回报不能当作证据，每一条都要你自己重新验证。

这个节点的目标是：一个 PR 改到了组件，CI 就自动给出视觉对照图和分数，结果写成 PR 评论。它只报告结果，不拦截 PR。

## 环境

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/E4`。
- 测试和构建一律加 `env -u NODE_ENV`。测试项要跑两遍：一遍 `env -u NODE_ENV`，一遍 `NODE_ENV=production`。
- vitest 一律加 `--maxWorkers=2`。
- 浏览器纪律：整台机器同时最多开 2 个浏览器会话，只能通过 `pnpm visual` 或 `browser-lock.mjs run` 开浏览器。文档站用 5174 端口，用完关掉。看图直接用读图工具读 PNG 文件。
- 临时文件放到 `/tmp/verify-E4/`。开始和结束时各跑一次 `git status`，两次结果要相同。

## 检查项

每一项只能判「过」或「不过」，并附上证据。

### 一、改动到组件的映射

1. 用 `scripts/swarm/changed-components.mjs`，自己构造下面几组输入，结果都要符合预期：
   - `packages/core/src/Button/Button.vue` → 包含 `Button`
   - `packages/core/styles/dropdown-menu.css` → 包含 `DropdownMenu`
   - `apps/docs/components/demos/text-input/overview.vue` → 包含 `TextInput`
   - `packages/themes/neutral.css` → 正好是代表组件那一组
   - `README.md`、`scripts/foo.mjs` → 空
   - 一次性改 10 个不同组件 → 只跑 8 个，另外 2 个在输出里明确列为「这次没跑」
2. 映射里的组件名和 slug 换算，复用的是 A2 的 `names.mjs`，没有另写一份。用 grep 确认。
3. 代表组件名单写在配置里，并且写了理由。

### 二、本地完整演练（用浏览器）

4. 自己跑一遍完整链路：输入改动列表 `packages/core/src/Button/Button.vue` 和 `packages/core/src/Badge/Badge.vue`，依次执行「算组件 → 逐个跑 visual → 生成评论」，输出放到 `/tmp/verify-E4/`。要求：
   - 两个组件都生成了四种组合的图。
   - 评论 Markdown 里有两个组件的分数表。
5. 用读图工具打开 Button 和 Badge 各一张 `side-by-side.png`，确认左边是上游、右边是我们，截的是同一个组件的预览区。
6. 再跑一次，这次输入一个上游不存在的组件，可以临时构造一个映射，或者用实现者提供的参数。要求：
   - 评论里标出了这个组件「失败」。
   - 其它组件照常出结果。
   - 整个流程的退出码是 0。
   - 没有为这个不存在的组件开浏览器：开始前用 `pgrep -fl chrome-headless-shell` 记下进程，跑的过程中观察，再和开始前对比。
7. 跑完以后，锁目录是空的，5174 和 5172 端口都没有监听，没有残留的 headless 进程。

### 三、评论内容

8. 读 `scripts/swarm/visual-comment.mjs` 和它的测试，确认：
   - 评论生成是一个纯函数。
   - 有隐藏标记，用来更新已有的评论，而不是重复发新评论。
   - 失败的组件、没跑的组件都有专门的写法。
   - 文字是中文。
9. 把生成的评论贴进一个临时的 `.md` 文件，检查 Markdown 表格的语法（列数一致，能正常渲染）。

### 四、workflow 文件

10. 用 `actionlint` 检查 `.github/workflows/visual-compare.yml`，没有报错。装不上的话，就用 YAML 解析，再加人工逐行检查，并在报告里写明是怎么检查的。
11. 所有 `uses:` 都锁定了 40 位的提交哈希，并在注释里写了版本号。
12. 权限是最小的：只有 `contents: read` 和 `pull-requests: write`。
13. 触发条件里的路径限制正确，同一个 PR 的并发会取消旧的运行，同时支持 `workflow_dispatch` 手动指定组件。
14. fork 来的 PR 不会因为写不了评论而让 job 失败：评论那一步要有条件判断，或者设置 `continue-on-error`，并写明理由。
15. 浏览器安装有缓存，版本跟随 lock 文件里的 playwright 版本，没有写死别的版本。
16. 附件上传有保留天数，评论里有附件的链接。
17. 分数只用来报告，不会因为分数让 job 失败。看清楚 workflow 里每个可能返回非 0 的步骤。
18. 在没有代理的环境下工具也能访问上游：在 workflow 里确认传了 `--no-proxy`，或者确认工具在没有 `https_proxy` 时不会去连 127.0.0.1:7890。读 `args.mjs` 和 `capture.mjs` 确认。

### 五、整体

19. 新增的两个测试文件，在两种 NODE_ENV 下都通过。
20. 完整的 `env -u NODE_ENV pnpm check` 通过，其中 test 一步换成 `pnpm vitest run --maxWorkers=2`。
21. 新源码文件都不超过 500 行。`docs.yml` 和 `release.yml` 没有被改动，A2 工具文件没有被改动（如果有改动，要有理由，而且回报里说明了）。
22. 回报里列出了「只能等推到 GitHub 后才能验证」的事项。逐条判断它们是否真的无法在本地验证。

## 结论

- 只要有一条不过，结论就是「不通过」。
- 报告写到 `/Users/shenqingchuan/workspace/astryx-vue/.agents-work/upstream-sync-0.7.1/nodes/E4/verify-<N>.md`。
- 最终回复用中文，200 字以内。

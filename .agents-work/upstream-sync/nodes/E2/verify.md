# E2 拆分文档站大文件 · 验收计划

你是验收者，只检查，不改代码。实现者的回报可以帮你了解情况，但不能当证据，每一条都要你自己重新验证。这个节点是纯重构，**判断标准只有一个：页面看起来和用起来，跟拆之前完全一样。**

## 环境

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/E2`。`BASE` 指实现者第一个提交的父提交，用 `git log` 找出来。
- 环境规定：所有测试和构建命令都要加 `env -u NODE_ENV`。测试相关的检查项要跑两遍，一遍 `env -u NODE_ENV`，一遍 `NODE_ENV=production`。
- vitest 一律加 `--maxWorkers=2`。
- 浏览器纪律：
  - 整台机器同时最多开 2 个浏览器会话。
  - 开浏览器只能走 `node scripts/swarm/browser-lock.mjs run --purpose E2-verify -- <命令>`。
  - 文档站服务用 5173 端口，同一时刻只开一个。base 和 E2 依次起，不要两个一起起。
  - 看截图用读图工具直接读 PNG 文件。
- 临时文件放在 `/tmp/verify-E2/`。开始和结束时各跑一次 `git status`，两次结果要相同。最后删掉你建的 base worktree。

## 检查项

每一项只能判「过」或「不过」，并附上证据。

### 一、页面完全不变（最重要）

自己建一份基准：`git worktree add /tmp/verify-E2/base $BASE`，然后在里面 `pnpm install --frozen-lockfile`。不要用实现者截的图。

base 和 E2 各起一次文档站（端口都是 5173，依次起），写一个 Playwright 脚本在两边截同一组页面，算像素差异。

1. 首页 `/` 和 `/en/`，桌面浅色和桌面深色两种模式。自动播放的动画要先固定住，或者等它停在同一个状态，再截。两边的差异必须是 0；有差异的话，必须能证明只是动画时间点不同（比如让动画停住以后差异变成 0）。
2. 演练场 `/playground/`，依次打开 `ai-chat`、`settings-dialog`、`kanban-board`、`detail-page`、`settings-sidebar` 这 5 个模板，每个都截桌面浅色。两边差异为 0。
3. 演练场的主题编辑面板展开以后，截桌面浅色和桌面深色。两边差异为 0。
4. 用到 `TokenReference` 的主题页（用 grep 找出是哪一页），截桌面浅色和桌面深色。两边差异为 0。
5. 从上面这些截图里挑至少 4 张，用读图工具亲眼看一遍，确认页面完整：没有空白区块，没有报错覆盖层，没有缺失的样式。

### 二、交互不变

在 E2 上逐项操作，结果要和 base 一样：

6. 演练场切换模板：编辑器里的源码和预览一起跟着变。
7. 在主题编辑器里改一个颜色（比如 accent），预览马上跟着变。分别在两边点「导出 CSS」和「导出 JSON」，导出的文本完全相同。
8. 首页点「复制安装命令」按钮，状态变成「已复制」。
9. 首页的自动播放聊天能完整播完一轮。
10. 浏览器控制台没有新增的错误或警告。对比 base 和 E2 在同样操作下的 console 输出。

### 三、模板页和生成文件的处理

11. 演练场模板页最终怎么处理的，要在 impl 回报里找到，并核实：
    - 如果改成了「排除」：排除规则写在 `line-limit.config.mjs` 里，理由说得通，范围只覆盖 `playground/pages/*.vue`，没有顺带排除掉别的文件。
    - 如果拆了：`pnpm check:templates` 必须通过，`astryx-vue template <slug>` 复制出来的文件在空白项目里必须能编译，演练场编辑器里看到的源码必须完整。
12. 模板页的内容没有被改动：`git diff $BASE -- apps/docs/components/playground/pages/` 应该为空。如果因为拆分改了，就按第 11 项的第二种情况核实。
13. 如果 `templateManifest.ts` 被排除了：跑一次 `node apps/docs/scripts/generate-template-manifest.mjs`（需要的话，先看脚本怎么指定上游目录），确认它确实能生成出一样的文件。跑完把文件还原。如果脚本根本跑不起来、或者生成结果对不上，说明它其实不是生成物，排除它就不合理。
14. `pnpm check:templates` 通过；`pnpm --filter @astryx-vue/cli generate:check` 通过。

### 四、拆得合理

15. 被拆的文件和所有新文件都不超过 500 行。
16. 每个新文件职责单一，一句话说得清。没有那种什么都往里放的杂物文件，也没有不到 30 行、又只被一个地方用到的碎片文件（如果有，要有理由）。
17. 原来的对外导出没有变。`theme.ts` 等文件被别处 import 的名字都还在，用 grep 检查所有引用方。
18. 注释里没有变更历史。用 `grep -nE "拆出|原来|moved|extracted|split from"` 检查。
19. 白名单里这 11 条已经全部删掉（改成排除的也算删掉），其它条目没有变化。`node scripts/check-line-limit.mjs` 通过。

### 五、整体

20. `tests/playground-*.test.ts`、`tests/docs-b11.test.ts`、`tests/llms-txt.test.ts`、`tests/sidebar-families.test.ts` 在两种 NODE_ENV 下都通过，通过数和 base 一样。
21. 完整的 `env -u NODE_ENV pnpm check` 通过，其中 test 那一步换成 `pnpm vitest run --maxWorkers=2`。
22. 没有动 `packages/` 下的任何文件：用 `git diff $BASE --stat` 核对。

## 结论

- 任何一条不过，结论就是「不通过」。
- 报告写到 `/Users/shenqingchuan/workspace/astryx-vue/.agents-work/upstream-sync/nodes/E2/verify-<N>.md`，格式和其他节点一样，截图部分要写清路径和你看到的内容。
- 最终回复用中文，200 字以内。

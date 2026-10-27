# E2 拆分文档站大文件 · 执行计划

## 目标

文档站里有 11 个源码文件超过 500 行。这个节点把它们处理掉：能拆的按职责拆小，确实是生成物的就改为不计入行数。做完以后，这些文件都从 500 行白名单里删掉。

**页面外观和交互完全不变。** 这是纯重构，不改任何效果。

| 文件 | 行数 | 它是什么 |
| --- | --- | --- |
| `apps/docs/components/playground/pages/ai-chat.vue` | 842 | 演练场模板页 |
| `apps/docs/components/playground/pages/settings-dialog.vue` | 789 | 演练场模板页 |
| `apps/docs/components/playground/pages/settings-sidebar.vue` | 585 | 演练场模板页 |
| `apps/docs/components/playground/pages/kanban-board.vue` | 584 | 演练场模板页 |
| `apps/docs/components/playground/pages/detail-page.vue` | 532 | 演练场模板页 |
| `apps/docs/components/home/HomeStage.vue` | 600 | 首页的主舞台（自动播放的聊天演示） |
| `apps/docs/components/playground/theme.ts` | 591 | 演练场主题编辑器的数据和换算逻辑 |
| `apps/docs/components/theme-tokens/TokenReference.vue` | 553 | 主题文档里的 token 对照表 |
| `apps/docs/components/playground/PlaygroundApp.vue` | 545 | 演练场外壳 |
| `apps/docs/components/playground/PlaygroundThemeEditor.vue` | 522 | 演练场的主题编辑面板 |
| `apps/docs/components/playground/templateManifest.ts` | 509 | 文件头写着由 `apps/docs/scripts/generate-template-manifest.mjs` 生成 |

## 工作环境

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/E2`，分支 `sync/e2-split-docs`。只在这个工作区里改。
- 先读规程 `/Users/shenqingchuan/workspace/astryx-vue/.agents-work/upstream-sync-0.7.1/SWARM.md`，特别是「跑检查时的环境」这一节：跑测试和构建都要加 `env -u NODE_ENV`。
- 500 行检查：`node scripts/check-line-limit.mjs`。白名单在 `scripts/guardrails/line-limit-allowlist.json`，排除规则在 `scripts/guardrails/line-limit.config.mjs`。拆完以后跑 `--update` 收紧白名单。
- 视觉对照工具（A2 做的）：`pnpm visual <组件> --section all --no-serve --ours <url>`。用法看 `scripts/swarm/README.md`。这个节点主要是给自己的页面做「改之前和改之后」的对比，不是和上游对比。
- 跑测试时限制并发：`env -u NODE_ENV pnpm vitest run --maxWorkers=2 <文件>`。

### 浏览器纪律

- 整台机器同时最多开 2 个浏览器会话。
- 开浏览器只能通过 `node scripts/swarm/browser-lock.mjs run --purpose E2-<说明> -- <命令>` 或者对照工具，它们会自动排队拿锁。
- 你的文档站开发服务固定用 **5173** 端口（3 号槽位），用完关掉。

## 演练场模板页要特别小心

`playground/pages/*.vue` 这些文件，不只是文档站的页面，还有三个地方在读它们的源码：

1. 演练场用 `import.meta.glob('./pages/*.vue', { query: '?raw' })` 读源码，放进在线编辑器给用户看、给用户改（`apps/docs/components/playground/templates.ts`）。
2. CLI 构建 catalog 时会读 `pages/<slug>.vue` 的源码，`astryx-vue template <slug>` 命令就是把这一个文件原样复制到用户项目里（`packages/cli/src/generate/build-catalog.ts`、`packages/cli/src/templates.ts`）。
3. `pnpm check:templates` 会把每个模板放进一个空白项目，确认能编译。

这意味着：**一个模板必须是一个单文件，用户复制过去就能直接用。** 如果把它拆成几个子组件文件，复制给用户的就只有主文件，会缺东西。

所以模板页的处理方式按下面的顺序考虑，先评估再动手：

1. **首选**：把模板页看作「给用户的示例代码资产」，不当作「我们维护的源码」，在 `line-limit.config.mjs` 里加一条排除规则，写明理由。上游 React 版的同名模板，行数可以作为参考，比如上游 `detail-page/page.tsx` 有 626 行，说明上游也把它当成一整页示例。可以用 `git -C /Users/shenqingchuan/workspace/astryx-upstream show v0.7.1:packages/cli/assets/templates/pages/<slug>/page.tsx | wc -l` 查。
2. **如果你认为应该拆**，就必须同时改造演练场、CLI 复制和 check:templates，让它们支持多文件模板。这个改动很大，**不要做**，在回报里写清楚你的理由和方案就行，由总控决定。

`templateManifest.ts` 也一样，先确认它是不是真的由脚本生成：

- 是生成物：在排除规则里加上它，理由写「由 generate-template-manifest.mjs 生成」。
- 已经和生成脚本对不上，其实一直在被手改：在回报里说明，按手写源码去拆。

## 其余 6 个文件的拆法

总原则：

- 按职责拆，不按行数硬切。每个新文件要能用一句话说清它负责什么。
- 原文件路径保留，对外导出的名字和用法不变，别处的 import 不需要改。
- 注释写清楚现在负责什么，不写「从哪里拆出来的」。
- 遵守 SOLID 和 DRY。拆的过程中如果发现重复代码，可以顺手合并，但不能改变行为。

建议的拆法（这只是起点，读完代码可以调整）：

- **`HomeStage.vue`**：
  - 文案对象（中英文 copy）挪到单独的 `homeStageCopy.ts`。
  - 自动播放聊天那一块挪成子组件。
  - 两段 `<style>` 跟着各自的组件走。
- **`theme.ts`**：
  - 拆成「类型和常量」「颜色读写与换算」「导出 CSS 和 JSON」「字号和间距阶梯」这几块。
  - 入口文件重新导出全部内容。
- **`TokenReference.vue`**：数据整理逻辑挪进 composable 或者纯函数文件，组件本身只负责渲染。
- **`PlaygroundApp.vue`**、**`PlaygroundThemeEditor.vue`**：
  - script 里的状态和逻辑挪进 composable，比如 `usePlaygroundState`、`useThemeEditor`。
  - 模板里比较大、又自成一块的区域，挪成子组件。

## 怎么证明「完全不变」

动手之前，先给现状拍一套基准截图。拆完以后再拍一套，两套对比：

1. 先跑一次 `env -u NODE_ENV pnpm build:packages`。然后在 5173 端口起文档站：`env -u NODE_ENV NODE_ENV=development pnpm --filter @astryx-vue/docs dev --port 5173`，具体怎么起，参考 `scripts/swarm/visual-compare/serve.mjs`。
2. 套上浏览器锁，用 Playwright 写一个一次性的截图脚本，放在 `/tmp/e2-shots/`，不要提交。按下面的列表，在「桌面浅色」和「桌面深色」两种组合下截整页：
   - 首页：`/` 和 `/en/`。等自动播放的动画停在一个固定状态再截；做不到的话，就把动画关掉。
   - 演练场：`/playground/`，再分别打开 `ai-chat`、`settings-dialog`、`kanban-board`、`detail-page`、`settings-sidebar` 这几个模板。
   - 主题编辑面板展开的状态。
   - 含有 `TokenReference` 的主题页，去 `apps/docs/docs/zh/themes/` 里找是哪一页。
3. 拆完以后用同一个脚本再截一次，逐张算像素差异。要求是 0，或者只有动画、光标这类无关的差别，这种情况要说明。
4. 交互也抽查一下：
   - 演练场里切换模板。
   - 在主题编辑器里改一个颜色，确认预览跟着变。
   - 导出 CSS 和 JSON，内容和拆之前一样。
   - 首页的「复制安装命令」按钮。

另外：

- 跑 `pnpm check:templates`，确认模板都能编译。
- 跑 `pnpm --filter @astryx-vue/cli generate:check`，确认 catalog 没变。
- 跑相关的测试：`tests/playground-*.test.ts`，以及 `tests/docs-b11.test.ts` 等。拆之前和拆之后的通过数要一样。
- 跑完整的 `env -u NODE_ENV pnpm check`。为了遵守内存纪律，其中 test 那一步换成 `pnpm vitest run --maxWorkers=2`。

## 不做

- 不改任何页面的外观、文案和交互。顺手发现的 bug 只记在回报里，不修。
- 不碰组件库（`packages/`）和 CLI 的代码。
- 不改模板页的内容。

## 提交与回报

- 在分支上提交，提交信息用中文。可以分几次提交。不要推送。
- 回报写在 `/Users/shenqingchuan/workspace/astryx-vue/.agents-work/upstream-sync-0.7.1/nodes/E2/impl-1.md`。注意是主仓库这个路径，不是工作区里。回报内容：
  1. 模板页和 `templateManifest.ts` 最后是怎么处理的，理由是什么。
  2. 其余 6 个文件各自拆成了哪些文件，每个文件一句话说明职责，附上行数。
  3. 截图对比的清单和结果，附上前后截图的路径，放在 `/tmp/e2-shots/` 下面就行。
  4. 交互抽查和各项检查的结果。
  5. 白名单和排除规则的变化。
  6. 顺手发现、但没有修的问题。
- 最终回复用中文，300 字以内。

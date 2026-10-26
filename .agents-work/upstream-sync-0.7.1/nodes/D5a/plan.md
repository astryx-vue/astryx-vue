# D5a 页面模板修复与补齐 · 执行计划

## 目标

文档站演练场里的页面模板（登录页、设置页、看板、表格页等）和原版 Astryx 的同名模板长得一样，能正常显示：

1. 不再有因为 CSS 变量写错、导致内边距、间距、背景、圆角全部失效的模板。
2. 设置弹窗（settings-dialog）的设置行版式和原版一样。
3. 用了 `is-label-hidden` 的模板，标签确实被隐藏，标题不再被挤得折行。
4. 原版有、我们没有的 4 个模板补上：`login`、`table`、`messaging-shell`、`incident-console`。

这个节点只改文档站里的模板文件，不改命令行怎么生成模板（那归 D5b）。

## 工作环境

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/D5a`，分支 `sync/d5a-templates`，槽位 3，端口 5173。只在这里改。
- 动手前先读：
  - 我们的模板：`apps/docs/components/playground/pages/*.vue`（53 个），清单在 `apps/docs/components/playground/templateManifest.ts`（slug、分类、标题等）。模板图标在 `templateIcons.ts`。
  - 原版模板：`git -C /Users/shenqingchuan/workspace/astryx-upstream ls-tree --name-only v0.7.1 packages/cli/assets/templates/pages/`，每个目录下有 `page.tsx` 和 `template.doc.mjs`（名字、描述、关键词、分类、`isReady`、`isHiddenFromOverview`）。
  - 原版在线演练场：`https://astryx.atmeta.com/playground?template=<slug>`（访问要设代理）。我们的：`http://127.0.0.1:5173/playground/?template=<slug>`。
  - 台账：`.agents-work/upstream-sync-0.7.1/ledger/D5.md`（125 条）。本节点只处理和模板内容、外观有关的条目；纯命令行行为的条目标「交给 D5b」。
  - 模板落地检查脚本：`scripts/check-templates.mjs`（`pnpm check:templates`），它会把模板复制到临时项目里做类型检查。
- 环境纪律：测试和构建命令前加 `env -u NODE_ENV`；vitest 加 `--maxWorkers=2`。
- 浏览器：只能用 `node scripts/swarm/browser-lock.mjs run --purpose D5a --max-run 150 -- <命令>`，同一时刻只开 1 个。Playwright 脚本放在工作区内的 `.tmp-d5a/`（用完删掉，不提交）。文档站 5173 端口，用完关掉。Playwright 访问原版要传代理：`chromium.launch({ proxy: { server: 'http://127.0.0.1:7890', bypass: '127.0.0.1,localhost' } })`。

## 要做的事（按顺序，每做完一项就提交）

1. **补全 CSS 变量前缀，并加检查**
   - `grep -rnoE "var\(--(spacing|color|radius|font|text|size|shadow|duration|ease|border|focus)[a-z0-9-]*" apps/docs/components/playground/pages` 找出所有少了 `--astryx-` 前缀的变量（大约 160 处）。逐个改成 `var(--astryx-…)`。改之前确认我们确实有这个变量（去 `packages/themes/neutral/base.css` 里找）；名字对不上的，按上游 `page.tsx` 的意思换成我们实际有的变量，在回报里列出。
   - 新写一个检查脚本 `scripts/check-template-tokens.mjs`（或者加进 `check-templates.mjs`，看哪个更合适）：模板里只要出现不带 `--astryx-` 前缀的设计变量就报错。接进 `package.json` 的 `check:packages`。模板自己定义的局部变量（例如 `--_foo`、`--chart-x`）不算，规则写清楚。
2. **settings-dialog 的版式**：对照上游 `settings-dialog/page.tsx` 里的 `SettingsRow`、`SettingsCard`。每行左边是图标，中间是标题和说明（分两行），右边是控件；窄屏时改成上下排。用我们 core 现有的组件和布局组件拼，不新增 core 组件。
3. **`is-label-hidden` 的模板**：`grep -rln "is-label-hidden" apps/docs/components/playground/pages`，大约 10 个。每个在浏览器里打开，确认标签被隐藏、标题不折行。还有问题的就修。
4. **补 4 个模板**：`login`、`table`、`messaging-shell`、`incident-console`。照上游 `page.tsx` 用我们的组件改写成 `.vue`，加进 `templateManifest.ts`（分类、标题、描述从上游 `template.doc.mjs` 取，中英文都写）。上游 `isHiddenFromOverview: true` 的，在我们这边也不出现在总览里（看 manifest 有没有对应字段，没有就在回报里说明）。
5. **逐个和原版对照**：53 + 4 = 57 个模板，每个在桌面宽度（1440×900）下各截一张我们的、一张原版的，放 `/tmp/D5a-shots/<slug>-{ours,up}.png`。一个脚本一次只截一个模板，循环调用，单个模板截图超时就跳过、记下来。然后逐张看，差别明显的（布局错位、间距崩掉、颜色不对、内容缺失）修掉。小差别（字体渲染、图片不同）不用管。把每个模板的结论写进回报的一张表：slug、是否一致、改了什么。
6. **台账**：D5 的 125 条，和模板内容、外观有关的写结论；纯命令行的写「交给 D5b」。
7. 跑 `env -u NODE_ENV pnpm --filter @astryx-vue/cli generate` 重生 catalog（模板源码会被收进 catalog）。

## 不碰

- `packages/core`、`packages/themes`、`packages/cli/src`（生成的 `catalog.json` 除外）。模板里发现组件本身的 bug，写进回报，不要改组件。
- 演练场框架本身（`PlaygroundApp.vue` 等）：归 D8。
- `ROADMAP.md`、`SWARM.md`。

## 自测要求

1. 新的模板变量检查脚本能跑通；故意在一个模板里写 `var(--spacing-4)`，它会报错（测完还原）。
2. `env -u NODE_ENV pnpm check:templates` 通过。
3. `env -u NODE_ENV pnpm exec eslint --max-warnings 0 apps/docs/components/playground`、`node scripts/check-line-limit.mjs`、`env -u NODE_ENV pnpm --filter @astryx-vue/cli generate:check`、`env -u NODE_ENV pnpm check:i18n-catalog` 都通过。
4. `env -u NODE_ENV pnpm build:packages && env -u NODE_ENV pnpm docs:build` 通过。
5. 第 5 步的对照表。

## 回报

- 回报写到 `/Users/shenqingchuan/workspace/astryx-vue/.agents-work/upstream-sync-0.7.1/nodes/D5a/impl-1.md`，格式见 `templates/impl-report.md`。额外写：前缀改动的统计（多少处、多少个文件、哪些名字对不上）；57 个模板的对照表；发现的组件 bug。
- 分步提交，提交信息用中文，不要推送。最终回复用中文，300 字以内。

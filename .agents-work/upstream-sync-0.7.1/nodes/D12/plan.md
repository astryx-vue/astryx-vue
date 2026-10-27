# D12 演练场模板逐个走查 · 执行计划（第 1 批）

## 背景

演练场一共有 57 个页面模板，地址是 `/playground?template=<slug>`。D5a 和 D5c 已经把每个模板的大结构追平了原版，但用户验收时还是找出了很多细节差异。用户的原话是「template Playground 里面这样的问题还太多太多」。

这次要**心细如发**：一个区块一个区块地对，浅色、深色都要对。对照的依据是原版源码和原版截图。下面是用户已经报出来的问题：

1. **theme-showcase 的 Inventory 卡片**
   - 原版：卡片头部（标题 Inventory 加 Add item 按钮）下面，先是一行工具栏：左边搜索框和 Filters，右边列表视图、网格视图两个按钮。工具栏下面才是黄色提示条 `2 items are running low`。
   - 我们：漏了整行工具栏，提示条直接贴在头部分隔线下面，上面一点间距都没有。
   - 右边的 Activity 列表也有问题：原版每一行左边有圆形图标，右边有金额（+$248 / -$89）。我们这两样都没有。
2. **图标不显示（生产构建才出现，这一条最要紧）**
   - 现象：`dashboard` 的 Reload 按钮上应该有刷新图标，现在是空的。
   - 根因（总控已经查清楚了）：模板里写的是 `<Icon icon="heroicons:arrow-path" />`。`icon` 这个 prop 接收的是**语义名或 CSS 类名**，只有 `name` 这个 prop 才会去查 Iconify 图标库。线上 DOM 里渲染出来的是 `<span class="astryx-icon__external heroicons:arrow-path">`，被当成了 CSS 类名。图标数据其实已经打进 bundle 了，只是没人去取。
   - 同样的写法在仓库里搜得到很多处：`grep -rnE "icon=\"(heroicons|carbon):|icon: '(heroicons|carbon):" apps/docs`，比如 `table-tree`、`table-inbox`、`canvas-editor` 里传给别的组件的 `icon` 字段。要逐个确认：被 `<Icon :icon>` 渲染的，改成 `name`；组件本身的 `icon` prop 支持 Iconify 名字的，就保持原样，但要在浏览器里确认确实画出来了。
   - 修完再加一道防线：在 `scripts/check-template-tokens.mjs` 里加检查，或者另写一个检查，`<Icon icon="前缀:名字">` 这种写法一出现就报错。
3. **dashboard-scorecard 的趋势图**
   - 原版：用的是图表组件（`AreaChart` / `LineChart`），线条左右撑满卡片，有 y 轴刻度（0 / 1500 / 3000 …）、x 轴标签（W1 W4 W8 W12）和横向网格线；Current 是带渐变填充的曲线，Prior 是虚线。
   - 我们：手写的 `<svg viewBox="0 0 320 200">`，高度固定是 200px。宽度被等比例缩小后，图挤在卡片中间，窄窄一条，也没有坐标轴。
   - 改法：参考同目录 `dashboard.vue` 的写法（`chartWidth` 跟着 ResizeObserver 走，viewBox 和像素一比一，自己画坐标轴和网格线），照原版补齐坐标轴、网格、平滑曲线、面积填充和虚线。**模板只能 import `vue` 和 `@astryx-vue/core`。**
   - 其它手写 SVG 图表的模板（`dashboard-alert-rail`、`dashboard-cohort-funnel`、`dashboard-comparison`、`dashboard-composition`、`dashboard-progress`、`login-card`、`table-collapsible`）都按同一标准检查一遍：图要撑满容器，坐标轴和网格线和原版一样。

## 第 1 批范围

先修上面 3 条，再把下面这些模板逐个走查一遍。这些都是用户看得最多、图表和表格最密集的页面：

`theme-showcase`、`dashboard`、`dashboard-scorecard`、`dashboard-alert-rail`、`dashboard-cohort-funnel`、`dashboard-comparison`、`dashboard-composition`、`dashboard-progress`、`table`、`table-page`、`table-filter`、`table-grouped`、`table-collapsible`、`table-comparison`、`table-inbox`、`table-tree`

其余 41 个模板放到后续批次。

## 工作环境

- 工作区：`/Users/shenqingchuan/workspace/astryx-vue-wt/D12`，分支 `sync/d12-playground-qa`，槽位 4，端口 5174。只在这个工作区里改。
- 原版源码：`git -C /Users/shenqingchuan/workspace/astryx-upstream show v0.7.1:packages/cli/assets/templates/pages/<slug>/page.tsx`。这是对照的**唯一依据**，每个区块的结构、间距、图标、数据都从这里读。
- 原版已有截图（1440×900、浅色）：`/tmp/D5c-shots/up/<slug>.png`。
- 原版在线：`https://astryx.atmeta.com/playground?template=<slug>`。访问要走代理，Playwright 里设置 `proxy: { server: 'http://127.0.0.1:7890', bypass: '127.0.0.1,localhost' }`。等页面上的 `Building…` 消失、iframe 里有了内容再截图。可以参考 `/tmp/cmp-scripts/up.mjs`。
- 我们的站点：`env -u NODE_ENV pnpm --filter @astryx-vue/docs docs:build`，然后 `vitepress preview --port 5174`。**不要用 `vitepress dev`**：在这台机器上，演练场会报 `__VP_HASH_MAP__ is not defined`。截图脚本可以参考 `/tmp/cmp-scripts/batch-ours.mjs`，端口改成 5174。
- **图标问题只在生产构建里出现**，所以一律用 build + preview 来验证。

## 怎么走查（每个模板都按这个流程）

1. 读原版 `page.tsx`，把页面按区块列出来，比如「卡片头」「工具栏」「提示条」「表格」「侧栏 Activity」。
2. 打开我们的 `.vue`，逐个区块对照这几项：有没有、顺序、间距（原版的 `var(--spacing-N)` 对应我们的 `var(--astryx-spacing-N)`）、图标、文案、数据条数、对齐、颜色。
3. 截图对照：同一个模板，左边原版、右边我们，拼成一张图。浅色截一张，深色截一张；深色模式原版也要截。需要滚动才能看到的区块，滚到同一个位置再截。
4. 把差异写进 `nodes/D12/diff-<slug>.md`：一条差异一行，后面写「已修」或「不修，理由是……」。
5. 修完再截一次图，确认差异清单逐条关闭。

## 规则

- 原版用 lucide 或 heroicons 的 React 图标组件，我们统一用 `<Icon name="heroicons:xxx" />`，或者用组件 prop 支持的 Iconify 名字。新用到的图标名要加进 `apps/docs/components/playground/templateIcons.ts`。
- 模板只能 import `vue` 和 `@astryx-vue/core`。
- 模板文件可以超过 500 行，这是用户定的。
- 不能用 `!important`。注释只写现在的行为。
- 发现是 **core 组件本身**的问题：先在模板里写最小的绕过，再把问题写进回报，交给总控开节点修。不要直接改 `packages/core`。
- 改完重新生成 catalog：`env -u NODE_ENV pnpm --filter @astryx-vue/cli generate`。

## 自测

1. `env -u NODE_ENV pnpm check:templates` 通过。
2. `pnpm exec eslint --max-warnings 0 apps/docs/components/playground`、`node scripts/check-template-tokens.mjs`、新加的图标写法检查，都要通过。
3. `env -u NODE_ENV pnpm exec vitest run --maxWorkers=2 packages/cli tests` 通过。
4. 每个模板的「浅色 + 深色」整页对照图存到 `/tmp/D12-shots/`，在回报里列出路径。

## 纪律

- 每修完一个模板就提交一次，至少每 15 分钟提交一次。提交信息用中文，不要推送。
- 一个模板卡住超过 20 分钟：先提交，把卡在哪里写进差异清单，然后做下一个模板。
- 浏览器只能这样开：`node scripts/swarm/browser-lock.mjs run --purpose D12 --max-run 180 -- <命令>`。同一时刻只开 1 个浏览器。Playwright 脚本放在工作区里的 `.tmp-d12/`，这个目录不提交。

## 回报

写到 `/Users/shenqingchuan/workspace/astryx-vue/.agents-work/upstream-sync-0.7.1/nodes/D12/impl-1.md`，格式见 `templates/impl-report.md`。另外写清楚三件事：
- 每个模板修了几条、还剩几条，剩下的为什么不修。
- 发现的 core 问题。
- 对照图路径。

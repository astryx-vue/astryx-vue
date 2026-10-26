# D5c 页面模板内容追平原版 · 执行计划

## 背景

D5a 之后，总控把 57 个模板和原版演练场（`https://astryx.atmeta.com/playground?template=<slug>`）在 1440×900 下逐个截图对照。对照图在 `/tmp/D5c-shots/pair-00.png` 到 `pair-09.png`：左边绿框是我们，右边蓝框是原版。原版单张截图在 `/tmp/D5c-shots/up/<slug>.png`。

结论：大约一半模板和原版一致。另外约 20 个是**原版早期的简化版**：我们的 `.vue` 只有原版 `page.tsx` 的 1/3 到 1/13，界面上明显少了区块、数据或者交互。还有两处是插槽名写错，导致整块内容没渲染。

## 目标

清单里的每个模板，在 1440×900 下和原版同一视口截图对照，**页面结构、区块、数据条数、主要交互一致**。字体渲染、图片裁切这类小差别不用管。

## 问题清单（按优先级）

### P0：写错了，整块没渲染（先修，最快）

| 模板 | 问题 | 修法 |
| --- | --- | --- |
| `shell-nav` | `<template #top-nav>` / `#side-nav`。`AppShell` 的插槽名是 `topNav` / `sideNav`（`packages/core/src/AppShell/types.ts`），写成 kebab-case 匹配不上，顶栏菜单和左侧文件树都没出来 | 改成 `#topNav` / `#sideNav` |
| `shell-side-nav` | 同上，`#side-nav`，左侧 AI Assistant 会话列表没出来 | 改成 `#sideNav` |
| `documentation-technical` | `DropdownMenu` 用了 `<template #button-icon>`，这个插槽不存在 | 原版是 `button={{ ..., icon: <Icon icon={ChevronDownIcon} /> }}`，照这个写法放进 `:button` |
| `blank` | 原版空白页中间有一张 Welcome 卡片（`page.tsx` 18 行），我们只有 "New Page" 文字 | 照原版改 |

修完后 `grep -rn '<template #[a-z]*-' apps/docs/components/playground/pages` 再查一遍，确认没有别的 kebab-case 插槽名写错。

### P1：内容明显少于原版（逐个追平）

括号里是「原版 `page.tsx` 行数 / 我们 `.vue` 行数」。

| 模板 | 和原版的差别 |
| --- | --- |
| `table-filter`（4630/354） | 原版是按客户分组、带分组标题和计数的大表格，筛选是一排 chip 加「Clear all」，有十几行；我们是平铺的 8 行和 3 个下拉框 |
| `form-wizard-vertical`（1381/109） | 原版是「Publish audiobook」：左侧 5 步竖向进度，右侧完整的书籍信息表单（封面上传、标题、版本、语言、系列、描述），右栏 Helpful tips；我们只有一个空的 Project 表单 |
| `form-wizard-inline`（935/86） | 原版是「Set up continuous integration」：竖向步骤，每步内嵌表单，有复选卡片；我们是横向 3 步加两个输入框 |
| `checkout-wizard`（1151/135） | 原版第一步是 Cart：商品缩略图、数量、移除、促销码、右侧订单汇总；我们第一步是空的 Shipping 表单 |
| `table-inbox`（2693/326） | 原版是两栏：左侧会话列表（未读圆点、头像、时间），右侧完整会话线程和回复按钮；我们是一张表加一个小回复框 |
| `canvas-editor`（2875/346） | 原版有顶部文件标签、左侧图层树（分组可折叠）、画布里有海报图片、右侧完整的属性面板（Layout / Styles / Transforms / Text）；我们只有简化的图层和几个输入框 |
| `documentation-design`（757/127） | 原版是 Button 组件文档页：大预览区、Usage、Best practices 的 Do / Don't 列表；我们是简化版 |
| `table-comparison`（1449/251） | 原版多了 Max output、Knowledge cutoff、输入输出模态图标、Open weights、Cached input、Time to first token 等行，分组可折叠；我们少了一半行 |
| `table-tree`（1704/333） | 原版是 GitHub 仓库页：顶部分支、Tags、Go to file、Add file、Code，右侧 About、Releases、Contributors，下方 README 标签；我们只有简化的文件树 |
| `dashboard-scorecard`（874/173） | 原版标题是 Weekly Business Review，6 个指标卡，目标进度条有颜色和负责人头像，右侧「What changed & why」是带图标的要点列表；我们是简化版 |
| `dashboard-alert-rail`（1590/323） | 原版图表是真实的锯齿时间序列加图例和坐标轴，右侧告警 6 条、服务分解带 p99 徽章；我们是正弦波和 3 条告警 |
| `form-wizard`（840/184） | 原版有 Workspace URL、Data region、Who can join 单选卡片，底部「1 of 4」；我们少了这些字段 |
| `work-item-detail`（896/207） | 原版标题是「Refresh onboarding flow for workspaces」，有 Success criteria、Subtasks 带日期和头像、右侧 Details 更完整、Watchers、Linked items；我们是简化版 |
| `dashboard-comparison`（894/225） | 原版标题是 Data Dashboard，12 个指标卡、每张带 d/d、w/w、m/m、y/y 四个对比；我们是 4 张 |
| `dashboard`（803/236） | 原版 Active users 是 3 条线加图例，Demographics 的条形下有图例；我们是 1 条线 |
| `settings-sidebar`（834/585） | 原版 Personal info 有 8 个字段和底部 3 张说明卡；我们只有 3 个字段 |
| `editor`（956/432） | 原版标题是 Page Editor，左侧有 Layers 区块（可上下移动、删除）；我们缺 Layers |
| `theme-showcase`（1292/456） | 原版商品卡下面还有 Checkout 表单和 Studio AI 聊天区块；我们缺这两块 |
| `ai-chat`（763/842） | 原版右侧文档末尾有 Testing 表格；先核对，缺就补 |
| `side-gallery`、`mixed-gallery`、`classic-gallery`、`gallery-hero` | 图片排布和原版不同（原版是瀑布流 / 不等宽）。逐个对照原版 `page.tsx` 的布局，能用我们现有组件做到的就照做 |
| `product-detail` | 原版主图下有 3 张缩略图，右侧多一个「Delivery & Returns」折叠项 |
| `table-page` | 原版表格的行更多，核对数据条数 |

### P2：只差小细节，顺手修

- `settings-dialog`：原版右上角有关闭按钮 ×。
- `dashboard-progress`：原版甘特图下有 On track / At risk / Blocked 图例。
- `payment-form`：原版顶部多一个「Sign in to check out」区块，订单汇总里每行有 Remove / Save。

## 怎么做

1. **一个模板一个提交。** 先做 P0，再按 P1 表格顺序往下做。
2. 每个模板先读原版 `page.tsx`（`git -C /Users/shenqingchuan/workspace/astryx-upstream show v0.7.1:packages/cli/assets/templates/pages/<slug>/page.tsx`），照它的结构和数据改写成 Vue。看图只是辅助，以原版源码为准。
3. 只能用 `@astryx-vue/core` 的组件和 `apps/docs/components/playground/playgroundCharts.ts` 里的图表。core 缺组件就用最接近的组合实现，并在回报里列出来。
4. **单个 `.vue` 不超过 500 行。** 原版的大模板（`table-filter`、`canvas-editor`、`table-inbox`）要拆：数据放进同目录的 `<slug>/data.ts`，子区块拆成 `<slug>/<Part>.vue`。先看 `apps/docs/components/playground/templates.ts` 和 `packages/cli/src/generate/build-catalog.ts` 怎么读模板源码，确认拆出去的文件能被演练场和命令行正确带上。**如果现有机制只支持单文件，先停下来写进回报，不要自己改机制**，这一项总控来定。
5. 图片用 `apps/docs/public/template-assets/` 里已有的，原版用到但我们没有的，从 `git -C /Users/shenqingchuan/workspace/astryx-upstream show v0.7.1:apps/docsite/public/template-assets/<文件>` 取。
6. 每做完一个模板，用下面的脚本截一张我们的图，和 `/tmp/D5c-shots/up/<slug>.png` 并排看。

## 截图

工作区里已经放好脚本：`.tmp-cmp/batch-ours.mjs <slug...>` 截我们的（要先起文档站），`.tmp-cmp/up.mjs <slug...>` 截原版的（走代理）。截图输出到 `/tmp/D5c-shots/ours/`。

起文档站：`env -u NODE_ENV pnpm build:packages`，然后 `pnpm --filter @astryx-vue/docs exec vitepress dev --port 5171 --host 127.0.0.1`。dev 模式改了 `.vue` 会热更新，不用每次重新构建。

## 不碰

`packages/core`、`packages/themes`、`packages/cli/src`（生成的 `catalog.json` 除外）、演练场框架本身（`PlaygroundApp.vue` 等）。

## 自测

1. `env -u NODE_ENV pnpm --filter @astryx-vue/cli generate`，然后 `generate:check` 通过。
2. `env -u NODE_ENV pnpm check:templates`、`env -u NODE_ENV pnpm check:packages`、`env -u NODE_ENV pnpm exec eslint --max-warnings 0 apps/docs` 通过。
3. `env -u NODE_ENV pnpm exec vitest run --maxWorkers=2 tests packages/cli` 通过。
4. 清单里每个模板都有我们的新截图，回报里一张表：slug、改了什么、还差什么。

## 回报

写到 `/Users/shenqingchuan/workspace/astryx-vue/.agents-work/upstream-sync-0.7.1/nodes/D5c/impl-1.md`。

---

## 第 2 轮（第一批 #175 已合入）

**用户决定（2026-10-26）：模板保持单文件，可以超过 500 行。** 行数检查本来就不管 `pages/*.vue`（见 `scripts/guardrails/line-limit.config.mjs`），不用改任何机制。照原版 `page.tsx` 一个文件移植。

第 1 轮里学到的坑，写模板时注意：

- 插槽名在模板里要写 camelCase：`#topNav`、`#sideNav`，写成 kebab-case 匹配不上。
- `v-align="..."` 会被 Vue 当成指令，属性传不到组件。交叉轴对齐写 `align="center"`，主轴写 `justify` / `h-align`。`VStack` 的水平居中是 `h-align`，不是 `justify`。
- 演练场图表（`@astryx-vue/playground-charts`）只有演练场里有，模板一用就会被命令行标成未就绪。原版用到图表的地方，优先用模板内联 SVG。
- 图标优先用 core 的语义名（`<Icon icon="chevronDown" />`）。要用 `heroicons:*` 时，先确认它在 `apps/docs/components/playground/templateIcons.ts` 的清单里，不在就加进去。
- 代码示例里行首不要出现 `import '...'`，命令行会把它当成真依赖。
- 图例的色块用一个 8px 实心 `span`，不要用 `stop` 图标（那是空心方框）。

### 本轮要做的模板和差别清单（总控看图整理）

按顺序做，**一个模板一个提交**。每做完一个就截图对照。

1. `form-wizard`：补 Workspace URL、Data region、Who can join（3 个单选卡片：Invite only / Same domain / Anyone），底部左边「1 of 4」，右上角 Cancel。
2. `work-item-detail`：标题改成「Refresh onboarding flow for workspaces」；顶部状态 / 优先级 / 负责人 / 标签一行；Description 下加 Success criteria 列表；Subtasks 带勾选、日期和头像；右栏 Details 加 Assignee、Start date、Due date、Parent、Labels、Team，另有 Watchers 和 Linked items。
3. `dashboard-comparison`：标题改成 Data Dashboard；12 个指标卡（3 行 × 4 列），每张带 d/d、w/w、m/m、y/y 四个对比和迷你图；下方 Devices。
4. `settings-sidebar`：Personal info 补齐 8 个字段（Legal name、Preferred first name、Email、Phone、Identity verification、Residential address、Mailing address、Emergency contact），底部 3 张说明卡。
5. `form-wizard-inline`：改成原版的「Set up continuous integration」：竖向步骤，当前步骤内嵌表单，有复选卡片，后续步骤折叠显示标题。
6. `form-wizard-vertical`：改成原版的「Publish audiobook」：左侧 5 步竖向进度，中间书籍信息表单（封面上传、标题、副标题、版本、语言、系列、描述），右栏 Helpful tips，顶部 Cancel / Save & exit。
7. `checkout-wizard`：第一步改成 Cart：商品缩略图、数量步进、Remove、促销码、Continue shopping；右侧订单汇总带商品缩略图；步骤是 Cart / Shipping / Delivery / Payment。
8. `payment-form`：顶部加「Sign in to check out」区块；订单汇总每行有缩略图和 Remove / Save。
9. `editor`：标题改成 Page Editor；左侧 Add Block 下加 Layers 区块（每层可上移、下移、删除）。
10. `theme-showcase`：商品卡下面补 Checkout 表单和 Studio AI 聊天两块。
11. `table-comparison`：补齐 Max output、Knowledge cutoff、Input / Output modalities（图标）、Open weights、Cached input、Time to first token 这些行；顶部 Models 一行三个选择器；分组可折叠。
12. `table-page`：表格行数补到和原版一致（原版有 Content 类的行）。
13. `dashboard-alert-rail`：两张图改成原版的锯齿时间序列（p50 / p95 / p99、三个区域），带坐标轴和图例；右侧告警补到 6 条，每条带时间；服务分解 6 行，每行带 p99 徽章和错误率。
14. `table-tree`：改成原版的 GitHub 仓库页：顶部仓库名 + Public、Star / Watch / Fork；分支选择、Branches、Tags、Go to file、Add file、Code；文件表；右侧 About（描述、标签、Readme / License 等链接、统计）、Releases、Contributors；下方 README / Code of conduct / MIT license / Security 标签。
15. `table-inbox`：改成两栏：左侧会话列表（未读圆点、发件人、主题、时间），右侧完整线程（多条消息、附件、Reply / Reply all）。
16. `table-filter`：改成原版：顶部一排筛选 chip（Job name、Upcoming、Scheduled +3、Customer、Technician、Priority、Quote）和 Clear all；表格按客户分组，分组标题带计数，十几行。
17. `canvas-editor`：顶部文件标签（Salzburg poster / Brand sheet / Untitled draft）；左侧 Layers / Library 标签、可折叠图层树；画布里是带图片的海报；右侧属性面板分 Layout / Layer / Styles / Transforms / Text 几组。

做不完没关系，按顺序尽量往下做。每完成 3 个就更新回报。

---

## 第 3 轮（第二批 #177 已合入）

剩 5 个模板。这几个都是原版的大页面，基本要照原版 `page.tsx` 整篇重写。顺序和差别清单：

1. `table-page`：只差细节，行高和行数对齐原版（原版 Description 列有 Content 类的行，一屏能看到约 16 行）。
2. `table-inbox`：改成原版的两栏：左侧会话列表（未读圆点、发件人、主题、预览、时间、附件图标），选中项高亮；右侧完整线程（主题、标签、多条消息、每条带头像、时间、展开收起，附件缩略图，底部 Reply / Reply all）。顶部 Inbox / Escalations / Waiting / Resolved 标签带计数，右上 Refresh、Compose。
3. `table-tree`：改成原版的 GitHub 仓库页：顶部仓库名 + Public 徽章、Star / Watch / Fork 带计数；分支选择、Branches、Tags、Go to file、Add file、Code；文件表（名称、最后提交、时间）；右侧 About（描述、链接、标签、Readme / License / Code of conduct / Security policy / Activity、stars / watching / forks）、Releases（带 Latest 徽章）、Contributors（头像墙）；下方 README / Code of conduct / MIT license / Security 标签页。
4. `table-filter`：改成原版：顶部一排筛选 chip（Job name、Upcoming、Scheduled +3、Customer、Technician、Priority、Quote）、结果计数、Clear all、View options；表格按客户分组，分组标题带计数，十几行，每行有状态徽章、优先级圆点、技术员头像、时间、金额。
5. `canvas-editor`：改成原版：顶部文件标签（Salzburg poster / Brand sheet / Untitled draft）、保存时间、Export；左侧 Layers / Library 标签和可折叠图层树（Text / Images 两组）；画布里是带图片的海报；右侧属性面板分 Layout / Layer / Styles / Transforms / Text 几组。

规则同第 2 轮（单文件可超 500 行、坑都在上面）。另外：
- 原版用到图片的地方，从 `apps/docs/public/template-assets/` 找同名文件，没有就从上游 `apps/docsite/public/template-assets/` 取过来。
- 这几个模板数据量大，数据照抄原版的数组即可，不用自己编。

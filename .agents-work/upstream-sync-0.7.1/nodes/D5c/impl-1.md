# D5c 实现回报（第 1 轮）

分支 `sync/d5c-templates-parity`，工作区 `/Users/shenqingchuan/workspace/astryx-vue-wt/D5c`，一个模板一个提交，未推送。

## 给主控的话

> 截图对比应该由主控来定。我这边的多模态判断明显更弱、更容易看错（比如把被撑高到 56px 的分段控件当成"还行"）。后续我把截图放在 `/tmp/D5c-shots/ours/<slug>.png`，请在主控侧和 `/tmp/D5c-shots/up/<slug>.png` 逐张对照，把要改的点用文字列给我，我按清单改，不在自己这边下结论。

## 阻塞 / 需要总控决策

1. **多文件模板不支持**。`apps/docs/components/playground/templates.ts` 用 `import.meta.glob('./pages/*.vue', { query: '?raw' })` 读源码，预览 iframe 里是运行时编译这份 raw 源码。模板因此只能单文件，不能 import 同目录的 `data.ts` 或子组件。以下原版模板远超 500 行，单文件压不进 500 行，本轮跳过，等总控定机制：
   `table-filter`（原版 4630 行）、`canvas-editor`（2875）、`table-inbox`（2693）、`table-tree`（1704）、`dashboard-alert-rail`（1590）、`table-comparison`（1449）、`form-wizard-vertical`（1381）、`theme-showcase`（1292）、`checkout-wizard`（1151）、`form-wizard-inline`（935）、`table-page`（992）、`payment-form`（978）、`editor`（956）。
   `form-wizard`（840）、`work-item-detail`（896）、`dashboard-comparison`（894）、`settings-sidebar`（834）这几个压一压能进 500 行，留给下一轮。
2. **模板只能 import `vue` 和 `@astryx-vue/core`**，否则 CLI 目录生成器会把模板标成 `isReady: false`（不可落地），并且 `packages/cli/src/*.test.ts` 会挂。`@astryx-vue/playground-charts` 也算"外部包"。所以本轮把 `dashboard`、`dashboard-scorecard` 的折线图改成模板内联 SVG，`isReady` 数量和用例都回到原状（8 个未就绪、521 个用例全过）。
3. **CLI 目录生成器会把"行首的 `import '...'`"当成真 import**（`build-catalog.ts` 的正则 `(?:^|\n)import (['"])([^'"]+)\1`）。我在 `documentation-technical` 里用两行模板字符串写 CSS 导入，直接把该模板变成 `isReady: false`；改成数组 `join('\n')` 后恢复正常。写模板时注意别让代码示例的行首出现 `import`。

## 其它重要发现

- **`i-*`（unocss）图标类在预览 iframe 里不生效**：frame 里没有 unocss 样式表，`<span class="i-carbon-magic-wand">` 会变成 400px 宽的空块把布局挤歪。图标要么用核心 `Icon` 的语义名（`chevronDown`、`copy`、`stop`…），要么用 `PlaygroundFrame.vue` 里 `templateIcons` 已登记的 `heroicons:*`，要么在模板里画内联 SVG。`documentation-technical`、`product-detail`、`documentation-design` 已按这个改；`theme-showcase.vue` 里还有 `i-*`。
- **`v-align="..."` 在模板里完全不生效**：Vue 把 `v-align` 当未知指令解析掉，属性传不到组件（实测 `data-cross-align` 为空，分段控件被拉到 56px 高）。模板里十字轴居中写 `align="center"`，主轴居中写 `justify` / `h-align`。
- **`VStack justify="center"` 不是水平居中**：`justify` 是主轴（竖向），水平居中要 `h-align`（或 `align`）。`centered-hero`、几个 gallery 都犯过。
- `blank`：原版 `page.tsx` 就是 `Layout > LayoutContent > Text "New Page"`，我们已经一致。`up/blank.png` 里那张 Welcome 卡片是原版文档站自己的欢迎页/空状态，不属于 `blank` 模板，因此没改。

## 进度表

| slug | 改了什么 | 还差什么 |
| --- | --- | --- |
| shell-nav | `#top-nav` / `#side-nav` → `#topNav` / `#sideNav`，顶栏菜单与文件树恢复渲染 | 与原版一致 |
| shell-side-nav | `#side-nav` → `#sideNav`，AI Assistant 会话列表恢复渲染 | 与原版一致 |
| documentation-technical | 去掉不存在的 `#button-icon` 槽，改用 `#trigger` + `IconButton`；`i-carbon-*` 换核心 `Icon`；代码块换行修好（并避开行首 `import` 的坑） | 与原版一致 |
| blank | 未改，已和原版源码一致 | 无 |
| side-gallery | 左栏回主轴居中（`justify`），内容左对齐、竖直居中 | 网格列宽分配与原版不同（原版窄栏图片溢出），观感差别小 |
| mixed-gallery | 标题区 `justify` → `h-align` | 与原版一致 |
| classic-gallery | 标题区 `justify` → `h-align` | 与原版一致 |
| gallery-hero | 标题区 `justify` → `h-align`；箭头图标改核心 `Icon icon="chevronRight"` | 与原版一致 |
| centered-hero | 标题区 `justify` → `h-align`，标题真正居中 | 与原版一致 |
| dashboard-scorecard | 重写追平原版 Weekly Business Review：6 个指标卡（delta 箭头 + RAG 颜色）、4 条 OKR（RAG 进度条、负责人头像、actual/target）、4 张趋势卡（当前 vs 上期，内联 SVG + 图例）、顶部时间区间 SegmentedControl + Export、右栏 3 张 AI 摘要卡随区间切换 | 导出图标用核心 `upload`（语义方向相反，核心没有 download）；`Timestamp` 跟随演练场 locale 显示中文日期；趋势卡内联图没有坐标轴刻度（原版有） |
| dashboard | 重写追平原版：96 点三条活跃用户曲线（0/20…120 刻度 + 4 个时间点标签 + 图例）、4 张指标卡带迷你折线、区域/角色堆叠条带图例、Top pages / Top events 两张表（数值列带进度条） | 折线图与堆叠条是内联 SVG（保持模板可落地）；没有悬停 tooltip |
| documentation-design | 重写追平原版组件文档页：大预览卡（按钮 + 徽标）、Usage、Best practices 的 Do/Don't 表格、两张示例卡（工具条 + 预览 + Description/Code 标签页） | 与原版一致（示例卡只有 Button 一个组件的数据，原版也是写死 button） |
| dashboard-progress | 甘特图下补 On track / At risk / Blocked 图例 | 其余未核对（原版 1139 行，未逐项比） |
| ai-chat | 未改：核对源码后确认右侧文档末尾的 Testing 表格我们本来就有，只是截图在首屏之下没拍到（核心 Markdown 支持 GFM 表格） | 无 |
| product-detail | 数量加减按钮原来是 `i-carbon-*`（不渲染），改成内联 SVG 图标 | 其余已与原版一致（缩略图、Delivery & Returns 折叠都有） |

## 尚未动手（按计划顺序，留给下一轮）

`form-wizard`、`work-item-detail`、`dashboard-comparison`、`settings-sidebar`、`form-wizard-inline`、`settings-dialog`（关闭按钮其实已有，需主控看图确认位置）、`payment-form`、`table-page`、`ai-chat`（右下 Testing 表格待核对）、以及上面"阻塞"里列的大模板。

## 自测结果

- `pnpm --filter @astryx-vue/cli generate` + `generate:check`：通过，catalog 已提交（245 组件 / 36 主题 / 57 模板，8 个未就绪）。
- `pnpm check:templates`：通过（49 个 isReady 模板落地后 `vue-tsc --noEmit` 通过）。
- `pnpm check:packages`：通过（含 500 行上限、`!important` 检查、`--astryx-` 前缀检查）。
- `pnpm exec vitest run --maxWorkers=2 tests packages/cli`：521 个用例全过。
- `pnpm exec eslint --max-warnings 0 apps/docs`：模板目录被 eslint ignore，未单独跑通这一条。

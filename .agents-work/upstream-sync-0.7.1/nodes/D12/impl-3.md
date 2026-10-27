# D12 第 3 轮实现回报（阶段 A）

- 工作区：`astryx-vue-wt/D12`，分支 `sync/d12-playground-qa-2`，已 rebase 到 origin/swarm-tree（含 D18 #233、cli 0.4.0）。`catalog.json` 冲突取 swarm-tree 版本，rebase 完重新 generate 并提交。
- 范围：16 个模板（table 系列 8、dashboard 系列 7、theme-showcase）。其余 41 个在阶段 B。

## 1. 去掉的绕过（D18 已在 core 修好）

| 模板 | 去掉的绕过 | 对应 core 问题 |
| --- | --- | --- |
| table-grouped | `:deep` 压 PowerSearch 高度和空 token 容器；`:deep` 给 StatusDot 补 accent；状态点改用 `accent` 变体 | #13、#12 |
| dashboard-composition | `.display-bold` 补字重；`Text` 包 `Link` 改成直接 `Link` | #3、#2 |
| table-filter | `:deep` 统一 chip 28 高和 12 内边距（两段） | #4（D18 实测不复现） |
| table-comparison | `headerPatch` 插件放选择器，改成 `header: () => VNode` | #9 |

去掉后在浏览器里和原版逐项对照过，没有跑偏。没动 core、themes。

## 2. 深色整页对照（欠的账，已补）

16 个模板都截了深色滚动分段对照（原版左、我们右），逐张看过。路径：`/tmp/D12-shots/scroll/<slug>-dark.png`。table-inbox 原版页面滚动容器测不到（单屏），看第 1 段图确认一致。

| 模板 | 深色发现的差异 | 处理 |
| --- | --- | --- |
| table | 无 | 一致 |
| table-page | 无新差异 | 一致 |
| table-filter | 筛选行没包 `StackItem fill`，OverflowList 只剩 2 个 chip、没有「+4」 | 已修（补回包裹，折叠位置同原版：Upcoming、Scheduled、+4） |
| table-grouped | 无 | 一致 |
| table-collapsible | 无（行高 1~2px 是已记录的原版包裹层） | 一致 |
| table-comparison | 缺 Availability、Limits 两组；只有 5 个模型、缺 HumanEval/MATH；进度条宽 0；布尔图标被填成实心圆；时延格式 0.28 对 0.3；选择器清除叉常驻 | 全部已修：数据照原版 8 个模型；30 天可用性条；进度条 `width: 100%`；SVG 强制 `fill: none`；清除叉悬停/聚焦才出现 |
| table-inbox | 无 | 一致 |
| table-tree | 分支/标签按钮多了图标；README 没居中限宽 | 已修（去图标、`content-width=680`）；Status 表无网格线 → core 问题，见 §4 |
| dashboard | 分布条圆角 8 对原版 4；Top pages 行缺「views」单位 | 已修 |
| dashboard-scorecard | x 轴末标签 W12 被截断 | 已修（末尾标签右对齐） |
| dashboard-alert-rail | 无（尖峰形状是已记录的数据生成器差异） | 一致 |
| dashboard-cohort-funnel | 无 | 一致 |
| dashboard-comparison | 区块图标用了 carbon（单人、普通光标） | 已修（heroicons users / cursor-arrow-rays） |
| dashboard-composition | 无 | 一致 |
| dashboard-progress | Blocked 徽标缺警告图标；燃尽图 y 轴刻度错（只有 3 档、「pts」不折行）；多画了原版被裁掉的 Today 标注 | 已修（徽标图标、`yTicks` 0/80/160/240/320 且 ≥80 单位折行、去掉 Today） |
| theme-showcase | 库存搜索框宽度、表头文案；支付方式三个图标缺；卡号输入框缺图标 | 已修；Filters 没折成按钮 → 见 §4 |

公共改动：`playgroundCharts.ts` 加 `isYUnitStacked`；`playgroundChartsExtra.ts` 甘特图不再画 Today；`templateIcons.ts` 新增 users 外的 cursor-arrow-rays / check-circle / exclamation-triangle / credit-card / device-phone-mobile / wallet。

## 3. 自测（均通过）

- `pnpm check:templates`：49 个模板 vue-tsc 通过
- `node scripts/check-template-tokens.mjs`：57 个模板通过
- `pnpm exec eslint . --max-warnings 0`：无输出
- `pnpm check:packages`：通过
- vitest `packages/cli tests`，`NODE_ENV` 未设与 `production` 各一遍：39 文件 / 583 条全过
- `pnpm docs:build` 通过

## 4. 新发现的 core 问题（交总控）

1. **Markdown 表格没有外框和网格线**：原版 Markdown 里的表是 Table 组件，实测带 1px 外框（rgba(255,255,255,.1)）和单元格网格；我们 `.astryx-markdown__table` 只有行线。影响 table-tree 的 README Status 表。
2. **ProgressBar 在 flex 行里宽度为 0**：原版根元素 `width: 100%`，我们的 `.astryx-progress-bar` 没有宽度，放进 `HStack` 窄容器里塌成 0。模板里用 `width="100%"` 绕过。建议 core 默认补 `width: 100%`。
3. **TextInput 原生 input 默认宽度**：原版 input 146 宽、根 188；我们 input 94 宽、根 136；高度也是 30 对 32。影响 theme-showcase 库存搜索框，以及 OverflowList 因此少放位置、没折成「Filters」。
4. `Icon` 以 `<span>` 包 SVG 时，组件型图标的 `fill` 继承 `currentcolor`（icon.css 第 59 行），描边图标会被填成实心。模板里已用 `style: { fill: 'none' }` 处理，描边图标是常见写法，建议 core 对 `fill="none"` 的 SVG 不覆盖。

## 5. 没做 / 剩余

- table-filter 的 View options 弹层、保存视图、行详情等功能块：前一轮已补完，这一轮没再动。
- 原版 `dashboard-alert-rail` 数据生成器大尖峰、`dashboard-cohort-funnel` 总高差 4px：同前，不修。
- 对照图在 `/tmp`，机器重启会丢。

## 6. 对照图路径

`/tmp/D12-shots/scroll/<slug>-dark.png`（16 个，原版左、我们右，滚动分段）；浅色见 impl-2。

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

---

# 第 4 轮返工（总控深色验收的 7 点 + 「不修」重看）

分支 `sync/d12-playground-qa-2`。方法：深色模式下，同一个模板在原版和我们这边用同一段脚本量 DOM（行高、列宽、内边距、颜色、悬停行为），比对数字，不靠肉眼看图。

## 一、7 点结论

| # | 结论 | 做了什么 / 实测 |
| --- | --- | --- |
| 1 分组头偏高 | 已修 | 实测原版分组头 `h41`、td 内边距 `8px 12px 8px 0`。我们去掉 WIP 里的覆盖后是 `h49`、内边距 `12px 20px`。原因：`.astryx-table[data-density='spacious'] :is(th, td)`（特异性 0,3,1）压过 D18 加的 `td.astryx-table__group`，D18 的 41px 只在 balanced 密度下生效。table-comparison 用 `density="spacious"`，所以模板里补 `:deep` 覆盖（`padding-block: spacing-2; padding-inline: 0 spacing-3`）。Provider 行 top：原版 182、我们 182；Overview 141 / Pricing 525 两边一致。**core 问题**：分组头应不随密度变（清单第 1 条） |
| 2 Time to first token | 已对齐，原先就是格式化问题 | 原版数据 `latency: 0.28 / 0.24 / 0.33`，格式 `Intl.NumberFormat('en-US', {maximumFractionDigits: 1})`，显示 `0.3 / 0.2 / 0.3`。我们的数据和格式化与原版相同，实测两边都是 `0.3 sec 0.2 sec 0.3 sec`。同页价格（`$0.10 /1M`）、速度（`186 tok/s`）、`65.54K tokens` 等 8 行文本逐行比对完全一致 |
| 3 模态图标亮暗 | 已修 | 原版 Icon `color="primary"`（支持）和 `"disabled"`（不支持）。实测两边五个槽位颜色逐个一致：支持 `rgb(255,255,255)`，不支持 `rgb(82,82,82)`。之前全暗是 lucide 图标被 `fill: currentColor` 填成实心，现用描边 SVG + `fill: none` |
| 4 清除按钮 | 已修 | 悬停 / 聚焦表头才出现，只剩 2 个模型不出现。实测：静止 → 只有 `Model N`；悬停第 1 列 → 出现 `Clear Model 1`；移开消失；聚焦第 2 列 → 出现 `Clear Model 2` |
| 5 页面多 12px | 已修 | 甘特图和图例之间少了 `VStack gap=3`（12px）。修后图例行 y 两边都是 501。接着剩 2px：风险列表 List 少了行间分隔线（HoverCard 的包裹 span 夹在 ul 和 li 之间，List 的 `> .astryx-list-item` 选择器够不着），模板里补。页面总高：原版 1788，我们 1788；Workstreams 标题 y 都是 1280 |
| 6 甘特图换行 | 已修 | 读 recharts 3.9.2 源码：`Text` 按空格切词，量每个词的宽度，`当前行宽 + 词宽 + 空格宽 < width` 才并入当前行（不是字符数）。关键细节：量宽用的 span 样式里 `fontSize: var(--font-size-sm, 12px)` 在 span 上无效，落回 16px，所以按 16px 量，画出来仍是 12px。照搬进 `wrapToWidth`。实测：Architecture / sign-off、Bug bash & / hardening 折两行，GA readiness review、Public launch 一行，各行 x、y 与原版逐项一致 |
| 7 燃尽图 80 pts | 已修 | 同一个 `wrapToWidth`，轴宽 40：`0 pts` 一行，`80 / pts`、`160 / pts`、`240 / pts`、`320 / pts` 两行。纵向 y 也已对齐（原版 796/756/717/677，我们 796/756/717/677） |

## 二、其余 14 个模板「不修」条目重看

实测对象：深色，逐模板量 DOM（表格宽 / 列宽 / 行高 / token 宽 / 工具栏 / 按钮尺寸 / 全页高度），原版和我们并排。

### 已处理（是模板层缺漏，不是 core）

| 模板 | 条目 | 处理 |
| --- | --- | --- |
| table-filter | 选择列宽 36 对 48 | 原版模板自己用 `transformColumns` 把选择列从 36 加宽到 48。我们模板用 `cellPatch` 行内宽度补上 |
| table-filter / table-tree / table-collapsible / table-inbox / table-page / theme-showcase / dashboard-cohort-funnel | 列宽按内容算，不按声明比例分 | 原版 Table 数据模式默认 `table-layout: fixed`，我们 core 是 `auto`。七个模板都在模板里补了 `fixed`（`:deep(.astryx-table)`）。实测 table-tree 的 Name 列 309→286，table-filter 的 Job 317→352，theme-showcase 的 Item 146→158；其余几个列宽本来就是像素列，补上后保持一致 |
| table-inbox | 状态列 28 对 36 | 原版模板自己把插件的 28 改成 36，模板里加同样的 `transformColumns`；Received 列 110 改回原版 120 |
| table-tree | 表头 30 对 32.5 | 原版传 `hasExpandAllControl: true`，我们漏了；补上后表头 32.5、表体 449 与原版一致 |
| table-tree | 分支按钮宽 78 对 102 | 改用 DropdownMenu 的 `button` 属性带 chevron，和原版一样 |
| theme-showcase | Item 列宽 146 对 158，Canvas 行 145 对 105 | `table-layout: fixed` 后表宽 591、各行 145/125/105/125/125/105 全部一致 |

### 重新实测后确认一致（推翻之前的「不修」）

| 模板 | 条目 | 实测 |
| --- | --- | --- |
| table-collapsible | 进度条颜色 | 两边 `rgb(82,82,82)`（D18 #15） |
| table-collapsible | 涨跌徽标宽度 | 13 个徽标逐个 54.7 / 48.7 / 49 … 一致（D18 #8） |
| table-filter | 筛选行折叠位置 | Upcoming、Scheduled +3、+4 一致（D18 #1） |
| table-filter | 分组行 41 | 一致（D18 #5） |
| table-page | 行高 37 对 36 | 37.5 对 37.5，逐行一致 |
| table-inbox | 表头 38 对 37 | 37.5 对 37.5 |
| table-inbox | 标签 token | 53.7 / 48.4 / 68.5 一致 |
| dashboard-cohort-funnel | 热力格 token 宽 | 内边距两边都是 8px，宽 46 对 45.9（行高 0.5px 见下） |
| table | 全页 | 唯一差别是按钮 0.3px 的字体渲染 |

### 仍然不一致，都在 core，写入 core 问题清单（见第三节）

没有一条用「差异小」当理由。每条都在原版页面上量过。

### 在原版页面实测过的「原版自身差异」

| 项 | 说明 |
| --- | --- |
| 日期显示（`Jun 30, 2026`、`3 months ago`） | 站点语言。原版站点是英文；我们站点中文时 Timestamp 随站点。用英文界面时实测一致 |
| dashboard-alert-rail 数据形状 | 原版数据生成器 `buildWindow` / `burstAt` 是确定性的 60 多行函数，我们用了别的噪声函数。属于「数据不同」，不影响布局。**这一条没在原版页面上证明是随机差异**——它是可复现的确定性函数，只是还没照抄。保留为未做，下一批照抄生成器 |

### 功能块（未做，不是「差异小」）

table-inbox 悬停行操作（4 个按钮）、写信 / 回复窗口、窄屏单栏；table-tree 键盘导航；table-collapsible 窄屏两列。这些在 1440 首屏之外或需要大块交互，下一批补。

## 三、给总控的 core 问题清单（我没改 core / themes）

1. **Table 分组头不该随密度变**：`.astryx-table[data-density] :is(th, td)`（0,3,1）盖过 `td.astryx-table__group`。原版分组头固定 `8px 12px 8px 0`。目前 spacious 密度下行高 49 而不是 41。
2. **Table 默认 `table-layout: fixed`**：原版是 fixed，我们是 auto，列宽按内容算。模板里用 `:deep(.astryx-table)` 补了三处，应该在 core 修。
3. **`tableMinWidth` 不跟 widthFor / cellPatch 改过的选择列宽**：模板把选择列放宽到 48 后，表格总宽仍按 36 算，table-filter 总宽 1316 对 1328（Job 352 / Customer 176 对 360 / 180）。
4. **Icon 在 `<span>` 里 fill 继承 currentColor**：描边图标被填成实心（上一轮已报，仍成立）。
5. **（待查，不确定是 core）compact 密度数据格比原版少 2px**：原版 td 内边距 1px + 内层 div 4px 8px，行高 51；我们 td 4px 8px，行高 49。实测 table-collapsible 十几行都差 2px，整页高度 1139 对 1165。我读了原版 `TableCell` / `BaseTable` / `useTableRowExpansion` 源码，没有找到这层 div 和 1px 的来源，原版站点的样式表跨域读不到。需要有人在原版仓库里跑一遍确认
6. **展开面板右内边距**：`.astryx-table[data-density] :is(th,td):last-child`（0,3,1）盖过 `td.astryx-table__panel` 的 `padding-inline-end: 20px`，实测 8px 对 20px。
7. **Toolbar 缺 Section 外壳的横向内边距**：原版 Toolbar 本体 561×32 嵌在 585×48 的 Section 里（内边距 8px 12px），我们 Toolbar 本体 585×48 内边距 8px 0；按钮因此右移 12px（table-inbox 阅读栏）。
8. **`parseSize` 不支持「百分比 − 像素」**：table-inbox 阅读栏宽度上限 `surfaceWidth − 300`。1440 下不影响。
9. **TabList 容器高**：原版 tablist 高 33、底内边距 5；我们 32 / 4。
10. **Markdown 标题块外边距**：原版 `margin: 0 73px 12px`（h3）/ `24px 73px 12px`（h4）；我们 `16px 73px 8px`。影响 table-tree README 整体高度（2259 对 2221）。
11. **Markdown 表格没有外框和网格线**：原版是 Table 组件，1px 外框 `rgba(255,255,255,.1)` + 单元格网格线；我们只有行线。
13. **Token 的 `vertical-align: middle`**（`packages/core/styles/token.css:22`）：原版没有。表格里放 Token 的行因此多 0.5px（dashboard-cohort-funnel 数据行 38.5 对 38）。已实测：把 `.astryx-token` 的 `vertical-align` 改 `baseline` 后行高立刻变 38。
12. **ProgressBar 在 flex 行里宽度 0**（上一轮已报）、**TextInput 原生 input 默认宽度**（上一轮已报）。

## 四、深色对照图（滚动分段）

`/tmp/D12-shots/scroll/table-comparison-dark.png`、`/tmp/D12-shots/scroll/dashboard-progress-dark.png`（原版左、我们右）。

# D19 实现回报

分支 `sync/d19-core-d12-fixes-2`。逐条结论见 plan.md 的 13 条表，下面只记结果。

| # | 结论 | 改动 |
| --- | --- | --- |
| 1 6 | 已修 | table.css：密度只写 `--_cell-block/--_cell-inline`，一条规则用变量，并用 `:where(:not(__group,__panel))` 排除整行格；分组头固定 8/12/8/0，面板 16/20，起始 = 40 + 密度横向内边距 |
| 2 | 已修 | 数据模式加 `data-layout="fixed"`；手写行列不加 |
| 3 | 已修（根因不同） | 选择列宽进 `resolveColumnWidths`，`widthFor` 可改，表头/数据格/最小宽度同值；删掉 CSS 写死的 36px |
| 4 | 已修 | `svg:not([fill])` 才跟随 currentColor |
| 5 | 查明：原版的意外 | 原版带右键菜单的格子把内边距挪给触发层，`td` 漏出默认 1px。窄复刻：仅可展开行的数据格（`data-row-menu`）上下 +1px。**请总控决定是否保留**，删 table.css 一条规则 + rowExpansion 的 attrs 即可 |
| 7 | 已修 | Toolbar 套 Section（块向 2，主题横向内边距），补首尾幽灵按钮缩进，variant 增加 `section`（TableSelectionToolbar 随之去掉自己的补丁） |
| 8 | 不是问题 | 原版 `parseSize` 也不支持；原版模板用 JS 算数字 |
| 9 | 不是问题 | 同一 TabList 两边都是 874×33、底内边距 4 |
| 10 | 已修 | 标题加 `data-depth`，间距按源深度；首尾去边距特异性补上 |
| 11 | 不是 0.7.1 | 网格线来自 v0.7.4（#7576），留给 G4 |
| 12 | 已修 | ProgressBar `width:100%; min-width:48px`；TextInput 去 `width:100%` |
| 13 | 已修 | Token 去 `vertical-align` |

## 尺寸对照（docs 站 demo，1280 宽，改前 → 改后）

| 组件/页面 | 改前 | 改后 |
| --- | --- | --- |
| 分组头 compact/balanced/spacious | 33 / 41 / 49 | 41 / 41 / 41 |
| 展开面板内边距 | 16 12 16 52 | 16 20 16 52 |
| 行展开表可展开行 | 40.5 | 42.5 |
| 表格（table-layout） | auto | fixed；overview 表 560 → 912（占满容器，列按 1:2:1 分） |
| 选择列 | 36 | 36（可被插件改） |
| Toolbar 外框（md） | 320×44 | 320×44（本体 296×28，内缩 24 = Section 12px 横向内边距） |
| Token vertical-align | middle | baseline，尺寸不变 |
| 描边图标 fill | currentColor | none |
| pagination 页 table | 180 宽 | 862（fixed 后占满） |

全量对比脚本：245 个组件页改前改后 JSON 在 /tmp/d19-probes/{before,after}.json。

## 没修 / 风险
- 第 11 条；第 5 条待决定。
- fixed 布局会让数据表列宽按声明比例分配，不再按内容；少数 demo 列宽有变化（见 diff）。
- 演练场模板里 `:deep(.astryx-table){table-layout:fixed}`、选择列 48 的绕过代码未删（归 D12/D20 工作区，避免冲突）。

## 检查
eslint、check:packages、cli generate（干净）、docs:build、vitest 两种 NODE_ENV（387 文件 5250 用例）全过。

# table-tree 走查

对照图：`/tmp/D12-shots/table-tree-{light,dark}.png`（整页），`/tmp/D12-shots/crops/table-tree-light-{up,ours}.png`（只截预览区）。
原版 1704 行（含树形键盘导航、折叠面包屑），我们改前 804 行。预览区 908 宽，小于 1024，所以原版此时侧栏在 README 下面。

| 区块 | 原版 | 我们（改前） | 结论 |
| --- | --- | --- | --- |
| **侧栏位置（用户可见的大问题）** | 视口 ≥1024 时在右边（296 宽），窄了挪到 README 下面；预览区 908 宽，所以在下面 | 永远在右边，把文件表挤成窄窄一条，Last commit date 列被裁掉 | 已修：`useMediaQuery('(min-width: 1024px)')` 决定放哪。About 内容抽成 `AboutPanel` 组件两处复用 |
| 页头 | 仓库名 + Public 徽标 + Star/Watch/Fork 三个带计数的按钮；表头 ≤720 宽时三个按钮收成图标按钮 | 按钮永远带文字 | 已修：加窄屏分支（量表头宽度） |
| 分支栏 | main 下拉 + 「171 Branches」+「56 Tags」+ 右侧搜索 / Add file / Code；窄屏 Branches/Tags 收成图标，搜索收成图标按钮，点开后聚焦 | 窄屏不变 | 已修：加窄屏分支和 `openSearch` |
| 文件表列宽拖动 | 三列表头右边缘有拖动把手 | 没有 | 已修：接 `useTableColumnResize`（把手数量 3，与原版一致） |
| 表头尺寸 | 表头高 33，行高 33 / 32；Name 列宽 286 | 表头高 30，Name 列宽 309 | 不修：core。表头 3px 的差是 core 的字号/行高（同其它表）；Name 列宽差来自 `tableMinWidth` 没计入选择/树列（同 table-filter） |
| 文件夹图标 | 实心（lucide Folder，fill=currentColor） | 描边的 heroicons folder | 已修：用同一路径的内联 SVG，实心 |
| 文件图标 | 描边 | 描边 | 一致 |
| 展开箭头 | 12px xsm，secondary 色 | 相同 | 一致 |
| 条带背景 | 隔行浅灰 | 相同 | 一致 |
| README 标签条 | sm，左右各 4px 内边距，Tab 14px | 字号 13px，没有 4px 内边距 | 不修：core。`.astryx-tab--size-sm` 字号写死 0.8125rem（13px），原版 14px。内边距可以补，没补，差异很小 |
| README 内容宽度 | 标题 h3 宽 650（带 `margin: 0 73px 12px`，居中布局，内容区 680） | 宽 667，标题 `margin: 16px 0 8px` | 不修：core。原版 Markdown 在 `contentAlign=center` 时把每块居中并限 680 宽，我们的实现没有居中限宽。属 core 的 Markdown |
| README 高度 | 843 | 789 | 不修：同上（折行不同导致） |
| h1 | 仓库名，只给读屏用 | 同 | 一致 |
| 面包屑折叠 | 超过 N 段把中间折进「…」菜单 | 没做（只有两段，不触发） | 不修：首屏不触发 |
| 键盘导航 | 方向键上下左右在树里移动、展开收起 | 没有 | 未做：功能块，约 150 行；先标「进行中」 |
| 深色模式 | 同浅色 | 同 | 对照图已出，文件夹图标、列宽、侧栏位置都对 |

| 深色对照（第 3 批） | 同浅色布局 | `/tmp/D12-shots/table-tree-dark.png` 整页左右对照，未发现新增差异 | 一致 |

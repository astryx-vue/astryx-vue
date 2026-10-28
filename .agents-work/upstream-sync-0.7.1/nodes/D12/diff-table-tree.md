# table-tree 走查

对照图：`/tmp/D12-shots/table-tree-{light,dark}.png`（整页），`/tmp/D12-shots/crops/table-tree-light-{up,ours}.png`（只截预览区）。
原版 1704 行（含树形键盘导航、折叠面包屑），我们改前 804 行。预览区 908 宽，小于 1024，所以原版此时侧栏在 README 下面。

| 区块 | 原版 | 我们（改前） | 结论 |
| --- | --- | --- | --- |
| **侧栏位置（用户可见的大问题）** | 视口 ≥1024 时在右边（296 宽），窄了挪到 README 下面；预览区 908 宽，所以在下面 | 永远在右边，把文件表挤成窄窄一条，Last commit date 列被裁掉 | 已修：`useMediaQuery('(min-width: 1024px)')` 决定放哪。About 内容抽成 `AboutPanel` 组件两处复用 |
| 页头 | 仓库名 + Public 徽标 + Star/Watch/Fork 三个带计数的按钮；表头 ≤720 宽时三个按钮收成图标按钮 | 按钮永远带文字 | 已修：加窄屏分支（量表头宽度） |
| 分支栏 | main 下拉 + 「171 Branches」+「56 Tags」+ 右侧搜索 / Add file / Code；窄屏 Branches/Tags 收成图标，搜索收成图标按钮，点开后聚焦 | 窄屏不变 | 已修：加窄屏分支和 `openSearch` |
| 文件表列宽拖动 | 三列表头右边缘有拖动把手 | 没有 | 已修：接 `useTableColumnResize`（把手数量 3，与原版一致） |
| 表头尺寸 | 表头高 32.5，Name 列宽 286，第一列表头里有 24×24 的「展开全部」按钮 | 表头 32.5，Name 列 286（实测逐列一致） | 已修：①原版传 `hasExpandAllControl: true`，我们漏了，表头少一个 24px 的按钮，高度差 3px；②原版 Table 默认 `table-layout: fixed`，模板里补上，列宽按声明比例分 |
| 文件夹图标 | 实心（lucide Folder，fill=currentColor） | 描边的 heroicons folder | 已修：用同一路径的内联 SVG，实心 |
| 文件图标 | 描边 | 描边 | 一致 |
| 展开箭头 | 12px xsm，secondary 色 | 相同 | 一致 |
| 条带背景 | 隔行浅灰 | 相同 | 一致 |
| README 标签条 | sm，字号 14px，tablist 高 33、底内边距 5 | 标签 14px / 高 28（D18 #16 已修）；tablist 高 32、内边距 0 12px 4px | 不修：**core**，写进 core 问题清单第 9 条。tablist 容器比原版矮 1px，底内边距 4 对 5 |
| README 内容宽度 | 标题 h3 宽 680（`margin: 0 73px 12px`，居中布局） | 宽 680（`margin: 16px 73px 8px`） | 部分修：居中限宽已一致（D18 #17 + 模板传 `content-width=680`）；标题块的上下外边距 16/8 对 0/12，写进 core 问题清单第 10 条（Markdown 标题外边距） |
| README 高度 | 843 | 总高 2259 对 2221 | 不修：同上一行的外边距差累加，加上状态表缺外框线（core 第 11 条） |
| h1 | 仓库名，只给读屏用 | 同 | 一致 |
| 面包屑折叠 | 超过 N 段把中间折进「…」菜单 | 没做（只有两段，不触发） | 未做（功能块）：首屏两段，永远不触发 |
| 键盘导航 | 方向键上下左右在树里移动、展开收起 | 没有 | 未做：功能块，约 150 行；先标「进行中」 |
| 深色模式 | 同浅色 | 同 | 对照图已出，文件夹图标、列宽、侧栏位置都对 |

| 深色对照（第 3 批） | 同浅色布局 | `/tmp/D12-shots/table-tree-dark.png` 整页左右对照，未发现新增差异 | 一致 |

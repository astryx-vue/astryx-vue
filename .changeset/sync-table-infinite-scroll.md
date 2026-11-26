---
'@astryx-vue/core': minor
'@astryx-vue/cli': patch
---

Table 新增 `useTableInfiniteScroll`：按批加载扁平数据，表格下方有「加载更多」按钮，表格末尾滚进视口时自动加载下一批，失败后暂停自动加载、按钮仍可重试；第一批加载中时表格不显示默认空状态。`TablePlugin` 新增 `loadingState` 钩子，导出 `TableLoadingState` 类型。同时补充 `useTableSortable`（不会重排行、`useTableSortableState` 参数说明）、`useTableFiltering`、`TableSelectionToolbar` 和 Table 的文档。

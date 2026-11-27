---
'@astryx-vue/lab': minor
'@astryx-vue/core': patch
---

`ListInput` 和 `TransferList` 改用 core `List` 的重排引擎，拖动手感和 `List` 一样：手指按住再拖、副本跟手、落点线、贴边自动滚动、松手后各行滑到新位置，点一下手柄进入键盘重排模式，读屏播报每次挪动。

- `ListInput` 新增 `reorderable`：传 `useReorderable` 或 `createReorderable` 做的对象，挪动交给它的 `onReorder`。`isReorderable` 已弃用但仍可用，开发环境提示一次。
- `ListInput` 每条记录的操作（删除和重排手柄）跟着记录的悬停或聚焦一起显出来，不显时照样占位，记录不会跳动；重排手柄在删除按钮后面。
- `TransferList` 和 `TransferListSelector` 新增 `reorderable`，可以自己接管已选项的重排；不传时照旧用内置重排。整个列表禁用时，重排手柄仍可聚焦，提示为什么不能挪。
- core 为 lab 导出 `unstable_ListReorderScope`、`unstable_useListReorderScope`、`unstable_adaptReorderable`、`unstable_reorderableOptions`，属于内部接口，可能随时变动。

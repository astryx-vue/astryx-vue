---
'@astryx-vue/core': minor
'@astryx-vue/cli': patch
---

新增 `createSwipe`（`@astryx-vue/core/Swipe`）：把它造出的值传给 `ListItem` / `Item` 的 `swipe`，横滑行露出操作，手感按 UIKit 还原（一甩只停开不触发、全滑等行滑出再触发、`hasRemoval` 停在外面），处理函数收到操作 `id` 和行的 `itemKey`；行上的 `swipeActions` / `swipeBehavior` 改走同一套实现并标为弃用，操作默认配色改为 `accent`，`commit` 的一侧有多个操作时不再触发。

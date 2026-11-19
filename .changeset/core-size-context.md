---
'@astryx-vue/core': patch
---

新增 `SizeContext`（`SizeProvider`、`useSize`、`provideSize`、`ElementSize`，同时提供 `@astryx-vue/core/SizeContext` 子路径），对齐原版的尺寸级联：容器把默认尺寸往下传，子组件显式写了 `size` 就以自己的为准。`Toolbar`、`ButtonGroup`、`InputGroup` 会向下提供尺寸；`Button`、`MoreMenu`（含菜单行密度）、`TextInput`、`TextArea`、`Selector`、`MultiSelector`、`NumberInput`、`DateInput`、`DateRangeInput`、`DateTimeInput`、`TimeInput`、`SegmentedControl`、`TabList`、`PowerSearch`、`Tokenizer` 读取它。同时对齐原版的浮层视口空隙：空隙只留在远离锚点、可能越界的那一侧，start 对齐的菜单可以和靠近视口边的触发器同起点，不再被推到 16px。

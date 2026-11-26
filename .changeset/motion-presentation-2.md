---
'@astryx-vue/core': patch
'@astryx-vue/cli': patch
---

Popover、Tooltip、HoverCard、ContextMenu、Selector、MultiSelector、Typeahead 的浮层进场改为从实际落在的那一侧滑进来、以朝向触发器的边为原点放大，滑动不超过和触发器之间的空隙（翻面后不再先压到触发器上，盖住触发器的 Selector 列表原地放大）；开启减少动效时，这些浮层和 Dialog 在触屏上改为 200ms 原地淡入，用鼠标时直接出现。

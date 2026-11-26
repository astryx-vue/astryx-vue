---
'@astryx-vue/core': minor
'@astryx-vue/cli': patch
---

`Selector` 和 `MultiSelector` 的 `presentation` 新增 `adaptive`；各组件的 `adaptive` 统一按主题的紧凑定义判断（粗略指针，并且视口宽度小于主题 `md` 断点、默认 768px，或高度小于 500px，所以横屏手机也会用底部弹层，正好 768px 宽的平板改用浮层），打开那一刻定下浮层还是底部弹层，开着时转屏不再中途换形态，退场播完才重新判断。

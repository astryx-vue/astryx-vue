---
"@astryx-vue/core": patch
---

图标的外部 class 画在尺寸盒内部，避免 `width: 100%` 把同行文字挤成逐词换行。TabList 补上 `isFullBleed`，进度条可以只把标签留给读屏。Badge 接受 `label`，过长时省略号截断，字符串和数字会写进 `title`。

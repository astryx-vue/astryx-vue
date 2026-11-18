---
"@astryx-vue/core": patch
---

修复 Stack、Center、Section、ScrollableArea 没传尺寸属性时会抹掉使用方 `style` 里的 width / maxWidth / height / minHeight；Slider 控件高度改成和原版一样的 20px，只在触屏（粗指针）时撑到 24px。

---
'@astryx-vue/lab': minor
'@astryx-vue/core': minor
'@astryx-vue/cli': patch
---

新增实验组件 ChatVirtualizer：很长的聊天记录只渲染看得见的行，在底部时跟随新消息，往上翻后加载历史、行变高都不挪动正在读的那一行，也能挂到整页滚动上并在旋转屏幕时保持位置；core 同时导出它用到的 `scrollsPage`、`scrollportTop`、`scrollEventTarget`、`setScrollAnchoringOff`、`useFingerScroll`，并新增文案 `chat.virtualizerLabel`。

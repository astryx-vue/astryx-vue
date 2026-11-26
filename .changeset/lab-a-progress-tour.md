---
'@astryx-vue/lab': patch
'@astryx-vue/cli': patch
---

实验包：CircularProgress 改为合成线程上转动的圆弧，页面忙时进度变化也不会卡住，不确定状态和加载圈一样转，所有变体共用浅色轨道、禁用时整圈半透明；Tour 的说明框改成非模态区域，可以指向任何元素，按目标或页面不再结束引导，Escape 报告 `escape`，结束后把焦点还回去；CodeEditor 在从右到左的页面里代码保持从左到右；Schedule 的加载提示改走共享播报通道。

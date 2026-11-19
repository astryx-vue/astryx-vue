---
'@astryx-vue/core': patch
---

继续对齐原版的交互状态：Popover 的关闭按钮默认文字走本地化词条（英文 "Close popover"）；EmptyState 的图标容器按原版改为块级居中，不再被图标的基线偏移撑高；竖向轨道模式的 Stepper（`indicator-position="on-track"`）把指示点画在轨道列里，和连接线同一列；Step 的指示点和标签的状态样式只认自己的进度和状态，嵌套的步骤条不再吃到外层步骤的样式；Step 标签行撑满一行，结尾内容靠右。

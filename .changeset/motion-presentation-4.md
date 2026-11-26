---
'@astryx-vue/core': minor
'@astryx-vue/cli': patch
---

`Popover` 新增 `presentation` 属性：`'popover'`（默认，照旧锚在触发器旁）、`'bottom-sheet'`（放进模态底部弹层）和 `'adaptive'`（手机这类紧凑触屏上用底部弹层，其余用浮层）。底部弹层由 `label` 命名，没写时用触发器的文字；总能轻点外面或下滑关闭，Escape 跟着 `hasEscapeDismiss`；每次打开焦点落到第一个内容控件，界面在打开时选定、保持到关闭，并且只在可能用到时才加载。

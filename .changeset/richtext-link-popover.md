---
'@astryx-vue/core': patch
'@astryx-vue/richtext': minor
'@astryx-vue/cli': patch
---

富文本工具栏的链接按钮和 Cmd/Ctrl+K 改为打开锚定在按钮上的非模态弹出层（开在工具栏上方，放不下才翻到下方）：一个网址输入框，回车应用，Escape 或取消会把焦点和选区还给编辑器；光标在链接里时多一个移除按钮。网址框默认留空并显示占位文字。

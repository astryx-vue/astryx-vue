---
'@astryx-vue/core': patch
---

恢复 CommandPaletteInput 的可见键盘焦点。键盘进入时显示统一焦点环，指针聚焦时不额外显示；调用方的 focus、blur 回调继续执行。

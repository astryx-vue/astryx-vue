---
'@astryx-vue/core': patch
---

按压反馈在没有正在按的接触、且抬起事件没带 `pointerId` 时不再抛出 `Cannot read properties of null`。

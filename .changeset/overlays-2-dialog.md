---
'@astryx-vue/core': patch
'@astryx-vue/cli': patch
---

Dialog：初始焦点跳过藏在 hidden、inert 里和被禁用的请求，顺延给下一个，嵌套子对话框里的请求留给子对话框；第二个文档里的对话框按触发器所在窗口算进场方向。DialogHeader 的标题行罩得住标题和控件。Lightbox 里冒上来的 cancel（取消文件选择器）不再关闭它。文档补上 AlertDialog 是对话框嵌套的唯一例外。

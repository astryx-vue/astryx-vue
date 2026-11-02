---
'@astryx-vue/core': patch
---

[fix] `Typeahead`、`Tokenizer`、`PowerSearch`：搜索源被替换时清掉旧请求留下的 loading 状态，避免忙碌指示一直转圈。

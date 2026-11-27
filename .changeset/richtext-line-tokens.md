---
'@astryx-vue/core': minor
'@astryx-vue/richtext': patch
---

富文本编辑器里的代码块在编辑时只重新分词被改动的行；core 新增 `CodeLineTokens`，按行缓存代码高亮的分词结果。

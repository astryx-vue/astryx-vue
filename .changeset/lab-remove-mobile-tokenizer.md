---
'@astryx-vue/lab': minor
---

移除 lab 的 `MobileTokenizer`（连同它的样式、文档和示例）。手机上的多选输入请改用 core 的 `Tokenizer`：它默认 `presentation="adaptive"`，在紧凑触屏上自动换成底部弹层，草稿编辑、放弃确认、拖动收起搜索都已经内置。`MobileTokenizer` 顺带导出的 `SearchableItem`、`SearchSource` 类型也一并移除，请从 `@astryx-vue/core` 引入。

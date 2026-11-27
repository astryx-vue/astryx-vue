---
'@astryx-vue/core': minor
'@astryx-vue/richtext': minor
'@astryx-vue/cli': patch
---

CodeBlock 内置新增 C、C++、SQL、Rust、Kotlin、Swift、Go 的高亮；不常用的语言做成单独引入的语言值（`@astryx-vue/core/Code/languages/` 下的 dockerfile、graphql、java、lua、objective-c、powershell、ruby、thrift、toml），传给 `language`；新增 `createCodeLanguage` 用分词函数做自己的语言。`language` 接受语言值（标签显示它的名字，`data-language` 取第一个标识符），`tokenizer` 标为已弃用但行为不变。`Markdown` 和 `RichTextEditor`、`RichTextView` 新增 `codeLanguages`：围栏的语言词是某个语言值的标识符时，按这个值渲染。

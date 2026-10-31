---
"@astryx-vue/richtext": minor
"@astryx-vue/core": patch
---

富文本新增只读视图 `RichTextView`，并支持 Markdown 插件节点（`markdownExtensions`）。编辑器和工具栏的文案接进 core 的多语言目录。

core：`parseInlineAst` 现在能读出放在原文开头的插件语法（之前开头的插件节点读成纯文字）；起点偏移不再出现 -1。

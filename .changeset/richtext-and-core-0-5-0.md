---
"@astryx-vue/richtext": minor
"@astryx-vue/core": minor
"@astryx-vue/themes": minor
---

**新包 `@astryx-vue/richtext`：富文本编辑器首发。**

- `RichTextEditor`：基于 Lexical 的所见即所得编辑器。标题、列表、引用、链接、代码块、表格、分割线；撤销重做；输入 `# `、`- ` 变成标题和列表；按 Escape 再按 Tab 离开编辑器。只读和禁用是两种状态，读屏软件读得出区别。
- `RichTextEditorToolbar`：块格式、行内格式、链接对话框（Cmd/Ctrl+K）。图标可以被主题用 `richtext:*` 键换掉。
- `RichTextView`：只读视图，是文档内容而不是表单控件。内容读不出来时不会带崩页面，改走 `errorFallback` 插槽。
- 任务项勾选框、代码块标题栏与复制按钮、代码语法高亮、表格列宽、自动链接插件 `RichTextEditorAutoLinkPlugin`。
- Markdown 原样往返：`markdownToEditorStateJSON` 和 `editorStateJSONToMarkdown`。没改过的块原样导出，只有改动过的块用规范写法。从 `@astryx-vue/richtext/markdown` 引入，服务端可用。
- Markdown 插件节点：`createRichTextExtension` 加 `markdownExtensions`，节点按 core 的 `Markdown` 一样渲染，当成一个整体编辑。
- Lexical（`lexical` 和 `@lexical/*`，锁在 0.52）是可选依赖，使用者自己安装。

**core 和 themes 同步升到 0.5.0**（三个包共用一条版本线）：

- 按钮字重、`Text` 的默认颜色（次要文字不再被压成主色）。
- 表格：内边距、列宽计算、选择列宽度、分组头高度。表格数据模式的列宽现在按声明的比例分配。
- `Toolbar` 外面套了 `Section`，`variant` 新增 `section`。
- `StatusDot` 补上 `accent`；`Button` 接上 `icon` 属性；`OverflowList` 按真实的溢出内容测量；`Table` 的 `column.header` 可以传函数。
- Markdown：标题间距按源文档的标题深度取；`parseInlineAst` 现在能读出放在原文开头的插件语法，起点偏移不再出现 -1。

# @astryx-vue/richtext

## 0.7.13

### Patch Changes

- Updated dependencies [[`9f1f68a`](https://github.com/astryx-vue/astryx-vue/commit/9f1f68a28296b709479407fbca2c1a229e01491e)]:
  - @astryx-vue/core@0.7.13

## 0.7.12

### Patch Changes

- Updated dependencies [[`ca5a8ea`](https://github.com/astryx-vue/astryx-vue/commit/ca5a8eaf3eb9f2dc966d89995697bd3d2feda936)]:
  - @astryx-vue/core@0.7.12

## 0.7.11

### Patch Changes

- Updated dependencies [[`d3a9e5f`](https://github.com/astryx-vue/astryx-vue/commit/d3a9e5f8d58d3c2f1f5302860650e3500fd75796)]:
  - @astryx-vue/core@0.7.11

## 0.7.10

### Patch Changes

- Updated dependencies [[`49efa1f`](https://github.com/astryx-vue/astryx-vue/commit/49efa1f4b1f033a46de76eaf2004be7669bf11fe)]:
  - @astryx-vue/core@0.7.10

## 0.7.9

### Patch Changes

- Updated dependencies [[`8a86866`](https://github.com/astryx-vue/astryx-vue/commit/8a86866bd08cf332afb296e3099b6714c562c8ed)]:
  - @astryx-vue/core@0.7.9

## 0.7.8

### Patch Changes

- [#444](https://github.com/astryx-vue/astryx-vue/pull/444) [`00c41e4`](https://github.com/astryx-vue/astryx-vue/commit/00c41e44bf9c1a5c477898f0fe34eea22b7b97ce) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 修复 RichText 任务勾选框在缩略预览中错位的问题。使用 transform 缩放时，先把视口坐标换算回本地 CSS 像素，再计算位置和 RTL 左偏，确保勾选框仍对齐自己的任务项。
- Updated dependencies [[`63cfdac`](https://github.com/astryx-vue/astryx-vue/commit/63cfdac4324597396e1be4f7029e9a73282a235b), [`09d2796`](https://github.com/astryx-vue/astryx-vue/commit/09d2796d233d2ca7a82aadf1b476d31739b3c0c6)]:
  - @astryx-vue/core@0.7.8

## 0.7.7

### Patch Changes

- Updated dependencies [[`4351a2b`](https://github.com/astryx-vue/astryx-vue/commit/4351a2baf8a5f81a93744994d3621ba40eedef3d)]:
  - @astryx-vue/core@0.7.7

## 0.7.6

### Patch Changes

- Updated dependencies [[`b3a63e7`](https://github.com/astryx-vue/astryx-vue/commit/b3a63e769e1be385051ee892b1f3c73d27702684)]:
  - @astryx-vue/core@0.7.6

## 0.7.5

### Patch Changes

- Updated dependencies [[`9e510f3`](https://github.com/astryx-vue/astryx-vue/commit/9e510f3a8608c8f24656de70aa7545dbd31225b1)]:
  - @astryx-vue/core@0.7.5

## 0.7.4

### Patch Changes

- Updated dependencies [[`30ae6eb`](https://github.com/astryx-vue/astryx-vue/commit/30ae6eba1f83f87b6120081a6d668fa71e50a575)]:
  - @astryx-vue/core@0.7.4

## 0.7.3

### Patch Changes

- Updated dependencies [[`59d5124`](https://github.com/astryx-vue/astryx-vue/commit/59d5124182f376013d12bc8ee6667acc02b58a61)]:
  - @astryx-vue/core@0.7.3

## 0.7.2

### Patch Changes

- Updated dependencies [[`99c6e58`](https://github.com/astryx-vue/astryx-vue/commit/99c6e58da250ce44e7306d12b62bce18e5186256)]:
  - @astryx-vue/core@0.7.2

## 0.7.1

### Patch Changes

- Updated dependencies [[`d54c4a1`](https://github.com/astryx-vue/astryx-vue/commit/d54c4a1e3f9bd97697e3ec4ce93c0db7cbc07668)]:
  - @astryx-vue/core@0.7.1

## 0.7.0

### Patch Changes

- Updated dependencies [[`dacf1fe`](https://github.com/astryx-vue/astryx-vue/commit/dacf1fe1fe16bd653cf15b78798e16819a292b29)]:
  - @astryx-vue/core@0.7.0

## 0.6.1

### Patch Changes

- Updated dependencies [[`f0edcfe`](https://github.com/astryx-vue/astryx-vue/commit/f0edcfec10c33ae019c076a7d05b87665cbcf347), [`fb0dacd`](https://github.com/astryx-vue/astryx-vue/commit/fb0dacdda76aa603025210406e12e4c9b41907f7)]:
  - @astryx-vue/core@0.6.1

## 0.6.0

### Patch Changes

- [#412](https://github.com/astryx-vue/astryx-vue/pull/412) [`2a9b503`](https://github.com/astryx-vue/astryx-vue/commit/2a9b50310e32eb840caac6afe1fbaba65a810f8c) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 修正 Markdown 与富文本的表格边框：每个单元格四条边都画线，不再只有行与行之间的分隔线；表格外沿由表格自身的边框闭合，和格线折叠成一条 1px 的线，不会在边缘叠成双线。两个界面用同一套 `--astryx-color-border` 行线和列线，最后一行、最后一列不重复画线，所以同一张表在 Markdown 阅读状态和富文本里的格子边界一致。
- Updated dependencies [[`88e2214`](https://github.com/astryx-vue/astryx-vue/commit/88e22141ad5d24ce3f6db2aefe082a9df44a5359), [`c4f2aa5`](https://github.com/astryx-vue/astryx-vue/commit/c4f2aa52b3834549263b8a98e7787ef6a54262c3), [`004f655`](https://github.com/astryx-vue/astryx-vue/commit/004f655f04fcae2194eb694c9a6b61b19adaff0a), [`22e9a74`](https://github.com/astryx-vue/astryx-vue/commit/22e9a74dcc1bcc38bea4bb8499212afbddf7bbd1), [`9685f9a`](https://github.com/astryx-vue/astryx-vue/commit/9685f9a39d4b01c73f59237f1cff0326bd60864e), [`6d366de`](https://github.com/astryx-vue/astryx-vue/commit/6d366de2fac28a02a75315f0b7283a5eed100ca1), [`78d5669`](https://github.com/astryx-vue/astryx-vue/commit/78d56695cc7ee13c01d3347e4b7dd5ce24665c7a), [`2a9b503`](https://github.com/astryx-vue/astryx-vue/commit/2a9b50310e32eb840caac6afe1fbaba65a810f8c), [`346ff39`](https://github.com/astryx-vue/astryx-vue/commit/346ff392db97126214613c6b5608a173b79240a8), [`a74832f`](https://github.com/astryx-vue/astryx-vue/commit/a74832fee24df16e017324f5fb80e8eff76c9baa), [`7ba5cb9`](https://github.com/astryx-vue/astryx-vue/commit/7ba5cb9a0de1d4e824baf235ec23524f4c11be7b)]:
  - @astryx-vue/core@0.6.0

## 0.5.2

### Patch Changes

- Updated dependencies [[`748f379`](https://github.com/astryx-vue/astryx-vue/commit/748f37980c93fbc5d2f90a07d8a488e34a4fcecd)]:
  - @astryx-vue/core@0.5.2

## 0.5.1

### Patch Changes

- [#257](https://github.com/astryx-vue/astryx-vue/pull/257) [`5688596`](https://github.com/astryx-vue/astryx-vue/commit/5688596e50ead2c7ad8ed458a6a76ddba3850fad) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 修正富文本的几处样式：代码块的语言名和复制按钮不再溢出代码块；聚焦框改成和 `TextArea` 一致；表格单元格的段落不再留上下外边距，单元格高度和原版一致；代码块背景和边框改用 core 的 `--astryx-code-block-*` 变量。
- Updated dependencies []:
  - @astryx-vue/core@0.5.1

## 0.5.0

### Minor Changes

- **新包 `@astryx-vue/richtext`：富文本编辑器首发。**
  
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

### Patch Changes

- Updated dependencies []:
  - @astryx-vue/core@0.5.0

# @astryx-vue/themes

## 0.5.2

No changes in this release.

## 0.5.1

No changes in this release.

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

## 0.4.1

### Patch Changes

- [#225](https://github.com/astryx-vue/astryx-vue/pull/225) [`d6329a1`](https://github.com/astryx-vue/astryx-vue/commit/d6329a1f5be7d544e3b363f0b211acf32124efce) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 这一版修的都是细节，原来的用法不用改。
  
  - 状态图标画得和原版一样了。Banner、输入框的状态提示、信息提示、步骤条、字数超限的计数前面都会显示成功、警告、错误、信息图标，现在这些图标和别处一样从图标表里取：配了图标表（比如 lucide）就画描边的，没配就用 core 自带的实心图形。之前这几处是各自画的描边线条，看着比原版细。
  - `Table` 的行高和原版一样了。表格单元格不再比原版高出一截。
  - Markdown 里不安全的链接地址（`javascript:`、`vbscript:`、`data:text/html`）在解析的时候就整段当成纯文字，里面的行内代码也不再生成。这类链接不会再出现「点了没反应」的样子。
  - 四个空格缩进的内容不再被当成代码块或标题。`    # 标题` 现在是一行普通文字，缩进也原样留着，和原版一致。
  - `parseInline` 和 `parseInlineAst` 只解析行内内容了。传整篇文档给它们只会当一行读，要解析整篇请用 `parseMarkdown`。
  - 插件语法能把整段连标记一起吃掉：`{{see **this**, [that](url), and - this}}` 现在是一个节点，中间不会剩下半截粗体或链接。
  - 被反斜杠转义的 `@` 不再触发插件语法：`\@{ada} then @{ada}.` 只有一个节点。
  - 链接文字、图片说明里写的插件语法不生成节点，和原版一样按纯文字读。
  - 只有勾选框、没有内容的任务项（`- [x] `）会保持勾选状态。
  - `createMarkdownPlugin` 可以写显式泛型了，比如 `createMarkdownPlugin<'mentions', MentionNode>(…)`。这样 `toText` 和 `render` 里的 `node.data` 会收窄到具体类型，不用再写 `as`。
  - `ComplexSelector` 的弹层现在可以调：新增 `popupWidth` 指定弹层宽度，`contentClass` 和 `contentStyle` 给弹层里放内容的那个容器加类名和样式，比如 `contentStyle={{ padding: 0 }}` 能让内容贴到弹层边缘。内边距默认也从外壳移到内容容器上，外观没有变化。
  
  `@astryx-vue/themes` 的样式内容和 0.4.0 一样，只是它和 core 共用同一条版本线，所以跟着一起升到 0.4.1。

## 0.4.0

### Minor Changes

- [#182](https://github.com/astryx-vue/astryx-vue/pull/182) [`0c737f4`](https://github.com/astryx-vue/astryx-vue/commit/0c737f4d278e4f863bf3c702487e2953a21c5a46) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 对齐 Astryx v0.7.1（上一版对齐 0.4.1）。组件、主题和文档站都按原版 0.7.1 逐个核对过，效果和原版一致。
  
  **升级前先看 [升级指南](https://astryx-vue.pages.dev/guide/migration)。** 这一版有破坏性改动，多数项目只需要改三处：
  
  1. `labelHidden` 换成 `isLabelHidden`（旧名还能用，会在之后的版本删掉）。
  2. `useDismiss` 的 `enableEscape` 换成 `dismissOnEscape`。
  3. 自定义主题里的旧挂点名换成带连字符的新名字，比如 `progressbar` 改成 `progress-bar`。
  
  另外几处行为变了，升级指南里都写了新旧写法：
  
  - `@astryx-vue/core/reset.css` 现在是一份完整的全局 reset。只是为了定层级顺序才引入它的，可以直接删掉。
  - `--astryx-spacing-*` 从 px 改成 rem。根字号是默认的 16px 时看起来完全一样。
  - 组件不再输出 `primary`、`sm` 这类裸类名，改用 `data-*` 属性。
  - Selector 的 `variant="default"` 改名 `variant="input"`。
  
  主要新增：
  
  - 输入、选择器、日期类组件新增 `containerClass`、`containerStyle`、`controlClass`、`controlStyle`，可以分别给外框和控件加样式。根上直接写的 `class`、`style` 落点不变。
  - 浮层运行时对齐原版：共享关闭栈，Escape 只关最上面一层；视口内边距；Dialog 里也能挂浮层。
  - 新组件和能力：BottomSheet、PowerSearch、CommandPalette，Markdown 与代码块的子路径导出，Table 的分组、树、固定列、列宽拖动和行级扩展点（插件能拿到整行元素、挂行事件）。
  - `@astryx-vue/themes` 的 Butter、Chocolate、Gothic、Matcha、Stone、Y2K、Neutral 七套主题，取值和原版 0.7.1 逐个比对一致。
  
  修复：
  
  - 嵌套的 Stack 不再继承外层的内边距和间距。
  - Table 列头的筛选按钮和标题、排序箭头排在同一行。
  - Selector 选项的 `icon` 可以是语义图标名、CSS 类、组件或渲染函数。
  - 竖向 Stepper 的步骤内容排在标签下面。

## 0.3.0

No changes in this release.

## 0.2.6

### Patch Changes

- [#111](https://github.com/astryx-vue/astryx-vue/pull/111) [`3016d4e`](https://github.com/astryx-vue/astryx-vue/commit/3016d4edff4583ad2817a49a381af11962b9a0d1) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 对话触发菜单会显示条目自带的说明，提及和命令不必再手写一行。从按钮插入触发字符时，菜单也会打开。没有单独设置时，较长的粘贴会收成标记。对话框标题可以加底部分隔线，全屏文档能把操作和正文分开。听写按钮直接接收 useChatDictation 返回的响应式状态。流式文本在内容被整段替换时从头显示，同一段继续变长时仍接着往下走。

## 0.2.5

### Patch Changes

- [#82](https://github.com/astryx-vue/astryx-vue/pull/82) [`8a6b048`](https://github.com/astryx-vue/astryx-vue/commit/8a6b048fa94aa76c7547a1758e1a4d514550f0f2) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 重新发布 npm 上的包说明。上一版只发了 `@astryx-vue/cli`，`@astryx-vue/core` 和 `@astryx-vue/themes` 在 npm 上仍是旧 README。这次把已经写好的安装步骤、子路径引入、主题 CSS 变量和内置 Figtree 的说明随包发出。

## 0.2.4

### Patch Changes

- [#74](https://github.com/astryx-vue/astryx-vue/pull/74) [`2cbd6ee`](https://github.com/astryx-vue/astryx-vue/commit/2cbd6eef18532991508321c841b7fec7064a2933) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 代码块可以按 unified diff 给整行上色，符号后面的文本仍按原来的语言做语法高亮。主题补上新增、删除、差异头和标记色，名字沿用 `--astryx-code-syntax-*`。Markdown 可以挂文档插件和行内插件，裸链接可以单独打开，引用芯片可以改成序号。

- [#74](https://github.com/astryx-vue/astryx-vue/pull/74) [`2cbd6ee`](https://github.com/astryx-vue/astryx-vue/commit/2cbd6eef18532991508321c841b7fec7064a2933) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - `defineTheme()` 可以从强调色、字号比例、圆角和时长生成 token，并按组件覆盖样式。主题补上了图表用的数据色，七套主题用同一组数值。

## 0.2.3

No changes in this release.

## 0.2.2

No changes in this release.

## 0.2.1

### Patch Changes

- [#48](https://github.com/astryx-vue/astryx-vue/pull/48) [`09833d1`](https://github.com/astryx-vue/astryx-vue/commit/09833d13706539b032a5d9be9b13a5fd90bcc686) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 主题入口通过 `fonts.css` 内置 Figtree，和 JetBrains Mono 一样随主题加载，使用方不用再单独引入正文字体。

- [#45](https://github.com/astryx-vue/astryx-vue/pull/45) [`0a1a584`](https://github.com/astryx-vue/astryx-vue/commit/0a1a5845983af52964eac0f4de7ff84c0fddef63) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 中性主题的卡片默认内边距改为间距 3（12px）。卡片里的布局面板内外边距都跟随这张卡片，侧栏文字不再被多出来的内边距挤出省略号。

## 0.2.0

### Minor Changes

- [#40](https://github.com/astryx-vue/astryx-vue/pull/40) [`244d4f2`](https://github.com/astryx-vue/astryx-vue/commit/244d4f28dd69849e28d88c9bfa3ce6f58f36a0a7) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - Add Theme / MediaTheme / SyntaxTheme, six new first-party themes, expanded docs examples, and the docs Playground.

### Patch Changes

- [#34](https://github.com/astryx-vue/astryx-vue/pull/34) [`94cf3dd`](https://github.com/astryx-vue/astryx-vue/commit/94cf3ddf39bc6b2b3e56323162cea8976aa4fa0e) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 补齐 Butter、Chocolate、Gothic、Matcha、Stone、Y2K 六套主题，文档里的主题画廊可以切换预览。

- [#36](https://github.com/astryx-vue/astryx-vue/pull/36) [`7e72b05`](https://github.com/astryx-vue/astryx-vue/commit/7e72b05aff576e0d52cd568c8e58e75951f1c851) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 新增 Theme、MediaTheme 和完整的 SyntaxTheme。主题子树会重新绑定文字、标题和按钮的颜色别名，避免主文字色停在 :root 上已经算好的值。

## 0.1.3

### Patch Changes

- [#29](https://github.com/astryx-vue/astryx-vue/pull/29) [`d4095c9`](https://github.com/astryx-vue/astryx-vue/commit/d4095c9485078893440c1bf3c7c6b6a70a714a71) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 新增布局组件 AppShell、Layout（含 LayoutHeader、LayoutContent、LayoutFooter、LayoutPanel）、Section、FormLayout、ScrollableArea、ResizeHandle、AspectRatio，以及 useAppShellMobile、useResizable、useScrollableArea、useScrollOverflow。

## 0.1.2

No changes in this release.

## 0.1.1

No changes in this release.

## 0.1.0

### Minor Changes

- [#13](https://github.com/astryx-vue/astryx-vue/pull/13) [`85aa073`](https://github.com/astryx-vue/astryx-vue/commit/85aa073fb5f855847b6951528e5743dc50bc99aa) Thanks [@ShenQingchuan](https://github.com/ShenQingchuan)! - 首次发布。`@astryx-vue/core` 提供 Vue 3 组件，`@astryx-vue/themes` 提供 Neutral 主题。

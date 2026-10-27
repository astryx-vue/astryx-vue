# @astryx-vue/themes

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

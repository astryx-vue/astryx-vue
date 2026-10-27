---
"@astryx-vue/core": minor
"@astryx-vue/themes": minor
---

对齐 Astryx v0.7.1（上一版对齐 0.4.1）。组件、主题和文档站都按原版 0.7.1 逐个核对过，效果和原版一致。

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

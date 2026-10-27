---
title: 主题与样式
---

# 主题与样式

要让组件漂亮且正确地呈现出来，一个应用通常需要引入两样东西：主题变量，以及组件的结构样式。

```ts
import { Button } from '@astryx-vue/core/Button'
import '@astryx-vue/themes/neutral.css'
```

当你从子路径引入 `Button` 时，它会自动附带按钮本身的结构骨架样式。而引入的主题样式（例如 `neutral.css`）则负责注入 Neutral 主题的配色变量（包含按钮所需要的 `--astryx-button-*` 等）。两者分工明确：如果缺少主题，组件虽然有布局结构，但会缺失色彩与视觉质感；如果缺少结构样式，变量就找不到对应的 CSS 规则来生效。

如果你不想每次手动按需引入各组件的样式，可以在全局入口处一次性加载所有样式：

```ts
import '@astryx-vue/core/styles.css'
import '@astryx-vue/themes/neutral.css'
```

其中 `styles.css` 汇总了 `packages/core/styles/` 下全部组件的结构样式，并自带了共享动画规则 `motion.css`；而 `neutral.css` 则汇总了 Neutral 主题的所有变量定义，并引入 Figtree 和 JetBrains Mono 字体。

## 样式的层级顺序（CSS Layers）

为了保证业务代码覆盖样式时不被组件库的特异性（Specificity）困扰，所有样式都被组织在标准的 CSS `@layer` 规则中，层级先后关系如下：

```css
@layer astryx.reset, astryx.tokens, astryx.base, astryx.components, astryx.overrides;
```

如果你需要在项目中覆盖组件样式，建议将自定义样式写在 `astryx.overrides` 层内。需要提醒的是，普通写在未分层环境下的全局 CSS 规则优先级天然高于所有的 `@layer`。因此在写全局样式时，请尽量避免使用未分层的纯标签选择器（如全局写 `button { ... }`），以免不小心破坏掉组件的默认外观。

## 和 Tailwind / UnoCSS 一起用

可以一起用，前提是把层的顺序定死。

关键只有一条：页面上所有层的先后，由它们**第一次出现**的位置决定。所以最稳的做法是在应用入口的最上面写一行，把所有层一次排好：

```css
@layer theme, base, astryx.reset, astryx.tokens, astryx.base, astryx.components, astryx.overrides, components, utilities;

@import 'tailwindcss';
@import '@astryx-vue/core/styles.css';
@import '@astryx-vue/themes/neutral.css';
```

排在前面的层更弱，排在后面的更强。工具类那一层排在 `astryx.components` 后面，所以 `class="p-0"` 能盖掉组件自带的内边距。`astryx.overrides` 排在工具类前面，所以它压不过工具类。某条样式必须赢过工具类时，别靠 overrides，改顺序或者不写成分层。

顺带说一句：`@layer` 语句可以写在 `@import` 前面，这是 CSS 里少数允许的顺序。反过来的话整段会被当成无效内容丢掉。

### 在工具类里直接用我们的变量

不用改配置，任意值写法就能用：

```html
<div class="p-[var(--astryx-spacing-4)] text-[var(--astryx-color-text-primary)]">
  ...
</div>
```

Tailwind v4 还可以把变量登记成自己的 token，写起来更短：

```css
@theme inline {
  --color-surface: var(--astryx-color-background-card);
  --color-body: var(--astryx-color-text-primary);
}
```

之后写 `bg-surface`、`text-body`。`inline` 不能省。按 Tailwind 的说明，主题值引用了另一个变量时必须加它；不加的话生成出来的工具类读的是 `--color-surface` 自己，而不是我们的变量，按主题作用域切换颜色时就跟不准。

### UnoCSS

UnoCSS 默认把工具类输出成不分层的普通规则。未分层的规则赢过任何 `@layer`，所以工具类天然盖得住组件样式，不用调顺序。

代价是反过来的：你手写的分层 CSS 压不过 UnoCSS 的类。要盖它，选择器写具体一点，或者写成未分层。

如果你打开了 UnoCSS 的 CSS 层输出（`outputToCssLayers`），那就和 Tailwind 一样，把它的层排到 `astryx.components` 之后。

## 和 CSS Modules、手写 CSS 一起用

这两种都能用，注意三点。

**类名不会冲突。** `<style module>` 和 `*.module.css` 的类名会被改写，可以直接起名。

**要盖组件内部的元素，得穿进去。** scoped 样式用 `:deep()`，CSS Modules 用 `:global`：

```vue
<style module>
/* 只改组件内部那一个元素的宽度 */
.panel :global(.astryx-layout__panel) {
  width: 420px;
}
</style>
```

**值仍然写变量。** 用自己的类名可以，但颜色和间距还是写 `var(--astryx-*)`。抄一个 `#171717` 进去，深色模式和换主题就断了。

如果项目完全不用分层，就把选择器写具体一点，别用裸标签选择器（`button { }`），也别在全局写 `* { }`。

## 关于样式依赖

这套样式不要求 UnoCSS。文档站用 UnoCSS 只为了给示例里的 `i-carbon-*` 类提供图标，那是图标方案，不是组件样式的依赖。见 [图标](/guide/icons)。

更深入的变量命名规则、`light-dark()` 机制与主题支持范围，可继续阅读 [CSS 变量](/themes/css-variables) 和 [Neutral 主题](/themes/neutral)。

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

## 关于样式依赖

这套样式不要求 UnoCSS。文档站用 UnoCSS 只为了给示例里的 `i-carbon-*` 类提供图标，那是图标方案，不是组件样式的依赖。见 [图标](/guide/icons)。

更深入的变量命名规则、`light-dark()` 机制与主题支持范围，可继续阅读 [CSS 变量](/themes/css-variables) 和 [Neutral 主题](/themes/neutral)。

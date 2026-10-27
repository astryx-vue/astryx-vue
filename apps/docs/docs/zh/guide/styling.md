---
title: 主题与样式
---

# 主题与样式

在实际应用中，组件通常依赖两部分样式：主题变量和组件结构样式。

```ts
import { Button } from '@astryx-vue/core/Button'
import '@astryx-vue/themes/neutral.css'
```

当你从子路径引入 `Button` 时，它会自动附带该组件所需的结构样式。引入的主题样式（如 `neutral.css`）负责注入对应的主题配色变量（包含按钮所需的 `--astryx-button-*` 等）。两者分工明确：缺少主题时组件具有结构但缺失色彩；缺少结构样式时变量则无法生效。

如果不需要逐个按需引入组件样式，可以在应用入口处统一加载全部组件样式：

```ts
import '@astryx-vue/core/styles.css'
import '@astryx-vue/themes/neutral.css'
```

其中 `styles.css` 汇总了 `packages/core/styles/` 下全部组件的结构样式，并包含通用动效规则 `motion.css`；`neutral.css` 汇总了 Neutral 主题的全部变量定义，并引入 Figtree 和 JetBrains Mono 字体。

## 样式级联层顺序（CSS Layers）

为了保证业务代码覆盖样式时不被特异性困扰，所有样式都被组织在标准的 CSS `@layer` 规则中，层级先后关系如下：

```css
@layer astryx.reset, astryx.tokens, astryx.base, astryx.components, astryx.overrides;
```

如果需要在项目中自定义或覆盖组件样式，建议将样式规则写在 `astryx.overrides` 层内。需要注意，未放置在任何层内的普通全局 CSS 规则，其优先级天然高于所有 `@layer` 规则。因此编写全局样式时，应避免使用未分层的裸标签选择器（如全局编写 `button { ... }`），防止意外覆盖组件的默认外观。

## 配合 Tailwind / UnoCSS 使用

组件库可与 Tailwind 或 UnoCSS 搭配使用，关键在于统一声明级联层的先后顺序。

在 CSS 规范中，所有级联层的先后关系由其**首次出现**的声明位置决定。推荐在应用入口顶部显式声明完整的层级顺序：

```css
@layer theme, base, astryx.reset, astryx.tokens, astryx.base, astryx.components, astryx.overrides, components, utilities;

@import 'tailwindcss';
@import '@astryx-vue/core/styles.css';
@import '@astryx-vue/themes/neutral.css';
```

排在前面的层优先级较低，排在后面的层优先级较高。工具类所在层排在 `astryx.components` 之后，因此 `class="p-0"` 可以覆盖组件自带的内边距。`astryx.overrides` 排在工具类层之前，因此其优先级低于工具类。若某条样式需要强行覆盖工具类，可调整层声明顺序或使用未分层样式。

注意：`@layer` 声明语句允许置于 `@import` 规则之前，这是符合 CSS 规范的顺序。若顺序颠倒，该规则可能被浏览器忽略。

### 在工具类中直接使用设计变量

无需额外配置，即可在任意值语法中直接引用设计变量：

```html
<div class="p-[var(--astryx-spacing-4)] text-[var(--astryx-color-text-primary)]">
  ...
</div>
```

在 Tailwind v4 中，也可以将设计变量注册为内置主题 Token：

```css
@theme inline {
  --color-surface: var(--astryx-color-background-card);
  --color-body: var(--astryx-color-text-primary);
}
```

之后即可直接使用 `bg-surface` 或 `text-body`。此处的 `inline` 不能省；根据 Tailwind 规则，当主题配置引用其它变量时必须加它，否则生成的工具类读取的是 `--color-surface` 本身，而不是引用的设计变量，在主题切换时无法动态响应变量更新。

### UnoCSS

UnoCSS 默认将生成的工具类输出为不分层的普通规则。由于未分层规则天然优先于任何 `@layer` 规则，因此 UnoCSS 工具类可以直接覆盖组件默认样式，通常无需单独配置层级顺序。

需要注意的是，手写的分层 CSS 同样无法直接覆盖 UnoCSS 的未分层工具类。如果需要覆盖，可提高选择器特异度或直接写为未分层规则。

若在项目中开启了 UnoCSS 的级联层输出功能（`outputToCssLayers`），配置方式与 Tailwind 相同，将对应层级排在 `astryx.components` 之后即可。

## 配合 CSS Modules 与手写 CSS 使用

这两种方式均完全支持，注意以下几点：

**类名隔离**：`<style module>` 与 `*.module.css` 生成带有哈希的局部类名，不会与组件类名冲突。

**穿透覆盖内部元素**：覆盖组件内部结构时，SFC scoped 样式建议使用 `:deep()`，CSS Modules 中使用 `:global`：

```vue
<style module>
/* 只改组件内部那一个元素的宽度 */
.panel :global(.astryx-layout__panel) {
  width: 420px;
}
</style>
```

**保持变量引用**：自定义类名中涉及颜色与间距时，建议继续引用 `var(--astryx-*)` 设计变量。如果直接硬编码为具体色值（如 `#171717`），将无法正常响应深色模式或主题切换。

若项目中不使用 CSS 级联层，覆盖时建议提高选择器特异度，避免在全局使用裸标签选择器（如 `button { }`）或通用通配符选择器（`* { }`）。

## 关于样式依赖说明

组件库样式不依赖 UnoCSS。文档站中使用 UnoCSS 仅用于向示例中的 `i-carbon-*` 类提供图标支持，该方案属于文档自身的图标渲染实现，并非组件库运行依赖。详情见 [图标](/guide/icons)。

深入了解变量命名规则、`light-dark()` 机制与主题支持范围，请参阅 [CSS 变量](/themes/css-variables) 和 [Neutral 主题](/themes/neutral)。

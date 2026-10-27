---
title: 设计原则
---

# 设计原则

这套组件库的每一个决定都从四句话出发。

- **有组件就用组件。** 组件已经覆盖的东西，不要回头手写 HTML 再拼一遍样式。
- **用语义变量，不写死数值。** 颜色、间距、圆角按用途命名，不按长相命名。名字叫「正文主色」，不叫「深灰」。
- **代码不认识主题。** 业务代码里不出现具体色号和像素值，换主题、切深色就自动跟着变。
- **内部是开放的。** 每个组件都导出，也都能组合。想在上面再加一层就加，不用先跟它打架。

## 八条硬规则

1. 组件能覆盖的，就不要手写。
2. 布局从外往里：先选外壳和区域，再写内容。见 [页面布局](/guide/layout)。
3. 密集数据用行来排：`Table`、`List` 加分隔线，一条一行。`Card` 留给独立的小部件、图集和设置分组。
4. 自定义样式写普通 CSS，放在 `@layer astryx.overrides` 里。要和工具类一起用，见 [主题与样式](/guide/styling)。
5. 颜色、间距、圆角用语义变量：`var(--astryx-color-text-primary)`、`var(--astryx-spacing-4)`。
6. 表单用 `v-model` 双向绑定。`TextInput`、`CheckboxInput` 这些组件都要求传值，没有不受控模式。
7. 导航用 `as` 把根元素换成 `RouterLink`，或者在应用顶层放一个 `LinkProvider`。不要硬写 `<a href>`。
8. 属性拿不准就先查：`astryx-vue component Button`。不要猜，也不要编造 props。

## 主题无关是怎么做到的

主题文件里只有变量，没有结构。每个颜色变量长这样：

```css
--astryx-color-text-primary: light-dark(#171717, #fafafa);
```

`light-dark()` 会根据当前的 `color-scheme` 自动挑浅色或深色。所以业务代码只写 `var(--astryx-color-text-primary)`，深色模式自己就生效了，你不用写第二套样式。

组件自己的结构样式里也是同一套变量。你把主题换成 Gothic，页面所有颜色跟着换，业务代码一个字都不用改。

## 该做与不该做

| 指引 | 实践 |
| --- | --- |
| 推荐 | 用 `HStack`、`VStack`、`Grid` 摆放内容，它们不管颜色和边框。 |
| 推荐 | 颜色写 `var(--astryx-color-*)`，间距写 `var(--astryx-spacing-*)`。 |
| 推荐 | 不确定组件行为时，先跑 `astryx-vue component <名字>` 看一遍。 |
| 避免 | 在原生元素上堆内联样式，绕开组件。 |
| 避免 | 写死颜色（`#fff`）和间距（`16px`）。 |
| 避免 | 硬写 `<a href="/orders">`，站内跳转会整页刷新。 |
| 避免 | 每个列表项、每个页面区块都包一张 `Card`。 |
| 避免 | 拿 `Badge` 当纯装饰。它带含义：状态、分类、数量。只是个点缀的色块用 `Token`，只要一个圆点表示状态用 `StatusDot`。 |

## 关于样式写法

原版 Astryx 支持 StyleX，我们没有。我们的做法是普通 CSS 加 CSS 变量：组件样式全在 `@layer` 里，你在 `astryx.overrides` 层写自己的规则就能盖住它，不用靠增加选择器权重硬顶。

完整的分层顺序、`@layer` 该怎么排、怎么和 Tailwind 或 UnoCSS 一起用，见 [主题与样式](/guide/styling)。

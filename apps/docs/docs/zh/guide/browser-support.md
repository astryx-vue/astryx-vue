---
title: 浏览器支持
---

# 浏览器支持

这套组件不靠 JS 补丁解决样式和浮层问题，而是直接用了浏览器自带的现代能力。好处是代码小、无障碍好、没有额外依赖；代价是有一条底线：太老的浏览器上会掉东西。

先把底线说清楚：

| 浏览器 | 最低版本 |
| --- | --- |
| Chrome、Edge | 123 |
| Safari（含 iOS） | 17.5 |
| Firefox | 120 |

这个底线是 `light-dark()` 定的，因为几乎每个颜色变量都写成 `light-dark(浅色, 深色)`。比它老的浏览器看不懂这个函数，会把整条声明丢掉，页面就只剩黑白和无色状态。

## 我们实际用到的特性

下面每一条都在 `packages/core/styles` 里真实出现过，不是照抄原版清单。

| 特性 | 用在哪 | Chrome | Safari | Firefox |
| --- | --- | --- | --- | --- |
| `light-dark()` | 所有主题颜色变量 | 123 | 17.5 | 120 |
| `@layer` 分层 | 每份样式表的第一行，声明 `astryx.*` 五层顺序 | 99 | 15.4 | 97 |
| `:has()` | 表单状态、列表、聊天、Tab 的父子联动样式 | 105 | 15.4 | 121 |
| `color-mix()` | 计算悬停底色、滑杆、代码块等的过渡色 | 111 | 16.2 | 113 |
| `@property` | 注册按压动画用的自定义属性，让它能做数字动画 | 85 | 16.4 | 128 |
| Popover API | 下拉菜单、提示、命令面板、Toast 视口：用原生 `popover` 和 `popovertarget` | 114 | 17 | 125 |
| `<dialog>` + `showModal()` | 对话框、底部抽屉、大图查看 | 37 | 15.4 | 98 |
| `@starting-style` | 浮层、抽屉、Toast 的入场动画起点 | 117 | 17.5 | 129 |
| 容器查询 `@container` | 分页、步骤条、聊天的窄宽自适应 | 105 | 16 | 110 |
| `text-wrap: balance` / `pretty` | 标题平衡换行、正文避免孤字 | 114 | 17.5 | 121 |
| `:dir()` | 滑杆等少数地方的方向判断 | 120 | 16.4 | 49 |
| 逻辑属性 | 内外边距、圆角、定位大量用 `padding-inline-start` 这类写法 | 87 | 14.1 | 66 |

`@property` 和 `@starting-style` 属于「没有也不崩」：缺了它们，按压动画和入场动画直接不播，界面照常能用。真正决定底线的是 `light-dark()`。

版本号按 MDN 和 caniuse 的记录写成，写这份文档时的数据；拿不准就去 caniuse 搜一下特性名。

## 低于底线会怎样

- **颜色全丢。** `light-dark()` 认不出来，`--astryx-color-*` 拿不到值，文字可能变成默认的黑色。
- **浮层还在，但可能不贴着触发器。** 原生 popover 不支持时，菜单和提示还能打开，位置靠 CSS 兜底，不会那么准。
- **对话框可能打不开。** `<dialog>` 的 `showModal()` 没有时，对话框组件没有降级路径。
- **动画不播。** 入场、按压这类动效消失，内容照样显示。

没有一条会让页面白屏。但视觉按预期走不了，所以老浏览器不算支持。

## 想支持更老的浏览器怎么办

我们没有提供老浏览器专用的回退包，也没有内置 polyfill。可行的做法有三种。

**1. 用户群很老，就守住底线。** 内部工具通常能推浏览器升级，这是最省事的路径。

**2. 用 `@supports` 探测，自己补一份颜色。** 可以在应用入口检查 `light-dark()` 在不在，不在就给变量写死浅色值：

```css
@supports not (color: light-dark(#fff, #000)) {
  :root {
    --astryx-color-text-primary: #000000;
    --astryx-color-background-surface: #ffffff;
  }
}
```

这只补回颜色，浮层定位和动画不会因此变好。

**3. 需要老浏览器上也完整可用，就得自己改。** 包括引入 popover 和 `@starting-style` 的降级写法，或者在项目里重写相关组件的浮层实现。这类改造不在组件库的范围内。

## 我们已经替你处理的兼容细节

- **iOS 输入框自动放大。** iOS 上输入框字号小于 16px 时，聚焦会自动放大页面。所有输入类组件在触摸设备上都把字号顶到至少 `1rem`，靠 `@supports (-webkit-touch-callout: none)` 只在 iOS 上生效。
- **减少动效。** 全局有一条 `prefers-reduced-motion: reduce` 规则，把入场和退场的位移、缩放、透明度变化压成「没有」，各组件也有自己的关闭规则。系统开了「减弱动态效果」，动画就不播。
- **滚动条。** 滚动条样式集中在 `scrollbars.css`，靠 `overlayscrollbars` 这个运行时依赖实现，配色用 `color-mix()` 从文字色混出来，所以深色模式也能跟着走。

## 自己验一遍

在浏览器控制台里粘这段，能查到你手上这台浏览器缺哪几项：

```js
const checks = {
  'light-dark()': CSS.supports('color', 'light-dark(#fff, #000)'),
  '@layer': CSS.supports('at-rule', '@layer a, b;'),
  ':has()': CSS.supports('selector(:has(*))'),
  'color-mix()': CSS.supports('color', 'color-mix(in oklab, red, blue)'),
  'Popover API': typeof HTMLElement.prototype.showPopover === 'function',
  '@container': CSS.supports('container-type', 'inline-size'),
}
console.table(checks)
```

有一项是 `false`，就对照上面的表格看这一项影响什么。`light-dark()` 是 `false` 时，页面颜色基本不可用。

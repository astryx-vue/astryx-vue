---
title: 浏览器支持
---

# 浏览器支持

组件库直接使用现代浏览器标准的原生特性构建样式与浮层交互，不依赖重型的运行时 Polyfill。这种架构方式减少了产物体积与依赖复杂度，并提升了无障碍支持度；相应地，对浏览器的最低版本有明确要求。

基准浏览器支持版本如下：

| 浏览器 | 最低版本 |
| --- | --- |
| Chrome、Edge | 123 |
| Safari（含 iOS） | 17.5 |
| Firefox | 120 |

上述最低版本要求主要由 CSS `light-dark()` 决定。组件库的主题颜色变量几乎全部采用 `light-dark(浅色, 深色)` 语法声明。低于该版本的浏览器无法识别该函数，会导致对应样式规则失效，页面缺失背景与文字前景色。

## 组件库实际使用的现代 Web 特性

以下特性均在 `packages/core/styles` 中实际使用：

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

`@property` 与 `@starting-style` 属于渐进增强特性：在不支持的浏览器中，按压反馈与入场动画会自动跳过，不影响核心交互功能。决定版本硬性约束的主要是 `light-dark()`。

版本数据基于 MDN 与 Can I Use 记录整理。

## 低于基准版本时的表现

- **颜色缺失**：无法解析 `light-dark()`，`--astryx-color-*` 无法正确取值，页面可能显示为默认系统颜色。
- **浮层定位偏差**：不支持原生 Popover API 时，菜单与提示气泡仍可打开，但定位依赖样式回退方案。
- **对话框无法唤起**：若不支持 `<dialog>` 的 `showModal()`，对话框无法正常挂载和阻断背景。
- **动效跳过**：入场平移与微交互动画跳过过渡阶段，直接展示最终状态。

上述情况虽不会直接导致脚本崩溃白屏，但视觉与交互已无法达到预期效果，因此不建议在老旧浏览器中运行。

## 兼容老旧浏览器的应对建议

组件库未提供面向旧版浏览器的专用兼容包，亦未内置 Polyfill。如需支持旧版环境，可参考以下方案：

**1. 推动环境升级**：若项目面向企业内部系统，建议推动用户升级至现代浏览器版本。

**2. 使用 `@supports` 兜底基础颜色**：在入口样式中检测 `light-dark()` 支持情况，并在不支持时手动赋予默认色值：

```css
@supports not (color: light-dark(#fff, #000)) {
  :root {
    --astryx-color-text-primary: #000000;
    --astryx-color-background-surface: #ffffff;
  }
}
```

该方式可恢复页面可读性，但浮层与动效依然受限。

**3. 自行引入 Polyfill 或重写相关模块**：包括引入 popover 和 `@starting-style` 的降级写法，或者在项目里重写相关组件的浮层实现。这类改造不在组件库的范围内。

## 内置的兼容性适配处理

- **iOS 聚焦缩放抑制**：iOS Safari 在输入框字号小于 16px 时聚焦会自动放大视口。组件库在触控设备上统一将输入控件的基准字号设为至少 `1rem`，并通过 `@supports (-webkit-touch-callout: none)` 约束该规则仅作用于 iOS 设备。
- **减少动效适配**：样式表内置了 `prefers-reduced-motion: reduce` 媒体查询规则，当系统开启减少动效时，自动消除组件平移、缩放与透明度渐变动画。
- **平滑滚动条支持**：自绘滚动条样式集中维护在 `scrollbars.css` 中，基于 `overlayscrollbars` 实现，滑块配色通过 `color-mix()` 动态衍生，自适应明暗模式。

## 浏览器特性自测方法

在浏览器开发者工具控制台中执行以下脚本，即可检测当前运行环境对核心特性的支持状态：

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

若其中任意一项返回 `false`，可对照上表排查对应功能的影响范围。若 `light-dark()` 返回 `false`，则表明页面色彩无法正常渲染。

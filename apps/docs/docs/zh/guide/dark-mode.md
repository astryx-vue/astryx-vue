---
title: 深色模式
---

# 深色模式

Neutral 主题不需要单独引入一份额外的深色 CSS 样式表。所有颜色变量在底层均直接采用现代 CSS 标准的 `light-dark(浅色值, 深色值)` 语法，浏览器会根据元素当前所处的 `color-scheme` 状态，自动决定显示浅色还是深色。

当你引入 `@astryx-vue/themes/neutral.css` 之后，`:root` 根节点上的 `color-scheme` 默认被声明为 `light dark`。页面默认自适应操作系统的外观偏好，你自己的 CSS 写在 `html` 上的 `color-scheme` 优先。主题的包装元素不声明配色，取外面的那一种。

## 手动强制指定浅色或深色

如果你希望在应用中提供手动切换按钮，只需在包裹界面的最外层元素（通常是 `<html>` 标签）上设置属性：

```html
<!-- 强制使用深色模式 -->
<html data-astryx-color-mode="dark">
```

```html
<!-- 强制使用浅色模式 -->
<html data-astryx-color-mode="light">
```

这两个属性会自动将下层的 `color-scheme` 分别置为 `dark` 或 `light`，整个页面的颜色变量会瞬间自适应切换，完全无需动态替换或重新请求任何 CSS 文件。

## 文档站的实现方式

文档站右上角的明暗切换开关，依托的是 VitePress 自带的 `appearance` 配置。当切换到深色模式时，VitePress 会在 `<html>` 上添加 `class="dark"`，并同步将 `color-scheme` 置为 `dark`，此时 Neutral 的 `light-dark()` 就会自然取深色那一档的色值。

这属于文档站本身的接入方式，组件库自身并不强制绑定必须叫 `.dark` 的类名。在你的实际业务项目中，推荐使用上面提到的 `data-astryx-color-mode` 属性，或者直接设置 CSS `color-scheme`。

## system 的 Theme 跟随页面

`mode="system"` 的 `Theme` 取外面页面的明暗，而不是直接看设备设置。页面根的 `color-scheme` 说了算：写成 `light` 或 `dark`，`Theme` 里就是那一种；写成 `light dark`（`reset.css` 和 Neutral 的 `:root` 规则都是这样写的）才跟随读者的系统设置。根上没有 `color-scheme`、也没有 `<meta name="color-scheme">` 时，页面按浅色算。所以宿主把页面画成深色时，`Theme` 里面也是深色主题，`useTheme().mode` 报告的也是同一种。主题自己写的 `@dark`、`@light` 组件样式同样跟着走：根 `Theme` 会把它画的明暗写在 `<html data-astryx-scheme>` 上。被强制了浅色或深色的 `Theme` 包着时，里面的 `system` `Theme` 回到跟随读者的系统设置。

## 局部区域独立切换明暗

有时你可能希望全局是浅色背景，但某一处代码编辑器或卡片单独以深色展示。你可以使用 `Theme` 组件，通过 `mode="dark"` 或 `mode="light"` 属性设置局部子树的明暗模式，具体用法请参阅 [Theme 组件](/components/theme)。

> **定制提示**：不要为深色模式重新取一套独立的变量名（比如不要额外造出 `--color-bg-dark`）。当你想修改某个颜色的具体色值时，依然直接覆盖原来的变量名，并在 `light-dark()` 函数中同时声明好浅色与深色的取值即可。更详尽的说明可参阅 [扩展主题](/guide/extending-themes)。

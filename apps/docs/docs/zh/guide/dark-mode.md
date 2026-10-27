---
title: 深色模式
---

# 深色模式

Neutral 主题不需要单独引入一份额外的深色 CSS 样式表。所有颜色变量在底层均直接采用现代 CSS 标准的 `light-dark(浅色值, 深色值)` 语法，浏览器会根据元素当前所处的 `color-scheme` 状态，自动决定显示浅色还是深色。

当你引入 `@astryx-vue/themes/neutral.css` 之后，`:root` 根节点以及 `[data-astryx-theme='neutral']` 元素上的 `color-scheme` 默认被声明为 `light dark`。这意味着组件默认就能自适应操作系统的外观偏好，也能继承祖先节点已经设定的明暗模式。

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

## 局部区域独立切换明暗

有时你可能希望全局是浅色背景，但某一处代码编辑器或卡片单独以深色展示。你可以使用 `Theme` 组件，通过 `mode="dark"` 或 `mode="light"` 属性设置局部子树的明暗模式，具体用法请参阅 [Theme 组件](/components/theme)。

> **定制提示**：不要为深色模式重新取一套独立的变量名（比如不要额外造出 `--color-bg-dark`）。当你想修改某个颜色的具体色值时，依然直接覆盖原来的变量名，并在 `light-dark()` 函数中同时声明好浅色与深色的取值即可。更详尽的说明可参阅 [扩展主题](/themes/extending)。

---
title: 深色模式
---

# 深色模式

Neutral 主题无需单独引入深色样式表。所有颜色变量在底层直接采用标准 CSS `light-dark(浅色值, 深色值)` 语法，浏览器根据元素所处的 `color-scheme` 状态，自动计算浅色或深色值。

引入 `@astryx-vue/themes/neutral.css` 后，`:root` 根节点及 `[data-astryx-theme='neutral']` 元素上的 `color-scheme` 默认声明为 `light dark`。这表明组件默认能够跟随系统外观偏好，并继承祖先节点已设定的明暗模式。

## 手动指定浅色或深色

若需在应用中提供明暗切换功能，只需在根元素（通常为 `<html>` 标签）上添加对应属性：

```html
<!-- 强制使用深色模式 -->
<html data-astryx-color-mode="dark">
```

```html
<!-- 强制使用浅色模式 -->
<html data-astryx-color-mode="light">
```

上述属性会自动将内部的 `color-scheme` 设为 `dark` 或 `light`，页面内的颜色变量会立即动态生效，无需重新请求或替换 CSS 文件。

## 文档站接入参考

文档站导航栏的明暗切换开关基于 VitePress 内置的 `appearance` 特性。切换到深色模式时，VitePress 会在 `<html>` 元素上添加 `class="dark"` 并同步声明 `color-scheme` 为 `dark`，此时 `light-dark()` 自动切换至深色分支。

此方案仅为文档站的展示实现，组件库本身并不强制依赖 `.dark` 类名。在业务项目中，推荐使用上述 `data-astryx-color-mode` 属性，或直接控制元素的 CSS `color-scheme` 属性。

## 局部区域独立明暗

如果应用全局为浅色背景，但局部区域（如代码块、侧边栏或特定卡片）需要以深色呈现，可使用 `Theme` 组件配合 `mode="dark"` 或 `mode="light"` 属性限定局部子树的色彩模式，具体用法请参阅 [Theme 组件](/components/theme)。

> **定制提示**：无需为深色模式额外声明独立的变量名（例如避免新增 `--color-bg-dark`）。自定义特定颜色时，直接覆盖原有的变量名并在 `light-dark()` 函数中同时定义浅色与深色取值即可。详细说明请参阅 [扩展主题](/themes/extending)。

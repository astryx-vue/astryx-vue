---
aside: false
title: Chocolate 主题
---

# Chocolate（巧克力暖棕主题）

Chocolate 是一套沉稳温润的暖色系主题。以暖棕色与米色为主色调，适合长文阅读、个人站点与生活方式类页面。

- **字体配置**：正文使用 Albert Sans 字体，标题采用衬线字体 Fraunces。
- **作用范围**：仅对声明了 `data-astryx-theme="chocolate"` 的元素及其子树生效，不影响全局 `:root`。

## 引入与使用

在项目中引入 Chocolate 主题样式表：

```ts
import '@astryx-vue/themes/chocolate.css'
```

在目标容器元素上声明主题属性即可：

```html
<div data-astryx-theme="chocolate">
  <!-- 此容器内的所有 astryx-vue 组件都将自动呈现 Chocolate 风格 -->
</div>
```

## 视觉预览

<ThemeStage theme="chocolate" />

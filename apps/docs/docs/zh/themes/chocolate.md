---
aside: false
title: Chocolate 主题
---

# Chocolate（巧克力暖棕主题）

Chocolate 是一套沉稳、典雅的暖色系主题。它以醇厚的暖棕色与温润的米色为主基调，散发出精致的人文质感，适合阅读类产品、品质博客或咖啡生活等调性鲜明的页面。

- **字体配置：** 正文采用 Albert Sans 字体，标题采用复古雅致的衬线字体 Fraunces。
- **作用范围：** 仅对带有 `data-astryx-theme="chocolate"` 的元素及其子树生效，不会污染全局 `:root`。

## 引入与使用

在项目中引入 Chocolate 主题样式表：

```ts
import '@astryx-vue/themes/chocolate.css'
```

在需要使用该风格的容器标签上加上主题标记即可：

```html
<div data-astryx-theme="chocolate">
  <!-- 此容器内的所有 astryx-vue 组件都将自动呈现 Chocolate 风格 -->
</div>
```

## 视觉预览

<ThemeStage theme="chocolate" />

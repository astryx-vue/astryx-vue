---
aside: false
title: Butter 主题
---

# Butter（黄油暖金主题）

Butter 是一套暖金调性的主题。它采用暖金色作为背景表面，搭配蓝色作为视觉点缀，适合生活方式类、创意展示或温暖调性的产品界面。

- **字体配置：** 正文采用 Outfit 字体，展示型大字号采用复古手写风格的 Sarina。
- **作用范围：** 仅对带有 `data-astryx-theme="butter"` 的元素及其子树生效，不会污染全局 `:root`。

## 引入与使用

在项目中引入 Butter 主题样式表：

```ts
import '@astryx-vue/themes/butter.css'
```

在需要使用该风格的容器标签上加上主题标记即可：

```html
<div data-astryx-theme="butter">
  <!-- 此容器内的所有 astryx-vue 组件都将自动呈现 Butter 风格 -->
</div>
```

## 视觉预览

<ThemeStage theme="butter" />

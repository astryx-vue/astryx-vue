---
aside: false
title: Butter 主题
---

# Butter（黄油暖金主题）

Butter 是一套温和明快的主题。采用暖金色作为主要界面底色，搭配蓝色作为重点交互强调色，适合创意展示或生活消费类产品。

- **字体配置**：正文使用 Outfit 字体，展示大标题采用复古风格的 Sarina 字体。
- **作用范围**：仅对声明了 `data-astryx-theme="butter"` 的元素及其子树生效，不影响全局 `:root`。

## 引入与使用

在项目中引入 Butter 主题样式表：

```ts
import '@astryx-vue/themes/butter.css'
```

在目标容器元素上声明主题属性即可：

```html
<div data-astryx-theme="butter">
  <!-- 此容器内的所有 astryx-vue 组件都将自动呈现 Butter 风格 -->
</div>
```

## 视觉预览

<ThemeStage theme="butter" />

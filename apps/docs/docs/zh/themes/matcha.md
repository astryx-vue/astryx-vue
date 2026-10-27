---
aside: false
title: Matcha 主题
---

# Matcha（抹茶清新草木绿主题）

Matcha 是一套自然宁静的绿色系主题。采用低饱和度的草木绿与温和灰绿为基调，适合笔记知识库、健康生活或个人主页等场景。

- **字体配置**：正文使用 DM Sans 字体，标题采用手写风格的 Playwrite US Trad 字体。
- **作用范围**：仅对声明了 `data-astryx-theme="matcha"` 的元素及其子树生效，不影响全局 `:root`。

## 引入与使用

在项目中引入 Matcha 主题样式表：

```ts
import '@astryx-vue/themes/matcha.css'
```

在目标容器元素上声明主题属性即可：

```html
<div data-astryx-theme="matcha">
  <!-- 此容器内的所有 astryx-vue 组件都将自动呈现 Matcha 风格 -->
</div>
```

## 视觉预览

<ThemeStage theme="matcha" />

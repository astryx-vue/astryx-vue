---
aside: false
title: Matcha 主题
---

# Matcha（抹茶清新草木绿主题）

Matcha 是一套自然、宁静、呼吸感十足的绿色系主题。它以低饱和度的草木绿与温和灰绿为基调，给人以放松、专注的心流感受，适合笔记软件、健康生活、个人知识库或自然系网站。

- **字体配置：** 正文采用清晰明朗的 DM Sans 字体，标题采用带有轻盈手写韵味的 Playwrite US Trad。
- **作用范围：** 仅对带有 `data-astryx-theme="matcha"` 的元素及其子树生效，不会污染全局 `:root`。

## 引入与使用

在项目中引入 Matcha 主题样式表：

```ts
import '@astryx-vue/themes/matcha.css'
```

在需要使用该风格的容器标签上加上主题标记即可：

```html
<div data-astryx-theme="matcha">
  <!-- 此容器内的所有 astryx-vue 组件都将自动呈现 Matcha 风格 -->
</div>
```

## 视觉预览

<ThemeStage theme="matcha" />

---
aside: false
title: Gothic 主题
---

# Gothic（哥特冷峻深色主题）

Gothic 是一套固定深色的夜间主题。采用冷蓝灰色作为表面底色。即使外部页面处于浅色模式，应用了 Gothic 的容器仍保持深色模式渲染。

- **字体配置**：正文使用 Fustat 字体，展示大标题采用个性强烈的 Manufacturing Consent 字体。
- **纯深色特性**：不受外部浅色模式影响，始终保持暗色调。
- **作用范围**：仅对声明了 `data-astryx-theme="gothic"` 的元素及其子树生效，不影响全局 `:root`。

## 引入与使用

在项目中引入 Gothic 主题样式表：

```ts
import '@astryx-vue/themes/gothic.css'
```

在目标容器元素上声明主题属性即可：

```html
<div data-astryx-theme="gothic">
  <!-- 此容器内的所有 astryx-vue 组件都将自动呈现 Gothic 纯深色风格 -->
</div>
```

## 视觉预览

<ThemeStage theme="gothic" />

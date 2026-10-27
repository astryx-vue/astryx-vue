---
aside: false
title: Stone 主题
---

# Stone（原石极简板岩主题）

Stone 是一套极简风格的现代主题。融合天然石材色与板岩灰，适合设计工作室官网、技术文档与作品集页面。

- **字体配置**：正文使用现代无衬线字体 Figtree，标题采用几何感鲜明的 Montserrat 字体。
- **作用范围**：仅对声明了 `data-astryx-theme="stone"` 的元素及其子树生效，不影响全局 `:root`。

## 引入与使用

在项目中引入 Stone 主题样式表：

```ts
import '@astryx-vue/themes/stone.css'
```

在目标容器元素上声明主题属性即可：

```html
<div data-astryx-theme="stone">
  <!-- 此容器内的所有 astryx-vue 组件都将自动呈现 Stone 风格 -->
</div>
```

## 视觉预览

<ThemeStage theme="stone" />

---
aside: false
title: Y2K 主题
---

# Y2K（千禧复古极简主题）

Y2K 是一套致敬 2000 年代早期互联网风格的主题。采用长春花蓝与奶油色搭配，并将组件圆角统一收缩为 0px 直角，整体视觉轮廓分明。

- **直角规范**：按钮、卡片、输入框均采用直角造型，呈现利落的机械复古风格。
- **字体配置**：正文使用几何无衬线字体 Poppins，展示大标题使用古典衬线字体 Crimson Text。
- **作用范围**：仅对声明了 `data-astryx-theme="y2k"` 的元素及其子树生效，不影响全局 `:root`。

## 引入与使用

在项目中引入 Y2K 主题样式表：

```ts
import '@astryx-vue/themes/y2k.css'
```

在目标容器元素上声明主题属性即可：

```html
<div data-astryx-theme="y2k">
  <!-- 此容器内的所有 astryx-vue 组件都将自动呈现 Y2K 硬朗直角风格 -->
</div>
```

## 视觉预览

<ThemeStage theme="y2k" />

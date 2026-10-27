---
aside: false
title: 主题概览
---

# 主题概览

组件结构负责布局骨架，主题则定义了视觉表现：包含组件颜色、文字字体、圆角半径、投影阴影以及交互动效过渡速度。组件结构样式内置于 `@astryx-vue/core`，视觉样式与设计令牌由主题包 `@astryx-vue/themes` 提供。

## 基础起步配置

在应用主入口（如 `main.ts`）引入默认的 Neutral 主题样式：

```ts
import '@astryx-vue/themes/neutral.css'
```

Neutral 主题会自动将基础变量注入至根节点 `:root`。引入 `neutral.css` 后，页面即具备了默认配色方案与字体栈，无需手动在 HTML 标签上声明额外属性。

## 全局或局部切换主题

若需对整页或特定容器切换主题（如 Butter 或 Matcha），在对应的 HTML 元素上配置 `data-astryx-theme` 属性即可：

```html
<!-- 整个网页换主题：直接加在 html 或 body 标签上 -->
<html data-astryx-theme="butter">
  ...
</html>

<!-- 局部区块换主题：只让这个卡片使用巧克力主题 -->
<div data-astryx-theme="chocolate">
  <Button label="特色操作" />
</div>
```

**说明**：
- 仅默认的 Neutral 主题会写入 `:root` 全局作用域。其它内置主题（Butter、Chocolate、Gothic、Matcha、Stone、Y2K）均基于 `[data-astryx-theme='...']` 属性选择器实现作用域隔离，不会对外部区域造成样式污染。
- 所有主题均内置正文字体 Figtree 与等宽字体 JetBrains Mono。Butter、Chocolate、Gothic、Matcha、Stone、Y2K 等主题会按需引入各自特色的标题字体。

## 主题画廊

点击下方画廊可直观查看每套主题的视觉表现：

<ThemeGallery />

## 更多参考

- **查看各主题详情**：[Neutral](/themes/neutral)、[Butter](/themes/butter)、[Chocolate](/themes/chocolate)、[Gothic](/themes/gothic)、[Matcha](/themes/matcha)、[Stone](/themes/stone)、[Y2K](/themes/y2k)。
- **底层变量规范**：样式变量清单见 [CSS 变量](/themes/css-variables)；设计系统原始变量映射见 [Design token](/themes/tokens)。
- **各维度配置详解**：查阅 [颜色](/themes/color)、[排版与字体](/themes/typography)、[动画刻度](/themes/motion) 与 [间距、圆角与阴影](/themes/scale)。
- **自定义与覆盖**：微调特定数值或品牌色参考 [扩展主题](/themes/extending)；在 Vue 模板中动态为局部子树注入主题对象，推荐使用 [Theme 主题容器](/components/theme)、[MediaTheme 媒体主题](/components/media-theme) 与 [SyntaxTheme 语法高亮主题](/components/syntax-theme)。

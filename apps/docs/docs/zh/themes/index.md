---
aside: false
title: 主题概览
---

# 主题概览

如果把组件看作房子的骨架，那主题就是给房子做硬装和软装：它决定了按钮是什么颜色、文字用什么字体、卡片四角有多圆润、阴影有多深，以及点一下时动画动得多快。组件本身的骨架和排版结构已经内置在 `@astryx-vue/core` 里，样式和配色则全部由主题包 `@astryx-vue/themes` 提供。

## 最简单的起步方式

在整个应用的主入口（如 `main.ts`）引入默认的 Neutral 主题样式文件：

```ts
import '@astryx-vue/themes/neutral.css'
```

因为 Neutral 会自动把一套基础变量写入根节点 `:root`，所以只要引入了 `neutral.css`，你的整个网页就默认拥有了标准的黑白灰配色与字体，甚至不需要在标签上手动加任何属性。

## 切换或局部使用其他主题

如果你想让整个网站或者某个局部区块换上别的主题（例如温暖柔和的 Butter、清新自然的 Matcha），只需给对应的 HTML 标签加上 `data-astryx-theme` 属性：

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

**提示：**
- 只有默认的 Neutral 会改动全局的 `:root`。其他预设主题（Butter、Chocolate、Gothic、Matcha、Stone、Y2K）都通过属性选择器 `[data-astryx-theme='...']` 生效，不会影响外部其他区域的样式。
- 所有主题都会自带并加载西文字体 Figtree 与等宽代码字体 JetBrains Mono。像 Butter、Chocolate、Gothic、Matcha、Stone、Y2K 还会额外按需下载它们特有的特色标题字体。

## 主题画廊

你可以点击下方画廊直观感受每套主题的视觉风格：

<ThemeGallery />

## 深入了解更多

- **查看各套主题详细信息：** [Neutral](/themes/neutral)、[Butter](/themes/butter)、[Chocolate](/themes/chocolate)、[Gothic](/themes/gothic)、[Matcha](/themes/matcha)、[Stone](/themes/stone)、[Y2K](/themes/y2k)。
- **底层原理与变量规范：** 想知道所有可用的样式变量名，看 [CSS 变量](/themes/css-variables)；想了解变量与原始设计规范的映射关系，看 [Design token](/themes/tokens)。
- **各维度配置详解：** 查看 [颜色](/themes/color)、[排版与字体](/themes/typography)、[动画刻度](/themes/motion) 以及 [间距、圆角与阴影](/themes/scale)。
- **自定义微调：** 如果只想改某几个数值或品牌色，可以参考 [扩展主题](/themes/extending)；若需要在 Vue 模板里动态给局部子组件树套用计算后的主题对象，推荐使用 [Theme 主题容器](/components/theme)、[MediaTheme 媒体主题](/components/media-theme) 和 [SyntaxTheme 语法高亮主题](/components/syntax-theme)。

---
layout: component-docs
title: 媒体主题
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { mediaThemeImageOverlay, mediaThemeLightScrim, mediaThemeOverview } from '../../../../components/demos/media-theme'
</script>

## 使用方法

`MediaTheme` 是反色表面上的提供者，用在图片叠字、遮罩、toast 和 tooltip 上。它设置 `data-astryx-media`，让文字、图标和按钮改用深底或浅底上的颜色。它自己不铺背景，背景写在父元素上。

`mode` 必填：`dark`、`light`、`auto` 或 `off`。`auto` 测量父元素背景，选读得清的一边；周围文字对比已经达到 3:1 时选 `off`。`fallback` 是还没量到、或量不到时用的一边，默认 `dark`。`off` 仍渲染这个元素，只是去掉媒体属性，子节点不会被拆掉重建。

`useMediaTheme()` 返回解析后的模式。两者都从 `@astryx-vue/core/Theme` 引入。

```vue
<script setup lang="ts">
import { MediaTheme } from '@astryx-vue/core/Theme'
</script>

<template>
  <div style="background: var(--astryx-color-background-inverted, #171717)">
    <MediaTheme mode="auto">
      <p>Readable on this surface</p>
    </MediaTheme>
  </div>
</template>
```

主题可以用 `defineTheme()` 的 `onDark` 和 `onLight` 给这些表面加 token。

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 用在深色图片、遮罩，或其他需要反色的表面上。 |
| <Badge variant="success">推荐</Badge> | 表面颜色来自主题 token 时，优先用 <code>mode="auto"</code>。 |
| <Badge variant="success">推荐</Badge> | 背景写在父元素上。MediaTheme 只翻转 token。 |
| <Badge variant="error">避免</Badge> | 用它做整页深色模式。整页用 <code>Theme</code> 的 <code>mode="dark"</code> 或 <code>mode="system"</code>。 |

## 示例

<DemoExample
  :demo="mediaThemeOverview"
  description="一块压在深色图片上的叠层。文字、图标、徽章和几种按钮都改成深底上可读的颜色。"
  locale="zh"
  title="MediaTheme — Media Overlay"
/>

<DemoExample
  :demo="mediaThemeImageOverlay"
  description="常见的图片卡片：文字和操作放在深色渐变上，并用 MediaTheme mode=&quot;dark&quot; 包住。"
  locale="zh"
  title="MediaTheme — Image Overlay"
/>

<DemoExample
  :demo="mediaThemeLightScrim"
  description="图片上的浅色遮罩。用 MediaTheme mode=&quot;light&quot;，文字和 ghost 按钮走浅底上的深色。"
  locale="zh"
  title="MediaTheme — Light Scrim"
/>

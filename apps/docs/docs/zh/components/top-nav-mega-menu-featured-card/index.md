---
layout: component-docs
title: 顶部导航大菜单特色卡片
outline: false
footer: false
---

<script setup lang="ts">
import { topNavMegaMenuFeaturedCardOverview } from '../../../../components/demos/top-nav-mega-menu-featured-card'
import { TopNavMegaMenuFeaturedCard } from '@astryx-vue/core/TopNav'
</script>

## 使用方法

这是放在 `TopNavMegaMenu` 的 `featured` 插槽里的标准推荐卡片。它把「图片 + 标题 + 说明 + 行动链接」固定成一套版式，各个大菜单里看起来都一致。

```vue
<script setup lang="ts">
import { TopNavMegaMenuFeaturedCard } from '@astryx-vue/core/TopNav'
</script>

<template>
  <TopNavMegaMenuFeaturedCard
    title="What's New"
    description="Check out the latest features and improvements in the Q2 release."
    link-label="Read the changelog"
    link-href="#changelog"
  />
</template>
```

标题是必填的。传了 `image` 就在正文上方显示图片；不传 `imageAlt` 时图片只当装饰，因为卡片上已经有可见标题，读屏跳过它反而更干净。`linkLabel` 加 `linkHref` 会在卡片底部多出一个行动链接，`linkHref` 不传就用 `href`。只传 `href`、不传 `linkLabel` 时，整张卡片本身就是一个链接。默认插槽里的内容显示在说明文字下方。

<ComponentAnatomy />

## 示例

<DemoExample :demo="topNavMegaMenuFeaturedCardOverview" title="基础" description="带标题、说明和行动链接的推广卡片。放进 TopNavMegaMenu 的 featured 插槽，用来突出公告类内容。" locale="zh" />

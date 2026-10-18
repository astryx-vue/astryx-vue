---
layout: component-docs
title: 顶部导航大菜单
outline: false
footer: false
---

<script setup lang="ts">
import { topNavMegaMenuOverview } from '../../../../components/demos/top-nav-mega-menu'
import { TopNavMegaMenu } from '@astryx-vue/core/TopNav'
</script>

## 使用方法

鼠标移上去就往下弹出一整块面板的导航项。面板内容用插槽写：格子里的链接放默认插槽，右侧的推荐卡放 `featured` 插槽。每个链接都用 `TopNavMegaMenuItem` 写，桌面面板和手机抽屉共用同一份写法。放进手机抽屉时，它自己会变成一行可以展开收起的小标题。

```vue
<script setup lang="ts">
import { TopNav, TopNavHeading, TopNavItem, TopNavMegaMenu, TopNavMegaMenuFeaturedCard, TopNavMegaMenuItem } from '@astryx-vue/core/TopNav'
</script>

<template>
  <TopNav label="Main navigation">
    <template #heading>
      <TopNavHeading heading="DevTools" href="#home" />
    </template>
    <TopNavItem href="#overview" label="Overview" />
    <TopNavMegaMenu label="Products">
      <TopNavMegaMenuItem title="Deploy" description="Ship to production in seconds" href="#deploy" />
      <TopNavMegaMenuItem title="Documentation" description="Guides, references, and tutorials" href="#documentation" />
      <template #featured>
        <TopNavMegaMenuFeaturedCard
          title="What's New"
          description="Check out our latest features and improvements in the Q2 release."
          link-label="Read the changelog"
          link-href="#changelog"
        />
      </template>
    </TopNavMegaMenu>
  </TopNav>
</template>
```

<ComponentAnatomy />

## 示例

<DemoExample :demo="topNavMegaMenuOverview" title="基础" description="顶栏里一个大菜单入口，点开是带说明的链接格子。一个栏目下有多个去处、而且每个去处都值得解释一句时用它。" locale="zh" />

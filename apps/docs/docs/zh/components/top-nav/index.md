---
layout: component-docs
title: 顶部导航
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { topNavCentered, topNavEnterprise, topNavHeading, topNavLogo, topNavMega, topNavMenu, topNavMenus } from '../../../../components/demos/top-nav'
</script>

## 使用方法

`TopNav` 是页面顶部的导航地标。`heading`、`start`、默认插槽和 `center` 从左到右排，`end` 靠右。`TopNavHeading` 可以带标志、上下行和标题菜单。`TopNavMenu` 打开普通菜单，`TopNavMegaMenu` 打开带分组和推荐卡的大菜单。推荐卡可以放图片，行动文字单独成链接。方向键在菜单项之间移动，Escape 关闭。

传入 `mobileQuery` 后，查询命中时起始和中间的内容收进 `MobileNav`，栏上只留标题、结束内容和开关。同一个插槽不会同时出现在两处。

```vue
<script setup lang="ts">
import { TopNav, TopNavHeading, TopNavMenu } from '@astryx-vue/core/TopNav'
</script>

<template>
  <TopNav mobile-query="(max-width: 800px)">
    <template #heading>
      <TopNavHeading heading="Northwind" href="/" />
    </template>
    <TopNavMenu label="产品" :items="[{ label: '分析', href: '/analytics' }]" />
  </TopNav>
</template>
```


<ComponentAnatomy />

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 菜单项用 `href` 做导航。键盘用 ArrowDown 打开，方向键移动，Escape 关闭。 |
| <Badge variant="success">推荐</Badge> | 窄屏用 `mobileQuery`，不要把同一组链接再复制进抽屉。 |
| <Badge variant="error">避免</Badge> | 大菜单里不要塞表单。它是导航，不是对话框。 |

## 示例

<DemoExample :demo="topNavCentered" description="导航项居中。标题留在起始侧，操作留在结束侧。" locale="zh" title="居中导航" />

<DemoExample :demo="topNavEnterprise" description="带图标的导航项、搜索、通知，以及一个主要操作。" locale="zh" title="应用顶栏" />

<DemoExample :demo="topNavMenu" description="悬停打开产品菜单，每一项有图标和说明。" locale="zh" title="悬停菜单" />

<DemoExample :demo="topNavMega" description="通栏的大菜单里有产品项。推荐卡上方是图片，底部的行动文字单独跳转。" locale="zh" title="大菜单" />

<DemoExample :demo="topNavHeading" description="标题有套件名、产品名和账户名。套件名可以单独跳转，箭头打开产品菜单。" locale="zh" title="带菜单的标题" />

<DemoExample :demo="topNavMenus" description="一条顶栏里有多个悬停菜单，指针移到另一个菜单时前一个会关上。" locale="zh" title="多个下拉菜单" />

<DemoExample :demo="topNavLogo" description="标题前面是产品标志，结束侧是个人资料操作。" locale="zh" title="带标志" />

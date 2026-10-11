---
layout: component-docs
title: 顶部导航
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { topNavMega } from '../../../../components/demos/top-nav'
</script>

## 使用方法

`TopNav` 是页面顶部的导航地标。`heading`、`start`、默认插槽和 `center` 从左到右排，`end` 靠右。`TopNavMenu` 打开普通菜单，`TopNavMegaMenu` 打开带分组和推荐卡的大菜单。方向键在菜单项之间移动，Escape 关闭。

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

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 菜单项用 `href` 做导航。键盘用 ArrowDown 打开，方向键移动，Escape 关闭。 |
| <Badge variant="success">推荐</Badge> | 窄屏用 `mobileQuery`，不要把同一组链接再复制进抽屉。 |
| <Badge variant="error">避免</Badge> | 大菜单里不要塞表单。它是导航，不是对话框。 |

## 示例

<DemoExample
  :demo="topNavMega"
  description="悬停或点击「产品」和「解决方案」。视口窄于 800px 时，这些项收进移动导航。"
  locale="zh"
  title="菜单与大菜单"
/>

---
layout: component-docs
title: 侧边导航分组
outline: false
footer: false
---

<script setup lang="ts">
import { sideNavSectionBasic } from '../../../../components/demos/side-nav-section'
</script>

## 使用方法

侧栏里的一个分组，带分组标题、可选的副标题和末尾内容。

一个分组就是一簇有名字的 `SideNavItem`。`subtitle` 在标题下面再加一行小字，`end` 靠在标题这一行的末尾。侧栏收成窄栏后，标题只是视觉上藏起来，读屏仍然能读到分组名；`isHeaderHidden` 则在任何宽度下都藏起来。

```ts
import { SideNavSection } from '@astryx-vue/core/SideNav'
```

## 示例

常见的用法和不同的状态。

<DemoExample :demo="sideNavSectionBasic" title="基础" description="把相关的侧边导航项放进带标题的分组里。导航长起来后，用分组切成一簇一簇，像「总览」和「账户」这样扫一眼就能找到。" locale="zh" />

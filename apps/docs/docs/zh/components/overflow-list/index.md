---
layout: component-docs
title: 溢出列表
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { overflowListActions, overflowListBadges, overflowListCapped, overflowListCollapseStart, overflowListMultiRow } from '../../../../components/demos/overflow-list'
</script>

## 使用方法

`OverflowList` 按容器宽度决定能放下几项，剩下的收进「更多」菜单。默认从末尾收起，`collapseFrom="start"` 时从开头收起。`visibleCount` 可以直接指定可见项数，跳过测量，测试时用得上。

每一项是 `{ label, href?, iconClass? }`。自定义外观用 `item` 插槽，自定义溢出菜单用 `overflow` 插槽。

```vue
<script setup lang="ts">
import { OverflowList } from '@astryx-vue/core/OverflowList'

const items = [
  { href: '/home', label: '首页' },
  { href: '/files', label: '文件' },
  { href: '/settings', label: '设置' },
]
</script>

<template>
  <OverflowList :items="items" />
</template>
```

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 让列表宽度跟着父级走。项一多，组件会自己把放不下的收进菜单。 |
| <Badge variant="success">推荐</Badge> | 需要至少留下几项时设置 <code>minVisibleItems</code>。 |
| <Badge variant="error">避免</Badge> | 不要同时用插槽把同一项再画一遍到菜单外面。可见项和溢出项是切开的两段。 |

## 示例

<DemoExample :demo="overflowListBadges" description="徽章排成一行，放不下的收成一个数量徽章。" locale="zh" title="徽章标签" />

<DemoExample :demo="overflowListCapped" description="这一行最多留下三项，其余进下拉菜单。" locale="zh" title="限制可见项" />

<DemoExample :demo="overflowListCollapseStart" description="从开头收起，末尾的步骤留在外面。" locale="zh" title="从开头收起" />

<DemoExample :demo="overflowListActions" description="放不下的按钮收进下拉菜单。" locale="zh" title="下拉操作" />

<DemoExample :demo="overflowListMultiRow" description="先排满两行，剩下的收成一个数量徽章。" locale="zh" title="多行标签" />

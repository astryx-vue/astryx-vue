---
layout: component-docs
title: 溢出列表
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { overflowListActions, overflowListBadges, overflowListCapped, overflowListCollapseStart, overflowListMultiRow } from '../../../../components/demos/overflow-list'
import { toolbarFilter } from '../../../../components/demos/toolbar'
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


<ComponentAnatomy />

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 让列表宽度跟着父级走。项一多，组件会自己把放不下的收进菜单。 |
| <Badge variant="success">推荐</Badge> | 需要至少留下几项时设置 <code>minVisibleItems</code>。 |
| <Badge variant="error">避免</Badge> | 不要同时用插槽把同一项再画一遍到菜单外面。可见项和溢出项是切开的两段。 |

## 示例

<DemoExample
  :demo="overflowListCapped"
  description="maxVisibleItems 把一行限制成三个操作，即使还能放下更多；其余进入下拉菜单。"
  locale="zh"
  title="限量工具栏"
/>

<DemoExample
  :demo="overflowListCollapseStart"
  description="从开头隐藏放不下的项，让最新的项保持可见。"
  locale="zh"
  title="从开头折叠"
/>

<DemoExample
  :demo="overflowListMultiRow"
  description="标签最多换到两行，其余折叠成数量徽章。"
  locale="zh"
  title="多行标签"
/>

<DemoExample
  :demo="overflowListBadges"
  description="可调整宽度的徽章行，溢出时收成一个数量徽章。"
  locale="zh"
  title="徽章标签"
/>

<DemoExample
  :demo="overflowListActions"
  description="操作工具栏把放不下的按钮收进下拉菜单。"
  locale="zh"
  title="下拉操作"
/>

<DemoExample
  :demo="toolbarFilter"
  description="表格上方的筛选条：搜索框在最前，旁边每个字段既是关闭的触发器，也是自己的筛选条；行变窄时，条件从末尾收成一个数量。"
  locale="zh"
  title="表格筛选"
/>

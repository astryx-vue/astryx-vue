---
layout: component-docs
title: 拖拽分隔条
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { resizeHandleSidebar } from '../../../../components/demos/resize-handle'
</script>

## 使用方法

`ResizeHandle` 是两个区域之间的分隔条。尺寸由 `useResizable` 管理。把 `sidebar.props` 同时传给分隔条和面板。

```vue
<script setup lang="ts">
import { useResizable } from '@astryx-vue/core'
import { Layout, LayoutPanel } from '@astryx-vue/core/Layout'
import { ResizeHandle } from '@astryx-vue/core/Resizable'

const sidebar = useResizable({
  defaultSize: 240,
  minSize: 160,
  maxSize: 360,
})
</script>

<template>
  <Layout>
    <template #start>
      <LayoutPanel :has-divider="false" :width="sidebar.size" />
      <ResizeHandle direction="horizontal" has-divider :resizable="sidebar.props" />
    </template>
  </Layout>
</template>
```

`direction` 取 `horizontal`（改宽度）或 `vertical`（改高度）。`position` 取 `inline` 或 `overlay`。面板在结束边时用 `isReversed` 把拖拽方向反过来。`hasDivider` 画出 1px 的线，线本身就是把手。`isAlwaysVisible` 让握把在静止时也可见。`pillPlacement` 取 `auto`、`start`、`end` 或 `center`。

分隔条的角色是 `separator`。横向分隔条的 `aria-orientation` 是 `vertical`。方向键每次移动 10px，按住 Shift 移动 50px。Home 和 End 跳到边界。Enter 恢复展开时的尺寸。

`useResizable` 可以管一个区域，也可以用 `regions` 一次管多个。`snaps` 在指针进入某个点 8px 以内时吸住，其余时候跟着指针走。可收起的区域被拖到低于 `collapsedSize`（默认 40）时，尺寸变成 0。`autoSaveId` 把尺寸存在 `localStorage`，键名以 `astryx-resizable:` 开头。`percent()` 用来写带像素上下限的百分比尺寸。

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 用 `label` 说明这条分隔条在调整哪一块。 |
| <Badge variant="success">推荐</Badge> | 分隔条自己画线时，关掉面板上的分隔线。 |
| <Badge variant="error">避免</Badge> | 另存一份尺寸却不传 `resizable`。分隔条和面板都读 `props`。 |

## 示例

<DemoExample :demo="resizeHandleSidebar" description="拖动会吸附到预设宽度。拖过最小宽度后侧栏收起，点 Expand 再把它展开。" locale="zh" title="吸附并收起" />

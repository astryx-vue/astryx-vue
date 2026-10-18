---
layout: component-docs
title: useResizable
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { useResizableCollapsible, useResizableSplit } from '../../../../components/demos/use-resizable'
</script>

## 使用方法

给布局区域加上「拖着改大小」的能力。支持单区域和多区域；区域可以吸到固定的吸附点、可以整体收起，尺寸能存进 localStorage，多区域挤在一起时还能按顺序让出空间。

```ts
import { useResizable } from '@astryx-vue/core'
```

## 建议

| 指引 | 做法 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 想要 40% 宽、最窄 333px，写 `percent(40, { min: pixel(333) })`；想要 10% 宽、最宽 400px，写 `percent(10, { max: pixel(400) })`。第二个参数必填，且只能给下限或上限其中一个。 |
| <Badge variant="success">推荐</Badge> | 结构化的默认值只决定初始值；结构化的 `minSize` / `maxSize` 是持续生效的。状态、持久化、回调、`resize()`、绘制和 ARIA 用的都是解析后的像素数。 |
| <Badge variant="success">推荐</Badge> | `percent` 从 `@astryx-vue/core` 引入，Table 的那个 `pixel` 从 `@astryx-vue/core/Table` 引入。两处是同一个 pixel 绑定，各从自己的入口导出一次。 |
| <Badge variant="success">推荐</Badge> | 和 `Layout` 或 `AppShell` 的侧栏一起用，做可拖宽的导航面板。 |
| <Badge variant="success">推荐</Badge> | 想跨刷新记住用户拖出来的尺寸，设 `autoSaveId`。 |
| <Badge variant="error">避免</Badge> | 把 `minSize` 设得太小，内容会看不清。能整块藏起来的面板，改用 `collapsible`。 |

## 示例

常见配置、变体和状态。

<DemoExample
  :demo="useResizableSplit"
  description="水平方向的两栏分割，中间是一条可拖动的分隔条。"
  locale="zh"
  title="Resizable — 水平分割"
/>

<DemoExample
  :demo="useResizableCollapsible"
  description="用 useResizable 驱动的可收起侧栏，带吸附点。拖动会吸到预设宽度，拖过最小值就收起，expand 方法能把它恢复回来。"
  locale="zh"
  title="Resizable — 可收起并带吸附点"
/>

---
layout: component-docs
title: 区块
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { sectionDividers, sectionWash } from '../../../../components/demos/section'
</script>

## 使用方法

`Section` 用来划分页面上的一块区域，例如一组设置、表单里的一段，或需要强调的一块。它负责背景、按间距刻度设置内边距，并可以在任意一边画分隔线。

```vue
<script setup lang="ts">
import { Section } from '@astryx-vue/core/Section'
</script>

<template>
  <Section :padding="4">
    <p>账户</p>
  </Section>
</template>
```

`variant` 取 `section`（表面色）、`muted` 或 `transparent`。`padding` 默认是刻度 4。单边覆盖轴向，轴向覆盖统一的 `padding`。`dividers` 接受 `top`、`bottom`、`start`、`end`，`start` 和 `end` 随书写方向翻转。

外层用负外边距，让区块能逃出父级容器（例如 `Card` 或 `LayoutContent`）的内边距。


<ComponentAnatomy />

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 页面上的一块区域用 Section。单独一项，例如一条通知或一张资料卡，用 Card。 |
| <Badge variant="success">推荐</Badge> | 先用默认变体。只有某一块需要被注意到时再用 muted。 |
| <Badge variant="success">推荐</Badge> | 相邻且背景相同的区块，用分隔线隔开。 |
| <Badge variant="error">避免</Badge> | 在子元素上再加外边距去重复主题内边距。内边距设在区块上。 |

## 示例

<DemoExample :demo="sectionWash" description="默认区块下面接一整条弱化背景，用来把升级提示这类区域单独提出来。" locale="zh" title="默认与弱化背景" />

<DemoExample :demo="sectionDividers" description="相邻且背景相同的区块用底部分隔线分开，像设置页那样。" locale="zh" title="带分隔线" />

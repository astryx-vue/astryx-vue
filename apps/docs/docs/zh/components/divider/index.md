---
layout: component-docs
title: 分隔线
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { dividerFullBleed, dividerVariants, dividerVertical } from '../../../../components/demos/divider'
</script>

## 使用方法

`Divider` 用一条细线把相关内容分成若干区块，适合在表单、列表或设置项之间做视觉上的划分。需要为分区标注名称时，也可以把简短文字放在线条中间：

```vue
<script setup lang="ts">
import { Divider } from '@astryx-vue/core/Divider'
</script>

<template>
  <Divider label="或" />
</template>
```





<ComponentAnatomy />

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 相关内容区块之间使用 `subtle` 分隔线；需要更醒目的边界时，改用 `strong`。 |
| <Badge variant="success">推荐</Badge> | 分区需要一个可见的类别标题时，为分隔线添加 `label`，文字会居中显示在线条上。 |
| <Badge variant="error">避免</Badge> | 避免密集使用分隔线：能用留白和排版区分内容时，优先使用间距而不是线条。 |

## 示例

<DemoExample :demo="dividerFullBleed" description="分隔线穿过卡片内边距，从一边拉到另一边，放在明细和合计之间。" locale="zh" title="通栏" />

<DemoExample :demo="dividerVariants" description="带「or」的分隔线用来表示另一种登录方式，强调线放在说明文字前面。" locale="zh" title="变体" />

<DemoExample :demo="dividerVertical" description="并排的指标之间用垂直分隔线隔开。" locale="zh" title="垂直" />

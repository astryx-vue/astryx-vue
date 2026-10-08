---
layout: component-docs
title: 分隔线
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { dividerBasic, dividerLabel, dividerVariants, dividerVertical } from '../../../../components/demos/divider'
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




## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 相关内容区块之间使用 `subtle` 分隔线；需要更醒目的边界时，改用 `strong`。 |
| <Badge variant="success">推荐</Badge> | 分区需要一个可见的类别标题时，为分隔线添加 `label`，文字会居中显示在线条上。 |
| <Badge variant="error">避免</Badge> | 避免密集使用分隔线：能用留白和排版区分内容时，优先使用间距而不是线条。 |

## 示例

<DemoExample :demo="dividerBasic" title="基本用法" description="水平分隔线是默认形态，会占满所在容器的可用宽度。" locale="zh" />

<DemoExample :demo="dividerLabel" title="文字标签" description="传入 label 后文字会居中显示在线条中间，样式与辅助文字一致，适合“或”“以下为评论”这类简短标注。" locale="zh" />

<DemoExample :demo="dividerVariants" title="变体" description="线条提供 subtle 和 strong 两种强度：subtle 是默认值，视觉较轻；strong 使用强调边框色，适合需要明显边界的场合。" locale="zh" />

<DemoExample :demo="dividerVertical" title="垂直" description="把 orientation 设为 vertical 可得到垂直分隔线，适合放在按钮、图标等固定高度的行内元素之间。" locale="zh" />

## 无障碍

- 根元素带有 `role="separator"` 和 `aria-orientation`。
- 提供 `label` 时，文字通过 `aria-labelledby` 成为无障碍名称。
- 设置 `aria-label` 可以用其他文字为分隔线命名。

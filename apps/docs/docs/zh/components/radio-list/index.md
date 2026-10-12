---
layout: component-docs
title: 单选列表
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { radioListDescriptions, radioListHorizontal, radioListPricing, radioListValidation } from '../../../../components/demos/radio-list'
</script>

## 使用方法

`RadioList` 在一组互斥选项里选一个。默认插槽放 `RadioListItem`。选项只是纯文本时，也可以传 `options` 数组。

```vue
<script setup lang="ts">
import { RadioList, RadioListItem } from '@astryx-vue/core/RadioList'
import { shallowRef } from 'vue'

const channel = shallowRef('')
</script>

<template>
  <RadioList v-model="channel" label="通知方式">
    <RadioListItem label="邮件" value="email" />
    <RadioListItem label="短信" value="sms" />
  </RadioList>
</template>
```

指示器默认 24px，`size="sm"` 时是 20px。`orientation="horizontal"` 把选项排成一行，间距 20px。`end` 插槽靠行的尾端。

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 选项保持较少，通常 2 到 7 个。 |
| <Badge variant="error">避免</Badge> | 需要多选时使用单选列表。应改用 CheckboxList。 |
| <Badge variant="error">避免</Badge> | 超过大约 4 个选项时用水平排列。 |

## 示例

<DemoExample :demo="radioListHorizontal" description="小号、中号、大号排成一行。" locale="zh" title="水平排列" />
<DemoExample :demo="radioListPricing" description="每个方案在行尾显示价格。" locale="zh" title="价格方案" />
<DemoExample :demo="radioListDescriptions" description="每个选项下面有一段说明。" locale="zh" title="带说明" />
<DemoExample :demo="radioListValidation" description="必填且未选择时显示错误。" locale="zh" title="带校验" />

---
layout: component-docs
title: 复选列表
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { checkboxListEndContent, checkboxListSelectAll, checkboxListStates } from '../../../../components/demos/checkbox-list'
</script>

## 使用方法

`CheckboxList` 是包着若干 `CheckboxListItem` 的字段。绑定 `v-model` 时，值是已勾选项的字符串数组。

```vue
<script setup lang="ts">
import { CheckboxList, CheckboxListItem } from '@astryx-vue/core/CheckboxList'
import { shallowRef } from 'vue'

const selected = shallowRef(['email'])
</script>

<template>
  <CheckboxList v-model="selected" label="通知">
    <CheckboxListItem label="邮件" value="email" />
    <CheckboxListItem label="短信" value="sms" />
  </CheckboxList>
</template>
```

全选这类行自己管勾选状态时，不要给列表绑值。那一行用自己的勾选状态。紧凑密度使用小号复选框。勾选的行使用强调色的浅底。只读和禁用时这层浅底会拿掉。

整组只读时，勾选状态还在，也不会变暗，但不能改。和禁用同时设置时按禁用处理。禁用并写上原因时，每一行仍可聚焦，悬停或用键盘停在上面能看到原因。某一行自己在加载，或者一次变更还没结束时，复选框里显示旋转指示，这一行不能再点。

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 全选行不要给 `value`，它不属于集合里的某一项。 |
| <Badge variant="error">避免</Badge> | 用复选列表表示互斥选项。那种情况用 RadioList。 |

## 示例

<DemoExample :demo="checkboxListSelectAll" description="没有全部选中时，全选行是半选。" locale="zh" title="全选" />
<DemoExample :demo="checkboxListEndContent" description="每一行末尾可以放价格徽标。" locale="zh" title="尾部内容" />
<DemoExample :demo="checkboxListStates" description="只读保留勾选且不变暗。禁用时写上原因，行仍然可以聚焦。正在加载的行不能再点。" locale="zh" title="只读、原因和加载" />

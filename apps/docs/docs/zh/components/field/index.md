---
layout: component-docs
title: 表单字段
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { fieldCustom, fieldPrimitives } from '../../../../components/demos/field'
</script>

## 使用方法

`Field` 为控件提供字段结构：

- 标签。
- 说明。
- 必填或可选提示。
- 状态消息。

`TextInput` 已包含 `Field`。使用 `TextInput` 时，直接传入字段属性。

```vue
<script setup lang="ts">
import { Field } from '@astryx-vue/core/Field'
import { shallowRef, useId } from 'vue'

const volume = shallowRef(50)
const inputId = `volume-${useId()}`
</script>

<template>
  <Field :input-id="inputId" label="Volume" description="Set playback volume.">
    <template #default="field">
      <input
        :id="field.inputId" v-model.number="volume" type="range"
        :aria-labelledby="field.labelId" :aria-describedby="field.describedBy"
      >
    </template>
  </Field>
</template>
```




## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 包裹需要标签、辅助文字、必填或可选标识，或校验状态的自定义控件、原生输入框或第三方组件。 |
| <Badge variant="success">推荐</Badge> | 必须提供标签以保证无障碍，即使用 isLabelHidden 将其隐藏。 |
| <Badge variant="success">推荐</Badge> | 使用 inputID 和 descriptionID，将标签和描述通过 htmlFor 与 aria-describedby 关联到内部控件。 |
| <Badge variant="error">不要</Badge> | 在 TextInput、Typeahead、Select、DateInput 或 TextArea 等样式输入框外层嵌套 Field。这些组件已自带 Field 外壳。 |
| <Badge variant="error">不要</Badge> | 在滑块、开关或复选框等无边框控件上使用 attached 状态变体。应使用 detached，使消息不与控件重叠。 |
| <Badge variant="error">不要</Badge> | 在同一字段上同时设置 isOptional 和 isRequired。 |
| <Badge variant="error">不要</Badge> | 隐藏标签，又不提供其他方式让用户理解字段用途。 |

## 示例

<DemoExample :demo="fieldCustom" title="自定义控件" description="默认插槽提供关联 ID，滑块使用 detached 状态，避免消息背景与控件重叠。" locale="zh" />

<DemoExample :demo="fieldPrimitives" title="独立标签与状态" description="FieldLabel 和 FieldStatus 可以独立组合。使用方负责连接控件的 id 和 aria-describedby。" locale="zh" />

## 关联 ID

默认插槽提供以下参数：

- `inputId`：控件 ID。
- `labelId`：标签 ID。
- `descriptionId`：说明 ID。
- `statusId`：状态消息 ID。
- `describedBy`：说明与状态消息的 ID 列表。

1. 将 `inputId` 传给控件的 `id`。
2. 将 `labelId` 传给控件的 `aria-labelledby`。
3. 将 `describedBy` 传给控件的 `aria-describedby`。

`Field` 不会自动修改插槽中的控件。

## 分组标签

1. 为 `Field` 设置 `isGroupLabel`。
2. 将 `labelId` 传给分组的 `aria-labelledby`。

隐藏标签时，界面必须提供说明字段用途的上下文。

## 使用范围

应用负责以下行为：

- 校验控件的值。
- 提交表单。
- 禁用控件。

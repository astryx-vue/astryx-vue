---
layout: component-docs
title: 字段标签
outline: false
footer: false
---

<script setup lang="ts">
import { fieldLabelBasic } from '../../../../components/demos/field-label'
</script>

## 使用方法

单独拿出来用的标签，带可选、必填标记，也能挂一个提示。

`FieldLabel` 就是 `Field` 里管标签的那一半。被标注的东西自己不带标签时就直接用它：自己写的控件、一组输入框，或者库外面包的一层。`label` 和 `input-id` 都是必填，靠这个 id 标签才知道自己指向哪个控件。

```vue
<script setup lang="ts">
import { FieldLabel } from '@astryx-vue/core/Field'
import { ref } from 'vue'

const email = ref('')
</script>

<template>
  <div>
    <FieldLabel label="邮箱地址" input-id="email-input" is-required />
    <input id="email-input" v-model="email" type="email">
  </div>
</template>
```

`isRequired` 和 `isOptional` 会在标签后面写上「必填」或「可选」。放在带 `defaultOptionality` 的 `FormLayout` 里时只标少数派，所以默认必填的表单不用每个字段都写一遍。`description` 在标签下面加一行说明，点这行说明也会把焦点给到控件。`labelIcon` 在标签文字前面加一个小图标，`labelTooltip` 加一个提示按钮，里面的文字读屏也能读到。

被标注的是一组控件、不是一个输入框时，加 `isGroupLabel`。标签这时渲染成 `span` 而不是 `label`，点在标签上就不会莫名其妙地交给第一个控件。

```ts
import { FieldLabel } from '@astryx-vue/core/Field'
```

## 示例

常见的用法和不同的状态。

<DemoExample :demo="fieldLabelBasic" title="基础" description="单独使用的标签，带必填、可选标记和一行说明。被标注的控件自己不带标签时用它。" locale="zh" />

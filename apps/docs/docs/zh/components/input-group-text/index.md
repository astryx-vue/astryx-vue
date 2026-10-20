---
layout: component-docs
title: 输入框组文本
outline: false
footer: false
---

## 使用方法

放在 `InputGroup` 里面的一段前缀或后缀文字，也可以放图标。

把它塞进 `InputGroup` 的 `before` 或 `after` 插槽，就能在输入框两边显示单位、货币符号、协议名或者固定的域名。这段文字不能编辑，按 Tab 也跳不到它，所以不会挡住打字。

```vue
<script setup lang="ts">
import { InputGroup, InputGroupText } from '@astryx-vue/core/InputGroup'
import { TextInput } from '@astryx-vue/core/TextInput'
import { ref } from 'vue'

const price = ref('')
</script>

<template>
  <InputGroup label="价格">
    <template #before>
      <InputGroupText>$</InputGroupText>
    </template>
    <TextInput v-model="price" label="金额" is-label-hidden placeholder="0.00" />
    <template #after>
      <InputGroupText>USD</InputGroupText>
    </template>
  </InputGroup>
</template>
```

默认插槽里放文字。插槽接受任意标记，所以放图标也行；图标只当装饰，因为给读屏报名字的是整组的 `label`。

```ts
import { InputGroupText } from '@astryx-vue/core/InputGroup'
```

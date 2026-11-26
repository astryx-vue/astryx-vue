---
layout: component-docs
title: 输入框组文本
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
</script>

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

## 最佳实践

| 建议 | 做法 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 文字保持简短，例如 `$`、`https://`、`kg`。它始终单行，不会被压缩。 |
| <Badge variant="success">推荐</Badge> | 读屏用户需要的信息写进输入框自己的标签，例如 `$` 前缀旁写「以美元计的金额」。附加文字按阅读顺序当普通文本读出。 |
| <Badge variant="error">避免</Badge> | 在 `InputGroupText` 里放按钮、链接或其他控件。要放操作，用 `Button` 附加件。 |
| <Badge variant="error">避免</Badge> | 在 `InputGroup` 之外使用 `InputGroupText`。它的边框和圆角是为 `InputGroup` 这一行准备的。 |

---
layout: component-docs
title: 文本
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { textTypes, textTruncation } from '../../../../components/demos/text'
</script>

## 使用方法

`Text` 用于渲染正文、辅助说明、表单标签等文字内容，`type` 提供了一套预设的字号、字重和行高组合，让整站文字风格保持一致。从独立入口导入即可，结构样式会随组件自动加载：

```vue
<script setup lang="ts">
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <Text type="body">
    正文内容
  </Text>
  <Text type="supporting">
    辅助说明
  </Text>
</template>
```

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 通过 `type` 表达文字的语义层级：`large` 用于强调性内容，`supporting` 用于辅助说明，`label` 用于表单标签。 |
| <Badge variant="success">推荐</Badge> | 需要块级布局时，把 `as` 设为 `p` 或将 `display` 设为 `block`，默认的行内元素不利于控制间距。 |
| <Badge variant="success">推荐</Badge> | 对可能超出容器的长文本设置 `maxLines`，超出部分会自动截断并显示省略号，避免撑破布局。 |
| <Badge variant="error">避免</Badge> | 用 `Text` 充当标题：标题请使用 `Heading` 组件，才能保证文档大纲对辅助技术可见。 |
| <Badge variant="error">避免</Badge> | 在同一小段文字中混用过多 `type` 和 `size`：样式变化过多会打断阅读节奏。 |

## 示例

<DemoExample
  :demo="textTypes"
  description="Text 提供 body、large、supporting、label、code 等语义类型，覆盖正文、强调、辅助说明、标签与等宽代码等常见场景。"
  locale="zh"
  title="文本类型"
/>

<DemoExample
  :demo="textTruncation"
  description="设置 maxLines 后，超出指定行数的文本会被截断并以省略号收尾，避免长文本撑破布局。"
  locale="zh"
  title="截断"
/>

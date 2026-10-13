---
layout: component-docs
title: 文本
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { textColors, textHeadingLevels, textInline, textTruncation, textTypes, textWeight, textWordBreak, textWrap } from '../../../../components/demos/text'
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
  :demo="textColors"
  description="primary、secondary、accent、disabled、placeholder 五种颜色，各自对应正文、辅助信息、强调、不可用内容和占位提示。"
  locale="zh"
  title="颜色"
/>

<DemoExample
  :demo="textHeadingLevels"
  description="Heading 从 h1 排到 h6，字号随层级下降。"
  locale="zh"
  title="标题层级"
/>

<DemoExample
  :demo="textInline"
  description="默认是行内元素，所以正文和等宽代码可以排在同一行里。"
  locale="zh"
  title="行内混排"
/>

<DemoExample
  :demo="textTruncation"
  description="在限宽容器里用 maxLines 把文字收成一行、两行或三行，超出的部分以省略号结尾。"
  locale="zh"
  title="截断"
/>

<DemoExample
  :demo="textTypes"
  description="body、large、label、supporting、code 五种语义类型，以及删除线和等宽数字。"
  locale="zh"
  title="文本类型"
/>

<DemoExample
  :demo="textWeight"
  description="normal、medium、semibold、bold 四种字重。normal 与 regular 是同一档。"
  locale="zh"
  title="字重"
/>

<DemoExample
  :demo="textWordBreak"
  description="一长串没有空格的文字，break-word 尽量在词的边界断开，break-all 则可以在任意字符处断开。"
  locale="zh"
  title="断词"
/>

<DemoExample
  :demo="textWrap"
  description="wrap、nowrap、balance、pretty 四种换行方式，都放在同样宽度的盒子里。"
  locale="zh"
  title="换行"
/>

---
layout: component-docs
title: 引用
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { blockquoteCite, blockquoteTestimonials } from '../../../../components/demos/blockquote'
</script>


## 使用方法

`Blockquote` 用于展示引用的文本，例如推荐语、评论摘录或文档中引用的外部内容，在视觉上与普通段落区分开。从独立入口导入即可，结构样式会随组件自动加载：

主题在应用入口引入一次：

```ts
import '@astryx-vue/themes/neutral.css'
```

组件用法：

```vue
<script setup lang="ts">
import { Blockquote } from '@astryx-vue/core/Blockquote'
</script>

<template>
  <Blockquote cite="Steve Jobs">
    设计不仅关乎外观与感受，更关乎如何运作。
  </Blockquote>
</template>
```




## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 用于引用文本、推荐语或来自外部来源的高亮摘录。 |
| <Badge variant="success">推荐</Badge> | 引用来源已知时，提供 cite 属性。 |
| <Badge variant="error">避免</Badge> | 用于提示或信息说明。应使用提示条（Banner）。 |

## 示例

<DemoExample
  :demo="blockquoteTestimonials"
  description="评价区里的多条引言，排成卡片网格。和 Card、Grid 一起用来做社会证明布局。"
  locale="zh"
  title="用户评价"
/>

<DemoExample
  :demo="blockquoteCite"
  description="一条普通引言，和一条用来源 cite 署名的引言。已知作者或出处时使用 cite。"
  locale="zh"
  title="带来源"
/>

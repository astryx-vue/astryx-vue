---
layout: component-docs
title: useLinkify
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { useLinkifyCommentThread } from '../../../../components/demos/use-linkify'
</script>

## 使用方法

`useLinkify` 在纯文字里找出网址、邮箱和自定义格式，把文字切成「纯文字」和「链接」两种片段。用户或工具写下的文字想长出安全、有样式的链接，又不想先转成标记语言时就用它，比如动态流、评论串、描述字段。

每个片段要么是 `{ type: 'text', text }`，要么是 `{ type: 'link', text, href, isExternal }`。文字原样输出，链接交给 `Link`。网址会在新标签页打开（`isExternal`），邮箱链接成 `mailto:`。

```ts
import { useLinkify } from '@astryx-vue/core'
```

```vue
<script setup lang="ts">
import { useLinkify } from '@astryx-vue/core'
import { Link } from '@astryx-vue/core/Link'

const segments = useLinkify('Visit https://example.com or write hi@example.com')
</script>

<template>
  <p>
    <template v-for="(segment, index) in segments" :key="index">
      <Link v-if="segment.type === 'link'" :href="segment.href" :is-external-link="segment.isExternal">
        {{ segment.text }}
      </Link>
      <template v-else>
        {{ segment.text }}
      </template>
    </template>
  </p>
</template>
```

文字可以传 ref 或 getter，片段会跟着变。自定义格式能把 `#123`、工单号这类项目内的引用变成链接：给一个带全局标志的正则，再给一个读取捕获组的 `href` 生成函数。多处匹配重叠时先出现的赢，起点相同则自定义格式赢过内置格式，所以 `#123` 的规则可以和网址识别用在同一段文字里。

## 建议

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 文字片段原样渲染；没命中的文字已经按顺序穿插在片段里。 |
| <Badge variant="success">推荐</Badge> | 每条自定义格式都带全局标志（`g`），否则只会看到第一处匹配。 |
| <Badge variant="error">避免</Badge> | 先把文字转成自己的标记，再去找链接。 |

## 示例

<DemoExample
  :demo="useLinkifyCommentThread"
  description="一串纯文字评论：网址和邮箱变成链接，自定义格式把 #123、#456 变成工单链接，没有命中的评论保持原样。"
  locale="zh"
  title="useLinkify — 评论串"
/>

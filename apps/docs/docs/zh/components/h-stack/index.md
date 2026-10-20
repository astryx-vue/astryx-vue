---
layout: component-docs
title: 水平堆叠
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { hStackBasic } from '../../../../components/demos/h-stack'
</script>

## 使用方法

`Stack` 把子项排成一行或者一列，间距始终一致。子项之间的距离交给 `gap` 属性，不用自己算。

```ts
import { HStack } from '@astryx-vue/core/Stack'
```

`HStack` 就是把 `Stack` 的方向定成了横向，属性还是那一套，不用每次再写 `direction`。`gap` 取间距刻度上的一档，一行里的间距只靠它：不要给子元素加外边距。

`hAlign` 管这一行里的横向位置，可选 `start`、`center`、`end`、`between`、`around`、`evenly`。`vAlign` 管子项之间在纵向怎么对，`align` 是它的简写。一行放不下的时候用 `wrap` 让它换行，而不是溢出。

```vue
<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { HStack } from '@astryx-vue/core/Stack'
</script>

<template>
  <HStack :gap="2">
    <Badge label="React" />
    <Badge label="TypeScript" />
    <Badge label="Node.js" />
  </HStack>
</template>
```

<ComponentAnatomy />

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 用 `gap` 属性控制项目间距，而不是给子元素手动添加外边距，间距更容易保持一致。 |
| <Badge variant="success">推荐</Badge> | 希望某个项目拉伸并填满剩余空间时，给它包一层 `size="fill"` 的 `StackItem`，其余项目仍保持固有尺寸。 |
| <Badge variant="error">避免</Badge> | 为了换行而嵌套堆叠布局，优先给 `Stack` 设置 `wrap="wrap"` 让项目自动换行，结构会更扁平。 |

## 示例

<DemoExample :demo="hStackBasic" title="基础" description="子项横向排成一行，间距一致，垂直方向居中对齐。兄弟元素要并排摆时就用 HStack。" locale="zh" />

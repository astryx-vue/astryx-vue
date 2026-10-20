---
layout: component-docs
title: 垂直堆叠
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { vStackBasic } from '../../../../components/demos/v-stack'
</script>

## 使用方法

`Stack` 把子项排成一行或者一列，间距始终一致。子项之间的距离交给 `gap` 属性，不用自己算。

```ts
import { VStack } from '@astryx-vue/core/Stack'
```

`VStack` 就是把 `Stack` 的方向定成了纵向，属性还是那一套，不用每次再写 `direction`。`gap` 取间距刻度上的一档，一列里的间距只靠它：不要给子元素加外边距。

`vAlign` 管这一列里的纵向位置，可选 `start`、`center`、`end`、`between`、`around`、`evenly`。`hAlign` 管子项之间在横向怎么对，`justify` 是它的简写。

```vue
<script setup lang="ts">
import { Heading } from '@astryx-vue/core/Heading'
import { VStack } from '@astryx-vue/core/Stack'
import { Text } from '@astryx-vue/core/Text'
</script>

<template>
  <VStack :gap="3">
    <Heading :level="5">
      周报
    </Heading>
    <Text type="body" color="secondary">
      VStack 把子项从上到下排成一列。
    </Text>
  </VStack>
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

<DemoExample :demo="vStackBasic" title="基础" description="标题和几段文字从上往下排成一列，间距一致。兄弟元素要纵向依次摆放时就用 VStack。" locale="zh" />

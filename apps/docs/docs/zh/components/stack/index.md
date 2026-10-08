---
layout: component-docs
title: 堆叠布局
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { stackDirections, stackHStack, stackItem, stackVStack } from '../../../../components/demos/stack'
</script>


## 使用方法

`Stack` 系列组件用一套间距令牌管理一维布局：`Stack` 通过 `direction` 切换排列方向，`HStack`、`VStack` 分别固定水平与垂直方向，`StackItem` 负责子项的尺寸分配。需要沿同一方向排列多个元素、并保持间距一致时使用它们。

在应用入口引入主题：

```ts
import '@astryx-vue/themes/neutral.css'
```

组件按需要从独立入口导入，结构样式会随组件自动加载：

```vue
<script setup lang="ts">
import { HStack, Stack, StackItem, VStack } from '@astryx-vue/core/Stack'
</script>
```




## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 用 `gap` 属性控制项目间距，而不是给子元素手动添加外边距，间距更容易保持一致。 |
| <Badge variant="success">推荐</Badge> | 希望某个项目拉伸并填满剩余空间时，给它包一层 `size="fill"` 的 `StackItem`，其余项目仍保持固有尺寸。 |
| <Badge variant="error">避免</Badge> | 为了换行而嵌套堆叠布局，优先给 `Stack` 设置 `wrap="wrap"` 让项目自动换行，结构会更扁平。 |

## 示例

下面覆盖常见的方向与空间分配配置。

<DemoExample
  :demo="stackDirections"
  description="direction 决定子元素的排列方向：horizontal 从左到右，vertical 从上到下，Stack 默认为 vertical。"
  locale="zh"
  title="Stack — 方向"
/>

<DemoExample
  :demo="stackHStack"
  description="HStack 固定使用水平方向，等价于 direction 为 horizontal 的 Stack，写导航栏、按钮组等横向排列时更直白。"
  locale="zh"
  title="HStack — 基础"
/>

<DemoExample
  :demo="stackVStack"
  description="VStack 固定使用垂直方向，等价于 direction 为 vertical 的 Stack，表单、列表等纵向排列可以直接使用。"
  locale="zh"
  title="VStack — 基础"
/>

<DemoExample
  :demo="stackItem"
  description="StackItem 默认为 static，保持子项固有尺寸；设为 fill 时子项拉伸并占据堆叠容器中的剩余空间。"
  locale="zh"
  title="StackItem — 尺寸"
/>


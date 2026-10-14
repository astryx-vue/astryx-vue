---
layout: component-docs
title: 堆叠布局
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { stackAlignment, stackFill } from '../../../../components/demos/stack'
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

<DemoExample :demo="stackAlignment" description="按钮分别靠左、居中、靠右排在一行里。" locale="zh" title="对齐" />

<DemoExample :demo="stackFill" description="头像、姓名和按钮排成一行。姓名把中间剩下的空间撑满。" locale="zh" title="填满剩余空间" />

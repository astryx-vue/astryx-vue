---
layout: component-docs
title: 标签
outline: false
footer: false
---

<script setup lang="ts">
import { badgeColors, badgeCounts } from '../../../../components/demos/badge'
</script>


## 使用方法

从独立入口导入组件。组件会加载结构样式。

在应用入口引入主题：

```ts
import '@astryx-vue/themes/neutral.css'
```

组件用法：

```vue
<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
</script>

<template>
  <Badge variant="success">
    已完成
  </Badge>
</template>
```




## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 每个状态标签都会抢占注意力。只为用户需要注意或处理的状态使用标签：错误、警告和待跟进的项目。无需处理时，普通文本即可。 |
| <Badge variant="success">推荐</Badge> | 仅对需要关注的系统状态使用 success、warning 和 error 变体，例如 “Failed”、“Degraded”、“Action Required”。这些变体使用醒目的实底背景。 |
| <Badge variant="success">推荐</Badge> | 对用于分组或分类的标签，使用颜色变体（蓝色、紫色、青色等）。例如团队名称、内容类型、优先级。 |
| <Badge variant="success">推荐</Badge> | 标签文字保持一到两个词。需要更多说明时，把说明放在标签外的文字中。 |
| <Badge variant="success">推荐</Badge> | 图标有助于快速识别标签类型时，添加图标。图标旁必须保留文字标签。 |
| <Badge variant="error">不要</Badge> | 为每个健康、活跃或正常的项目都使用 success 标签。若每行都是绿色的 “Active”，标签就无法突出。标签只显示需要用户关注的状态，如错误、警告和待处理操作。 |
| <Badge variant="error">不要</Badge> | 用标签展示元数据。时长（“6h window”）、数量（“12 trigger types”）、日期和描述都不是状态或分类。应改用描述文本（Text 组件，type="supporting"）。 |
| <Badge variant="error">不要</Badge> | 用 success、warning、error、info 等语义状态变体表示分类或说明性内容。这些变体视觉强烈，只用于表示系统状态。 |
| <Badge variant="error">不要</Badge> | 在表格或列表的每一行都重复同一个标签。若多数行都有相同的值，标签就不再传递信息。常见状态使用普通文本，标签只留给例外情况。 |
| <Badge variant="error">不要</Badge> | 让标签可点击。标签是只读指示器。用户需要操作时，使用按钮或链接。 |

## 示例

常见的标签配置与使用场景。

<DemoExample
  :demo="badgeColors"
  description="使用分类颜色区分类别。分类颜色不表示系统状态。"
  locale="zh"
  title="颜色"
/>

<DemoExample
  :demo="badgeCounts"
  description="标签显示简短计数。数值超过 99 时，可以显示 99+。"
  locale="zh"
  title="计数"
/>


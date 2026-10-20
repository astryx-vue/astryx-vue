---
layout: component-docs
title: 徽标
outline: false
footer: false
---

<script setup lang="ts">
import { badgeColors, badgeCounts, badgeStatus } from '../../../../components/demos/badge'
</script>


## 使用方法

`Badge`（徽标）是一块小小的只读标记，用来告诉用户某项内容的状态或所属分类，例如「已完成」、「待审核」或团队名称等。它很适合放在列表、卡片和表格行里，方便大家一眼扫过去就看清概况。

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

**什么时候用：**
- 需要用颜色和简短词语突出展示某个条目的状态（如成功、警告、失败）或类别时。

**什么时候不要用：**
- 徽标是纯展示用的，不能点击也不能关闭。如果需要一个可以点击、勾选或带删除叉号的标签，请改用 [Token](/components/token)。
- 如果只需要展示普通文字描述、日期或数量，请直接使用普通的排版文本（如 `Text` 组件），不要给每条普通信息都套上徽标。

样式主题只需在整个应用的主入口（如 `main.ts`）引入一次：

```ts
import '@astryx-vue/themes/neutral.css'
```





<ComponentAnatomy />

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 每个状态徽标都会抢占注意力。只为用户需要注意或处理的状态使用徽标：错误、警告和待跟进的项目。无需处理时，普通文本即可。 |
| <Badge variant="success">推荐</Badge> | 仅对需要关注的系统状态使用 success、warning 和 error 变体，例如 “Failed”、“Degraded”、“Action Required”。这些变体使用醒目的实底背景。 |
| <Badge variant="success">推荐</Badge> | 对用于分组或分类的徽标，使用颜色变体（蓝色、紫色、青色等）。例如团队名称、内容类型、优先级。 |
| <Badge variant="success">推荐</Badge> | 徽标文字保持一到两个词。需要更多说明时，把说明放在徽标外的文字中。 |
| <Badge variant="success">推荐</Badge> | 图标有助于快速识别徽标类型时，添加图标。图标旁必须保留文字。 |
| <Badge variant="error">避免</Badge> | 为每个健康、活跃或正常的项目都使用 success 徽标。若每行都是绿色的 “Active”，徽标就无法突出。徽标只显示需要用户关注的状态，如错误、警告和待处理操作。 |
| <Badge variant="error">避免</Badge> | 用徽标展示元数据。时长（“6h window”）、数量（“12 trigger types”）、日期和描述都不是状态或分类。应改用描述文本（Text 组件，type="supporting"）。 |
| <Badge variant="error">避免</Badge> | 用 success、warning、error、info 等语义状态变体表示分类或说明性内容。这些变体视觉强烈，只用于表示系统状态。 |
| <Badge variant="error">避免</Badge> | 在表格或列表的每一行都重复同一个徽标。若多数行都有相同的值，徽标就不再传递信息。常见状态使用普通文本，徽标只留给例外情况。 |
| <Badge variant="error">避免</Badge> | 让徽标可点击。徽标是只读指示器。用户需要操作时，使用按钮或链接。 |

## 示例

<DemoExample
  :demo="badgeColors"
  description="用蓝、青、绿这类分类色区分团队或主题。这些颜色不表示系统状态。"
  locale="zh"
  title="颜色"
/>

<DemoExample
  :demo="badgeCounts"
  description="徽标里放一个短数字，用在未读消息或待办数量旁边。超过 99 可以写成 99+。"
  locale="zh"
  title="计数"
/>

<DemoExample
  :demo="badgeStatus"
  description="用 success、warning、error 标出需要处理的状态，用 neutral 和 info 标出流程位置。"
  locale="zh"
  title="状态"
/>


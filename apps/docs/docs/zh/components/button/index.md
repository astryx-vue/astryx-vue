---
layout: component-docs
title: 按钮
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { buttonAsync, buttonFloating, buttonSizes, buttonVariants } from '../../../../components/demos/button'
</script>


## 使用方法

`Button` 用于触发操作。必须用 `label` 指定操作名称。

没有默认插槽时，按钮显示 `label`：

```vue
<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
</script>

<template>
  <Button label="保存更改" variant="primary" />
</template>
```

- 组合相关操作时，使用 [ButtonGroup](/components/button-group)。
- 操作只显示图标时，使用 [IconButton](/components/icon-button)。




## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 将 primary 变体只用于视图中最重要的一个操作。其余操作按强调程度使用 secondary 或 ghost 变体。 |
| <Badge variant="success">推荐</Badge> | 按钮文字描述操作，例如 “Save changes”、“Delete account”、“Send invite”。不要使用 “OK” 或 “Click here” 这类模糊文字。 |
| <Badge variant="success">推荐</Badge> | 耗时操作（如保存或提交）显示加载状态，让用户知道操作正在进行。 |
| <Badge variant="success">推荐</Badge> | 纯图标按钮必须提供文字标签，供屏幕阅读器播报。面向明眼用户时，再添加提示框。 |
| <Badge variant="success">推荐</Badge> | 需要独立的纯图标按钮时，使用 `@astryx-vue/core/IconButton` 中的 IconButton。它是独立组件，不从 `@astryx-vue/core/Button` 导出。 |
| <Badge variant="error">不要</Badge> | 在同一视图中放置多个 primary 按钮。这会削弱视觉层级。 |
| <Badge variant="error">不要</Badge> | 对不可撤销的操作（如删除数据）使用 destructive 变体却不设确认步骤。 |
| <Badge variant="error">不要</Badge> | 用按钮做页面跳转。若只是跳转到另一页，应使用链接。按钮用于保存、删除或提交等操作。 |

## 示例

`variant` 控制按钮外观。`size` 控制按钮尺寸。

异步操作返回 Promise 时，`clickAction` 管理加载状态。

<DemoExample
  :demo="buttonVariants"
  description="primary 只用于当前视图最重要的操作。secondary、ghost 和 destructive 分别表达普通、低强调与危险操作。"
  locale="zh"
  title="视觉层级"
/>

<DemoExample
  :demo="buttonFloating"
  description="为悬浮在内容之上的操作使用 elevation。阴影深度只改变静止层级，不改变按钮的变体或操作语义。"
  locale="zh"
  title="悬浮按钮"
/>

<DemoExample
  :demo="buttonSizes"
  description="sm、md 和 lg 对应紧凑、默认与更醒目的操作区域。尺寸只改变按钮规格，不改变操作语义。"
  locale="zh"
  title="尺寸"
/>

<DemoExample
  :demo="buttonAsync"
  description="clickAction 返回 Promise 时，Button 立即设置 aria-busy。组件默认阻止重复操作。加载图标延迟显示。"
  locale="zh"
  title="异步操作"
/>


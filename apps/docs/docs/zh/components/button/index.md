---
layout: component-docs
title: 按钮
outline: false
footer: false
---

<script setup lang="ts">
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


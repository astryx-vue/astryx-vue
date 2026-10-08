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

`Button` 用来触发界面中的各类操作，保存、删除、提交这些动作都可以交给它。每个按钮都必须通过 `label` 指定操作名称，它既是默认的可见文字，也是屏幕阅读器朗读的无障碍标签。没有默认插槽时，按钮直接显示 `label`：

```vue
<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
</script>

<template>
  <Button label="保存更改" variant="primary" />
</template>
```

- 需要把一组相关操作并排放在一起时，使用 [ButtonGroup](/components/button-group)。
- 操作只需要一个图标时，使用 [IconButton](/components/icon-button)。




## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 把 primary 留给视图中最重要的那个操作，其余操作按强调程度依次使用 secondary 或 ghost，视觉层级会更清晰。 |
| <Badge variant="success">推荐</Badge> | 按钮文字直接描述将要发生的操作，例如 “Save changes”、“Delete account”、“Send invite”。避免使用 “OK” 或 “Click here” 这类看不出后果的模糊文字。 |
| <Badge variant="success">推荐</Badge> | 保存、提交等耗时操作应显示加载状态，让用户明确知道请求正在处理，而不是对着没反应的界面重复点击。 |
| <Badge variant="success">推荐</Badge> | 纯图标按钮也必须提供文字标签，屏幕阅读器依赖它来播报按钮用途；面向普通用户时，可以再用 tooltip 给出视觉提示。 |
| <Badge variant="success">推荐</Badge> | 需要独立的纯图标按钮时，从 `@astryx-vue/core/IconButton` 导入 IconButton。它是独立组件，不从 `@astryx-vue/core/Button` 导出。 |
| <Badge variant="error">避免</Badge> | 避免在同一视图中放置多个 primary 按钮，多个主按钮会互相争抢注意力，反而削弱视觉层级。 |
| <Badge variant="error">避免</Badge> | 避免让 destructive 按钮直接执行删除数据这类不可撤销的操作。应先提供确认步骤，给使用者一次反悔的机会。 |
| <Badge variant="error">避免</Badge> | 避免用按钮做纯粹的页面跳转：跳转请使用链接，按钮留给保存、删除、提交这类会改变状态的操作。 |

## 示例

下面的示例覆盖视觉层级、悬浮、尺寸与异步操作四个典型场景。`variant` 决定按钮外观，`size` 决定按钮规格；异步操作返回 Promise 时，`clickAction` 会自动接管加载状态。

<DemoExample
  :demo="buttonVariants"
  description="primary 只用于当前视图最重要的操作，secondary、ghost 和 destructive 依次表达普通、低强调与危险操作，按操作的强调程度选择即可。"
  locale="zh"
  title="视觉层级"
/>

<DemoExample
  :demo="buttonFloating"
  description="当按钮需要悬浮在内容之上时，通过 elevation 提升它的静止层级；阴影只改变视觉重量，不影响按钮的变体与操作语义。"
  locale="zh"
  title="悬浮按钮"
/>

<DemoExample
  :demo="buttonSizes"
  description="sm、md、lg 依次对应紧凑、默认与更醒目的点击区域。尺寸只改变按钮规格，不影响操作本身的含义。"
  locale="zh"
  title="尺寸"
/>

<DemoExample
  :demo="buttonAsync"
  description="clickAction 返回 Promise 时，Button 立即设置 aria-busy 并默认阻止重复点击；加载图标会延迟显示，快速完成的操作不会出现闪烁。"
  locale="zh"
  title="异步操作"
/>


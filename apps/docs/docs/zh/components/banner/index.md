---
layout: component-docs
title: 提示条
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { bannerAction, bannerCollapsible, bannerDismiss, bannerFullWidth, bannerStatuses } from '../../../../components/demos/banner'
</script>

## 使用方法

`Banner` 用于持续展示需要用户关注或处理的消息，例如功能更新、操作结果或需要解决的问题。与会自动消失的 Toast 不同，它会一直留在界面上，直到用户处理或主动关闭：

```vue
<script setup lang="ts">
import { Banner } from '@astryx-vue/core/Banner'
</script>

<template>
  <Banner
    status="success"
    title="Changes saved"
    description="Your settings are up to date."
    is-dismissable
  />
</template>
```

主题在应用入口引入一次：

```ts
import '@astryx-vue/themes/neutral.css'
```




## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 选择与消息相符的状态：更新用 info，注意事项用 warning，问题用 error，确认用 success。 |
| <Badge variant="success">推荐</Badge> | 页面内容中使用 card 容器。覆盖整页宽度的消息使用 section 容器。 |
| <Badge variant="success">推荐</Badge> | info 和 success 提示条可以关闭。error 提示条必须保留，直到用户解决问题。 |
| <Badge variant="success">推荐</Badge> | 标题保持简短、便于扫读。例如用 “Payment failed”，不用 “There was a problem processing your most recent payment.” |
| <Badge variant="error">避免</Badge> | 用提示条展示会自动消失的短暂消息。应改用 Toast。 |
| <Badge variant="error">避免</Badge> | 叠放同一状态的多条提示条。应把相关消息合并为一条。 |

## 示例

<DemoExample
  :demo="bannerAction"
  description="end 插槽放一个按钮，让用户能直接处理这条消息。"
  locale="zh"
  title="操作"
/>

<DemoExample
  :demo="bannerCollapsible"
  description="同一条提示里放操作按钮、关闭按钮，以及默认展开的详情。详情写在默认插槽里。"
  locale="zh"
  title="可折叠"
/>

<DemoExample
  :demo="bannerDismiss"
  description="isDismissable 让用户读完后关掉提示。适合维护通知和功能介绍。"
  locale="zh"
  title="关闭"
/>

<DemoExample
  :demo="bannerFullWidth"
  description="container 设为 section 后，提示条铺满整行，没有圆角，适合放在页面顶部。"
  locale="zh"
  title="通栏"
/>

<DemoExample
  :demo="bannerStatuses"
  description="info、success、warning、error 四种状态，分别用于更新、完成、提醒和出错。"
  locale="zh"
  title="状态"
/>

## 使用建议

提示条的语气由 `status` 决定，选错状态会让用户误判消息的紧迫程度。下面按消息的性质说明该选哪个状态，以及两个容易忽略的用法。

- 一般的信息和更新使用 `info`。
- 操作成功的结果使用 `success`。
- 需要提醒用户注意的情况使用 `warning`。
- 阻止用户继续操作的问题使用 `error`。
- 用户必须读到的详情传入 `:collapsible="false"`，这样详情会始终显示，不需要再点开。
- 用户操作之后才出现的紧急消息，在操作发生时动态挂载。

状态同时还决定组件向屏幕阅读器呈现的角色：`warning` 和 `error` 使用 `role="alert"`，`info` 和 `success` 使用 `role="status"`。需要注意的是，页面初次渲染时就已存在的消息不保证被屏幕阅读器播报，所以越紧急的消息，越适合在用户操作之后再挂载。

如果只是单个字段的校验消息，应改用 [FieldStatus](/components/field-status)。

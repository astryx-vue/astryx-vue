---
layout: component-docs
title: 提示条
outline: false
footer: false
---

<script setup lang="ts">
import { bannerStatuses, bannerDetails, bannerActions, bannerContainers } from '../../../../components/demos/banner'
</script>

## 使用方法

`Banner` 用于持续显示需要用户关注或处理的消息。

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

## 示例

<DemoExample :demo="bannerStatuses" title="消息状态" description="使用标题说明消息含义。不要只依赖颜色。" locale="zh" />

<DemoExample :demo="bannerDetails" title="展开详情" description="默认插槽提供详情。collapsible 为 false 时，详情始终显示。" locale="zh" />

<DemoExample :demo="bannerActions" title="操作与关闭" description="操作按钮放入 end 插槽。关闭后，组件自行隐藏。" locale="zh" />

<DemoExample :demo="bannerContainers" title="容器与阴影" description="card 适合页面内容。section 适合通栏提示。" locale="zh" />

## 使用建议

- 信息提示使用 `info`。
- 成功结果使用 `success`。
- 注意事项使用 `warning`。
- 阻止继续操作的问题使用 `error`。
- 必须阅读的详情使用 `:collapsible="false"`。
- 用户操作后出现的紧急消息使用动态挂载。

`warning` 和 `error` 使用 `role="alert"`。
`info` 和 `success` 使用 `role="status"`。
初次页面渲染中的消息不保证触发屏幕阅读器播报。

单个字段的校验消息使用 [FieldStatus](/components/field).

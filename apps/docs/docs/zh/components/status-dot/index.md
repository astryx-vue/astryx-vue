---
layout: component-docs
title: 状态点
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { statusDotVariants, statusDotPulsing } from '../../../../components/demos/status-dot'
</script>

## 使用方法

`StatusDot` 是一个轻量的状态指示点，常出现在头像角标、列表项和监控页面中，用颜色快速传达在线、异常等状态。从独立入口导入即可，结构样式会随组件自动加载：

```vue
<script setup lang="ts">
import { StatusDot } from '@astryx-vue/core/StatusDot'
</script>

<template>
  <StatusDot label="在线" variant="success" />
</template>
```

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | `label` 是必填项：状态点本身没有文字，屏幕阅读器用户依赖这个 `aria-label` 理解当前状态，描述应写清状态的含义。 |
| <Badge variant="success">推荐</Badge> | 把状态点当作辅助信号，和附近的文字标签搭配使用，用户不必辨认颜色也能读懂状态。 |
| <Badge variant="success">推荐</Badge> | 直播、同步、录制等正在进行的活动可以开启 `isPulsing`，脉冲动画能明确传达“进行中”的感觉。 |
| <Badge variant="error">避免</Badge> | 仅用颜色传达关键状态：色觉障碍用户无法区分颜色，关键状态必须同时给出文字或图标说明。 |
| <Badge variant="error">避免</Badge> | 在同一界面放置过多脉冲状态点：持续动画容易分散注意力，只给真正有活动的状态开启。 |

## 示例

<DemoExample
  :demo="statusDotVariants"
  description="状态点有 neutral、info、success、warning、error 五种语义变体。"
  locale="zh"
  title="变体"
/>

<DemoExample
  :demo="statusDotPulsing"
  description="设置 isPulsing 可以让状态点呼吸闪烁，表示活动中的状态。"
  locale="zh"
  title="脉冲"
/>

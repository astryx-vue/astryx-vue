---
layout: component-docs
title: 可点击卡片
outline: false
footer: false
---

<script setup lang="ts">
import { clickableCardElevated, clickableCardNested } from '../../../../components/demos/clickable-card'
</script>

## 使用方法

`ClickableCard` 是整张卡片触发同一个动作的卡片。有 `href` 时，键盘焦点落在一个视觉上隐藏的链接上，否则落在按钮上。里面的按钮和链接仍走自己的点击。

```vue
<script setup lang="ts">
import { ClickableCard } from '@astryx-vue/core/ClickableCard'
import { Heading } from '@astryx-vue/core/Heading'
</script>

<template>
  <ClickableCard href="/settings" label="Settings">
    <Heading :level="4">
      Settings
    </Heading>
  </ClickableCard>
</template>
```

`target="_blank"` 会在新标签页打开 `href`。按住修饰键或用中键点击也一样。`elevation` 和 `variant` 传给 `Card`。

## 示例

<DemoExample :demo="clickableCardElevated" description="Quarterly report，用中等阴影抬起来。" locale="zh" title="抬升" />
<DemoExample :demo="clickableCardNested" description="Wireless Headphones。Add to cart 是卡片里单独的按钮。" locale="zh" title="嵌套按钮" />

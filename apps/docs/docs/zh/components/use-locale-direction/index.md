---
layout: component-docs
title: useLocaleDirection
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
</script>

## 使用方法

读出最近的 `InternationalizationProvider` 定下的书写方向。这是最后的手段：只有脚本里非知道方向不可时才用，比如在 canvas 上画图，用不了 CSS 逻辑属性。优先顺序是：CSS 逻辑属性（`margin-inline`、`inset-inline`），方向图标的镜像样式，键盘或手势逻辑里直接读 DOM。

```ts
import { useLocaleDirection } from '@astryx-vue/core/InternationalizationProvider'
```

```ts
const direction = useLocaleDirection()

function drawSparkline(context: CanvasRenderingContext2D, values: number[], width: number) {
  const step = width / (values.length - 1)
  values.forEach((value, index) => {
    // The time axis starts on the inline-start edge: the right side in a right-to-left locale.
    const x = direction.value === 'rtl' ? width - index * step : index * step
    context.lineTo(x, value)
  })
  context.stroke()
}
```

## 建议

| 指引 | 做法 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 先用 CSS 逻辑属性和方向镜像样式，实在不行再用 `useLocaleDirection`。 |
| <Badge variant="success">推荐</Badge> | 在 canvas 上画图，或者计算起点随书写方向变化的非 CSS 坐标时使用。 |
| <Badge variant="error">避免</Badge> | 用它来切换 CSS 逻辑属性本来就能处理的外边距、内边距或行内对齐。 |

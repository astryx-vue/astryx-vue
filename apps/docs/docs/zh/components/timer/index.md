---
layout: component-docs
title: 计时
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { timerFormats, timerInline, timerShowcase, timerTypography } from '../../../../components/demos/timer'
</script>

## 使用方法

`Timer` 把一段正在增加的时长写进 `<time>`。`startTime` 是毫秒级 unix 时间。不传就从这次挂载开始计。文字和 `dateTime` 直接写在元素上。组件不会为每一次跳动重新渲染，也不使用 `aria-live`。

默认 `format="elapsed"`。不到一分钟显示 `Ns`，不到一小时显示 `Nm NNs`，满一小时显示 `Nh NNm`，文字和 `dateTime` 都不再带秒（存成 `PT{分钟数 × 60}S`）。`format="clock"` 始终精确到秒：不到一小时是 `m:ss`，超过则是 `h:mm:ss`，`dateTime` 为 `PT{秒数}S`。

未满一小时时大约每秒更新一次，elapsed 满一小时后改为每分钟一次。如果 `startTime` 还在未来，第一次变化会等到开始后再过一秒。

排版和 `Timestamp` 同一套。`type` 默认 `supporting`，`color` 默认 `secondary`。`type="inherit"` 不用 `Text` 包一层，字体跟周围走。`color="disabled"` 用禁用文字色。`size` 和 `weight` 的覆盖方式和 `Text` 一样。

```vue
<script setup lang="ts">
import { Text } from '@astryx-vue/core/Text'
import { Timer } from '@astryx-vue/core/Timer'
</script>

<template>
  <Text type="body" color="primary">
    Processing for <Timer type="inherit" color="inherit" />
  </Text>
</template>
```

## 建议

| 建议 | 做法 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 状态词旁边用 `elapsed`。读者在盯着秒数时用 `clock`。 |
| <Badge variant="success">推荐</Badge> | 两个计时要一致时，传入同一个 `startTime`。 |
| <Badge variant="success">推荐</Badge> | 写进一句话里时用 `type="inherit"`，时长才跟那一行对齐。 |
| <Badge variant="error">避免</Badge> | 把每一次跳动都播报出去。时间元素就地更新，保持安静。 |
| <Badge variant="error">避免</Badge> | 满一小时后还指望 `elapsed` 精确到秒。这个格式到点就会改成按分钟显示。 |

## 示例

<DemoExample
  :demo="timerShowcase"
  description="同一开始时间下的已用时长和时钟读数，用大号主色排在简短标签旁边。"
  locale="zh"
  title="Timer"
/>

<DemoExample
  :demo="timerFormats"
  description="同一开始时间下，紧凑的已用单位和秒表式时钟记法。"
  locale="zh"
  title="Timer — 格式"
/>

<DemoExample
  :demo="timerInline"
  description="把 Timer 写进状态句子里，并继承周围的排版。"
  locale="zh"
  title="Timer — 行内"
/>

<DemoExample
  :demo="timerTypography"
  description="默认排版与 Timestamp 对齐，另一行用强调样式覆盖。"
  locale="zh"
  title="Timer — 排版"
/>

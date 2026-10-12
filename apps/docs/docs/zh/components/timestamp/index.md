---
layout: component-docs
title: 时间戳
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { timestampAuto, timestampColors, timestampFormats, timestampRelative, timestampTimezone, timestampTooltip } from '../../../../components/demos/timestamp'
</script>

## 使用方法

`Timestamp` 用 `<time>` 画出一个时刻。`value` 是 ISO 字符串，或按秒计的 unix 时间。默认格式是 `auto`：在 `autoThreshold`（七天）以内用相对时间，更早的用 `date_time`。

`hasTooltip` 默认打开，悬停卡片里的时间可以复制。`tooltipEntries` 把同一个时刻列成几种时区或格式。`isTimezoneShown` 在 `date_time` 和 `time` 后面加上短时区名。`isLive` 按较短的间隔刷新相对时间。

相对格式会把带长时区名的说法放进 `aria-label`，不依赖提示卡片也能读出绝对时间。

```vue
<script setup lang="ts">
import { Timestamp } from '@astryx-vue/core/Timestamp'
</script>

<template>
  <Timestamp value="2026-03-25T12:00:00Z" color="primary" />
</template>
```

## 建议

| 建议 | 做法 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 动态和评论用 `auto`。近的显示相对时间，远的变成完整日期。 |
| <Badge variant="success">推荐</Badge> | 日志用 `system_date`、`system_date_time`、`system_time`，并配 `type="code"`。 |
| <Badge variant="success">推荐</Badge> | 读者需要对照本地时区和事件发生时区时，传入 `tooltipEntries`。 |
| <Badge variant="error">避免</Badge> | 相对格式关掉提示，除非旁边已经写了绝对时间。 |
| <Badge variant="error">避免</Badge> | 给系统格式再追加时区。那些字符串要保持机器可读。 |

## 示例

<DemoExample
  :demo="timestampAuto"
  description="较近的时间显示成相对时间，更早的切换成完整日期。大多数场景用这个默认值。"
  locale="zh"
  title="Timestamp — 自动"
/>

<DemoExample
  :demo="timestampColors"
  description="主色、次要色、禁用色和强调色。"
  locale="zh"
  title="Timestamp — 颜色"
/>

<DemoExample
  :demo="timestampFormats"
  description="日期、日期时间、时间，以及对应的系统格式。面向读者用前者，日志和开发工具用系统格式。"
  locale="zh"
  title="Timestamp — 格式"
/>

<DemoExample
  :demo="timestampRelative"
  description="从几秒前到几个月前。悬停可以看到完整日期，适合动态、评论和活动记录。"
  locale="zh"
  title="Timestamp — 相对时间"
/>

<DemoExample
  :demo="timestampTimezone"
  description="在时间后面加上时区缩写。跨时区的审计日志或团队日历打开 isTimezoneShown。"
  locale="zh"
  title="Timestamp — 时区"
/>

<DemoExample
  :demo="timestampTooltip"
  description="悬停提示把同一个时刻列成几种时区或格式，方便对照读者所在时区和事件发生时区。"
  locale="zh"
  title="Timestamp — 提示中的时区"
/>

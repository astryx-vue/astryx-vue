---
layout: component-docs
title: Timer
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { timerFormats, timerInline, timerTypography } from '../../../../components/demos/timer'
</script>

## Usage

`Timer` writes a running duration into a `<time>` element. `startTime` is unix milliseconds. Omit it and the count starts when this timer mounts. The text and `dateTime` are written on the element. The component does not re-render on every tick, and it does not use `aria-live`.

`format="elapsed"` is the default. Under a minute it reads `Ns`. Under an hour it reads `Nm NNs`. At an hour and beyond it reads `Nh NNm` and drops seconds, both in the text and in `dateTime` (`PT{minutes * 60}S`). `format="clock"` stays on seconds: `m:ss`, or `h:mm:ss` past an hour, with `dateTime="PT{seconds}S"`.

The clock updates once a second until the elapsed format reaches an hour, then once a minute. If `startTime` is still in the future, the first change waits until one second after that start.

Typography matches `Timestamp`. `type` defaults to `supporting`, `color` to `secondary`. `type="inherit"` does not wrap the time in `Text`, so it takes the surrounding font. `color="disabled"` uses the disabled text color. `size` and `weight` override the type scale the same way they do on `Text`.

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

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Use `elapsed` next to a status word, and `clock` when the reader is watching seconds. |
| <Badge variant="success">Do</Badge> | Pass the same `startTime` when two timers must agree. |
| <Badge variant="success">Do</Badge> | Use `type="inherit"` inside a sentence so the duration matches the line. |
| <Badge variant="error">Don't</Badge> | Announce every tick. The time element updates in place and stays quiet. |
| <Badge variant="error">Don't</Badge> | Expect second precision from `elapsed` after one hour. That format switches to minutes on purpose. |

## Examples


<DemoExample
  :demo="timerFormats"
  description="Elapsed compact units and stopwatch clock notation shown from the same start time."
  locale="en"
  title="Timer — Formats"
/>

<DemoExample
  :demo="timerInline"
  description="A Timer composed into status copy while inheriting the surrounding typography."
  locale="en"
  title="Timer — Inline"
/>

<DemoExample
  :demo="timerTypography"
  description="Timer using its Timestamp-matched default typography and an emphasized override."
  locale="en"
  title="Timer — Typography"
/>

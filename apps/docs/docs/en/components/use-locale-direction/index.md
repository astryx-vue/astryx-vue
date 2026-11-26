---
layout: component-docs
title: useLocaleDirection
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { useLocaleDirectionSparkline } from '../../../../components/demos/use-locale-direction'
</script>

## Usage

Reads the current text direction from the nearest `InternationalizationProvider`. Reach for it as a last resort, when script needs the direction, such as canvas drawing that cannot use CSS logical properties. In order of preference, favor CSS logical properties (`margin-inline`, `inset-inline`), mirrored styles for directional icons, and DOM reads for keyboard or gesture logic.

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

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Prefer CSS logical properties and directional CSS mirroring before using `useLocaleDirection`. |
| <Badge variant="success">Do</Badge> | Use it when drawing on a canvas or calculating non-CSS layout coordinates where the start edge depends on text direction. |
| <Badge variant="error">Don't</Badge> | Use it to swap margins, paddings, or inline alignment that CSS logical properties already handle. |

## Examples

Common configurations, variations, and states.

<DemoExample
  :demo="useLocaleDirectionSparkline"
  description="A canvas sparkline reads the writing direction with useLocaleDirection, because a canvas does not follow CSS direction. Switch the locale to Arabic and the oldest point moves to the right edge, with the latest value on the left."
  locale="en"
  title="useLocaleDirection — Live Sparkline"
/>

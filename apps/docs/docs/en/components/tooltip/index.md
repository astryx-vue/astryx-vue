---
layout: component-docs
title: Tooltip
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { tooltipActionBar, tooltipHook, tooltipInline } from '../../../../components/demos/tooltip'
</script>

## Usage

`Tooltip` shows a short hint next to a trigger on hover or keyboard focus. The trigger keeps its own behavior.

```vue
<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Tooltip } from '@astryx-vue/core/Tooltip'
</script>

<template>
  <Tooltip content="Save your changes">
    <Button label="Save" />
  </Tooltip>
</template>
```




## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Keep tooltip content concise: aim for under 140 characters of plain text. |
| <Badge variant="success">Do</Badge> | Add a tooltip to icon-only buttons and controls that lack a visible label. |
| <Badge variant="error">Don't</Badge> | Place interactive elements like links or buttons inside a tooltip; use HoverCard or Popover instead. |
| <Badge variant="error">Don't</Badge> | Use tooltips for essential information that users must see to complete a task. |

## Examples

<DemoExample :demo="tooltipActionBar" title="Action bar" description="Save, Cancel, and Delete, each with a hint above the button." locale="en" />

<DemoExample :demo="tooltipHook" title="Hook" description="A button named Using hook directly, with the hint Tooltip via hook." locale="en" />

<DemoExample :demo="tooltipInline" title="Inline text" description="privacy policy and terms of service sit in a sentence, each with its own hint." locale="en" />

## Accessibility

The tooltip bubble is a separate layer, and the component links it to the trigger with ARIA attributes so assistive technology can announce both the extra description attached to the trigger and the text inside the bubble:

- The bubble has `role="tooltip"`, which tells assistive technology to treat it as a hint.
- The trigger receives `aria-describedby` pointing to the bubble's `id`.

The hint appears on mouse hover or keyboard focus. While it is showing, pressing Escape closes an uncontrolled tooltip; a controlled tooltip instead emits `openChange(false)`, and the parent decides whether to close it.

Because the hint appears only on hover or focus and disappears again, users can easily miss it, and touch devices do not always trigger it. Keep essential information that users must see to complete a task out of tooltips.

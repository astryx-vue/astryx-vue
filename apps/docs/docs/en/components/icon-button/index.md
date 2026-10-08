---
layout: component-docs
title: Icon Button
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { iconButtonActionBar, iconButtonAsync, iconButtonFloating, iconButtonTooltips } from '../../../../components/demos/icon-button'
</script>


## Usage

`IconButton` displays one icon. The icon must clearly identify the action. Set `label` to provide an accessible name:

```vue
<script setup lang="ts">
import { IconButton } from '@astryx-vue/core/IconButton'
</script>

<template>
  <IconButton label="Search">
    <span class="i-carbon-search" />
  </IconButton>
</template>
```

astryx-vue ships no icon set, so the artwork is yours: the icon slot takes a CSS icon class from whatever solution you already use (UnoCSS, Tailwind, or a class of your own) or your own component. UnoCSS's icon preset makes the glyph fill its container, and the button already sizes that box, so a bare `<span class="i-carbon-search" />` is enough here; elsewhere give the icon an element with a size of its own.

Use a text-bearing [Button](/en/components/button) when the action is not immediately clear.




## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Make the aria-label specific: a trash icon labeled "Delete conversation" is clearer than just "Delete" for screen readers. |
| <Badge variant="success">Do</Badge> | Add a tooltip: even a gear icon can mean Settings, Preferences, or Configure. |
| <Badge variant="success">Do</Badge> | Use ghost in toolbars and dense areas to reduce visual clutter. |
| <Badge variant="error">Don't</Badge> | Use IconButton if the action isn't obvious from the icon alone; use Button with text. |
| <Badge variant="error">Don't</Badge> | Skip the tooltip; label only reaches screen readers, sighted users need the hover hint. |

## Examples

<DemoExample
  :demo="iconButtonActionBar"
  description="Use low-emphasis icon-only buttons in an action bar to keep frequent controls compact."
  locale="en"
  title="Action bar"
/>

<DemoExample
  :demo="iconButtonFloating"
  description="Icon-only controls are a common floating-action shape. Set elevation=&quot;high&quot; to emphasize the floating action."
  locale="en"
  title="Floating action"
/>

<DemoExample
  :demo="iconButtonAsync"
  description="The button shows a loading indicator during asynchronous work and prevents duplicate activation until it settles."
  locale="en"
  title="Async state"
/>

<DemoExample
  :demo="iconButtonTooltips"
  description="A tooltip explains the icon to sighted users, but it never replaces the required label."
  locale="en"
  title="Tooltip"
/>


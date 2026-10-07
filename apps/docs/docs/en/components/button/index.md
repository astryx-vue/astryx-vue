---
layout: component-docs
title: Button
outline: false
footer: false
---

<script setup lang="ts">
import { buttonAsync, buttonFloating, buttonSizes, buttonVariants } from '../../../../components/demos/button'
</script>


## Usage

`Button` triggers an action. Set `label` to name the action.

Without a default slot, the button displays `label`:

```vue
<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
</script>

<template>
  <Button label="Save changes" variant="primary" />
</template>
```

Use the dedicated [ButtonGroup](/en/components/button-group) and [IconButton](/en/components/icon-button) components when you need connected actions or an explicit icon-only button.

## Examples

Use variants, sizes, and composition to establish action hierarchy. Let <code>clickAction</code> manage loading state for asynchronous work.

<DemoExample
  :demo="buttonVariants"
  description="Reserve primary for the most important action in the view. Secondary, ghost, and destructive communicate regular, low-emphasis, and dangerous actions."
  locale="en"
  title="Visual hierarchy"
/>

<DemoExample
  :demo="buttonFloating"
  description="Use elevation for actions that float above content. Shadow depth changes the resting layer, not the button variant or the action's meaning."
  locale="en"
  title="Floating button"
/>

<DemoExample
  :demo="buttonSizes"
  description="Use sm, md, and lg for compact, default, and more prominent action areas. Size changes the control dimensions, not its meaning."
  locale="en"
  title="Sizes"
/>

<DemoExample
  :demo="buttonAsync"
  description="When clickAction returns a Promise, Button sets aria-busy immediately, prevents duplicate activation, and avoids flashing a spinner when short work settles quickly."
  locale="en"
  title="Async action"
/>


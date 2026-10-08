---
layout: component-docs
title: Button
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
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

astryx-vue ships no icons, so a button that shows one takes it from your own icon solution. The `icon` slot sits in a sized box before the label, and the `end` slot mirrors it:

```vue
<template>
  <Button label="Upload file">
    <template #icon>
      <span class="i-carbon-upload" />
    </template>
  </Button>
  <Button label="Continue" variant="secondary">
    <template #end>
      <span class="i-carbon-chevron-right" />
    </template>
  </Button>
</template>
```

Any CSS icon class works — an UnoCSS class, a Tailwind utility, or a class of your own — and so does a component that draws the SVG. UnoCSS's icon preset fills its container, which the button already sizes for you.




## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Reserve primary for the single most important action in the view. Use secondary or ghost for everything else based on emphasis. |
| <Badge variant="success">Do</Badge> | Write labels that describe the action ("Save changes", "Delete account", "Send invite"), not vague labels like "OK" or "Click here". |
| <Badge variant="success">Do</Badge> | Show a loading state for actions that take time, like saving or submitting, so the user knows it is working. |
| <Badge variant="success">Do</Badge> | Always provide a label for icon-only buttons so screen readers can announce what the button does. Add a tooltip for sighted users. |
| <Badge variant="success">Do</Badge> | For a dedicated icon-only button, use IconButton from '@astryx-vue/core/IconButton'. It is a separate component, not exported from '@astryx-vue/core/Button'. |
| <Badge variant="error">Don't</Badge> | Place more than one primary button in the same view; this dilutes the visual hierarchy. |
| <Badge variant="error">Don't</Badge> | Use the destructive variant without a confirmation step for irreversible actions like deleting data. |
| <Badge variant="error">Don't</Badge> | Use a button for navigation. If it only takes the user to another page, use a link instead. Buttons are for actions like saving, deleting, or submitting. |

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


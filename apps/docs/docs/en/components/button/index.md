---
layout: component-docs
title: Button
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { buttonEndSlot, buttonFloating, buttonIcon, buttonSizes, buttonVariants } from '../../../../components/demos/button'
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

The `icon` slot sits in a sized box before the label, and the `end` slot mirrors it. Put an [Icon](/en/components/icon) there and leave its `size` unset; the slot already decides the box:

```vue
<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Icon } from '@astryx-vue/core/Icon'
</script>

<template>
  <Button label="Upload file">
    <template #icon>
      <Icon name="carbon:upload" />
    </template>
  </Button>
  <Button label="Continue" variant="secondary">
    <template #end>
      <Icon name="carbon:chevron-right" />
    </template>
  </Button>
</template>
```

A CSS icon class still works in the slot if you already generate one. UnoCSS is not required.





<ComponentAnatomy />

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

<DemoExample
  :demo="buttonFloating"
  description="A floating action button raised with elevation=&quot;med&quot;. Use elevation for buttons that hover above content, like a FAB."
  locale="en"
  title="Floating"
/>

<DemoExample
  :demo="buttonSizes"
  description="Small, medium, and large buttons side by side. Use small in dense UIs like toolbars, medium for most cases, and large for prominent CTAs."
  locale="en"
  title="Sizes"
/>

<DemoExample
  :demo="buttonVariants"
  description="All 4 button variants in default, disabled, and loading states. Use primary for the main action, secondary for most others, ghost for low-emphasis, and destructive for dangerous actions."
  locale="en"
  title="Variants"
/>

<DemoExample
  :demo="buttonEndSlot"
  description="Buttons with a trailing badge showing a count or status. Use for notification counts, unread messages, or any button that needs a visual indicator."
  locale="en"
  title="End slot"
/>

<DemoExample
  :demo="buttonIcon"
  description="Buttons with a leading icon that reinforces the label. Use when the icon helps the user identify the action faster, like a plus for New or a trash can for Delete."
  locale="en"
  title="Icon"
/>

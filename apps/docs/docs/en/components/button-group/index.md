---
layout: component-docs
title: Button Group
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { buttonGroupBasic, buttonGroupFloating } from '../../../../components/demos/button-group'
</script>


## Usage

`ButtonGroup` connects related buttons into one group. Buttons have no gap. Separators distinguish adjacent buttons:

```vue
<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { ButtonGroup } from '@astryx-vue/core/ButtonGroup'
</script>

<template>
  <ButtonGroup label="Editing actions">
    <Button label="Copy" />
    <Button label="Cut" />
    <Button label="Paste" />
  </ButtonGroup>
</template>
```




## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Group buttons that perform related actions on the same object, like copy, cut, paste on selected text. |
| <Badge variant="success">Do</Badge> | Use the same variant for all buttons in a group so they look like a single connected unit. |
| <Badge variant="success">Do</Badge> | Keep groups small (2–4 buttons). For more actions, use a Toolbar or DropdownMenu instead. |

## Examples

<DemoExample
  :demo="buttonGroupBasic"
  description="Keep 2–4 closely related actions together and use a consistent variant so they read as one connected control."
  locale="en"
  title="Basic group"
/>

<DemoExample
  :demo="buttonGroupFloating"
  description="Elevation belongs to the whole group rather than an individual member, so the connected controls rise as one floating surface."
  locale="en"
  title="Floating group"
/>


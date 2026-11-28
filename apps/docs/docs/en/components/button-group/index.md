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





On a touch-first device such as a phone or tablet, a press tracks like a menu for a finger or a pen: press a button and slide across the others, and the highlight follows. The button you lift on runs, and lifting outside the group runs nothing. A mouse press acts as a native button's. A menu trigger in the group (with `aria-haspopup`) keeps its own opening. The group grows its buttons' tap targets toward 44 px, stopping halfway to the nearest interactive neighbor outside the group; a tap in that band goes to the nearest button.

<ComponentAnatomy />

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Group buttons that perform related actions on the same object, like copy, cut, paste on selected text. |
| <Badge variant="success">Do</Badge> | Use the same variant for all buttons in a group so they look like a single connected unit. |
| <Badge variant="success">Do</Badge> | Keep groups small (2–4 buttons). For more actions, use a Toolbar or DropdownMenu instead. |

## Examples

<DemoExample
  :demo="buttonGroupBasic"
  description="Three related actions joined into a single connected control. Provide a group label for accessibility and keep all buttons the same variant so they read as one unit."
  locale="en"
  title="Basic"
/>

<DemoExample
  :demo="buttonGroupFloating"
  description="A grouped action bar raised with elevation=&quot;med&quot;. The connected buttons share one surface, so the shadow lifts them as a unit."
  locale="en"
  title="Floating"
/>

---
layout: component-docs
title: useInputContainer
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { useInputContainerSearchField } from '../../../../components/demos/use-input-container'
</script>

## Usage

Makes an input container wrapper clickable, delegating focus to the inner input/textarea when the user clicks non-interactive areas (icons, padding, status indicators). Built on top of `useClickableContainer`, so nested interactive elements (clear buttons, calendar toggles, links) are handled safely; clicking them does NOT steal focus from the input. Automatically detects input type: text-like inputs receive `.focus()`, while other types (checkbox, radio, file) receive `.click()`.

```ts
import { useInputContainer } from '@astryx-vue/core'
```

Put `ref` on the wrapper and on the inner input, then attach `onClick` to `@click` and `onMouseUp` to `@mouseup` on the wrapper. The hook adds `data-pressable-container` to that wrapper on the first click, so nested containers do not fight over the same click.


## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Use inside input wrapper components (TextInput, NumberInput, TimeInput, TextArea) to make the full container area clickable. |
| <Badge variant="success">Do</Badge> | Attach both `onClick` and `onMouseUp` to the wrapper element for full interaction handling. |
| <Badge variant="error">Don't</Badge> | Use on bare inputs without a wrapper; there is no benefit if the input already fills the full clickable area. |

## Examples

Common configurations, variations, and states.

<DemoExample
  :demo="useInputContainerSearchField"
  description="A custom search field wrapper with a leading search icon, padding and a trailing Clear button. useInputContainer puts focus in the input when the icon or the padding is clicked, while a click on Clear empties the field without the wrapper taking it over."
  locale="en"
  title="useInputContainer — Search Field Wrapper"
/>

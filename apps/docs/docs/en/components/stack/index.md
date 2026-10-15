---
layout: component-docs
title: Stack
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { stackAlignment, stackFill } from '../../../../components/demos/stack'
</script>


## Usage

Import the component from its dedicated entry. The component loads its structural styles.

Import the theme in your application entry:

```ts
import '@astryx-vue/themes/neutral.css'
```

Component usage:

```vue
<script setup lang="ts">
import { HStack, Stack, StackItem, VStack } from '@astryx-vue/core/Stack'
</script>
```





<ComponentAnatomy />

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Use the gap prop for spacing between items; don't add margins manually. |
| <Badge variant="success">Do</Badge> | Use StackItem with size="fill" to make one item stretch and fill the leftover space. |
| <Badge variant="error">Don't</Badge> | Nest stacks inside stacks; try wrap="wrap" first to let items flow to the next line. |

## Examples

<DemoExample :demo="stackAlignment" description="Buttons sit at the start, the center, and the end of a row." locale="en" title="Alignment" />

<DemoExample :demo="stackFill" description="An avatar, a name, and a button share a row. The name stretches to fill the space between them." locale="en" title="Fill item" />

---
layout: component-docs
title: Stack
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { stackDirections, stackHStack, stackItem, stackVStack } from '../../../../components/demos/stack'
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




## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Use the gap prop for spacing between items; don't add margins manually. |
| <Badge variant="success">Do</Badge> | Use StackItem with size="fill" to make one item stretch and fill the leftover space. |
| <Badge variant="error">Don't</Badge> | Nest stacks inside stacks; try wrap="wrap" first to let items flow to the next line. |

## Examples

Common direction and space-distribution configurations.

<DemoExample
  :demo="stackDirections"
  description="With horizontal, children flow from left to right. With vertical, they flow from top to bottom. Stack uses vertical by default."
  locale="en"
  title="Stack — Direction"
/>

<DemoExample
  :demo="stackHStack"
  description="HStack always uses a horizontal direction and is equivalent to Stack with direction set to horizontal."
  locale="en"
  title="HStack — Basic"
/>

<DemoExample
  :demo="stackVStack"
  description="VStack always uses a vertical direction and is equivalent to Stack with direction set to vertical."
  locale="en"
  title="VStack — Basic"
/>

<DemoExample
  :demo="stackItem"
  description="StackItem uses static sizing by default. Set it to fill to occupy the remaining space in the stack."
  locale="en"
  title="StackItem — Size"
/>


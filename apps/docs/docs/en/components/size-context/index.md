---
layout: component-docs
title: Size Context
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { sizeContextOverview } from '../../../../components/demos/size-context'
</script>

## Usage

`SizeProvider` sets a default size (`sm`, `md`, or `lg`) for a whole subtree. Interactive components inside use it when they have no `size` of their own; a component with an explicit `size` is unaffected. It renders no extra element and passes its default slot through.

```ts
import { SizeProvider, useSize, provideSize } from '@astryx-vue/core/SizeContext'
```

Size resolves in this order, first match wins:

1. The explicit `size` on the component.
2. `Button` only: the size of the enclosing `ButtonGroup`.
3. The context from an enclosing `SizeProvider` or container component.
4. The component's own default.

`Toolbar`, `ButtonGroup`, and `InputGroup` provide their size automatically, so children need no per-item `size`. `Button`, `MoreMenu`, `TextInput`, `TextArea`, `Selector`, `MultiSelector`, `NumberInput`, the date inputs and `TimeInput`, `SegmentedControl`, `TabList`, `PowerSearch`, and `Tokenizer` consume it.

Like other layer-scoped context, it resets inside teleported overlay layers: menus, popovers, and similar content rendered through a Teleport do not inherit the outer size. Add another `SizeProvider` inside the layer if needed.

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Set one size for a whole region with `SizeProvider`, or the `size` of `Toolbar` or `InputGroup`, instead of repeating it on every child. |
| <Badge variant="success">Do</Badge> | For a single exception, set `size` on that component; it always wins. |
| <Badge variant="error">Don't</Badge> | Expect `SizeProvider` to reach content inside overlay layers: teleported content falls back to defaults. |

## Examples

Common configurations, variations, and states.

<DemoExample :demo="sizeContextOverview" title="SizeContext — SizeProvider" description="The first row uses default sizes; the second is wrapped in SizeProvider value=&quot;sm&quot;, so the Button and TextInput both render small." locale="en" />

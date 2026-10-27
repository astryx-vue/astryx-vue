---
layout: component-docs
title: Layer Provider
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { layerProviderOverview } from '../../../../components/demos/layer-provider'
</script>

## Usage

Layer utilities provide the app-level provider used by overlay systems. Use `LayerProvider` at the app root for toast/layer configuration; use higher-level `Popover`, `HoverCard`, or `Tooltip` APIs for most overlay UI. Rendered layer content, not the provider's application subtree, uses theme body text defaults and exits ancestor surface/group membership. Establish intentional groups and complete required providers inside each layer. Every anchored layer keeps a gutter from each viewport edge — the spacing-4 step or the device safe-area inset, whichever is larger — and is capped to the viewport, never to the room beside its trigger. An app that floats a persistent bar over a viewport edge declares it once as `inset` on `LayerProvider` (`blockStart`, `blockEnd`, `inlineStart`, `inlineEnd`); each edge adds to that edge's gutter for every anchored layer and moves the toast viewport by the same amount, and defaults to zero. The inset is app configuration, not a theme value.

```ts
import { LayerProvider } from '@astryx-vue/core/LayerProvider'
```

`toast` takes `position` (the toast viewport corner), `maxVisible` (how many toasts are on screen at once), and its own `inset`, which overrides the provider inset per edge for toasts only.

Nested `LayerProvider` instances never open a second toast viewport: the outer one stays in charge of toasts. One that declares its own `inset`, though, narrows that inset for the anchored layers in its subtree.

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Declare a persistent bar floating over the viewport once, as `inset` on `LayerProvider`; every anchored layer and toast then stays clear of it. |
| <Badge variant="success">Do</Badge> | Use `LayerProvider` once near the app root when you need shared toast/layer configuration. |
| <Badge variant="success">Do</Badge> | Build on higher-level components like `Popover`, `HoverCard`, and `Tooltip` for common overlay patterns. |
| <Badge variant="error">Don't</Badge> | Add nested `LayerProvider` instances for anything but a subtree that declares its own `inset`: they add depth without a second toast viewport. |

## Examples

Common configurations, variations, and states.

<DemoExample :demo="layerProviderOverview" title="LayerProvider — Toast Viewport" description="Pin the toast viewport to the top end, cap it at two toasts, and push it down by 8px so it clears a bar floating over the top edge." locale="en" />

---
layout: component-docs
title: Command Palette Item
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { commandPaletteItemBasic } from '../../../../components/demos/command-palette-item'
</script>

## Usage

Use `CommandPaletteItem` for one non-interactive result row inside `CommandPaletteList` or `CommandPaletteGroup`. `CommandPalette` owns the composite keyboard model; standalone items expose only their explicit visual state and pointer activation.

```ts
import { CommandPaletteItem } from '@astryx-vue/core/CommandPalette'
```

<ComponentAnatomy />

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Keep each `value` unique within the result list so highlight, active-descendant identity, and selection resolve to the same item. |
| <Badge variant="success">Do</Badge> | Use non-interactive child content such as icons, descriptions, and shortcut hints; activate the option itself instead of nesting buttons or links. |
| <Badge variant="error">Don't</Badge> | Treat `isHighlighted` as selection. Highlight is the active keyboard result; `isSelected` represents the chosen value. |

## Examples

Common configurations, variations, and states.

<DemoExample :demo="commandPaletteItemBasic" title="Basic" description="Selectable command palette items inside a CommandPaletteList, including highlighted and disabled states. Use when composing a palette manually instead of a search source." locale="en" />

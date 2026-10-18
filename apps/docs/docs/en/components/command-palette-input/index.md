---
layout: component-docs
title: Command Palette Input
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { commandPaletteInputBasic } from '../../../../components/demos/command-palette-input'
</script>

## Usage

Use `CommandPaletteInput` inside `CommandPalette` for a popup-backed command query, or as an independent search field when no result popup is present.

```ts
import { CommandPaletteInput } from '@astryx-vue/core/CommandPalette'
```

<ComponentAnatomy />

## Best practices

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | Pass a concise `label` that identifies what can be searched when "Search commands" does not describe it; the placeholder is never the field's name. |
| <Badge variant="success">Do</Badge> | Use `endContent` for short supporting controls or shortcut hints at the trailing edge. |
| <Badge variant="error">Don't</Badge> | Override combobox role or popup state. `CommandPaletteInput` owns those semantics when connected to `CommandPalette`. |

## Examples

Common configurations, variations, and states.

<DemoExample :demo="commandPaletteInputBasic" title="With End Content" description="Custom placeholder and a keyboard shortcut badge in the trailing slot via endContent." locale="en" />

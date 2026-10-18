---
layout: component-docs
title: Command Palette Footer
outline: false
footer: false
---

<script setup lang="ts">
import { commandPaletteFooterBasic } from '../../../../components/demos/command-palette-footer'
</script>

## Usage

`CommandPalette` renders `CommandPaletteFooter` automatically. Pass a `CommandPaletteFooter` to the `footer` slot only when replacing the default guidance.

```ts
import { CommandPaletteFooter } from '@astryx-vue/core/CommandPalette'
```

<ComponentAnatomy />

## Examples

Common configurations, variations, and states.

<DemoExample :demo="commandPaletteFooterBasic" title="Basic" description="A command palette footer with no children, rendering the built-in keyboard navigation hints. Use CommandPaletteFooter without content to get the default arrow-key, Enter, and Esc hints below the results list." locale="en" />

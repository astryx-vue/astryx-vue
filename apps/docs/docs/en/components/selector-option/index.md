---
layout: component-docs
title: Selector Option
outline: false
footer: false
---

<script setup lang="ts">
import { selectorOptionBasic } from '../../../../components/demos/selector-option'
</script>

## Usage

Helper component for custom item rendering inside an `Selector` `renderOption` prop.

```ts
import type { SelectorOption } from '@astryx-vue/core/Selector'
```

In this port `SelectorOption` is the shape of one entry in a [Selector](/en/components/selector)'s `options`, not a component of its own: `label` is the primary text and `description` the secondary line under it, which is what the original helper drew. The built-in row already renders both, so a plain object covers the common case. When a row needs more than that, the `option` slot receives the same object and replaces the content.

A bare string is also accepted as an option, and stands for the value and the label at once.

## Examples

Common configurations, variations, and states.

<DemoExample :demo="selectorOptionBasic" title="Basic" description="A selector whose options are rendered with SelectorOption, adding a secondary description below each label. Use inside renderOption for consistent custom option styling." locale="en" />

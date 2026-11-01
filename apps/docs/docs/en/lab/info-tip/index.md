---
layout: lab-docs
title: InfoTip
---

# InfoTip

Places an information button beside a term or metric, with help available on hover, keyboard focus, or tap.

<script setup lang="ts">
import { labInfoTip } from '../../../../components/lab-demos'
</script>

<ClientOnly><DemoExample :demo="labInfoTip" description="The trigger aligns with adjacent text and supports mouse and keyboard interaction." locale="en" title="Basic usage" /></ClientOnly>

## Import

```ts
import { InfoTip } from '@astryx-vue/lab'
```

## Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `content` | `string` | `undefined` | Plain-text tooltip content. |
| `label` | `string` | `'More information'` | Accessible trigger name. |
| `size` | `'xsm' \| 'sm' \| 'md' \| 'lg'` | `'sm'` | Information icon size. |

Use the `content` slot instead of the prop for rich content.

---
layout: component-docs
title: Input Group
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { inputGroupBasic, inputGroupWithIcon } from '../../../../components/demos/input-group'
</script>

## Usage

`InputGroup` combines an input with a `before` prefix and an `after` suffix. The addons can be text, an icon, or a button.

## Best practices

| Guideline | Practice |
| --- | --- |
| <Badge variant="success">Do</Badge> | Use `before` for a fixed prefix such as a unit or `https://`. |
| <Badge variant="success">Do</Badge> | Use `after` for a short action, such as clear or submit. |
| <Badge variant="success">Do</Badge> | Keep the addons short so the field itself stays easy to read. |
| <Badge variant="error">Don't</Badge> | Stack several addons on both sides. The field becomes cramped. |

## Examples

<DemoExample
  :demo="inputGroupBasic"
  description="Combine input with prefix/suffix slots for URL, email scenarios."
  locale="en"
  title="Basic Usage"
/>

<DemoExample
  :demo="inputGroupWithIcon"
  description="The before slot can hold a short prefix that explains the field."
  locale="en"
  title="Prefix"
/>

---
layout: component-docs
title: Collapsible Group
outline: false
footer: false
---

<script setup lang="ts">
import { collapsibleGroupAccordion, collapsibleGroupCoordinated } from '../../../../components/demos/collapsible-group'
</script>

## Usage

`CollapsibleGroup` coordinates the `Collapsible` sections inside it. Give each section a `value`. Inside the group, that section's own `isOpen` is ignored.

`type="single"` keeps one section open. Opening another closes the previous one, and clicking the open section closes it. The value is a string, or `''` when everything is closed. `type="multiple"` toggles each section on its own, and the value is a list. `hasDividers` draws a hairline between sections. With dividers and no `density`, the padding is `balanced`.

```vue
<script setup lang="ts">
import { Collapsible, CollapsibleGroup } from '@astryx-vue/core/Collapsible'
</script>

<template>
  <CollapsibleGroup default-value="account" type="single">
    <Collapsible trigger="Account" value="account">
      Profile, email, and password.
    </Collapsible>
    <Collapsible trigger="Billing" value="billing">
      Invoices and payment method.
    </Collapsible>
  </CollapsibleGroup>
</template>
```

## Examples

<DemoExample :demo="collapsibleGroupCoordinated" description="Shipping, returns, and payment. Each section sits in its own card, and only one stays open." locale="en" title="Collapsible group" />
<DemoExample :demo="collapsibleGroupAccordion" description="Account starts open. Notifications and Billing take its place when they open." locale="en" title="Accordion" />

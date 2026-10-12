---
layout: component-docs
title: 折叠组
outline: false
footer: false
---

<script setup lang="ts">
import { collapsibleGroupDensity } from '../../../../components/demos/collapsible-group'
</script>

## 使用方法

`CollapsibleGroup` 协调里面的 `Collapsible`。每一项都要有 `value`。进了组之后，单项自己的 `isOpen` 不再起作用。

`type="single"` 同时只展开一项。展开另一项会收起前一项，再点已展开的项会把它收起。值是字符串，全部收起时是 `''`。`type="multiple"` 每项各自开关，值是数组。`hasDividers` 在项与项之间画一条细线。开了分隔线又没写 `density` 时，内边距用 `balanced`。

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

## 示例

<DemoExample :demo="collapsibleGroupDensity" description="compact、balanced 和 spacious。density 决定每一行的内边距，分隔线把各项隔开。" locale="zh" title="密度" />

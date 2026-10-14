---
layout: component-docs
title: 下拉菜单单选项
outline: false
footer: false
---

## 使用方法

`DropdownMenuRadioItem` 是 [下拉菜单单选组](/components/dropdown-menu-radio-group) 里的一个选项，角色是 `menuitemradio`。它必须放在这个组里面。组的当前值与这一项的 `value` 相同，这一行才是选中的。

```vue
<script setup lang="ts">
import { DropdownMenu, DropdownMenuRadioGroup, DropdownMenuRadioItem } from '@astryx-vue/core/DropdownMenu'
import { ref } from 'vue'

const sort = ref('option-1')
</script>

<template>
  <DropdownMenu :button="{ label: '排序' }">
    <DropdownMenuRadioGroup v-model="sort" label="单选组">
      <DropdownMenuRadioItem value="option-1" label="选项 1" />
    </DropdownMenuRadioGroup>
  </DropdownMenu>
</template>
```

单选圆点是装饰，整行才是控件。禁用的选项仍留在组里，但不能被选中。

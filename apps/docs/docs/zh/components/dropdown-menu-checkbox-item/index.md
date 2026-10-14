---
layout: component-docs
title: 下拉菜单勾选项
outline: false
footer: false
---

## 使用方法

`DropdownMenuCheckboxItem` 是 [下拉菜单](/components/dropdown-menu) 里的一行可勾选操作，角色是 `menuitemcheckbox`。它切换自己的布尔值，并保持菜单打开，方便一次改好几项设置。多选一的场景用 [下拉菜单单选组](/components/dropdown-menu-radio-group)。

```vue
<script setup lang="ts">
import { DropdownMenu, DropdownMenuCheckboxItem } from '@astryx-vue/core/DropdownMenu'
import { ref } from 'vue'

const archived = ref(false)
</script>

<template>
  <DropdownMenu :button="{ label: '视图' }">
    <DropdownMenuCheckboxItem v-model="archived" label="显示已归档" />
  </DropdownMenu>
</template>
```

勾选标记是装饰，整行才是控件，选中状态写在 `aria-checked` 上。禁用的行仍留在菜单里，方向键会跳过它，点击也不会切换。

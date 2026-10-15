---
layout: component-docs
title: 下拉菜单单选组
outline: false
footer: false
---

## 使用方法

`DropdownMenuRadioGroup` 是 [下拉菜单](/components/dropdown-menu) 里的一组单选行。组的角色是 `group`，每个选项是角色为 `menuitemradio` 的 [下拉菜单单选项](/components/dropdown-menu-radio-item)。组自己持有当前选中的值，并按菜单原有的行间距排列选项。选中一项后菜单收起，因为选择已经完成。

```vue
<script setup lang="ts">
import { DropdownMenu, DropdownMenuRadioGroup, DropdownMenuRadioItem } from '@astryx-vue/core/DropdownMenu'
import { ref } from 'vue'

const sort = ref('newest')
</script>

<template>
  <DropdownMenu :button="{ label: '排序' }">
    <DropdownMenuRadioGroup v-model="sort" label="排序方式">
      <DropdownMenuRadioItem value="newest" label="最新" />
      <DropdownMenuRadioItem value="oldest" label="最早" />
    </DropdownMenuRadioGroup>
  </DropdownMenu>
</template>
```

`label` 是这一组的无障碍名称，选项会作为同一组被朗读。还没有选中任何一项时，把值留空。

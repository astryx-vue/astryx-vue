---
layout: component-docs
title: 下拉菜单分组
outline: false
footer: false
---

## 使用方法

`DropdownMenuGroup` 是复合菜单里一组带标题的行。它渲染成 `role="group"`，并用标题作为这一组的无障碍名称；标题只是普通文字，不是 `menuitem`，所以方向键和首字母查找都会跳过它。数据数组里的等价写法是在 `items` 里放一条 `{type: "section", title, items}`；两种写法的标题用同一套字号和主题。

```ts
import { DropdownMenuGroup } from '@astryx-vue/core/DropdownMenu'
```

```vue
<script setup lang="ts">
import { DropdownMenu, DropdownMenuGroup, DropdownMenuItem } from '@astryx-vue/core/DropdownMenu'
</script>

<template>
  <DropdownMenu :button="{ label: '视图' }">
    <DropdownMenuGroup title="显示">
      <DropdownMenuItem label="显示已归档" />
      <DropdownMenuItem label="紧凑行高" />
    </DropdownMenuGroup>
  </DropdownMenu>
</template>
```

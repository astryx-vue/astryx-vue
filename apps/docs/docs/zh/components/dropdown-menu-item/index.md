---
layout: component-docs
title: 下拉菜单项
outline: false
footer: false
---

## 使用方法

`DropdownMenuItem` 是菜单里的一行，把「自己做一行」这件事变成写几个属性，样式自然和别的行一致。写在它上面的原生属性和 DOM 事件（`aria-`、`data-`、`id`、拖放相关）都会落到行的根元素，也就是带 `role="menuitem"` 的那个元素。

```ts
import { DropdownMenuItem } from '@astryx-vue/core/DropdownMenu'
```

```vue
<script setup lang="ts">
import { DropdownMenu, DropdownMenuItem } from '@astryx-vue/core/DropdownMenu'
import { Kbd } from '@astryx-vue/core/Kbd'
</script>

<template>
  <DropdownMenu :button="{ label: '操作' }">
    <DropdownMenuItem description="重命名、移动或更换封面" label="编辑项目" />
    <DropdownMenuItem label="复制项目">
      <template #endContent>
        <Kbd keys="mod+d" />
      </template>
    </DropdownMenuItem>
    <DropdownMenuItem label="删除项目" variant="destructive" />
  </DropdownMenu>
</template>
```

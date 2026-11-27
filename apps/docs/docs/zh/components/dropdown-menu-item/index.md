---
layout: component-docs
title: 下拉菜单项
outline: false
footer: false
---

## 使用方法

`DropdownMenuItem` 是菜单里的一行，把「自己做一行」这件事变成写几个属性，样式自然和别的行一致。一行就是一个交互目标：`label`、`description`、`icon`、`endContent` 里不要放按钮、链接等可聚焦的控件，控件请放进单独的行，或菜单的 `header`、`footer`。要跳转到某个地址就用 `href`，链接提供者、带修饰键的点击和中键点击才都能照常工作；只有操作的结果就显示在这一行上时，才用 `hasCloseOnSelect=false`。写在它上面的原生属性和 DOM 事件（`aria-`、`data-`、`id`、拖放相关）都会落到行的根元素，也就是带 `role="menuitem"` 的那个元素。

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

---
layout: component-docs
title: 下拉菜单子菜单
outline: false
footer: false
---

## 使用方法

`DropdownMenuSubMenu` 是菜单里的一行，点开会从旁边飞出下一级。这一行本身的用法和 `DropdownMenuItem` 一样（`label` / `icon` / `description` / `isDisabled`），插槽里的内容就是飞出的那一层。面板默认向行尾那一侧飞出，空间不够时会自动翻到另一侧；右方向键、回车和空格打开并把焦点放到第一项，左方向键和 Escape 关掉它并把焦点还给这一行（从右往左书写的界面里左右互换）。在手机上（菜单打开时就按粗指针判定），这一行不飞出，而是在同一个框里用下一级的行换掉当前的行，最上面多一行返回，文案是「返回 \<父级名字\>」；返回、Escape 或左方向键回到这一行。写在组件上的原生属性和 DOM 事件（`aria-`、`data-`、`id`）落到触发这一行的元素上，也就是带 `role="menuitem"` 和 `aria-haspopup="menu"` 的元素；调用方的处理函数在行自己的逻辑之后运行，只有打开飞出面板的那几个键（打开方向键、回车、空格）和点击禁用行除外。用数据数组写菜单时，直接在菜单项上放嵌套的 `items`，不要再用这个组件。

```ts
import { DropdownMenuSubMenu } from '@astryx-vue/core/DropdownMenu'
```

```vue
<script setup lang="ts">
import { DropdownMenu, DropdownMenuItem, DropdownMenuSubMenu } from '@astryx-vue/core/DropdownMenu'
</script>

<template>
  <DropdownMenu :button="{ label: '操作' }">
    <DropdownMenuItem label="重命名" />
    <DropdownMenuSubMenu label="移动到">
      <DropdownMenuItem label="项目" />
      <DropdownMenuItem label="归档" />
      <DropdownMenuItem label="废纸篓" />
    </DropdownMenuSubMenu>
  </DropdownMenu>
</template>
```

---
layout: component-docs
title: 下拉菜单分隔线
outline: false
footer: false
---

## 使用方法

`DropdownMenuDivider` 是复合菜单里把两组行分开的一条横线。它渲染成 `role="separator"`，所以方向键永远不会停在它上面。数据数组里的等价写法是在 `items` 里放一条 `{type: "divider"}`；两种写法渲染的是同一个组件，长相和主题完全一样。

```ts
import { DropdownMenuDivider } from '@astryx-vue/core/DropdownMenu'
```

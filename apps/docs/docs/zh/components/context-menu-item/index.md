---
layout: component-docs
title: 上下文菜单项
outline: false
footer: false
---

<script setup lang="ts">
import { contextMenuItemBasic } from '../../../../components/demos/context-menu-item'
</script>

## 使用方法

复合模式下的菜单行组件。它从 `DropdownMenuItem` 重新导出，方便在 [上下文菜单](/components/context-menu) 的入口里直接找到。

```ts
import { ContextMenuItem } from '@astryx-vue/core/ContextMenu'
```

它是 [上下文菜单](/components/context-menu) 里的一行动作。菜单面板自己用手写的方式拼、也就是用 `content` 插槽而不是 `items` 数组时，就用这一行；两种写法画出来的行一样，样式不会跑偏。

## 示例

常见的用法和不同的状态。

<DemoExample :demo="contextMenuItemBasic" title="基础" description="上下文菜单里的行，有名字也有次要说明。需要自己拼菜单行时用它，样式和其他行保持一致。" locale="zh" />

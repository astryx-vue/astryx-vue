---
layout: component-docs
title: 命令面板列表
outline: false
footer: false
---

<script setup lang="ts">
import { commandPaletteListBasic } from '../../../../components/demos/command-palette-list'
</script>

## 使用方法

装结果的那个可滚动容器。单独用时它就是一个 listbox；放进 `CommandPalette` 里、并且确实有可选结果时，它也会画成 listbox。里面装的是 `CommandPaletteItem` 和 `CommandPaletteGroup`。

```ts
import { CommandPaletteList } from '@astryx-vue/core/CommandPalette'
```

## 示例

常见的用法和不同的状态。

<DemoExample :demo="commandPaletteListBasic" title="行的状态" description="不分组的平铺列表，展示了高亮、选中和禁用三种行状态。想加小标题分组就用 CommandPaletteGroup。" locale="zh" />

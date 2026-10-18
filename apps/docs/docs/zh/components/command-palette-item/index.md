---
layout: component-docs
title: 命令面板项
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { commandPaletteItemBasic } from '../../../../components/demos/command-palette-item'
</script>

## 使用方法

`CommandPaletteItem` 就是结果列表里的一行。它本身不带交互，放进 `CommandPaletteList` 或 `CommandPaletteGroup` 里用。键盘那一套由 `CommandPalette` 统一管；单独用的时候，它只负责你明确传进来的视觉状态和鼠标点击。

```ts
import { CommandPaletteItem } from '@astryx-vue/core/CommandPalette'
```

<ComponentAnatomy />

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 每个 `value` 在同一份结果里保持唯一，这样高亮、active-descendant 和选中才能对上同一行。 |
| <Badge variant="success">推荐</Badge> | 行里只放不带交互的内容，例如图标、说明和快捷键提示。要点就点这一行本身，别在里面再套按钮或链接。 |
| <Badge variant="error">避免</Badge> | 把 `isHighlighted` 当成选中。高亮表示键盘当前停在哪一行，`isSelected` 才表示选中的值。 |

## 示例

常见的用法和不同的状态。

<DemoExample :demo="commandPaletteItemBasic" title="基础" description="CommandPaletteList 里可以点的一行行命令，包含高亮和禁用两种状态。想自己手动拼一个面板、不用搜索源时用它。" locale="zh" />

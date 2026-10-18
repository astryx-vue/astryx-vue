---
layout: component-docs
title: 命令面板空状态
outline: false
footer: false
---

<script setup lang="ts">
import { commandPaletteEmptyBasic } from '../../../../components/demos/command-palette-empty'
</script>

## 使用方法

`CommandPaletteEmpty` 是结果区没东西可显示时的那块占位内容。`CommandPalette` 在「搜不到结果」和「还没开始搜」这两种情况下会自己把它渲染出来，通常不需要手动写。

```ts
import { CommandPaletteEmpty } from '@astryx-vue/core/CommandPalette'
```

## 示例

常见的用法和不同的状态。

<DemoExample :demo="commandPaletteEmptyBasic" title="基础" description="一条结果都没有的面板，用 emptyBootstrapText 换掉了默认文案。想跟用户说明为什么这里是空的、接下来能做什么，就用它。" locale="zh" />

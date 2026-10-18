---
layout: component-docs
title: 命令面板分组
outline: false
footer: false
---

<script setup lang="ts">
import { commandPaletteGroupBasic } from '../../../../components/demos/command-palette-group'
</script>

## 使用方法

在结果里加一行小标题，把命令分成几段。要放在 `CommandPaletteList` 里面用。

```ts
import { CommandPaletteGroup } from '@astryx-vue/core/CommandPalette'
```

## 示例

常见的用法和不同的状态。

<DemoExample :demo="commandPaletteGroupBasic" title="基础" description="用 CommandPaletteGroup 自己拼，把一条条命令按标题分组。想把相关的命令拆成带标题的几段时用它。" locale="zh" />

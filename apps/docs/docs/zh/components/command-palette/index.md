---
layout: component-docs
title: 命令面板
outline: false
footer: false
---

<script setup lang="ts">
import {
  commandPaletteAsync,
  commandPaletteFooter,
  commandPaletteGrouped,
  commandPalettePicker,
  commandPaletteRich,
} from '../../../../components/demos/command-palette'
</script>

## 使用方法

`CommandPalette` 是一个可搜索的命令列表。对话框、搜索框、分组、空状态和键盘移动都由它负责。命令从 `SearchSource` 来：空查询走 `bootstrap`，有输入走 `search`。

`isInline` 把面板画在页面里，而不是模态对话框。正式环境不要开。用快捷键打开是页面自己的事，`useHotkeys` 已经能处理 `mod+k`。

```vue
<script setup lang="ts">
import { createStaticSource, useHotkeys } from '@astryx-vue/core'
import { CommandPalette } from '@astryx-vue/core/CommandPalette'
import { ref } from 'vue'

const isOpen = ref(false)
const source = createStaticSource([
  { id: 'home', label: 'Home' },
  { id: 'settings', label: 'Settings' },
])

function openPalette() {
  isOpen.value = true
}

useHotkeys([{ keys: 'mod+k', onPress: openPalette }])
</script>

<template>
  <CommandPalette
    :is-open="isOpen"
    :search-source="source"
    @open-change="isOpen = $event"
  />
</template>
```

`v-model:value` 把它变成选择器：匹配的行保持选中，选中一行会写入这个 id。`auxiliaryData.group` 按第一次出现的顺序分组。`item` 插槽替换行内文字，`footer` 插槽替换底部提示。

方向键、Home、End、Page Up、Page Down 移动高亮，到头不停。Enter 选中高亮行。Escape 关闭面板，并丢掉还没回来的搜索。高亮在鼠标或键盘移动之前保持为空。

## 示例

<DemoExample
  :demo="commandPaletteAsync"
  description="搜索会稍等一下再按文件名过滤。还没输入时提示输入文件名。"
  locale="zh"
  title="异步搜索"
/>

<DemoExample
  :demo="commandPaletteGrouped"
  description="Home 和 Settings 在 Navigation 下，New File 和 Save 在 Actions 下。"
  locale="zh"
  title="分组"
/>

<DemoExample
  :demo="commandPaletteFooter"
  description="底部提示换成一句说明。"
  locale="zh"
  title="自定义页脚"
/>

<DemoExample
  :demo="commandPalettePicker"
  description="Light、Dark、System。当前主题保留勾选标记。"
  locale="zh"
  title="选择模式"
/>

<DemoExample
  :demo="commandPaletteRich"
  description="行上显示命令；设置了快捷键时，右侧会显示按键。"
  locale="zh"
  title="带附加信息的条目"
/>

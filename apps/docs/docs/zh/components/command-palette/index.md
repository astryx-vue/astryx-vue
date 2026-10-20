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

`CommandPalette`（命令面板）是一个可以通过键盘全局唤起、支持即时搜索的指令弹窗，类似于 VS Code 或 Mac 上的 Spotlight 搜索。它把居中弹窗、输入搜索框、指令分组、键盘上下选行、以及搜不到时的空状态都封装在了一起。只要传入数据源 `SearchSource`，输入框为空时它会展示推荐列表（`bootstrap`），用户打字时则会即时进行关键词搜索（`search`）。

**什么时候用：**
- 需要为高级用户提供全局快捷键（如 `Cmd + K` 或 `Ctrl + K`），让他们能够秒级搜索页面、执行快捷操作或跳转路由时。

**什么时候不要用：**
- 普通表单里的局部下拉选择，请使用 [Selector](/components/selector) 或下拉菜单。
- 站内文章的全文搜索结果页，更适合使用带翻页的专属搜索大页面。

通过快捷键打开面板非常简单，配合 `useHotkeys` 监听快捷键，控制 `isOpen` 开关即可：

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

其他好用的配置包括：

- `v-model:value`：可以把命令面板变成单选选择器，当前选中的项会保留打勾标记。
- 在数据项里配置 `auxiliaryData.group`，组件就会自动将菜单整理成带标题的分类区域。
- 键盘体验非常流畅：按上下方向键、Home、End、Page Up、Page Down 可以在选项间快速移动；按 Enter 键执行当前高亮行；按 Escape 键关闭面板并自动清空尚未返回的异步搜索请求。
- 只有在做组件文档演示或特殊内嵌时才开启 `isInline`（将面板平铺在页面里），正常的实际业务项目中请保持默认的模态弹窗形式。


<ComponentAnatomy />

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

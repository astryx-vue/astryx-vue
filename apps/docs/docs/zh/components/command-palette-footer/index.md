---
layout: component-docs
title: 命令面板页脚
outline: false
footer: false
---

<script setup lang="ts">
import { commandPaletteFooterBasic } from '../../../../components/demos/command-palette-footer'
</script>

## 使用方法

`CommandPalette` 会自己渲染 `CommandPaletteFooter`，平时不用管。只有想换掉默认提示时，才需要往 `footer` 插槽里再放一个 `CommandPaletteFooter`。

```ts
import { CommandPaletteFooter } from '@astryx-vue/core/CommandPalette'
```

<ComponentAnatomy />

## 示例

常见的用法和不同的状态。

<DemoExample :demo="commandPaletteFooterBasic" title="基础" description="什么内容都不放的页脚，显示组件自带的键盘提示。不给 CommandPaletteFooter 传内容，结果列表下面就还是方向键、Enter 和 Esc 那三行提示。" locale="zh" />

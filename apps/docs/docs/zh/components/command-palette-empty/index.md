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

`CommandPaletteEmpty` 是结果区没东西可显示时的那块占位内容。`CommandPalette` 在搜索没有结果、或者没有查询且 `bootstrap()` 什么也没返回时，会自己把它渲染出来，通常不需要手动写。消息里回显的长路径、长网址这类没有空格的长串会折行，不会把居中的那一行撑宽。第一次搜索还在加载时，面板在这里只留一行空白的高度，不显示任何文字。

```ts
import { CommandPaletteEmpty } from '@astryx-vue/core/CommandPalette'
```

## 示例

常见的用法和不同的状态。

<DemoExample :demo="commandPaletteEmptyBasic" title="基础" description="一条结果都没有的面板，用 emptyBootstrapText 换掉了默认文案。想跟用户说明为什么这里是空的、接下来能做什么，就用它。" locale="zh" />

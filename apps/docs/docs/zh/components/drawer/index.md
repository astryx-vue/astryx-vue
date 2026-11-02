---
layout: component-docs
title: 抽屉
outline: false
footer: false
---

<script setup lang="ts">
import { drawerOverview } from '../../../../components/demos/drawer'
</script>

## 使用方法

`Drawer` 是从屏幕一侧滑出的面板，用来放筛选、详情或一小段表单。它和弹窗共用同一套模态机制：打开时锁住页面滚动、把焦点关在面板里、关闭后把焦点还给打开它的元素。

`placement` 决定贴哪一边，默认 `end`（中文界面是右边）。`purpose` 决定怎么关：`info` 允许 Escape 和点遮罩，`form` 只允许 Escape，`required` 两者都不允许。

```vue
<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Drawer, DrawerHeader } from '@astryx-vue/core/Drawer'
import { ref } from 'vue'

const isOpen = ref(false)
</script>

<template>
  <Button @click="isOpen = true">
    打开筛选
  </Button>
  <Drawer v-model:is-open="isOpen" label="筛选">
    <DrawerHeader title="筛选" subtitle="缩小列表范围" @open-change="isOpen = false" />
    <p>分类、价格区间和是否有货放在这里。</p>
  </Drawer>
</template>
```

<drawerOverview />

## 标题行

`DrawerHeader` 提供标题、副标题、行首和行尾插槽。关闭按钮默认在有人监听 `open-change` 时出现；想写死就传 `has-close-button`。

::: tip 什么时候用抽屉，什么时候用弹窗
抽屉适合「页面还在，先看一点细节」；弹窗适合「必须先回答，才能继续」。需要从底部升起、内容很长的，用 `BottomSheet`。
:::

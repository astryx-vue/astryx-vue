---
layout: component-docs
title: 按钮组
outline: false
footer: false
---

<script setup lang="ts">
import { buttonGroupBasic, buttonGroupFloating } from '../../../../components/demos/button-group'
</script>


## 使用方法

`ButtonGroup` 将相关按钮连接成一个组。组内按钮没有间距。分隔线区分相邻按钮：

```vue
<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { ButtonGroup } from '@astryx-vue/core/ButtonGroup'
</script>

<template>
  <ButtonGroup label="编辑操作">
    <Button label="复制" />
    <Button label="剪切" />
    <Button label="粘贴" />
  </ButtonGroup>
</template>
```

## 示例

<DemoExample
  :demo="buttonGroupBasic"
  description="每组放置 2–4 个相关操作。组内按钮使用相同的 variant。"
  locale="zh"
  title="基础按钮组"
/>

<DemoExample
  :demo="buttonGroupFloating"
  description="elevation 控制整个按钮组的阴影。组内按钮不单独显示阴影。"
  locale="zh"
  title="悬浮按钮组"
/>


---
layout: component-docs
title: 按钮组
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { buttonGroupBasic, buttonGroupFloating } from '../../../../components/demos/button-group'
</script>


## 使用方法

`ButtonGroup` 把一组相关的按钮连接成一个整体，适合复制、剪切、粘贴这类作用于同一对象的操作。组内按钮之间没有间距，用分隔线区分相邻按钮：

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




## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 将作用于同一对象的相关操作放入一组，例如针对选中文本的复制、剪切、粘贴，让用户一眼看出这些操作彼此关联。 |
| <Badge variant="success">推荐</Badge> | 组内所有按钮使用相同的变体，它们在视觉上才能连成一体。 |
| <Badge variant="success">推荐</Badge> | 保持按钮组小巧，建议只放 2 到 4 个操作。数量更多时改用 Toolbar 或 DropdownMenu 收纳，避免一排按钮挤占界面。 |

## 示例

<DemoExample
  :demo="buttonGroupBasic"
  description="把 2 到 4 个相关操作放进一组，并让组内按钮使用相同的 variant，视觉上就是一个整体。"
  locale="zh"
  title="基础按钮组"
/>

<DemoExample
  :demo="buttonGroupFloating"
  description="elevation 作用于整个按钮组：阴影由组统一呈现，组内按钮不再单独显示阴影。"
  locale="zh"
  title="悬浮按钮组"
/>


---
layout: component-docs
title: 弹出层
outline: false
footer: false
---

<script setup lang="ts">
import { popoverActions, popoverBasic, popoverForm, popoverPlacements } from '../../../../components/demos/popover'
</script>

## 使用方法

`Popover` 在触发按钮旁边打开一个浮层。浮层可以包含简短的交互内容，例如表单、简短说明或操作列表。触发元素放在默认插槽，浮层内容放在 `content` 插槽。

```vue
<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Popover } from '@astryx-vue/core/Popover'
</script>

<template>
  <Popover label="项目详情">
    <Button label="详情" variant="secondary" />
    <template #content>
      <p>这里放置简短内容。</p>
    </template>
  </Popover>
</template>
```

## 示例

<DemoExample :demo="popoverBasic" title="基本用法" description="点击触发元素打开浮层。按下 Escape、点击浮层外部或点击关闭按钮可以关闭。" locale="zh" />

<DemoExample :demo="popoverPlacements" title="位置" description="placement 设置浮层相对触发元素的方向，alignment 设置沿该方向的对齐方式。空间不足时自动翻转。" locale="zh" />

<DemoExample :demo="popoverForm" title="表单内容" description="对话框类浮层可以包含交互控件。打开时焦点移入浮层，关闭时焦点回到触发元素。" locale="zh" />

<DemoExample :demo="popoverActions" title="操作列表" description="role 为 none 时不添加对话框语义，适用于内容自带角色的菜单类内容。焦点保留在触发元素上。" locale="zh" />

## 无障碍

- 触发元素带有 `aria-haspopup`、`aria-expanded` 与 `aria-controls`。
- `dialog` 类型的浮层带有 `role="dialog"`；设置 `isModal` 时带有 `aria-modal="true"`，并以 `label` 作为无障碍名称。
- 打开时焦点移入第一个可聚焦元素；通过 Escape 或关闭时焦点回到触发元素。
- 设置 `isModal` 后，浮层打开期间 Tab 焦点保持在浮层内。
- 内置关闭按钮在获得焦点前视觉隐藏。

## 布局

浮层通过 JavaScript 定位。页面滚动或窗口尺寸变化时会重新计算位置；所选方向空间不足时翻转到另一侧。

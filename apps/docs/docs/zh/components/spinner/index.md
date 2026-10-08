---
layout: component-docs
title: 旋转器
outline: false
footer: false
---

<script setup lang="ts">
import { spinnerBasic, spinnerLabel, spinnerShades, spinnerSizes } from '../../../../components/demos/spinner'
</script>

## 使用方法

`Spinner` 在耗时未知的过程中显示加载状态，例如获取数据或提交表单。

```vue
<script setup lang="ts">
import { Spinner } from '@astryx-vue/core/Spinner'
</script>

<template>
  <Spinner label="加载数据" />
</template>
```

## 示例

<DemoExample :demo="spinnerBasic" title="基本用法" description="默认旋转器使用强调色，尺寸为 md。" locale="zh" />

<DemoExample :demo="spinnerSizes" title="尺寸" description="可选 sm、md、lg、xl。环的直径分别为 10px、14px、18px、28px。" locale="zh" />

<DemoExample :demo="spinnerShades" title="色调" description="default 和 subtle 适用于浅色背景。onMedia 适用于深色或强调色背景。inherit 继承周围文字颜色。" locale="zh" />

<DemoExample :demo="spinnerLabel" title="文字标签" description="可见标签显示在旋转器下方，并作为屏幕阅读器的名称。" locale="zh" />

## 无障碍

- 根元素带有 `role="status"`。
- 字符串类型的 `label` 通过 `aria-labelledby` 提供无障碍名称。
- 未提供 `label` 时，默认名称为 `Loading`。设置 `aria-label` 可以修改。
- 圆环带有 `aria-hidden`，不包含任何文字。
- 开启减少动态效果时，圆弧放慢为 3 秒一圈。

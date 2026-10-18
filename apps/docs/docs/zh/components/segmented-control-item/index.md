---
layout: component-docs
title: 分段控件项
outline: false
footer: false
---

<script setup lang="ts">
import { segmentedControlItemBasic } from '../../../../components/demos/segmented-control-item'
</script>

## 使用方法

分段控件里的一段，本身是个单选按钮。

```ts
import { SegmentedControlItem } from '@astryx-vue/core/SegmentedControl'
```

它是 [分段控件](/components/segmented-control) 里的一段。这一段只写自己的 `value`，选中的值放在父组件里，所以它自己不存状态，一组里永远有一段是选中的。`label` 是看得见的文字，同时也是无障碍名。想让文字前面有图案，把图标放进 `icon` 插槽；只想留图标，加 `isLabelHidden`。

## 示例

常见的用法和不同的状态。

<DemoExample :demo="segmentedControlItemBasic" title="基础" description="分段控件里只有文字的几段。每段自己写一个值，选中的值和变更处理都放在父控件上。" locale="zh" />

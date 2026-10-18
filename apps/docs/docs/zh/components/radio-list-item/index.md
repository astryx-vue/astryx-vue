---
layout: component-docs
title: 单选列表项
outline: false
footer: false
---

<script setup lang="ts">
import { radioListItemBasic } from '../../../../components/demos/radio-list-item'
</script>

## 使用方法

单选列表里的一行，有名字、说明，还能在末尾再放点东西。

```ts
import { RadioListItem } from '@astryx-vue/core/RadioList'
```

它是 [单选列表](/components/radio-list) 里的一行。这一行只带一个 `value`，选中的值存在父组件里，所以一组里永远只有一行是选中的。点另一行会把上一行取消掉，不是叠加。

## 示例

常见的用法和不同的状态。

<DemoExample :demo="radioListItemBasic" title="基础" description="单选列表里的单选项，每行有名字和说明，选中值由外面一个变量控制。适合配送方式这类多选一的场景。" locale="zh" />

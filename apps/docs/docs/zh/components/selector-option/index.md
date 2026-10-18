---
layout: component-docs
title: 选择器选项
outline: false
footer: false
---

<script setup lang="ts">
import { selectorOptionBasic } from '../../../../components/demos/selector-option'
</script>

## 使用方法

原版里这是给选择器的 `renderOption` 用的一个小部件，用来自己画选项行。

```ts
import type { SelectorOption } from '@astryx-vue/core/Selector'
```

我们这边 `SelectorOption` 是一个类型，不是组件：它就是 [选择器](/components/selector) `options` 数组里每一行长什么样。`label` 是主文字，`description` 是下面那行小字，正好是原版那个小部件画出来的两行。默认的选项行本来就会画这两行，所以写个普通对象就够了。要画别的东西，用 `option` 插槽，它拿到的还是这个对象。

选项也可以只写一个字符串，这时它既是值也是文字。

## 示例

常见的用法和不同的状态。

<DemoExample :demo="selectorOptionBasic" title="基础" description="选项用 SelectorOption 那种写法来渲染，每行主文字下面多一行说明。原版放在 renderOption 里，让自定义选项长得一样。" locale="zh" />

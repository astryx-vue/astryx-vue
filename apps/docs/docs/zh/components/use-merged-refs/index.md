---
layout: component-docs
title: useMergedRefs
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { useMergedRefsAutoGrowTextArea } from '../../../../components/demos/use-merged-refs'
</script>

## 使用方法

把多个对象 ref 和函数 ref 合成一个稳定的函数 ref。组件既要往外转发使用者给的 ref，又要自己挂内部 ref 时用它。如果在 `:ref` 里直接写一个内联函数，每次渲染都会造出新函数，Vue 只能先解绑再重新绑定；这里返回的始终是同一个回调，不会白折腾元素。

```ts
import { useMergedRefs } from '@astryx-vue/core'
```

把返回的函数绑给元素的 `:ref`。数组里每一项都会收到同一个值；`null` 和 `undefined` 直接跳过，所以可选的外部 ref 可以一直留在列表里。元素卸载时 Vue 会传 `null` 进来，每个目标都会被清空。

## 建议

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 一个元素既要收外部传进来的 ref，又要收一个或多个内部 ref 时，用 useMergedRefs。 |
| <Badge variant="success">推荐</Badge> | 在 `setup` 里调用一次，绑它返回的那个函数，这样每次渲染元素拿到的都是同一个回调。 |
| <Badge variant="error">避免</Badge> | 在 `:ref` 里直接写内联箭头函数。那样每次渲染都会换一个新回调，白白多做一轮解绑和绑定。 |

## 示例

常见配置、变体和状态。

<DemoExample
  :demo="useMergedRefsAutoGrowTextArea"
  description="一个自动长高的文本框：既把调用方给的 ref 转发出去，又自己留一份 ref 量 scrollHeight。合并后的 ref 把两份接到同一个 textarea 上：它自己调整高度，外面的按钮也能通过转发的 ref 让它获得焦点。"
  locale="zh"
  title="useMergedRefs — 自动长高的文本框"
/>

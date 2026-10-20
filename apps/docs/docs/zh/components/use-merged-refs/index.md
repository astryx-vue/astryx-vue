---
layout: component-docs
title: useMergedRefs
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
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

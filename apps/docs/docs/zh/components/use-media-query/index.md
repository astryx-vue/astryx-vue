---
layout: component-docs
title: useMediaQuery
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { useMediaQueryAdaptive } from '../../../../components/demos/use-media-query'
</script>

## 使用方法

SSR 安全的媒体查询 hook，订阅 `window.matchMedia` 的变化，返回这条媒体查询当前是否匹配。只要 `matchMedia` 存在，第一次的值在 setup 阶段就读出来了，所以布局判断不用等到挂载；服务端上这个 ref 从 `false` 开始。组件存活期间会跟着变化走，卸载时摘掉监听。

查询字符串是一段普通字符串，每次调用只读一次。要跟着一个会变的查询走，就在那个值所在的地方重新调用一次 hook。

```ts
import { useMediaQuery } from '@astryx-vue/core'
```

## 建议

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 用来做响应式的布局切换：视口宽度、深浅色偏好、动效偏好。 |
| <Badge variant="success">推荐</Badge> | 能用 Astryx 的响应式 token 和组件属性时，优先用它们，别手写断点逻辑。 |
| <Badge variant="error">避免</Badge> | 用在服务端渲染、且首屏必须对得上的内容上；服务端上它永远返回 false。 |

## 示例

<DemoExample
  :demo="useMediaQueryAdaptive"
  description="媒体查询是产品策略，呈现方式仍然是压在它上面的一层确定性覆盖：hook 只回答「是不是触摸取向的那一档」。"
  locale="zh"
  title="useMediaQuery — 自适应呈现"
/>

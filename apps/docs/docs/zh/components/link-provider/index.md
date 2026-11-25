---
layout: component-docs
title: 链接 Provider
outline: false
footer: false
---

<script setup lang="ts">
import { linkProviderOverview } from '../../../../components/demos/link-provider'
</script>

## 使用方法

把应用包一层，让所有 Astryx 组件渲染链接时不再直接用 `<a>`，而是换成框架自己的链接组件，例如 Vue Router 的 `RouterLink`，这样点击走的是前端路由，不会整页刷新。

```ts
import { LinkProvider } from '@astryx-vue/core/LinkProvider'
```

这个组件会同时收到 `href` 和 `to`，路由链接认哪个就用哪个。单个组件自己写的 `as` 优先级更高，仍然会盖掉 provider。自己渲染链接时，可以用 `useLinkComponent()` 读到外层给的那个组件。

### 自己组件里的链接

自己写的组件里要渲染链接时，用 `useLinkComponent()` 读外层 provider，这样它的链接和 Astryx 自己的链接一样走应用的路由。外层没有 provider 时退回 `'a'`，自己写的 `as` 优先。

```vue
<script setup lang="ts">
import { useLinkComponent } from '@astryx-vue/core/LinkProvider'

const props = defineProps<{ href: string, as?: string | object }>()
const linkComponent = useLinkComponent()
</script>

<template>
  <component :is="props.as ?? linkComponent ?? 'a'" :href="href" :to="href">
    <slot />
  </component>
</template>
```

路由处理不了的地址，比如文件下载或应用外的页面，传 `as="a"`。在共用组件里直接引入路由的链接组件会绕开 provider，这个组件就不再跟着它走。

## 示例

常见的用法和不同的状态。

<DemoExample :demo="linkProviderOverview" title="Link Provider — Custom Link Component" description="把所有 Astryx 链接交给一个自定义组件：它拦住点击，交给框架路由惯用的那个位置处理。点一下链接，看到的是自定义处理函数在跑，而不是整页跳转。" locale="zh" />

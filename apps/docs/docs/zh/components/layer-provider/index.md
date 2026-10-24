---
layout: component-docs
title: 浮层 Provider
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { layerProviderOverview } from '../../../../components/demos/layer-provider'
</script>

## 使用方法

浮层这一套东西有一个应用级的 provider。要配 toast 或者整个应用的浮层参数，就在应用最外层放一个 `LayerProvider`；一般的浮层界面直接用 `Popover`、`HoverCard`、`Tooltip` 这些更上层的组件就行。浮层内容渲染出来之后，用的是主题里正文的默认文字样式，也不再继承外面那层 surface/group 的成员关系，所以每个浮层里该有的分组和必需的 provider 都要自己补上。每个贴着触发器定位的浮层，离视口四条边都留着一段空隙：间距第 4 档和设备安全区取较大的那个；它只受视口限制，不会被触发器旁边的空间限制。

如果应用有一条常驻的条子浮在视口某条边上，就在 `LayerProvider` 上用 `inset` 声明一次，写明 `blockStart`、`blockEnd`、`inlineStart`、`inlineEnd`。每条边上的值会加到所有贴边浮层离那条边的空隙上，toast 视口也按同样的量挪进去。不写就是每条边都是 0。这份 inset 属于应用配置，不是主题里的值。

```ts
import { LayerProvider } from '@astryx-vue/core/LayerProvider'
```

`toast` 里有三样：`position` 是 toast 视口贴哪个角，`maxVisible` 是同时最多显示几条，还有一个只对 toast 生效的 `inset`，会逐边盖掉 provider 上的同一条边。

嵌套的 `LayerProvider` 是个例外：它不会再开一套 toast 视口，但如果它自己声明了 `inset`，这份 inset 只收紧它子树里的锚定浮层，toast 视口仍然看最外层。不声明 `inset` 的内层 provider 什么也不做。

## 建议

| Guidance | Practices |
| --- | --- |
| <Badge variant="success">Do</Badge> | 视口边上有常驻条子时，在 `LayerProvider` 的 `inset` 里声明一次，之后所有贴边浮层和 toast 都会绕开它。 |
| <Badge variant="success">Do</Badge> | 需要全局共享 toast 或浮层配置时，在应用根部附近放一个 `LayerProvider`。 |
| <Badge variant="success">Do</Badge> | 常见的浮层场景用更上层的 `Popover`、`HoverCard`、`Tooltip`，不用自己拼。 |
| <Badge variant="error">Don't</Badge> | 不要嵌套 `LayerProvider`：内层不再开 toast 视口，只是白白多一层；确实要给某块子树单独声明常驻条时，才用内层的 `inset`。 |

## 示例

常见的用法和不同的状态。

<DemoExample :demo="layerProviderOverview" title="LayerProvider — Toast Viewport" description="把 toast 视口钉在右上角，最多同时显示两条，并往下挪 8px，给顶部那条常驻栏让位。" locale="zh" />

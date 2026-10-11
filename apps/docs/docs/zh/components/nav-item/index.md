---
layout: component-docs
title: 导航项
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { navItemBasic } from '../../../../components/demos/nav-item'
</script>

## 使用方法

`NavItem` 是侧栏、顶栏和菜单里的一条导航。有 `href` 时渲染成链接，禁用或没有地址时渲染成按钮。图标用 `iconClass` 传入 CSS icon，也可以用 `icon` 插槽。需要圆形强调底时用同目录导出的 `NavIcon`。

链接根默认是 `a`。接入 Vue Router 时把 `RouterLink` 传给 `as`，组件会同时带上 `href` 和 `to`。

```vue
<script setup lang="ts">
import { NavItem } from '@astryx-vue/core/NavItem'
</script>

<template>
  <NavItem href="/home" icon-class="i-carbon-home" is-selected label="首页" />
</template>
```

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 当前页设置 `isSelected`，组件会写上 `aria-current="page"`。 |
| <Badge variant="success">推荐</Badge> | 只显示图标时打开 `isIconOnly`，`label` 仍会成为无障碍名称。 |
| <Badge variant="error">避免</Badge> | 不要把图标做成独立的图标组件再塞进导航。图标走 class 或插槽。 |

## 示例

<DemoExample
  :demo="navItemBasic"
  description="选中、普通、禁用和图标按钮，以及一枚圆形 NavIcon。"
  locale="zh"
  title="状态与图标"
/>

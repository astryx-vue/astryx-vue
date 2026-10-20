---
title: 链接与路由
---

# 链接与路由

在单页应用（SPA）中，页面跳转通常分为两种情况：
1. **外部网站跳转**：由浏览器原生打开一个外部网址，这时使用普通的 HTML `href`。
2. **应用内部导航**：希望走 Vue Router 的路由拦截，实现无刷新的丝滑切换，这时需要把组件底层的渲染根节点替换为 `RouterLink`。

## 使用 `as` 属性无缝配合 Vue Router

astryx-vue 中所有支持导航跳转的组件，都统一提供了一个简洁的 `as` 属性。它既可以接收一个 Vue 组件（例如 `RouterLink`），也可以接收一个 HTML 标签名（例如 `'a'`）：

```vue
<script setup lang="ts">
import { NavItem } from '@astryx-vue/core/NavItem'
import { RouterLink } from 'vue-router'
</script>

<template>
  <NavItem :as="RouterLink" href="/orders" label="订单中心" />
</template>
```

底层逻辑非常贴心：
- 只有当该组件传入了有效的目标地址 `href`、并且当前项**没有被禁用**时，底层的根元素才会真正被替换为 `as` 所指定的组件；
- 如果按钮处于禁用或加载状态，它会自动维持安全的普通 `<button>`，防止意外触发跳转；
- 当把 `as` 指定为自定义组件（如 `RouterLink`）时，组件库会自动把目标地址同时赋给 `href` 和 `to` 属性，因此 `RouterLink` 能完美读取到 `to` 并正常工作。

同样支持 `as` 属性的组件包括：`SideNavItem`、`TopNavItem`、`TopNavHeading`、`NavMenuItem` 和 `SideNavHeading` 等。顶部导航的巨型下拉菜单项以及推荐卡片也同样支持。对于溢出折叠列表 `OverflowList`，直接把 `as` 配置在列表顶层，就能自动作用于内部那些带 `href` 且可点击的可见项。

## 按钮当作路由链接使用

常规的 `Button` 同样支持通过 `as` 化身为路由链接。如果按钮此时处于加载中（loading）或被禁用（disabled），它会自动回退为标准的 `<button>`，阻止跳转行为：

```vue
<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { RouterLink } from 'vue-router'
</script>

<template>
  <Button :as="RouterLink" href="/orders" label="前往订单" />
</template>
```

## 注意事项：普通超链接组件

`Link`、`Avatar` 和 `BreadcrumbItem` 组件在传入地址时，底层会直接渲染为原生 `<a>` 标签，它们没有提供 `as` 属性。如果在这些组件的 `href` 上填写站内路径，会触发浏览器的完整整页刷新。如果你希望内部跳转不刷新页面，推荐使用上面支持 `as` 的导航组件，或者配合按钮来实现。

另外，`Link` 组件提供了 `isExternalLink` 属性。设置为 `true` 时，它会自动在浏览器新标签页中打开，并自动附带 `rel="noopener noreferrer"` 安全属性，专用于外链跳转。

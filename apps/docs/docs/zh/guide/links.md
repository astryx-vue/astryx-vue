---
title: 链接与路由
---

# 链接与路由

在单页应用（SPA）中，页面跳转通常分为两类场景：
1. **外部链接跳转**：由浏览器直接打开外部地址，使用原生 HTML `href`。
2. **应用内部导航**：由 Vue Router 拦截处理，实现无刷新客户端路由切换，需将组件底层根节点替换为 `RouterLink`。

## 使用 `as` 属性配合 Vue Router

astryx-vue 中所有支持导航行为的组件，均提供统一的 `as` 属性。该属性支持传入 Vue 组件（如 `RouterLink`）或原生 HTML 标签名（如 `'a'`）：

```vue
<script setup lang="ts">
import { NavItem } from '@astryx-vue/core/NavItem'
import { RouterLink } from 'vue-router'
</script>

<template>
  <NavItem :as="RouterLink" href="/orders" label="订单中心" />
</template>
```

底层处理机制：
- 仅当组件传入有效的目标地址 `href` 且当前项**未被禁用**时，底层根元素才会替换为 `as` 指定的目标组件；
- 若按钮处于禁用或加载状态，底层保持渲染为安全的普通 `<button>` 元素，阻止跳转触发；
- 当 `as` 指定为自定义组件（如 `RouterLink`）时，组件库会将目标地址同步传递给 `href` 与 `to` 属性，因此 `RouterLink` 能完美读取到 `to` 并正常工作。

支持 `as` 属性的组件包括：`SideNavItem`、`TopNavItem`、`TopNavHeading`、`NavMenuItem` 和 `SideNavHeading` 等。顶部导航的巨型下拉菜单项以及推荐卡片同样支持该属性。对于溢出折叠列表 `OverflowList`，在列表顶层声明 `as` 即可自动作用于内部所有带 `href` 且可点击的可见项。

## 按钮作为路由链接使用

基础 `Button` 组件同样支持通过 `as` 渲染为路由链接。若按钮处于加载状态（loading）或禁用状态（disabled），会自动回退为标准 `<button>` 元素并阻止跳转：

```vue
<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { RouterLink } from 'vue-router'
</script>

<template>
  <Button :as="RouterLink" href="/orders" label="前往订单" />
</template>
```

## 原生超链接组件使用注意

`Link`、`Avatar` 和 `BreadcrumbItem` 组件在接收地址时，底层直接渲染为原生 `<a>` 标签，未提供 `as` 多态属性。若在上述组件的 `href` 中传入站内路径，会触发浏览器整页重新加载。如需在这些场景保持 SPA 无刷新跳转，建议优先使用支持 `as` 的导航组件或按钮组件。

此外，`Link` 组件提供 `isExternalLink` 属性。配置为 `true` 时，会在新标签页中打开并自动追加 `rel="noopener noreferrer"` 安全属性。

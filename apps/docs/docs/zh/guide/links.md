---
title: 链接与路由
---

# 链接与路由

应用里的跳转有两种。一种是浏览器自己打开的地址，用普通的 `href`。一种要留在 Vue Router 里，不整页刷新，这时把根换成 `RouterLink`。

会换根的组件都用同一个 `as`。它接受组件，也接受标签名。有 `href`、并且这一项没有禁用时，根才换成 `as`；否则还是按钮，`as` 不生效。换成自定义组件时，同一段地址会同时写到 `href` 和 `to`，`RouterLink` 读的是 `to`。

```vue
<script setup lang="ts">
import { NavItem } from '@astryx-vue/core/NavItem'
import { RouterLink } from 'vue-router'
</script>

<template>
  <NavItem :as="RouterLink" href="/orders" label="订单" />
</template>
```

`SideNavItem`、`TopNavItem`、`TopNavHeading`、`NavMenuItem` 和 `SideNavHeading` 都是这样。顶栏的大型菜单项和推荐卡片也接受 `as`。`OverflowList` 的 `as` 写在列表上，用在那些带了 `href`、而且没有禁用的可见项上。

按钮在带了 `href` 且没有禁用时同样可以换根。加载中或禁用时它回到 `<button>`。

```vue
<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { RouterLink } from 'vue-router'
</script>

<template>
  <Button :as="RouterLink" href="/orders" label="去订单" />
</template>
```

`Link`、`Avatar` 和 `BreadcrumbItem` 有地址时就是 `<a>`。它们没有 `as`。站内路径写在 `href` 上会整页打开。这条跳转必须留在路由里时，改用上面那些带 `as` 的组件，或者让按钮来做。

`Link` 的 `isExternalLink` 会打开新标签，并补上 `noopener noreferrer`。那是站外地址，不是路由。

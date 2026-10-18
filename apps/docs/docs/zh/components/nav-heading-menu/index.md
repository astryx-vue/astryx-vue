---
layout: component-docs
title: 导航标题菜单
outline: false
footer: false
---

## 使用方法

导航标题旁边那个弹出菜单的容器和条目。`NavHeadingMenu` 提供 `role="menu"` 和键盘导航，`NavHeadingMenuItem` 画里面的每一个可选条目。把它放进 `SideNavHeading` 或 `TopNavHeading` 的 `menu` 插槽即可。

```ts
import { NavHeadingMenu } from '@astryx-vue/core/NavMenu'
```

```vue
<script setup lang="ts">
import { NavHeadingMenu, NavHeadingMenuItem } from '@astryx-vue/core/NavMenu'
import { SideNav, SideNavHeading } from '@astryx-vue/core/SideNav'
</script>

<template>
  <SideNav>
    <template #header>
      <SideNavHeading heading="Acme Platform">
        <template #menu>
          <NavHeadingMenu label="Acme Platform" size="lg">
            <NavHeadingMenuItem href="/dashboard" label="控制台" />
            <NavHeadingMenuItem href="/analytics" label="数据分析" />
          </NavHeadingMenu>
        </template>
      </SideNavHeading>
    </template>
  </SideNav>
</template>
```


<ComponentAnatomy />

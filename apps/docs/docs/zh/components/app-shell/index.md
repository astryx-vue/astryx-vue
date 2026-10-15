---
layout: component-docs
title: 应用外壳
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { appShellBanner, appShellContentOnly, appShellSideNav, appShellTopAndSide, appShellTopNav } from '../../../../components/demos/app-shell'
</script>

## 使用方法

`AppShell` 是页面外框。默认插槽是页面正文。`topNav`、`sideNav`、`banner`、`mobileNav` 是具名插槽。

```vue
<script setup lang="ts">
import { AppShell } from '@astryx-vue/core/AppShell'
import { SideNav, SideNavItem } from '@astryx-vue/core/SideNav'
</script>

<template>
  <AppShell :content-padding="6">
    <template #sideNav>
      <SideNav>
        <SideNavItem href="#orders" is-selected label="订单" />
      </SideNav>
    </template>
    <p>订单</p>
  </AppShell>
</template>
```

`variant` 取 `wash`、`surface`、`section` 或 `elevated`（默认）。`contentPadding` 是正文区域的间距刻度。`height` 取 `fill` 或 `auto`。`fill` 使用 `100dvh`；外壳放在已经有高度的预览里时，行内 `height: 100%` 可以盖过它。

`mobileNav` 可以是 `false`，或 `{ breakpoint, isOpen, hasToggle }`。默认断点是 `md`（768px）。窄于断点时侧栏收进抽屉。外壳里的顶栏使用这只抽屉，不再自己打开另一只。`v-model:mobile-nav-open` 控制抽屉，组件同时发出 `mobileNavOpenChange`。

跳过链接指向 `#astryx-app-shell-main`。主区域是带 `role="main"` 和 `tabindex="-1"` 的 `div`。`variant` 为 `elevated`、同时有顶栏和侧栏、而且视口够宽时，正文坐在圆角背板上。

`useAppShellMobile` 读取最近的外壳。在外壳外面，或关掉了移动导航时，`isMobile` 和 `isMobileNavEnabled` 都是 false，打开和关闭方法不做任何事。


<ComponentAnatomy />

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 应用导航放在 topNav 和 sideNav。页面内部的区域用 Layout。 |
| <Badge variant="success">推荐</Badge> | 给侧栏一个标题，移动抽屉才有名字。 |
| <Badge variant="error">避免</Badge> | 顶栏已经在 AppShell 里时，再让 TopNav 自己开一只抽屉。抽屉归外壳管。 |
| <Badge variant="error">避免</Badge> | 调用 useAppShellMobile 时假定外壳一定存在。先看 isMobileNavEnabled。 |

## 示例

<DemoExample :demo="appShellContentOnly" description="没有导航的外壳，适合通栏页面、登录页或嵌入视图。" locale="zh" title="仅正文" />

<DemoExample :demo="appShellSideNav" description="侧栏标题承担应用身份，不再需要顶栏。" locale="zh" title="仅侧栏" />

<DemoExample :demo="appShellTopNav" description="只有顶栏、没有侧栏，适合落地页。" locale="zh" title="仅顶栏" />

<DemoExample :demo="appShellTopAndSide" description="最常见的框架：顶栏表示应用，侧栏表示页面。" locale="zh" title="顶栏与侧栏" />

<DemoExample :demo="appShellBanner" description="顶栏、侧栏，以及夹在导航和正文之间、可以关闭的信息横幅。" locale="zh" title="带横幅" />

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

`AppShell`（应用外壳）是承载整个网站或管理后台的大骨架，用来规整地安排顶部导航、侧边菜单、重要横幅以及中间的主内容区。默认插槽放页面的正文，其余重要区域通过具名插槽放入：`topNav`（顶栏）、`sideNav`（侧栏）、`banner`（通知横幅）和 `mobileNav`（移动端导航）。

**什么时候用：**
- 构建后台管理系统、多页面 SaaS 应用或需要统一导航布局的完整平台时。

**什么时候不要用：**
- 如果只是页面内部的一小块局部排版（例如卡片内的两栏布局），请使用专门的 [Layout](/components/layout) 或弹性盒/网格，不要滥用 AppShell。
- 独立的单页落地页、注册登录页或全屏沉浸式预览，通常不需要复杂的外壳，使用纯正文模式或直接排版即可。

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

外壳的常用配置项如下：

- `variant` 可以调整底色风格：包含纯净底色 `wash`、面板底色 `surface`、区块底色 `section`，或者默认的浮起卡片质感 `elevated`。
- `contentPadding` 控制正文区域四周的留白间距等级。
- `height` 设置外壳的高度模式，可以填满全屏（`fill`，使用现代的 `100dvh`），也可以随内容自适应撑开（`auto`）。
- `mobileNav` 用来控制手机端的抽屉导航。默认在宽度低于 768px（`md` 断点）时，原本在左侧的侧边菜单会自动收拢进一个侧滑抽屉里。顶栏里的汉堡按钮会自动连接并控制这只抽屉，无需自己重复写逻辑。可以通过 `v-model:mobile-nav-open` 双向绑定抽屉的打开状态。
- 组件内置了专门为键盘操作和读屏用户准备的「跳转到主内容」快捷链接，回车即可将光标焦点直接定位到带有 `role="main"` 的正文容器上。
- `useAppShellMobile` 组合式函数可以在任何子组件里读取当前外壳的移动端适配状态（如抽屉是否开启、是否处于手机屏幕断点下）。


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

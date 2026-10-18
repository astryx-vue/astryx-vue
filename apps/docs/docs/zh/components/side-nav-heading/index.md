---
layout: component-docs
title: 侧边导航标题
outline: false
footer: false
---

<script setup lang="ts">
import { sideNavHeadingBasic } from '../../../../components/demos/side-nav-heading'
</script>

## 使用方法

产品名、套件名或账户名，放在 `SideNav` 的 `header` 插槽里。它按「哪里能点」自动分工：标志、标题、上下两行小字可以各自成链接，再加一个菜单时标题旁边会长出箭头。

`icon` 放在文字前面。`superheading` 是标题上面那行小字，`subheading` 是下面那行，两行都能单独带链接。给了 `menu` 插槽，标题就变成弹出菜单的开关并出现箭头；只给 `headingHref` 没有菜单时，整段标题是一个大链接。`end` 靠在这一行的末尾。

```ts
import { SideNavHeading } from '@astryx-vue/core/SideNav'
```

## 示例

常见的用法和不同的状态。

<DemoExample :demo="sideNavHeadingBasic" title="基础" description="侧边导航的标题：一个应用图标加一个带链接的名字。传进 SideNav 的 header 插槽，用来标明这个导航属于哪个产品或工作区。" locale="zh" />

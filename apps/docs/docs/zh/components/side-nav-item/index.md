---
layout: component-docs
title: 侧边导航项
outline: false
footer: false
---

<script setup lang="ts">
import { sideNavItemBasic } from '../../../../components/demos/side-nav-item'
</script>

## 使用方法

侧栏里的一条导航：可以有图标、选中状态、末尾内容，也能带下级。

`SideNavItem` 放在 `SideNav` 或 `SideNavSection` 的默认插槽里。带下级时这一项变成一个分组，箭头负责展开和收起；如果它同时有 `href`，点文字是跳转，点箭头才展开分组。侧栏收成窄栏后，带下级的项会在侧面的弹层里列出下级。`end` 在这一行的末尾。

```ts
import { SideNavItem } from '@astryx-vue/core/SideNav'
```

## 示例

常见的用法和不同的状态。

<DemoExample :demo="sideNavItemBasic" title="基础" description="侧边导航里的几条链接，每条有名字、图标和地址。当前页面这一项用 isSelected 标出来。" locale="zh" />

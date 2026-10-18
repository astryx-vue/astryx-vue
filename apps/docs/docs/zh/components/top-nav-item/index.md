---
layout: component-docs
title: 顶部导航项
outline: false
footer: false
---

<script setup lang="ts">
import { topNavItemBasic } from '../../../../components/demos/top-nav-item'
</script>

## 使用方法

`TopNavItem` 是顶部导航里的一条链接，放在 `TopNav` 的 `start` 插槽或默认插槽里。它渲染成一个链接，带悬停和选中两种样式。

写了 `href` 就是链接。没有地址，或者设置了 `isDisabled`，它就渲染成按钮，点不动也跳不走。

```ts
import { TopNavItem } from '@astryx-vue/core/TopNav'
```

## 示例

常见的用法和不同的状态。

<DemoExample :demo="topNavItemBasic" title="基础" description="顶部导航里的几条链接，其中一条标记为选中。当作应用的一级页面入口。" locale="zh" />

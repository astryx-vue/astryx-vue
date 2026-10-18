---
layout: component-docs
title: 顶部导航大菜单项
outline: false
footer: false
---

<script setup lang="ts">
import { topNavMegaMenuItemBasic } from '../../../../components/demos/top-nav-mega-menu-item'
</script>

## 使用方法

`TopNavMegaMenuItem` 是大菜单（`TopNavMegaMenu`）里的一项，一项就是一个去处。桌面端它排在弹出面板的网格里，手机端排在抽屉的列表里，用哪种形态跟着所在菜单走，你不用自己切换。

```ts
import { TopNavMegaMenuItem } from '@astryx-vue/core/TopNav'
```

传了 `href` 这一项就是链接，不传就是一个 `<button type="button">` 按钮，两种样子一样。左边的图标用 `iconClass` 给一个 CSS 图标类名，或者用 `icon` 插槽放自己的图标，两个都给时插槽优先。`description` 可以不传，传了就显示在标题下面一行小字。

点一下会关掉它所在的大菜单。单独拿出来用也能正常显示标题、描述和图标，只是身边没有菜单可关。

## 示例

<DemoExample
  :demo="topNavMegaMenuItemBasic"
  description="带图标、标题和描述的链接项。放进 TopNavMegaMenu 的默认插槽里，用来介绍每个去处。"
  locale="zh"
  title="基础"
/>

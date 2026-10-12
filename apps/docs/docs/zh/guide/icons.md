---
title: 图标
---

# 图标

astryx-vue 不发布图标组件，也没有图标子路径。图标由调用方用 CSS 画出来，再把 class 交给组件。这是 Anthony Fu 的 CSS icon 方案：一个 class 负责图形，组件只负责槽位、尺寸和可访问名称。

文档站用 UnoCSS 的 `presetIcons`，集合是 Carbon 和 Heroicons。示例里的 `i-carbon-home` 因此能显示。应用可以换任何能画出图形的 class，只要这个 class 在你的构建里存在。组件不解析图标名。

接收 `iconClass` 的组件包括 `NavItem`、`NavIcon`、`SideNavItem`、`TopNav` 的项，以及菜单项。选中态可以用 `selectedIconClass` 换一张图。也可以不用 class，改用 `icon` 插槽。

`IconButton` 没有 `iconClass`。图形放进默认插槽，`label` 是可访问名称。只有图标、没有可见文字时，一定要传 `label`。

```vue
<script setup lang="ts">
import { IconButton } from '@astryx-vue/core/IconButton'
import { NavItem } from '@astryx-vue/core/NavItem'
</script>

<template>
  <NavItem href="/home" icon-class="i-carbon-home" label="首页" />
  <IconButton label="搜索">
    <span class="i-carbon-search" />
  </IconButton>
</template>
```

组件内部有一个未导出的 `Icon`，只给库自己的装饰用。公开的内置字形只有 `chevronDown`、`chevronLeft`、`chevronRight`、`check`、`moreHorizontal` 和 `copy`。这些图形跟着组件走，例如菜单的箭头和复制按钮，不能当成通用图标库来调用。

---
layout: component-docs
title: 导航菜单
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { navMenuBasic, navMenuDescriptions, navMenuDisabled, navMenuIcons, navMenuSizes } from '../../../../components/demos/nav-menu'
</script>

## 使用方法

`NavMenu` 是 `role="menu"` 的菜单。`NavMenuItem` 是其中一项，有 `href` 时是链接。`NavDisclosure` 负责触发按钮、定位和关闭：点击、悬停、点击外部和 Escape 都会关掉。ArrowDown 打开并聚焦第一项，ArrowUp 聚焦最后一项。菜单内部方向键移动，单字符会按前缀匹配。

这组零件是 Vue 版自己的，上游 `@astryxdesign/core` 没有同名组件。顶栏菜单、溢出列表和侧栏条目的弹出层都是用它们搭的；需要自己做账号菜单这类导航弹出菜单时，也可以直接用。

挂在侧栏或顶栏标题上的切换菜单不用这组零件，改用[导航标题菜单](/components/nav-heading-menu)。

```vue
<script setup lang="ts">
import { NavDisclosure, NavMenu, NavMenuItem } from '@astryx-vue/core/NavMenu'
</script>

<template>
  <NavDisclosure label="账号">
    <template #trigger="{ isOpen, panelId }">
      <button type="button" :aria-controls="panelId" :aria-expanded="isOpen">
        账号
      </button>
    </template>
    <template #default="{ close, focusRequest }">
      <NavMenu label="账号" :focus-request="focusRequest" @close="close">
        <NavMenuItem href="/profile" label="个人资料" />
      </NavMenu>
    </template>
  </NavDisclosure>
</template>
```

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 触发按钮写上 <code>aria-expanded</code> 和 <code>aria-controls</code>，插槽已经把状态传出来了。 |
| <Badge variant="success">推荐</Badge> | 选中一项后默认关闭。需要留下菜单时给项设置 <code>keepOpen</code>。 |
| <Badge variant="error">避免</Badge> | 不要把菜单项单独放进抽屉。抽屉里把 <code>isMenuItem</code> 设成 false，避免菜单项脱离菜单。 |

## 示例

<DemoExample :demo="navMenuBasic" description="点按钮打开账号菜单，每一项都是链接。" locale="zh" title="基础" />

<DemoExample :demo="navMenuIcons" description="用 iconClass 在文字前面放图标。" locale="zh" title="图标" />

<DemoExample :demo="navMenuDescriptions" description="用 description 在文字下面加一行说明。" locale="zh" title="说明文字" />

<DemoExample :demo="navMenuSizes" description="size 决定菜单的最小宽度和每一项的内边距。" locale="zh" title="尺寸" />

<DemoExample :demo="navMenuDisabled" description="禁用的项点了没反应，方向键也会跳过它。" locale="zh" title="禁用项" />

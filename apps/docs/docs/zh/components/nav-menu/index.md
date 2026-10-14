---
layout: component-docs
title: 导航菜单
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { navMenuHeading } from '../../../../components/demos/nav-menu'
</script>

## 使用方法

`NavMenu` 是 `role="menu"` 的菜单。`NavMenuItem` 是其中一项，有 `href` 时是链接。`NavDisclosure` 负责触发按钮、定位和关闭：点击、悬停、点击外部和 Escape 都会关掉。ArrowDown 打开并聚焦第一项，ArrowUp 聚焦最后一项。菜单内部方向键移动，单字符会按前缀匹配。

顶栏和溢出列表已经包好了这组零件。需要自己做账号菜单时直接用它们。

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

<DemoExample :demo="navMenuHeading" description="侧栏标题打开产品切换菜单，里面是 Dashboard、Analytics 和 Settings。" locale="zh" title="产品切换" />

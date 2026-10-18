---
layout: component-docs
title: 顶部导航菜单
outline: false
footer: false
---

<script setup lang="ts">
import { topNavMenuBasic } from '../../../../components/demos/top-nav-menu'
</script>

## 使用方法

`TopNavMenu` 是顶栏里的一个导航项。鼠标移上去会弹出一个菜单，菜单里的每一项都比较丰盛：一个图标、一行标题，还可以带一行说明。

每一项的标题写在 `label` 里，说明写在 `description` 里，图标 class 写在 `iconClass` 里。

```ts
import { TopNavMenu } from '@astryx-vue/core/TopNav'
```

## 示例

<DemoExample :demo="topNavMenuBasic" description="顶栏里的下拉菜单，菜单由 items 数组生成，每一项都有图标和说明。相关去向可以收在同一个触发器下面。" locale="zh" title="基础" />

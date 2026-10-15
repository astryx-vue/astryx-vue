---
layout: component-docs
title: 侧边导航
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { sideNavEnd, sideNavHeaderMenu, sideNavNested } from '../../../../components/demos/side-nav'
import SideNavCollapseFigure from '../../../../components/demos/side-nav/collapse.vue'
</script>

## 使用方法

`SideNav` 是页面一侧的导航地标。里面按 `SideNavSection`、`SideNavHeading`、`SideNavItem` 组织。`collapsible` 打开后，栏可以收成只剩图标的窄条，`SideNavCollapseButton` 在侧栏顶部靠右。收起后，没有图标的项不会渲染；有下级的项改成从侧面弹出的菜单。

用 `v-model:is-collapsed` 受控。`collapsible` 也可以传对象，关掉内置按钮，或给一个快捷键，例如 `mod+\\`。

```vue
<script setup lang="ts">
import { SideNav, SideNavItem, SideNavSection } from '@astryx-vue/core/SideNav'
import { ref } from 'vue'

const collapsed = ref(false)
</script>

<template>
  <SideNav v-model:is-collapsed="collapsed" collapsible>
    <SideNavSection title="工作区">
      <SideNavItem href="/home" icon-class="i-carbon-home" label="首页" />
    </SideNavSection>
  </SideNav>
</template>
```

<SideNavCollapseFigure class="nav-collapse-figure" />


<ComponentAnatomy />

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 会收起的项都带图标，否则收起后这一项会消失。 |
| <Badge variant="success">推荐</Badge> | 一项既要跳转又有下级时写上 `href`。点文字跳转，点箭头才收起。 |
| <Badge variant="error">避免</Badge> | 不要在这里做可拖拽改宽度。宽度只有展开和收起两档。 |

## 示例

<DemoExample :demo="sideNavEnd" description="每一行末尾可以是菜单、数量、徽章或辅助文字。" locale="zh" title="尾部内容" />

<DemoExample :demo="sideNavNested" description="设置项展开后是一组可以折叠的子项。" locale="zh" title="嵌套项" />

<DemoExample :demo="sideNavHeaderMenu" description="标题是账户切换器，显示产品名和当前账户。" locale="zh" title="带菜单的标题" />

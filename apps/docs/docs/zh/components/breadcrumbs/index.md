---
layout: component-docs
title: 面包屑
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { breadcrumbsDeep, breadcrumbsIcons, breadcrumbsMenu, breadcrumbsMenuSelection, breadcrumbsSeparators, breadcrumbsVariants } from '../../../../components/demos/breadcrumbs'
</script>

## 使用方法

从独立入口导入 `Breadcrumbs` 与 `BreadcrumbItem`。

```vue
<script setup lang="ts">
import { BreadcrumbItem, Breadcrumbs } from '@astryx-vue/core/Breadcrumbs'
</script>

<template>
  <Breadcrumbs>
    <BreadcrumbItem href="/">
      首页
    </BreadcrumbItem>
    <BreadcrumbItem href="/components">
      组件
    </BreadcrumbItem>
    <BreadcrumbItem is-current>
      面包屑
    </BreadcrumbItem>
  </Breadcrumbs>
</template>
```

路径中间的一项可以打开菜单，用来在同级目的地之间切换。简单列表直接传一个菜单数组。需要勾选或单选时，改用菜单插槽把行写在这一项里面；写了插槽就不再使用数组。这些行从面包屑入口导出，和菜单里的勾选行、单选组是同一批组件，选中一项后的开关行为也相同。


<ComponentAnatomy />

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 使用语义化 `<nav>` 与 `<ol>` 结构，便于屏幕阅读器识别路径。 |
| <Badge variant="success">推荐</Badge> | 对当前页使用 `is-current` 并渲染为 `<span>`，自动添加 `aria-current="page"`。 |
| <Badge variant="success">推荐</Badge> | 为分隔符设置 `aria-hidden="true"`，避免辅助技术重复朗读。 |
| <Badge variant="error">避免</Badge> | 在面包屑中使用过长的标签，导致小屏换行后难以阅读。 |
| <Badge variant="error">避免</Badge> | 把当前页做成可点击链接，这会使用户迷失在循环导航中。 |

## 示例

<DemoExample :demo="breadcrumbsSeparators" description="把默认的斜杠换成尖角、箭头或圆点，用来配合页面的分隔样式。" locale="zh" title="分隔符" />

<DemoExample :demo="breadcrumbsDeep" description="五级路径，适合嵌套很深的页面。根项前面放一个首页图标。" locale="zh" title="深层路径" />

<DemoExample :demo="breadcrumbsMenu" description="路径中间的一项可以打开菜单，用来在同级目的地之间切换。" locale="zh" title="菜单项" />

<DemoExample :demo="breadcrumbsMenuSelection" description="这一项用菜单插槽放一组单选。选中一个团队后，面包屑上的名字跟着换成对应团队。" locale="zh" title="选择团队" />

<DemoExample :demo="breadcrumbsVariants" description="默认样式和 supporting 变体放在一起。supporting 更轻，适合紧凑的管理界面。" locale="zh" title="变体" />

<DemoExample :demo="breadcrumbsIcons" description="标签前面加图标，根项和设置分区扫一眼就能认出来。" locale="zh" title="图标" />

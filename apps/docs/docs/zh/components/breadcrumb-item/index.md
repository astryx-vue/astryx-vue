---
layout: component-docs
title: 面包屑项
outline: false
footer: false
---

<script setup lang="ts">
import { breadcrumbItemBasic } from '../../../../components/demos/breadcrumb-item'
</script>

## 使用方法

面包屑里的一格。它可以是一个去处、一个动作、当前位置，也可以是一个同级菜单的开关。

第一格之后的分隔符由整条面包屑决定。写了 `href` 就是链接；没写地址就渲染成按钮；`isCurrent` 让它变成纯文本，并标上 `aria-current="page"`。`menu` 把这一格变成同级去处的菜单开关，所以它和 `href` 只能二选一，同时写时用菜单。

```vue
<script setup lang="ts">
import { BreadcrumbItem, Breadcrumbs } from '@astryx-vue/core/Breadcrumbs'
</script>

<template>
  <Breadcrumbs>
    <BreadcrumbItem href="#home">
      首页
    </BreadcrumbItem>
    <BreadcrumbItem href="#settings">
      设置
    </BreadcrumbItem>
    <BreadcrumbItem is-current>
      个人资料
    </BreadcrumbItem>
  </Breadcrumbs>
</template>
```

## 示例

常见的用法和不同的状态。

<DemoExample :demo="breadcrumbItemBasic" title="基础" description="面包屑里的几格链接。上级页面写 href；最后一格用 isCurrent 标成当前页面，渲染成纯文本。" locale="zh" />

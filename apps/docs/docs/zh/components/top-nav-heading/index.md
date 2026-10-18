---
layout: component-docs
title: 顶部导航标题
outline: false
footer: false
---

<script setup lang="ts">
import { topNavHeadingBasic } from '../../../../components/demos/top-nav-heading'
</script>

## 使用方法

`TopNavHeading` 是顶部导航里的那块名字，写产品名、套件名或账户名。它按「有没有链接」自动决定点哪里起作用：左边可以放标志，中间是标题，标题上面和下边还能各放一行小字，这两行小字可以单独成链接；再给一个菜单，标题旁边就会自己长出箭头。

```ts
import { TopNavHeading } from '@astryx-vue/core/TopNav'
```

## 示例

常见的用法和不同的状态。

<DemoExample :demo="topNavHeadingBasic" title="基础" description="顶部导航里带标志的产品名，链接到首页。放在顶栏最前面当品牌用。" locale="zh" />

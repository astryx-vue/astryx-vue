---
layout: component-docs
title: 侧边导航收起按钮
outline: false
footer: false
---

<script setup lang="ts">
import { sideNavCollapseButtonBasic } from '../../../../components/demos/side-nav-collapse-button'
</script>

## 使用方法

侧边导航的收起开关。放在 `SideNav` 里面时，它自己就能找到收起状态；放在外面时，要用 `v-model:is-collapsed` 和侧栏绑同一个值，两边才一致。默认是一个只有图标的幽灵按钮。

`label` 一传，方形的图标按钮就变成带文字的按钮。不传时，文字跟着状态在「展开侧栏」和「收起侧栏」之间切换，读屏读到的就是这句话。

```ts
import { SideNavCollapseButton } from '@astryx-vue/core/SideNav'
```

## 示例

常见的用法和不同的状态。

<DemoExample :demo="sideNavCollapseButtonBasic" title="基础" description="把收起按钮放进侧边导航的页脚，用户就能在展开和收起之间切换。自己安排按钮位置时，用 collapsible={{hasButton: false}} 关掉内置的那个。" locale="zh" />

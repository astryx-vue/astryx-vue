---
layout: component-docs
title: useAppShellMobile
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { useAppShellMobileCustomTrigger } from '../../../../components/demos/use-app-shell-mobile'
</script>

## 使用方法

用在 AppShell 里面，读和控制 AppShell 的移动端导航状态。想做自己的移动端导航按钮、路由变化后关掉抽屉，或者让挨着 AppShell 的移动端界面跟导航用同一个断点，都用它。

```ts
import { useAppShellMobile } from '@astryx-vue/core'
```

```vue
<script setup lang="ts">
import { useAppShellMobile } from '@astryx-vue/core'

const { isMobile, isMobileNavEnabled, mobileNavId, openMobileNav } = useAppShellMobile()
</script>

<template>
  <button
    v-if="isMobile && isMobileNavEnabled"
    type="button"
    :aria-controls="mobileNavId"
    @click="openMobileNav"
  >
    打开导航
  </button>
</template>
```

## 建议

| 指引 | 做法 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 在 AppShell 子树里做自定义移动端导航控件、跟着路由走的导航项，或者需要跟移动端导航同步断点的界面时用它。 |
| <Badge variant="success">推荐</Badge> | 标准汉堡按钮直接用 `MobileNavToggle`；只有要换位置、改样式或者加行为时才用这个 hook。 |
| <Badge variant="success">推荐</Badge> | 自定义的移动端导航项跳完路由后调 `closeMobileNav`，抽屉才能干净地收起来。 |
| <Badge variant="error">避免</Badge> | 界面不在 AppShell 里、也不需要跟 AppShell 移动端导航对齐时，别拿它当通用的响应式工具；改用 `useMediaQuery`。 |
| <Badge variant="error">避免</Badge> | 以为在 AppShell 外面会报错。没有提供者时它返回一组安全的默认值和不做事的空函数。 |

## 示例

常见配置、变体和状态。

<DemoExample
  :demo="useAppShellMobileCustomTrigger"
  description="用 useAppShellMobile 做的自定义移动端导航按钮。它读的是外面那层 AppShell 的上下文，不自己套一层外壳。"
  locale="zh"
  title="useAppShellMobile — 自定义移动端触发按钮"
/>

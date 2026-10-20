---
layout: component-docs
title: 移动端导航开关
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { mobileNavToggleBasic } from '../../../../components/demos/mobile-nav-toggle'
</script>

## 使用方法

窄屏上打开 [移动端导航](/components/mobile-nav) 抽屉的那个按钮。它画的是两道杠的菜单图标，抽屉打开时变成关闭的样子，`aria-expanded` 也跟着改。

```ts
import { MobileNavToggle } from '@astryx-vue/core/MobileNav'
```

开关和抽屉绑同一个 `v-model:is-open`，`controls` 指向抽屉的 id，按钮和对话框就关联起来了：

```vue
<script setup lang="ts">
import { MobileNav, MobileNavToggle } from '@astryx-vue/core/MobileNav'
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <MobileNavToggle v-model:is-open="open" controls="app-nav" label="打开导航" />
  <MobileNav id="app-nav" v-model:is-open="open" header="导航" side="start">
    <!-- 导航项 -->
  </MobileNav>
</template>
```


<ComponentAnatomy />

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 开关和抽屉绑同一个 `v-model:is-open`，图标状态才不会和抽屉对不上。 |
| <Badge variant="success">推荐</Badge> | 移动端导航和侧边导航用同一份导航项，把它抽成一个变量共用。 |
| <Badge variant="success">推荐</Badge> | 页面上不止一处导航时给它一个 `label`，让按钮说清自己打开的是哪个。 |
| <Badge variant="error">避免</Badge> | 在桌面上用移动端导航。桌面该用常驻的侧边导航。 |

## 示例

常见的用法和不同的状态。

<DemoExample :demo="mobileNavToggleBasic" description="带无障碍名称的导航开关，旁边是页面标题。它打开一个绑着同一份状态的移动端导航抽屉。" locale="zh" title="基本用法" />

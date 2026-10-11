---
layout: component-docs
title: 移动端导航
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { mobileNavDrawer } from '../../../../components/demos/mobile-nav'
</script>

## 使用方法

`MobileNav` 是从屏幕一侧滑入的对话框抽屉，不是底部弹层。`MobileNavToggle` 和它绑同一个 `v-model:is-open`。打开后焦点留在抽屉里，Escape 或点遮罩关闭，并回到原来的焦点。

`side` 可以是 `start`、`end` 或 `auto`。`auto` 按打开时焦点的位置决定从哪一侧进入。顶栏的窄屏模式会自己创建这一对组件。

```vue
<script setup lang="ts">
import { MobileNav, MobileNavToggle } from '@astryx-vue/core/MobileNav'
import { ref } from 'vue'

const open = ref(false)
</script>

<template>
  <MobileNavToggle v-model:is-open="open" controls="app-nav" />
  <MobileNav id="app-nav" v-model:is-open="open" header="菜单" side="start">
    <!-- 导航项 -->
  </MobileNav>
</template>
```

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 开关的 <code>controls</code> 指向抽屉的 id，读屏能把按钮和对话框连起来。 |
| <Badge variant="success">推荐</Badge> | 抽屉里放普通链接。不要再套一层 <code>role="menu"</code>。 |
| <Badge variant="error">避免</Badge> | 不要用底部弹层来做这套导航。它是侧边抽屉。 |

## 示例

<DemoExample
  :demo="mobileNavDrawer"
  description="点开关从左侧打开抽屉。Escape、关闭按钮或遮罩都会把它关掉。"
  locale="zh"
  title="侧边抽屉"
/>

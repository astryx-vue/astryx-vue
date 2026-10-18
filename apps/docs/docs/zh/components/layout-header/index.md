---
layout: component-docs
title: 布局页眉
outline: false
footer: false
---

<script setup lang="ts">
import { layoutHeaderWithActions } from '../../../../components/demos/layout-header'
</script>

## 使用方法

页面标题、应用栏和工具栏待的那条顶栏。

```ts
import { LayoutHeader } from '@astryx-vue/core/Layout'
```

`LayoutHeader` 是 `Layout` 顶部那一块，高度固定。下面的 `LayoutContent` 自己滚，它不动，所以标题、面包屑或者一排操作按钮一直看得见。

`height` 写数字按像素，也可以写任意 CSS 长度。`padding` 设这一块的内边距；`paddingBlockEnd` 只改下边，标签下划线或者分隔线要贴住页眉边缘时用它。`hasDivider` 画底下那条线，不写就跟着外层 `Layout` 的 `defaultHasDividers` 走。

```vue
<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Heading } from '@astryx-vue/core/Heading'
import { Layout, LayoutContent, LayoutHeader } from '@astryx-vue/core/Layout'
import { HStack } from '@astryx-vue/core/Stack'
</script>

<template>
  <Layout>
    <template #header>
      <LayoutHeader has-divider>
        <HStack :gap="2" h-align="between" align="center">
          <Heading :level="4">
            仪表盘
          </Heading>
          <Button label="新建" variant="primary" />
        </HStack>
      </LayoutHeader>
    </template>
    <LayoutContent>
      选择一份报表。
    </LayoutContent>
  </Layout>
</template>
```

## 示例

<DemoExample :demo="layoutHeaderWithActions" title="带操作" description="固定在顶部的页眉，左边是标题，右边放一个主操作，下面是可滚动的内容。把 LayoutHeader 放进 Layout，页面级页眉就固定不动。" locale="zh" />

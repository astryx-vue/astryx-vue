---
layout: component-docs
title: 布局页脚
outline: false
footer: false
---

<script setup lang="ts">
import { layoutFooterActions } from '../../../../components/demos/layout-footer'
</script>

## 使用方法

放操作按钮、页码和状态信息的底栏。

```ts
import { LayoutFooter } from '@astryx-vue/core/Layout'
```

`LayoutFooter` 是 `Layout` 底部那一块，位置固定。上面的内容自己滚，它不动，所以一排按钮、页码或者一行状态信息一直留在原处。

`height` 写数字按像素，也可以写任意 CSS 长度。`padding` 设这一块的内边距。`hasDivider` 画顶上那条线，不写就跟着外层 `Layout` 的 `defaultHasDividers` 走。

```vue
<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { Layout, LayoutContent, LayoutFooter } from '@astryx-vue/core/Layout'
import { HStack } from '@astryx-vue/core/Stack'
</script>

<template>
  <Layout>
    <LayoutContent>
      订单详情。
    </LayoutContent>
    <template #footer>
      <LayoutFooter has-divider>
        <HStack :gap="2" h-align="end">
          <Button label="取消" variant="secondary" />
          <Button label="保存" variant="primary" />
        </HStack>
      </LayoutFooter>
    </template>
  </Layout>
</template>
```

## 示例

<DemoExample :demo="layoutFooterActions" title="操作栏" description="固定在底部的页脚，按钮靠右排，上面是可滚动的内容。把 LayoutFooter 放进 Layout，保存、取消这类操作就一直在。" locale="zh" />

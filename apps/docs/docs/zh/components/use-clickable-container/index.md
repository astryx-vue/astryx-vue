---
layout: component-docs
title: useClickableContainer
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { useClickableContainerProjectCard } from '../../../../components/demos/use-clickable-container'
</script>

## 使用方法

让整块容器可以点，同时不改变里面嵌套控件的原有行为。它解决的是「嵌套可交互元素」这个老问题：卡片整体可点，但卡片里还有按钮和链接，点这些控件不应该顺带触发卡片的动作。做法是看点击目标到容器之间有没有可交互的祖先，同时忽略文字选择。支持带 `href` 的跳转，包括中键和 Ctrl/Cmd 点击开新标签页。

```ts
import { useClickableContainer } from '@astryx-vue/core'
```

```vue
<script setup lang="ts">
import { useClickableContainer } from '@astryx-vue/core'
import { useTemplateRef } from 'vue'

const cardRef = useTemplateRef<HTMLElement>('card')
const { onClick, onMouseUp } = useClickableContainer({
  containerRef: cardRef,
  href: '/reports/quarterly',
})
</script>

<template>
  <div ref="card" v-bind="{ onClick, onMouseUp }">
    <button type="button">
      下载
    </button>
  </div>
</template>
```

## 建议

| 指引 | 做法 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 把 `onClick` 和 `onMouseUp` 都绑到容器上（`@click` 和 `@mouseup`），这样连中键点击也能处理。 |
| <Badge variant="success">推荐</Badge> | 在 `ClickableCard` 或 `SelectableCard` 内部使用，就是标准的卡片交互写法。 |
| <Badge variant="error">避免</Badge> | 整块容器本来就是一个可交互元素时不要用它；直接用 `<button>` 或 `<a>`。 |

## 示例

常见配置、变体和状态。

<DemoExample
  :demo="useClickableContainerProjectCard"
  description="用 useClickableContainer 让整张项目卡片都能点：点卡片任何地方都跟随标题链接；Star 按钮、负责人链接和选中文字仍各管各的；Ctrl/Cmd 加点击或中键会在新标签页打开项目。"
  locale="zh"
  title="useClickableContainer — 可点击的项目卡片"
/>

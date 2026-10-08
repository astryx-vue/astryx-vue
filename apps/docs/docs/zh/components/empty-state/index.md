---
layout: component-docs
title: 空状态
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { emptyStateBasic, emptyStateCompact, emptyStateIllustration, emptyStateNarrow } from '../../../../components/demos/empty-state'
</script>

## 使用方法

`EmptyState` 用来占据一块暂时没有内容的区域：搜索没有结果、列表里还没有数据、用户第一次进入某个页面。它比一句干巴巴的“暂无数据”多给出三件事——这块区域现在为什么是空的、将来会有什么、用户此刻可以做什么。

组件由四部分组成：图标或插图、标题、说明文字和操作按钮。其中只有 `title` 是必填的：

```vue
<script setup lang="ts">
import { Button } from '@astryx-vue/core/Button'
import { EmptyState } from '@astryx-vue/core/EmptyState'
</script>

<template>
  <EmptyState
    title="No results found"
    description="Try adjusting your search terms, or clear the filters."
  >
    <template #icon>
      <!-- 你自己的图标类；UnoCSS 的图标预设会铺满容器，所以给盒子一个尺寸 -->
      <span class="i-carbon-search" style="width: 24px; height: 24px" />
    </template>
    <template #actions>
      <Button label="Clear filters" variant="secondary" />
      <Button label="Create item" variant="primary" />
    </template>
  </EmptyState>
</template>
```

astryx-vue 不自带图标：`icon` 插槽里放什么由你决定，可以是图标库的 CSS 类（例如 UnoCSS 的 `i-carbon-search`），也可以是你自己的 SVG 组件或内联画。注意 UnoCSS 的图标预设会让图形铺满容器，所以要给承载类名的元素一个尺寸；上例用内联样式给出 24px，换成你自己的尺寸类也可以。

图标或插图放进 `icon` 插槽。插槽外面套了一层 `aria-hidden="true"` 的容器，因为插图只是文字的补充，不必让屏幕阅读器单独读出来；放在这里的图标因此也不需要设置 `label`。

`title` 会渲染成一个标题元素，默认是 `h3`。`headingLevel` 只改变标签本身（h1–h6），让标题能接上页面的文档大纲；标题的字号在任何级别下都相同，不会因为选择 `h2` 而变大。

`description` 可以传字符串，也可以用同名插槽传入更富的内容。它渲染成 `<div>` 而不是 `<p>`，所以插槽里可以放列表、链接这类块级内容：

```vue
<EmptyState title="No results found">
  <template #description>
    <ul>
      <li>Check the spelling of the search term.</li>
      <li>Remove one of the active filters.</li>
    </ul>
  </template>
</EmptyState>
```

操作按钮放进 `actions` 插槽，通常是一到两个，给用户一个明确的下一步。与标题、说明一样，`title` 和 `description` 也都各有一个同名插槽，用来覆盖属性传入的纯文本。

在卡片、侧边栏这类空间有限的地方，加上 `isCompact` 会同时收紧间距和字号，操作按钮也从一行改为竖排。

组件自带 `role="status"`，当它在数据加载完成之后才出现时，屏幕阅读器会把内容读出来。传进来的 `class`、`style`、`data-*` 等属性会落到根元素上；显式给出的 `role` 会覆盖默认值。

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 除了标题，再给出一个明确的下一步操作，让用户知道接下来能做什么。 |
| <Badge variant="success">推荐</Badge> | 用与场景相符的图标或插图，让人一眼看出缺的是什么内容。 |
| <Badge variant="success">推荐</Badge> | 卡片、侧边栏等空间有限的地方使用 `isCompact`。 |
| <Badge variant="error">避免</Badge> | 只放一个空状态却不给任何指引；一定要说明发生了什么，以及用户可以做什么。 |
| <Badge variant="error">避免</Badge> | 使用“暂无数据”这类宽泛的文案；要具体说明哪里是空的、为什么是空的。 |
| <Badge variant="error">避免</Badge> | 用空状态承载需要用户立即处理的错误；那种情况应该改用 [Banner](/components/banner)。 |

## 示例

<DemoExample
  :demo="emptyStateBasic"
  description="完整的空状态：图标、标题、说明文字和两个操作按钮，覆盖了组件的四个组成部分。"
  locale="zh"
  title="基础用法"
/>

<DemoExample
  :demo="emptyStateCompact"
  description="isCompact 同时收紧间距与字号，并把操作按钮改为竖排，适合卡片和侧边栏。"
  locale="zh"
  title="紧凑变体"
/>

<DemoExample
  :demo="emptyStateIllustration"
  description="icon 插槽既接受图标类，也接受自己绘制的插图，两种写法都会自动被隐藏给辅助技术。"
  locale="zh"
  title="图标与插图"
/>

<DemoExample
  :demo="emptyStateNarrow"
  description="在窄容器中，标题、说明和操作按钮会换行，而不会撑破容器。"
  locale="zh"
  title="窄容器"
/>

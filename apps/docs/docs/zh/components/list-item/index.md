---
layout: component-docs
title: 列表项
outline: false
footer: false
---

<script setup lang="ts">
import { listItemBasic, listItemMedia, listItemMetadata } from '../../../../components/demos/list-item'
</script>

## 使用方法

列表里的一行：有名字、有说明，前面能放点东西，后面也能放点东西，还能变成可以点的行。

```ts
import { ListItem } from '@astryx-vue/core/List'
```

它是 [列表](/components/list) 里的一行，渲染成一个 `<li>`。名字和说明直接写 `label` 和 `description`，前后各留一个插槽。默认它只是一行字，给它一件事做才会变成控件：加 `@click` 就变按钮，加 `href` 就变链接，加 `interactiveRef` 就指向行内那个本来就能操作的控件。

`ListItem` 是列表形状的入口，底下用的是通用的 [Item](/components/item)。行不在列表里时，直接用 `Item`。

## 示例

常见的用法和不同的状态。

<DemoExample :demo="listItemBasic" title="基础" description="最朴素的列表行，一行名字一行说明。设置项、导航摘要这类简单列表都可以这样写。" locale="zh" />

<DemoExample :demo="listItemMedia" title="带头像" description="前面带头像或图标的列表行。前面的东西要小，方便一眼扫过去。" locale="zh" />

<DemoExample :demo="listItemMetadata" title="带旁注" description="末尾对齐放一点信息。徽章、数量、时间、简短状态都可以放这里。" locale="zh" />

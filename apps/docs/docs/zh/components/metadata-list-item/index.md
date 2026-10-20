---
layout: component-docs
title: 元数据列表项
outline: false
footer: false
---

<script setup lang="ts">
import { metadataListItemBasic } from '../../../../components/demos/metadata-list-item'
</script>

## 使用方法

元数据列表里的一对「名字 + 值」。

```ts
import { MetadataListItem } from '@astryx-vue/core/MetadataList'
```

它是 [元数据列表](/components/metadata-list) 里的一项。名字写 `label`，值写在默认插槽里，所以值可以随便放：纯文字、徽章、链接，或者你自己的一段结构。名字放旁边还是放上面、名字那一栏要不要固定宽度，都由外面的列表决定，这一项只负责跟着走。

`label` 是必填的，因为只有它说明这个值是什么意思。

## 示例

常见的用法和不同的状态。

<DemoExample :demo="metadataListItemBasic" title="基础" description="元数据列表里一行行的键值对。值可以是任何内容，从纯文字到徽章这样的组件都行。" locale="zh" />

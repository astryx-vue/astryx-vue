---
layout: component-docs
title: 多选器
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { multiSelectorBadges, multiSelectorBasic, multiSelectorStates } from '../../../../components/demos/multi-selector'
</script>

## 使用方法

`MultiSelector` 从固定列表里选多项。触发器在没有搜索框时是 combobox，列表是 `aria-multiselectable` 的 listbox。选中一项不会关闭列表。

选项可以是字符串、带说明的对象、分隔线，或带标题的分组。`selectAll` 在列表顶部加一行全选，禁用项不会被全选带上。`searchable` 会在列表里显示搜索框，只过滤当前列表，不请求远程数据。

`triggerDisplay` 决定关闭后怎么展示已选项：`count` 显示「已选 N 项」，`labels` 拼接文字，`badges` 用词元。`maxBadges` 限制露出的个数，放不下时末尾显示 `+N`。宽度更窄时还会再收一次。

方向键移动高亮项，`Enter` 和空格切换选中。搜索框里的空格仍用于输入。`Escape` 关闭列表。关闭且没有在搜索时，`Backspace` 清空已选项。

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 选项不多、用户需要对照着勾选时用多选器。 |
| <Badge variant="success">推荐</Badge> | 已选项要在触发器里认出来时，用 `badges` 并加上 `+N`。 |
| <Badge variant="error">避免</Badge> | 用多选器搜索远程数据。那种场景用标签输入。 |

## 示例

<DemoExample
  :demo="multiSelectorBasic"
  description="可搜索、可清除，并带全选。分组里的禁用项不会被全选选中。"
  locale="zh"
  title="多选"
/>

<DemoExample
  :demo="multiSelectorBadges"
  description="触发器最多露出 2 枚词元，其余收成 +N。"
  locale="zh"
  title="标签溢出"
/>

<DemoExample
  :demo="multiSelectorStates"
  description="带原因的禁用项仍然可以聚焦。错误状态在字段下方显示说明。"
  locale="zh"
  title="禁用和错误"
/>

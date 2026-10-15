---
layout: component-docs
title: 多选器
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { multiSelectorColumns, multiSelectorCreate, multiSelectorForm, multiSelectorGhost, multiSelectorSearchable, multiSelectorSections, multiSelectorSheet } from '../../../../components/demos/multi-selector'
</script>

## 使用方法

`MultiSelector` 从固定列表里选多项。触发器在没有搜索框时是 combobox，列表是 `aria-multiselectable` 的 listbox。选中一项不会关闭列表。

选项可以是字符串、带说明的对象、分隔线，或带标题的分组。`selectAll` 在列表顶部加一行全选，禁用项不会被全选带上。`searchable` 会在列表里显示搜索框，只过滤当前列表，不请求远程数据。

`triggerDisplay` 决定关闭后怎么展示已选项：`count` 显示「已选 N 项」，`labels` 拼接文字，`badges` 用标签。`maxBadges` 限制露出的个数，放不下时末尾显示 `+N`。宽度更窄时还会再收一次。

只读时已选值还在，可以聚焦并提交，但打不开列表，也没有清除和展开箭头，外观不会变暗。加载时触发器显示旋转指示，这时不提供创建行，也不说没有选项。

关闭后的文字可以用函数改写，只对数量和标签两种展示生效，标签模式会忽略它。没有任何选中项时不调用，继续显示占位符。

和搜索一起打开创建后，输入的文字和任何选项标签都不相同（忽略大小写）时，列表第一行是创建。选中后，变更事件会多带一段描述，里面是创建和当时的文字。调用方要在同一次更新里把这个选项加进列表。没有搜索时不会出现创建行。

从外面开关列表时，在脚本里把句柄对象本身传进去。模板会把 ref 自动拆开，所以模板里要传一个接收句柄的函数。只读和禁用时，打开不会生效。

方向键移动高亮项，Enter 和空格切换选中。搜索框里的空格仍用于输入。没有高亮项时，Enter 会创建当前文字。Escape 关闭列表。关闭且没有在搜索时，Backspace 清空已选项。


<ComponentAnatomy />

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 选项不多、用户需要对照着勾选时用多选器。 |
| <Badge variant="success">推荐</Badge> | 已选项要在触发器里认出来时，用 `badges` 并加上 `+N`。 |
| <Badge variant="error">避免</Badge> | 用多选器搜索远程数据。那种场景用标签输入框。 |

## 示例

<DemoExample
  :demo="multiSelectorSheet"
  description="在底部弹层里勾选，列表保持打开。"
  locale="zh"
  title="底部弹层"
/>

<DemoExample
  :demo="multiSelectorColumns"
  description="隐藏标签，可搜索、可全选，触发器显示已选数量。"
  locale="zh"
  title="列可见性"
/>

<DemoExample
  :demo="multiSelectorForm"
  description="表单里两个多选器，分别标成必填和可选。"
  locale="zh"
  title="表单组合"
/>

<DemoExample
  :demo="multiSelectorGhost"
  description="无边框变体，和幽灵按钮排在同一条工具栏里。"
  locale="zh"
  title="幽灵工具栏"
/>

<DemoExample
  :demo="multiSelectorSearchable"
  description="可搜索，并带全选。"
  locale="zh"
  title="可搜索"
/>

<DemoExample
  :demo="multiSelectorSections"
  description="选项按标题分成几组。"
  locale="zh"
  title="分组权限"
/>

<DemoExample
  :demo="multiSelectorCreate"
  description="输入现有列表里没有的名字可以创建。关闭后的文字可以改成自己的句子。只读保留已选值。"
  locale="zh"
  title="创建和只读"
/>

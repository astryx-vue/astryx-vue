---
layout: component-docs
title: 选择器
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { selectorActions, selectorClearable, selectorDescriptions, selectorGhost, selectorSecondary, selectorSections, selectorSheet, selectorStates, selectorStatus } from '../../../../components/demos/selector'
</script>

## 使用方法

`Selector` 是一个下拉选择器组件，用户点击后展开选项列表，选择一项后收起。它支持搜索过滤、清除选择、禁用选项等功能。

基本用法只需要传入选项数组和绑定值：

```vue
<script setup lang="ts">
import { Selector } from '@astryx-vue/core/Selector'
import { ref } from 'vue'

const selected = ref(null)
const options = [
  { value: 'apple', label: '苹果' },
  { value: 'banana', label: '香蕉' },
  { value: 'cherry', label: '樱桃' },
]
</script>

<template>
  <Selector v-model="selected" :options="options" placeholder="选择水果" />
</template>
```

每个选项对象包含 `value`（唯一标识）和 `label`（显示文本）。可选的 `disabled` 属性可以禁用特定选项，`description` 可以添加辅助说明。

开启 `searchable` 属性后，选择器会显示搜索框，用户可以输入文字过滤选项。开启 `hasClear` 后，已选中的值旁边会出现清除按钮；`clearable` 是旧名字。

只读时当前值还在，可以聚焦，也会随表单提交，但打不开列表，也没有清除和展开箭头，外观不会变暗。同时禁用时按禁用处理。加载时触发器里是旋转指示，列表在选项到达之前不说「没有结果」。没有任何选项，和搜索之后没有命中，是两句不同的话。选中标记默认画在行尾，也可以改到行首；没选中时标记不占位。`disabledMessage` 用来解释为什么禁用：悬停和键盘聚焦时弹出提示，触发器靠 `aria-disabled` 保持可聚焦，但列表仍然打不开。

方向键上下移动高亮项，Home 和 End 跳到首尾，Enter 选中当前项，Escape 关闭列表。搜索框打开后，方向键和回车作用在搜索框上，空格仍用于输入。

菜单至少和触发器一样宽，选项更长时会跟着变宽。组件自带文案默认是英文，调用 `provideAstryxLocale('zh-CN')` 后改为中文。文档页会按当前语言自动提供。


<ComponentAnatomy />

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 选项数量超过 10 项时开启搜索功能，帮助用户快速定位。 |
| <Badge variant="success">推荐</Badge> | 为非必填字段提供清除按钮，让用户可以取消选择。 |
| <Badge variant="success">推荐</Badge> | 使用简洁清晰的选项标签，避免过长的文本。 |
| <Badge variant="error">避免</Badge> | 在选择器中放置超过 100 项选项，考虑分页或异步加载。 |
| <Badge variant="error">避免</Badge> | 使用选择器做多选，应使用专门的多选组件。 |

## 示例

<DemoExample
  :demo="selectorSheet"
  description="在底部弹层里展示单选列表，适合紧凑的触控界面。"
  locale="zh"
  title="底部弹层"
/>

<DemoExample
  :demo="selectorClearable"
  description="清除按钮可以把已选的值重置掉。"
  locale="zh"
  title="可清除"
/>

<DemoExample
  :demo="selectorGhost"
  description="无边框的选择器和幽灵按钮一起放在工具栏里。"
  locale="zh"
  title="幽灵工具栏"
/>

<DemoExample
  :demo="selectorSecondary"
  description="次要样式和次要按钮同一套静止外观：没有边框，铺一层中性底。"
  locale="zh"
  title="次要样式"
/>

<DemoExample
  :demo="selectorActions"
  description="选项可以带一个操作。点操作不会改当前选择。只要有一项带了操作，列表就变成两列。"
  locale="zh"
  title="选项操作"
/>

<DemoExample
  :demo="selectorSections"
  description="选项按带标题的分组排列。"
  locale="zh"
  title="分组"
/>

<DemoExample
  :demo="selectorDescriptions"
  description="选项带说明时，菜单画成两行。单行的值保持控件高度，两行的值正好高出一行。放进输入组后，值仍保持一行。"
  locale="zh"
  title="选项说明"
/>

<DemoExample
  :demo="selectorStatus"
  description="错误、警告和成功三种校验状态。"
  locale="zh"
  title="校验状态"
/>

<DemoExample
  :demo="selectorStates"
  description="只读保留当前值，加载时不声称没有选项。必填标在标签旁。禁用的字段在悬停或键盘聚焦时用气泡说明原因，并且仍可聚焦。搜索没有命中时用另一句文案，选中标记可以画在行首。"
  locale="zh"
  title="只读、禁用、加载和搜索"
/>

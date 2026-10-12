---
layout: component-docs
title: 复合选择器
outline: false
footer: false
---

<script setup lang="ts">
import {
  complexSelectorCategory,
  complexSelectorFruit,
  complexSelectorStatus,
  complexSelectorTree,
} from '../../../../components/demos/complex-selector'
</script>

## 使用方法

`ComplexSelector` 是一个弹层内容由你来画的字段。标签、触发器、弹出层、焦点归还和 `changeAction` 由它负责。默认插槽负责内容，参数是 `value`、`commit`、`close` 和 `state`。

`commit` 写入新值，并在提供了 `changeAction` 时执行它。动作还没结束时，触发器显示加载指示，插槽看到的是刚提交的值。在触发器上按 Arrow Down 会打开弹层。

```vue
<script setup lang="ts">
import { ComplexSelector } from '@astryx-vue/core/ComplexSelector'
import { ref } from 'vue'

const value = ref('Apple, Juicy')
</script>

<template>
  <ComplexSelector v-model="value" label="Fruit blend" :trigger-label="value">
    <template #default="{ commit, close }">
      <button type="button" @click="commit('Pear, Juicy'); close()">
        Pear, Juicy
      </button>
    </template>
  </ComplexSelector>
</template>
```

插槽里的网格可以用 `useGridRovingFocus`。树可以用 `TreeList`。`status`、`isDisabled`、`isRequired` 和 `description` 与其他输入框的字段属性相同。

## 示例

<DemoExample :demo="complexSelectorFruit" description="Apple、Pear、Peach、Plum 对应 Crisp、Tender、Juicy、Peak。方向键留在同一列成熟度上。" locale="zh" title="水果成熟度" />
<DemoExample :demo="complexSelectorTree" description="在 Workspace、Teams、Archive 里搜索文件夹。当前路径留在树的下面。" locale="zh" title="带搜索的树" />
<DemoExample :demo="complexSelectorCategory" description="Produce 和 Pantry。Save category 放在字段旁边。" locale="zh" title="分类树" />
<DemoExample :demo="complexSelectorStatus" description="Workspace 会做一次短暂保存并显示成功。Locked folder 被禁用，并显示错误。" locale="zh" title="状态与提交中" />

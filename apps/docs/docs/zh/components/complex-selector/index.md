---
layout: component-docs
title: 复合选择器
outline: false
footer: false
---

<script setup lang="ts">
import {
  complexSelectorDeadline,
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

const value = ref('Today')
</script>

<template>
  <ComplexSelector v-model="value" label="Deadline" :trigger-label="value">
    <template #default="{ commit, close }">
      <button type="button" @click="commit('Next week'); close()">
        Next week
      </button>
    </template>
  </ComplexSelector>
</template>
```

弹层会一直开着，直到插槽调用 `commit`。树可以用 `TreeList`。`status`、`isDisabled`、`isRequired` 和 `description` 与其他输入框的字段属性相同。

## 示例

<DemoExample :demo="complexSelectorDeadline" description="Today、Tomorrow 或 Next week，也可以自定义日期和时间。Apply 提交并关闭弹层。" locale="zh" title="截止日期" />
<DemoExample :demo="complexSelectorTree" description="在 Teams 和 Workspace 里搜索文件夹。选中文件夹后弹层关闭。" locale="zh" title="树搜索" />

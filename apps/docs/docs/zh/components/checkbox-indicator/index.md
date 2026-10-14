---
layout: component-docs
title: 复选指示器
outline: false
footer: false
---

## 使用方法

`CheckboxIndicator` 只负责展示未选、选中或半选三种标记，是一个纯装饰组件：没有输入、焦点或表单行为。它适合出现在列表、多选摘要等只需要呈现选择状态、不需要用户操作的场景：

指定 `state` 即可显示对应标记，`size` 控制尺寸：

```vue
<script setup lang="ts">
import { CheckboxIndicator } from '@astryx-vue/core/CheckboxIndicator'
</script>

<template>
  <CheckboxIndicator state="indeterminate" size="sm" />
</template>
```

在应用入口引入主题：

```ts
import '@astryx-vue/themes/neutral.css'
```


需要用户操作时，使用 [CheckboxInput](/components/checkbox-input)。

方框也可以整组替换。选择器和任务列表用的勾、单选用的圆点，都在 [指示器](/components/indicator) 里按名字换。

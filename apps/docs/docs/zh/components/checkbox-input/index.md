---
layout: component-docs
title: 复选框
outline: false
footer: false
---

<script setup lang="ts">
import { checkboxInputBasic, checkboxInputSizes, checkboxInputIndeterminate, checkboxInputStates, checkboxInputForm, checkboxInputAsync } from '../../../../components/demos/checkbox-input'
</script>

## 使用方法

`CheckboxInput` 用于独立的布尔选项，也可组成多选列表。
组件包含标签、说明和状态消息。

```vue
<script setup lang="ts">
import { CheckboxInput } from '@astryx-vue/core/CheckboxInput'
import { shallowRef } from 'vue'

const selected = shallowRef(false)
</script>

<template>
  <CheckboxInput v-model="selected" label="Email updates" />
</template>
```

主题在应用入口引入一次：

```ts
import '@astryx-vue/themes/neutral.css'
```

## 示例

<DemoExample :demo="checkboxInputBasic" title="基本选择" description="使用 v-model 管理选中状态。点击标签或说明也可切换。" locale="zh" />

<DemoExample :demo="checkboxInputSizes" title="尺寸" description="sm 为 20px。md 为 24px。" locale="zh" />

<DemoExample :demo="checkboxInputIndeterminate" title="全选与半选" description="部分子项选中时，父项显示半选。激活半选框后，值变为 true。" locale="zh" />

<DemoExample :demo="checkboxInputStates" title="禁用、只读与加载" description="加载状态阻止重复切换。禁用原因可通过悬停或键盘焦点查看。" locale="zh" />

<DemoExample :demo="checkboxInputForm" title="原生表单" description="选中必填项后提交表单。示例通过重置事件更新 v-model。" locale="zh" />

<DemoExample :demo="checkboxInputAsync" title="异步保存与重试" description="开启失败模拟可查看错误。关闭模拟后再次修改可重试。" locale="zh" />

## 键盘与无障碍

- 使用 Tab 聚焦复选框。
- 使用空格键切换选中状态。
- 必须提供 `label`。
- `isLabelHidden` 只隐藏视觉标签。
- 半选状态通过原生 `indeterminate` 属性提供。
- `description` 和状态消息关联到 `aria-describedby`。
- `isRequired` 启用原生必填校验。
- 错误状态设置 `aria-invalid`。

只需显示选中标记时，使用 [CheckboxIndicator](/components/checkbox-indicator).

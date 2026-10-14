---
layout: component-docs
title: 复选框
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { checkboxInputStates, checkboxInputIndeterminate, checkboxInputStatus } from '../../../../components/demos/checkbox-input'
</script>

## 使用方法

`CheckboxInput` 用来表示“同意协议”“订阅更新”这类独立的布尔选项，也可以多个组合成多选列表。组件自带标签、说明和状态消息，无需再搭配 `Field`。

基础的用法是用 `v-model` 绑定选中状态：

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




## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 必须提供可见的标签，让用户知道自己在切换什么。只有上下文已经明确时，才使用 isLabelHidden 隐藏标签。 |
| <Badge variant="success">推荐</Badge> | 对需要额外说明的选项添加描述。例如解释 “Share usage data” 实际会共享哪些内容。 |
| <Badge variant="success">推荐</Badge> | 当一组中只选中部分项目时，“全选”复选框使用不确定状态（indeterminate）。 |
| <Badge variant="error">避免</Badge> | 用复选框表示互斥的选项。只能选一项时，应使用 RadioList。 |
| <Badge variant="error">避免</Badge> | 用复选框表示立即生效的操作。应使用开关或按钮。 |
| <Badge variant="error">避免</Badge> | 用 Tooltip 包裹禁用的复选框来解释禁用原因。禁用的控件会吞掉包裹层需要的悬停事件。应改用 disabledMessage 属性。 |

## 示例

<DemoExample
  :demo="checkboxInputStates"
  description="选中、未选中、禁用和部分选中，每项都有说明。"
  locale="zh"
  title="状态"
/>

<DemoExample
  :demo="checkboxInputIndeterminate"
  description="只开启了部分通知时，全选显示为横线。"
  locale="zh"
  title="部分选中"
/>

<DemoExample
  :demo="checkboxInputStatus"
  description="复选框下方的错误、警告和成功说明。"
  locale="zh"
  title="校验状态"
/>

## 键盘与无障碍

`CheckboxInput` 内部是原生的 `<input type="checkbox">`，键盘操作沿用浏览器的默认行为：按 Tab 聚焦复选框，按空格键切换选中状态。

标签、说明和状态消息由组件通过 ARIA 属性串联起来，辅助技术能把它们当成一个整体读出：

- 必须提供 `label`，屏幕阅读器靠它说明这个选项的含义；`isLabelHidden` 只隐藏视觉上的标签，标签文本仍然作为可访问名称提供。
- `description` 和状态消息关联到 `aria-describedby`，聚焦时会一并读出。
- 半选状态通过原生 `indeterminate` 属性提供，浏览器和辅助技术都能直接识别。
- `isRequired` 启用浏览器原生的必填校验。
- 出错时组件自动设置 `aria-invalid`。

如果只需要显示选中标记，请使用 [CheckboxIndicator](/components/checkbox-indicator)。

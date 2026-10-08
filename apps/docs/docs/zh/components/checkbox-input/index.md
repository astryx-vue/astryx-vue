---
layout: component-docs
title: 复选框
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { checkboxInputBasic, checkboxInputSizes, checkboxInputIndeterminate, checkboxInputStates, checkboxInputForm, checkboxInputAsync } from '../../../../components/demos/checkbox-input'
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

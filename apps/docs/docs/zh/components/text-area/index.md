---
layout: component-docs
title: 文本域
outline: false
footer: false
---

<script setup lang="ts">
import { textAreaBasic, textAreaSizes, textAreaRows, textAreaStates, textAreaValidation, textAreaAsync } from '../../../../components/demos/text-area'
</script>

## 使用方法

`TextArea` 用于输入多行纯文本。

```vue
<script setup lang="ts">
import { TextArea } from '@astryx-vue/core/TextArea'
import { shallowRef } from 'vue'

const bio = shallowRef('')
</script>

<template>
  <TextArea v-model="bio" label="Bio" :rows="4" />
</template>
```

主题在应用入口引入一次：

```ts
import '@astryx-vue/themes/neutral.css'
```

## 示例

<DemoExample :demo="textAreaBasic" title="基本用法" description="用于长文本。标签、说明与状态消息通过 Field 自动关联。" locale="zh" />

<DemoExample :demo="textAreaSizes" title="尺寸" description="提供 sm、md、lg 三种高度。宽度由 width 属性控制。" locale="zh" />

<DemoExample :demo="textAreaRows" title="行数与长度" description="rows、cols、minlength 与 maxlength 直接透传给原生 textarea。" locale="zh" />

<DemoExample :demo="textAreaStates" title="禁用与只读" description="禁用后表单不提交值。提供 disabledMessage 时仍可聚焦并查看原因。" locale="zh" />

<DemoExample :demo="textAreaValidation" title="验证状态" description="status 显示错误、警告或成功消息。默认附在字段下方。" locale="zh" />

<DemoExample :demo="textAreaAsync" title="异步保存" description="changeAction 在每次内容变化后执行。执行期间显示加载状态。" locale="zh" />

## 键盘操作

- Tab：聚焦文本域。
- Shift + Enter：插入换行。
- Enter：触发 `enter` 事件。
- Escape：关闭禁用原因提示或状态提示。

## 使用建议

- 需要精确字数时，在说明中写明 minlength 与 maxlength。
- `isRequired` 只提供必填提示，不执行原生校验。
- 业务层负责校验输入内容。

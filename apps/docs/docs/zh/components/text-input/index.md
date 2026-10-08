---
layout: component-docs
title: 文本输入框
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { textInputBasic, textInputSizes, textInputSearch, textInputPassword, textInputStates, textInputValidation, textInputAsync } from '../../../../components/demos/text-input'
</script>

## 使用方法

`TextInput` 用于输入邮箱、姓名、搜索词等单行文本。标签、说明与校验消息由内置的 `Field` 自动关联，通过 `v-model` 管理输入值即可：

```vue
<script setup lang="ts">
import { TextInput } from '@astryx-vue/core/TextInput'
import { shallowRef } from 'vue'

const email = shallowRef('')
</script>

<template>
  <TextInput v-model="email" label="邮箱" type="email" auto-complete="email" />
</template>
```

自定义控件可使用 [Field](/components/field)。主题在应用入口引入一次：

```ts
import '@astryx-vue/themes/neutral.css'
```




## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 必须提供可见的标签，让用户知道该字段的用途。只有上下文已经明确时才隐藏标签，例如带放大镜图标的搜索框。 |
| <Badge variant="success">推荐</Badge> | 使用带消息的校验状态，说明出了什么问题。“邮箱必须包含 @” 比仅把边框变红更清楚。 |
| <Badge variant="success">推荐</Badge> | 输入框尺寸要与预期内容长度相符，让用户判断该输入多少内容。邮编用 small，姓名用 medium，URL 用 large。 |
| <Badge variant="success">推荐</Badge> | 为搜索和筛选输入框添加清除按钮，让用户无需全选文字即可快速重置。 |

## 示例

<DemoExample :demo="textInputBasic" title="基本输入" description="标签、说明与输入值放在同一个字段中，使用 v-model 管理值。" locale="zh" />

<DemoExample :demo="textInputSizes" title="尺寸" description="输入框提供三档尺寸。标签和说明的字号保持固定。" locale="zh" />

<DemoExample :demo="textInputSearch" title="搜索与清除" description="隐藏标签时仍保留无障碍名称。中文输入法提交候选词时不会触发 enter。" locale="zh" />

<DemoExample :demo="textInputPassword" title="密码与尾部插槽" description="通过 end 插槽加入显示密码按钮，组件保留原生 password 类型。" locale="zh" />

<DemoExample :demo="textInputStates" title="禁用与只读" description="禁用字段不参与提交。只读字段仍可聚焦、复制和提交。禁用原因可通过焦点发现。" locale="zh" />

<DemoExample :demo="textInputValidation" title="校验状态" description="三种状态均有图标。错误、警告和成功文字支持紧贴、分离或提示布局。" locale="zh" />

<DemoExample :demo="textInputAsync" title="异步保存与失败重试" description="修改内容时显示加载状态。输入 fail 可触发保存失败。再次修改内容可重试。示例忽略过期结果。" locale="zh" />

## 无障碍

- 必须提供 `label`。
- 不得用 `placeholder` 代替标签。
- `description` 关联到 `aria-describedby`。
- `status.message` 关联到 `aria-describedby`。
- 错误状态设置 `aria-invalid`。
- 必填状态设置 `aria-required`。

必须使用浏览器原生必填校验时，另外传入 `required`。
`isRequired` 控制必填提示和 ARIA 状态。

## 输入法

- 输入法正在组合文字时，组件不更新 `v-model`。
- `compositionend` 触发后，组件更新 `v-model`。
- 使用 Enter 提交候选词时，组件不触发 `enter`。

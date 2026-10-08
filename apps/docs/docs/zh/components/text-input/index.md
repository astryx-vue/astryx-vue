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

`label` 是必填项。屏幕阅读器靠它说明这个字段是做什么的；`placeholder` 只在输入框为空时可见，用户一开始输入就消失，不能用它代替标签。

标签、说明和状态消息由组件通过 ARIA 属性串联起来，辅助技术能把它们当成一个整体读出：

- `description` 与 `status.message` 关联到 `aria-describedby`。
- 出错时自动设置 `aria-invalid`。
- 字段必填时自动设置 `aria-required`。

`isRequired` 负责显示必填提示并设置 ARIA 状态。如果还需要浏览器原生的必填校验——例如依赖表单提交来拦截未填写的字段——再额外传入 `required`。

## 中文输入法

拼音、注音这类输入法在用户敲下字母时，文字还处在候选状态，选定候选词之后才算真正输入完成。组件会区分「正在组合」和「已经输入」，避免把半成品当成最终值：

- 候选词尚未确定时，组件不更新 `v-model`，输入框里显示的仍是组合中的文字。
- `compositionend` 触发后，也就是用户选定候选词的那一刻，组件才把最终文字同步到 `v-model`。
- 用 Enter 选定候选词不会触发 `enter` 事件；用户再次按下 Enter 提交表单时，`enter` 才正常触发。

这样，依赖 `v-model` 的校验和提交逻辑就不会在用户输入到一半时被提前打断。

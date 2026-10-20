---
layout: component-docs
title: 文本输入框
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { textInputIcon, textInputSearch, textInputSizes, textInputStates, textInputVariant, textInputTypes } from '../../../../components/demos/text-input'
</script>

## 使用方法

`TextInput`（单行文本输入框）供用户输入一行简短文字，例如电子邮箱、姓名、搜索词或密码等。它内置了 `Field` 组件，会自动把标签文字、辅助说明以及校验报错信息与输入框关联在一起。平时只需配合 `v-model` 绑定输入值即可：

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

**什么时候用：**
- 需要用户输入较短的一行文字时（如登录账号、联系方式、单行搜索）。

**什么时候不要用：**
- 需要输入文章、留言或详细备注等多行长篇内容时，请改用多行文本域 [TextArea](/components/text-area)。
- 需要用户从预设列表中挑选已有选项时，请改用 [Selector](/components/selector) 或下拉菜单。
- 需要完全自定义输入控件的外壳与结构时，可以直接使用底层原子组件 [Field](/components/field)。

主题只需在整个应用的主入口（如 `main.ts`）引入一次：

```ts
import '@astryx-vue/themes/neutral.css'
```





<ComponentAnatomy />

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 必须提供可见的标签，让用户知道该字段的用途。只有上下文已经明确时才隐藏标签，例如带放大镜图标的搜索框。 |
| <Badge variant="success">推荐</Badge> | 使用带消息的校验状态，说明出了什么问题。“邮箱必须包含 @” 比仅把边框变红更清楚。 |
| <Badge variant="success">推荐</Badge> | 输入框尺寸要与预期内容长度相符，让用户判断该输入多少内容。邮编用 small，姓名用 medium，URL 用 large。 |
| <Badge variant="success">推荐</Badge> | 为搜索和筛选输入框添加清除按钮，让用户无需全选文字即可快速重置。 |

## 示例

<DemoExample
  :demo="textInputIcon"
  description="姓名、邮箱和密码字段，前面各有一个图标。"
  locale="zh"
  title="图标"
/>

<DemoExample
  :demo="textInputSearch"
  description="带放大镜和清除按钮的搜索框。"
  locale="zh"
  title="搜索"
/>

<DemoExample
  :demo="textInputSizes"
  description="小号、中号和大号字段。"
  locale="zh"
  title="尺寸"
/>

<DemoExample
  :demo="textInputStates"
  description="错误、警告和成功说明，以及没有说明的状态、禁用和加载中。"
  locale="zh"
  title="状态"
/>

<DemoExample
  :demo="textInputVariant"
  description="状态说明可以贴在字段上，也可以浮在字段下方。"
  locale="zh"
  title="状态位置"
/>

<DemoExample
  :demo="textInputTypes"
  description="说明、密码、邮箱、提示、必填和可选字段。"
  locale="zh"
  title="类型"
/>

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

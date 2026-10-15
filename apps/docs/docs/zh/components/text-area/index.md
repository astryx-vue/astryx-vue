---
layout: component-docs
title: 文本域
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { textAreaCount, textAreaStates, textAreaValidation, textAreaIcon } from '../../../../components/demos/text-area'
</script>

## 使用方法

`TextArea` 用于输入多行纯文本，适合个人简介、反馈意见、评论等需要换行的内容。标签、说明与校验消息由内置的 `Field` 自动关联，通过 `v-model` 管理内容即可：

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





<ComponentAnatomy />

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 提供可见的标签，让用户知道该输入什么。若必须隐藏标签，设置 isLabelHidden，并为屏幕阅读器提供描述性标签。 |
| <Badge variant="success">推荐</Badge> | 设有字数上限时，设置 maxLength 并显示字数统计。这能帮助用户在提交前控制字数。 |
| <Badge variant="success">推荐</Badge> | 使用 status 属性显示行内校验反馈：输入有效时用 success，软限制用 warning，硬错误用 error。 |
| <Badge variant="success">推荐</Badge> | 添加说明或占位文字，说明预期内容，例如 “Describe the issue in detail”。避免只用占位文字作为唯一标签。 |
| <Badge variant="error">避免</Badge> | 用文本域输入名称或邮箱等单行短内容。应使用文本输入框。 |
| <Badge variant="error">避免</Badge> | 只依赖占位文字说明字段用途。占位文字在获得焦点后会消失，且不是可访问的标签。 |
| <Badge variant="error">避免</Badge> | 在未设置状态类型时显示状态消息。边框颜色和图标正是吸引用户注意消息的元素。 |
| <Badge variant="error">避免</Badge> | 用 Tooltip 包裹禁用的文本域来解释禁用原因。禁用的控件会吞掉包裹层需要的悬停事件。应改用 disabledMessage 属性。 |

## 示例

<DemoExample
  :demo="textAreaCount"
  description="一条状态更新，最多 280 个字符，并实时显示字数。"
  locale="zh"
  title="字数"
/>

<DemoExample
  :demo="textAreaStates"
  description="必填、禁用和加载中的文本域。"
  locale="zh"
  title="状态"
/>

<DemoExample
  :demo="textAreaValidation"
  description="错误、警告和成功说明，以及一条没有说明的错误。"
  locale="zh"
  title="校验"
/>

<DemoExample
  :demo="textAreaIcon"
  description="会议记录，带铅笔图标和一段简短说明。"
  locale="zh"
  title="图标"
/>

## 键盘操作

文本域沿用浏览器原生 `textarea` 的按键行为，组件只在个别按键上追加了处理，因此大部分操作和系统里的其它多行输入框一致：

- 按 Tab 把焦点移入或移出文本域。
- 按 Shift + Enter 在光标处插入一个换行。
- 按 Enter 时组件触发 `enter` 事件，你可以在回调里处理提交等逻辑。
- 按 Escape 关闭已经打开的禁用原因提示或状态提示。

如果「按 Enter 提交」这类行为对你有意义，直接在 `enter` 事件里实现即可。

## 使用建议

文本域不会限制用户输入什么，字数控制和内容校验都需要在你的应用里完成：

- 对字数有明确要求时，把 `minlength` 与 `maxlength` 写进 `description`，让用户在提交前就知道预期长度。
- `isRequired` 只负责显示必填提示并设置对应的 ARIA 状态，不会执行浏览器原生的必填校验。
- 输入内容是否符合业务规则，由应用层负责校验。

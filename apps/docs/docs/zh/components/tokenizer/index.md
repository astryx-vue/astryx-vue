---
layout: component-docs
title: 标签输入框
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { tokenizerClear, tokenizerCreatable, tokenizerEnd, tokenizerIcon, tokenizerMax, tokenizerOverflow, tokenizerStates } from '../../../../components/demos/tokenizer'
</script>

## 使用方法

`Tokenizer` 把多条搜索结果收成可删除的标签。数据源和自动补全相同，本地用 `createStaticSource`，远程实现 `search`。已选条目不会再次出现在列表里。

`creatable` 允许把当前输入收成一条新标签。`clearable` 一次清空。输入框为空时，`Backspace` 删掉最后一条。方向键可以在标签之间移动焦点，`Backspace` 或 `Delete` 删除当前标签。

`overflow` 控制放不下时的表现：

| 值 | 行为 |
| --- | --- |
| `none` | 标签换行，全部可见。 |
| `unfocused-inline` | 失焦时收成一行，末尾显示 `+N`，聚焦后在原处展开。 |
| `unfocused-layer` | 失焦时同样收成一行，聚焦后浮在字段上展开，不把下面的内容往下推。 |

宽度测量复用 `useOverflow`。`#icon` 插槽放在输入区开头，每条标签也可以用 `#token` 换成自己的 `Token`。

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 标签会很多、字段又要保持一行时，用 `unfocused-inline`。 |
| <Badge variant="success">推荐</Badge> | 允许用户自造条目时打开 `creatable`，并在变更事件里区分 `add` 和 `create`。 |
| <Badge variant="error">避免</Badge> | 选项是短小的固定清单时用标签输入框。那种场景用多选器。 |

## 示例

<DemoExample
  :demo="tokenizerClear"
  description="选中之后出现全部清除按钮。"
  locale="zh"
  title="全部清除"
/>

<DemoExample
  :demo="tokenizerCreatable"
  description="可以只输入新标签，也可以在搜索结果之外新建一条。"
  locale="zh"
  title="可新建"
/>

<DemoExample
  :demo="tokenizerEnd"
  description="输入区末尾放一个操作按钮。"
  locale="zh"
  title="尾部内容"
/>

<DemoExample
  :demo="tokenizerIcon"
  description="开头的搜索图标说明这里可以搜索。"
  locale="zh"
  title="图标"
/>

<DemoExample
  :demo="tokenizerMax"
  description="到达上限后不能再添加。"
  locale="zh"
  title="数量上限"
/>

<DemoExample
  :demo="tokenizerOverflow"
  description="失焦时收成一行。行内模式展开会把下面的内容往下推，浮层模式盖在字段上。"
  locale="zh"
  title="溢出"
/>

<DemoExample
  :demo="tokenizerStates"
  description="禁用、错误、警告和成功四种状态。"
  locale="zh"
  title="状态"
/>

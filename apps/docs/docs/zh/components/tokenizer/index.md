---
layout: component-docs
title: 标签输入
outline: false
footer: false
---

<script setup lang="ts">
import { Badge } from '@astryx-vue/core/Badge'
import { tokenizerBasic, tokenizerOverflow, tokenizerStates } from '../../../../components/demos/tokenizer'
</script>

## 使用方法

`Tokenizer` 把多条搜索结果收成可删除的词元。数据源和自动补全相同，本地用 `createStaticSource`，远程实现 `search`。已选条目不会再次出现在列表里。

`creatable` 允许把当前输入收成一条新词元。`clearable` 一次清空。输入框为空时，`Backspace` 删掉最后一条。方向键可以在词元之间移动焦点，`Backspace` 或 `Delete` 删除当前词元。

`overflow` 控制放不下时的表现：

| 值 | 行为 |
| --- | --- |
| `none` | 词元换行，全部可见。 |
| `unfocused-inline` | 失焦时收成一行，末尾显示 `+N`，聚焦后在原处展开。 |
| `unfocused-layer` | 失焦时同样收成一行，聚焦后浮在字段上展开，不把下面的内容往下推。 |

宽度测量复用 `useOverflow`。`#icon` 插槽放在输入区开头，每条词元也可以用 `#token` 换成自己的 `Token`。

## 最佳实践

| 指引 | 实践 |
| --- | --- |
| <Badge variant="success">推荐</Badge> | 标签会很多、字段又要保持一行时，用 `unfocused-inline`。 |
| <Badge variant="success">推荐</Badge> | 允许用户自造条目时打开 `creatable`，并在变更事件里区分 `add` 和 `create`。 |
| <Badge variant="error">避免</Badge> | 选项是短小的固定清单时用标签输入。那种场景用多选器。 |

## 示例

<DemoExample
  :demo="tokenizerBasic"
  description="可搜索、可新建、可清空。开头的 @ 来自图标插槽。"
  locale="zh"
  title="多选搜索"
/>

<DemoExample
  :demo="tokenizerOverflow"
  description="失焦时收成一行并显示 +N。点进去会展开全部词元。"
  locale="zh"
  title="标签溢出"
/>

<DemoExample
  :demo="tokenizerStates"
  description="带原因的禁用项仍然可以聚焦。错误状态在字段下方显示说明。"
  locale="zh"
  title="禁用和错误"
/>

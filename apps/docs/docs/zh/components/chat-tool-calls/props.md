---
layout: component-docs
title: 对话工具调用
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="ChatToolCalls 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>calls</code></td><td><code>ChatToolCallItem[]</code></td><td>—</td><td>助手这一轮的全部工具调用，必填。空数组什么都不渲染。每项可以有 <code>name</code>、<code>status</code>、<code>target</code>、<code>duration</code>、<code>node</code>、<code>additions</code>、<code>deletions</code>、<code>stats</code>、<code>errorMessage</code>、<code>key</code>、<code>resultDetail</code>、<code>data</code>。</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>本地化的条数</td><td>一组展开后，表头上显示的文字。</td></tr>
<tr><td><code>isExpanded</code></td><td><code>boolean</code></td><td>—</td><td>受控的展开状态，用 <code>v-model:is-expanded</code> 绑定。</td></tr>
<tr><td><code>defaultIsExpanded</code></td><td><code>boolean</code></td><td><code>false</code></td><td>没绑 <code>isExpanded</code> 时用的初始展开状态。</td></tr>
</tbody></table>
</div>

## 事件

- `expandedChange(isExpanded: boolean)`：表头请求切换到的状态。用 `v-model:is-expanded` 时还会发 `update:isExpanded`。

## 插槽

- `detail`：给某一条调用画更丰富的结果，插槽参数是 `{ call }`。不传就用 `call.resultDetail` 的纯文本。

## 暴露

- `element`：根元素。

## 类型

`ChatToolCallItem`：

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `name` | `string` | 工具或函数名，用等宽字体显示。必填。 |
| `status` | `'pending' \| 'running' \| 'complete' \| 'error'` | 执行状态。不写就当已完成。 |
| `target` | `string` | 工具动的是什么，例如文件路径、命令或者搜索词。 |
| `duration` | `string` | 耗时，排在行尾，例如 `1.2s`。 |
| `node` | `string` | 沙箱或 worker 的名字，显示成一个灰色小条。 |
| `additions` | `number` | 新增的行数或字符数，显示成 `+12`。 |
| `deletions` | `number` | 删除的行数或字符数，显示成 `-3`。 |
| `stats` | `string` | 跟在后面的一段纯文本。 |
| `errorMessage` | `string` | `status` 是 `error` 时的错误说明。会读给读屏，也用作状态图标的提示。 |
| `key` | `string` | 稳定标识。不写就按其它字段推出来。 |
| `resultDetail` | `string` | 展开这一行后显示的细节，例如 diff 或命令输出。有这个字段的行才能展开。要放富文本请用 `detail` 插槽。 |
| `detail` | `string` | `resultDetail` 的别名。两个都写时以 `resultDetail` 为准。 |
| `data` | `unknown` | 你自己挂在调用上的任意数据，不会渲染出来。 |

---
layout: component-docs
title: 标签输入
outline: false
footer: false
---

## Tokenizer Props

<div class="component-api-table" role="region" aria-label="Tokenizer Props" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>modelValue</code></td><td><code>T[]</code></td><td><code>[]</code></td><td>已选条目。</td></tr>
      <tr><td><code>searchSource</code></td><td><code>SearchSource&lt;T&gt;</code></td><td>必需</td><td>静态或异步搜索源。</td></tr>
      <tr><td><code>label</code></td><td><code>string</code></td><td>必需</td><td>字段标签。</td></tr>
      <tr><td><code>placeholder</code></td><td><code>string</code></td><td><code>Add…</code> / <code>添加…</code></td><td>输入框占位符。</td></tr>
      <tr><td><code>creatable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>回车把输入文字收成新词元。</td></tr>
      <tr><td><code>overflow</code></td><td><code>'none' | 'unfocused-inline' | 'unfocused-layer'</code></td><td><code>'none'</code></td><td>失焦时是否收成一行并显示 <code>+N</code>。</td></tr>
      <tr><td><code>maxEntries</code></td><td><code>number</code></td><td>—</td><td>最多可选几条。达到上限后输入框只读。</td></tr>
      <tr><td><code>debounceMs</code></td><td><code>number</code></td><td><code>150</code></td><td>输入停顿后再搜索。</td></tr>
      <tr><td><code>showOnFocus</code></td><td><code>boolean</code></td><td><code>false</code></td><td>聚焦后还没输入就展示结果。</td></tr>
      <tr><td><code>clearable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>是否可全部清除。</td></tr>
      <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>是否禁用。</td></tr>
      <tr><td><code>disabledReason</code></td><td><code>string</code></td><td>—</td><td>禁用原因。有值时控件仍可聚焦。</td></tr>
      <tr><td><code>status</code></td><td><code>'default' | 'success' | 'warning' | 'error'</code></td><td><code>'default'</code></td><td>状态样式。</td></tr>
      <tr><td><code>statusMessage</code></td><td><code>string</code></td><td>—</td><td>字段下方的状态说明。</td></tr>
      <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>尺寸。</td></tr>
      <tr><td><code>name</code></td><td><code>string</code></td><td>—</td><td>表单字段名。每个已选 id 提交一次。</td></tr>
    </tbody>
  </table>
</div>

## Tokenizer Emits

<div class="component-api-table" role="region" aria-label="Tokenizer Emits" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>载荷</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>update:modelValue</code></td><td><code>value: T[]</code></td><td>已选条目变化时触发。</td></tr>
      <tr><td><code>change</code></td><td><code>value: T[]</code>、<code>change: TokenizerChange</code></td><td>带上这次变化的类型：<code>add</code>、<code>create</code>、<code>remove</code>、<code>clear</code>。</td></tr>
      <tr><td><code>search</code></td><td><code>query: string</code></td><td>查询文字变化时触发。</td></tr>
      <tr><td><code>openChange</code></td><td><code>isOpen: boolean</code></td><td>列表打开或关闭时触发。</td></tr>
    </tbody>
  </table>
</div>

## Tokenizer Slots

<div class="component-api-table" role="region" aria-label="Tokenizer Slots" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>参数</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>icon</code></td><td>—</td><td>输入区开头的图标。</td></tr>
      <tr><td><code>end</code></td><td>—</td><td>输入区末尾的内容。</td></tr>
      <tr><td><code>token</code></td><td><code>{ item, remove }</code></td><td>自定义已选词元。</td></tr>
      <tr><td><code>item</code></td><td><code>{ item, isActive, isSelected }</code></td><td>自定义下拉条目。</td></tr>
      <tr><td><code>empty</code></td><td>—</td><td>自定义空状态。</td></tr>
    </tbody>
  </table>
</div>

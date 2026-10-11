---
layout: component-docs
title: 自动补全
outline: false
footer: false
---

## Typeahead Props

<div class="component-api-table" role="region" aria-label="Typeahead Props" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>modelValue</code></td><td><code>T | null</code></td><td><code>null</code></td><td>当前选中的条目。条目至少包含 <code>id</code> 和 <code>label</code>。</td></tr>
      <tr><td><code>searchSource</code></td><td><code>SearchSource&lt;T&gt;</code></td><td>必需</td><td>静态或异步搜索源。空查询优先调用 <code>bootstrap</code>。</td></tr>
      <tr><td><code>label</code></td><td><code>string</code></td><td>必需</td><td>字段标签。屏幕阅读器始终读得到。</td></tr>
      <tr><td><code>placeholder</code></td><td><code>string</code></td><td><code>Search…</code> / <code>搜索…</code></td><td>占位符。未设置语言时为英文。</td></tr>
      <tr><td><code>debounceMs</code></td><td><code>number</code></td><td><code>150</code></td><td>输入停顿后再搜索。本地数据可设为 0。</td></tr>
      <tr><td><code>showOnFocus</code></td><td><code>boolean</code></td><td><code>false</code></td><td>聚焦后还没输入就展示结果。</td></tr>
      <tr><td><code>maxMenuItems</code></td><td><code>number</code></td><td><code>10</code></td><td>下拉最多显示多少条。</td></tr>
      <tr><td><code>clearable</code></td><td><code>boolean</code></td><td><code>true</code></td><td>是否显示清除按钮。</td></tr>
      <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>是否禁用。</td></tr>
      <tr><td><code>disabledReason</code></td><td><code>string</code></td><td>—</td><td>禁用原因。有值时控件仍可聚焦。</td></tr>
      <tr><td><code>status</code></td><td><code>'default' | 'success' | 'warning' | 'error'</code></td><td><code>'default'</code></td><td>状态样式。</td></tr>
      <tr><td><code>statusMessage</code></td><td><code>string</code></td><td>—</td><td>字段下方的状态说明。</td></tr>
      <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>尺寸。</td></tr>
      <tr><td><code>emptyText</code></td><td><code>string</code></td><td>内置空状态文案</td><td>没有结果时的文字。</td></tr>
      <tr><td><code>name</code></td><td><code>string</code></td><td>—</td><td>表单字段名。提交选中条目的 id。</td></tr>
    </tbody>
  </table>
</div>

## Typeahead Emits

<div class="component-api-table" role="region" aria-label="Typeahead Emits" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>载荷</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>update:modelValue</code></td><td><code>value: T | null</code></td><td>选中或清除时触发。</td></tr>
      <tr><td><code>change</code></td><td><code>value: T | null</code></td><td>选中或清除时触发。</td></tr>
      <tr><td><code>search</code></td><td><code>query: string</code></td><td>查询文字变化时触发。</td></tr>
      <tr><td><code>openChange</code></td><td><code>isOpen: boolean</code></td><td>列表打开或关闭时触发。</td></tr>
    </tbody>
  </table>
</div>

## Typeahead Slots

<div class="component-api-table" role="region" aria-label="Typeahead Slots" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>参数</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>icon</code></td><td>—</td><td>输入框开头的图标。</td></tr>
      <tr><td><code>item</code></td><td><code>{ item, isActive, isSelected }</code></td><td>自定义下拉条目。</td></tr>
      <tr><td><code>empty</code></td><td>—</td><td>自定义空状态。</td></tr>
    </tbody>
  </table>
</div>

## createStaticSource

<div class="component-api-table" role="region" aria-label="createStaticSource" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>类型</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>items</code></td><td><code>T[]</code></td><td>本地条目。</td></tr>
      <tr><td><code>keywords</code></td><td><code>(item: T) =&gt; string[]</code></td><td>除 label 之外还参与子串匹配的词。</td></tr>
    </tbody>
  </table>
</div>

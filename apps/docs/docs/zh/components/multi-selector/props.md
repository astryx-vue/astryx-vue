---
layout: component-docs
title: 多选器
outline: false
footer: false
---

## MultiSelector Props

<div class="component-api-table" role="region" aria-label="MultiSelector Props" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>modelValue</code></td><td><code>(string | number)[]</code></td><td><code>[]</code></td><td>已选值。</td></tr>
      <tr><td><code>options</code></td><td><code>MultiSelectorOption[]</code></td><td>必需</td><td>字符串、选项对象、分隔线或分组。</td></tr>
      <tr><td><code>label</code></td><td><code>string</code></td><td>必需</td><td>字段标签。</td></tr>
      <tr><td><code>placeholder</code></td><td><code>string</code></td><td><code>Select…</code> / <code>请选择</code></td><td>没有选中项时的占位符。</td></tr>
      <tr><td><code>searchable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>在列表里显示搜索框。</td></tr>
      <tr><td><code>selectAll</code></td><td><code>boolean</code></td><td><code>false</code></td><td>显示全选行。跳过禁用项。</td></tr>
      <tr><td><code>triggerDisplay</code></td><td><code>'count' | 'labels' | 'badges'</code></td><td><code>'count'</code></td><td>关闭后如何展示已选项。</td></tr>
      <tr><td><code>maxBadges</code></td><td><code>number</code></td><td><code>3</code></td><td><code>badges</code> 和 <code>labels</code> 最多露出几项，更窄时还会按宽度再收。</td></tr>
      <tr><td><code>clearable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>是否可清除。</td></tr>
      <tr><td><code>checkboxPosition</code></td><td><code>'start' | 'end'</code></td><td><code>'start'</code></td><td>勾选标记的位置。</td></tr>
      <tr><td><code>variant</code></td><td><code>'input' | 'ghost'</code></td><td><code>'input'</code></td><td><code>input</code> 带边框，<code>ghost</code> 适合工具栏。</td></tr>
      <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>是否禁用。</td></tr>
      <tr><td><code>disabledReason</code></td><td><code>string</code></td><td>—</td><td>禁用原因。有值时控件仍可聚焦。</td></tr>
      <tr><td><code>status</code></td><td><code>'default' | 'success' | 'warning' | 'error'</code></td><td><code>'default'</code></td><td>状态样式。</td></tr>
      <tr><td><code>statusMessage</code></td><td><code>string</code></td><td>—</td><td>字段下方的状态说明。</td></tr>
      <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>尺寸。</td></tr>
      <tr><td><code>name</code></td><td><code>string</code></td><td>—</td><td>表单字段名。每个已选值提交一次。</td></tr>
    </tbody>
  </table>
</div>

## MultiSelector Emits

<div class="component-api-table" role="region" aria-label="MultiSelector Emits" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>载荷</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>update:modelValue</code></td><td><code>value: (string | number)[]</code></td><td>选中项变化时触发。</td></tr>
      <tr><td><code>change</code></td><td><code>value: (string | number)[]</code></td><td>选中项变化时触发。</td></tr>
      <tr><td><code>search</code></td><td><code>query: string</code></td><td>搜索文字变化时触发。</td></tr>
      <tr><td><code>openChange</code></td><td><code>isOpen: boolean</code></td><td>列表打开或关闭时触发。</td></tr>
    </tbody>
  </table>
</div>

## MultiSelector Slots

<div class="component-api-table" role="region" aria-label="MultiSelector Slots" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>参数</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>icon</code></td><td>—</td><td>触发器开头的图标。</td></tr>
      <tr><td><code>option</code></td><td><code>{ option, selected, active }</code></td><td>自定义选项。</td></tr>
      <tr><td><code>empty</code></td><td>—</td><td>自定义空状态。</td></tr>
    </tbody>
  </table>
</div>

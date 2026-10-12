---
layout: component-docs
title: 折叠组
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="CollapsibleGroup Props" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr><td><code>type</code></td><td><code>'single' | 'multiple'</code></td><td><code>'single'</code></td><td><code>single</code> 同时只展开一项。<code>multiple</code> 每项各自开关。</td></tr>
      <tr><td><code>defaultValue</code></td><td><code>string | string[]</code></td><td>-</td><td>组自己管状态时，一开始展开的项。</td></tr>
      <tr><td><code>value</code></td><td><code>string | string[]</code></td><td>-</td><td>受控的展开项。用 <code>v-model:value</code> 绑定。</td></tr>
      <tr><td><code>hasDividers</code></td><td><code>boolean</code></td><td><code>false</code></td><td>在项与项之间画一条细线。</td></tr>
      <tr><td><code>density</code></td><td><code>'compact' | 'balanced' | 'spacious'</code></td><td>有分隔线时为 <code>'balanced'</code></td><td>触发器和内容的内边距。</td></tr>
    </tbody>
  </table>
</div>

## 事件

<div class="component-api-table" role="region" aria-label="CollapsibleGroup Events" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>参数</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr><td><code>update:value</code></td><td><code>string | string[]</code></td><td>下一次展开的值。单选模式全部收起时是 <code>''</code>。</td></tr>
      <tr><td><code>change</code></td><td><code>string | string[]</code></td><td>和 <code>update:value</code> 一起发出。</td></tr>
    </tbody>
  </table>
</div>

## 插槽

默认插槽是 `Collapsible`。每一项都要有 `value`。

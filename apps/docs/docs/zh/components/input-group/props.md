---
layout: component-docs
title: 输入框组
outline: false
footer: false
---

## InputGroup Props

<div class="component-api-table" role="region" aria-label="InputGroup Props" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>整组的尺寸，会传给组内控件。</td></tr>
      <tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>整组的无障碍名称。写上之后带上标签、说明、可选或必填，以及状态。</td></tr>
      <tr><td><code>isLabelHidden</code></td><td><code>boolean</code></td><td><code>false</code></td><td>视觉上隐藏标签，读屏仍能读到。</td></tr>
      <tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>标签和控件之间的说明。</td></tr>
      <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>是否禁用整组，并传给组内选择器。</td></tr>
      <tr><td><code>isOptional</code></td><td><code>boolean</code></td><td><code>false</code></td><td>在标签旁标成可选。</td></tr>
      <tr><td><code>isRequired</code></td><td><code>boolean</code></td><td><code>false</code></td><td>在标签旁标成必填。</td></tr>
      <tr><td><code>status</code></td><td><code>FieldStatusInput</code></td><td>—</td><td>整组边框和控件下方的状态。</td></tr>
      <tr><td><code>labelTooltip</code></td><td><code>string</code></td><td>—</td><td>标签末尾的提示。</td></tr>
    </tbody>
  </table>
</div>

## InputGroup 插槽

<div class="component-api-table" role="region" aria-label="InputGroup 插槽" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>default</code></td><td>中间的输入控件。</td></tr>
      <tr><td><code>before</code></td><td>输入框前面的文字、图标或按钮。</td></tr>
      <tr><td><code>after</code></td><td>输入框后面的文字、图标或按钮。</td></tr>
    </tbody>
  </table>
</div>

## InputGroupText

前后缀里的固定文字。没有自己的属性，内容写在默认插槽里。

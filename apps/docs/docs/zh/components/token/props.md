---
layout: component-docs
title: 标签
outline: false
footer: false
---

## Token Props

<div class="component-api-table" role="region" aria-label="Token Props" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>label</code></td><td><code>string</code></td><td>必需</td><td>标签文字，也是无障碍名称。</td></tr>
      <tr><td><code>color</code></td><td><code>'default' | 'gray' | 'blue' | 'cyan' | 'teal' | 'green' | 'yellow' | 'orange' | 'red' | 'pink' | 'purple'</code></td><td><code>'default'</code></td><td>颜色。</td></tr>
      <tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td><code>'md'</code></td><td>尺寸。</td></tr>
      <tr><td><code>removable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>显示可聚焦的删除按钮。</td></tr>
      <tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>禁用。删除按钮不再响应。</td></tr>
      <tr><td><code>href</code></td><td><code>string</code></td><td>—</td><td>有值时渲染成链接。和删除按钮同时存在时，链接和按钮是兄弟节点。</td></tr>
      <tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>补充说明，读屏可读。</td></tr>
      <tr><td><code>labelHidden</code></td><td><code>boolean</code></td><td><code>false</code></td><td>视觉上隐藏文字，仍然作为无障碍名称。</td></tr>
    </tbody>
  </table>
</div>

## Token Emits

<div class="component-api-table" role="region" aria-label="Token Emits" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>载荷</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>remove</code></td><td><code>event: Event</code></td><td>点击删除按钮，或在标签上按 Backspace / Delete。</td></tr>
    </tbody>
  </table>
</div>

## Token Slots

<div class="component-api-table" role="region" aria-label="Token Slots" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>参数</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>icon</code></td><td>—</td><td>文字前面的图标。</td></tr>
      <tr><td><code>end</code></td><td>—</td><td>文字后面、删除按钮前面的内容。</td></tr>
    </tbody>
  </table>
</div>

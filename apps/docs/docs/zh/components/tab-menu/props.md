---
layout: component-docs
title: 标签菜单
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="TabMenu Props" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr><td><code>label</code></td><td><code>string</code></td><td>-</td><td>没有选项被选中时的触发器文字，也是菜单的无障碍名称。</td></tr>
      <tr><td><code>options</code></td><td><code>TabMenuOption[]</code></td><td>-</td><td>收在触发器后面的标签。</td></tr>
    </tbody>
  </table>
</div>

## TabMenuOption

<div class="component-api-table" role="region" aria-label="TabMenuOption" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr><td><code>value</code></td><td><code>string</code></td><td>交给父级 <code>TabList</code> 的标签值。</td></tr>
      <tr><td><code>label</code></td><td><code>string</code></td><td>菜单项文字。这个选项被选中时，它会替换触发器文字。</td></tr>
      <tr><td><code>iconClass</code></td><td><code>string</code></td><td>CSS 图标类，例如 <code>i-carbon-settings</code>。</td></tr>
    </tbody>
  </table>
</div>

选中状态走父级列表的 <code>v-model:value</code>。菜单自己不发 change 事件。

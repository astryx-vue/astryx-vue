---
layout: component-docs
title: 移动端导航
outline: false
footer: false
---

## MobileNav Props

<div class="component-api-table" role="region" aria-label="MobileNav Props" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>isOpen</code></td><td><code>boolean</code></td><td><code>false</code></td><td>打开状态，配合 <code>v-model:is-open</code>。</td></tr>
      <tr><td><code>header</code></td><td><code>string</code></td><td>-</td><td>抽屉标题。也可以用 <code>header</code> 插槽。</td></tr>
      <tr><td><code>width</code></td><td><code>number</code></td><td><code>320</code></td><td>抽屉宽度，单位像素。</td></tr>
      <tr><td><code>side</code></td><td><code>'start' | 'end' | 'auto'</code></td><td><code>'auto'</code></td><td>从哪一侧滑入。</td></tr>
      <tr><td><code>label</code></td><td><code>string</code></td><td>标题或当前语言的「导航」</td><td>没有标题时作为对话框的无障碍名称。</td></tr>
    </tbody>
  </table>
</div>

## MobileNav 事件

<div class="component-api-table" role="region" aria-label="MobileNav 事件" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>update:isOpen</code></td><td>打开状态变化，用于 <code>v-model:is-open</code>。</td></tr>
      <tr><td><code>openChange</code></td><td>打开状态变化时触发。</td></tr>
    </tbody>
  </table>
</div>

## MobileNavToggle Props

<div class="component-api-table" role="region" aria-label="MobileNavToggle Props" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>isOpen</code></td><td><code>boolean</code></td><td><code>false</code></td><td>和抽屉绑同一个 <code>v-model:is-open</code>。</td></tr>
      <tr><td><code>label</code></td><td><code>string</code></td><td>打开时「关闭」，关闭时「打开菜单」</td><td>按钮的无障碍名称。</td></tr>
      <tr><td><code>controls</code></td><td><code>string</code></td><td>-</td><td>对应抽屉的 id，写到 <code>aria-controls</code>。</td></tr>
    </tbody>
  </table>
</div>

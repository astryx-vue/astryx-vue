---
layout: component-docs
title: 移动端导航开关
outline: false
footer: false
---

## MobileNavToggle 属性

<div class="component-api-table" role="region" aria-label="MobileNavToggle 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>isOpen</code></td><td><code>boolean</code></td><td><code>false</code></td><td>抽屉的展开状态，配合 <code>v-model:is-open</code> 使用。图标和 <code>aria-expanded</code> 都跟着它变。</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>按钮的无障碍名称，写到 <code>aria-label</code> 上。不传时用文案表里的默认值：打开时是「打开菜单」，抽屉已打开时是「关闭」。</td></tr>
<tr><td><code>controls</code></td><td><code>string</code></td><td>—</td><td>抽屉的 id，写到 <code>aria-controls</code> 上。</td></tr>
</tbody></table>
</div>

## 事件

<div class="component-api-table" role="region" aria-label="MobileNavToggle 事件" tabindex="0">
<table><thead><tr><th>名称</th><th>载荷</th><th>说明</th></tr></thead><tbody>
<tr><td><code>update:isOpen</code></td><td><code>boolean</code></td><td>按钮被按下，驱动 <code>v-model:is-open</code>。</td></tr>
</tbody></table>
</div>

## 插槽

`MobileNavToggle` 没有插槽。它画的是内置的菜单图标，里面没有地方放别的东西。

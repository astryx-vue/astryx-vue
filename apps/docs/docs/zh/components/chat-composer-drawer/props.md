---
layout: component-docs
title: 对话输入抽屉
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="ChatComposerDrawer 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>count</code></td><td><code>number</code></td><td>—</td><td>条目数量。传了它才出现收起开关，收起后也用它显示总数。不传，抽屉就一直展开。</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>本地化的“Items”</td><td>收起后那行摘要用的名字，也是展开和收起两个无障碍名字里的一部分。</td></tr>
<tr><td><code>v-model:is-collapsed</code></td><td><code>boolean</code></td><td>—</td><td>受控的收起状态。绑上以后抽屉完全按这个值显示，开关只是提出变更请求。</td></tr>
<tr><td><code>defaultIsCollapsed</code></td><td><code>boolean</code></td><td><code>false</code></td><td>没绑 <code>isCollapsed</code> 时，初始是不是收起的。</td></tr>
</tbody></table>
</div>

## 事件

<div class="component-api-table" role="region" aria-label="ChatComposerDrawer 事件" tabindex="0">
<table><thead><tr><th>事件</th><th>参数</th><th>说明</th></tr></thead><tbody>
<tr><td><code>collapsedChange</code></td><td><code>boolean</code></td><td>开关希望你切换到的收起状态。<code>v-model:is-collapsed</code> 绑的就是它。</td></tr>
</tbody></table>
</div>

## 插槽

<div class="component-api-table" role="region" aria-label="ChatComposerDrawer 插槽" tabindex="0">
<table><thead><tr><th>插槽</th><th>说明</th></tr></thead><tbody>
<tr><td>（默认）</td><td>补充内容：附件标签、缩略图、提问等。排成会自动换行的一行。</td></tr>
<tr><td><code>collapsedSummary</code></td><td>换掉收起时显示的总数徽标和那行文字。展开收起的无障碍名字仍归开关管。</td></tr>
</tbody></table>
</div>

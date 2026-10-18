---
layout: component-docs
title: 底部弹窗切换器
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="BottomSheetSwitcher 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>activeSheet</code></td><td><code>string | null</code></td><td><code>null</code></td><td>用 <code>v-model:active-sheet</code> 绑定。值是当前要显示那一步的 <code>sheet-id</code>；绑成 <code>null</code> 就整段关掉。</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>整段流程的读屏名称。不传就用当前那张面板自己的 <code>label</code>，都没有时用 <code>Bottom sheet</code>。</td></tr>
<tr><td><code>purpose</code></td><td><code>'info' | 'form' | 'required'</code></td><td>跟当前面板的 <code>purpose</code></td><td>整段流程怎么被关掉。<code>info</code> 允许 Escape、点遮罩和下滑；<code>form</code> 只允许 Escape；<code>required</code> 堵住所有隐式关闭。</td></tr>
<tr><td><code>hasScrim</code></td><td><code>boolean</code></td><td><code>true</code></td><td>整段流程共用一层遮罩。换页时它一直留着，只有整段关掉才消失。关掉它，背后页面仍然可以滚动和点击。</td></tr>
</tbody></table>
</div>

## 事件

- `update:activeSheet(value: string | null)`：切换器想切到哪一步就发哪个 `sheet-id`，想关掉时发 `null`。这就是 `v-model:active-sheet` 的绑定。
- `cancel(event: Event)`：对话框收到原生 cancel 请求时先发这个事件。在事件上调用 `event.preventDefault()` 可以留住这段流程，不让它关掉。

## 插槽

- `default`：放各个 `BottomSheet` 步骤。每一张都要有自己不重复的 `sheet-id` 和自己的 `label`。

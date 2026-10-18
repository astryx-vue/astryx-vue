---
layout: component-docs
title: 侧边导航收起按钮
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="SideNavCollapseButton 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>按钮文字。传了就把只有图标的方块变成带文字的按钮，文字在箭头前面。不传时，读屏读到的名字跟着状态走：展开侧栏或收起侧栏。</td></tr>
<tr><td><code>isCollapsed</code></td><td><code>boolean</code></td><td>—</td><td>受控的收起状态，给放在 <code>SideNav</code> 外面的按钮用。用 <code>v-model:is-collapsed</code> 绑上，并给侧栏同一个值，两边才不会打架。</td></tr>
<tr><td><code>size</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td>在 <code>SideNav</code> 里是 <code>'sm'</code>，外面是 <code>'md'</code></td><td>按钮大小。默认跟着容器走。</td></tr>
</tbody></table>
</div>

## 事件

- `update:isCollapsed(isCollapsed: boolean)`：绑了 `isCollapsed` 时，点按钮触发。在 `SideNav` 里面时，点击交给侧栏自己的开关处理。

## 插槽

- `default`：替换箭头和文字。想换图标或者换个排法就写这里。

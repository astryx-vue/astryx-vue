---
layout: component-docs
title: 标签
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="Tab 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>value</code></td><td><code>string</code></td><td>—</td><td>这个标签的唯一标识。外面的 <code>TabList</code> 拿自己的 <code>value</code> 和它比，决定谁被选中。必填。</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>显示的文字。默认插槽和它同时写时插槽优先，这时它就成了文字藏起来后的读屏名。</td></tr>
<tr><td><code>panelId</code></td><td><code>string</code></td><td>—</td><td>这个标签管着的那块内容面板的 id，写进 <code>aria-controls</code>。只有外层是 <code>role="tablist"</code> 时才用得上。</td></tr>
<tr><td><code>disabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>禁用这个标签。键盘导航会自动跳过。</td></tr>
<tr><td><code>href</code></td><td><code>string</code></td><td>—</td><td>要跳去的地址。不是标签页模式时，标签渲染成链接；外层是 <code>role="tablist"</code> 时这个属性不起作用。</td></tr>
<tr><td><code>as</code></td><td><code>NavLinkComponent</code></td><td><code>'a'</code></td><td>链接换成别的根组件时用，例如路由链接。只有写了 <code>href</code> 且外层不是 tablist 才用到。</td></tr>
<tr><td><code>isLabelHidden</code></td><td><code>boolean</code></td><td><code>false</code></td><td>视觉上藏起文字，只留图标和末尾内容。这时文字改用 <code>label</code> 当读屏名。</td></tr>
</tbody></table>
</div>

## 插槽

- `default`：标签文字。不写就用 `label` 属性。
- `icon`：没选中时显示的图标。
- `selectedIcon`：选中时显示的图标，不写就用 `icon`。
- `endContent`：文字后面的内容，例如徽标里的数字或状态点。

---
layout: component-docs
title: 步骤
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="Step 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>step</code></td><td><code>number</code></td><td>—</td><td>这一步的序号，从 0 开始。和步骤条的 <code>activeStep</code> 一比就得出进度。必填。</td></tr>
<tr><td><code>label</code></td><td><code>string</code></td><td>—</td><td>步骤名称。必填。</td></tr>
<tr><td><code>description</code></td><td><code>string</code></td><td>—</td><td>名称下面的说明。</td></tr>
<tr><td><code>status</code></td><td><code>'accent' | 'success' | 'warning' | 'error'</code></td><td>—</td><td>只给指示器换色。连接线仍按进度着色。</td></tr>
<tr><td><code>isDisabled</code></td><td><code>boolean</code></td><td><code>false</code></td><td>能不能跳过这一步。文字会变淡，步骤条的前后按钮也会越过它。</td></tr>
<tr><td><code>isOptional</code></td><td><code>boolean</code></td><td><code>false</code></td><td>在名称后面标出可选。</td></tr>
<tr><td><code>indicator</code></td><td><code>'auto' | 'number' | 'none'</code></td><td><code>'auto'</code></td><td><code>auto</code> 完成时显示勾，进行中显示圆环，之后显示序号。<code>number</code> 始终显示序号。<code>none</code> 什么都不显示。</td></tr>
<tr><td><code>density</code></td><td><code>'compact' | 'balanced' | 'spacious'</code></td><td>跟随步骤条</td><td>这一步周围的间距。</td></tr>
</tbody></table>
</div>

## 插槽

- `default`：说明下面的内容。垂直且进度条分开时，它在可点击的那一行外面。
- `icon`：替换指示器里的图形。放一个 `Spinner` 它就活了。
- `end`：名称这一行末尾的内容，例如预计用时。

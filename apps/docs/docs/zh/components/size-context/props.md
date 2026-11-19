---
layout: component-docs
title: 尺寸 Context
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="SizeProvider 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>value</code></td><td><code>'sm' | 'md' | 'lg' | null</code></td><td><code>null</code></td><td>往下提供的默认尺寸。<code>null</code> 表示不提供，子组件走自己的默认值。</td></tr>
</tbody></table>
</div>

## 插槽

<div class="component-api-table" role="region" aria-label="SizeProvider 插槽" tabindex="0">
<table><thead><tr><th>插槽</th><th>说明</th></tr></thead><tbody>
<tr><td><code>default</code></td><td>会读到这份默认尺寸的子树。</td></tr>
</tbody></table>
</div>

## 其它导出

<div class="component-api-table" role="region" aria-label="SizeContext 导出" tabindex="0">
<table><thead><tr><th>导出</th><th>类型</th><th>说明</th></tr></thead><tbody>
<tr><td><code>useSize</code></td><td><code>(sizeProp, default = 'md') =&gt; ComputedRef</code></td><td>解析最终尺寸：显式 prop &gt; 外层 context &gt; 默认值。</td></tr>
<tr><td><code>provideSize</code></td><td><code>(size) =&gt; void</code></td><td>在 <code>setup</code> 里往下提供尺寸，容器组件内部用。</td></tr>
<tr><td><code>SizeContext</code></td><td>injection key</td><td>底层的 context key。</td></tr>
<tr><td><code>ElementSize</code></td><td><code>'sm' | 'md' | 'lg'</code></td><td>尺寸的类型。</td></tr>
</tbody></table>
</div>

## 原生属性

组件本身不渲染元素，<code>class</code> 和 <code>style</code> 不会传下去。

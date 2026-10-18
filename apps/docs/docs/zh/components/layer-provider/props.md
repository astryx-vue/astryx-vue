---
layout: component-docs
title: 浮层 Provider
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="LayerProvider 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>toast</code></td><td><code>LayerToastConfig</code></td><td>—</td><td>toast 视口的配置：<code>position</code> 贴哪个角、<code>maxVisible</code> 最多显示几条，还有一个只对 toast 生效的 <code>inset</code>，会逐边盖掉 provider 上的同一条边。</td></tr>
<tr><td><code>inset</code></td><td><code>LayerInset</code></td><td>每条边 <code>0</code></td><td>浮在视口某条边上的常驻条，声明一次就够：<code>blockStart</code>、<code>blockEnd</code>、<code>inlineStart</code>、<code>inlineEnd</code>，写数字就是像素，也可以写 CSS 长度。每条边会加到所有贴边浮层离那条边的空隙上，toast 视口也按同样的量挪进去。</td></tr>
</tbody></table>
</div>

## 插槽

<div class="component-api-table" role="region" aria-label="LayerProvider 插槽" tabindex="0">
<table><thead><tr><th>插槽</th><th>说明</th></tr></thead><tbody>
<tr><td><code>default</code></td><td>应用子树，可以读取这份共享的浮层配置。</td></tr>
</tbody></table>
</div>

## LayerToastConfig

<div class="component-api-table" role="region" aria-label="LayerToastConfig 字段" tabindex="0">
<table><thead><tr><th>字段</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>position</code></td><td><code>ToastPlacement</code></td><td><code>'bottom-center'</code></td><td>toast 视口贴在哪个角：<code>top-start</code>、<code>top-center</code>、<code>top-end</code>、<code>bottom-start</code>、<code>bottom-center</code>、<code>bottom-end</code>。直接写在 <code>ToastViewport</code> 上的 <code>placement</code> 优先。</td></tr>
<tr><td><code>maxVisible</code></td><td><code>number</code></td><td>不限制</td><td>同时最多显示几条。超出的先不渲染，只留最新的那几条。</td></tr>
<tr><td><code>inset</code></td><td><code>LayerInset</code></td><td>—</td><td>只对 toast 视口生效的逐边偏移。这条边写了就用它，没写的边继续用 provider 的 <code>inset</code>。</td></tr>
</tbody></table>
</div>

## LayerInset

<div class="component-api-table" role="region" aria-label="LayerInset 字段" tabindex="0">
<table><thead><tr><th>字段</th><th>类型</th><th>说明</th></tr></thead><tbody>
<tr><td><code>blockStart</code></td><td><code>number | string</code></td><td>加在顶部空隙上的偏移。数字按像素算，字符串可以是任意 CSS 长度，例如 <code>'4rem'</code> 或 <code>'env(safe-area-inset-top, 0px)'</code>。</td></tr>
<tr><td><code>blockEnd</code></td><td><code>number | string</code></td><td>同上，底部那条边。</td></tr>
<tr><td><code>inlineStart</code></td><td><code>number | string</code></td><td>同上，行首那条边。</td></tr>
<tr><td><code>inlineEnd</code></td><td><code>number | string</code></td><td>同上，行尾那条边。</td></tr>
</tbody></table>
</div>

## 其它导出

<div class="component-api-table" role="region" aria-label="LayerProvider 导出" tabindex="0">
<table><thead><tr><th>导出</th><th>类型</th><th>说明</th></tr></thead><tbody>
<tr><td><code>useLayerConfig</code></td><td><code>() =&gt; ComputedRef&lt;LayerContextValue&gt; | null</code></td><td>读最近一层 provider 的配置，外层没有就是 <code>null</code>。</td></tr>
<tr><td><code>useLayerGutter</code></td><td><code>() =&gt; ComputedRef&lt;LayerGutter&gt;</code></td><td>贴边浮层离视口每条边的距离：间距第 4 档和设备安全区取大，再加上 provider 的偏移。</td></tr>
<tr><td><code>resolveInset</code></td><td><code>(inset?: LayerInset) =&gt; ResolvedLayerInset</code></td><td>把一份 inset 换算成像素。</td></tr>
<tr><td><code>mergeInset</code></td><td><code>(primary?: LayerInset, fallback?: LayerInset) =&gt; ResolvedLayerInset</code></td><td>逐边合并两份 inset：<code>primary</code> 写了的边用它，剩下的从 <code>fallback</code> 来。</td></tr>
</tbody></table>
</div>

## 原生属性

组件本身不渲染元素，<code>class</code> 和 <code>style</code> 不会传下去。

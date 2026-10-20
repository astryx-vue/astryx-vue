---
layout: component-docs
title: 滚动条 Provider
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="ScrollbarsProvider 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>enabled</code></td><td><code>boolean</code></td><td><code>true</code></td><td>子树里要不要用自绘滚动条。设为 <code>false</code> 时子树不初始化，已经挂上的会被销毁。嵌套时内层覆盖外层。</td></tr>
<tr><td><code>autoHide</code></td><td><code>'never' | 'scroll' | 'leave' | 'move'</code></td><td><code>'scroll'</code></td><td>滚动条自动收起的时机。<code>never</code> 一直显示，<code>scroll</code> 滚动时显示，<code>leave</code> 指针离开后收起，<code>move</code> 指针移动时显示。</td></tr>
<tr><td><code>autoHideDelay</code></td><td><code>number</code></td><td><code>800</code></td><td>自动收起前等待的毫秒数。</td></tr>
<tr><td><code>options</code></td><td><code>ScrollbarsOptions</code></td><td>—</td><td>透传给 OverlayScrollbars 的选项（<code>PartialOptions</code>）。最后深合并，优先级最高。</td></tr>
</tbody></table>
</div>

## 插槽

<div class="component-api-table" role="region" aria-label="ScrollbarsProvider 插槽" tabindex="0">
<table><thead><tr><th>插槽</th><th>说明</th></tr></thead><tbody>
<tr><td><code>default</code></td><td>使用自绘滚动条的子树。</td></tr>
</tbody></table>
</div>

## 其它导出

<div class="component-api-table" role="region" aria-label="ScrollbarsProvider 导出" tabindex="0">
<table><thead><tr><th>导出</th><th>类型</th><th>说明</th></tr></thead><tbody>
<tr><td><code>useScrollbars</code></td><td><code>(target: MaybeRefOrGetter&lt;HTMLElement | null | undefined&gt;, options?: UseScrollbarsOptions) =&gt; UseScrollbarsResult</code></td><td>给自己写的滚动容器挂上自绘滚动条。外层没有 <code>ScrollbarsProvider</code> 时什么都不做。容器自己就是视口，子节点不动。要在 Provider 的后代组件里调用。</td></tr>
<tr><td><code>UseScrollbarsOptions</code></td><td><code>{ enabled?: MaybeRefOrGetter&lt;boolean&gt; }</code></td><td><code>useScrollbars</code> 的第二个参数。<code>enabled</code> 默认 <code>true</code>，控制这个容器自己要不要用。外层 Provider 关闭时，写 <code>true</code> 也不生效。</td></tr>
<tr><td><code>UseScrollbarsResult</code></td><td><code>{ active: Readonly&lt;Ref&lt;boolean&gt;&gt; }</code></td><td><code>active</code> 表示当前元素上是否已经挂上自绘滚动条。</td></tr>
<tr><td><code>ScrollbarsProviderProps</code></td><td>类型</td><td>上面属性表对应的类型。</td></tr>
<tr><td><code>ScrollbarsProviderSlots</code></td><td>类型</td><td>上面插槽表对应的类型。</td></tr>
<tr><td><code>ScrollbarsOptions</code></td><td><code>PartialOptions</code></td><td>OverlayScrollbars 的选项类型，<code>options</code> 属性用它。</td></tr>
<tr><td><code>ScrollbarsAutoHide</code></td><td><code>'never' | 'scroll' | 'leave' | 'move'</code></td><td><code>autoHide</code> 的取值类型。</td></tr>
<tr><td><code>ScrollbarsContext</code></td><td>类型</td><td>Provider 向子树提供的内容：<code>enabled</code>、合并后的 <code>options</code>，以及 <code>mount</code>。</td></tr>
<tr><td><code>ScrollbarsHandle</code></td><td><code>{ update, destroy }</code></td><td><code>mount</code> 返回的句柄，用来更新选项或销毁滚动条。</td></tr>
<tr><td><code>scrollbarsKey</code></td><td><code>InjectionKey&lt;ScrollbarsContext&gt;</code></td><td>Provider 用的注入 key。</td></tr>
</tbody></table>
</div>

## 外观变量

<div class="component-api-table" role="region" aria-label="滚动条 CSS 变量" tabindex="0">
<table><thead><tr><th>变量</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>--astryx-scrollbar-size</code></td><td><code>10px</code></td><td>滚动条粗细。</td></tr>
<tr><td><code>--astryx-scrollbar-thumb</code></td><td>次要文字色 45%</td><td>滑块颜色。</td></tr>
<tr><td><code>--astryx-scrollbar-thumb-hover</code></td><td>次要文字色 70%</td><td>悬停和拖动时的滑块颜色。</td></tr>
<tr><td><code>--astryx-scrollbar-track</code></td><td><code>transparent</code></td><td>轨道背景。</td></tr>
<tr><td><code>--astryx-scrollbar-radius</code></td><td><code>9999px</code></td><td>轨道和滑块圆角。</td></tr>
</tbody></table>
</div>

## 原生属性

组件本身不渲染元素，<code>class</code> 和 <code>style</code> 不会传下去。

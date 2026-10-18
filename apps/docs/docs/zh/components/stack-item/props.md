---
layout: component-docs
title: 堆叠项
outline: false
footer: false
---

## 属性

<div class="component-api-table" role="region" aria-label="StackItem 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>as</code></td><td><code>string | Component</code></td><td><code>'div'</code></td><td>根元素或者根组件。</td></tr>
<tr><td><code>crossAlignSelf</code></td><td><code>StackCrossAlignment</code></td><td>—</td><td>只改这一项在交叉轴上的对齐，盖掉父级堆叠的设置：<code>start</code>、<code>center</code>、<code>end</code>、<code>stretch</code>。</td></tr>
<tr><td><code>isScrollable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>内容超出时允许滚动。这层包装已经把 flex 的最小尺寸清掉了，所以 <code>size="fill"</code> 配上 <code>isScrollable</code> 就是一块完整的滚动区域。</td></tr>
<tr><td><code>size</code></td><td><code>'static' | 'fill'</code></td><td><code>'static'</code></td><td><code>static</code> 保持本来该多大；<code>fill</code> 把其他项剩下的空间占满。</td></tr>
</tbody></table>
</div>

`StackCrossAlignment` 可以取这些值：

```ts
type StackCrossAlignment = 'start' | 'center' | 'end' | 'stretch'
```

## 插槽

- `default`：这一项的内容。

## 原生属性

根元素会接收 HTML 属性、`aria-*` 属性、`data-*` 属性、`class` 和 `style`。`class` 会和组件自己的类合并。

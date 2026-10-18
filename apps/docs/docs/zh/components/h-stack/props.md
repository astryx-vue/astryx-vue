---
layout: component-docs
title: 水平堆叠
outline: false
footer: false
---

## 属性

`HStack` 支持 `Stack` 的全部属性，只有 `direction` 不开放，它固定是 `horizontal`。

<div class="component-api-table" role="region" aria-label="HStack 属性" tabindex="0">
<table><thead><tr><th>属性</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead><tbody>
<tr><td><code>align</code></td><td><code>StackCrossAlignment</code></td><td>—</td><td>纵向对齐的简写，属性和 <code>Stack</code> 上读起来一样。效果同 <code>vAlign</code>。</td></tr>
<tr><td><code>as</code></td><td><code>string | Component</code></td><td><code>'div'</code></td><td>根元素或者根组件。</td></tr>
<tr><td><code>gap</code></td><td><code>SpacingStep</code></td><td>—</td><td>相邻子项之间的间距，取间距刻度。</td></tr>
<tr><td><code>height</code></td><td><code>number | string</code></td><td>—</td><td>这一行的高度。写数字按像素，写字符串原样使用。</td></tr>
<tr><td><code>hAlign</code></td><td><code>StackMainAlignment</code></td><td>—</td><td>子项在横向主轴上的位置：<code>start</code>、<code>center</code>、<code>end</code>、<code>between</code>、<code>around</code>、<code>evenly</code>。</td></tr>
<tr><td><code>isScrollable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>内容超出时允许滚动。</td></tr>
<tr><td><code>justify</code></td><td><code>StackMainAlignment</code></td><td>—</td><td>主轴对齐的另一个名字，对应 CSS 的 <code>justify-content</code>。</td></tr>
<tr><td><code>maxWidth</code></td><td><code>number | string</code></td><td>—</td><td>这一行的最大宽度。</td></tr>
<tr><td><code>minHeight</code></td><td><code>number | string</code></td><td>—</td><td>这一行的最小高度。</td></tr>
<tr><td><code>padding</code></td><td><code>SpacingStep</code></td><td>—</td><td>四周内边距，取间距刻度。</td></tr>
<tr><td><code>paddingBlock</code></td><td><code>SpacingStep</code></td><td>—</td><td>纵向内边距，会盖掉这一条轴上的 <code>padding</code>。</td></tr>
<tr><td><code>paddingBlockEnd</code></td><td><code>SpacingStep</code></td><td>—</td><td>只改下边内边距，会盖掉 <code>paddingBlock</code> 和 <code>padding</code> 在这一条边上的值。</td></tr>
<tr><td><code>paddingBlockStart</code></td><td><code>SpacingStep</code></td><td>—</td><td>只改上边内边距，会盖掉 <code>paddingBlock</code> 和 <code>padding</code> 在这一条边上的值。</td></tr>
<tr><td><code>paddingInline</code></td><td><code>SpacingStep</code></td><td>—</td><td>横向内边距，会盖掉这一条轴上的 <code>padding</code>。</td></tr>
<tr><td><code>paddingInlineEnd</code></td><td><code>SpacingStep</code></td><td>—</td><td>只改行内结束边（从左往右时是右边）的内边距，会盖掉 <code>paddingInline</code> 和 <code>padding</code> 在这一条边上的值。</td></tr>
<tr><td><code>paddingInlineStart</code></td><td><code>SpacingStep</code></td><td>—</td><td>只改行内起始边（从左往右时是左边）的内边距，会盖掉 <code>paddingInline</code> 和 <code>padding</code> 在这一条边上的值。</td></tr>
<tr><td><code>vAlign</code></td><td><code>StackCrossAlignment</code></td><td>—</td><td>子项在纵向交叉轴上的对齐：<code>start</code>、<code>center</code>、<code>end</code>、<code>stretch</code>。</td></tr>
<tr><td><code>width</code></td><td><code>number | string</code></td><td>—</td><td>这一行的宽度。写数字按像素，写字符串原样使用。</td></tr>
<tr><td><code>wrap</code></td><td><code>StackWrap</code></td><td><code>'nowrap'</code></td><td>要不要换行：<code>nowrap</code>、<code>wrap</code> 或 <code>wrap-reverse</code>。</td></tr>
</tbody></table>
</div>

这几个辅助类型和 `Stack` 共用：

```ts
type SpacingStep = 0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10
type StackMainAlignment = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'
type StackCrossAlignment = 'start' | 'center' | 'end' | 'stretch'
type StackWrap = 'nowrap' | 'wrap' | 'wrap-reverse'
type StackSizeValue = number | string
type StackElement = Component | string
```

## 插槽

- `default`：这一行里的子项。

## 原生属性

根元素会接收 HTML 属性、`aria-*` 属性、`data-*` 属性、`class` 和 `style`。`class` 会和组件自己的类合并，`style` 会和它自己写的尺寸、间距合并。

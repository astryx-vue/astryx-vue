---
layout: component-docs
title: 堆叠布局
outline: false
footer: false
---

## Stack Props

<div class="component-api-table" role="region" aria-label="Stack Props" tabindex="0">
  <table>
    <thead>
      <tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr>
    </thead>
    <tbody>
      <tr><td><code>direction</code></td><td><code>'horizontal' | 'vertical'</code></td><td><code>'vertical'</code></td><td>内容排列方向。</td></tr>
      <tr><td><code>gap</code></td><td><code>SpacingStep</code></td><td>—</td><td>相邻子元素的间距。</td></tr>
      <tr><td><code>padding</code></td><td><code>SpacingStep</code></td><td>—</td><td>容器全部方向的内边距。</td></tr>
      <tr><td><code>paddingInline</code></td><td><code>SpacingStep</code></td><td>—</td><td>行内轴内边距。覆盖对应的 padding。</td></tr>
      <tr><td><code>paddingBlock</code></td><td><code>SpacingStep</code></td><td>—</td><td>块轴内边距。覆盖对应的 padding。</td></tr>
      <tr><td><code>paddingBlockStart</code></td><td><code>SpacingStep</code></td><td>—</td><td>块轴起始（上）内边距。只覆盖这一条边的 <code>paddingBlock</code> 和 <code>padding</code>。</td></tr>
      <tr><td><code>paddingBlockEnd</code></td><td><code>SpacingStep</code></td><td>—</td><td>块轴结束（下）内边距。只覆盖这一条边的 <code>paddingBlock</code> 和 <code>padding</code>。</td></tr>
      <tr><td><code>paddingInlineStart</code></td><td><code>SpacingStep</code></td><td>—</td><td>行内轴起始（LTR 为左）内边距。只覆盖这一条边的 <code>paddingInline</code> 和 <code>padding</code>。</td></tr>
      <tr><td><code>paddingInlineEnd</code></td><td><code>SpacingStep</code></td><td>—</td><td>行内轴结束（LTR 为右）内边距。只覆盖这一条边的 <code>paddingInline</code> 和 <code>padding</code>。</td></tr>
      <tr><td><code>hAlign</code></td><td><code>StackAlignment</code></td><td>—</td><td>根据方向控制水平主轴或交叉轴对齐。</td></tr>
      <tr><td><code>vAlign</code></td><td><code>StackAlignment</code></td><td>—</td><td>根据方向控制垂直主轴或交叉轴对齐。</td></tr>
      <tr><td><code>justify</code></td><td><code>StackMainAlignment</code></td><td>—</td><td>主轴对齐别名。</td></tr>
      <tr><td><code>align</code></td><td><code>StackCrossAlignment</code></td><td>—</td><td>交叉轴对齐别名。</td></tr>
      <tr><td><code>wrap</code></td><td><code>'nowrap' | 'wrap' | 'wrap-reverse'</code></td><td><code>'nowrap'</code></td><td>子元素换行方式。</td></tr>
      <tr><td><code>width</code></td><td><code>number | string</code></td><td>—</td><td>容器宽度。数字按像素处理。</td></tr>
      <tr><td><code>height</code></td><td><code>number | string</code></td><td>—</td><td>容器高度。数字按像素处理。</td></tr>
      <tr><td><code>maxWidth</code></td><td><code>number | string</code></td><td>—</td><td>容器最大宽度。</td></tr>
      <tr><td><code>minHeight</code></td><td><code>number | string</code></td><td>—</td><td>容器最小高度。</td></tr>
      <tr><td><code>isScrollable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>启用自动溢出滚动。</td></tr>
      <tr><td><code>as</code></td><td><code>string | Component</code></td><td><code>'div'</code></td><td>根元素或 Vue 组件。</td></tr>
    </tbody>
  </table>
</div>

`SpacingStep` 支持以下值：

```ts
type SpacingStep = 0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10
```

## HStack Props

`HStack` 固定使用水平方向。

- 组件支持 `Stack` 的通用属性。
- 组件不提供 `direction` 属性。
- 对齐规则见下表。

<div class="component-api-table" role="region" aria-label="HStack 对齐 Props" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>hAlign</code></td><td><code>StackMainAlignment</code></td><td>—</td><td>水平主轴对齐方式。</td></tr>
      <tr><td><code>vAlign</code></td><td><code>StackCrossAlignment</code></td><td><code>'stretch'</code></td><td>垂直交叉轴对齐方式。</td></tr>
    </tbody>
  </table>
</div>

## VStack Props

`VStack` 固定使用垂直方向。

- 组件支持 `Stack` 的通用属性。
- 组件不提供 `direction` 属性。
- 对齐规则见下表。

<div class="component-api-table" role="region" aria-label="VStack 对齐 Props" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>hAlign</code></td><td><code>StackCrossAlignment</code></td><td><code>'stretch'</code></td><td>水平交叉轴对齐方式。</td></tr>
      <tr><td><code>vAlign</code></td><td><code>StackMainAlignment</code></td><td>—</td><td>垂直主轴对齐方式。</td></tr>
    </tbody>
  </table>
</div>

## StackItem Props

<div class="component-api-table" role="region" aria-label="StackItem Props" tabindex="0">
  <table>
    <thead><tr><th>名称</th><th>类型</th><th>默认值</th><th>说明</th></tr></thead>
    <tbody>
      <tr><td><code>size</code></td><td><code>'static' | 'fill'</code></td><td><code>'static'</code></td><td>保持固有尺寸或填充剩余空间。</td></tr>
      <tr><td><code>crossAlignSelf</code></td><td><code>'start' | 'center' | 'end' | 'stretch'</code></td><td>—</td><td>覆盖当前项目的交叉轴对齐。</td></tr>
      <tr><td><code>isScrollable</code></td><td><code>boolean</code></td><td><code>false</code></td><td>启用自动溢出滚动。</td></tr>
      <tr><td><code>as</code></td><td><code>string | Component</code></td><td><code>'div'</code></td><td>根元素或 Vue 组件。</td></tr>
    </tbody>
  </table>
</div>

## 插槽

Stack、HStack、VStack 和 StackItem 均通过默认插槽接收内容。

## 原生属性

以下内容传入根元素：

- HTML 属性。
- `aria-*` 属性。
- `data-*` 属性。
- `class`。
- `style`。
- 原生事件监听器。
